import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getExpenses, getMonthlySummary, getTotalToDate } from '../../services/expenseService'
import StatCard from '../../components/dashboard/StatCard'
import CategoryChart from '../../components/dashboard/CategoryChart'
import ExpenseTable from '../../components/expenses/ExpenseTable'
import Loading from '../../components/common/Loading'
import ErrorState from '../../components/common/ErrorState'
import EmptyState from '../../components/common/EmptyState'
import { formatCurrency } from '../../utils/formatCurrency'
import { useNavigate } from 'react-router-dom'

const currentMonth = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` }
const monthLabel = (m) => new Date(`${m}-01T00:00:00`).toLocaleDateString('en-IN',{month:'long',year:'numeric'})
const shiftMonth = (m, delta) => { const [y,mo]=m.split('-').map(Number); const d=new Date(y,mo-1+delta,1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` }
export default function Dashboard(){
 const [month,setMonth]=useState(currentMonth()); const [summary,setSummary]=useState(null); const [total,setTotal]=useState(0); const [recent,setRecent]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(''); const navigate=useNavigate()
 const load=async()=>{setLoading(true);setError('');try{const [s,t,e]=await Promise.all([getMonthlySummary(month),getTotalToDate(),getExpenses({month})]);setSummary(s.data);setTotal(t.data?.total ?? 0);setRecent((e.data||[]).sort((a,b)=>new Date(b.expenseDate)-new Date(a.expenseDate)).slice(0,6))}catch(err){setError(err.response?.data?.message || 'Please make sure the Spring Boot backend is running.')}finally{setLoading(false)}}
 useEffect(()=>{load()},[month])
 const categoryCount=useMemo(()=>summary?.categories?.filter(x=>Number(x.amount)>0).length||0,[summary])
 if(loading) return <Loading label="Loading your dashboard..." />
 if(error) return <ErrorState message={error} onRetry={load}/>
 return <div className="dashboard-page"><div className="month-control"><button className="icon-button" onClick={()=>setMonth(shiftMonth(month,-1))}><ChevronLeft/></button><div><span className="eyebrow">Selected month</span><strong>{monthLabel(month)}</strong></div><button className="icon-button" onClick={()=>setMonth(shiftMonth(month,1))}><ChevronRight/></button></div><div className="stats-grid"><StatCard label="This month" value={formatCurrency(summary?.total)} hint={`${categoryCount} active categories`} tone="month"/><StatCard label="Total to date" value={formatCurrency(total)} hint="All recorded expenses"/></div><div className="dashboard-grid"><CategoryChart categories={summary?.categories} total={summary?.total}/><div className="insight-card"><span className="eyebrow">Quick action</span><h2>Stay on top of every rupee.</h2><p>Add expenses as they happen, then use the monthly breakdown to see where your money is going.</p><button className="secondary-button" onClick={()=>navigate('/expenses')}>View all expenses</button></div></div><section className="recent-section"><div className="section-heading"><div><span className="eyebrow">Latest activity</span><h2>Recent expenses</h2></div><button className="text-button" onClick={()=>navigate('/expenses')}>View all →</button></div>{recent.length ? <ExpenseTable expenses={recent}/> : <EmptyState title="Nothing recorded this month" description="Add your first expense to start building your spending history."/>}</section></div>
}
