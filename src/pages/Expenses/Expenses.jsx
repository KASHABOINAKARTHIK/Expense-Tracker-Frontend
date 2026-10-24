import { useEffect, useMemo, useState } from 'react'
import { Plus, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { deleteExpense, getExpenses } from '../../services/expenseService'
import ExpenseFilters from '../../components/expenses/ExpenseFilters'
import ExpenseTable from '../../components/expenses/ExpenseTable'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import Toast from '../../components/common/Toast'
import { formatCurrency } from '../../utils/formatCurrency'

const PAGE_SIZE = 20

export default function Expenses() {
  const navigate = useNavigate()

  const [filters, setFilters] = useState({ month: '', category: '', search: '' })
  const [sort, setSort] = useState('date-desc')
  const [page, setPage] = useState(0) // Spring Data is 0-based

  const [expenses, setExpenses] = useState([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  // Convert frontend sort value → Spring sort parameter
  const springSort = useMemo(() => {
    switch (sort) {
      case 'amount-desc': return 'amount,desc'
      case 'amount-asc':  return 'amount,asc'
      case 'date-asc':    return 'expenseDate,asc'
      default:            return 'expenseDate,desc'
    }
  }, [sort])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {
        ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value)),
        page,
        size: PAGE_SIZE,
        sort: springSort,
      }

      const res = await getExpenses(params)
      const data = res.data

      // Support both Page object and plain array (backward compatible)
      if (data && Array.isArray(data.content)) {
        setExpenses(data.content)
        setTotalElements(data.totalElements ?? data.content.length)
        setTotalPages(data.totalPages ?? 1)
      } else if (Array.isArray(data)) {
        setExpenses(data)
        setTotalElements(data.length)
        setTotalPages(1)
      } else {
        setExpenses([])
        setTotalElements(0)
        setTotalPages(0)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load expenses. Please check that the backend is running.')
      setExpenses([])
      setTotalElements(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  // Reset to first page whenever filters or sort change
  useEffect(() => {
    setPage(0)
  }, [filters, sort])

  // Debounced load
  useEffect(() => {
    const timer = setTimeout(load, 250)
    return () => clearTimeout(timer)
  }, [filters, sort, page, springSort])

  const displayedTotal = useMemo(
    () => expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
    [expenses]
  )

  const remove = async (expense) => {
    const label = expense.description ? ` (${expense.description})` : ''
    if (!window.confirm(`Delete this expense${label}?`)) return
    try {
      await deleteExpense(expense.id)
      setToast('Expense deleted successfully.')
      // If we deleted the last item on the page and we're not on page 0, go back one page
      if (expenses.length === 1 && page > 0) {
        setPage((p) => p - 1)
      } else {
        await load()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete the expense.')
    }
  }

  const goToPrevious = () => {
    if (page > 0) setPage((p) => p - 1)
  }

  const goToNext = () => {
    if (page < totalPages - 1) setPage((p) => p + 1)
  }

  return (
    <div className="expenses-page">
      <div className="page-actions">
        <div>
          <span className="eyebrow">Your spending</span>
          <p className="page-subtitle">Browse, search and manage every recorded expense.</p>
        </div>
        <button className="primary-button" onClick={() => navigate('/expenses/new')}>
          <Plus size={18} /> Add expense
        </button>
      </div>

      <div className="filter-label">
        <SlidersHorizontal size={16} /> Filters
      </div>
      <ExpenseFilters filters={filters} setFilters={setFilters} />

      {!loading && !error && totalElements > 0 && (
        <div className="list-toolbar">
          <span>
            {totalElements} expense{totalElements === 1 ? '' : 's'}
            {expenses.length > 0 && ` · showing ${formatCurrency(displayedTotal)} on this page`}
          </span>

          <label>
            Sort
            <select
              className="filter-input sort-input"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="amount-desc">Highest amount</option>
              <option value="amount-asc">Lowest amount</option>
            </select>
          </label>
        </div>
      )}

      {loading ? (
        <Loading label="Loading expenses..." />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : expenses.length ? (
        <>
          <ExpenseTable expenses={expenses} onDelete={remove} />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-bar" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <button
                className="secondary-button"
                onClick={goToPrevious}
                disabled={page === 0}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <ChevronLeft size={18} /> Previous
              </button>

              <span style={{ fontSize: '0.95rem', opacity: 0.85 }}>
                Page {page + 1} of {totalPages}
              </span>

              <button
                className="secondary-button"
                onClick={goToNext}
                disabled={page >= totalPages - 1}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  )
}
