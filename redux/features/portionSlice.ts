import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/config/firebase";
import { collection, doc, getDoc, getDocs, setDoc, serverTimestamp, query, where } from "firebase/firestore";

interface Portion {
  name: string;
  serves: string;
  created_at: string;
  isDeleted: boolean;
}

interface PortionState {
  portions: Portion[];
  loading: boolean;
  error: string | null;
  fetched: boolean;
}

const initialState: PortionState = {
  portions: [],
  loading: false,
  error: null,
  fetched: false,
};

export const fetchPortions = createAsyncThunk<Portion[], void, { rejectValue: string }>(
  "portion/fetchPortions",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { portionType: PortionState }; // Updated reference

    if (state.portionType.fetched) return state.portionType.portions;

    try {
      const q = query(collection(db, "portionType"), where("isDeleted", "==", false));
      const querySnapshot = await getDocs(q);
      const portions = querySnapshot.docs.map((doc) => ({
        name: doc.data().name,
        serves: doc.data().serves,
        isDeleted: doc.data().isDeleted ?? false,
        created_at: doc.data().created_at?.toDate().toISOString() || new Date().toISOString(),
      }));
      return portions;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPortion = createAsyncThunk<string, { name: string; serves: string }, { rejectValue: string }>(
  "portion/addPortion",
  async ({ name, serves }, { rejectWithValue }) => {
    try {
      const portionRef = doc(collection(db, "portionType"), name);
      const docSnap = await getDoc(portionRef);

      if (docSnap.exists()) {
        return rejectWithValue("Portion Already Exists");
      }

      await setDoc(portionRef, {
        name,
        serves,
        created_at: serverTimestamp(),
        isDeleted: false,
      });
      return name;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const portionSlice = createSlice({
  name: "portion",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortions.fulfilled, (state, action: PayloadAction<Portion[]>) => {
        state.loading = false;
        state.portions = action.payload;
        state.fetched = true;
      })
      .addCase(fetchPortions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An Error Occurred";
      })
      .addCase(addPortion.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPortion.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
      })
      .addCase(addPortion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An error occurred";
      });
  },
});

export default portionSlice.reducer;
