import { Link } from 'react-router-dom'

export default function PaymentFailed() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="neu-card text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-error text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            cancel
          </span>
        </div>
        <h1 className="font-display font-bold text-2xl text-text-heading mb-2">Payment Failed</h1>
        <p className="text-text-muted text-sm mb-6">
          Something went wrong with your payment. Please try again or choose a different payment method.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/cart" className="btn-primary">Try Again</Link>
          <Link to="/orders" className="btn-secondary">View Orders</Link>
        </div>
      </div>
    </div>
  )
}
