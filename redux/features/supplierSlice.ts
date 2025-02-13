import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/config/firebase";
import { collection, doc, getDoc, setDoc,serverTimestamp,query, where, getDocs, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { RootState } from "../store";
interface Supplier{
    id:string;
    name:string;
    address:string;
    contact:string;
    created_at:string;
    created_by?:string;
    updated_at?: string; 
    updated_by?: string;
    isDeleted:boolean;
}
interface SupplierState{
    suppliers:Supplier[],
    loading:boolean;
    error:string | null;
    fetched:boolean
}
const initialState: SupplierState ={
    suppliers:[],
    loading:false,
    error:null,
    fetched:false
}
export const fetchSuppliers = createAsyncThunk<
Supplier[],
void,
{rejectValue:string}
>(
    "supplier/fetchSuppliers",
    async(_, {getState, rejectWithValue}) =>{
        const state = getState() as {supplier:SupplierState};
        if(state.supplier.fetched) return state.supplier.suppliers;
        try {
            const q = query(
                collection(db,"suppliers"),
                where("isDeleted",'==', false)
            );
            const querySnapshot = await getDocs(q);
            const suppliers:Supplier[] = querySnapshot.docs.map((docSnap) =>({
                id:docSnap.id,
                name:docSnap.data().name,
                address:docSnap.data().address,
                contact:docSnap.data().contact,
                isDeleted:docSnap.data().isDeleted,
                created_at:
                docSnap.data().created_at?.toDate().toISOString() ||
                new Date().toISOString(),
                updated_at: docSnap.data().updated_at
                ? docSnap.data().updated_at.toDate().toISOString()
                : undefined,
                created_by:docSnap.data().created_by,
                updated_by:docSnap.data().updated_by

            }));
            return suppliers
        } catch (error:any) {
            return rejectWithValue(error.message);
        }
    }
)
export const addSupplier = createAsyncThunk<Supplier,{name:string; address:string; contact:string}>(
    "supplier/addSupplier",
    async({name, address, contact},{rejectWithValue}) =>{
        try {
            const q = query(
                collection(db,"suppliers"),
                where("name",'==',name)
            );
            const querySnapshot = await getDocs(q);
            if(!querySnapshot.empty){
                return rejectWithValue("Supplier Already Exist");
            }
            const created_by = localStorage.getItem("Name") || "Unknown";
            const supplierData = {
                name,
                address,
                contact,
                created_at:serverTimestamp(),
                isDeleted:false,
                created_by
            };
            const docRef = await addDoc(collection(db,"supplier"),supplierData);
            return{
                id:docRef.id,
                name,
                address,
                contact,
                created_at:new Date().toISOString(),
                isDeleted:false,
                created_by
            };
        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }
)

export const removeSupplier = createAsyncThunk<
string,
{id:string},
{rejectValue:string}
>(
    "supplier/removeSupplier",
    async({id}, {rejectWithValue}) =>{
        try {
            const supplierRef = doc(db,"suppliers",id);
            const updated_by = localStorage.getItem("Name") || "Unknown";
            await updateDoc(supplierRef,{
                isDeleted:true,
                updated_at:serverTimestamp(),
                updated_by:updated_by,
            });
            return id;
        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateSupplier = createAsyncThunk<
string,
{id:string; updatedName:string; updatedContact:string; updatedAddress:string},
{rejectValue:string}
>(
    "supplier/updateSupplier",
    async({id, updatedName, updatedContact, updatedAddress},{rejectWithValue})=>{
        try {
            const supplierRef = doc(db,"suppliers",id);
            const updated_by = localStorage.getItem("Name") || "Unknown";
            const updateData:any = {
                name:updatedName,
                address:updatedAddress,
                contact:updatedContact,
                updated_by:updated_by,
                updated_at:serverTimestamp()
            };
            await updateDoc(supplierRef,updateData)
            return updatedName
        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }
)
export const fetchDeletedSuppliers = createAsyncThunk<
Supplier[],
void,
{rejectValue:string}
>(
    "supplier/fetchDeletedSuppliers",
    async(_,{rejectWithValue}) =>{
        try {
            const q = query(collection(db,"suppliers"),where('isDeleted','==',true));
            const querySnapshot = await getDocs(q);
            const suppliers = querySnapshot.docs.map((docSnap) =>({
                id:docSnap.id,
                name:docSnap.data().name,
                address:docSnap.data().address,
                isDeleted:docSnap.data().isDeleted ?? true,
                contact:docSnap.data().contact,
                created_at:docSnap.data().created_at?.toDate().toISOString() || new Date().toISOString(),
            }));
            return suppliers
        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }
);

export const deleteSupplier = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>(
  "supplier/deleteSuppliers",
  async ({ id }, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "suppliers", id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const restoreSupplier = createAsyncThunk<
string,
{id:string},
{rejectValue:string}
>(
    "supplier/restoreSuppliers",
    async({id}, {rejectWithValue}) =>{
        try {
            const supplierRef = doc(db,"suppliers",id);
            await updateDoc(supplierRef,{isDeleted:false, updated_at:serverTimestamp()});
            return id;
        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }
);

const supplierSlice = createSlice({
    name:"supplier",
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder
        .addCase(fetchSuppliers.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchSuppliers.fulfilled,(state,action:PayloadAction<Supplier[]>) =>{
            state.loading = false;
            state.suppliers = action.payload;
            state.fetched = true;
        })
        .addCase(fetchSuppliers.rejected,(state,action) =>{
            state.loading = false;
            state.error = action.payload ?? "An Error Occured";
        });
        builder
        .addCase(addSupplier.pending,(state) =>{
            state.loading = true;
            state.error = null;
        })
        .addCase(addSupplier.fulfilled,(state, action:PayloadAction<Supplier>) =>{
            state.loading = false;
            state.suppliers.push(action.payload);
        });
        builder
        .addCase(updateSupplier.fulfilled,(state) =>{
            state.loading = false;
        })
        .addCase(updateSupplier.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(updateSupplier.rejected,(state,action) =>{
            state.loading = false;
            state.error = action.payload ?? "An error occurred";
        })
    }
})

export default supplierSlice.reducer