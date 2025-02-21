// src/redux/features/internalFoodSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/config/firebase";
// Import the updateMenu thunk from the menu slice
import { updateMenu } from "@/redux/features/menuSlice";

export interface FoodSize {
  size: string;
  price: string;
}

export interface InternalFood {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  sizes: FoodSize[];
  created_at: string;
  updated_at?: string;
  isDeleted: boolean;
  created_by?:string;
  updated_by?:string;
}

interface InternalFoodState {
  internalFoods: InternalFood[];
  loading: boolean;
  error: string | null;
  fetched: boolean;
}

const initialState: InternalFoodState = {
  internalFoods: [],
  loading: false,
  error: null,
  fetched: false,
};

export interface DeletedProduct {
  id: string;
  name: string;
}

export const fetchProducts = createAsyncThunk<
  InternalFood[],
  void,
  { rejectValue: string }
>("internalFood/fetchProducts", async (_, { getState, rejectWithValue }) => {
  const state = getState() as { products: InternalFoodState };
  if (state.products.fetched) return state.products.internalFoods;
  try {
    const q = query(
      collection(db, "internalFood"),
      where("isDeleted", "==", false)
    );
    const querySnapshot = await getDocs(q);
    const internalFoods: InternalFood[] = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      name: docSnap.data().name,
      category: docSnap.data().category,
      description: docSnap.data().description,
      imageUrl: docSnap.data().imageUrl || "",
      sizes: docSnap.data().sizes,
      created_at:
        docSnap.data().created_at?.toDate().toISOString() ||
        new Date().toISOString(),
      updated_at: docSnap.data().updated_at
        ? docSnap.data().updated_at.toDate().toISOString()
        : undefined,
      isDeleted: docSnap.data().isDeleted,
      created_by: docSnap.data().created_by,
    }));
    return internalFoods;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchDeletedProducts = createAsyncThunk<
  DeletedProduct[],
  void,
  { rejectValue: string }
>(
  "internalFood/fetchDeletedProducts",
  async (_, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "internalFood"),
        
        where("isDeleted", "==", true)
      );
      const querySnapshot = await getDocs(q);
      const deletedProducts: DeletedProduct[] = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        name: docSnap.data().name,
      }));
      return deletedProducts;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Add a new product
export const addProduct = createAsyncThunk<
  InternalFood,
  {
    newProduct: {
      name: string;
      category: string;
      description: string;
      image: File | null;
    };
    productSizes: FoodSize[];
  },
  { rejectValue: string }
>(
  "internalFood/addProduct",
  async ({ newProduct, productSizes }, { rejectWithValue }) => {
    try {
      const productQuery = query(
        collection(db, "internalFood"),
        where("name", "==", newProduct.name),
      );
      const productSnapshot = await getDocs(productQuery);
      if (!productSnapshot.empty) {
        return rejectWithValue("Product with this name already exists.");
      }
      let imageUrl = "";
      if (newProduct.image) {
        const imageRef = ref(storage, `internalFood/${newProduct.image.name}`);
        await uploadBytes(imageRef, newProduct.image);
        imageUrl = await getDownloadURL(imageRef);
      }


      const created_by = localStorage.getItem("Name") || "Unknown";

      const productData = {
        name: newProduct.name,
        category: newProduct.category,
        description: newProduct.description,
        imageUrl,
        sizes: productSizes,
        created_at: serverTimestamp(),
        created_by,
        isDeleted: false,
      };

      const docRef = await addDoc(collection(db, "internalFood"), productData);

      return {
        id: docRef.id,
        name: newProduct.name,
        category: newProduct.category,
        description: newProduct.description,
        imageUrl,
        isDeleted: false,
        sizes: productSizes,
        created_at: new Date().toISOString(),
        created_by,
      } as InternalFood;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch products for a given category (menu name)
export const fetchCategory = createAsyncThunk<
  InternalFood[],
  { category: string },
  { rejectValue: string }
>(
  "internalFood/fetchCategory",
  async ({ category }, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "internalFood"),
        where("category", "==", category),
        where("isDeleted", "==", false)
      );
      const querySnapshot = await getDocs(q);
      const internalFoods: InternalFood[] = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        name: docSnap.data().name,
        category: docSnap.data().category,
        imageUrl: docSnap.data().imageUrl || "",
        sizes: docSnap.data().sizes,
        description: docSnap.data().description,
        created_at:
          docSnap.data().created_at?.toDate().toISOString() ||
          new Date().toISOString(),
        updated_at: docSnap.data().updated_at
          ? docSnap.data().updated_at.toDate().toISOString()
          : undefined,
        isDeleted: docSnap.data().isDeleted,
      }));
      return internalFoods;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeProduct = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>(
  "internalFood/removeProduct",
  async ({ id }, { rejectWithValue }) => {
    try {
      const productRef = doc(db, "internalFood", id);
      await updateDoc(productRef, {
        isDeleted: true,
        updated_at: serverTimestamp(),
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk<
  InternalFood,
  {
    id: string;
    updatedProduct: {
      name: string;
      category: string;
      description: string;
      image?: File | null;
      currentImageUrl?: string;
    };
    productSizes: FoodSize[];
  },
  { rejectValue: string }
>(
  "internalFood/updateProduct",
  async ({ id, updatedProduct, productSizes }, { rejectWithValue }) => {
    try {
      const productQuery = query(
        collection(db, "internalFood"),
        where("name", "==", updatedProduct.name),
      );
      const productSnapshot = await getDocs(productQuery);
      let conflictFound = false;
      productSnapshot.forEach((docSnap) => {
        if (docSnap.id !== id) {
          conflictFound = true;
        }
      });
      if (conflictFound) {
        return rejectWithValue("Product with this name already exists.");
      }
      let imageUrl = updatedProduct.currentImageUrl || "";
      if (updatedProduct.image) {
        const imageRef = ref(storage, `internalFood/${updatedProduct.image.name}`);
        await uploadBytes(imageRef, updatedProduct.image);
        imageUrl = await getDownloadURL(imageRef);
      }
      const updated_by = localStorage.getItem("Name") || "Unknown";
      const updateData = {
        name: updatedProduct.name,
        category: updatedProduct.category,
        description: updatedProduct.description,
        imageUrl,
        sizes: productSizes,
        updated_at: serverTimestamp(),
        updated_by,
      };
      const productRef = doc(db, "internalFood", id);
      await updateDoc(productRef, updateData);
      return {
        id,
        name: updatedProduct.name,
        category: updatedProduct.category,
        description: updatedProduct.description,
        imageUrl,
        sizes: productSizes,
        updated_at: new Date().toISOString(),
        isDeleted: false,
        updated_by
      } as InternalFood;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>(
  "internalFood/deleteProduct",
  async ({ id }, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "internalFood", id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const restoreProduct = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>(
  "internalFood/restoreProduct",
  async ({ id }, { rejectWithValue }) => {
    try {
      const productRef = doc(db, "internalFood", id);
      await updateDoc(productRef, { isDeleted: false, updated_at: serverTimestamp() });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const internalFoodSlice = createSlice({
  name: "internalFood",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // addProduct cases
    builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<InternalFood>) => {
          state.loading = false;
          state.internalFoods.push(action.payload);
        }
      )
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An error occurred";
      });
    // fetchProducts cases
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<InternalFood[]>) => {
          state.loading = false;
          state.internalFoods = action.payload;
          state.fetched = true;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An error occurred";
      });
    // fetchCategory cases
    builder
      .addCase(fetchCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategory.fulfilled,
        (state, action: PayloadAction<InternalFood[]>) => {
          state.loading = false;
          state.internalFoods = action.payload;
          state.fetched = true;
        }
      )
      .addCase(fetchCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An error occurred";
      });
    // updateProduct cases
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<InternalFood>) => {
          state.loading = false;
          state.internalFoods = state.internalFoods.map((prod) =>
            prod.id === action.payload.id ? action.payload : prod
          );
        }
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An error occurred";
      });
    // removeProduct cases
    builder
      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.internalFoods = state.internalFoods.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An error occurred";
      });
    // restoreProduct cases
    builder
      .addCase(restoreProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.fetched = false;
      })
      .addCase(restoreProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An error occurred";
      });
    // Extra reducer: Update internal food category when menu is updated
    builder.addCase(
      updateMenu.fulfilled,
      (state, action: PayloadAction<{ id: string; oldName: string; updatedMenuName: string }>) => {
        const { oldName, updatedMenuName } = action.payload;
        state.internalFoods = state.internalFoods.map((food) =>
          food.category === oldName ? { ...food, category: updatedMenuName } : food
        );
      }
    );
  },
});
export const { clearError } = internalFoodSlice.actions;
export default internalFoodSlice.reducer;
