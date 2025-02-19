import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { error } from "console";

interface QrState{
    link:string;
    loading:boolean;
    error:string | null;
}

const initialState:QrState ={
    link:"",
    loading:false,
    error:null
}

export const fetchQrLink = createAsyncThunk<string>(
    "qr/fetchQrLink",
    async(_, {rejectWithValue}) =>{
        try {
            const docRef = doc(db,"qrCodes","restaurantMenu");
            const docSnap = await getDoc(docRef);
            if(!docSnap.exists()){
                throw new Error("QR Doc not found");
            }
            const data = docSnap.data();
            return data.link as string;
        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }
);

const qrSlice = createSlice({
    name:"qr",
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder.addCase(fetchQrLink.pending,(state) =>{
            state.loading = true;
            state.error = null
        })
        .addCase(fetchQrLink.fulfilled,(state,action:PayloadAction<string>) =>{
            state.loading =false;
            state.link = action.payload
        })
        .addCase(fetchQrLink.rejected,(state,action) =>{
            state.loading = false;
            state.error = action.payload as string
        })
    }
})

export default qrSlice.reducer