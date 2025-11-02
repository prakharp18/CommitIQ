import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/auth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = authService.getToken()
      if (token) {
        const userData = await authService.verifyAuth()
        setUser(userData)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      authService.logout()
    } finally {
      setLoading(false)
    }
  }

  const login = () => {
    authService.loginWithGitHub()
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    authService.logout()
  }

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    
    if (token) {
      authService.setToken(token)
      setLoading(true)
      checkAuth()
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext