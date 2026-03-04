import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { placeOrder, createPaymentOrder, verifyPayment } from '../services/api'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { cart, fetchCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const shipping = (cart.totalPrice || 0) >= 499 ? 0 : 49
  const total = (cart.totalPrice || 0) + shipping

  const handleChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Place order
      const orderData = {
        items: cart.items.map((i) => ({
          product: i.product._id || i.product,
          quantity: i.quantity,
          price: i.price || i.product.price,
        })),
        shippingAddress: address,
        paymentMethod,
        totalAmount: total,
      }

      const { data } = await placeOrder(orderData)
      const orderId = data.order?._id || data._id

      if (paymentMethod === 'ONLINE') {
        // Razorpay flow
        const { data: payData } = await createPaymentOrder(orderId)

        const options = {
          key: payData.key,
          amount: payData.paymentOrder.amount,
          currency: payData.paymentOrder.currency,
          name: 'Trendify',
          description: `Order #${orderId}`,
          order_id: payData.paymentOrder.id,
          handler: async (response) => {
            try {
              await verifyPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId,
              })
              await fetchCart()
              navigate('/payment/success')
            } catch {
              navigate('/payment/failed')
            }
          },
          prefill: {
            name: address.fullName,
            contact: address.phone,
          },
          theme: { color: '#FF6B6B' },
        }

        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', () => navigate('/payment/failed'))
        rzp.open()
      } else {
        // COD
        await fetchCart()
        toast.success('Order placed successfully!')
        navigate(`/orders/${orderId}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (!cart.items || cart.items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display font-bold text-3xl text-text-heading mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="neu-card">
              <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210' },
                  { name: 'address', label: 'Address', type: 'text', placeholder: '123 Main Street', full: true },
                  { name: 'city', label: 'City', type: 'text', placeholder: 'Mumbai' },
                  { name: 'state', label: 'State', type: 'text', placeholder: 'Maharashtra' },
                  { name: 'pincode', label: 'PIN Code', type: 'text', placeholder: '400001' },
                ].map((f) => (
                  <div key={f.name} className={f.full ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-text-body mb-1.5">{f.label}</label>
                    <input
                      name={f.name}
                      type={f.type}
                      value={address[f.name]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      required
                      className="neu-input"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment method */}
            <div className="neu-card">
              <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'COD', label: 'Cash on Delivery', icon: 'money' },
                  { value: 'ONLINE', label: 'Pay Online (Razorpay)', icon: 'credit_card' },
                ].map((m) => (
                  <label
                    key={m.value}
                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition ${
                      paymentMethod === m.value
                        ? 'bg-primary/10 shadow-neu-pressed'
                        : 'shadow-neu-sm hover:shadow-neu-pressed'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.value}
                      checked={paymentMethod === m.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-primary"
                    />
                    <span className="material-symbols-outlined text-[20px] text-primary">{m.icon}</span>
                    <span className="text-sm font-medium">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="neu-card sticky top-24">
              <h2 className="font-display font-bold text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                {cart.items.map((item) => {
                  const p = item.product || {}
                  return (
                    <div key={item._id || p._id} className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || 'https://placehold.co/60x60/FAF0E6/FF6B6B?text=P'}
                        alt={p.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{p.title}</p>
                        <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-medium">
                        ₹{((item.price || p.price || 0) * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )
                })}
              </div>

              <hr className="border-border-warm mb-3" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-body">Subtotal</span>
                  <span>₹{(cart.totalPrice || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-body">Shipping</span>
                  <span className={shipping === 0 ? 'text-success' : ''}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                <hr className="border-border-warm" />
                <div className="flex justify-between font-display font-bold text-base">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full mt-6 py-3">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing…
                  </span>
                ) : paymentMethod === 'ONLINE' ? (
                  'Pay Now'
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
