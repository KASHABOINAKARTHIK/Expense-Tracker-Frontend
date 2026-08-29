import { Search, X } from 'lucide-react'

const categories = [['', 'All categories'], ['FOOD', 'Food'], ['TRANSPORT', 'Transport'], ['CARE', 'Care'], ['ENTERTAINMENT', 'Entertainment'], ['OTHER', 'Other']]

export default function ExpenseFilters({ filters, setFilters }) {
  const has = Object.values(filters).some(Boolean)
  const searchActive = Boolean(filters.search)
  const categoryActive = Boolean(filters.category)

  const updateSearch = (search) => {
    setFilters({ ...filters, search, ...(search ? { category: '' } : {}) })
  }

  const updateCategory = (category) => {
    setFilters({ ...filters, category, ...(category ? { search: '' } : {}) })
  }

  return (
    <div className="filters-card">
      <div className="search-box">
        <Search size={18} aria-hidden="true" />
        <input aria-label="Search expense descriptions" placeholder="Search descriptions..." value={filters.search} onChange={e => updateSearch(e.target.value)} />
      </div>
      <input className="filter-input" aria-label="Filter by month" type="month" value={filters.month} onChange={e => setFilters({ ...filters, month: e.target.value })} />
      <select className="filter-input" aria-label="Filter by category" value={filters.category} onChange={e => updateCategory(e.target.value)}>
        {categories.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      {has && <button className="clear-button" onClick={() => setFilters({ month: '', category: '', search: '' })}><X size={15} /> Clear</button>}
      {(searchActive || categoryActive) && <span className="filter-note">Search and category filters are mutually exclusive by the current API.</span>}
    </div>
  )
}
