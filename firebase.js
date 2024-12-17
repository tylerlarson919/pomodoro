  // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword as createUserWithEmail, signInWithEmailAndPassword as signInWithEmail } from "firebase/auth";
import {  getFirestore, doc, getDoc, setDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };
// Initialize Firebasegs://tradingty-6ed07.appspot.com
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Set persistence to local
auth.setPersistence(browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to browserLocalPersistence");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

// Google Sign-In
export const signInWithGoogle = async () => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.log("firebase.js | error", error);
    throw error; // re-throw the error to be handled by the caller
  }
};

// Email/Password Sign-Up
export const signUpWithEmailAndPassword = async (email, password) => {
  try {
    return await createUserWithEmail(auth, email, password);
  } catch (error) {
    console.log("firebase.js | error", error);
    throw error; // re-throw the error to be handled by the caller
  }
};

// Email/Password Sign-In
export const signInWithEmailAndPassword = async (email, password) => {
  try {
    return await signInWithEmail(auth, email, password);
  } catch (error) {
    console.log("firebase.js | error", error);
    throw error; // re-throw the error to be handled by the caller
  }
};

// Function to manage user settings
export const editSettings = async (settings) => {
  const user = auth.currentUser;
  if (user) {
    const userSettingsRef = doc(db, "podo", user.uid, "settings", "userSettings");

    // Check if settings document exists
    const settingsDoc = await getDoc(userSettingsRef);
    if (settingsDoc.exists()) {
      // Update existing settings
      await setDoc(userSettingsRef, settings, { merge: true });
      console.log("Settings updated:", settings);
    } else {
      // Create new settings document
      await setDoc(userSettingsRef, settings);
      console.log("Settings created:", settings);
    }
  } else {
    console.error("No user is currently logged in.");
  }
};

// Firestore Collections and Functions

// Function to add a session
export const addSession = async (session) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const userSessionsRef = doc(db, "podo", user.uid, "sessions", session.sessionId); // Change this line
      await setDoc(userSessionsRef, session); // Use setDoc instead of addDoc to create a session with a specific ID
      console.log("Session created with ID: ", session.sessionId);
    }
  } catch (e) {
    console.error("Error adding session: ", e);
  }
};


// Function to update the session when the timer ends
export const endSession = async (sessionId, updateData) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const userSessionsRef = doc(db, "podo", user.uid, "sessions", sessionId); // Use sessionId directly
      await setDoc(userSessionsRef, { currentTimer: false, ...updateData }, { merge: true });
      console.log("Session ended for ID: ", sessionId);
    }
  } catch (e) {
    console.error("Error ending session: ", e);
  }
};


export const getSessions = async () => {
  try {
    const user = auth.currentUser; // Ensure you have the current user
    if (user) {
      const userSessionsCollection = collection(db, "podo", user.uid, "sessions");
      const querySnapshot = await getDocs(userSessionsCollection);
      const sessions = [];
      querySnapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() });
      });
      return sessions;
    } else {
      console.error("No user is currently logged in.");
      return [];
    }
  } catch (e) {
    console.error("Error getting documents: ", e);
  }
};


// Export the initialized Firebase app, auth, and db
export { app, auth, db, storage };
