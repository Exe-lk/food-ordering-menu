import { db } from "@/config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export interface UserLoginData {
    name:string;
    username:string;
    id:string
}
export const logUserLogin = async (userData:UserLoginData) =>{
    try {
        const logData = {
            ...userData,
            loginTime:serverTimestamp(),
        };

        const docRef = await addDoc(collection(db,"loginLogs"), logData);
        return docRef;
    } catch (error) {
        throw error;
    }
}