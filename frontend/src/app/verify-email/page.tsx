"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Prism from "@/components/Prism";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Use a fallback value if the environment variable is not set
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

  const handleRequestVerification = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/api/auth/verify-email/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to send verification code");
      }

      setSuccess("Verification code sent to your email");
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!verificationCode) {
      setError("Verification code is required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-email/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verification_code: verificationCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to verify email");
      }

      setSuccess("Email verified successfully! You can now sign in.");
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Prism background */}
      <div className="h-screen z-9 w-full relative">
        <Prism
          animationType="hover"
          timeScale={0.7}
          height={2.7}
          baseWidth={4.8}
          scale={3}
          hueShift={3.06}
          colorFrequency={4}
          noise={0}
          glow={1.4}
        />
      </div>

      <main className="absolute z-11 w-full max-w-md p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-8"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-6 font-custom">
            Verify Your Email
          </h2>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm font-custom mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-lime-500/10 text-lime-400 p-3 rounded-xl text-sm font-custom mb-4">
              {success}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestVerification} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1 font-custom"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-700 bg-black/40 text-white rounded-xl font-custom focus:ring-2 focus:ring-lime-500"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-lime-400 text-white font-custom font-bold hover:bg-lime-500 transition-colors"
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </button>

              <div className="text-center text-sm text-gray-300 font-custom mt-4">
                <Link
                  href="/signin"
                  className="text-lime-400 hover:text-lime-300"
                >
                  Back to Sign In
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-300 mb-1 font-custom"
                >
                  Verification Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-700 bg-black/40 text-white rounded-xl font-custom focus:ring-2 focus:ring-lime-500"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-lime-400 text-white font-custom font-bold hover:bg-lime-500 transition-colors"
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </button>

              <div className="text-center text-sm text-gray-300 font-custom mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-lime-400 hover:text-lime-300"
                >
                  Back to Email Entry
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  );
}
