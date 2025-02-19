// redux/features/transactionsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/config/firebase";
import { collection, getDocs, query } from "firebase/firestore";

export interface Transaction {
  id: string;
  ingredientId: string;
  ingredientName: string;
  category: string;
  brand: string;
  transactionType: string;
  previousQuantity: string;
  // For StockIn records:
  addedQuantity?: string;
  newQuantity?: string;
  // For StockOut records:
  quantity?: string; // amount deducted
  remainingQuantity?: string;
  costPrice?: string;
  unit?: string;
  supplier?: string;
  reason?: string;
  date: string;
  created_at: string;
  created_by: string;
}

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk<
  Transaction[],
  void,
  { rejectValue: string }
>(
  "transactions/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const q = query(collection(db, "transactions"));
      const querySnapshot = await getDocs(q);
      const transactions: Transaction[] = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ingredientId: docSnap.data().ingredientId,
        ingredientName: docSnap.data().ingredientName,
        category: docSnap.data().category,
        brand: docSnap.data().brand,
        transactionType: docSnap.data().transactionType,
        previousQuantity: docSnap.data().previousQuantity,
        addedQuantity: docSnap.data().addedQuantity,
        newQuantity: docSnap.data().newQuantity,
        quantity: docSnap.data().quantity,
        remainingQuantity: docSnap.data().remainingQuantity,
        costPrice: docSnap.data().costPrice,
        unit: docSnap.data().unit,
        supplier: docSnap.data().supplier,
        reason: docSnap.data().reason,
        date: docSnap.data().date,
        created_at:
          docSnap.data().created_at?.toDate().toISOString() ||
          new Date().toISOString(),
        created_by: docSnap.data().created_by,
      }));
      return transactions;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTransactions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchTransactions.fulfilled,
      (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false;
        state.transactions = action.payload;
      }
    );
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error fetching transactions";
    });
  },
});

export default transactionsSlice.reducer;
