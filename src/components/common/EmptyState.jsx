import { ReceiptText, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
export default function EmptyState({ title = 'No expenses found', description = 'Start tracking your spending by adding your first expense.', action = true }) {
 const navigate = useNavigate(); return <div className="state-card empty-state"><div className="empty-icon"><ReceiptText /></div><h3>{title}</h3><p>{description}</p>{action && <button className="primary-button" onClick={() => navigate('/expenses/new')}><Plus size={17}/> Add expense</button>}</div>
}
