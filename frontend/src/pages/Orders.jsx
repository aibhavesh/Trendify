import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyOrders } from '../services/api'
import StatusBadge from '../components/StatusBadge'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data.orders ?? res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display font-bold text-3xl text-text-heading mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-7xl text-text-muted mb-4">receipt_long</span>
          <h2 className="font-display font-bold text-xl text-text-heading mb-2">No orders yet</h2>
          <p className="text-text-muted text-sm mb-6">Start shopping to see your orders here</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="neu-card block hover:shadow-neu-sm transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-text-muted mb-1">
                    Order placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </p>
                  <p className="font-display font-semibold text-sm">
                    Order #{order._id?.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-text-body mt-1">
                    {order.items?.length || 0} item(s) · ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.orderStatus} />
                  <span className="material-symbols-outlined text-text-muted text-[20px]">chevron_right</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
