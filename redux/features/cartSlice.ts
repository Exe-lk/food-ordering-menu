// src/redux/slices/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from 'js-cookie'

export interface CartItem {
  id?: string;
  name: string;
  portion: string;
  quantity: number;
  price: number;
  image: string;
}

const getInitialCartState = (): CartState => {
  // Check if we are in the browser
  if (typeof window !== "undefined") {
    const cartCookie = Cookies.get("cart");
    if (cartCookie) {
      try {
        const parsed = JSON.parse(cartCookie);
        return {
          items: parsed.items || [],
          totalItems: parsed.totalItems || 0,
        };
      } catch (error) {
        console.error("Failed to parse cart cookie", error);
      }
    }
  }
  // Default state if no cookie or on server-side
  return {
    items: [],
    totalItems: 0,
  };
};
interface CartState {
  items: CartItem[];
  totalItems: number;
}

const initialState: CartState = getInitialCartState()

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) =>
          item.name === action.payload.name &&
          item.portion === action.payload.portion
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.totalItems += action.payload.quantity;
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ name: string; portion: string }>
    ) => {
      const index = state.items.findIndex(
        (item) =>
          item.name === action.payload.name &&
          item.portion === action.payload.portion
      );
      if (index !== -1) {
        state.totalItems -= state.items[index].quantity;
        state.items.splice(index, 1);
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ name: string; portion: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (i) =>
          i.name === action.payload.name &&
          i.portion === action.payload.portion
      );
      if (item && action.payload.quantity > 0) {
        const diff = action.payload.quantity - item.quantity;
        item.quantity = action.payload.quantity;
        state.totalItems += diff;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
