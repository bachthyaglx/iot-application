import { useState } from 'react'
import { login } from './api'
import Dashboard from './pages/Dashboard'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')

  const handleLogin = async () => {
    try {
      const res = await login(username, password)
      setToken(res.token)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <br />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <br />
        <button onClick={handleLogin}>Login</button>
      </div>
    )
  }

  return <Dashboard />
}

export default App
