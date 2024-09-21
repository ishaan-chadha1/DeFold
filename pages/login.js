"use client";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { useState } from "react";
import { useRouter } from "next/router";  // Import useRouter for navigation

// Function to call your backend API to verify proof
const verifyProof = async (proof) => {
  try {
    const response = await fetch('/api/verify-world-id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(proof),
    });

    const data = await response.json();

    if (data.success) {
      console.log("Proof successfully verified!");
    } else {
      console.error("Verification failed:", data.message);
    }
  } catch (error) {
    console.error("Error verifying proof:", error);
  }
};

// Functionality after successful World ID verification
const onSuccess = () => {
  console.log("Success! World ID verified.");
};

export default function Login() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();  // Initialize the router

  const handleAuthenticationSuccess = () => {
    setIsAuthenticated(true);
    // Redirect the user to the buy-sell page after authentication
    router.push('/buy-sell');  // Redirects to the new buy-sell page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="bg-white bg-opacity-10 backdrop-blur-p-8 rounded-lg max-w-md w-full text-center">
        <h1 className="font-londrina text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Worldcoin Login
        </h1>

        {!isAuthenticated ? (
          <div className="mt-8">
            <IDKitWidget
              app_id="app_da7fe4a0209edf22695b1f66f1c775a0" // Your Worldcoin App ID
              action="genomic_login" // Your Action ID
              verification_level={VerificationLevel.Device}
              handleVerify={verifyProof} // Calls your backend to verify proof
              onSuccess={handleAuthenticationSuccess} // Triggers redirect after success
            >
              {({ open }) => (
                <button
                  onClick={open}
                  className=" font-londrina mt-8 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
                >
                  Verify with World ID
                </button>
              )}
            </IDKitWidget>
          </div>
        ) : (
          <p className="font-londrina mt-6 text-xl text-green-400">You are authenticated!</p>
        )}
      </div>
    </div>
  );
}
