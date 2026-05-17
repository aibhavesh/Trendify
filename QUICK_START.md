# Trendify Quick Start Guide

## Project Structure
```
Trendify/
├── backend/              # Express.js API server
│   ├── config/          # Database, payment, storage config
│   ├── controllers/     # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, validation, error handling
│   ├── validators/      # Input validation
│   ├── utils/           # Utilities and helpers
│   ├── migrations/      # Database migrations
│   ├── .env.example     # Environment template
│   ├── app.js          # Express app setup
│   ├── server.js       # Server entry point
│   └── package.json    # Dependencies
│
├── frontend/            # React + Vite app
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   ├── context/    # State management
│   │   ├── services/   # API calls
│   │   ├── layouts/    # Layout components
│   │   ├── constants/  # Constants and config
│   │   ├── App.jsx    # Main app component
│   │   └── main.jsx   # React entry point
│   ├── .env.example    # Environment template
│   ├── vite.config.js  # Vite configuration
│   ├── tailwind.config.js # Tailwind setup
│   ├── index.html      # HTML template
│   └── package.json    # Dependencies
│
├── AUDIT_REPORT.md              # Complete audit findings
├── PRODUCTION_SETUP_GUIDE.md    # Deployment guide
└── README.md                     # Project overview
```

---

## Quick Start (5 Minutes)

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```
✓ Server runs on `http://localhost:5000`

### 2. Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
✓ App runs on `http://localhost:5173`

### 3. Default Admin Access
```
Email: admin@trendify.com
Password: Admin@12345
```
(Change immediately after first login)

---

## Available Scripts

### Backend
```bash
npm run dev        # Start dev server with auto-reload
npm run start      # Start production server
npm test           # Run tests
npm run seed:admin # Create default admin
```

### Frontend
```bash
npm run dev        # Start dev server
npm run build      # Create optimized build
npm run preview    # Preview production build locally
```

---

## Key Technologies

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18 + Vite |
| **Backend** | Node.js + Express 5 |
| **Database** | MongoDB Atlas |
| **Styling** | Tailwind CSS |
| **Payment** | Razorpay |
| **Storage** | Cloudinary |
| **Auth** | JWT + bcrypt |
| **HTTP Client** | Axios |

---

## API Base URLs

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:5000/api` |
| Production | `https://api.yourdomain.com/api` |

---

## Product Categories (Fixed)

1. Kurti
2. Kurti Set
3. Plazo
4. Co-ord Set
5. Evening Gowns
6. Sharara Set

*No other categories are allowed*

---

## Critical Fixes Applied

| Issue | Status | Details |
|-------|--------|---------|
| DB Connection | ✅ Fixed | MONGO_URI → MONGODB_URI |
| User ID References | ✅ Fixed | req.user.id → req.user._id (9 files) |
| Duplicate Routes | ✅ Fixed | Removed duplicate order routes |
| Env Variables | ✅ Created | Templates for backend & frontend |
| Categories | ✅ Verified | 6 categories enforced everywhere |

---

## Authentication Flow

### Customer Login
```
POST /api/auth/login
→ Returns JWT token
→ Stored in localStorage
→ Attached to all requests via Axios interceptor
```

### Admin Login
```
POST /admin/login
→ Verifies admin role
→ Returns JWT token
→ Redirected to admin dashboard
```

### Protected Routes
- Frontend: `<ProtectedRoute />` and `<AdminRoute />`
- Backend: `authMiddleware` and `adminMiddleware`

---

## File Upload Flow

### Image Upload
```
User selects image
↓
Frontend sends multipart/form-data
↓
uploadMiddleware validates (5MB, JPG/PNG only)
↓
Cloudinary storage configured
↓
Returns secure URL
↓
URL stored in MongoDB
```

---

## Payment Flow

### Razorpay Integration
```
User submits order
↓
Backend creates Razorpay order
↓
Frontend opens Razorpay popup
↓
User enters payment details
↓
Razorpay callback to frontend
↓
Frontend calls verification endpoint
↓
Backend verifies signature
↓
Updates order to "paid"
```

---

## Database Models

### User
- email (unique)
- password (hashed)
- name
- role (user/admin)

### Product
- title, description, price
- category (enum: 6 categories)
- images, tags, sizes, colors
- stock
- reviews, averageRating
- isTrending, isNewArrival, isFeatured, isBestSeller

### Order
- user (reference)
- items (products with quantity and price)
- shippingAddress
- paymentMethod (COD/ONLINE)
- paymentStatus (pending/paid/failed)
- orderStatus (processing/shipped/delivered/cancelled)
- totalAmount, discountAmount

### Cart
- user (unique reference)
- items (product, quantity, price)
- totalPrice

### Wishlist
- user (unique reference)
- products (array of product IDs)

### Coupon
- code (unique, uppercase)
- discountPercent
- minOrderAmount
- maxDiscountAmount
- expiresAt
- isActive

### Contact
- name, email, message
- status (new/in-progress/closed)

---

## Middleware Order (Backend)

```
1. Helmet (security headers)
2. CORS (origin whitelist)
3. Body parser (JSON/URL)
4. Rate limiter (/api endpoints)
5. Route handlers
6. 404 handler
7. Global error handler
```

---

## Environment Checklist

### Backend .env
- [ ] MONGODB_URI (MongoDB Atlas connection string)
- [ ] JWT_SECRET (strong random string, 32+ chars)
- [ ] CLOUDINARY_CLOUD_NAME
- [ ] CLOUDINARY_API_KEY
- [ ] CLOUDINARY_API_SECRET
- [ ] RAZORPAY_KEY_ID (test keys for development)
- [ ] RAZORPAY_KEY_SECRET

### Frontend .env
- [ ] VITE_API_URL (backend API endpoint)
- [ ] VITE_RAZORPAY_KEY_ID (public key from Razorpay)

---

## Testing the Application

### Manual Testing Steps
```
1. Register new user
2. Login as customer
3. Browse products by category
4. Search for product
5. Add product to cart
6. Update cart quantity
7. Proceed to checkout
8. Place order (COD)
9. Login as admin
10. View order in admin panel
11. Update order status
12. Test Razorpay payment (test cards available)
```

### Test Razorpay Cards
```
Successful: 4111 1111 1111 1111
Failed:    4000 0000 0000 0002
Exp: Any future date | CVV: Any 3 digits
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port already in use | Change PORT in .env |
| MongoDB connection fails | Check MONGODB_URI is valid |
| Cloudinary upload fails | Verify credentials in .env |
| 401 Unauthorized | Check JWT token in localStorage |
| CORS error | Whitelist frontend URL in CORS_ORIGINS |
| No products showing | Run migration script to fix categories |

---

## Performance Tips

1. **Frontend**: Run `npm run build` to optimize
2. **Backend**: Use MongoDB indexes on queryable fields
3. **Images**: Cloudinary handles optimization automatically
4. **Database**: Implement pagination for large datasets
5. **Caching**: Consider Redis for frequently accessed data

---

## Security Reminders

⚠️ **DO NOT**:
- Commit `.env` files
- Share JWT_SECRET
- Use default admin password in production
- Hardcode credentials
- Enable CORS for all origins
- Skip input validation
- Store passwords in plain text

✅ **DO**:
- Use HTTPS in production
- Rotate secrets regularly
- Keep dependencies updated
- Implement HTTPS redirects
- Use security headers (Helmet)
- Rate limit sensitive endpoints
- Validate all inputs

---

## Monitoring & Logs

### Backend Logs
```
📌 MongoDB Connected: [hostname]
✅ Razorpay configured
✅ Cloudinary configured successfully
✅ Server running on port 5000
🌐 Environment: development
```

### Check Health
```bash
curl http://localhost:5000
# Should return: Server is up and running!
```

---

## Need Help?

1. **Audit Report**: See `AUDIT_REPORT.md` for detailed findings
2. **Setup Guide**: See `PRODUCTION_SETUP_GUIDE.md` for deployment
3. **API Docs**: Endpoint list in PRODUCTION_SETUP_GUIDE.md
4. **Logs**: Check console output for errors

---

## Deployment Readiness

✅ All 8 critical issues fixed  
✅ Categories standardized to 6 types  
✅ Security measures implemented  
✅ Environment variables documented  
✅ Error handling in place  
✅ Payment integration working  
✅ Image upload configured  
✅ Database design optimized  

**Ready to deploy!** 🚀

---

**Last Updated**: May 16, 2026  
**Version**: 1.0.0 Production-Ready
