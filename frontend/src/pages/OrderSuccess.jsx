import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getOrderById } from '../services/api'

export default function OrderSuccess() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId)
        .then((res) => setOrder(res.data.order ?? res.data))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [orderId])

  // Auto redirect after 10 seconds
  useEffect(() => {
    if (!loading) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            navigate('/products')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [loading, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/5 to-primary/5 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 mb-4 animate-pulse">
            <span className="material-symbols-outlined text-success text-5xl">check_circle</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-text-heading mb-2">
            Order Placed! 🎉
          </h1>
          <p className="text-text-body text-lg">Thank you for your purchase</p>
        </div>

        {/* Order Details Card */}
        <div className="neu-card mb-6 p-6">
          <div className="mb-4">
            <p className="text-sm text-text-muted mb-1">Order Number</p>
            <p className="font-display font-bold text-lg text-primary">
              #{order?._id?.slice(-8).toUpperCase()}
            </p>
          </div>

          <hr className="border-border-warm mb-4" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-text-muted mb-1">Total Amount</p>
              <p className="font-medium text-lg">
                ₹{order?.totalAmount?.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-text-muted mb-1">Payment Method</p>
              <p className="font-medium">{order?.paymentMethod}</p>
            </div>
          </div>

          <hr className="border-border-warm my-4" />

          <div>
            <p className="text-text-muted text-sm mb-2">Shipping To</p>
            <p className="font-medium text-sm">
              {order?.shippingAddress?.fullName}
            </p>
            <p className="text-xs text-text-muted mt-1">
              {order?.shippingAddress?.address}, {order?.shippingAddress?.city}
              <br />
              {order?.shippingAddress?.state} - {order?.shippingAddress?.pincode}
            </p>
          </div>
        </div>

        {/* Message */}
        <div className="text-center mb-6 p-4 bg-info/10 rounded-lg border border-info/20">
          <p className="text-sm text-text-body">
            <span className="block font-medium mb-1">✨ What's Next?</span>
            We'll send you an email confirmation shortly. You can track your order in your account.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <Link
            to={`/orders/${orderId}`}
            className="block text-center btn-primary w-full py-3 font-medium"
          >
            View Order Details
          </Link>
          <button
            onClick={() => navigate('/products')}
            className="w-full py-3 px-4 rounded-xl font-medium border border-primary text-primary hover:bg-primary/5 transition"
          >
            Continue Shopping
          </button>
        </div>

        {/* Auto Redirect Message */}
        <p className="text-center text-xs text-text-muted">
          Redirecting to products in <span className="font-medium text-primary">{countdown}s</span>
        </p>
      </div>
    </div>
  )
}
