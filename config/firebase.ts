// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase} from 'firebase/database'
const firebaseConfig = {
  apiKey: "AIzaSyCiC7s2ngVklwjQqcDtDDYhbs2rY6eSexQ",
  authDomain: "restaurantpos-4e3fa.firebaseapp.com",
  databaseURL: "https://restaurantpos-4e3fa-default-rtdb.firebaseio.com",
  projectId: "restaurantpos-4e3fa",
  storageBucket: "restaurantpos-4e3fa.firebasestorage.app",
  messagingSenderId: "116050614647",
  appId: "1:116050614647:web:8d465cb8374bfc8277e972"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const database = getDatabase(app)

const storage = getStorage(app);
export {db, storage, database}
export default app
