"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 fixed top-0 z-[99999] left-0 right-0 bottom-0">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Oops! Something went wrong.
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We apologize for the inconvenience. We're working on fixing the
            issue.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm text-gray-700">
              Redirecting to home in {countdown} seconds...
            </span>
          </div>
          <div className="text-center">
            <Link
              href="/"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
            >
              Go back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
