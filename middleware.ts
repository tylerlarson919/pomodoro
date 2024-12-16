import { NextRequest, NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBL_tpz-kDmR5MwA-WBOr_05jfcmEEDsB8",
  authDomain: "podo-fe249.firebaseapp.com",
  projectId: "podo-fe249",
  storageBucket: "podo-fe249.firebasestorage.app",
  messagingSenderId: "686732430921",
  appId: "1:686732430921:web:87da249b43e6d91be43998",
  measurementId: "G-K9Z2H9530S"
};

// Ensure Firebase is initialized
const app = initializeApp(firebaseConfig);

export function middleware(req: NextRequest) {
  const auth = getAuth(app);
  const user = auth.currentUser;

  if (!user && req.nextUrl.pathname.startsWith("/app")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
