import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db,storage } from "@/config/firebase";
import { collection,doc,getDoc, getDocs, updateDoc,serverTimestamp,query,where,deleteDoc,writeBatch } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface BarMenu{
    id:string;
    name:string;
    isDeleted:boolean;
    created_at:string;
    updated_at?:string;
    imageUrl:string
}

interface BarMenuState{
    menus:BarMenu[];
    selectedMenu:string;
    loading:boolean;
    error:string | null;
    fetched:boolean;
}

const initialState:BarMenuState = {
    menus:[],
    selectedMenu:
    typeof window !== 'undefined'? localStorage.getItem("selectedBarMenu") || "" :"",
    loading:false,
    error:null,
    fetched:false
}
