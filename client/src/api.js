const BASE_URL = '/api/todos'

export async function fetchTodos() {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export async function createTodo(title) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  if (!res.ok) throw new Error('Failed to create')
  return res.json()
}

export async function toggleTodo(id) {
  const res = await fetch(`${BASE_URL}/${id}/toggle`, { method: 'PATCH' })
  if (!res.ok) throw new Error('Failed to toggle')
  return res.json()
}

export async function deleteTodo(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete')
  return true
}

export async function updateTodo(id, payload) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to update')
  return res.json()
}

export async function markCompleted(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: true }),
  })
  if (!res.ok) throw new Error('Failed to mark completed')
  return res.json()
}