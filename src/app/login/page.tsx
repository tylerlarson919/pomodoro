"use client";

import { useState } from "react";
import { auth, googleProvider } from "../../../firebase/config";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/protected");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const loginWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/protected");
    } catch (error) {
      console.error("Email login failed:", error);
    }
  };

  const registerWithEmail = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/protected");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h1>Login</h1>
      <button onClick={loginWithGoogle}>Login with Google</button>

      <hr />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={loginWithEmail}>Login</button>
      <button onClick={registerWithEmail}>Register</button>
    </div>
  );
};

export default LoginPage;