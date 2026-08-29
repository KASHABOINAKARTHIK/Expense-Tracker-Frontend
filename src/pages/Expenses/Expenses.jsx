import { useEffect, useMemo, useState } from 'react'
import { Plus, SlidersHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { deleteExpense, getExpenses } from '../../services/expenseService'
import ExpenseFilters from '../../components/expenses/ExpenseFilters'
import ExpenseTable from '../../components/expenses/ExpenseTable'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import Toast from '../../components/common/Toast'
import { formatCurrency } from '../../utils/formatCurrency'

export default function Expenses() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({ month: '', category: '', search: '' })
  const [sort, setSort] = useState('date-desc')
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
      const res = await getExpenses(params)
      setExpenses(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load expenses. Please check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(load, 250)
    return () => clearTimeout(timer)
  }, [filters])

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      if (sort === 'amount-desc') return Number(b.amount) - Number(a.amount)
      if (sort === 'amount-asc') return Number(a.amount) - Number(b.amount)
      if (sort === 'date-asc') return new Date(a.expenseDate) - new Date(b.expenseDate)
      return new Date(b.expenseDate) - new Date(a.expenseDate)
    })
  }, [expenses, sort])

  const displayedTotal = useMemo(() => sortedExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0), [sortedExpenses])

  const remove = async (expense) => {
    const label = expense.description ? ` (${expense.description})` : ''
    if (!window.confirm(`Delete this expense${label}?`)) return
    try {
      await deleteExpense(expense.id)
      setToast('Expense deleted successfully.')
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete the expense.')
    }
  }

  return (
    <div className="expenses-page">
      <div className="page-actions">
        <div>
          <span className="eyebrow">Your spending</span>
          <p className="page-subtitle">Browse, search and manage every recorded expense.</p>
        </div>
        <button className="primary-button" onClick={() => navigate('/expenses/new')}><Plus size={18} /> Add expense</button>
      </div>

      <div className="filter-label"><SlidersHorizontal size={16} /> Filters</div>
      <ExpenseFilters filters={filters} setFilters={setFilters} />

      {!loading && !error && expenses.length > 0 && (
        <div className="list-toolbar">
          <span>{sortedExpenses.length} expense{sortedExpenses.length === 1 ? '' : 's'} · {formatCurrency(displayedTotal)}</span>
          <label>Sort
            <select className="filter-input sort-input" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="amount-desc">Highest amount</option>
              <option value="amount-asc">Lowest amount</option>
            </select>
          </label>
        </div>
      )}

      {loading ? <Loading label="Loading expenses..." /> : error ? <ErrorState message={error} onRetry={load} /> : sortedExpenses.length ? <ExpenseTable expenses={sortedExpenses} onDelete={remove} /> : <EmptyState />}
      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  )
}
