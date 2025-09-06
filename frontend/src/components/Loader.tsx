"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  isLoading?: boolean;
}

export default function Loader({ isLoading = true }: LoaderProps) {
  const [counter, setCounter] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setCounter(1); // Reset counter to 1 when not loading
      return;
    }

    // Always start from 1 when loading begins
    setCounter(1);
    
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsComplete(true), 500); // Delay before hiding loader
          return 100;
        }
        return prev + 1;
      });
    }, 25); // Speed of counter

    return () => clearInterval(interval);
  }, [isLoading]);

  if (isComplete) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black"
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white text-6xl font-bold mb-8"
            >
              WASTE VISION
            </motion.div>
            
            {/* Counter */}
            <motion.div 
              className="absolute left-24 bottom-24 text-white text-7xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                y: { type: "spring", stiffness: 100 },
                opacity: { duration: 0.2 }
              }}
            >
              {counter}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}