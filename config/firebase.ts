// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase} from 'firebase/database'
const firebaseConfig = {
 apiKey: "AIzaSyBOoxC7szdPcHvFNNUnB_b1yefaScxjZWw",
  authDomain: "hotel-reservation-80793.firebaseapp.com",
  databaseURL: "https://hotel-reservation-80793-default-rtdb.firebaseio.com",
  projectId: "hotel-reservation-80793",
  storageBucket: "hotel-reservation-80793.firebasestorage.app",
  messagingSenderId: "1027286159073",
  appId: "1:1027286159073:web:7bf600abd259e9182bf1a0"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const database = getDatabase(app)

const storage = getStorage(app);
export {db, storage, database}
export default app
