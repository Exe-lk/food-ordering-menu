import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/config/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

interface CustomerState {
  phone: string;
  exists: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  phone: "",
  exists: false,
  loading: false,
  error: null,
};
export const checkPhoneExists = createAsyncThunk<
  { exists: boolean; phone: string },
  string,
  { rejectValue: string }
>("customer/checkPhoneExists", async (phone, { rejectWithValue }) => {
  try {
    const customerRef = doc(db, "customers", phone);
    const docSnap = await getDoc(customerRef);

    if (docSnap.exists()) {
      return { exists: true, phone };
    } else {
      return { exists: false, phone };
    }
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
export const updateCustomerDetails = createAsyncThunk<
  { success: boolean },
  { phone: string; name: string; tableNumber: string },
  { rejectValue: string }
>(
  "customer/updateCustomerDetails",
  async ({ phone, name, tableNumber }, { rejectWithValue }) => {
    try {
      await setDoc(doc(collection(db, "customers"), phone), { name, phone }, { merge: true });
      if (typeof window !== "undefined") {
        localStorage.setItem("phoneNumber", phone);
        localStorage.setItem("tableNumber", tableNumber);
      }
      
      return { success: true };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkPhoneExists.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkPhoneExists.fulfilled, (state, action) => {
        state.loading = false;
        state.phone = action.payload.phone;
        state.exists = action.payload.exists;
      })
      .addCase(checkPhoneExists.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(updateCustomerDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomerDetails.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCustomerDetails.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export default customerSlice.reducer;
