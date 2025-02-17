import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/config/firebase";
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, serverTimestamp, query, where, deleteDoc, writeBatch } from "firebase/firestore";
import { RootState } from "../store";

export interface Ingredient{
    id:string;
    name:string;
    category:string;
    description:string;
    brand:string;
    quantity:string;
    dateIn:string;
    supplier:string;
    unit:string;
    costPrice:string;
    created_at:string;
    updated_at?:string;
    isDeleted:boolean;
    created_by?:string;
    updated_by?:string;
}

interface IngredientState{
    ingredients:Ingredient[];
    loading:boolean;
    error:string | null;
    fetched:boolean;
}

const initialState:IngredientState = {
    ingredients:[],
    loading:false,
    error:null,
    fetched:false
}
export interface DeletedProduct {
    id: string;
    name: string;
  }

export const fetchIngredients = createAsyncThunk<
Ingredient[],
void,
{rejectValue:string}
>("ingredients/fetchIngredients", async(_, {getState, rejectWithValue}) =>{
    const state = getState() as {ingredients:IngredientState};
    try {
        const q = query(
            collection(db, "ingredients"),
            where("isDeleted","==",false)
        );
        const querySnapshot = await getDocs(q);
        const ingredients:Ingredient[] = querySnapshot.docs.map((docSnap) =>({
            id:docSnap.id,
            name:docSnap.data().name,
            brand:docSnap.data().brand,
            category:docSnap.data().category,
            unit:docSnap.data().unit,
            quantity:docSnap.data().quantity,
            supplier:docSnap.data().supplier,
            dateIn:docSnap.data().dateIn,
            description:docSnap.data().description,
            costPrice:docSnap.data().costPrice,
            created_at:
                docSnap.data().created_at?.toDate().toISOString() ||
                new Date().toISOString(),
            updated_at: docSnap.data().updated_at
                ? docSnap.data().updated_at.toDate().toISOString()
                : undefined,
            isDeleted: docSnap.data().isDeleted,

        }));
        return ingredients
    } catch (error:any) {
        return rejectWithValue(error.message);
    }
});

export const fetchDeletedIngredients = createAsyncThunk<
  DeletedProduct[],
  void,
  { rejectValue: string }
>(
  "ingredients/fetchDeletedIngredients",
  async (_, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, "ingredients"),
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

export const stockIn = createAsyncThunk<
  Ingredient, 
  {
    id: string;
    quantity: string;
    costPrice: string;
    brand:string;
    unit: string;
    supplier: string;
    dateIn: string;
  },
  { rejectValue: string; state: RootState }
>(
  "ingredients/stockIn",
  async (
    { id, quantity, costPrice, unit, supplier, dateIn, brand },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const currentIngredient = state.ingredients.ingredients.find(
        (ing) => ing.id === id
      );
      if (!currentIngredient) {
        return rejectWithValue("Ingredient not found in state");
      }
      const ingredientRef = doc(db, "ingredients", id);
      const updated_by = localStorage.getItem("Name") || "Unknown";
      await updateDoc(ingredientRef, {
        quantity,
        updated_at: serverTimestamp(),
        updated_by,
      });
      const stockInCollectionRef = collection(db, "stockInRecords");
      const stockInRecord = {
        ingredientId: id,
        ingredientName: currentIngredient.name,
        category: currentIngredient.category,
        brand,
        previousQuantity: currentIngredient.quantity,
        newQuantity: quantity,
        costPrice,
        unit,
        supplier,
        dateIn,
        created_at: serverTimestamp(),
        created_by: updated_by,
      };
      await addDoc(stockInCollectionRef, stockInRecord);
      return {
        ...currentIngredient,
        quantity,
        updated_at: new Date().toISOString(),
        updated_by,
      } as Ingredient;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addIngredients = createAsyncThunk<
Ingredient,
{
    newIngredients:{
        name:string;
        category:string;
        description:string;
        unit:string
    };
},
{rejectValue:string}
>(
    "ingredients/addIngredients",
    async({newIngredients}, {rejectWithValue}) =>{
        try {
            const created_by = localStorage.getItem("Name") || "Unknown";
            const categoryData = {
                name:newIngredients.name,
                category:newIngredients.category,
                description:newIngredients.description,
                unit:newIngredients.unit,
                created_at:serverTimestamp(),
                created_by,
                isDeleted:false
            };
            const docRef = await addDoc(collection(db,"ingredients"),categoryData);
            return{
                id:docRef.id,
                name:newIngredients.name,
                category:newIngredients.category,
                description:newIngredients.description,
                unit:newIngredients.unit,
                isDeleted:false,
                created_at: new Date().toISOString(),
                created_by,
            } as Ingredient;
            
        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }
)

export const removeIngredient = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>(
  "ingredients/removeIngredient",
  async ({ id }, { rejectWithValue }) => {
    try {
      const productRef = doc(db, "ingredients", id);
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

export const deleteIngredient = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>(
  "ingredients/deleteIngredient",
  async ({ id }, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "ingredients", id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const restoreIngredient = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>(
  "ingredients/restoreIngredient",
  async ({ id }, { rejectWithValue }) => {
    try {
      const productRef = doc(db, "ingredients", id);
      await updateDoc(productRef, { isDeleted: false, updated_at: serverTimestamp() });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const stockOut = createAsyncThunk<
  Ingredient,
  {
    id: string;
    quantity: string;
    reason: string;
    dateOut: string;
  },
  { rejectValue: string; state: RootState }
>(
  "ingredients/stockOut",
  async ({ id, quantity, reason, dateOut }, { getState, rejectWithValue }) => {
    try {
      // Find the ingredient in state
      const state = getState();
      const currentIngredient = state.ingredients.ingredients.find(
        (ing) => ing.id === id
      );
      if (!currentIngredient) {
        return rejectWithValue("Ingredient not found in state");
      }

      // Convert quantities to numbers and check for valid input
      const currentQty = parseFloat(currentIngredient.quantity) || 0;
      const stockOutQty = parseFloat(quantity);
      if (isNaN(stockOutQty) || stockOutQty <= 0) {
        return rejectWithValue("Invalid stock out quantity");
      }
      if (stockOutQty > currentQty) {
        return rejectWithValue("Stock out quantity cannot exceed available quantity");
      }
      const newQuantity = (currentQty - stockOutQty).toString();
      const ingredientRef = doc(db, "ingredients", id);
      const updated_by = localStorage.getItem("Name") || "Unknown";
      await updateDoc(ingredientRef, {
        quantity: newQuantity,
        updated_at: serverTimestamp(),
        updated_by,
      });
      const stockOutCollectionRef = collection(db, "stockOutRecords");
      const stockOutRecord = {
        ingredientId: id,
        ingredientName: currentIngredient.name,
        category: currentIngredient.category,
        previousQuantity: currentIngredient.quantity,
        stockOutQuantity: quantity,
        newQuantity: newQuantity,
        reason,
        dateOut,
        created_at: serverTimestamp(),
        created_by: updated_by,
      };
      await addDoc(stockOutCollectionRef, stockOutRecord);
      return {
        ...currentIngredient,
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
        updated_by,
      } as Ingredient;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const ingredientsSlice = createSlice({
    name:"ingredients",
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder
        .addCase(addIngredients.pending,(state) =>{
            state.loading = true;
            state.error = null;
        })
        .addCase(addIngredients.fulfilled,
            (state, action:PayloadAction<Ingredient>) =>{
                state.loading = false;
                state.ingredients.push(action.payload);
            }
        )
        .addCase(addIngredients.rejected,(state, action) =>{
            state.loading = false;
            state.error = action.payload ?? "An Error Occured";
        });
        builder
        .addCase(fetchIngredients.pending,(state) =>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchIngredients.fulfilled,(state,action:PayloadAction<Ingredient[]>) =>{
            state.loading = false;
            state.ingredients = action.payload;
            state.fetched = true;
        })
        .addCase(fetchIngredients.rejected,(state,action) =>{
            state.loading = false;
            state.error = action.payload || "Error fetching ingredients"
        })
        .addCase(stockIn.pending,(state) =>{
            state.loading = true;
            state.error = null;
        })
        .addCase(stockIn.fulfilled, (state, action:PayloadAction<Ingredient>) =>{
            state.loading = false;
            const index = state.ingredients.findIndex(
                (ing) => ing.id === action.payload.id
            );
            if(index !== -1){
                state.ingredients[index] = action.payload
            }
        })
        .addCase(stockIn.rejected,(state,action) =>{
            state.loading = false;
            state.error = action.payload || "An Error Occured"
        });
        builder.addCase(removeIngredient.fulfilled, (state, action: PayloadAction<string>) => {
          state.ingredients = state.ingredients.filter(
            (ingredient) => ingredient.id !== action.payload
          );
        });
        builder
        .addCase(stockOut.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(stockOut.fulfilled, (state, action: PayloadAction<Ingredient>) => {
          state.loading = false;
          const index = state.ingredients.findIndex(
            (ing) => ing.id === action.payload.id
          );
          if (index !== -1) {
            state.ingredients[index] = action.payload;
          }
        })
        .addCase(stockOut.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "An error occurred during stock out.";
        });
        
    }
})
export default ingredientsSlice.reducer;

