import dynamic from 'next/dynamic';
import { useState } from 'react';
import Link from 'next/link';

// Dynamically import the WorldIDWidget with no SSR
const WorldIDWidget = dynamic(
  () => import('@worldcoin/id').then((mod) => mod.WorldIDWidget),
  { ssr: false } // Disable server-side rendering for this component
);

export default function Login() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleWorldIDSuccess = (verificationResponse) => {
    console.log("User authenticated:", verificationResponse);
    setIsAuthenticated(true);
  };

  const handleWorldIDFailure = (error) => {
    console.error("Authentication failed:", error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Worldcoin Login
        </h1>

        {!isAuthenticated ? (
          <div className="mt-8">
            <WorldIDWidget
              actionId="YOUR_ACTION_ID"
              signal="user_login"
              enableTelemetry
              onSuccess={handleWorldIDSuccess}
              onError={handleWorldIDFailure}
            />
          </div>
        ) : (
          <p className="mt-8 text-xl text-green-400">You are authenticated!</p>
        )}

        <Link href="/">
          <button className="mt-8 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
