// orderSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ref, get, push, set, update } from "firebase/database";
import { database } from "@/config/firebase";
import { RootState } from "@/redux/store";
import { CartItem } from "./cartSlice";

export interface Order {
  id: string;
  items: CartItem[];
  phoneNumber: string;
  tableNumber: string;
  status: string;
  created_at: string;
  update_at?: string;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

// --- FETCH ORDERS THUNK (one-time fetch; realtime updates will come via a listener) ---
export const fetchOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const ordersRef = ref(database, "orders");
      const snapshot = await get(ordersRef);
      const ordersData = snapshot.val();
      const orders: Order[] = [];
      if (ordersData) {
        for (const id in ordersData) {
          const data = ordersData[id];
          orders.push({
            id,
            items: data.items,
            phoneNumber: data.phoneNumber,
            tableNumber: data.tableNumber,
            status: data.status,
            created_at: data.created_at
              ? new Date(data.created_at).toISOString()
              : new Date().toISOString(),
            update_at: data.update_at
              ? new Date(data.update_at).toISOString()
              : undefined,
          });
        }
      }
      return orders;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// --- PLACE ORDER THUNK ---
export const placeOrder = createAsyncThunk<
  Order,
  void,
  { state: RootState; rejectValue: string }
>("order/placeOrder", async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const cartItems = state.cart.items;

  if (!cartItems || cartItems.length === 0) {
    return rejectWithValue("Cart is Empty");
  }
  const phoneNumber = localStorage.getItem("phoneNumber") || "";
  const tableNumber = localStorage.getItem("tableNumber") || "";
  const orderData = {
    items: cartItems,
    phoneNumber,
    tableNumber,
    status: "Pending",
    created_at: Date.now(),
  };

  try {
    const ordersRef = ref(database, "orders");
    const newOrderRef = push(ordersRef); // generate a new key
    await set(newOrderRef, orderData);

    const order: Order = {
      id: newOrderRef.key as string,
      items: cartItems,
      phoneNumber,
      tableNumber,
      status: "pending",
      created_at: new Date(orderData.created_at).toISOString(),
    };
    return order;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// --- UPDATE ORDER STATUS THUNK ---
export const updateOrderStatus = createAsyncThunk<
  { id: string; status: string },
  { id: string; status: string },
  { rejectValue: string }
>(
  "order/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const orderRef = ref(database, `orders/${id}`);
      await update(orderRef, {
        status: status,
        update_at: Date.now(),
      });
      return { id, status };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // This reducer lets us update orders in realtime from our listener.
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An Error Occurred";
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An Error Occurred";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<{ id: string; status: string }>) => {
        const { id, status } = action.payload;
        const orderIndex = state.orders.findIndex((order) => order.id === id);
        if (orderIndex !== -1) {
          state.orders[orderIndex].status = status;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload || "Failed to update order status";
      });
  },
});

export const { setOrders } = orderSlice.actions;
export default orderSlice.reducer;
