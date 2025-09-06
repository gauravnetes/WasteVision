"use client"

import React from "react";
import Particles from "./Particles";
import { useTheme } from "next-themes";

interface ParticlesBackgroundProps {
  className?: string;
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({ className }) => {
  const { theme } = useTheme();
  
  // Determine particle colors based on theme
  const particleColors = theme === "dark" 
    ? ["#ffffff", "#cccccc"] // Light colors for dark theme
    : ["#333333", "#555555"]; // Dark colors for light theme

  // Use null as className when it's undefined to avoid hydration mismatch
  const divClassName = `fixed inset-0 -z-10 ${className || ''}`;
  
  return (
    <div className={divClassName}>
      <Particles
        particleColors={particleColors}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={true}
        disableRotation={false}
      />
    </div>
  );
};

export default ParticlesBackground;