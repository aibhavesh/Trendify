import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const { adminLogin, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && isAdmin) {
    navigate('/admin', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await adminLogin(email, password)
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Admin login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linen flex items-center justify-center px-4">
      <div className="neu-card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-2xl text-primary mb-1">Trendify</h1>
          <p className="text-xs text-text-muted">Admin Panel</p>
          <h2 className="font-display font-bold text-2xl text-text-heading mt-4">Admin Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-body mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="neu-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-body mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="neu-input"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
