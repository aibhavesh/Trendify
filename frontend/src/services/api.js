import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

/* â”€â”€ Interceptors â”€â”€ */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  // Only attach token if it looks like a valid JWT (3 dot-separated parts)
  if (token && token.split('.').length === 3) {
    config.headers.Authorization = `Bearer ${token}`
  } else if (token) {
    // Malformed token in storage â€” remove it
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
  return config
})

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/signup')
      ) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

/* â”€â”€ Auth â”€â”€ */
export const loginUser = (data) => API.post('/auth/login', data)
export const registerUser = (data) => API.post('/auth/register', data)
export const adminLogin = (data) => API.post('/admin/login', data)
export const forgotPassword = (data) => API.post('/auth/forgot-password', data)
export const resetPassword = (token, data) => API.post(`/auth/reset-password/${token}`, data)

/* â”€â”€ Products â”€â”€ */
export const fetchProducts = () => API.get('/products')
export const fetchProductById = (id) => API.get(`/products/${id}`)
export const fetchTrendingProducts = () => API.get('/products/trending')
export const filterProducts = (params) => API.get('/products/filter', { params })
export const searchProducts = (q) => API.get('/products/search', { params: { q } })

/* â”€â”€ Cart â”€â”€ */
export const getCart = () => API.get('/cart')
export const addToCartAPI = (productId, quantity = 1) =>
  API.post('/cart/add', { productId, quantity })
export const updateCartItem = (productId, quantity) =>
  API.put('/cart/update', { productId, quantity })
export const removeFromCartAPI = (productId) =>
  API.delete(`/cart/remove/${productId}`)

/* â”€â”€ Orders â”€â”€ */
export const placeOrder = (data) => API.post('/orders', data)
export const getMyOrders = () => API.get('/orders')
export const getOrderById = (id) => API.get(`/orders/${id}`)

/* â”€â”€ Wishlist â”€â”€ */
export const getWishlist = () => API.get('/wishlist')
export const addToWishlistAPI = (productId) =>
  API.post('/wishlist/add', { productId })
export const removeFromWishlistAPI = (productId) =>
  API.delete(`/wishlist/remove/${productId}`)

/* â”€â”€ Reviews â”€â”€ */
export const addReview = (productId, data) =>
  API.post(`/reviews/${productId}`, data)

/* â”€â”€ User â”€â”€ */
export const getUserProfile = () => API.get('/users/profile')
export const updateProfile = (data) => API.put('/users/profile', data)

/* â”€â”€ Payment â”€â”€ */
export const createPaymentOrder = (orderId) =>
  API.post('/payment/create-order', { orderId })
export const verifyPayment = (data) => API.post('/payment/verify', data)

/* â”€â”€ Coupons â”€â”€ */
export const applyCoupon = (code, subtotal) => API.post('/coupons/apply', { code, subtotal })
export const getCoupons = () => API.get('/coupons')
export const createCoupon = (data) => API.post('/coupons', data)
export const updateCoupon = (id, data) => API.put(`/coupons/${id}`, data)
export const deleteCoupon = (id) => API.delete(`/coupons/${id}`)

/* â”€â”€ Admin â”€â”€ */
export const getDashboardStats = () => API.get('/admin/dashboard')
export const getAdminUsers = () => API.get('/admin/users')
export const getSalesReport = (params) => API.get('/admin/sales-report', { params })

export const getAllOrders = () => API.get('/orders/all')
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/update-status/${id}`, { status })
export const createProduct = (data) => API.post('/products', data)
export const updateProduct = (id, data) => API.put(`/products/${id}`, data)
export const deleteProduct = (id) => API.delete(`/products/${id}`)
export const uploadImage = (formData) =>
  API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export default API
