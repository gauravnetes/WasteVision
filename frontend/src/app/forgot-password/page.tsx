"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Prism from "@/components/Prism";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email entry, 2: Code verification, 3: New password
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setSuccess(data.message || "Reset code sent to your email");
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to request password reset");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    setSuccess("Code verified successfully");
    setStep(3);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          reset_code: verificationCode,
          new_password: newPassword,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to reset password");
      }

      const data = await res.json();
      setSuccess(data.message || "Password reset successfully");
      setTimeout(() => (window.location.href = "/signin"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
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

      <main className="absolute z-11 w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* LEFT SIDE CONTENT */}
          <div className="md:w-1/2 p-10 bg-gradient-to-br from-black/60 to-black/40 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white mb-4 font-custom">
              Reset Your Password
            </h2>
            <p className="text-gray-300 font-custom font-semibold">
              Forgot your password? No worries. We'll help you get back into your{" "}
              <span className="text-lime-400 font-bold">Waste Vision</span>{" "}
              account.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-gray-200 font-custom font-semibold">
              <li>✅ Quick and secure password reset</li>
              <li>✅ Verification code sent to your email</li>
              <li>✅ Create a new password in minutes</li>
            </ul>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="md:w-1/2 p-10 flex items-center justify-center">
            {step === 1 && (
              <form className="w-full max-w-md space-y-5" onSubmit={handleRequestReset}>
                <h3 className="text-2xl font-bold text-center text-white mb-4 font-custom">
                  Step 1: Enter Your Email
                </h3>

                {error && (
                  <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm font-custom">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-lime-500/10 text-lime-400 p-3 rounded-xl text-sm font-custom">
                    {success}
                  </div>
                )}

                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 border border-gray-700 bg-black/40 text-white rounded-xl font-custom font-semibold focus:ring-2 focus:ring-lime-500"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-lime-400 text-white font-custom font-bold hover:bg-lime-500 transition-colors"
                >
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </button>

                <div className="text-center text-sm text-gray-300 font-custom font-semibold">
                  <Link href="/signin" className="hover:text-lime-400">
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}

            {step === 2 && (
              <form className="w-full max-w-md space-y-5" onSubmit={handleVerifyCode}>
                <h3 className="text-2xl font-bold text-center text-white mb-4 font-custom">
                  Step 2: Enter Verification Code
                </h3>

                {error && (
                  <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm font-custom">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-lime-500/10 text-lime-400 p-3 rounded-xl text-sm font-custom">
                    {success}
                  </div>
                )}

                <p className="text-gray-300 text-sm font-custom">
                  We've sent a 6-digit code to {email}. Please check your inbox and enter the code below.
                </p>

                <input
                  type="text"
                  placeholder="6-digit verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="w-full px-5 py-3 border border-gray-700 bg-black/40 text-white rounded-xl font-custom font-semibold focus:ring-2 focus:ring-lime-500"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-lime-400 text-white font-custom font-bold hover:bg-lime-500 transition-colors"
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </button>

                <div className="text-center text-sm text-gray-300 font-custom font-semibold">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="hover:text-lime-400"
                  >
                    Back to Email Entry
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form className="w-full max-w-md space-y-5" onSubmit={handleResetPassword}>
                <h3 className="text-2xl font-bold text-center text-white mb-4 font-custom">
                  Step 3: Create New Password
                </h3>

                {error && (
                  <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm font-custom">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-lime-500/10 text-lime-400 p-3 rounded-xl text-sm font-custom">
                    {success}
                  </div>
                )}

                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-5 py-3 border border-gray-700 bg-black/40 text-white rounded-xl font-custom font-semibold focus:ring-2 focus:ring-lime-500"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-5 py-3 border border-gray-700 bg-black/40 text-white rounded-xl font-custom font-semibold focus:ring-2 focus:ring-lime-500"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-lime-400 text-white font-custom font-bold hover:bg-lime-500 transition-colors"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>

                <div className="text-center text-sm text-gray-300 font-custom font-semibold">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="hover:text-lime-400"
                  >
                    Back to Code Verification
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}