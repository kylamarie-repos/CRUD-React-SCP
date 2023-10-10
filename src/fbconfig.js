// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkjpUmJg0FqUPhPCTG1SG-IWbK-v45BHY",
  authDomain: "scp-crud-19495.firebaseapp.com",
  projectId: "scp-crud-19495",
  storageBucket: "scp-crud-19495.appspot.com",
  messagingSenderId: "1076575037135",
  appId: "1:1076575037135:web:6e0bbdb9d5a994bb2839ba"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);