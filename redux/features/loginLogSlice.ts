import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserLoginData, logUserLogin } from "@/service/loginService";

interface LoginLogState{
    log:UserLoginData | null;
    loading:boolean;
    error:string | null;
}

const initialState: LoginLogState = {
    log:null,
    loading:false,
    error:null,
};

export const logLogin = createAsyncThunk(
    "loginLog/logLogin",
    async (userData:UserLoginData, {rejectWithValue}) =>{
        try {
            const docRef = await logUserLogin(userData);
            return { ...userData, id: docRef.id };

        } catch (error:any) {
            return rejectWithValue(error.message)
        }
    }

);

const loginLogSlice = createSlice({
    name:"loginLog",
    initialState,
    reducers:{},
    extraReducers:(builder) =>{
        builder
        .addCase(logLogin.pending,(state) =>{
            state.loading = true;
            state.error = null;
        })
        .addCase(logLogin.fulfilled, (state,action) =>{
            state.loading = false;
            state.log = action.payload
        })
        .addCase(logLogin.rejected, (state, action) =>{
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default loginLogSlice.reducer
