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
import { Input, Image, Button, Divider } from "@nextui-org/react";
import Link from "next/link";

const Login: NextPage = () => {
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
      router.push("/timer"); // Redirect to /timer
    } catch (error) {
      console.log("sign-in-form | ERROR", error);
    }
  }, [router]);
  
  
  const onEmailLoginButtonClick = useCallback(async () => {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }
  
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("sign-in-form.tsx | result", result);
      router.push("/timer"); // Redirect to /app
    } catch (error) {
      console.log("sign-in-form.tsx | ERROR", error);
    }
  }, [email, password, router]);
  
  
  

    return (
      <div className="p-5 w-full h-full min-h-screen mx-auto flex flex-col bg-darkaccent justify-center items-center gap-10">
        <Image
          disableSkeleton
          className="dark h-full"
          src="./logo/focus-flow-logo-white.png"
          alt="Focus Flow logo"
          width={150}
        />
        <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-white">Login</h1>
          <div className="flex flex-row gap-1">
            <p className="text-textcolor">Don't have an account yet?</p>
            <Link href="/signup" className="text-secondary hover:text-gray-400">Sign Up</Link>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={(e) => { e.preventDefault(); onEmailLoginButtonClick(); }} className="flex flex-col gap-4 w-[300px] sm:w-[400px]">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="dark w-full "
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="dark w-full "
            />
            <Button
              variant="bordered"
              color="primary"
              type="submit"
              disabled={loading}
              className={`w-full dark ${loading ? "cursor-not-allowed" : ""}`}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className=" py-1.5 max-w-[300px] sm:max-w-[400px] flex flex-row gap-4 justify-center items-center">
            <Divider className="dark w-[100px] bg-gray-500" />
            <p className="text-gray-500">or</p>
            <Divider className="dark w-[100px] bg-gray-500" />
          </div>
          <Button
            startContent={<Image src="/icons/google-logo.webp" alt="Google Icon" width={20} height={20} />}
            variant="bordered"
            color="secondary"
            onPress={loginWithGoogle}
            disabled={loading}
            className={`w-[300px] sm:w-[400px] dark ${loading ? "cursor-not-allowed" : ""}`}
          >
            {loading ? "Logging in..." : "Login with Google"}
          </Button>
        </div>
      </div>
    );    
};
export default Login;
