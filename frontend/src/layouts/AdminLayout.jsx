import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/admin', icon: 'dashboard', label: 'Dashboard' },
  { to: '/admin/orders', icon: 'orders', label: 'Orders' },
  { to: '/admin/products', icon: 'inventory_2', label: 'Products' },
  { to: '/admin/users', icon: 'group', label: 'Users' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-linen">
      {/* Sidebar */}
      <aside className="w-64 bg-card-bg/70 border-r border-border-warm flex flex-col shadow-neu sticky top-0 h-screen">
        {/* Brand */}
        <div className="p-6 border-b border-border-warm">
          <h1 className="font-display font-bold text-2xl text-primary tracking-tight">
            Trendify
          </h1>
          <p className="text-xs text-text-muted mt-1">Admin Panel</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold shadow-neu-pressed'
                    : 'text-text-body hover:bg-primary/5'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Admin info + logout */}
        <div className="p-4 border-t border-border-warm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm font-semibold truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-text-muted truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-text-body hover:text-primary transition w-full px-4 py-2 rounded-lg hover:bg-primary/5"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
