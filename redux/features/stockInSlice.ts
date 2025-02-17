import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/config/firebase";
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, serverTimestamp, query, where, deleteDoc, writeBatch } from "firebase/firestore";
import { RootState } from "../store";

export interface StockInRecord {
    id: string;
    ingredientId: string;
    ingredientName: string;
    category: string;
    brand: string;
    quantity: string;
    costPrice: string;
    unit: string;
    supplier: string;
    dateIn: string;
    created_at: string;
    created_by: string;
  }

  interface StockInState{
    stockIn:StockInRecord[];
    loading:boolean;
    error:string | null;
    fetched:boolean
  }

  const initialState:StockInState = {
    stockIn:[],
    loading:false,
    error:null,
    fetched:false
  }

  export const fetchStockInRecords = createAsyncThunk<
  StockInRecord[],
  void,
  { rejectValue: string }
>(
  "stockIn/fetchStockInRecords",
  async (_, { rejectWithValue }) => {
    try {
      const stockInQuery = query(collection(db, "stockInRecords"));
      const querySnapshot = await getDocs(stockInQuery);
      const records: StockInRecord[] = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ingredientId: data.ingredientId,
          ingredientName: data.ingredientName,
          category: data.category,
          brand: data.brand,
          quantity: data.quantity,
          costPrice: data.costPrice,
          unit: data.unit,
          supplier: data.supplier,
          dateIn: data.dateIn,
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
        .addCase(fetchStockInRecords.pending,(state) =>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchStockInRecords.fulfilled,(state,action:PayloadAction<StockInRecord[]>)=>{
            state.loading = false;
            state.stockIn = action.payload;
            state.fetched = true;
        })
        .addCase(fetchStockInRecords.rejected,(state,action) =>{
            state.loading = false;
            state.error = action.payload || "An Error Occured"
        })
    }
})

export default stockInSlice.reducer;