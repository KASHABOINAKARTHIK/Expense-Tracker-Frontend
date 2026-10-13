import { useState } from 'react'
import { KeyRound, Mail, WalletCards } from 'lucide-react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../auth/AuthContext'

const messageFrom = (err, fallback) => err.response?.data?.message || fallback

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { login } = useAuth()
  const expired = params.get('expired') === '1'
  const successMessage = location.state?.message || ''

  const submit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      const response = await api.post('/auth/login', { email: email.trim(), password })
      await login(response.data)
      const destination = location.state?.from?.pathname || '/dashboard'
      navigate(destination, { replace: true })
    } catch (err) {
      setError(messageFrom(err, 'Unable to sign in. Please try again.'))
    } finally { setLoading(false) }
  }

  return <main className="auth-page">
    <section className="auth-card" aria-labelledby="login-title">
      <div className="login-brand"><div className="brand-mark"><WalletCards size={21} /></div><div><strong>Track My</strong><span>Expenses</span></div></div>
      <div className="auth-heading"><span className="eyebrow">Personal finance</span><h1 id="login-title">Welcome back</h1><p>Sign in to continue to your expense tracker.</p></div>
      {expired && <div className="inline-info" role="status">Your login session expired. Please sign in again.</div>}
      {successMessage && <div className="inline-success" role="status">{successMessage}</div>}
      {error && <div className="inline-error" role="alert">{error}</div>}
      <form onSubmit={submit} className="auth-form">
        <label className="field"><span>Email <b>*</b></span><div className="input-icon"><Mail size={16}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required placeholder="you@example.com"/></div></label>
        <label className="field"><span>Password <b>*</b></span><div className="input-icon"><KeyRound size={16}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required placeholder="Your password"/></div></label>
        <div className="auth-row"><Link to="/forgot-password" className="text-link">Forgot password?</Link></div>
        <button className="primary-button login-submit" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="auth-switch">Don't have an account? <Link to="/register" className="text-link">Create one</Link></p>
    </section>
  </main>
}
