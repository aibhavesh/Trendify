import { Link } from 'react-router-dom'

export default function PaymentSuccess() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="neu-card text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-success text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <h1 className="font-display font-bold text-2xl text-text-heading mb-2">Payment Successful!</h1>
        <p className="text-text-muted text-sm mb-6">
          Your order has been placed successfully. You will receive a confirmation email shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/orders" className="btn-primary">View Orders</Link>
          <Link to="/products" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}
