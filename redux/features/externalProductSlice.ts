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
} from "firebase/firestore";
import { db, storage } from "@/config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { createMenuFromProduct, updateMenu } from "./menuSlice";
import axios from "axios";

export interface ExternalFood {
  id: string;
  name: string;
  brand: string;
  category: string;
  manufactureDate: string;
  expiryDate: string;
  dateIn: string;
  supplier: suppliers[]; 
  description: string;
  unit: string;
  costPrice: string;
  quantity: string;
  image_url: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  isDeleted: boolean;
}

export interface DeletedProduct {
  id: string;
  name: string;
}

export interface suppliers {
  name: string;
}

export interface FoodSize {
  size: string;
  price: string;
}

interface ExternalFoodState {
  externalFoods: ExternalFood[];
  loading: boolean;
  error: string | null;
  fetched: boolean;
}

const initialState: ExternalFoodState = {
  externalFoods: [],
  loading: false,
  error: null,
  fetched: false,
};

export const fetchProducts = createAsyncThunk<
  ExternalFood[],
  void,
  { rejectValue: string }
>(
  "externalFood/fetchExternal",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { products: ExternalFoodState };
    if (state.products.fetched) return state.products.externalFoods;
    try {
      const q = query(
        collection(db, "externalFood"),
        where("isDeleted", "==", false)
      );
      const querySnapshot = await getDocs(q);

      const externalFoods: ExternalFood[] = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        name: docSnap.data().name,
        category: docSnap.data().category,
        description: docSnap.data().description,
        brand: docSnap.data().brand,
        manufactureDate: docSnap.data().manufactureDate,
        expiryDate: docSnap.data().expiryDate,
        dateIn: docSnap.data().dateIn,
        supplier: docSnap.data().supplier,
        unit: docSnap.data().unit,
        costPrice: docSnap.data().costPrice,
        quantity: docSnap.data().quantity,
        image_url: docSnap.data().image_url,
        created_at:
          docSnap.data().created_at?.toDate().toISOString() ||
          new Date().toISOString(),
        updated_at: docSnap.data().updated_at
          ? docSnap.data().updated_at.toDate().toISOString()
          : undefined,
        isDeleted: docSnap.data().isDeleted,
        created_by: docSnap.data().created_by,
        updated_by: docSnap.data().update_at,
      }));
      return externalFoods;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDeletedExternalProducts = createAsyncThunk<
  DeletedProduct[],
  void,
  { rejectValue: string }
>(
  "externalFood/fetchDeleted",
  async (_, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "externalFood"),
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

export const addProduct = createAsyncThunk<
  ExternalFood,
  {
    newProduct: {
      name: string;
      brand: string;
      category: string;
      manufactureDate: string;
      expiryDate: string;
      dateIn: string;
      supplier: string;
      description: string;
      unit: string;
      costPrice: string;
      quantity: string;
      image_url: File | null;
    };
    suppliers: suppliers[]; // pass the supplier array here
  },
  { rejectValue: string }
>(
  "externalFood/addProduct",
  async ({ newProduct, suppliers }, { rejectWithValue }) => {
    try {
      let imageUrl = "";
      if (newProduct.image_url) {
        const imageRef = ref(storage, `externalFood/${newProduct.image_url.name}`);
        await uploadBytes(imageRef, newProduct.image_url);
        imageUrl = await getDownloadURL(imageRef);
      }
      const created_by = localStorage.getItem("Name") || "Unknown";
      const productDate = {
        name: newProduct.name,
        brand: newProduct.brand,
        category: newProduct.category,
        manufactureDate: newProduct.manufactureDate,
        expiryDate: newProduct.expiryDate,
        dateIn: newProduct.dateIn,
        supplier: suppliers || [], // Use an empty array if suppliers is undefined
        description: newProduct.description,
        unit: newProduct.unit,
        costPrice: newProduct.costPrice,
        quantity: newProduct.quantity,
        image_url: imageUrl,
        created_at: serverTimestamp(),
        created_by,
        isDeleted: false,
      };

      const docRef = await addDoc(collection(db, "externalFood"), productDate);
      return {
        id: docRef.id,
        name: newProduct.name,
        brand: newProduct.brand,
        category: newProduct.category,
        manufactureDate: newProduct.manufactureDate,
        expiryDate: newProduct.expiryDate,
        dateIn: newProduct.dateIn,
        supplier: suppliers || [],
        description: newProduct.description,
        unit: newProduct.unit,
        costPrice: newProduct.costPrice,
        quantity: newProduct.quantity,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
        created_by,
        isDeleted: false,
      } as ExternalFood;
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
  "externalFood/removeProduct",
  async ({ id }, { rejectWithValue }) => {
    try {
      const productRef = doc(db, "externalFood", id);
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

export const importExternalProduct = createAsyncThunk<
ExternalFood,
ExternalFood,
{rejectValue:string}
>(
  "externalFood/importExternalProduct",
  async(product,thunkAPI) =>{
    try {
      const created_by = localStorage.getItem("Name") || "Unknown";
      const response = await axios.get(product.image_url,{
        responseType:"blob"
      });
      const blob = response.data;
      const fileName = `${product.name.replace(/\s+/g, "_")}-${Date.now()}.jpg`;
      const imageRef = ref(storage,`externalFood/${fileName}`);
      await uploadBytes(imageRef,blob);
      const newImageUrl = await getDownloadURL(imageRef);
      const menuQuery = query(
        collection(db,"menuType"),
        where("name","==",product.category),
        where("isDeleted",'==',false)
      );
      const menuSnapShot = await getDocs(menuQuery);
      if(menuSnapShot.empty){
        await thunkAPI
          .dispatch(createMenuFromProduct({ menuName: product.category, imageUrl: newImageUrl }))
          .unwrap();
      }
      const productData = {
        name:product.name,
        brand:product.brand,
        category:product.category,
        manufactureDate:product.manufactureDate,
        expiryDate:product.expiryDate,
        dataeIn:product.dateIn,
        supplier:product.supplier,
        description:product.description,
        unit:product.unit,
        costPrice:product.costPrice,
        quantity:product.quantity,
        image_url:newImageUrl,
        created_at:serverTimestamp(),
        created_by,
        isDeleted: false,
      };
      const docRef = await addDoc(collection(db, "externalFood"), productData);
      return {
        ...product,
        id: docRef.id,
        image_url: newImageUrl,
        created_at: new Date().toISOString(),
        isDeleted: false,
        created_by,
      };
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)

export const updateProduct = createAsyncThunk<
  ExternalFood,
  {
    id: string;
    updatedProduct: {
        name: string;
        brand: string;
        description: string;
        category: string;
        manufactureDate: string;
        expiryDate: string;
        dateIn: string;
        supplier: suppliers[];
        unit: string;
        costPrice: string;
        quantity: string;
        image_url: File | null; 
        currentImageUrl: string;
    };
    suppliers: suppliers[];
  },
  { rejectValue: string }
>(
  "externalFood/updateProduct",
  async ({ id, updatedProduct, suppliers }, { rejectWithValue }) => {
    try {
      let imageUrl = updatedProduct.currentImageUrl || "";
      if (updatedProduct.image_url) {
        const imageRef = ref(storage, `externalFood/${updatedProduct.image_url.name}`);
        await uploadBytes(imageRef, updatedProduct.image_url);
        imageUrl = await getDownloadURL(imageRef);
      }
      const updated_by = localStorage.getItem("Name") || "Unknown";
      const updateData = {
        name: updatedProduct.name,
        brand: updatedProduct.brand,
        category: updatedProduct.category,
        manufactureDate: updatedProduct.manufactureDate,
        expiryDate: updatedProduct.expiryDate,
        dateIn: updatedProduct.dateIn,
        supplier: suppliers,
        description: updatedProduct.description,
        unit: updatedProduct.unit,
        costPrice: updatedProduct.costPrice,
        quantity: updatedProduct.quantity,
        image_url: imageUrl,
        updated_at: serverTimestamp(),
        updated_by,
      };
      const productRef = doc(db, "externalFood", id);
      await updateDoc(productRef, updateData);
      return {
        id,
        name: updatedProduct.name,
        brand: updatedProduct.brand,
        category: updatedProduct.category,
        manufactureDate: updatedProduct.manufactureDate,
        expiryDate: updatedProduct.expiryDate,
        dateIn: updatedProduct.dateIn,
        supplier: suppliers,
        description: updatedProduct.description,
        unit: updatedProduct.unit,
        costPrice: updatedProduct.costPrice,
        quantity: updatedProduct.quantity,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
        updated_by,
        isDeleted: false,
      } as ExternalFood;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteExternalProduct = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>(
  "externalFood/deleteProduct",
  async ({ id }, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "externalFood", id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const restoreExternalProduct = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>(
  "externalFood/restoreProduct",
  async ({ id }, { rejectWithValue }) => {
    try {
      const productRef = doc(db, "externalFood", id);
      await updateDoc(productRef, {
        isDeleted: false,
        updated_at: serverTimestamp(),
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const externalFoodSlice = createSlice({
  name: "externalFood",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ExternalFood[]>) => {
        state.loading = false;
        state.externalFoods = action.payload;
        state.fetched = true;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<ExternalFood>) => {
        state.loading = false;
        state.externalFoods.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An Error Occurred";
      });
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<ExternalFood>) => {
        state.loading = false;
        state.externalFoods = state.externalFoods.map((product) =>
          product.id === action.payload.id ? action.payload : product
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An Error Occurred";
      });
    builder
      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.externalFoods = state.externalFoods.filter((product) => product.id !== action.payload);
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "An Error Occurred";
      });
    builder
      .addCase(restoreExternalProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreExternalProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.externalFoods = state.externalFoods.map((product) =>
          product.id === action.payload ? { ...product, isDeleted: false } : product
        );
      });
    builder.addCase(
      updateMenu.fulfilled,
      (state, action: PayloadAction<{ id: string; oldName: string; updatedMenuName: string }>) => {
        const { oldName, updatedMenuName } = action.payload;
        state.externalFoods = state.externalFoods.map((product) =>
          product.category === oldName ? { ...product, category: updatedMenuName } : product
        );
      }
    );
    builder.addCase(importExternalProduct.fulfilled, (state, action: PayloadAction<ExternalFood>) => {
      state.externalFoods.push(action.payload);
    });
  },
});

export default externalFoodSlice.reducer;
