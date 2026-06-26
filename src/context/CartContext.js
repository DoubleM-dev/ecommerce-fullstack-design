import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case 'LOAD': return { ...state, items: action.items };
    case 'ADD': {
      const exists = state.items.find(i => i.id === action.item.id && i.size === action.item.size && i.color === action.item.color);
      if (exists) {
        return { ...state, items: state.items.map(i => i.id === action.item.id && i.size === action.item.size && i.color === action.item.color ? { ...i, quantity: i.quantity + (action.item.quantity || 1) } : i) };
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: action.item.quantity || 1 }] };
    }
    case 'REMOVE': return { ...state, items: state.items.filter((_, i) => i !== action.index) };
    case 'UPDATE': return { ...state, items: state.items.map((item, i) => i === action.index ? { ...item, quantity: Math.max(1, action.qty) } : item) };
    case 'CLEAR': return { ...state, items: [] };
    default: return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) dispatch({ type: 'LOAD', items: JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = item => dispatch({ type: 'ADD', item });
  const removeItem = index => dispatch({ type: 'REMOVE', index });
  const updateQty = (index, qty) => dispatch({ type: 'UPDATE', index, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });
  const total = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = state.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() { return useContext(CartContext); }
