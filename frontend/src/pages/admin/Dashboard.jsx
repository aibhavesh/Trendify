import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardStats } from '../../services/api'
import StatusBadge from '../../components/StatusBadge'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then((res) => {
        const d = res.data
        setStats({
          totalUsers: d.stats?.totalUsers ?? 0,
          totalOrders: d.stats?.totalOrders ?? 0,
          totalProducts: d.stats?.totalProducts ?? 0,
          totalRevenue: d.stats?.totalRevenue ?? 0,
          orderStatusBreakdown: {
            processing: d.stats?.pendingOrders ?? 0,
            shipped: d.stats?.shippedOrders ?? 0,
            delivered: d.stats?.deliveredOrders ?? 0,
            cancelled: d.stats?.cancelledOrders ?? 0,
          },
          latestOrders: d.latestOrders ?? [],
          lowStockProducts: d.lowStockProducts ?? [],
        })
      })
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

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: 'group', color: 'text-blue-600 bg-blue-100' },
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: 'receipt_long', color: 'text-amber-600 bg-amber-100' },
    { label: 'Total Products', value: stats?.totalProducts ?? 0, icon: 'inventory_2', color: 'text-green-600 bg-green-100' },
    { label: 'Revenue', value: `₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`, icon: 'payments', color: 'text-primary bg-primary/10' },
  ]

  return (
    <div>
      <h1 className="font-display font-bold text-3xl text-text-heading mb-8">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((s) => (
          <div key={s.label} className="neu-card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
              <span className="material-symbols-outlined text-[24px]">{s.icon}</span>
            </div>
            <div>
              <p className="text-xs text-text-muted">{s.label}</p>
              <p className="font-display font-bold text-xl">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order status breakdown */}
      {stats?.orderStatusBreakdown && (
        <div className="neu-card mb-10">
          <h2 className="font-display font-bold text-lg mb-4">Order Status Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(stats.orderStatusBreakdown).map(([status, count]) => (
              <div key={status} className="text-center p-4 rounded-xl bg-linen">
                <p className="font-display font-bold text-2xl">{count}</p>
                <StatusBadge status={status} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest orders */}
        <div className="neu-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg">Latest Orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary hover:underline">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-bold uppercase text-text-muted tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-warm">
                {(stats?.latestOrders ?? []).slice(0, 5).map((order) => (
                  <tr key={order._id} className="hover:bg-primary/5 transition">
                    <td className="py-3">
                      <Link to={`/admin/orders/${order._id}`} className="text-primary hover:underline font-medium">
                        #{order._id?.slice(-6).toUpperCase()}
                      </Link>
                    </td>
                    <td className="py-3">₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="py-3"><StatusBadge status={order.orderStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock */}
        <div className="neu-card">
          <h2 className="font-display font-bold text-lg mb-4">Low Stock Products</h2>
          <div className="space-y-3">
            {(stats?.lowStockProducts ?? []).slice(0, 5).map((p) => (
              <div key={p._id} className="flex items-center justify-between py-2 border-b border-border-warm last:border-0">
                <div className="flex items-center gap-3">
                  <img
                    src={p.images?.[0] || 'https://placehold.co/40x40/FAF0E6/FF6B6B?text=P'}
                    alt={p.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <span className="text-sm font-medium truncate max-w-[200px]">{p.title}</span>
                </div>
                <span className={`text-sm font-bold ${p.stock === 0 ? 'text-error' : 'text-amber-600'}`}>
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
