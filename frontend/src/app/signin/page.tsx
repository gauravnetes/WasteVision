"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Prism from "@/components/Prism";
import Image from "next/image";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function SignIn() {
  useAuthRedirect()

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData object to match OAuth2PasswordRequestForm expected by FastAPI
      const formDataObj = new FormData();
      formDataObj.append("username", formData.email); // FastAPI expects 'username' field
      formDataObj.append("password", formData.password);
      
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        body: formDataObj, // Send as form data, not JSON
      });

      if (!res.ok) {
        const errText = await res.text();
        let errMsg = "Sign in failed";
        try {
          const errJson = JSON.parse(errText);
          errMsg = errJson.detail || errMsg;
        } catch (e) {
          // If not valid JSON, use text as is
          if (errText) errMsg = errText;
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token); // Use access_token from response

      setSuccess("Signed in successfully! Redirecting...");
      setTimeout(() => (window.location.href = "/dashboard"), 1500);
    } catch (err: any) {
      setError(err.message);
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

      <main className="absolute z-11 w-full  max-w-5xl p-6 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* LEFT SIDE */}
          <div className="md:w-1/2 p-10 flex flex-col justify-center text-white">
            <Link href="/">
              <Image
                src="/images/auth_logo.png"
                alt="Waste Vision Logo"
                width={280}
                height={280}
                priority
                className="mb-4 cursor-pointer animate-float hidden dark:block"
              />
            </Link>
            <h2 className="text-4xl font-extrabold font-custom">
              Welcome Back 👋
            </h2>
            <p className="mt-4 text-gray-200 font-custom font-semibold">
              Sign in to{" "}
              <span className="text-lime-400 font-bold">Waste Vision</span>{" "}
              and continue your mission to build a cleaner campus.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-gray-200 font-custom font-semibold">
              <li>✅ Access your campus dashboard</li>
              <li>✅ Track your contributions</li>
              <li>✅ Stay connected with your peers</li>
            </ul>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="md:w-1/2 p-10 flex items-center justify-center">
            <form className="w-full max-w-md space-y-5" onSubmit={handleSubmit}>
              <h3 className="text-2xl font-bold text-center text-white mb-4 font-custom">
                Sign in to your account
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
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-700 bg-black/40 text-white rounded-xl font-custom font-semibold focus:ring-2 focus:ring-lime-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-700 bg-black/40 text-white rounded-xl font-custom font-semibold focus:ring-2 focus:ring-lime-500"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-lime-400 text-white font-custom font-bold hover:bg-lime-500 transition-colors"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              <div className="flex justify-between text-sm text-gray-300 font-custom font-semibold">
                <Link href="/forgot-password" className="hover:text-lime-400">
                  Forgot Password?
                </Link>
                <p>
                  No account?{" "}
                  <Link
                    href="/signup"
                    className="text-lime-400 hover:text-lime-300 font-bold"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
              
              <div className="text-center text-sm text-gray-300 font-custom font-semibold">
                <Link href="/verify-email" className="hover:text-lime-400">
                  Need to verify your email?
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
