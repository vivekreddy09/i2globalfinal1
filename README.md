# Todo App — FastAPI Backend + React (Vite) Frontend

A simple full-stack Todo application. The backend is a FastAPI service that persists todos to a JSON file; the frontend is a React app built with Vite. Both are configured to work together via a dev proxy.

## Prerequisites

- Windows with PowerShell
- Python 3.10+ (or newer)
- Node.js 18+ and npm

Verify versions:

```powershell
python --version
node --version
npm --version
```

## Project Structure

```
.
├── server/                 # FastAPI backend
│   ├── app/
│   │   ├── __init__.py     # Marks app as a Python package
│   │   ├── main.py         # FastAPI app, CORS, routers, health endpoint
│   │   ├── models.py       # Pydantic models (Todo, TodoCreate, TodoUpdate)
│   │   ├── routers/
│   │   │   └── todos.py    # /api/todos CRUD routes and toggle endpoint
│   │   └── storage.py      # JSON file persistence helpers
│   ├── data/
│   │   └── todos.json      # Persisted todos (auto-created)
│   └── requirements.txt    # Backend dependencies
└── client/                 # React frontend (Vite)
    ├── index.html          # App entry HTML
    ├── vite.config.js      # Vite dev server config + proxy to backend
    ├── package.json        # Scripts and dependencies
    └── src/
        ├── main.jsx        # React bootstrap
        ├── App.jsx         # UI + calls API helpers
        ├── api.js          # Fetch helpers hitting /api/todos
        ├── App.css, index.css
        └── assets/
```

## What Each Backend File Does

- `app/main.py`
  - Creates the FastAPI app with title/version.
  - Enables CORS for `http://localhost:5173` and `http://127.0.0.1:5173`.
  - Includes the `todos` router under prefix `/api`.
  - Exposes health endpoints at `/api/health` and `/api/health/`.
- `app/models.py`
  - `Todo`: todo item model (`id: str`, `title: str`, `completed: bool`).
  - `TodoCreate`: payload for creating todos (validates `title`).
  - `TodoUpdate`: optional fields for updating title or completed state.
- `app/routers/todos.py`
  - `GET /api/todos` and `GET /api/todos/`: list todos.
  - `GET /api/todos/{todo_id}`: get a single todo.
  - `POST /api/todos` and `POST /api/todos/`: create a todo.
  - `PUT /api/todos/{todo_id}`: update a todo.
  - `DELETE /api/todos/{todo_id}`: delete a todo.
  - `PATCH /api/todos/{todo_id}/toggle`: toggle completion.
- `app/storage.py`
  - Reads/writes `server/data/todos.json`.
  - Provides helpers to load/save todos and find by id.

## What Each Frontend File Does

- `vite.config.js`
  - Configures Vite dev server proxy: forwards `/api` to the backend.
  - Current target: `http://127.0.0.1:8001` (see run commands below).
- `src/api.js`
  - `BASE_URL = '/api/todos'` to use the proxy.
  - Provides `fetchTodos`, `createTodo`, `updateTodo`, `deleteTodo`, `toggleTodo`.
- `src/App.jsx`
  - Renders todo list UI, uses `api.js` helpers.
- `src/main.jsx`
  - Bootstraps the React app.

## Installed Packages

Backend (`server/requirements.txt`):

- `fastapi==0.115.2` — web framework
- `uvicorn[standard]==0.31.0` — ASGI server
- `pydantic==2.9.2` — data validation/models

Frontend (`client/package.json`):

- `react`, `react-dom` — UI framework
- Dev: `vite`, `@vitejs/plugin-react`, `eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `@eslint/js`, `globals`, `@types/react`, `@types/react-dom`

## Setup

### Backend

```powershell
cd server
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
```

### Frontend

```powershell
cd client
npm install
```

## Run Commands

You can run the backend on port `8000` or `8001`. The current frontend proxy points to `8001` by default for development.

### Option A: Run backend on 8001 (recommended for this setup)

From the project root, start FastAPI on `8001`:

```powershell
cd "c:\Users\kvive\Desktop\New folder (3)"
server\.venv\Scripts\python -m uvicorn app.main:app --app-dir server --reload --port 8001 --host 0.0.0.0
```

Start the frontend in another terminal:

```powershell
cd client
npm run dev
```

Open: `http://localhost:5173/`

### Option B: Run backend on 8000

Start FastAPI from the `server` folder:

```powershell
cd server
server\.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```

If you use `8000`, update the Vite proxy target in `client/vite.config.js` to `http://127.0.0.1:8000` (then restart `npm run dev`).

## Verify & Test

### Backend (PowerShell)

```powershell
# Docs (8001)
Invoke-WebRequest -Uri 'http://127.0.0.1:8001/docs' -UseBasicParsing | Select-Object -ExpandProperty StatusCode

# Health
Invoke-WebRequest -Uri 'http://127.0.0.1:8001/api/health' -UseBasicParsing | Select-Object -ExpandProperty Content

# Create a todo
Invoke-RestMethod -Uri 'http://127.0.0.1:8001/api/todos' -Method POST -ContentType 'application/json' -Body '{"title":"Test via 8001"}'

# List todos
Invoke-WebRequest -Uri 'http://127.0.0.1:8001/api/todos' -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Frontend via Vite proxy

```powershell
# Health through http://localhost:5173 (proxied)
Invoke-WebRequest -Uri 'http://localhost:5173/api/health' -UseBasicParsing | Select-Object -ExpandProperty Content

# Create through proxy
Invoke-RestMethod -Uri 'http://localhost:5173/api/todos' -Method POST -ContentType 'application/json' -Body '{"title":"Added via proxy"}'
```

### Data persistence

- Todos are saved to `server/data/todos.json`.

## Troubleshooting

- Port conflicts: if another service is using `8000`, use `8001` and keep the Vite proxy target pointing to `http://127.0.0.1:8001`.
- CORS: the backend allows `http://localhost:5173` and `http://127.0.0.1:5173`. If you change frontend URLs, update CORS in `app/main.py`.
- Trailing slashes: both `/api/todos` and `/api/todos/` are supported to avoid redirect/404 issues.

## Build & Preview (Frontend)

```powershell
cd client
npm run build
npm run preview
```

Preview will serve the built app on a local port. For production, deploy the built files and point them to a reachable backend `/api`.

## Quick Start (two terminals)

```powershell
# Terminal 1 — Backend on 8001
cd "c:\Users\kvive\Desktop\New folder (3)"
server\.venv\Scripts\python -m uvicorn app.main:app --app-dir server --reload --port 8001 --host 0.0.0.0

# Terminal 2 — Frontend
cd client
npm run dev
```

Open: `http://localhost:5173/`

## Endpoint Summary

Backend base: `http://127.0.0.1:8001/api`

- `GET /health` — health check
- `GET /todos` — list todos (supports `/todos/` trailing slash)
- `GET /todos/{todo_id}` — get todo by id
- `POST /todos` — create todo `{ title: string }` (supports `/todos/`)
- `PUT /todos/{todo_id}` — update todo `{ title?: string, completed?: boolean }`
- `DELETE /todos/{todo_id}` — delete todo
- `PATCH /todos/{todo_id}/toggle` — toggle completion

## Reset Data

- Delete the file `server/data/todos.json` to clear all todos. It is recreated automatically on next write.

## Notes on Ports and Proxy

- Frontend proxy target is set in `client/vite.config.js` under `server.proxy['/api'].target`.
- If you change backend port, update the proxy target and restart `npm run dev`.

## Why an API for this Todo App

- Separation of concerns: the React client handles UI/UX, while the FastAPI backend owns data, validation, and business logic. This keeps each part focused and easier to maintain.
- Persistence and reliability: the backend writes to `server/data/todos.json` (and could be swapped to a database later) so data survives page reloads and multiple users.
- Consistent interface: the client calls stable HTTP endpoints rather than manipulating files or in-memory state directly.
- Multi-client support: web app, mobile app, CLI, or automations can all use the same API.
- Security and validation: inputs are checked server-side; you can add auth, rate limiting, and auditing without changing the UI.
- Evolvability: you can version endpoints, change storage engines, or scale the backend independently from the frontend.
- Testability: endpoints can be unit/integration tested; client and server can be tested separately.

## What is an API (in this project)

- Definition: an Application Programming Interface is a contract that defines how software components talk to each other. Here it’s an HTTP/JSON API exposed by FastAPI.
- Endpoints: the backend exposes routes under `/api` used by the client via the Vite proxy.
  - `GET /api/health` → checks service status.
  - `GET /api/todos` → lists todos.
  - `POST /api/todos` → creates a todo with `{"title": "..."}`.
  - `GET /api/todos/{id}` → returns a single todo.
  - `PUT /api/todos/{id}` → updates fields (e.g., `{"title": "...", "completed": true}`).
  - `DELETE /api/todos/{id}` → removes a todo.
  - `PATCH /api/todos/{id}/toggle` → flips `completed`.
- How the client uses it:
  - The React client calls `"/api/..."` paths; Vite’s proxy forwards to the backend on port `8001`.
  - Example create call:
    - Request: `POST /api/todos` with body `{"title":"Buy milk"}`
    - Response: `{ "id": "uuid", "title": "Buy milk", "completed": false }`
- Decoupling benefit: you can replace `todos.json` with PostgreSQL or add authentication without changing `client/src/api.js` call signatures.