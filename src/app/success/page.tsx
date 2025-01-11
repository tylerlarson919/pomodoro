"use client";
import React, { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Image } from "@nextui-org/react";
import { editSettings } from "../../../firebase";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "succeeded" | "failed" | "error">("loading");

  const paymentIntentId = searchParams.get("payment_intent");


  const setPaidUser = async (userId: boolean) => {
    editSettings({ isPaidUser: true })
    .catch((err: any) => console.error("Error updating Status:", err));
  };

  

  useEffect(() => {
    if (!paymentIntentId) {
      console.error("No payment_intent found in URL.");
      setStatus("error");
      return;
    }

    const verifyPayment = async () => {
        try {
          const response = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentIntentId }),
          });
      
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response from server:", errorText);
            throw new Error("Failed to verify payment.");
          }
      
          const { status: paymentStatus } = await response.json();
          
          const redirectStatus = searchParams.get("redirect_status");
          
          // Compare the retrieved payment status with the redirect status
          if (paymentStatus === "succeeded" && redirectStatus === "succeeded") {
            setStatus("succeeded");
            setPaidUser(true);
          } else {
            setStatus("failed");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          setStatus("error");
        }
    };
      

    verifyPayment();
  }, [paymentIntentId]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="flex items-center justify-center min-h-screen w-screen flex-col items-center justify-center text-white">
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
          {status === "succeeded" ? (
              <>
              <h1 className="text-3xl font-bold">Success!</h1>
              <p className="mt-2">Your payment was processed successfully.</p>
              <Button
                  onPress={() => router.push("/timer")}
                  color="secondary"
                  variant="ghost"
                  className="mt-6"
              >
                  Go to App
              </Button>
              </>
          ) : status === "failed" ? (
              <>
              <h1 className="text-3xl font-bold">Payment Failed</h1>
              <p className="mt-2 text-textcolor">Something went wrong. Please try again.</p>
              <Button
                  onPress={() => router.push("/get-started")}
                  color="secondary"
                  variant="ghost"
                  className="mt-6"
              >
                  Back to Payment
              </Button>
              </>
          ) : (
              <>
              <h1 className="text-3xl font-bold">Error</h1>
              <p className="mt-2">We couldn’t verify your payment. Please contact support.</p>
              <Button
                  onPress={() => router.push("/get-started")}
                  color="primary"
                  className="mt-6"
              >
                  Back to Payment
              </Button>
              </>
          )}

      </div>      
    </Suspense>
  );
};

export default SuccessPage;
