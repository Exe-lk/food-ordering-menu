// src/redux/features/internalProductSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/config/firebase";

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

// Fetch all products (if needed)
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
    }));
    return internalFoods;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

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
      let imageUrl = "";
      if (newProduct.image) {
        const imageRef = ref(storage, `internalFood/${newProduct.image.name}`);
        await uploadBytes(imageRef, newProduct.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const productData = {
        name: newProduct.name,
        category: newProduct.category,
        description: newProduct.description,
        imageUrl,
        sizes: productSizes,
        created_at: serverTimestamp(),
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

const internalFoodSlice = createSlice({
  name: "internalFood",
  initialState,
  reducers: {},
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
  },
});

export default internalFoodSlice.reducer;
