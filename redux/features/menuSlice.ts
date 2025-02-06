import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/config/firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

interface Menu {
  name: string;
}

interface MenuState {
  menus: Menu[]; 
  loading: boolean;
  error: string | null;
  fetched: boolean;
}

const initialState: MenuState = {
  menus: [],
  loading: false,
  error: null,
  fetched: false,
};

// Fetch menus from Firebase
export const fetchMenus = createAsyncThunk<Menu[], void, { rejectValue: string }>(
  "menu/fetchMenus",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { menu: MenuState };
    if (state.menu.fetched) return state.menu.menus;

    try {
      const querySnapshot = await getDocs(collection(db, "menuType"));
      const menus = querySnapshot.docs.map((doc) => ({
        name: doc.data().name,
      }));
      return menus; // Return array of Menu objects
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Add menu to Firebase
export const addMenu = createAsyncThunk<string, string, { rejectValue: string }>(
  "menu/addMenu",
  async (menuName, { rejectWithValue }) => {
    try {
      const menuRef = doc(collection(db, "menuType"), menuName);
      const docSnap = await getDoc(menuRef);

      if (docSnap.exists()) {
        return rejectWithValue("Menu Already Exists");
      }

      await setDoc(menuRef, { name: menuName });
      return menuName;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const menuTypeSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenus.fulfilled, (state, action: PayloadAction<Menu[]>) => {
        state.loading = false;
        state.menus = action.payload;
        state.fetched = true;
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An error occurred";
      });
  },
});

export default menuTypeSlice.reducer;
