import { useEffect, useState } from 'react'
import { getDashboardStats } from '../../services/api'

export default function UsersList() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data.stats ?? res.data))
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
    <div>
      <h1 className="font-display font-bold text-3xl text-text-heading mb-2">Users</h1>
      <p className="text-text-muted text-sm mb-8">
        Total users: {stats?.totalUsers ?? 0}
      </p>

      <div className="neu-card">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-xl bg-linen">
            <p className="font-display font-bold text-3xl text-text-heading">{stats?.totalUsers ?? 0}</p>
            <p className="text-sm text-text-muted mt-1">Total Users</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-linen">
            <p className="font-display font-bold text-3xl text-text-heading">{stats?.totalOrders ?? 0}</p>
            <p className="text-sm text-text-muted mt-1">Total Orders</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-linen">
            <p className="font-display font-bold text-3xl text-text-heading">
              ₹{(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}
            </p>
            <p className="text-sm text-text-muted mt-1">Total Revenue</p>
          </div>
        </div>

        <div className="mt-8 p-8 text-center rounded-xl bg-linen">
          <span className="material-symbols-outlined text-5xl text-text-muted mb-4">group</span>
          <p className="text-text-muted text-sm">
            Detailed user management requires additional backend endpoints.
            <br />
            User count and statistics are displayed from the dashboard API.
          </p>
        </div>
      </div>
    </div>
  )
}
