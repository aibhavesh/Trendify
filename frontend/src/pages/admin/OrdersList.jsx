import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllOrders, updateOrderStatus } from '../../services/api'
import StatusBadge from '../../components/StatusBadge'
import toast from 'react-hot-toast'

const STATUSES = ['processing', 'shipped', 'delivered', 'cancelled']

export default function OrdersList() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getAllOrders()
      .then((res) => setOrders(res.data.orders ?? res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      )
      toast.success('Status updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.orderStatus === filter)

  return (
    <div>
      <h1 className="font-display font-bold text-3xl text-text-heading mb-2">Orders</h1>
      <p className="text-text-muted text-sm mb-6">{orders.length} total orders</p>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
              filter === s
                ? 'bg-primary text-white shadow-neu-pressed'
                : 'bg-card-bg shadow-neu-sm hover:shadow-neu-pressed'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== 'all' &&
              ` (${orders.filter((o) => o.orderStatus === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        </div>
      ) : (
        <div className="neu-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-bold uppercase text-text-muted tracking-wider border-b border-border-warm">
                <th className="pb-3 pr-4">Order ID</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Items</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3 pr-4">Payment</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-warm">
              {filtered.map((order) => (
                <tr key={order._id} className="hover:bg-primary/5 transition">
                  <td className="py-3 pr-4">
                    <Link to={`/admin/orders/${order._id}`} className="text-primary hover:underline font-medium">
                      #{order._id?.slice(-6).toUpperCase()}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-text-body">{order.user?.name || 'N/A'}</td>
                  <td className="py-3 pr-4">{order.items?.length || 0}</td>
                  <td className="py-3 pr-4 font-medium">₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                  <td className="py-3 pr-4"><StatusBadge status={order.paymentStatus} /></td>
                  <td className="py-3 pr-4"><StatusBadge status={order.orderStatus} /></td>
                  <td className="py-3 pr-4 text-text-muted whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </td>
                  <td className="py-3 text-right">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs bg-card-bg shadow-neu-sm rounded px-2 py-1"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-text-muted">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
