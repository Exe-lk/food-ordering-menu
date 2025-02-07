// src/redux/slices/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id?: string;
  name: string;
  portion: string;
  quantity: number;
  price: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
};

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
