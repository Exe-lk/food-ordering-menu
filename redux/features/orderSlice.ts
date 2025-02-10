import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { collection, addDoc, serverTimestamp, getDocs, updateDoc, doc } from "firebase/firestore";
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
    update_at?:string;
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

export const fetchOrders = createAsyncThunk<Order[], void, {rejectValue:string}>(
    "order/fetchOrders",
    async(_,{rejectWithValue}) =>{
        try {
            const querySnapshot = await getDocs(collection(db,"orders"));
            const orders = querySnapshot.docs.map((docSnap) =>{
                const data = docSnap.data();
                return{
                    id:docSnap.id,
                    items:data.items,
                    phoneNumber:data.phoneNumber,
                    tableNumber:data.tableNumber,
                    status:data.status,
                    created_at:data.created_at?.toDate().toISOString() || new Date().toISOString(),
                };
            });
            return orders
        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }
)

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
            status:"Pending",
            created_at:new Date().toISOString()
        };
        return order;
        
    } catch (error:any) {
        return rejectWithValue(error.message)
    }
});

export const updateOrderStatus = createAsyncThunk<
{id:string;status:string},
{id:string, status:string},
{rejectValue:string}
>(
    "order/updateOrderStatus",
    async({id,status},{rejectWithValue}) =>{
        try {
            const orderRef = doc(db,"orders",id);
            await updateDoc(orderRef,{
                status:status,
                update_at:serverTimestamp(),
            });
            return {id, status};
        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }
)
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
        })
        .addCase(fetchOrders.pending,(state) =>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchOrders.fulfilled,(state,action:PayloadAction<Order[]>) =>{
            state.loading = false;
            state.orders = action.payload
        })
        .addCase(fetchOrders.rejected,(state, action) =>{
            state.loading = false;
            state.error = action.payload || "An Error Occured"
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
    }
});

export default orderSlice.reducer