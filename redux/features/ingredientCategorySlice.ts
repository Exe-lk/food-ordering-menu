import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/config/firebase";
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, serverTimestamp, query,where, deleteDoc,writeBatch } from "firebase/firestore";


export interface IngredientCategory {
    id:string;
    name:string;
    isDeleted:boolean;
    created_at?:string;
    updated_at?:string;
    created_by?:string;
    updated_by?:string;
}
interface IngredientCategoryState {
    categories:IngredientCategory[];
    loading:boolean;
    error: string | null;
    fetched:boolean;
}

const initialState:IngredientCategoryState = {
    categories:[],
    loading:false,
    error:null,
    fetched:false
}

export const fetchCategories = createAsyncThunk<IngredientCategory[], void, { rejectValue: string }>(
  "ingredientCategory/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const q = query(collection(db, "ingredientCategory"), where("isDeleted", "==", false));
      const querySnapshot = await getDocs(q);
      const categories = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        name: docSnap.data().name,
        isDeleted: docSnap.data().isDeleted ?? false,
        created_at: docSnap.data().created_at?.toDate().toISOString() || new Date().toISOString(),
      }));
      return categories;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCategory = createAsyncThunk<
IngredientCategory,
{name:string},
{rejectValue:string}
>(
    "ingredientCategory/addCategory",
    async ({name},{rejectWithValue}) =>{
        try {
            const q = query(collection(db,"ingredientCategory"),where("name","==",name));
            const querySnapshot = await getDocs(q);
            if(!querySnapshot.empty){
                return rejectWithValue("Category Already Exists");
            }
            const created_by = localStorage.getItem("Name") || "Unknown";
            const categoryData ={
                name,
                created_at:serverTimestamp(),
                isDeleted:false,
                created_by
            };
            const docRef = await addDoc(collection(db,"ingredientCategory"),categoryData);
            return{
                id:docRef.id,
                name,
                created_at: new Date().toISOString(),
                isDeleted:false,
            }
        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }
);

export const deleteCategory = createAsyncThunk<
string,
{id:string},
{rejectValue:string}
>(
    "ingredientCategory/deleteCategory",
    async ({id},{rejectWithValue}) =>{
        try {
            await deleteDoc(doc(db,"ingredientCategory",id));
            return id;
        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }
)

export const restoreCategory = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>(
  "ingredientCategory/restoreCategory",
  async ({ id }, { rejectWithValue }) => {
    try {
      const portionRef = doc(db, "ingredientCategory", id);
      await updateDoc(portionRef, { isDeleted: false, updated_at: serverTimestamp() });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCategory = createAsyncThunk<
string,
{id:string},
{rejectValue:string}
>(
  "ingredientCategory/removeCategory",
  async ({id}, {rejectWithValue}) =>{
    try {
      const menuRef = doc(db,"ingredientCategory",id);
      const docSnap = await getDoc(menuRef);
      if(!docSnap.exists()){
        return rejectWithValue("No Document to update")
      }
      await updateDoc(menuRef,{
        isDeleted:true,
        updated_at:serverTimestamp()
      });
      return id
    } catch (error:any) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchDeletedCategory = createAsyncThunk<
IngredientCategory[],
void,
{rejectValue:string}
>(
    "ingredientCategory/fetchDeletedCategory",
    async (_, {rejectWithValue}) =>{
        try {
            const q = query(collection(db,"ingredientCategory"), where('isDeleted', '==', true));
            const querySnapshot = await getDocs(q);
            const categories = querySnapshot.docs.map((docSnap) =>({
                id:docSnap.id,
                name:docSnap.data().name,
                isDeleted:docSnap.data().isDeleted ?? true,
                created_at:docSnap.data().created_at?.toDate().toISOString() || new Date().toISOString(),
            }));
            return categories;
        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateCategory = createAsyncThunk<
string,
{id: string; updatedName:string;},
{rejectValue:string}
>(
  "ingredientCategory/updateCategory",
  async ({id, updatedName}, {rejectWithValue}) =>{
    try {
      const updated_by = localStorage.getItem("Name") || "Unknown";
      const portionRef = doc(db,"ingredientCategory",id);
      const updateData:any ={
        name:updatedName,
        updated_at:serverTimestamp(),
        updated_by
      };

      await updateDoc(portionRef, updateData);
      return updatedName
    } catch (error:any) {
      return rejectWithValue(error.message)
    }
  }
)

const categorySlice = createSlice({
    name:"ingredientCategory",
    initialState,
    reducers:{
      clearError: (state) => {
        state.error = null;
      },
    },
    extraReducers:(builder) =>{
        builder
        .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
        })
        .addCase(fetchCategories.fulfilled,(state,action:PayloadAction<IngredientCategory[]>) =>{
            state.loading = false;
            state.categories = action.payload;
            state.fetched = true;
        })
        .addCase(fetchCategories.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Error fetching categories";
        })
        .addCase(addCategory.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(addCategory.fulfilled,(state,action:PayloadAction<IngredientCategory>)=>{
            state.loading = false;
            state.categories.push(action.payload);
        })
        .addCase(updateCategory.pending,(state) =>{
            state.loading = true;
            state.error = null
        })
        .addCase(updateCategory.fulfilled,(state) =>{
            state.loading = false
        })
        .addCase(addCategory.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Error adding category";
        })
    }
});
export const {clearError} = categorySlice.actions;
export default categorySlice.reducer;