import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getWishlist, removeFromWishlistAPI } from '../services/api'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  const fetchData = () => {
    setLoading(true)
    getWishlist()
      .then((res) => {
        const wl = res.data.wishlist
        setItems(Array.isArray(wl?.products) ? wl.products : Array.isArray(wl) ? wl : [])
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  useEffect(fetchData, [])

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlistAPI(productId)
      setItems((prev) => prev.filter((p) => (p._id || p) !== productId))
      toast.success('Removed from wishlist')
    } catch {
      toast.error('Failed to remove')
    }
  }

  const handleMoveToCart = async (product) => {
    await addToCart(product._id)
    await removeFromWishlistAPI(product._id)
    setItems((prev) => prev.filter((p) => p._id !== product._id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display font-bold text-3xl text-text-heading mb-8">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-7xl text-text-muted mb-4">favorite</span>
          <h2 className="font-display font-bold text-xl text-text-heading mb-2">Wishlist is empty</h2>
          <p className="text-text-muted text-sm mb-6">Save products you love for later</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => {
            const imgSrc = product.images?.[0] || `https://placehold.co/400x400/FAF0E6/FF6B6B?text=Product`
            return (
              <div key={product._id} className="neu-card group">
                <Link to={`/products/${product._id}`} className="block mb-3">
                  <div className="aspect-square rounded-lg overflow-hidden bg-linen">
                    <img
                      src={imgSrc}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                </Link>
                <h3 className="font-display font-semibold text-sm truncate">{product.title}</h3>
                <p className="font-display font-bold text-lg mt-1">₹{product.price?.toLocaleString('en-IN')}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleMoveToCart(product)} className="btn-primary text-xs flex-1 py-2">
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="p-2 rounded-lg text-error hover:bg-error/10 transition"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
