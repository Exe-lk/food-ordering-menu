import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/config/firebase";
import { collection, doc, getDoc, setDoc, serverTimestamp, query, where, getDocs, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { RootState } from "../store";

interface Employee{
    id:string;
    name:string;
    empId:string;
    username:string;
    password:string;
    role:string;
    contact:string
    isDeleted:boolean,
    created_at:string,
    updated_at?:string;
    created_by?:string;
    updated_by?:string;
}

interface EmployeeState{
    employees:Employee[];
    loading:boolean;
    error:string | null;
    fetched:boolean
}

const initialState: EmployeeState ={
    employees:[],
    loading:false,
    error:null,
    fetched:false,
}

export interface DeletedEmployee{
    id:string;
    name:string;
}

export const fetchEmployees = createAsyncThunk<
  Employee[],
  void,
  { rejectValue: string }
>(
  "employee/fetchEmployees",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { employee: EmployeeState };
    try {
      const q = query(
        collection(db, "employee"),
        where("isDeleted", "==", false)
      );
      const querySnapshot = await getDocs(q);
      const employees: Employee[] = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        name: docSnap.data().name,
        empId: docSnap.data().empId,
        username: docSnap.data().username,
        password: docSnap.data().password,
        role: docSnap.data().role,
        contact: docSnap.data().contact,
        isDeleted: docSnap.data().isDeleted,
        created_at:
          docSnap.data().created_at?.toDate().toISOString() ||
          new Date().toISOString(),
        updated_at: docSnap.data().updated_at
          ? docSnap.data().updated_at.toDate().toISOString()
          : undefined,
      }));
      return employees;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDeletedEmployees = createAsyncThunk<
DeletedEmployee[],
void,
{rejectValue:string}
>(
    "employee/fetchDeletedEmployees",
    async (_, {rejectWithValue}) =>{
        try {
            const q = query(
                collection(db,"employee"),
                where("isDeleted",'==', true)
            );
            const querySnapshot = await getDocs(q);
            const employees:DeletedEmployee[] = querySnapshot.docs.map((docSnap) => ({
                id:docSnap.id,
                name:docSnap.data().name,
            }));
            return employees;
        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }
)

export const addEmployee = createAsyncThunk<Employee, {name:string; empId:string; username:string; password:string; role:string, contact:string},{rejectValue:string}>(
    "employee/addEmployee",
    async({name, empId, username, password, role, contact}, {rejectWithValue}) =>{
        try {
            const q = query(
                collection(db,"employee"),
                where("empId", '==', empId),
            );
            const querySnapshot = await getDocs(q);
            if(!querySnapshot.empty){
                return rejectWithValue("Employee Already exists")
            }

            const created_by = localStorage.getItem("Name") || "Unknown";
            const employeeData = {
                name,
                empId,
                username,
                password,
                role,
                contact,
                created_at:serverTimestamp(),
                created_by,
                isDeleted:false,
            };
            const docRef = await addDoc(collection(db,"employee"), employeeData);
            return{
                id:docRef.id,
                name,
                empId,
                username,
                password,
                contact,
                role,
                created_by,
                created_at:new Date().toISOString(),
                isDeleted:false
            };
        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }
)

export const removeEmployee = createAsyncThunk<
string,
{id:string},
{rejectValue:string}
>(
    "employee/removeEmployee",
    async({id}, {rejectWithValue}) =>{
        try {
            const employeeRef = doc(db,"employee",id);
            const updated_by = localStorage.getItem("Name") || "Unknown";
            await updateDoc(employeeRef,{
                isDeleted:true,
                updated_by,
                updated_at:serverTimestamp(),
            });
            return id;
        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateEmployee = createAsyncThunk<
string,
{id:string; updatedName:string; updatedUsername:string; updatedPassword:string; updatedContact:string; updatedRole:string, updatedEmpId:string},
{rejectValue:string}
>(
    "employee/updateEmployee",
    async ({id, updatedName, updatedUsername, updatedPassword, updatedContact, updatedRole, updatedEmpId,},{rejectWithValue})=>{
        const updated_by = localStorage.getItem("Name") || "Unknown";
        try {
            const empRef = doc(db,"employee",id);
            const updateData:any = {
                name:updatedName,
                contact:updatedContact,
                role:updatedRole,
                password:updatedPassword,
                username:updatedUsername,
                empId:updatedEmpId,
                updated_by,
                updated_at:serverTimestamp()
            };
            await updateDoc(empRef, updateData)
            return updatedEmpId
        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }
)

export const deleteEmployee = createAsyncThunk<
string,
{id:string},
{rejectValue:string}
>(
    "employee/deleteEmployee",
    async ({id}, {rejectWithValue}) =>{
        try {
            await deleteDoc(doc(db,"employee",id));
            return id;
        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }
)

export const restoreEmployee = createAsyncThunk<
string,
{id:string},
{rejectValue:string}
>(
    "employee/resoreEmployee",
    async ({id}, {rejectWithValue}) =>{
        const updated_by = localStorage.getItem("Name") || "Unknown";
        try {
            const employeeRef = doc(db, "employee",id);
            await updateDoc(employeeRef,{isDeleted:false, updated_at:serverTimestamp(),updated_by})
            return id;
        } catch (error:any) {
            return rejectWithValue(error.message);
        }
    }
)

const employeeSlice = createSlice({
    name:"employee",
    initialState,
    reducers:{
        clearError: (state) => {
            state.error = null;
          },
    },
    extraReducers:(builder) => {
        builder
        .addCase(fetchEmployees.pending,(state) =>{
            state.loading = true;
            state.error = null
        })
        .addCase(fetchEmployees.fulfilled,(state,action:PayloadAction<Employee[]>) =>{
            state.loading = false;
            state.employees = action.payload;
            state.fetched = true;
        })
        .addCase(fetchEmployees.rejected,(state,action) =>{
            state.loading = false;
            state.error = action.payload ?? "An Error Occured";
        })
        .addCase(addEmployee.pending,(state) =>{
            state.loading = true;
            state.error = null;
        })
        .addCase(addEmployee.fulfilled,(state,action: PayloadAction<Employee>) =>{
            state.loading = false;
            state.employees.push(action.payload)
        })
        .addCase(addEmployee.rejected,(state,action) =>{
            state.loading = false;
            state.error = action.payload ?? "an error occured"
        })
    }
});
export const {clearError} = employeeSlice.actions;
export default employeeSlice.reducer;