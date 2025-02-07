import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db, storage } from "@/config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Menu {
  id: string;
  name: string;
  isDeleted: boolean;
  created_at: string;
  update_at?: string;
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

// Fetch Menus
export const fetchMenus = createAsyncThunk<Menu[], void, { rejectValue: string }>(
  "menu/fetchMenus",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { menu: MenuState };
    if (state.menu.fetched) return state.menu.menus;
    try {
      const q = query(
        collection(db, "menuType"),
        where("isDeleted", "==", false)
      );
      const querySnapshot = await getDocs(q);
      const menus = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        name: docSnap.data().name,
        isDeleted: docSnap.data().isDeleted ?? false,
        created_at:
          docSnap.data().created_at?.toDate().toISOString() || new Date().toISOString(),
        imageUrl: docSnap.data().imageUrl || "",
      }));
      return menus;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Add Menu
export const addMenu = createAsyncThunk<
  Menu,
  { menuName: string; image: File },
  { rejectValue: string }
>("menu/addMenu", async ({ menuName, image }, { rejectWithValue }) => {
  try {
    const q = query(
      collection(db, "menuType"),
      where("name", "==", menuName),
      where("isDeleted", "==", false)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return rejectWithValue("Menu Already Exists");
    }

    const imageRef = ref(storage, `menuTypes/${image.name}`);
    await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(imageRef);

    const menuData = {
      name: menuName,
      isDeleted: false,
      created_at: serverTimestamp(),
      imageUrl,
    };

    const docRef = await addDoc(collection(db, "menuType"), menuData);
    return {
      id: docRef.id,
      name: menuName,
      isDeleted: false,
      created_at: new Date().toISOString(),
      imageUrl,
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Update Menu
export const updateMenu = createAsyncThunk<
  string,
  { id: string; updatedMenuName: string; image?: File | null },
  { rejectValue: string }
>(
  "menu/updateMenu",
  async ({ id, updatedMenuName, image }, { rejectWithValue }) => {
    try {
      const menuRef = doc(db, "menuType", id);
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

// Remove Menu
export const removeMenu = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>(
  "menu/removeMenu",
  async ({ id }, { rejectWithValue }) => {
    try {
      const menuRef = doc(db, "menuType", id);
      const docSnap = await getDoc(menuRef);
      if (!docSnap.exists()) {
        return rejectWithValue("No document to update");
      }
      await updateDoc(menuRef, {
        isDeleted: true,
        update_at: serverTimestamp(),
      });
      return id;
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
      .addCase(removeMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMenu.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An Error Occurred";
      });
  },
});

export default menuTypeSlice.reducer;
