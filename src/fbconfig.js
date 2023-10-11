// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA_4awqTey5KwEOA7Y8HI0qViyRR9FloMA",
    authDomain: "scp-crud-21c0b.firebaseapp.com",
    projectId: "scp-crud-21c0b",
    storageBucket: "scp-crud-21c0b.appspot.com",
    messagingSenderId: "374101870029",
    appId: "1:374101870029:web:26710d962f89541e3d3084"
  };


// Initializing firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);