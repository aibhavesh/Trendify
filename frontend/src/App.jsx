import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Loader from './components/Loader'

// ===== Lazy-loaded customer pages =====
const Home = lazy(() => import('./pages/Home'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Login = lazy(() => import('./pages/Login'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Signup = lazy(() => import('./pages/Signup'))
const Orders = lazy(() => import('./pages/Orders'))
const OrderDetails = lazy(() => import('./pages/OrderDetails'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const Profile = lazy(() => import('./pages/Profile'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'))
const PaymentFailed = lazy(() => import('./pages/PaymentFailed'))

// ===== Lazy-loaded admin pages =====
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminProductList = lazy(() => import('./pages/admin/ProductList'))
const AddProduct = lazy(() => import('./pages/admin/AddProduct'))
const EditProduct = lazy(() => import('./pages/admin/EditProduct'))
const AdminOrdersList = lazy(() => import('./pages/admin/OrdersList'))
const AdminOrderDetails = lazy(() => import('./pages/admin/AdminOrderDetails'))
const UsersList = lazy(() => import('./pages/admin/UsersList'))
const Coupons = lazy(() => import('./pages/admin/Coupons'))
const SalesReports = lazy(() => import('./pages/admin/SalesReports'))


export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ===== Customer routes with Navbar + Footer ===== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected customer routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failed" element={<PaymentFailed />} />
          </Route>
        </Route>

        {/* ===== Admin login (no sidebar) ===== */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ===== Admin routes with sidebar ===== */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<AdminProductList />} />
            <Route path="/admin/products/add" element={<AddProduct />} />
            <Route path="/admin/products/edit/:id" element={<EditProduct />} />
            <Route path="/admin/orders" element={<AdminOrdersList />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
            <Route path="/admin/coupons" element={<Coupons />} />
            <Route path="/admin/users" element={<UsersList />} />
            <Route path="/admin/sales-reports" element={<SalesReports />} />

          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}
