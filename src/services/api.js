import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// temp
console.log("API URL:", import.meta.env.VITE_API_BASE_URL);

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
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      sessionStorage.removeItem('tme_auth_token')
      sessionStorage.removeItem('tme_auth_username')
      window.location.assign('/login')
    }
    return Promise.reject(error)
  },
)

export default api
