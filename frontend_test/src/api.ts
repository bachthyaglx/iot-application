/// <reference types="vite/client" />
const BASE_URL = import.meta.env.VITE_URL_BACKEND_2

export const login = async (username: string, password: string) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Login failed: ${errorText}`)
  }
  return res.json()
}

export const getData = async (token: string) => {
  const res = await fetch(`${BASE_URL}/data`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Failed to fetch data')
  return res.json()
}
