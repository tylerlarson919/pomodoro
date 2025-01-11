import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest) {
  const { paymentIntentId } = await req.json();

  console.log("Received paymentIntentId:", paymentIntentId);

  if (!paymentIntentId) {
    console.error("Missing paymentIntentId");
    return NextResponse.json({ error: "Missing paymentIntentId" }, { status: 400 });
  }

  try {
    console.log("Retrieving payment intent with ID:", paymentIntentId);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log("Retrieved payment intent:", paymentIntent);

    return NextResponse.json({ status: paymentIntent.status });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Failed to verify payment." }, { status: 500 });
  }
}
