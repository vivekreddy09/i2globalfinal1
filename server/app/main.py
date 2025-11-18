from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import todos

app = FastAPI(title="Todo API", version="1.0.0")

# CORS for local React dev server
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todos.router, prefix="/api", tags=["todos"])

@app.get("/api/health")
@app.get("/api/health/")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)