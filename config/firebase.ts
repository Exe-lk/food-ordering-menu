// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase} from 'firebase/database'
const firebaseConfig = {
  apiKey: "AIzaSyBuAqcp8QCPkdyob6nt6rpFLDnKiq5Nr_A",
  authDomain: "hotel-management-system-c1c7d.firebaseapp.com",
  databaseURL: "https://hotel-management-system-c1c7d-default-rtdb.firebaseio.com",
  projectId: "hotel-management-system-c1c7d",
  storageBucket: "hotel-management-system-c1c7d.firebasestorage.app",
  messagingSenderId: "413947672257",
  appId: "1:413947672257:web:ebcab5bf95ec3ce7390640",
  measurementId: "G-ZV7RKGWQGG"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const database = getDatabase(app)

const storage = getStorage(app);
export {db, storage, database}
export default app
