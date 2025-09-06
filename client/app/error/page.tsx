// app/error.tsx
"use client"; // error components must be client components

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    console.error("Error caught by App Router:", error);

    // Check for error message from URL parameters
    const message = searchParams.get("message");
    if (message) {
      setErrorMessage(decodeURIComponent(message));
    }
  }, [error, searchParams]);

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen text-center px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-red-600">
          Authentication Error
        </h1>
        <div className="mb-6">
          {errorMessage ? (
            <div>
              <p className="text-lg font-semibold mb-2">Error Details:</p>
              <p className="text-gray-700 bg-red-50 p-4 rounded-lg border border-red-200">
                {errorMessage}
              </p>
            </div>
          ) : (
            <p className="text-gray-700">
              Something went wrong during authentication. Please try again.
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoBack}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
          {!errorMessage && (
            <button
              onClick={() => reset()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
