"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  exp: number; // expiration time in seconds
}

export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const expiry = decoded.exp * 1000; // ms
      const now = Date.now();

      if (now >= expiry) {
        // expired → logout immediately
        localStorage.removeItem("token");
        router.push("/signin");
      } else {
        // schedule logout at expiry
        const timeout = expiry - now;
        const timer = setTimeout(() => {
          localStorage.removeItem("token");
          router.push("/signin");
        }, timeout);

        return () => clearTimeout(timer);
      }
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      router.push("/signin");
    }
  }, [router]);
}
