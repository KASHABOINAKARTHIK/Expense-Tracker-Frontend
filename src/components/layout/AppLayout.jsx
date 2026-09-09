import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ReceiptText, Plus, WalletCards, Menu, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Toast from '../common/Toast'
import { useAuth } from '../../auth/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', icon: ReceiptText },
  { to: '/profile', label: 'Profile & security', icon: UserRound },
]

export default function AppLayout() {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { username, logout } = useAuth()

  const title = useMemo(() => {
    if (location.pathname === '/expenses/new') return 'Add expense'
    if (location.pathname.endsWith('/edit')) return 'Edit expense'
    if (location.pathname !== '/expenses' && location.pathname.startsWith('/expenses/')) return 'Expense details'
    if (location.pathname === '/expenses') return 'Expenses'
    if (location.pathname === '/profile') return 'Profile & security'
    return 'Dashboard'
  }, [location.pathname])

  useEffect(() => {
    const message = location.state?.toast
    if (!message) return
    setToast(message)
    navigate(location.pathname + location.search, { replace: true, state: null })
    const timer = window.setTimeout(() => setToast(''), 3500)
    return () => window.clearTimeout(timer)
  }, [location, navigate])

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><WalletCards size={21} /></div>
          <div><strong>Track My</strong><span>Expenses</span></div>
        </div>
        <nav className="nav-list" aria-label="Primary navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={19} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="owner-row"><div><span className="eyebrow">Signed in as</span><strong>{username}</strong></div><button className="logout-button" onClick={() => { logout(); navigate('/login', { replace: true }) }}>Log out</button></div>
          <button className="add-expense-side" onClick={() => { navigate('/expenses/new'); setOpen(false) }}><Plus size={18} /> Add expense</button>
          <p>Simple spending, clearer decisions.</p>
        </div>
      </aside>
      {open && <button className="mobile-overlay" aria-label="Close menu" onClick={() => setOpen(false)} />}
      <main className="main-content">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
          <div><span className="eyebrow">Personal finance</span><h1>{title}</h1></div>
          <button className="primary-button top-add" onClick={() => navigate('/expenses/new')}><Plus size={18} /> Add expense</button>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  )
}
