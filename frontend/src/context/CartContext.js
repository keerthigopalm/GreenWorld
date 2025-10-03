import React, { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

// Initial state
const initialState = {
  cart: []
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const product = action.payload;
      const exist = state.cart.find(item => item._id === product._id);
      
      if (exist) {
        // If item exists, increase quantity
        return {
          ...state,
          cart: state.cart.map(item =>
            item._id === product._id
              ? { ...item, qty: (item.qty || 1) + 1 }
              : item
          )
        };
      } else {
        // If item doesn't exist, add it with quantity 1
        return { 
          ...state, 
          cart: [...state.cart, { 
            ...product, 
            qty: 1,
            price: parseFloat(product.price) || 0 // Ensure price is a number
          }] 
        };
      }
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter(item => item._id !== action.payload)
      };

    case "UPDATE_QUANTITY": {
      const { productId, qty } = action.payload;
      if (qty <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item._id !== productId)
        };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item._id === productId ? { ...item, qty } : item
        )
      };
    }

    case "CLEAR_CART":
      return { ...state, cart: [] };

    default:
      return state;
  }
};

// Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  const updateQuantity = (productId, qty) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, qty } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider value={{ 
      cart: state.cart, 
      dispatch, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  
  // Calculate total
  const total = context.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  // Calculate total items
  const totalItems = context.cart.reduce((sum, item) => sum + item.qty, 0);
  
  // Get items for checkout (with proper naming)
  const items = context.cart.map(item => ({
    productID: item._id,
    name: item.name,
    quantity: item.qty,
    price: item.price
  }));
  
  return {
    ...context,
    total,
    totalItems,
    items,
    clear: context.clearCart
  };
};
