# Trendify E-Commerce Production Setup Guide

## Project Overview
Trendify is a MERN stack (MongoDB, Express, React, Node.js) clothing e-commerce application with the following components:
- **Backend**: Express.js API with JWT authentication
- **Frontend**: React + Vite with Tailwind CSS
- **Database**: MongoDB Atlas
- **Payment**: Razorpay integration
- **Storage**: Cloudinary image hosting
- **Authentication**: JWT tokens with secure password hashing

## Product Categories
The system supports exactly 6 product categories:
1. Kurti
2. Kurti Set
3. Plazo
4. Co-ord Set
5. Evening Gowns
6. Sharara Set

**Important**: All products must belong to one of these 6 categories. No other categories are permitted.

---

## BACKEND SETUP

### Prerequisites
- Node.js v18+ and npm v9+
- MongoDB Atlas account
- Cloudinary account
- Razorpay account (test mode for development)
- Git

### Step 1: Initial Setup

```bash
cd backend
npm install
```

### Step 2: Environment Configuration

Create a `.env` file in the `backend` folder using the template:

```env
# ===== Server Configuration =====
PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# ===== MongoDB =====
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trendify

# ===== JWT =====
JWT_SECRET=your_jwt_secret_key_here_make_it_strong_and_long

# ===== Default Admin Credentials =====
SEED_DEFAULT_ADMIN=true
RESET_DEFAULT_ADMIN_PASSWORD=false
DEFAULT_ADMIN_NAME=Store Admin
DEFAULT_ADMIN_EMAIL=admin@trendify.com
DEFAULT_ADMIN_PASSWORD=Admin@12345

# ===== Cloudinary Configuration =====
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ===== Razorpay Payment Gateway =====
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# ===== Client URL (for redirects after payment) =====
CLIENT_URL=http://localhost:5173
```

### Step 3: Get Credentials

#### MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Update `MONGODB_URI` in `.env`

#### Cloudinary
1. Go to https://cloudinary.com
2. Sign up for free account
3. Go to Dashboard → Settings
4. Copy: Cloud Name, API Key, API Secret
5. Update Cloudinary variables in `.env`

#### Razorpay
1. Go to https://dashboard.razorpay.com/
2. Sign up and verify
3. Navigate to Settings → API Keys
4. Copy Key ID and Key Secret (use test mode keys for development)
5. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`

### Step 4: Database Initialization

The default admin account is automatically created on server start if `SEED_DEFAULT_ADMIN=true`.

To clean up invalid product categories (if needed):
```bash
node backend/migrations/updateCategories.js
```

### Step 5: Start Backend Server

```bash
npm run dev
```

Expected output:
```
🚀 Initializing Trendify Backend Services...

✅ MongoDB Connected: cluster.mongodb.net
✅ Razorpay configured and ready for payments.
✅ Cloudinary configured successfully for cloud: your_cloud_name

✅ Server running on port 5000
🌐 Environment: development

🎉 Trendify Backend is ready!
```

### Backend API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /admin/login` - Admin login

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/trending` - Get trending products
- `GET /api/products/filter` - Filter products
- `GET /api/products/search` - Search products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

#### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update` - Update cart quantity
- `DELETE /api/cart/remove/:productId` - Remove from cart

#### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/all` - Get all orders (admin)
- `PUT /api/orders/update-status/:id` - Update order status (admin)

#### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

#### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/add` - Add to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove from wishlist

#### Reviews
- `POST /api/reviews/:productId` - Add product review

#### Admin Dashboard
- `GET /admin/dashboard` - Dashboard stats
- `GET /admin/users` - List users (admin)
- `GET /admin/sales-report` - Sales report (admin)

#### Coupons
- `POST /api/coupons/apply` - Apply coupon
- `GET /api/coupons` - List coupons (admin)
- `POST /api/coupons` - Create coupon (admin)
- `PUT /api/coupons/:id` - Update coupon (admin)
- `DELETE /api/coupons/:id` - Delete coupon (admin)

---

## FRONTEND SETUP

### Prerequisites
- Node.js v18+ and npm v9+
- Modern web browser with ES2020+ support

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Environment Configuration

Create a `.env` file in the `frontend` folder:

```env
# Backend API Configuration
VITE_API_URL=http://localhost:5000/api

# Razorpay Public Key (test mode)
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

**Note**: For development, Vite proxy (configured in `vite.config.js`) automatically forwards `/api` calls to the backend.

### Step 3: Start Development Server

```bash
npm run dev
```

Access the application at: `http://localhost:5173`

### Step 4: Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder ready for deployment.

### Frontend Features

#### Customer Side
- ✓ Browse products by category
- ✓ Search and filter products
- ✓ View product details and reviews
- ✓ Add/remove from wishlist
- ✓ Manage shopping cart
- ✓ Secure checkout with address entry
- ✓ Razorpay payment integration (online)
- ✓ Cash on Delivery (COD) option
- ✓ Apply coupon codes
- ✓ Order history and tracking
- ✓ User profile management

#### Admin Side
- ✓ Admin login with role-based access
- ✓ Dashboard with key metrics
- ✓ Product management (add/edit/delete)
- ✓ Multiple image upload to Cloudinary
- ✓ Order management and status updates
- ✓ User management
- ✓ Coupon management
- ✓ Sales reports and analytics

---

## CRITICAL FIXES APPLIED

### Backend Issues Fixed
1. **Database Connection**: Fixed `MONGO_URI` → `MONGODB_URI` with fallback support
2. **User ID Consistency**: Fixed all `req.user.id` → `req.user._id` references
3. **Route Deduplication**: Removed duplicate POST and PUT routes in order routes
4. **Error Handling**: Proper error handler middleware in place

### Environment Variables
- Created comprehensive `.env.example` files for both backend and frontend
- All required variables documented with descriptions
- Support for both development and production setups

---

## TESTING CHECKLIST

### Pre-Launch Tests

#### Backend
- [ ] `npm install` completes without errors
- [ ] `.env` file configured with valid credentials
- [ ] `npm run dev` starts without errors
- [ ] MongoDB connection successful
- [ ] Cloudinary configuration verified
- [ ] Razorpay credentials working
- [ ] Admin account automatically created

#### Frontend
- [ ] `npm install` completes without errors
- [ ] `.env` file configured correctly
- [ ] `npm run dev` starts without errors
- [ ] Frontend loads at `http://localhost:5173`
- [ ] API calls working through Vite proxy
- [ ] No console errors on page load

#### Feature Tests
- [ ] **Authentication**: Register and login work
- [ ] **Products**: Can view all products, filter by category, search
- [ ] **Cart**: Can add/remove items, update quantities
- [ ] **Checkout**: Can place order with COD
- [ ] **Payment**: Razorpay payment flow completes (test mode)
- [ ] **Admin**: Can login as admin, access dashboard
- [ ] **Admin Products**: Can create/edit/delete products with image upload
- [ ] **Admin Orders**: Can view orders and update status
- [ ] **Categories**: Only 6 categories appear in dropdown/filters

#### Security Tests
- [ ] Unauthorized users cannot access admin routes
- [ ] JWT tokens required for protected routes
- [ ] Passwords are hashed (not stored in plain text)
- [ ] CORS properly configured
- [ ] Rate limiting active on login endpoint

---

## DEPLOYMENT

### Backend Deployment (Node.js + Express)

#### Option 1: Heroku
```bash
heroku create your-app-name
git push heroku main
```

#### Option 2: Railway
1. Connect GitHub repo to Railway
2. Set environment variables in dashboard
3. Deploy

#### Option 3: AWS EC2
1. Launch EC2 instance (Ubuntu)
2. Install Node.js and npm
3. Clone repository
4. Create `.env` with production credentials
5. Run `npm run build` (if applicable)
6. Start with PM2: `pm2 start server.js --name trendify-backend`

**Production .env Settings**:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://prod_user:prod_password@prod_cluster.mongodb.net/trendify
# ... other production credentials
```

### Frontend Deployment (React + Vite)

#### Option 1: Vercel
```bash
npm install -g vercel
vercel
```

#### Option 2: Netlify
1. Build: `npm run build`
2. Connect `dist/` folder to Netlify
3. Set environment variables in Netlify dashboard

#### Option 3: AWS S3 + CloudFront
1. Build: `npm run build`
2. Upload `dist/` to S3
3. Create CloudFront distribution
4. Configure custom domain

**Production .env Settings**:
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

---

## MONITORING & MAINTENANCE

### Logs to Monitor
- Backend error logs for database/API issues
- Razorpay payment failures
- Cloudinary upload errors
- MongoDB connection issues

### Regular Tasks
- [ ] Monthly backup of MongoDB database
- [ ] Review admin access logs
- [ ] Check Razorpay transaction reports
- [ ] Monitor Cloudinary usage and quotas
- [ ] Update npm dependencies monthly
- [ ] Security patches for dependencies

### Performance Optimization
- Enable MongoDB query indexing
- Implement pagination for product lists
- Cache trending products
- Optimize image sizes before upload
- Use CDN for static assets

---

## TROUBLESHOOTING

### Backend Won't Start
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution: Check MongoDB connection string in .env
```

### Products Not Showing
```
Error: invalid category error

Solution: Run migration script to fix invalid categories
node backend/migrations/updateCategories.js
```

### Payment Not Working
```
Error: Razorpay not initialized

Solution: Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env
```

### Image Upload Failing
```
Error: Cloudinary upload error

Solution: Check CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET in .env
```

### CORS Error
```
Error: No 'Access-Control-Allow-Origin' header

Solution: Verify CORS_ORIGINS in backend .env
```

---

## SECURITY BEST PRACTICES

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use strong JWT secrets** - Min 32 characters
3. **Enable HTTPS in production** - Use SSL certificates
4. **Validate all inputs** - Server-side validation required
5. **Rate limit authentication** - Already configured
6. **Use environment variables** - For all sensitive data
7. **Keep dependencies updated** - Run `npm audit fix` regularly
8. **Secure admin credentials** - Change default password immediately

---

## SUPPORT & DOCUMENTATION

For more information:
- Backend API documentation: See endpoint list above
- Frontend components: Check `frontend/src/components/`
- Database models: Check `backend/models/`
- Configuration files: Check `vite.config.js` and `tailwind.config.js`

---

**Application is ready for production deployment!**
