import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrderById } from '../services/api'
import StatusBadge from '../components/StatusBadge'

export default function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrderById(id)
      .then((res) => setOrder(res.data.order ?? res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-text-muted font-display text-lg">Order not found</p>
        <Link to="/orders" className="btn-primary mt-4 inline-block">Back to Orders</Link>
      </div>
    )
  }

  const addr = order.shippingAddress || {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link to="/orders" className="hover:text-primary transition">My Orders</Link>
        <span>/</span>
        <span className="text-text-heading font-medium">#{order._id?.slice(-8).toUpperCase()}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-heading">
            Order #{order._id?.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
          </p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={order.orderStatus} />
          <StatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="neu-card">
            <h2 className="font-display font-bold text-lg mb-4">Items</h2>
            <div className="space-y-4">
              {order.items?.map((item, i) => {
                const p = item.product || {}
                return (
                  <div key={i} className="flex items-center gap-4 pb-4 border-b border-border-warm last:border-0 last:pb-0">
                    <img
                      src={p.images?.[0] || 'https://placehold.co/80x80/FAF0E6/FF6B6B?text=P'}
                      alt={p.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{p.title || 'Product'}</p>
                      <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="neu-card">
            <h2 className="font-display font-bold text-lg mb-4">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-body">Payment Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <hr className="border-border-warm" />
              <div className="flex justify-between font-display font-bold text-base">
                <span>Total</span>
                <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="neu-card">
            <h2 className="font-display font-bold text-lg mb-4">Shipping Address</h2>
            <div className="text-sm text-text-body space-y-1">
              <p className="font-medium text-text-heading">{addr.fullName}</p>
              <p>{addr.address}</p>
              <p>{addr.city}, {addr.state} - {addr.pincode}</p>
              <p>Phone: {addr.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
