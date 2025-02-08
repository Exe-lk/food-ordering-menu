import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/config/firebase";
import {
  collection,
  doc,
  getDoc,
  deleteDoc,
  getDocs,
  addDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { stat } from "fs";

export interface Portion {
  id: string;
  name: string;
  serves: string;
  created_at: string;
  isDeleted: boolean;
  update_at?:string;
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
      const portions = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        name: docSnap.data().name,
        serves: docSnap.data().serves,
        isDeleted: docSnap.data().isDeleted ?? false,
        created_at:
          docSnap.data().created_at?.toDate().toISOString() || new Date().toISOString(),
      }));
      return portions;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPortion = createAsyncThunk<Portion, { name: string; serves: string }, { rejectValue: string }>(
  "portion/addPortion",
  async ({ name, serves }, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "portionType"),
        where("name", "==", name),
        where("isDeleted", "==", false)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return rejectWithValue("Portion Already Exists");
      }

      const portionData = {
        name,
        serves,
        created_at: serverTimestamp(),
        isDeleted: false,
      };

      const docRef = await addDoc(collection(db, "portionType"), portionData);
      return {
        id: docRef.id,
        name,
        serves,
        created_at: new Date().toISOString(),
        isDeleted: false,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePortion = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>(
  "portion/deletePortion",
  async ({ id }, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "portionType", id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const restorePortion = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>(
  "portion/restorePortion",
  async ({ id }, { rejectWithValue }) => {
    try {
      const portionRef = doc(db, "portionType", id);
      await updateDoc(portionRef, { isDeleted: false, update_at: serverTimestamp() });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removePortion = createAsyncThunk<
string,
{id:string},
{rejectValue:string}
>(
  "portion/removePortion",
  async ({id}, {rejectWithValue}) =>{
    try {
      const menuRef = doc(db,"portionType",id);
      const docSnap = await getDoc(menuRef);
      if(!docSnap.exists()){
        return rejectWithValue("No Document to update")
      }
      await updateDoc(menuRef,{
        isDeleted:true,
        update_at:serverTimestamp()
      });
      return id
    } catch (error:any) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchDeletedPortions = createAsyncThunk<
  Portion[],
  void,
  { rejectValue: string }
>(
  "portion/fetchDeletedPortions",
  async (_, { rejectWithValue }) => {
    try {
      const q = query(collection(db, "portionType"), where("isDeleted", "==", true));
      const querySnapshot = await getDocs(q);
      const portions = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        name: docSnap.data().name,
        serves: docSnap.data().serves,
        isDeleted: docSnap.data().isDeleted ?? true,
        created_at: docSnap.data().created_at?.toDate().toISOString() || new Date().toISOString(),
      }));
      return portions;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);




export const updatePortion = createAsyncThunk<
string,
{id: string; updatedName:string; updatedServes:string},
{rejectValue:string}
>(
  "portion/portionType",
  async ({id, updatedName, updatedServes}, {rejectWithValue}) =>{
    try {
      const portionRef = doc(db,"portionType",id);
      const updateData:any ={
        name:updatedName,
        serves:updatedServes,
        update_at:serverTimestamp()
      };

      await updateDoc(portionRef, updateData);
      return updatedName
    } catch (error:any) {
      return rejectWithValue(error.message)
    }
  }
)





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
        state.error = null;
      })
      .addCase(addPortion.fulfilled, (state, action: PayloadAction<Portion>) => {
        state.loading = false;
        // Optionally, add the new portion to the local state array.
        state.portions.push(action.payload);
      })
      .addCase(addPortion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An error occurred";
      })
      .addCase(updatePortion.pending,(state) =>{
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePortion.fulfilled, (state) =>{
        state.loading = false;
      })
      .addCase(updatePortion.rejected,(state, action) =>{
        state.loading =false;
        state.error = action.payload ?? "An Erro Occured"
      })
  },
});

export default portionSlice.reducer;
