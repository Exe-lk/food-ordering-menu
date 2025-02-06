import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db, storage } from "@/config/firebase";
import { collection, doc, getDoc, getDocs, setDoc, serverTimestamp, query, where,updateDoc } from "firebase/firestore";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";

interface Menu {
  name: string;
  isDeleted: boolean;
  created_at: any;
  update_at?:any;
  imageUrl: string;
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


export const fetchMenus = createAsyncThunk<Menu[], void, { rejectValue: string }>(
  "menu/fetchMenus",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { menu: MenuState };
    if (state.menu.fetched) return state.menu.menus;

    try {
      const q = query(collection(db, "menuType"), where("isDeleted", "==", false));
      const querySnapshot = await getDocs(q);
      const menus = querySnapshot.docs.map((doc) => ({
        name: doc.data().name,
        isDeleted: doc.data().isDeleted ?? false,
        created_at: doc.data().created_at?.toDate().toISOString() || new Date().toISOString(),
        imageUrl: doc.data().imageUrl || "",
      }));
      return menus;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);




export const addMenu = createAsyncThunk<string,{menuName:string; image:File}, { rejectValue: string }>(
  "menu/addMenu",
  async ({menuName, image}, { rejectWithValue }) => {
    try {
      const menuRef = doc(collection(db, "menuType"), menuName);
      const docSnap = await getDoc(menuRef);

      if (docSnap.exists()) {
        return rejectWithValue("Menu Already Exists");
      }

      const imageRef = ref(storage, `menuTypes/${image.name}`)
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      await setDoc(menuRef, {
        name: menuName,
        isDeleted: false,
        created_at: serverTimestamp(),
        imageUrl 
      });

      return menuName;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMenu = createAsyncThunk<
  string,
  { originalMenuName: string; updatedMenuName: string; image?: File | null },
  { rejectValue: string }
>(
  "menu/updateMenu",
  async ({ originalMenuName, updatedMenuName, image }, { rejectWithValue }) => {
    try {
      const menuRef = doc(db, "menuType", originalMenuName);
      const updateData: any = {
        name: updatedMenuName,
        update_at: serverTimestamp(),
      };

      if (image) {
        const imageRef = ref(storage, `menuTypes/${image.name}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        updateData.imageUrl = imageUrl;
      }
      await updateDoc(menuRef, updateData);
      return updatedMenuName;
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
      })
      .addCase(updateMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenu.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An error occurred";
      })
  },
});

export default menuTypeSlice.reducer;
