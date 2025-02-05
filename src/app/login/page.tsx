"use client";
import React from "react";
import type { NextPage } from "next";
import { useState, useCallback, useEffect } from "react";
import { auth, editSettings, doesUserTrialStartDateExist } from "../../../firebase";
import {  } from "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, getRedirectResult } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Input, Image, Button, Divider } from "@nextui-org/react";
import Link from "next/link";
import EyeIcon from  "../../../public/icons/eye";
import EyeSlashIcon from  "../../../public/icons/eye-slash";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleTrial = useCallback(async () => {
    try {
      const userExists = await doesUserTrialStartDateExist();
  
      if (userExists) {
        router.push("/timer");
      } else {
        console.log("No valid trial start date found. Setting for the first time...");
  
        // Update Firestore with a new trial start date
        await editSettings((prevSettings: any) => ({
          ...prevSettings,
          trialStartDate: new Date().toISOString(), // Store ISO string format
          isPaidUser: prevSettings?.isPaidUser || false,
        }));
  
        router.push("/timer");
      }
    } catch (error) {
      console.error("Error in handleTrial:", error);
    }
  }, [router]);
  
  

  const routeToTheRightPage = () => {
    const query = new URLSearchParams(window.location.search);
    if (query.has("getStarted")) {
      router.push("/get-started");
    } else {
      router.push("/timer");
    }
  };

  const onEmailLoginButtonClick = useCallback(async () => {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }
      const result = await signInWithEmailAndPassword(auth, email, password);
      handleTrial();
      routeToTheRightPage();
    } catch (error: any) {
      if (error.code === "auth/too-many-requests") {
        console.log("Too many failed attempts. Please try again later.");
      } else {
        console.log("sign-in-form.tsx | ERROR", error);
      }
    }
  }, [email, password]);
  

  const loginWithGoogle = useCallback(async () => {
    // If embedded, open in a new tab
    if (window.self !== window.top) {
      window.open(window.location.href, "_blank");
      return;
    }
  
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        handleTrial();
        routeToTheRightPage();
      }
    } catch (error) {
      console.log("Google Sign-In Error:", error);
    }
  }, [handleTrial, routeToTheRightPage]);

    return (
      <div className="p-5 w-full h-full min-h-screen mx-auto flex flex-col bg-darkaccent justify-center items-center gap-10">
        <div className="absolute top-0 w-full flex justify-center pt-4">
          <Image
            onClick={() => router.push("/")}
            disableSkeleton
            className="dark height-fit hover:cursor-pointer"
            src="./logo/focus-flow-logo-white.png"
            alt="Focus Flow logo"
            width={130}
          />
        </div>
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
              type={isVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="dark w-full"
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeIcon color="#939393" className="" />
                  ) : (
                    <EyeSlashIcon color="#939393" className="" />
                  )}
                </button>
              }
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
