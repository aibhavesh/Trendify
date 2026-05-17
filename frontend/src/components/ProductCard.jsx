import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { memo } from 'react'

const ProductCard = memo(function ProductCard({ product }) {
  const { addToCart } = useCart()

  const imgSrc =
    product.images?.[0] ||
    `https://placehold.co/400x400/FAF0E6/FF6B6B?text=${encodeURIComponent(product.title?.slice(0, 12) || 'Product')}`

  return (
    <div className="neu-card group hover:shadow-neu-sm transition-shadow duration-300">
      {/* Image */}
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden rounded-lg mb-4">
        <div className="aspect-square bg-linen rounded-lg overflow-hidden">
          <img
            src={imgSrc}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        {product.stock === 0 && (
          <span className="absolute top-2 left-2 bg-error text-white text-xs font-bold px-2 py-1 rounded-full">
            Out of Stock
          </span>
        )}
        {product.isNewArrival && product.stock > 0 && (
          <span className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full">
            New
          </span>
        )}
      </Link>

      {/* Info */}
      <Link to={`/products/${product._id}`}>
        <h3 className="font-display font-semibold text-sm text-text-heading truncate group-hover:text-primary transition">
          {product.title}
        </h3>
      </Link>
      <p className="text-xs text-text-muted mt-1 capitalize">{product.category}</p>

      {/* Rating */}
      {product.averageRating > 0 && (
        <div className="flex items-center gap-1 mt-1.5">
          <span className="material-symbols-outlined text-accent text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
          <span className="text-xs font-medium text-text-body">
            {product.averageRating?.toFixed(1)}
          </span>
          <span className="text-xs text-text-muted">
            ({product.reviews?.length || 0})
          </span>
        </div>
      )}

      {/* Price + Cart */}
      <div className="flex items-center justify-between mt-3">
        <span className="font-display font-bold text-lg text-text-heading">
          ₹{product.price?.toLocaleString('en-IN')}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault()
            if (product.stock > 0) addToCart(product._id)
          }}
          disabled={product.stock === 0}
          className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
          title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
        >
          <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
        </button>
      </div>
    </div>
  )
})

export default ProductCard
