import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-card-bg/80 backdrop-blur-md border-b border-border-warm shadow-neu-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display font-bold text-2xl text-primary tracking-tight">
              Trendify
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-text-body hover:text-primary transition">
              Home
            </Link>
            <Link to="/products" className="text-sm font-medium text-text-body hover:text-primary transition">
              Products
            </Link>
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="neu-input pl-10 py-2.5"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                <Link
                  to="/wishlist"
                  className="relative p-2 rounded-lg hover:bg-primary/5 transition"
                  title="Wishlist"
                >
                  <span className="material-symbols-outlined text-text-body">favorite</span>
                </Link>
                <Link
                  to="/cart"
                  className="relative p-2 rounded-lg hover:bg-primary/5 transition"
                  title="Cart"
                >
                  <span className="material-symbols-outlined text-text-body">shopping_cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-text-heading">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-text-muted">
                    expand_more
                  </span>
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-card-bg rounded-xl shadow-neu p-2 z-50">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-primary/5 transition"
                      >
                        <span className="material-symbols-outlined text-[20px]">person</span>
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-primary/5 transition"
                      >
                        <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                        Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-primary/5 transition"
                      >
                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                        Wishlist
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-primary/5 transition"
                        >
                          <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-1 border-border-warm" />
                      <button
                        onClick={() => {
                          setProfileOpen(false)
                          logout()
                          navigate('/')
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-error/5 text-error transition w-full"
                      >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-xs px-4 py-2">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-xs px-4 py-2">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-primary/5"
            >
              <span className="material-symbols-outlined">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-border-warm mt-2 pt-4 space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="neu-input pl-10 py-2.5"
              />
            </form>
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-text-body hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-text-body hover:text-primary"
            >
              Products
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
