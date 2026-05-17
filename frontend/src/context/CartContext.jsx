import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  getCart as getCartAPI,
  addToCartAPI,
  updateCartItem,
  removeFromCartAPI,
} from '../services/api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

const EMPTY = { items: [], totalPrice: 0 }

const normalizeCart = (cart) => {
  if (!cart || typeof cart !== 'object') {
    return EMPTY
  }

  return {
    ...EMPTY,
    ...cart,
    items: Array.isArray(cart.items) ? cart.items : [],
    totalPrice: Number(cart.totalPrice) || 0,
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState(EMPTY)
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(EMPTY)
      return
    }
    try {
      setLoading(true)
      const { data } = await getCartAPI()
      setCart(normalizeCart(data?.cart))
    } catch {
      setCart(EMPTY)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = async (productId, quantity = 1) => {
    try {
      await addToCartAPI(productId, quantity)
      await fetchCart()
      toast.success('Added to cart!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart')
    }
  }

  const updateQuantity = async (productId, quantity) => {
    try {
      await updateCartItem(productId, quantity)
      await fetchCart()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart')
    }
  }

  const removeItem = async (productId) => {
    try {
      await removeFromCartAPI(productId)
      await fetchCart()
      toast.success('Removed from cart')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item')
    }
  }

  const cartCount =
    cart.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, updateQuantity, removeItem, cartCount, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
