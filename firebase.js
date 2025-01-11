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

// Function to determine if a user trialStartDate exists
export const doesUserTrialStartDateExist = async () => {
  const user = auth.currentUser;
  if (user) {
    const userSettingsRef = doc(db, "podo", user.uid, "settings", "userSettings");
    const settingsDoc = await getDoc(userSettingsRef);

    if (settingsDoc.trialStartDate) {
      // Update existing settings
      return true;
    } else {
      return false;
    }
  } else {
    console.log("No user is currently logged in.");
  }
};

// Function to check if the user is paid or currenently within their trial period
export const isUserPaidOrTrial = async () => {
  const user = auth.currentUser;
  if (user) {
    const userSettingsRef = doc(db, "podo", user.uid, "settings", "userSettings");
    const settingsDoc = await getDoc(userSettingsRef);
    
    // Ensure the settings document exists
    if (!settingsDoc.exists()) {
      console.log("User settings document does not exist.");
      return false;
    }

    const data = settingsDoc.data();

    // Access values correctly based on the Firestore structure
    const isPaidUser = data.isPaidUser; // Access booleanValue for isPaidUser
    const trialStartDate = data.trialStartDate ? data.trialStartDate.timestampValue : null; // Access timestampValue for trialStartDate

    let isInTrial = false; // Default value for isInTrial

    // Check if trialStartDate exists
    if (trialStartDate) {
      // Convert trialStartDate to a Date object
      const trialStartDateObj = new Date(trialStartDate);
      // Calculate trialEndDate
      const trialEndDate = new Date(trialStartDateObj);
      trialEndDate.setDate(trialEndDate.getDate() + 7); // Add 7 days to trialStartDate

      // Check if the trial period has ended
      isInTrial = trialEndDate >= new Date(); // true if still in trial
    }

    // Return true if the user is either paid or in trial
    return isPaidUser || isInTrial; 
  } else {
    console.log("No user is currently logged in.");
    return false; // Return false if no user is logged in
  }
};

export const isUserPaid = async () => {
  const user = auth.currentUser;
  if (user) {
    const userSettingsRef = doc(db, "podo", user.uid, "settings", "userSettings");
    const settingsDoc = await getDoc(userSettingsRef);
    
    // Ensure the settings document exists
    if (!settingsDoc.exists()) {
      console.log("User settings document does not exist.");
      return false;
    }

    const data = settingsDoc.data();

    // Access values correctly based on the Firestore structure
    const isPaidUser = data.isPaidUser; // Access booleanValue for isPaidUser
    
    return isPaidUser; 
  } else {
    console.log("No user is currently logged in.");
    return false; // Return false if no user is logged in
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
    } else {
      // Create new settings document
      await setDoc(userSettingsRef, settings);
    }
  } else {
    console.log("No user is currently logged in.");
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
      console.log("No user is currently logged in.");
      return [];
    }
  } catch (e) {
    console.error("Error getting documents: ", e);
  }
};

export const getStreak = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("No user is currently logged in.");
      return 0;
    }


    // Get all sessions
    const userSessionsCollection = collection(db, "podo", user.uid, "sessions");
    const querySnapshot = await getDocs(userSessionsCollection);

    // Convert sessions to dates and sort them in descending order
    const sessionDates = querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        if (data.status === "finished") {
          return data.startTime;
        }
        return null;
      })
      .filter(date => {
        if (!date) console.warn("Undefined date or status not 'finished', filtering it out.");
        return date;
      })
      .map(date => new Date(date).toDateString())
      .reduce((acc, date) => {
        acc[date] = true;
        return acc;
      }, {});

    const dates = Object.keys(sessionDates)
      .map(date => new Date(date))
      .sort((a, b) => b - a); // Sort in descending order

    if (dates.length === 0) {
      console.log("No valid session dates found.");
      return 0;
    }

    // Get today's date without time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If no session today, check if there was one yesterday to continue the streak
    const mostRecentDate = new Date(dates[0]);
    mostRecentDate.setHours(0, 0, 0, 0);

    if (mostRecentDate < today) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (mostRecentDate < yesterday) {
        return 0;
      }
    }

    // Calculate streak
    let streak = 1;
    let currentDate = mostRecentDate;

    for (let i = 1; i < dates.length; i++) {
      const previousDate = new Date(dates[i]);
      previousDate.setHours(0, 0, 0, 0);

      // Check if dates are consecutive
      const expectedPreviousDate = new Date(currentDate);
      expectedPreviousDate.setDate(expectedPreviousDate.getDate() - 1);

      if (previousDate.getTime() === expectedPreviousDate.getTime()) {
        streak++;
        currentDate = previousDate;
      } else {
        break;
      }
    }

    return streak;

  } catch (e) {
    console.error("Error calculating streak: ", e);
    return 0;
  }
};


// Export the initialized Firebase app, auth, and db
export { app, auth, db, storage };
