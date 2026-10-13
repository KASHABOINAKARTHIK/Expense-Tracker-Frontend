import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Expenses from './pages/Expenses/Expenses'
import AddExpense from './pages/AddExpense/AddExpense'
import EditExpense from './pages/EditExpense/EditExpense'
import ExpenseDetails from './pages/ExpenseDetails/ExpenseDetails'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import VerifyOtp from './pages/Auth/VerifyOtp'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import Profile from './pages/Profile/Profile'
import ProtectedRoute from './auth/ProtectedRoute'

export default function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/verify-otp" element={<VerifyOtp />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/expenses/new" element={<AddExpense />} />
        <Route path="/expenses/:id/edit" element={<EditExpense />} />
        <Route path="/expenses/:id" element={<ExpenseDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
