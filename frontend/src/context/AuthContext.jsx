import { createContext, useContext, useState, useEffect } from 'react'
import {
  loginUser as loginAPI,
  registerUser as registerAPI,
  adminLogin as adminLoginAPI,
  getUserProfile,
} from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  /* hydrate user from token on mount */
  useEffect(() => {
    if (token) {
      getUserProfile()
        .then((res) => setUser(res.data.user ?? res.data.data ?? res.data))
        .catch(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setToken(null)
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const persist = (t, u) => {
    localStorage.setItem('token', t)
    localStorage.setItem('user', JSON.stringify(u))
    setToken(t)
    setUser(u)
  }

  const login = async (email, password) => {
    const { data } = await loginAPI({ email, password })
    persist(data.token, data.user)
    toast.success('Logged in successfully!')
    return data.user
  }

  const adminLoginFn = async (email, password) => {
    const { data } = await adminLoginAPI({ email, password })
    persist(data.token, data.admin ?? data.user)
    toast.success('Admin logged in!')
    return data.admin ?? data.user
  }

  const signup = async (name, email, password) => {
    const { data } = await registerAPI({ name, email, password })
    persist(data.token, data.user)
    toast.success('Account created!')
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('cart')
    setToken(null)
    setUser(null)
    toast.success('Logged out')
  }

  const value = {
    user,
    token,
    loading,
    login,
    adminLogin: adminLoginFn,
    signup,
    logout,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
