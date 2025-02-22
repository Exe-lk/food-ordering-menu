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

export const updateIngredient = createAsyncThunk<
  Ingredient,
  { 
    id: string; 
    updatedIngredient: {
      name: string;
      category: string;
      description: string;
      unit: string;
    };
  },
  { rejectValue: string; state: RootState }
>(
  "ingredients/updateIngredient",
  async ({ id, updatedIngredient }, { rejectWithValue }) => {
    try {
      const ingredientRef = doc(db, "ingredients", id);
      const updated_by = localStorage.getItem("Name") || "Unknown";
      await updateDoc(ingredientRef, {
        ...updatedIngredient,
        updated_at: serverTimestamp(),
        updated_by,
      });
      // Fetch the updated document so we can return the latest data
      const docSnap = await getDoc(ingredientRef);
      return {
        id,
        name: docSnap.data()?.name,
        category: docSnap.data()?.category,
        description: docSnap.data()?.description,
        unit: docSnap.data()?.unit,
        brand: docSnap.data()?.brand || "",
        quantity: docSnap.data()?.quantity || "",
        supplier: docSnap.data()?.supplier || "",
        costPrice: docSnap.data()?.costPrice || "",
        dateIn: docSnap.data()?.dateIn || "",
        created_at:
          docSnap.data()?.created_at?.toDate().toISOString() ||
          new Date().toISOString(),
        isDeleted: docSnap.data()?.isDeleted,
        created_by: docSnap.data()?.created_by,
        updated_at: docSnap.data()?.updated_at
          ? docSnap.data()?.updated_at.toDate().toISOString()
          : new Date().toISOString(),
      } as Ingredient;
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
    brand: string;
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
      
     
      const currentQty = parseFloat(currentIngredient.quantity) || 0;
      const additionalQty = parseFloat(quantity) || 0;
      const newQuantity = (currentQty + additionalQty).toString();

      const ingredientRef = doc(db, "ingredients", id);
      const updated_by = localStorage.getItem("Name") || "Unknown";
      
      
      await updateDoc(ingredientRef, {
        quantity: newQuantity,
        updated_at: serverTimestamp(),
        updated_by,
      });
      
      
      const transactionCollectionRef = collection(db, "transactions");
      const transactionRecord = {
        ingredientId: id,
        ingredientName: currentIngredient.name,
        category: currentIngredient.category,
        brand,
        transactionType: "StockIn",
        previousQuantity: currentIngredient.quantity,
        addedQuantity: quantity,
        newQuantity: newQuantity,
        costPrice,
        unit,
        supplier,
        date: dateIn,
        created_at: serverTimestamp(),
        created_by: updated_by,
      };
      await addDoc(transactionCollectionRef, transactionRecord);
      
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
    unit: string;
  },
  { rejectValue: string; state: RootState }
>(
  "ingredients/stockOut",
  async (
    { id, quantity, reason, dateOut, unit },
    { getState, rejectWithValue }
  ) => {
    try {
      // Find the ingredient in state
      const state = getState();
      const currentIngredient = state.ingredients.ingredients.find(
        (ing) => ing.id === id
      );
      if (!currentIngredient) {
        return rejectWithValue("Ingredient not found in state");
      }

      // Validate and compute new quantity
      const currentQty = parseFloat(currentIngredient.quantity) || 0;
      const stockOutQty = parseFloat(quantity);
      if (isNaN(stockOutQty) || stockOutQty <= 0) {
        return rejectWithValue("Invalid stock out quantity");
      }
      if (stockOutQty > currentQty) {
        return rejectWithValue(
          "Stock out quantity cannot exceed available quantity"
        );
      }
      const newQuantity = (currentQty - stockOutQty).toString();

      // Update the ingredient's quantity in Firestore
      const ingredientRef = doc(db, "ingredients", id);
      const updated_by = localStorage.getItem("Name") || "Unknown";
      await updateDoc(ingredientRef, {
        quantity: newQuantity,
        updated_at: serverTimestamp(),
        updated_by,
      });

      // Automatically calculate the total cost price based on the ingredient's costPrice per unit
      const costPerUnit = parseFloat(currentIngredient.costPrice) || 0;
      const totalCostPrice = (costPerUnit * stockOutQty).toFixed(2);

      // Create a transaction record in the "transactions" collection
      const transactionCollectionRef = collection(db, "transactions");
      const transactionRecord = {
        ingredientId: id,
        ingredientName: currentIngredient.name,
        category: currentIngredient.category,
        transactionType: "StockOut",
        previousQuantity: currentIngredient.quantity, // before deduction
        quantity, // issued quantity
        remainingQuantity: newQuantity, // after deduction
        reason,
        date: dateOut,
        costPrice: totalCostPrice, // calculated total cost for issued quantity
        unit, // selected unit
        created_at: serverTimestamp(),
        created_by: updated_by,
      };
      await addDoc(transactionCollectionRef, transactionRecord);

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
    reducers:{
      clearError: (state) => {
        state.error = null;
      },
    },
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
        })
        .addCase(updateIngredient.pending,(state)=>{
          state.loading = true;
          state.error = null;
        })
        .addCase(updateIngredient.fulfilled,(state, action:PayloadAction<Ingredient>)=>{
          state.loading = false;
          state.ingredients.push(action.payload);
        })
        .addCase(updateIngredient.rejected,(state, action) =>{
          state.loading = false;
          state.error = action.payload ?? "An Error Occured"
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
export const { clearError } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;

