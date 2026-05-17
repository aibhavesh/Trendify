import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrderById, updateOrderStatus } from '../../services/api'
import StatusBadge from '../../components/StatusBadge'
import toast from 'react-hot-toast'

const STATUSES = ['processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrderById(id)
      .then((res) => setOrder(res.data.order ?? res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleStatus = async (status) => {
    try {
      await updateOrderStatus(id, status)
      setOrder((prev) => ({ ...prev, orderStatus: status }))
      toast.success('Status updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted">Order not found</p>
      </div>
    )
  }

  const addr = order.shippingAddress || {}

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link to="/admin/orders" className="hover:text-primary transition">Orders</Link>
        <span>/</span>
        <span className="text-text-heading font-medium">#{order._id?.slice(-8).toUpperCase()}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-heading">
            Order #{order._id?.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.orderStatus} />
          <StatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="neu-card">
            <h2 className="font-display font-bold text-lg mb-4">Items</h2>
            <div className="space-y-4">
              {order.items?.map((item, i) => {
                const p = item.product || {}
                return (
                  <div key={i} className="flex items-center gap-4 pb-4 border-b border-border-warm last:border-0 last:pb-0">
                    <img
                      src={p.images?.[0] || 'https://placehold.co/64x64/FAF0E6/FF6B6B?text=P'}
                      alt={p.title}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{p.title || 'Product'}</p>
                      <p className="text-xs text-text-muted">Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</p>
                    </div>
                    <span className="font-medium text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Update status */}
          <div className="neu-card">
            <h2 className="font-display font-bold text-lg mb-4">Update Status</h2>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatus(s)}
                  disabled={order.orderStatus === s}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
                    order.orderStatus === s
                      ? 'bg-primary text-white shadow-neu-pressed cursor-default'
                      : 'bg-card-bg shadow-neu-sm hover:shadow-neu-pressed'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Summary */}
          <div className="neu-card">
            <h2 className="font-display font-bold text-lg mb-4">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-body">Payment</span><span>{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-text-body">Customer</span><span>{order.user?.name || 'N/A'}</span></div>
              <hr className="border-border-warm" />
              <div className="flex justify-between font-display font-bold text-base">
                <span>Total</span>
                <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="neu-card">
            <h2 className="font-display font-bold text-lg mb-4">Shipping</h2>
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
