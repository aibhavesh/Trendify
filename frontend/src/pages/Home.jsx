import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchTrendingProducts, fetchProducts } from '../services/api'
import ProductCard from '../components/ProductCard'

const categories = [
  { name: 'T-Shirts', icon: 'checkroom' },
  { name: 'Shoes', icon: 'steps' },
  { name: 'Accessories', icon: 'watch' },
  { name: 'Bags', icon: 'backpack' },
  { name: 'Electronics', icon: 'devices' },
  { name: 'Home', icon: 'house' },
]

export default function Home() {
  const [trending, setTrending] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchTrendingProducts(), fetchProducts()])
      .then(([tRes, pRes]) => {
        setTrending(tRes.data.data ?? tRes.data.products ?? [])
        const all = pRes.data.data ?? pRes.data.products ?? []
        setProducts(all.slice(0, 8))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-linen to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 font-display">
              NEW SEASON 2026
            </span>
            <h1 className="font-display font-bold text-4xl md:text-6xl text-text-heading leading-tight">
              Discover Your <br />
              <span className="text-primary">Perfect Style</span>
            </h1>
            <p className="mt-4 text-text-body text-lg max-w-lg">
              Explore our curated collection of fashion and lifestyle products. Quality meets style at unbeatable prices.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary px-8 py-3 text-base">
                Shop Now
                <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
              </Link>
              <Link to="/products" className="btn-secondary px-8 py-3 text-base">
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display font-bold text-2xl text-text-heading mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name.toLowerCase())}`}
              className="neu-card flex flex-col items-center gap-3 py-6 hover:shadow-neu-sm transition-shadow group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
                <span className="material-symbols-outlined text-primary text-[28px]">{cat.icon}</span>
              </div>
              <span className="text-sm font-medium text-text-heading">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      {trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display font-bold text-2xl text-text-heading">
              Trending Now 🔥
            </h2>
            <Link to="/products" className="text-sm font-medium text-primary hover:underline">
              View All →
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12 text-text-muted">Loading…</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {trending.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Latest Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-bold text-2xl text-text-heading">
            Latest Arrivals
          </h2>
          <Link to="/products" className="text-sm font-medium text-primary hover:underline">
            View All →
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-12 text-text-muted">Loading…</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: 'local_shipping', title: 'Free Shipping', desc: 'On orders above ₹499' },
            { icon: 'replay', title: 'Easy Returns', desc: '7-day hassle-free returns' },
            { icon: 'lock', title: 'Secure Payments', desc: '100% secure checkout' },
          ].map((f) => (
            <div key={f.title} className="neu-card flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-[24px]">{f.icon}</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm">{f.title}</h3>
                <p className="text-xs text-text-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
