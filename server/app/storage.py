import json
from pathlib import Path
from typing import List, Optional
from .models import Todo


DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
DB_FILE = DATA_DIR / "todos.json"


def _ensure_file():
    if not DB_FILE.exists():
        DB_FILE.write_text("[]", encoding="utf-8")


def load_todos() -> List[Todo]:
    _ensure_file()
    raw = json.loads(DB_FILE.read_text(encoding="utf-8"))
    return [Todo(**item) for item in raw]


def save_todos(todos: List[Todo]) -> None:
    DB_FILE.write_text(json.dumps([t.model_dump() for t in todos], indent=2), encoding="utf-8")


def get_todo_by_id(todos: List[Todo], todo_id: str) -> Optional[Todo]:
    for t in todos:
        if t.id == todo_id:
            return t
    return None