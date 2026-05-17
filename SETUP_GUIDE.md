# 🚀 Trendify E-Commerce Platform - Complete Setup Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Environment Configuration](#environment-configuration)
7. [Running the Application](#running-the-application)
8. [API Documentation](#api-documentation)
9. [Project Structure](#project-structure)
10. [Features](#features)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## 📖 Overview

Trendify is a full-stack e-commerce platform with a customer-facing storefront and an admin dashboard. It features product browsing, cart management, Razorpay payment integration, order tracking, wishlists, reviews, and a full admin panel for managing products, orders, and users.

**Design System:** Warm neumorphic design with a linen background (`#FAF0E6`), coral primary (`#FF6B6B`), teal secondary (`#4ECDC4`), Inter + Poppins fonts, and Google Material Symbols icons.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 6, Tailwind CSS 3.4, React Router 6 |
| State | React Context API (Auth + Cart) |
| HTTP | Axios with JWT interceptors |
| Backend | Express 5.1, Node.js (ES Modules) |
| Database | MongoDB with Mongoose 9 |
| Auth | JWT (7-day expiry) + bcrypt |
| Payments | Razorpay |
| Images | Cloudinary + Multer |
| Notifications | react-hot-toast |

---

## ✅ Prerequisites

- **Node.js** v16+ — [Download](https://nodejs.org/)
- **MongoDB** v5+ — [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
- **npm** (comes with Node.js)

Verify installations:
```bash
node --version
npm --version
```

---

## 🔧 Backend Setup

### 1. Navigate & Install
```bash
cd Trendify/backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` folder:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/trendify
JWT_SECRET=your_secure_random_secret_here

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

> See `backend/.env.example` for a template.

### 3. Create Admin User
```bash
node checkAndCreateAdmin.js
```

**Default Admin Credentials:** `admin@example.com` / `admin123`

⚠️ Change these in production!

### 4. Start Server
```bash
npm run dev    # Development (auto-reload)
npm start      # Production
```

✅ Backend runs on **http://localhost:5000**

---

## 🎨 Frontend Setup

### 1. Navigate & Install
```bash
cd Trendify/frontend
npm install
```

### 2. Configure Environment (Optional)
Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

> The Vite dev server proxies `/api` requests to `http://localhost:5000` by default, so this step is optional for local development. See `frontend/.env.example`.

### 3. Start Dev Server
```bash
npm run dev
```

✅ Frontend runs on **http://localhost:5173**

### 4. Production Build
```bash
npm run build    # outputs to frontend/dist/
npm run preview  # preview production build locally
```

---

## 🌐 Running the Application

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd Trendify/backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd Trendify/frontend
npm run dev
```

### Access Points
| Page | URL |
|---|---|
| Homepage | http://localhost:5173 |
| Customer Login | http://localhost:5173/login |
| Customer Signup | http://localhost:5173/signup |
| Admin Login | http://localhost:5173/admin/login |
| Admin Dashboard | http://localhost:5173/admin/dashboard |

---

## 📚 API Documentation

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | User login |
| POST | `/api/auth/logout` | Bearer | Logout user |
| POST | `/api/admin/login` | — | Admin login |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | — | Get all products |
| GET | `/api/products/:id` | — | Get product by ID |
| GET | `/api/products/search?q=` | — | Search products |
| GET | `/api/products/filter?category=&minPrice=&maxPrice=` | — | Filter products |
| GET | `/api/products/trending` | — | Get trending products |
| POST | `/api/products` | Admin | Create product (multipart/form-data) |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | Bearer | Get user's cart |
| POST | `/api/cart/add` | Bearer | Add item to cart |
| PUT | `/api/cart/update` | Bearer | Update item quantity |
| DELETE | `/api/cart/remove/:productId` | Bearer | Remove item |
| DELETE | `/api/cart/clear` | Bearer | Clear entire cart |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | Bearer | Place order |
| GET | `/api/orders/my` | Bearer | Get user's orders |
| GET | `/api/orders/:id` | Bearer | Get order details |
| GET | `/api/orders` | Admin | Get all orders |
| PUT | `/api/orders/:id/status` | Admin | Update order status |

### Payments (Razorpay)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payment/create` | Bearer | Create Razorpay order |
| POST | `/api/payment/verify` | Bearer | Verify payment signature |

### Wishlist
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/wishlist` | Bearer | Get wishlist |
| POST | `/api/wishlist/add` | Bearer | Add to wishlist |
| DELETE | `/api/wishlist/remove/:productId` | Bearer | Remove from wishlist |

### Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/reviews/:productId` | — | Get product reviews |
| POST | `/api/reviews` | Bearer | Add review |
| DELETE | `/api/reviews/:id` | Admin | Delete review |

### User Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/user/profile` | Bearer | Get profile |
| PUT | `/api/user/profile` | Bearer | Update profile |
| PUT | `/api/user/change-password` | Bearer | Change password |
| GET | `/api/user/addresses` | Bearer | Get saved addresses |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/dashboard` | Admin | Dashboard stats |
| GET | `/api/admin/users` | Admin | List all users |
| GET | `/api/admin/users/:id` | Admin | Get user details |

> **Auth Legend:** `—` = public, `Bearer` = user JWT token, `Admin` = admin JWT token.
> All tokens sent via `Authorization: Bearer <token>` header.

---

## 📦 Project Structure

```
Trendify/
├── backend/
│   ├── config/              # DB, Cloudinary, Razorpay config
│   ├── controllers/         # Route handlers
│   │   ├── admin/           # Admin auth & dashboard
│   │   ├── auth/            # Login, register, logout
│   │   ├── cart/            # Cart CRUD
│   │   ├── order/           # Order management
│   │   ├── payment/         # Razorpay integration
│   │   ├── product/         # Product CRUD
│   │   ├── review/          # Review management
│   │   ├── user/            # Profile & addresses
│   │   └── wishlist/        # Wishlist operations
│   ├── middleware/           # Auth, admin, error, rate-limit, upload
│   ├── models/              # Mongoose schemas (User, Product, Order, Cart, Wishlist, Contact)
│   ├── routes/              # Express route definitions
│   ├── validators/          # express-validator schemas
│   ├── app.js               # Express app setup, CORS, routes
│   ├── server.js            # Entry point, DB connect, listen
│   └── .env.example         # Environment template
│
└── frontend/
    ├── src/
    │   ├── components/       # Reusable UI (Navbar, Footer, ProductCard, Pagination, etc.)
    │   ├── context/          # AuthContext, CartContext (React Context API)
    │   ├── layouts/          # MainLayout (customer), AdminLayout (dashboard)
    │   ├── pages/            # All page components
    │   │   ├── Home.jsx
    │   │   ├── Products.jsx
    │   │   ├── ProductDetails.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Login.jsx / Signup.jsx
    │   │   ├── Orders.jsx / OrderDetails.jsx
    │   │   ├── Profile.jsx / Wishlist.jsx
    │   │   ├── SearchResults.jsx
    │   │   ├── PaymentSuccess.jsx / PaymentFailed.jsx
    │   │   └── admin/ (Dashboard, ProductList, AddProduct, EditProduct,
    │   │              OrdersList, AdminOrderDetails, UsersList, AdminLogin)
    │   ├── services/
    │   │   └── api.js        # Axios instance + all API functions
    │   ├── App.jsx           # Routes with lazy loading
    │   ├── main.jsx          # React root + providers
    │   └── index.css         # Tailwind + custom neumorphic classes
    ├── index.html
    ├── vite.config.js        # Vite config + API proxy
    ├── tailwind.config.js    # Custom theme (colors, fonts, shadows)
    ├── postcss.config.js
    ├── package.json
    └── .env.example          # Environment template
```

---

## 🎯 Features

### Customer Storefront
- **Homepage** — Hero banner, trending products, category sections, newsletter signup
- **Product Browsing** — Grid listing with category/price/rating filters, sorting, pagination
- **Product Details** — Image gallery, ratings, reviews, size/color selectors, add to cart/wishlist
- **Search** — Real-time product search with results page
- **Shopping Cart** — Add/update/remove items, quantity controls, subtotal calculation
- **Checkout** — Shipping address form, payment method selection (COD or Razorpay)
- **Razorpay Payments** — Online payments with success/failure pages
- **Order Tracking** — Order history, detailed order view with status timeline
- **Wishlist** — Save products for later, move to cart
- **User Profile** — View/edit profile info, change password
- **Authentication** — Login, signup, JWT-based protected routes, auto-logout on token expiry

### Admin Dashboard
- **Dashboard Overview** — Total users, orders, products, revenue, order status breakdown, recent orders, low stock alerts
- **Product Management** — Full CRUD with image upload via Cloudinary
- **Order Management** — View all orders, update status (Processing → Shipped → Delivered → Cancelled)
- **User Management** — View all users and user details

### Technical Features
- **Lazy Loading** — All pages loaded via `React.lazy()` + `Suspense` for fast initial load
- **Code Splitting** — Vite produces 28 optimized chunks (~79KB gzip total)
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Neumorphic Design System** — Consistent warm shadows, rounded cards, soft inputs
- **Error Handling** — Toast notifications, fallback UI, API error interceptors
- **Security** — JWT auth, bcrypt passwords, CORS, input validation, rate limiting

---

## 🚀 Deployment

### Frontend (Vercel / Netlify)

1. **Build the project:**
   ```bash
   cd Trendify/frontend
   npm run build
   ```

2. **Deploy `dist/` folder** to Vercel, Netlify, or any static host.

3. **Environment variables to set:**
   - `VITE_API_URL` = your backend URL (e.g., `https://api.trendify.com/api`)
   - `VITE_RAZORPAY_KEY_ID` = your Razorpay public key

4. **For Vercel**, create `frontend/vercel.json`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

### Backend (Render / Railway / VPS)

1. **Set all environment variables** from `.env.example` on your host.

2. **Update CORS origins** in `backend/app.js` to include your production frontend URL:
   ```javascript
   origin: ["https://your-frontend-domain.com"]
   ```

3. **Start command:** `node server.js` or `npm start`

4. **Ensure MongoDB is accessible** — use MongoDB Atlas for cloud deployments.

### Environment Variables Checklist

| Variable | Where | Required |
|----------|-------|----------|
| `MONGO_URI` | Backend | Yes |
| `JWT_SECRET` | Backend | Yes |
| `PORT` | Backend | Yes (default: 5000) |
| `NODE_ENV` | Backend | Yes |
| `CLOUDINARY_CLOUD_NAME` | Backend | Yes (for image uploads) |
| `CLOUDINARY_API_KEY` | Backend | Yes |
| `CLOUDINARY_API_SECRET` | Backend | Yes |
| `RAZORPAY_KEY_ID` | Backend | Yes (for payments) |
| `RAZORPAY_KEY_SECRET` | Backend | Yes |
| `VITE_API_URL` | Frontend | Production only |
| `VITE_RAZORPAY_KEY_ID` | Frontend | Yes (for payments) |

---

## 🔐 Security Best Practices

1. **Change default admin credentials** immediately after setup
2. **Use a strong random JWT_SECRET** (at least 32 characters)
3. **Enable HTTPS** in production
4. **Update CORS origins** — only allow your production frontend domain
5. **Never commit `.env` files** — they are gitignored
6. **Use MongoDB Atlas** with IP whitelisting for cloud deployments
7. **Rate limiting** is already configured for auth endpoints

---

## 🐛 Troubleshooting

### Backend won't start
- Ensure MongoDB is running (`mongod` or check Atlas connection)
- Verify `.env` file exists with all required variables
- Check port 5000 isn't already in use
- Run `npm install` to ensure dependencies are present

### Frontend shows blank page
- Open browser DevTools console for errors
- Verify backend is running on http://localhost:5000
- Check that Vite proxy is working (API calls should not show CORS errors)

### Login fails
- Run `node checkAndCreateAdmin.js` to ensure admin user exists
- Check the Network tab for the actual API response
- Verify `JWT_SECRET` is set in backend `.env`

### CORS errors
- Ensure backend `app.js` includes your frontend origin in the CORS config
- Default allowed origins: `localhost:5173`, `localhost:5174`, `localhost:3000`

### Payments not working
- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are correct
- Ensure `VITE_RAZORPAY_KEY_ID` matches the backend key
- Test with Razorpay test mode credentials first

### Images not uploading
- Verify all three Cloudinary credentials are set correctly
- Check Cloudinary dashboard for upload limits

---

## 📄 License

This project is for educational purposes.

---

**Happy Coding! 🚀**
