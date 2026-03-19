'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react'

export type CartItem = {
  product: {
    id: string
    title: string
    slug: string
    price: number
    images?: { image: { url?: string; alt?: string } }[]
    categories?: ({ title: string } | string)[]
  }
  quantity: number
}

type CartState = {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; product: CartItem['product']; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QTY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; items: CartItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id,
      )
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + action.quantity }
              : i,
          ),
        }
      }
      return {
        items: [
          ...state.items,
          { product: action.product, quantity: action.quantity },
        ],
      }
    }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter((i) => i.product.id !== action.productId),
      }
    case 'UPDATE_QTY':
      if (action.quantity <= 0) {
        return {
          items: state.items.filter((i) => i.product.id !== action.productId),
        }
      }
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, quantity: action.quantity }
            : i,
        ),
      }
    case 'CLEAR_CART':
      return { items: [] }
    case 'SET_CART':
      return { items: action.items }
    default:
      return state
  }
}

type CartContextType = {
  cart: CartState
  addItem: (product: CartItem['product'], quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'rheuse-cart'

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] })

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[]
        if (Array.isArray(parsed)) {
          dispatch({ type: 'SET_CART', items: parsed })
        }
      }
    } catch {
      // Ignore invalid data
    }
  }, [])

  // Persist cart to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.items))
    } catch {
      // Ignore storage errors
    }
  }, [cart.items])

  const addItem = useCallback(
    (product: CartItem['product'], quantity = 1) => {
      dispatch({ type: 'ADD_ITEM', product, quantity })
    },
    [],
  )

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId })
  }, [])

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      dispatch({ type: 'UPDATE_QTY', productId, quantity })
    },
    [],
  )

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [])

  const total = cart.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  )
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
