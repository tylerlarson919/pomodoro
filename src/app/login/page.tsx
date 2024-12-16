"use client";
import type { NextPage } from "next";
import { useState, useCallback } from "react";
import { auth, signInWithGoogle } from "../../../firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  AuthError, GoogleAuthProvider, User 
} from "firebase/auth";
import { useRouter } from "next/navigation";


export type LoginType = {
  className?: string;
  onSuccess?: (email: string, password: string) => void;
};



const Login: NextPage<LoginType> = ({ className = "", onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false)
  const [user, setUser] = useState<User | null>(null);

  const handleAuthError = (err: unknown) => {
    const error = err as AuthError;
    console.error("Full error:", error);

    switch (error.code) {
      case 'auth/popup-closed-by-user':
        setError("Google sign-in was cancelled.");
        break;
      case 'auth/internal-error':
        setError("An internal authentication error occurred. Please check your configuration.");
        break;
      case 'auth/invalid-credential':
        setError("Invalid credentials. Please try again.");
        break;
      case 'auth/network-request-failed':
        setError("Network error. Please check your internet connection.");
        break;
      default:
        setError("Google login failed. Please try again.");
    }
  };

  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithGoogle();
      console.log("sign-in-form.tsx | result", result);
      if (onSuccess) onSuccess("", ""); // Google sign-in doesn't use email/password
      router.push("/timer"); // Redirect to /app
    } catch (error) {
      console.log("sign-in-form | ERROR", error);
    }
  }, [router, onSuccess]);
  
  const onEmailSignUpButtonClick = useCallback(async () => {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }
  
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log("sign-in-form.tsx | result", result);
      if (onSuccess) onSuccess(email, password); // Pass email and password
      router.push("/timer"); // Redirect to /app
    } catch (error) {
      console.log("sign-in-form.tsx | ERROR", error);
    }
  }, [email, password, router, onSuccess]);

  const onEmailLoginButtonClick = useCallback(async () => {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }
  
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("sign-in-form.tsx | result", result);
      if (onSuccess) onSuccess(email, password); // Pass email and password
      router.push("/timer"); // Redirect to /app
    } catch (error) {
      console.log("sign-in-form.tsx | ERROR", error);
    }
  }, [email, password, router, onSuccess]);
  
  

    return (
      <div className="p-5 max-w-md mx-auto flex flex-col gap-3">
        <h1 className="text-2xl font-bold">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        
        <button
          onClick={loginWithGoogle}
          disabled={loading}
          className={`px-4 py-2 bg-blue-500 text-white rounded ${loading ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600"}`}
        >
          {loading ? "Logging in..." : "Login with Google"}
        </button>
    
        <hr className="my-3" />
    
        <form onSubmit={(e) => { e.preventDefault(); onEmailLoginButtonClick(); }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 bg-green-500 text-white rounded ${loading ? "cursor-not-allowed opacity-50" : "hover:bg-green-600"}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          onClick={onEmailSignUpButtonClick}
          disabled={loading}
          className={`px-4 py-2 bg-yellow-500 text-white rounded ${loading ? "cursor-not-allowed opacity-50" : "hover:bg-yellow-600"}`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    );    
};

export default Login;