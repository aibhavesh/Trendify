import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../services/api'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await forgotPassword({ email })
      setSubmitted(true)
      toast.success(data?.message || 'If an account exists, a reset link has been sent.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="neu-card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-text-heading">Forgot Password</h1>
          <p className="text-text-muted text-sm mt-2">
            Enter your registered email and we&apos;ll send a reset link.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-body mb-1.5">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="neu-input pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending link…
                </span>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center space-y-3">
            <p className="font-semibold text-text-heading">Check your email</p>
            <p className="text-sm text-text-muted">
              If an account exists for that email address, you&apos;ll receive a reset link within a few minutes.
            </p>
          </div>
        )}

        <div className="text-center text-sm text-text-muted mt-6">
          Remembered your password?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
