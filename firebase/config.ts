// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBL_tpz-kDmR5MwA-WBOr_05jfcmEEDsB8",
  authDomain: "podo-fe249.firebaseapp.com",
  projectId: "podo-fe249",
  storageBucket: "podo-fe249.firebasestorage.app",
  messagingSenderId: "686732430921",
  appId: "1:686732430921:web:87da249b43e6d91be43998",
  measurementId: "G-K9Z2H9530S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);


