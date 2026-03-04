import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

/* ── Interceptors ── */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  // Only attach token if it looks like a valid JWT (3 dot-separated parts)
  if (token && token.split('.').length === 3) {
    config.headers.Authorization = `Bearer ${token}`
  } else if (token) {
    // Malformed token in storage — remove it
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

/* ── Auth ── */
export const loginUser = (data) => API.post('/auth/login', data)
export const registerUser = (data) => API.post('/auth/register', data)
export const adminLogin = (data) => API.post('/admin/login', data)

/* ── Products ── */
export const fetchProducts = () => API.get('/products')
export const fetchProductById = (id) => API.get(`/products/${id}`)
export const fetchTrendingProducts = () => API.get('/products/trending')
export const filterProducts = (params) => API.get('/products/filter', { params })
export const searchProducts = (q) => API.get('/products/search', { params: { q } })

/* ── Cart ── */
export const getCart = () => API.get('/cart')
export const addToCartAPI = (productId, quantity = 1) =>
  API.post('/cart/add', { productId, quantity })
export const updateCartItem = (productId, quantity) =>
  API.put('/cart/update', { productId, quantity })
export const removeFromCartAPI = (productId) =>
  API.delete(`/cart/remove/${productId}`)

/* ── Orders ── */
export const placeOrder = (data) => API.post('/orders', data)
export const getMyOrders = () => API.get('/orders')
export const getOrderById = (id) => API.get(`/orders/${id}`)

/* ── Wishlist ── */
export const getWishlist = () => API.get('/wishlist')
export const addToWishlistAPI = (productId) =>
  API.post('/wishlist/add', { productId })
export const removeFromWishlistAPI = (productId) =>
  API.delete(`/wishlist/remove/${productId}`)

/* ── Reviews ── */
export const addReview = (productId, data) =>
  API.post(`/reviews/${productId}`, data)

/* ── User ── */
export const getUserProfile = () => API.get('/users/profile')
export const updateProfile = (data) => API.put('/users/profile', data)

/* ── Payment ── */
export const createPaymentOrder = (orderId) =>
  API.post('/payment/create-order', { orderId })
export const verifyPayment = (data) => API.post('/payment/verify', data)

/* ── Admin ── */
export const getDashboardStats = () => API.get('/admin/dashboard')
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
