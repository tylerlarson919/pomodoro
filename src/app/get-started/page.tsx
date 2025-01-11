"use client";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../../firebase";
import { Button, ScrollShadow, Image } from "@nextui-org/react";
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';
import { useRef } from "react";

// Initialize Stripe instance
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");
console.log("Stripe Publishable Key:", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface CheckoutFormProps {
  clientSecret: string;
}

const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then((mod) => mod.FontAwesomeIcon), {
    ssr: false,
  });

const CheckoutForm = ({ clientSecret }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-24 w-full grid gap-10 items-stretch flex-grow overflow-x-hidden overflow-y-auto xl:grid xl:grid-cols-[minmax(auto,calc(100%-440px))_460px] xl:px-10">
      <div className="w-full flex flex-col gap-4">
        <h1 className="px-4 text-3xl font-semibold text-white w-full text-left">Checkout</h1>
        <ScrollShadow className="w-full h-[500px] overflow-y-auto">  
          <form ref={formRef} onSubmit={handleSubmit} className="w-full p-4">
            <PaymentElement />
          </form>
        </ScrollShadow>
      </div>
      <div className="absolute bottom-0 xl:relative w-full h-fit">
        <div className="bg-dark shadow-[0px_3px_15px_rgba(120,40,200,0.5)] rounded-t-2xl rounded-b-none xl:rounded-2xl p-6 xl:p-4 bottom-0 sticky w-full h-fit">
          <div className="flex flex-col w-full justify-between items-center gap-6">
            <h1 className="text-2xl font-semibold text-white w-full text-left">FocusFlow Pro</h1>
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col items-start justify-center">
                <p className="text-lg font-semibold text-white">Total</p>
                <p className="text-sm text-textcolor">Billed Once.</p>
              </div>
              <p className="text-lg font-semibold text-white">US $9.99</p>
            </div>
            <Button
              onPress={() => formRef.current?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))}
              isDisabled={isProcessing || !stripe || !elements}
              variant="ghost"
              color="secondary"
              className="w-full"
            >
              {isProcessing ? "Processing..." : "Complete Payment"}
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

const GetStartedPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("User is not authenticated, redirecting to signup.");
        router.push("/signup?getStarted");
      } else {
        setUser(user);
        try {
          const response = await fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 999 }), // Amount in cents
          });
          
          // Check if the response is ok (status in the range 200-299)
          if (!response.ok) {
            const errorText = await response.text(); // Get the error message
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
          }
        
          const { clientSecret } = await response.json();
          setClientSecret(clientSecret);
        } catch (error) {
          console.error("Error fetching payment intent:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const appearance = {
    theme: "night" as const, 
    variables: {
      colorPrimary: "#343434",
      colorBackground: "#0a0a0a",
      borderRadius: '12px',
    },
  };

  const options = clientSecret ? { clientSecret, appearance } : undefined;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div
          className="absolute top-0 w-full flex justify-center pt-4"
        >
          <Image
              onClick={() => router.push("/")}
              disableSkeleton
              className="dark height-fit hover:cursor-pointer"
              src="./logo/focus-flow-logo-white.png"
              alt="Focus Flow logo"
              width={130}
          />
        </div>
      <div className="absolute top-8 left-0 xl:left-8 transition-all">
        <div className="flex items-center gap-2 w-fit h-fit hover:bg-white/5 hover:cursor-pointer transition-all rounded-lg p-3 ml-4 xl:ml-2" onClick={() => router.push("/")}>
          <FontAwesomeIcon icon={faChevronLeft} className=" w-4 h-4 text-white"/>
          <p className="text-white font-semibold flex">Back</p>
        </div>
      </div>
      {options && clientSecret ? (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm clientSecret={clientSecret} />
            </Elements>
      ) : (
        <div className="flex items-center justify-center w-screen h-screen text-textcolor gap-2">
          <div className="flex items-center justify-center w-fit h-fit gap-2">
            <div className="dot animate-dot1"></div>
            <div className="dot animate-dot2"></div>
            <div className="dot animate-dot3"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetStartedPage;
