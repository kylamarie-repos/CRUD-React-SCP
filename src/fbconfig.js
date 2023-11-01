// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoNO0fsRQo1cvfggQajGNZXbTJNmgG8V0",
  authDomain: "scp-crud-react-assign-56146.firebaseapp.com",
  projectId: "scp-crud-react-assign-56146",
  storageBucket: "scp-crud-react-assign-56146.appspot.com",
  messagingSenderId: "84397266198",
  appId: "1:84397266198:web:bb2cccd3f441801cf6ec37"
};


// Initializing firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);