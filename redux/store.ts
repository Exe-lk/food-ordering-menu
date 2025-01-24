import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for a cart item
interface CartItem {
  id?: string;
  name: string;
  portion: string;
  quantity: number;
  price: number;
  image:string;
}

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    selectedMenu: "",
  },
  reducers: {
    selectMenu: (state, action: PayloadAction<string>) => {
      state.selectedMenu = action.payload;
    },
  },
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [] as CartItem[],
    totalItems: 0,
  },
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
    removeFromCart: (state, action: PayloadAction<{ name: string; portion: string }>) => {
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
    updateQuantity: (state, action: PayloadAction<{ name: string; portion: string; quantity: number }>) => {
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
  },
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;

export const { selectMenu } = menuSlice.actions;

const store = configureStore({
  reducer: {
    menu: menuSlice.reducer,
    cart: cartSlice.reducer, // Make sure to include the cart reducer
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
