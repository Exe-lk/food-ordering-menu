import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/config/firebase";
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, serverTimestamp, query, where, deleteDoc, writeBatch } from "firebase/firestore";
import { RootState } from "../store";

export interface StockOutRecord {
    id: string;
    ingredientId: string;
    ingredientName: string;
    category: string;
    stockOutQuantity: string;
    reason: string;
    dateOut: string;
    created_at: string;
    created_by: string;
  }

  interface StockOutState{
    stockOut:StockOutRecord[];
    loading:boolean;
    error:string | null;
    fetched:boolean
  }

  const initialState:StockOutState = {
    stockOut:[],
    loading:false,
    error:null,
    fetched:false
}

export const fetchStockOutRecords = createAsyncThunk<
  StockOutRecord[],
  void,
  { rejectValue: string }
>(
  "ingredients/fetchStockOutRecords",
  async (_, { rejectWithValue }) => {
    try {
      const stockOutQuery = query(collection(db, "stockOutRecords"));
      const querySnapshot = await getDocs(stockOutQuery);
      const records: StockOutRecord[] = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ingredientId: data.ingredientId,
          ingredientName: data.ingredientName,
          category: data.category,
          stockOutQuantity: data.stockOutQuantity,
          reason: data.reason,
          dateOut: data.dateOut,
          created_at:
            data.created_at?.toDate().toISOString() || new Date().toISOString(),
          created_by: data.created_by,
        };
      });
      return records;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


const stockInSlice = createSlice({
    name:"stockIn",
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder
        .addCase(fetchStockOutRecords.pending,(state) =>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchStockOutRecords.fulfilled,(state,action:PayloadAction<StockOutRecord[]>)=>{
            state.loading = false;
            state.stockOut = action.payload;
            state.fetched = true;
        })
        .addCase(fetchStockOutRecords.rejected,(state,action) =>{
            state.loading = false;
            state.error = action.payload || "An Error Occured"
        })
    }
})

export default stockInSlice.reducer;