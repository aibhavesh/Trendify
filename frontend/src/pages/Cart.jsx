import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, loading, updateQuantity, removeItem, cartCount } = useCart()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="material-symbols-outlined text-7xl text-text-muted mb-4">shopping_cart</span>
        <h2 className="font-display font-bold text-2xl text-text-heading mb-2">Your cart is empty</h2>
        <p className="text-text-muted text-sm mb-6">Add some products to get started!</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display font-bold text-3xl text-text-heading mb-8">
        Shopping Cart <span className="text-text-muted text-lg font-normal">({cartCount} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const product = item.product || {}
            const imgSrc = product.images?.[0] || `https://placehold.co/200x200/FAF0E6/FF6B6B?text=Product`
            return (
              <div key={item._id || product._id} className="neu-card flex gap-4">
                <Link to={`/products/${product._id}`} className="flex-shrink-0">
                  <img
                    src={imgSrc}
                    alt={product.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-display font-semibold text-sm truncate hover:text-primary transition">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-text-muted capitalize mt-0.5">{product.category}</p>
                  <p className="font-display font-bold text-base mt-2">
                    ₹{(item.price || product.price || 0).toLocaleString('en-IN')}
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    {/* Qty controls */}
                    <div className="flex items-center shadow-neu-sm rounded overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product._id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-primary/5"
                      >
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-primary/5"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(product._id)}
                      className="text-error hover:text-error/80 transition flex items-center gap-1 text-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                      Remove
                    </button>
                  </div>
                </div>

                <p className="font-display font-bold text-sm self-start">
                  ₹{((item.price || product.price || 0) * item.quantity).toLocaleString('en-IN')}
                </p>
              </div>
            )
          })}
        </div>

        {/* Order summary */}
        <div>
          <div className="neu-card sticky top-24">
            <h2 className="font-display font-bold text-lg mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-body">Subtotal ({cartCount} items)</span>
                <span className="font-medium">₹{(cart.totalPrice || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-body">Shipping</span>
                <span className="font-medium text-success">
                  {cart.totalPrice >= 499 ? 'Free' : '₹49'}
                </span>
              </div>
              <hr className="border-border-warm" />
              <div className="flex justify-between text-base">
                <span className="font-display font-bold">Total</span>
                <span className="font-display font-bold">
                  ₹{((cart.totalPrice || 0) + (cart.totalPrice >= 499 ? 0 : 49)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full mt-6 py-3 text-center">
              Proceed to Checkout
            </Link>

            <Link to="/products" className="block text-center text-sm text-primary mt-3 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
