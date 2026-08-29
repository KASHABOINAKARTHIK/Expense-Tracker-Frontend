import { CheckCircle2, X } from 'lucide-react'
export default function Toast({ message, onClose }) { if (!message) return null; return <div className="toast"><CheckCircle2 size={18}/><span>{message}</span><button onClick={onClose} aria-label="Close"><X size={16}/></button></div> }
