// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAUDvSLD3oMNBqPJUz3K8Q60FQ_6mbvQzI",
  authDomain: "food-ordering-f3d39.firebaseapp.com",
  projectId: "food-ordering-f3d39",
  storageBucket: "food-ordering-f3d39.firebasestorage.app",
  messagingSenderId: "33591154231",
  appId: "1:33591154231:web:3b60b7cf32390e27be51b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export {db}
export default app