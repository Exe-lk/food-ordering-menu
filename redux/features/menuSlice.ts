// src/redux/features/menuSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db, storage } from "@/config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface Menu {
  id: string;
  name: string;
  isDeleted: boolean;
  created_at: string;
  update_at?: string;
  imageUrl: string;
  menu_type?:string;
  created_by?:string;
  updated_by?:string;
}

interface MenuState {
  menus: Menu[];
  selectedMenu: string;
  loading: boolean;
  error: string | null;
  fetched: boolean;
}

const initialState: MenuState = {
  menus: [],
  selectedMenu:
    typeof window !== "undefined" ? localStorage.getItem("selectedMenu") || "" : "",
  loading: false,
  error: null,
  fetched: false,
};

// Fetch Menus
export const fetchMenus = createAsyncThunk<Menu[], void, { rejectValue: string }>(
  "menu/fetchMenus",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { menuType: MenuState };
    if (state.menuType.fetched) return state.menuType.menus;
    try {
      const q = query(
        collection(db, "menuType"),
        where("isDeleted", "==", false),
        where("menu_type", "==", "Food")
      );
      const querySnapshot = await getDocs(q);
      const menus = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        name: docSnap.data().name,
        isDeleted: docSnap.data().isDeleted ?? false,
        created_at:
          docSnap.data().created_at?.toDate().toISOString() ||
          new Date().toISOString(),
        imageUrl: docSnap.data().imageUrl || "",
        menu_type:docSnap.data().menu_type,
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
  { menuName: string; image: File, menu_type:string },
  { rejectValue: string }
>("menu/addMenu", async ({ menuName, image, menu_type }, { rejectWithValue }) => {
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
    const created_by = localStorage.getItem("Name") || "Unknown";

    const menuData = {
      name: menuName,
      isDeleted: false,
      created_at: serverTimestamp(),
      imageUrl,
      menu_type,
      created_by
    };

    const docRef = await addDoc(collection(db, "menuType"), menuData);
    return {
      id: docRef.id,
      name: menuName,
      isDeleted: false,
      created_at: new Date().toISOString(),
      imageUrl,
      menu_type
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Updated Update Menu Thunk
export const updateMenu = createAsyncThunk<
  { id: string; oldName: string; updatedMenuName: string },
  { id: string; updatedMenuName: string; image?: File | null; menu_type: string },
  { rejectValue: string }
>(
  "menu/updateMenu",
  async ({ id, updatedMenuName, image, menu_type }, { rejectWithValue }) => {
    try {
      const menuRef = doc(db, "menuType", id);
      const updated_by = localStorage.getItem("Name") || "Unknown";
      // Get the current (old) menu data
      const menuSnap = await getDoc(menuRef);
      if (!menuSnap.exists()) {
        return rejectWithValue("Menu not found");
      }
      const oldName = menuSnap.data().name;

      // Prepare update data for the menu document, including the updated menu type.
      const updateData: any = {
        name: updatedMenuName,
        update_at: serverTimestamp(),
        updated_by,
        menu_type,
      };

      if (image) {
        const imageRef = ref(storage, `menuTypes/${image.name}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        updateData.imageUrl = imageUrl;
      }

      await updateDoc(menuRef, updateData);

      // Update internalFood documents where category === oldName if needed.
      const foodsQuery = query(
        collection(db, "internalFood"),
        where("category", "==", oldName)
      );
      const querySnapshot = await getDocs(foodsQuery);

      const batch = writeBatch(db);
      querySnapshot.forEach((docSnap) => {
        const foodRef = doc(db, "internalFood", docSnap.id);
        batch.update(foodRef, {
          category: updatedMenuName,
          updated_at: serverTimestamp(),
        });
      });
      await batch.commit();

      return { id, oldName, updatedMenuName };
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

export const deleteMenu = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>(
  "menu/deleteMenu",
  async ({ id }, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "menuType", id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const restoreMenu = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>(
  "menu/restoreMenu",
  async ({ id }, { rejectWithValue }) => {
    try {
      const menuRef = doc(db, "menuType", id);
      await updateDoc(menuRef, { isDeleted: false, update_at: serverTimestamp() });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDeletedMenus = createAsyncThunk<Menu[], void, { rejectValue: string }>(
  "menu/fetchDeletedMenus",
  async (_, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "menuType"),
        where("isDeleted", "==", true)
      );
      const querySnapshot = await getDocs(q);
      const menus = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        name: docSnap.data().name,
        isDeleted: docSnap.data().isDeleted ?? false,
        created_at:
          docSnap.data().created_at?.toDate().toISOString() ||
          new Date().toISOString(),
        imageUrl: docSnap.data().imageUrl || "",
      }));
      return menus;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    // This action stores the currently selected menu name.
    setSelectedMenu: (state, action: PayloadAction<string>) => {
      state.selectedMenu = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedMenu", action.payload);
      }
    },
    resetFetched: (state) => {
      state.fetched = false;
    },
  },
  extraReducers: (builder) => {
    // fetchMenus
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
      // addMenu
      .addCase(addMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMenu.fulfilled, (state, action: PayloadAction<Menu>) => {
        state.loading = false;
        state.menus.push(action.payload);
      })
      .addCase(addMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An error occurred";
      })
      // updateMenu
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
      // removeMenu
      .addCase(removeMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMenu.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.menus = state.menus.filter((menu) => menu.id !== action.payload);
      })
      .addCase(removeMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An Error Occurred";
      })
      // restoreMenu
      .addCase(restoreMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreMenu.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.fetched = false;
      })
      .addCase(restoreMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An error occurred";
      });
  },
});

export const { setSelectedMenu, resetFetched } = menuSlice.actions;
export default menuSlice.reducer;
