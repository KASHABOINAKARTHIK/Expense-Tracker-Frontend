import { useState } from 'react'
import { LockKeyhole, WalletCards } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../auth/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await api.post('/auth/login', { username, password })
      login(response.data)
      const destination = location.state?.from?.pathname || '/dashboard'
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.response?.status === 401 ? 'Invalid username or password.' : 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand"><div className="brand-mark"><WalletCards size={21} /></div><div><strong>Track My</strong><span>Expenses</span></div></div>
        <div className="login-heading"><span className="eyebrow">Private personal app</span><h1 id="login-title">Welcome back</h1><p>Sign in to access your expense tracker.</p></div>
        <form onSubmit={submit} className="login-form">
          {error && <div className="inline-error" role="alert">{error}</div>}
          <label className="field">Username<input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required /></label>
          <label className="field">Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
          <button className="primary-button login-submit" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'} <LockKeyhole size={16} /></button>
        </form>
        <p className="login-note">This application is restricted to its configured owner account.</p>
      </section>
    </main>
  )
}
