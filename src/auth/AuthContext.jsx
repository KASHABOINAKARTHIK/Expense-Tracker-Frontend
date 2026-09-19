import { createContext, useContext, useMemo, useState } from 'react'

const TOKEN_KEY = 'tme_auth_token'
const USERNAME_KEY = 'tme_auth_username'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
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
    setToken(null)
    setUsername(null)
  }

  const value = useMemo(() => ({ token, username, isAuthenticated: Boolean(token), login, logout }), [token, username])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
