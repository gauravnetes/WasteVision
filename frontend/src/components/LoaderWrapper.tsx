"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loader from "./Loader";

export default function LoaderWrapper() {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Simulate initial page load - longer duration for first load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Reset loading state on route change
  useEffect(() => {
    // Skip the initial render
    if (pathname) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500); // Slightly longer to ensure counter animation completes

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return <Loader isLoading={isLoading} />;
}