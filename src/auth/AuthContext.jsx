import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getMyProfile } from '../services/userService'

const TOKEN_KEY = 'tme_auth_token'
const USER_KEY = 'tme_auth_user'
const EXPIRY_KEY = 'tme_auth_expires_at'

const AuthContext = createContext(null)

const readStored = () => {
  const token = localStorage.getItem(TOKEN_KEY)
  const expiresAt = Number(localStorage.getItem(EXPIRY_KEY) || 0)
  if (!token || !expiresAt || Date.now() >= expiresAt) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(EXPIRY_KEY)
    return { token: null, user: null, expiresAt: 0 }
  }
  let user = null
  try { user = JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { user = null }
  return { token, user, expiresAt }
}

export function AuthProvider({ children }) {
<<<<<<< HEAD
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [username, setUsername] = useState(() => localStorage.getItem(USERNAME_KEY))

  const login = (loginResponse) => {
    localStorage.setItem(TOKEN_KEY, loginResponse.token)
    localStorage.setItem(USERNAME_KEY, loginResponse.username)
    setToken(loginResponse.token)
    setUsername(loginResponse.username)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USERNAME_KEY)
=======
  const stored = readStored()
  const [token, setToken] = useState(stored.token)
  const [user, setUser] = useState(stored.user)
  const [expiresAt, setExpiresAt] = useState(stored.expiresAt)

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(EXPIRY_KEY)
>>>>>>> development
    setToken(null)
    setUser(null)
    setExpiresAt(0)
  }, [])

  const saveSession = useCallback((loginResponse, profile) => {
    const expiry = Date.now() + Number(loginResponse.expiresInMs || 0)
    localStorage.setItem(TOKEN_KEY, loginResponse.token)
    localStorage.setItem(EXPIRY_KEY, String(expiry))
    if (profile) localStorage.setItem(USER_KEY, JSON.stringify(profile))
    setToken(loginResponse.token)
    setExpiresAt(expiry)
    setUser(profile || null)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!token) return null
    const response = await getMyProfile()
    const profile = response.data
    localStorage.setItem(USER_KEY, JSON.stringify(profile))
    setUser(profile)
    return profile
  }, [token])

  useEffect(() => {
    if (!token || !expiresAt) return undefined
    const delay = Math.max(0, expiresAt - Date.now())
    const timer = window.setTimeout(() => {
      clearSession()
      window.location.assign('/login?expired=1')
    }, delay)
    return () => window.clearTimeout(timer)
  }, [token, expiresAt, clearSession])

  useEffect(() => {
    if (token && !user) refreshProfile().catch(() => clearSession())
  }, [token, user, refreshProfile, clearSession])

  const login = useCallback(async (loginResponse) => {
    const expiry = Date.now() + Number(loginResponse.expiresInMs || 0)
    localStorage.setItem(TOKEN_KEY, loginResponse.token)
    localStorage.setItem(EXPIRY_KEY, String(expiry))
    setToken(loginResponse.token)
    setExpiresAt(expiry)
    try {
      const response = await getMyProfile()
      const profile = response.data
      localStorage.setItem(USER_KEY, JSON.stringify(profile))
      setUser(profile)
      return profile
    } catch (error) {
      clearSession()
      throw error
    }
  }, [clearSession])

  const logout = useCallback(() => clearSession(), [clearSession])

  const value = useMemo(() => ({
    token,
    user,
    username: user?.name || user?.email || '',
    isAuthenticated: Boolean(token),
    expiresAt,
    login,
    logout,
    refreshProfile,
  }), [token, user, expiresAt, login, logout, refreshProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}

export const authStorageKeys = { TOKEN_KEY, USER_KEY, EXPIRY_KEY }
