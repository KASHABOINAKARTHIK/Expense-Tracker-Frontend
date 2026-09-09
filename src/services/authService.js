import api from './api'

export const register = (payload) => api.post('/auth/register', payload)
export const verifyOtp = (payload) => api.post('/auth/verify-otp', payload)
export const resendOtp = (payload) => api.post('/auth/resend-otp', payload)
export const login = (payload) => api.post('/auth/login', payload)
export const forgotPassword = (payload) => api.post('/auth/forgot-password', payload)
export const resetPassword = (payload) => api.post('/auth/reset-password', payload)
export const changePassword = (payload) => api.post('/auth/change-password', payload)
