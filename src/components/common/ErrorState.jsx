import { AlertCircle, RefreshCw } from 'lucide-react'
export default function ErrorState({ message = 'Something went wrong.', onRetry }) { return <div className="state-card error-state"><div className="empty-icon"><AlertCircle /></div><h3>Unable to load data</h3><p>{message}</p>{onRetry && <button className="secondary-button" onClick={onRetry}><RefreshCw size={16}/> Try again</button>}</div> }
