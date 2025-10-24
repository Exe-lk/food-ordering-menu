// src/redux/slices/cartSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, get, set, remove } from "firebase/database";
import { database } from "@/config/firebase";

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
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  loading: false,
  error: null,
}

// Helper function to get user identifier (phone or table number)
const getUserIdentifier = (): string => {
  if (typeof window === "undefined") return "";
  const phoneNumber = localStorage.getItem("phoneNumber");
  const tableNumber = localStorage.getItem("tableNumber");
  return phoneNumber || tableNumber || "";
}

// Load cart from Firebase
export const loadCartFromFirebase = createAsyncThunk<
  { items: CartItem[]; totalItems: number },
  void,
  { rejectValue: string }
>("cart/loadFromFirebase", async (_, { rejectWithValue }) => {
  try {
    const userId = getUserIdentifier();
    if (!userId) {
      return { items: [], totalItems: 0 };
    }

    const cartRef = ref(database, `carts/${userId}`);
    const snapshot = await get(cartRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return {
        items: data.items || [],
        totalItems: data.totalItems || 0,
      };
    }
    return { items: [], totalItems: 0 };
  } catch (error: any) {
    console.error("Failed to load cart from Firebase:", error);
    return rejectWithValue(error.message);
  }
});

// Save cart to Firebase
export const saveCartToFirebase = createAsyncThunk<
  void,
  { items: CartItem[]; totalItems: number },
  { rejectValue: string }
>("cart/saveToFirebase", async ({ items, totalItems }, { rejectWithValue }) => {
  try {
    const userId = getUserIdentifier();
    if (!userId) {
      console.warn("No user identifier found, skipping cart save");
      return;
    }

    const cartRef = ref(database, `carts/${userId}`);
    await set(cartRef, {
      items,
      totalItems,
      updatedAt: Date.now(),
    });
  } catch (error: any) {
    console.error("Failed to save cart to Firebase:", error);
    return rejectWithValue(error.message);
  }
});

// Clear cart from Firebase
export const clearCartFromFirebase = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("cart/clearFromFirebase", async (_, { rejectWithValue }) => {
  try {
    const userId = getUserIdentifier();
    if (!userId) return;

    const cartRef = ref(database, `carts/${userId}`);
    await remove(cartRef);
  } catch (error: any) {
    console.error("Failed to clear cart from Firebase:", error);
    return rejectWithValue(error.message);
  }
})

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
  extraReducers: (builder) => {
    builder
      // Load cart from Firebase
      .addCase(loadCartFromFirebase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCartFromFirebase.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(loadCartFromFirebase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load cart";
      })
      // Save cart to Firebase
      .addCase(saveCartToFirebase.pending, (state) => {
        // Don't show loading state for saves to avoid UI flicker
      })
      .addCase(saveCartToFirebase.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(saveCartToFirebase.rejected, (state, action) => {
        state.error = action.payload || "Failed to save cart";
      })
      // Clear cart from Firebase
      .addCase(clearCartFromFirebase.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(clearCartFromFirebase.rejected, (state, action) => {
        state.error = action.payload || "Failed to clear cart";
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
