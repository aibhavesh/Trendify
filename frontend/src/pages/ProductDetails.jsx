import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchProductById, addReview } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchProductById(id)
      .then((res) => setProduct(res.data.data ?? res.data.product ?? res.data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (!isAuthenticated) return navigate('/login')
    addToCart(product._id, qty)
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) return navigate('/login')
    setReviewLoading(true)
    try {
      await addReview(id, { rating, comment })
      toast.success('Review submitted!')
      const res = await fetchProductById(id)
      setProduct(res.data.data ?? res.data.product ?? res.data)
      setComment('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-text-muted font-display text-lg">Product not found</p>
        <Link to="/products" className="btn-primary mt-4 inline-block">
          Browse Products
        </Link>
      </div>
    )
  }

  const images = product.images?.length > 0
    ? product.images
    : [`https://placehold.co/600x600/FAF0E6/FF6B6B?text=${encodeURIComponent(product.title?.slice(0, 12))}`]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link to="/" className="hover:text-primary transition">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary transition">Products</Link>
        <span>/</span>
        <span className="text-text-heading font-medium truncate">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="neu-card p-2 mb-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-linen">
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    i === selectedImage ? 'border-primary shadow-neu-sm' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">{product.category}</span>
          <h1 className="font-display font-bold text-3xl text-text-heading mt-2">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className="material-symbols-outlined text-[20px]"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                    color: s <= Math.round(product.averageRating || 0) ? '#FF7F50' : '#e6d8cb',
                  }}
                >
                  star
                </span>
              ))}
            </div>
            <span className="text-sm text-text-muted">
              {product.averageRating?.toFixed(1) || '0.0'} ({product.reviews?.length || 0} reviews)
            </span>
          </div>

          <p className="font-display font-bold text-3xl text-text-heading mt-6">
            ₹{product.price?.toLocaleString('en-IN')}
          </p>

          <p className="text-text-body text-sm mt-4 leading-relaxed">{product.description}</p>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {product.tags.map((tag, i) => (
                <span key={i} className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Stock */}
          <div className="mt-6">
            {product.stock > 0 ? (
              <span className="text-success text-sm font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-error text-sm font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                Out of Stock
              </span>
            )}
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center shadow-neu-sm rounded-[0.75rem] overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-primary/5 transition"
              >
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>
              <span className="w-12 text-center font-medium text-sm">{qty}</span>
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-primary/5 transition"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary flex-1 py-3"
            >
              <span className="material-symbols-outlined mr-2 text-[20px]">shopping_cart</span>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <section className="mt-16">
        <h2 className="font-display font-bold text-2xl text-text-heading mb-6">
          Customer Reviews ({product.reviews?.length || 0})
        </h2>

        {/* Review form */}
        {isAuthenticated && (
          <form onSubmit={handleReview} className="neu-card mb-8 max-w-xl">
            <h3 className="font-display font-semibold text-sm mb-4">Write a Review</h3>
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="material-symbols-outlined text-[28px] transition"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                    color: s <= rating ? '#FF7F50' : '#e6d8cb',
                  }}
                >
                  star
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience…"
              rows={3}
              className="neu-input mb-4"
              required
            />
            <button type="submit" disabled={reviewLoading} className="btn-primary">
              {reviewLoading ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        )}

        {/* Reviews list */}
        <div className="space-y-4">
          {product.reviews?.length === 0 && (
            <p className="text-text-muted text-sm">No reviews yet. Be the first to review!</p>
          )}
          {product.reviews?.map((review, i) => (
            <div key={i} className="neu-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                  {review.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold">{review.user?.name || 'User'}</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className="material-symbols-outlined text-[14px]"
                        style={{
                          fontVariationSettings: "'FILL' 1",
                          color: s <= review.rating ? '#FF7F50' : '#e6d8cb',
                        }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
                <span className="ml-auto text-xs text-text-muted">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-text-body">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
