from fastapi import APIRouter, HTTPException
from typing import List
from uuid import uuid4

from ..models import Todo, TodoCreate, TodoUpdate
from ..storage import load_todos, save_todos, get_todo_by_id


router = APIRouter()


@router.get("/todos", response_model=List[Todo])
@router.get("/todos/", response_model=List[Todo])
def list_todos():
    return load_todos()


@router.get("/todos/{todo_id}", response_model=Todo)
def get_todo(todo_id: str):
    todos = load_todos()
    todo = get_todo_by_id(todos, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.post("/todos", response_model=Todo, status_code=201)
@router.post("/todos/", response_model=Todo, status_code=201)
def create_todo(payload: TodoCreate):
    todos = load_todos()
    new_todo = Todo(id=str(uuid4()), title=payload.title, completed=False)
    todos.append(new_todo)
    save_todos(todos)
    return new_todo


@router.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: str, payload: TodoUpdate):
    todos = load_todos()
    todo = get_todo_by_id(todos, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    if payload.title is not None:
        todo.title = payload.title
    if payload.completed is not None:
        todo.completed = payload.completed

    save_todos(todos)
    return todo


@router.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: str):
    todos = load_todos()
    todo = get_todo_by_id(todos, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    todos = [t for t in todos if t.id != todo_id]
    save_todos(todos)
    return


@router.patch("/todos/{todo_id}/toggle", response_model=Todo)
def toggle_todo(todo_id: str):
    todos = load_todos()
    todo = get_todo_by_id(todos, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    todo.completed = not todo.completed
    save_todos(todos)
    return todo