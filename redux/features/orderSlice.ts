import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { RootState } from "@/redux/store";
import { CartItem } from "./cartSlice";

export interface Order {
    id: string;
    items: CartItem[];
    phoneNumber: string;
    tableNumber: string;
    status: string;
    created_at: string;
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

export const placeOrder = createAsyncThunk<
  Order,
  void,
  { state: RootState; rejectValue: string }
>("order/placeOrder", async (_, {getState, rejectWithValue}) =>{
    const state = getState();
    const cartItems = state.cart.items;

    if(!cartItems || cartItems.length === 0){
        return rejectWithValue("Cart is Empty")
    }
    const phoneNumber = localStorage.getItem("phoneNumber") || "";
    const tableNumber = localStorage.getItem("tableNumber") || "";

    const orderData = {
        items:cartItems,
        phoneNumber,
        tableNumber,
        status:"pending",
        created_at:serverTimestamp()
    };

    try {
        const docRef = await addDoc(collection(db,"orders"), orderData);

        const order:Order = {
            id:docRef.id,
            items:cartItems,
            phoneNumber,
            tableNumber,
            status:"pending",
            created_at:new Date().toISOString()
        };
        return order;
        
    } catch (error:any) {
        return rejectWithValue(error.message)
    }
});

const orderSlice = createSlice({
    name:"order",
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder
        .addCase(placeOrder.pending,(state) =>{
            state.loading = true;
            state.error = null;
        })
        .addCase(placeOrder.fulfilled, (state, action:PayloadAction<Order>) =>{
            state.loading = false;
            state.orders.push(action.payload)
        })
        .addCase(placeOrder.rejected,(state, action) =>{
            state.loading = false;
            state.error = action.payload || "An Error Occurred"
        });
    }
});

export default orderSlice.reducer