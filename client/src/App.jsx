import { useEffect, useState } from 'react'
import './App.css'
import { createTodo, deleteTodo, fetchTodos, toggleTodo, updateTodo, markCompleted } from './api'

function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newTitle, setNewTitle] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchTodos()
      setTodos(data)
    } catch (e) {
      setError('Failed to load todos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onAdd = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    try {
      const t = await createTodo(newTitle.trim())
      setTodos((prev) => [t, ...prev])
      setNewTitle('')
    } catch (e) {
      setError('Failed to add todo')
    }
  }

  const onToggle = async (id) => {
    try {
      const updated = await toggleTodo(id)
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (e) {
      setError('Failed to toggle todo')
    }
  }

  const onDelete = async (id) => {
    try {
      await deleteTodo(id)
      setTodos((prev) => prev.filter((t) => t.id !== id))
    } catch (e) {
      setError('Failed to delete todo')
    }
  }

  const onRename = async (id, title) => {
    try {
      const updated = await updateTodo(id, { title })
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (e) {
      setError('Failed to update todo')
    }
  }

  const onMarkCompleted = async (id) => {
    try {
      const updated = await markCompleted(id)
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (e) {
      setError('Failed to mark as completed')
    }
  }

  return (
    <div className="container">
      <h1>Todos</h1>
      <form className="add-form" onSubmit={onAdd}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new todo"
        />
        <button type="submit">Add</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="list">
        {todos.map((t) => (
          <li key={t.id} className={t.completed ? 'item completed' : 'item'}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => onToggle(t.id)}
            />
            <input
              className="title"
              value={t.title}
              onChange={(e) => onRename(t.id, e.target.value)}
            />
            {!t.completed && (
              <button className="complete" onClick={() => onMarkCompleted(t.id)}>
                Complete
              </button>
            )}
            <button className="delete" onClick={() => onDelete(t.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
