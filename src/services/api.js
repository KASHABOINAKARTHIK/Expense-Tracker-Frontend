import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL_dev || 'http://localhost:8080/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tme_auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const requestUrl = error.config?.url || ''
    const isAuthEndpoint = requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/verify-otp') ||
      requestUrl.includes('/auth/resend-otp') ||
      requestUrl.includes('/auth/forgot-password') ||
      requestUrl.includes('/auth/reset-password')

    if (status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('tme_auth_token')
      localStorage.removeItem('tme_auth_user')
      localStorage.removeItem('tme_auth_expires_at')
      if (window.location.pathname !== '/login') {
        window.location.assign('/login?expired=1')
      }
    }
    return Promise.reject(error)
  },
)

export default api
