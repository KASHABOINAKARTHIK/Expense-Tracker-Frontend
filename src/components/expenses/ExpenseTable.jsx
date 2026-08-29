import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import { useEffect, useRef, useState } from 'react'

const labels = { FOOD: 'Food', TRANSPORT: 'Transport', CARE: 'Care', ENTERTAINMENT: 'Entertainment', OTHER: 'Other' }

export default function ExpenseTable({ expenses, onDelete, compact = false }) {
  const navigate = useNavigate()
  const [menu, setMenu] = useState(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const close = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setMenu(null)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div className={`table-card ${compact ? 'compact-table' : ''}`} ref={wrapperRef}>
      <div className="table-scroll">
        <table>
          <thead><tr><th>Date</th><th>Description</th><th>Category</th><th className="amount-col">Amount</th><th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id}>
                <td><strong>{formatDate(e.expenseDate)}</strong><small>{new Date(e.expenseDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</small></td>
                <td><span className="description">{e.description || 'No description'}</span></td>
                <td><span className={`category-pill category-${String(e.category).toLowerCase()}`}>{labels[e.category] || e.category}</span></td>
                <td className="amount-col"><strong>{formatCurrency(e.amount)}</strong></td>
                <td className="actions-cell">
                  <button className="icon-button" onClick={() => setMenu(menu === e.id ? null : e.id)} aria-label={`Actions for expense ${e.id}`} aria-expanded={menu === e.id}><MoreHorizontal size={18} /></button>
                  {menu === e.id && (
                    <div className="action-menu">
                      <button onClick={() => navigate(`/expenses/${e.id}`)}><Eye size={15} /> View</button>
                      <button onClick={() => navigate(`/expenses/${e.id}/edit`)}><Pencil size={15} /> Edit</button>
                      {onDelete && <button className="danger-text" onClick={() => { setMenu(null); onDelete(e) }}><Trash2 size={15} /> Delete</button>}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
