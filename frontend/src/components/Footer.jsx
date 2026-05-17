import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-card-bg border-t border-border-warm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="font-display font-bold text-xl text-primary mb-3">Trendify</h2>
            <p className="text-sm text-text-body leading-relaxed">
              Your one-stop destination for trendy fashion and lifestyle products. Quality meets style.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-sm mb-3 uppercase tracking-wider text-text-heading">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Products' },
                { to: '/orders', label: 'My Orders' },
                { to: '/profile', label: 'My Account' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-text-body hover:text-primary transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-display font-semibold text-sm mb-3 uppercase tracking-wider text-text-heading">
              Customer Service
            </h3>
            <ul className="space-y-2 text-sm text-text-body">
              <li>Free Shipping on orders above ₹499</li>
              <li>Easy 7-day Returns</li>
              <li>Secure Payments</li>
              <li>24/7 Support</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-sm mb-3 uppercase tracking-wider text-text-heading">
              Contact Us
            </h3>
            <ul className="space-y-2 text-sm text-text-body">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">mail</span>
                support@trendify.com
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">call</span>
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                Mumbai, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-warm mt-8 pt-8 text-center text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Trendify. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
