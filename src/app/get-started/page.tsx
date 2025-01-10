"use client";
import { useEffect, useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js'; // Import Stripe type
import { CardElement, Elements } from '@stripe/react-stripe-js';

// Initialize the Stripe instance
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
  : null;

const GetStartedPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [stripe, setStripe] = useState<Stripe | null>(null); // Define stripe state

  // Load Stripe only once
  useEffect(() => {
    const loadStripeKey = async () => {
      if (stripePromise) {
        const loadedStripe = await stripePromise;
        setStripe(loadedStripe);
      }
    };
    loadStripeKey();
  }, []);

  const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!stripe) {
      setError('Stripe has not been initialized properly. Please check your environment variables.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to create session');

      const session = await response.json();

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (stripeError) {
        setError(stripeError.message || 'An unknown error occurred');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-1">Get Started</h1>
      <p className="text-lg text-textcolor mb-4">
        Unlock access for a one-time payment of <span className="font-semibold">$9.99</span>.
      </p>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
        />
        <form onSubmit={handleCheckout}>
          <CardElement className="my-4" />
          <button
            type="submit"
            disabled={loading || !email}
            className={`w-full py-2 text-white rounded-md ${
              loading
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            {loading ? 'Processing...' : 'Pay $9.99'}
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        {success && (
          <p className="mt-4 text-green-500 text-center">
            Payment successful! Check your email for confirmation.
          </p>
        )}
      </div>
    </div>
  );
};

export default function WrappedGetStartedPage() {
  return (
    <Elements stripe={stripePromise}>
      <GetStartedPage />
    </Elements>
  );
}
