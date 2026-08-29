import api from './api'

export const createExpense = (payload) => api.post('/expenses', payload)
export const getExpenseById = (id) => api.get(`/expenses/${id}`)
export const getExpenses = (params = {}) => api.get('/expenses', { params })
export const updateExpense = (id, payload) => api.put(`/expenses/${id}`, payload)
export const deleteExpense = (id) => api.delete(`/expenses/${id}`)
export const getMonthlySummary = (month) => api.get('/expenses/summary', { params: { month } })
export const getTotalToDate = () => api.get('/expenses/total')
