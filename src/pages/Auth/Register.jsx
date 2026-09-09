import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { register } from '../../services/authService'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const navigate = useNavigate()
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))
  const submit = async e => {
    e.preventDefault(); setError('')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.')
    setLoading(true)
    try { await register({ name: form.name.trim(), email: form.email.trim(), password: form.password }); navigate(`/verify-otp?email=${encodeURIComponent(form.email.trim())}`, { replace: true }) }
    catch (err) { setError(err.response?.data?.message || 'Unable to create your account.') }
    finally { setLoading(false) }
  }
  return <main className="auth-page"><section className="auth-card" aria-labelledby="register-title">
    <div className="auth-heading"><span className="eyebrow">New account</span><h1 id="register-title">Create your account</h1><p>We'll send a verification code to your email.</p></div>
    {error && <div className="inline-error" role="alert">{error}</div>}
    <form onSubmit={submit} className="auth-form">
      <label className="field"><span>Name <b>*</b></span><input value={form.name} onChange={e=>update('name',e.target.value)} autoComplete="name" maxLength={100} required placeholder="Your name"/></label>
      <label className="field"><span>Email <b>*</b></span><input type="email" value={form.email} onChange={e=>update('email',e.target.value)} autoComplete="email" required placeholder="you@example.com"/></label>
      <label className="field"><span>Password <b>*</b></span><input type="password" value={form.password} onChange={e=>update('password',e.target.value)} autoComplete="new-password" minLength={8} required placeholder="At least 8 characters"/></label>
      <label className="field"><span>Confirm password <b>*</b></span><input type="password" value={form.confirmPassword} onChange={e=>update('confirmPassword',e.target.value)} autoComplete="new-password" required placeholder="Repeat your password"/></label>
      <button className="primary-button login-submit" disabled={loading}>{loading ? 'Creating account…' : 'Create account'} <UserPlus size={16}/></button>
    </form>
    <p className="auth-switch">Already have an account? <Link to="/login" className="text-link">Sign in</Link></p>
  </section></main>
}
