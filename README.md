# 🛍️ Trendify

A full-stack e-commerce platform built with React, Node.js, Express, and MongoDB. Features a customer-facing storefront with product browsing, cart management, Razorpay payments, and order tracking, plus a complete admin dashboard for managing products, orders, and users.

## ✨ Features

### Customer Storefront
- **Product Browsing** — Filter by category, price, and rating with sorting and pagination
- **Search** — Real-time product search with dedicated results page
- **Shopping Cart** — Add, update, and remove items with quantity controls
- **Checkout & Payments** — Shipping address form, COD or Razorpay online payments
- **Order Tracking** — Order history with detailed status timeline
- **Wishlist** — Save products for later
- **Reviews & Ratings** — Leave reviews on purchased products
- **User Profiles** — Manage profile info and change password

### Admin Dashboard
- **Dashboard Overview** — Stats for users, orders, products, revenue, and low stock alerts
- **Product Management** — Full CRUD with image uploads via Cloudinary
- **Order Management** — View all orders and update status (Processing → Shipped → Delivered → Cancelled)
- **User Management** — View all registered users and their details

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 6, Tailwind CSS 3.4, React Router 6 |
| State Management | React Context API (Auth + Cart) |
| Backend | Express 5.1, Node.js (ES Modules) |
| Database | MongoDB with Mongoose 9 |
| Authentication | JWT + bcrypt |
| Payments | Razorpay |
| Image Hosting | Cloudinary + Multer |
| Notifications | react-hot-toast |

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/try/download/community) v5+ (or MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/aibhavesh/Trendify-.git
cd Trendify-
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/trendify
JWT_SECRET=your_secure_random_secret_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Create the default admin user and start the server:

```bash
node checkAndCreateAdmin.js
npm run dev
```

> Default admin credentials: `admin@example.com` / `admin123` — change these in production!

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Open the app

| Page | URL |
|---|---|
| Homepage | http://localhost:5173 |
| Admin Login | http://localhost:5173/admin/login |

## 📦 Project Structure

```
Trendify-/
├── backend/
│   ├── config/           # DB, Cloudinary, Razorpay config
│   ├── controllers/      # Route handlers (auth, products, orders, cart, etc.)
│   ├── middleware/        # Auth, admin, error handling, rate limiting, upload
│   ├── models/           # Mongoose schemas (User, Product, Order, Cart, Wishlist)
│   ├── routes/           # Express route definitions
│   ├── validators/       # Input validation with express-validator
│   ├── app.js            # Express app setup
│   └── server.js         # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI (Navbar, Footer, ProductCard, etc.)
│   │   ├── context/      # AuthContext, CartContext
│   │   ├── layouts/      # MainLayout, AdminLayout
│   │   ├── pages/        # All page components (Home, Products, Admin, etc.)
│   │   ├── services/     # Axios API instance and functions
│   │   ├── App.jsx       # Routes with lazy loading
│   │   └── main.jsx      # React entry point
│   ├── vite.config.js    # Vite config with API proxy
│   └── tailwind.config.js
│
└── SETUP_GUIDE.md        # Detailed setup, API docs, and deployment guide
```

## 📚 API Overview

The backend exposes RESTful endpoints across these areas:

| Area | Endpoints | Auth |
|---|---|---|
| Authentication | Register, Login, Logout, Admin Login | Public / Bearer |
| Products | List, Search, Filter, Trending, CRUD | Public / Admin |
| Cart | Get, Add, Update, Remove, Clear | Bearer |
| Orders | Place, My Orders, Details, Status Update | Bearer / Admin |
| Payments | Create Razorpay Order, Verify Payment | Bearer |
| Wishlist | Get, Add, Remove | Bearer |
| Reviews | Get, Add, Delete | Public / Bearer / Admin |
| User Profile | Get, Update, Change Password | Bearer |
| Admin | Dashboard Stats, Users List, User Details | Admin |

> For complete API documentation with request/response details, see the [Setup Guide](SETUP_GUIDE.md#-api-documentation).

## ⚡ Technical Highlights

- **Lazy Loading** — All pages use `React.lazy()` + `Suspense` for optimized initial load
- **Code Splitting** — Vite produces optimized chunks for fast delivery
- **Responsive Design** — Mobile-first layout using Tailwind CSS
- **Neumorphic UI** — Warm design system with coral/teal color scheme
- **Security** — JWT authentication, bcrypt password hashing, CORS, input validation, rate limiting
- **Error Handling** — Toast notifications, API error interceptors, and fallback UI

## 🚀 Deployment

- **Frontend** — Deploy the `frontend/dist/` build output to Vercel, Netlify, or any static host
- **Backend** — Deploy to Render, Railway, or any Node.js host with MongoDB Atlas

> For detailed deployment instructions, see the [Setup Guide](SETUP_GUIDE.md#-deployment).

## 📄 License

This project is for educational purposes.
