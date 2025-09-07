'use client';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThemeToggleButton from '@/components/ui/theme-toggle-button';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

export default function BusinessModel() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated particle background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 50 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            animate={{
              x: [0, Math.random() * window.innerWidth || 1920],
              y: [0, Math.random() * window.innerHeight || 1080],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 py-5 px-10 flex items-center justify-between w-full gap-5 border-b backdrop-blur-sm bg-background/90"
      >
        <div className="flex items-center gap-5">
          <motion.div 
            className="mt-5"
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <ThemeToggleButton />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              className="cursor-pointer"
              src="/images/logo_dark.png"
              alt="Site Logo"
              width={180}
              height={180}
            />
          </motion.div>
        </div>
        <div className="flex items-center gap-5">
          <Navbar />
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative bg-black py-20 overflow-hidden"
        >
          {/* Animated gradient orbs */}
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
          />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              Our Waste Management Solutions
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-xl max-w-3xl mx-auto text-muted-foreground"
            >
              Leveraging cutting-edge AI and 3D reconstruction technology to revolutionize waste management for educational institutions.
            </motion.p>
          </div>
        </motion.section>

        {/* YOLOv8 Waste Detection Section */}
        <motion.section 
          className="py-16 bg-black relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <motion.h2 
                  className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                  whileInView={{ scale: [0.9, 1] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  YOLOv8 Waste Detection System
                </motion.h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  Our state-of-the-art waste detection system utilizes YOLOv8, the latest in real-time object detection technology, to identify and classify various types of waste with exceptional accuracy.
                </p>
                <ul className="space-y-4">
                  {[
                    {
                      icon: "M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M18 12h4 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83",
                      title: "Real-time Detection",
                      desc: "Instantly identify and classify waste materials from images or video feeds."
                    },
                    {
                      icon: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z M13 5v2 M13 17v2 M13 11v2",
                      title: "Multi-class Classification",
                      desc: "Distinguish between recyclables, organic waste, e-waste, and more with high precision."
                    },
                    {
                      icon: "M3 3v18h18 m19 9-5 5-4-4-3 3",
                      title: "Waste Analytics",
                      desc: "Generate detailed reports on waste composition, trends, and hotspots across your campus."
                    }
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start group cursor-pointer"
                      initial={{ x: -30, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      whileHover={{ x: 10, transition: { duration: 0.2 } }}
                      viewport={{ once: true }}
                    >
                      <motion.div 
                        className="mr-4 bg-gradient-to-br from-primary/20 to-primary/10 p-2 rounded-full border border-primary/20 group-hover:border-primary/40 transition-all"
                        whileHover={{ 
                          scale: 1.1,
                          boxShadow: "0 0 20px rgba(var(--primary), 0.3)",
                        }}
                        animate={{
                          boxShadow: [
                            "0 0 0px rgba(var(--primary), 0.1)",
                            "0 0 10px rgba(var(--primary), 0.2)",
                            "0 0 0px rgba(var(--primary), 0.1)",
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary group-hover:text-primary/80 transition-colors">
                          <path d={item.icon}/>
                        </svg>
                      </motion.div>
                      <div className="group-hover:translate-x-1 transition-transform">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                className="relative bg-gradient-to-br from-background to-muted/30 rounded-2xl p-6 h-[400px] border border-primary/10 overflow-hidden"
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                {/* Tech grid background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                    {Array.from({ length: 64 }, (_, i) => (
                      <motion.div
                        key={i}
                        className="border border-primary/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.05,
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="relative z-10 h-full flex flex-col items-center justify-center">
                  <motion.p 
                    className="text-muted-foreground mb-6 font-mono text-sm tracking-wider"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    YOLOv8 Detection Visualization
                  </motion.p>
                  
                  <div className="relative w-full h-[280px] bg-gradient-to-br from-background/80 to-muted/20 rounded-xl border border-primary/20 flex items-center justify-center overflow-hidden">
                    {/* Scanning lines effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent w-1"
                      animate={{ x: [-50, 350] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    
                    {/* AI Detection Nodes */}
                    {Array.from({ length: 5 }, (_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-3 h-3 bg-primary rounded-full"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${30 + Math.sin(i) * 20}%`,
                        }}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                    
                    <motion.div
                      className="text-center"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="font-mono text-primary text-sm mb-2">PROCESSING...</div>
                      <div className="font-mono text-xs text-muted-foreground">Confidence: 94.7%</div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* 3D Reconstruction Section */}
        <motion.section 
          className="py-16 bg-black relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="order-2 md:order-1 relative bg-gradient-to-br from-background to-secondary/5 rounded-2xl p-6 h-[400px] border border-secondary/20 overflow-hidden"
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                {/* 3D wireframe background */}
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" viewBox="0 0 400 400">
                    {Array.from({ length: 20 }, (_, i) => (
                      <motion.path
                        key={i}
                        d={`M${i * 20} 0 L${i * 20} 400 M0 ${i * 20} L400 ${i * 20}`}
                        stroke="currentColor"
                        strokeWidth="0.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 2,
                          delay: i * 0.1,
                          repeat: Infinity,
                          repeatType: "reverse",
                          repeatDelay: 3
                        }}
                      />
                    ))}
                  </svg>
                </div>
                
                <div className="relative z-10 h-full flex flex-col items-center justify-center">
                  <motion.p 
                    className="text-muted-foreground  mb-6 font-mono text-sm tracking-wider"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    3D Waste Volume Estimation
                  </motion.p>
                  
                  <div className="relative w-full h-[280px] bg-gradient-to-br from-background/80 to-secondary/10 rounded-xl border border-secondary/20 flex items-center justify-center overflow-hidden">
                    {/* 3D Rotating Cube */}
                    <motion.div
                      className="relative w-24 h-24"
                      animate={{ rotateY: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {Array.from({ length: 6 }, (_, i) => (
                        <div
                          key={i}
                          className="absolute w-24 h-24 border border-secondary/40 bg-secondary/10"
                          style={{
                            transform: `rotateY(${i * 60}deg) translateZ(48px)`,
                          }}
                        />
                      ))}
                    </motion.div>
                    
                    {/* Volume calculation display */}
                    <motion.div
                      className="absolute bottom-4 right-4 text-right"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="font-mono text-secondary text-sm mb-1">Volume: 2.4m³</div>
                      <div className="font-mono text-xs text-muted-foreground">Accuracy: 96.2%</div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="order-1 md:order-2"
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <motion.h2 
                  className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                  whileInView={{ scale: [0.9, 1] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  3D Waste Volume Reconstruction
                </motion.h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  Our advanced 3D reconstruction technology transforms 2D waste images into accurate volumetric models, enabling precise measurement and management of waste accumulation.
                </p>
                <ul className="space-y-4">
                  {[
                    {
                      icon: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z M22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65 M22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",
                      title: "Accurate Volume Estimation",
                      desc: "Calculate precise waste volumes to optimize collection schedules and resource allocation."
                    },
                    {
                      icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.29 7 12 12 20.71 7 M12 22 12 12",
                      title: "3D Visualization",
                      desc: "Interactive 3D models allow for comprehensive analysis and planning of waste management strategies."
                    },
                    {
                      icon: "M3 3v18h18 M19 9-5 5-4-4-3 3",
                      title: "Trend Analysis",
                      desc: "Track waste volume changes over time to identify patterns and implement targeted reduction strategies."
                    }
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start group cursor-pointer"
                      initial={{ x: 30, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      whileHover={{ x: -10, transition: { duration: 0.2 } }}
                      viewport={{ once: true }}
                    >
                      <motion.div 
                        className="mr-4 bg-gradient-to-br from-secondary/20 to-secondary/10 p-2 rounded-full border border-secondary/20 group-hover:border-secondary/40 transition-all"
                        whileHover={{ 
                          scale: 1.1,
                          boxShadow: "0 0 20px rgba(var(--secondary), 0.3)",
                        }}
                        animate={{
                          boxShadow: [
                            "0 0 0px rgba(var(--secondary), 0.1)",
                            "0 0 10px rgba(var(--secondary), 0.2)",
                            "0 0 0px rgba(var(--secondary), 0.1)",
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary group-hover:text-secondary/80 transition-colors">
                          <path d={item.icon}/>
                        </svg>
                      </motion.div>
                      <div className="group-hover:-translate-x-1 transition-transform">
                        <h3 className="font-semibold text-lg group-hover:text-secondary transition-colors">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Future Scope Section */}
        <motion.section 
          className="py-16 bg-black relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <motion.h2 
                  className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
                  whileInView={{ scale: [0.9, 1] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Future Scope
                </motion.h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  Our vision extends beyond traditional waste management solutions. We're developing autonomous drone technology integrated with advanced AI systems to revolutionize campus waste monitoring and management at unprecedented scales.
                </p>
                <ul className="space-y-4">
                  {[
                    {
                      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z M8 12l4-4 4 4-1.41 1.41L12 10.83l-2.59 2.58L8 12z",
                      title: "Autonomous Drone Fleet",
                      desc: "Deploy intelligent drones equipped with YOLOv8 detection systems for comprehensive campus-wide waste monitoring and real-time analysis."
                    },
                    {
                      icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
                      title: "Dedicated Campus Operators",
                      desc: "Provide specialized trained operators for each educational institution to manage drone operations and ensure optimal waste detection coverage."
                    },
                    {
                      icon: "M3 5v14c0 1.1.89 2 2 2h14c0-1.1-.9-2-2-2H7.83l9.58-9.59c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L6.41 17H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2z",
                      title: "Predictive Analytics",
                      desc: "Implement machine learning algorithms to predict waste accumulation patterns and optimize collection routes before overflow occurs."
                    }
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start group cursor-pointer"
                      initial={{ x: -30, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      whileHover={{ x: 10, transition: { duration: 0.2 } }}
                      viewport={{ once: true }}
                    >
                      <motion.div 
                        className="mr-4 bg-gradient-to-br from-orange-500/20 to-red-500/10 p-2 rounded-full border border-orange-500/20 group-hover:border-orange-500/40 transition-all"
                        whileHover={{ 
                          scale: 1.1,
                          boxShadow: "0 0 20px rgba(255, 165, 0, 0.3)",
                        }}
                        animate={{
                          boxShadow: [
                            "0 0 0px rgba(255, 165, 0, 0.1)",
                            "0 0 10px rgba(255, 165, 0, 0.2)",
                            "0 0 0px rgba(255, 165, 0, 0.1)",
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 group-hover:text-orange-500/80 transition-colors">
                          <path d={item.icon}/>
                        </svg>
                      </motion.div>
                      <div className="group-hover:translate-x-1 transition-transform">
                        <h3 className="font-semibold text-lg group-hover:text-orange-500 transition-colors">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                className="relative bg-gradient-to-br from-background to-orange-500/5 rounded-2xl p-6 h-[400px] border border-orange-500/10 overflow-hidden"
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                {/* Drone flight path background */}
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" viewBox="0 0 400 400">
                    {Array.from({ length: 8 }, (_, i) => (
                      <motion.path
                        key={i}
                        d={`M${20 + i * 50} 50 Q${100 + i * 30} ${100 + i * 20} ${150 + i * 25} ${200 + i * 15} T${350} ${300}`}
                        stroke="currentColor"
                        strokeWidth="1"
                        fill="none"
                        strokeDasharray="5,5"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.5 }}
                        transition={{
                          duration: 3,
                          delay: i * 0.3,
                          repeat: Infinity,
                          repeatType: "loop",
                          repeatDelay: 2
                        }}
                      />
                    ))}
                  </svg>
                </div>
                
                <div className="relative z-10 h-full flex flex-col items-center justify-center">
                  <motion.p 
                    className="text-muted-foreground mb-6 font-mono text-sm tracking-wider"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Drone Fleet Management System
                  </motion.p>
                  
                  <div className="relative w-full h-[280px] bg-gradient-to-br from-background/80 to-orange-500/10 rounded-xl border border-orange-500/20 flex items-center justify-center overflow-hidden">
                    {/* Floating drones */}
                    {Array.from({ length: 4 }, (_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-6 h-6 bg-orange-500 rounded-sm"
                        style={{
                          left: `${20 + i * 20}%`,
                          top: `${25 + Math.sin(i) * 15}%`,
                        }}
                        animate={{
                          y: [0, -10, 0],
                          rotateZ: [0, 360],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.5,
                          ease: "easeInOut"
                        }}
                      >
                        {/* Drone propellers */}
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-300 rounded-full"></div>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-300 rounded-full"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-orange-300 rounded-full"></div>
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-orange-300 rounded-full"></div>
                      </motion.div>
                    ))}
                    
                    <motion.div
                      className="text-center"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="font-mono text-orange-500 text-sm mb-2">AUTONOMOUS PATROL</div>
                      <div className="font-mono text-xs text-muted-foreground">Coverage: 95.8%</div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Services Section */}
        <motion.section 
          className="py-16 bg-black relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="order-2 md:order-1 relative bg-gradient-to-br from-background to-teal-500/5 rounded-2xl p-6 h-[400px] border border-teal-500/20 overflow-hidden"
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                {/* Network connections background */}
                <div className="absolute inset-0 opacity-15">
                  <svg width="100%" height="100%" viewBox="0 0 400 400">
                    {Array.from({ length: 12 }, (_, i) => (
                      <g key={i}>
                        <motion.circle
                          cx={50 + (i % 4) * 100}
                          cy={50 + Math.floor(i / 4) * 100}
                          r="4"
                          fill="currentColor"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.5,
                            delay: i * 0.1,
                          }}
                        />
                        {i < 11 && (
                          <motion.line
                            x1={50 + (i % 4) * 100}
                            y1={50 + Math.floor(i / 4) * 100}
                            x2={50 + ((i + 1) % 4) * 100}
                            y2={50 + Math.floor((i + 1) / 4) * 100}
                            stroke="currentColor"
                            strokeWidth="1"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                              duration: 1,
                              delay: i * 0.2,
                              repeat: Infinity,
                              repeatType: "reverse",
                              repeatDelay: 3
                            }}
                          />
                        )}
                      </g>
                    ))}
                  </svg>
                </div>
                
                <div className="relative z-10 h-full flex flex-col items-center justify-center">
                  <motion.p 
                    className="text-muted-foreground mb-6 font-mono text-sm tracking-wider"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Service Network Infrastructure
                  </motion.p>
                  
                  <div className="relative w-full h-[280px] bg-gradient-to-br from-background/80 to-teal-500/10 rounded-xl border border-teal-500/20 flex items-center justify-center overflow-hidden">
                    {/* Service nodes */}
                    {[
                      { x: 20, y: 30, label: "Campus A" },
                      { x: 70, y: 20, label: "Municipality" },
                      { x: 50, y: 60, label: "Campus B" },
                      { x: 80, y: 70, label: "City Council" },
                      { x: 30, y: 80, label: "Campus C" }
                    ].map((node, i) => (
                      <motion.div
                        key={i}
                        className="absolute flex flex-col items-center"
                        style={{
                          left: `${node.x}%`,
                          top: `${node.y}%`,
                        }}
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.4,
                        }}
                      >
                        <div className="w-4 h-4 bg-teal-500 rounded-full mb-1"></div>
                        <span className="text-xs font-mono text-teal-500">{node.label}</span>
                      </motion.div>
                    ))}
                    
                    {/* Central hub */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center"
                      animate={{
                        scale: [1, 1.3, 1],
                        boxShadow: [
                          "0 0 10px rgba(20, 184, 166, 0.3)",
                          "0 0 20px rgba(20, 184, 166, 0.6)",
                          "0 0 10px rgba(20, 184, 166, 0.3)",
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                    >
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </motion.div>
                    
                    <motion.div
                      className="absolute bottom-4 left-4 text-left"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="font-mono text-teal-500 text-sm mb-1">ACTIVE CONNECTIONS</div>
                      <div className="font-mono text-xs text-muted-foreground">Network: 99.2%</div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="order-1 md:order-2"
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <motion.h2 
                  className="text-3xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"
                  whileInView={{ scale: [0.9, 1] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Comprehensive Service Solutions
                </motion.h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  We provide end-to-end waste management services tailored for educational institutions and municipal governments, delivering scalable solutions that integrate seamlessly with existing infrastructure.
                </p>
                <ul className="space-y-4">
                  {[
                    {
                      icon: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
                      title: "Campus Partnership Programs",
                      desc: "Dedicated service packages for universities and colleges with customized waste monitoring, staff training, and sustainability reporting."
                    },
                    {
                      icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
                      title: "Municipal Integration",
                      desc: "Seamless integration with city-wide waste management systems, providing real-time data analytics and automated reporting for municipal authorities."
                    },
                    {
                      icon: "M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.7-1.3 5.7-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.7 2.9 5.7 5.7 6-.6.6-.6 1.2-.5 2V21",
                      title: "24/7 Support & Maintenance",
                      desc: "Round-the-clock technical support, system maintenance, and performance optimization to ensure uninterrupted service delivery."
                    }
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start group cursor-pointer"
                      initial={{ x: 30, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      whileHover={{ x: -10, transition: { duration: 0.2 } }}
                      viewport={{ once: true }}
                    >
                      <motion.div 
                        className="mr-4 bg-gradient-to-br from-teal-500/20 to-cyan-500/10 p-2 rounded-full border border-teal-500/20 group-hover:border-teal-500/40 transition-all"
                        whileHover={{ 
                          scale: 1.1,
                          boxShadow: "0 0 20px rgba(20, 184, 166, 0.3)",
                        }}
                        animate={{
                          boxShadow: [
                            "0 0 0px rgba(20, 184, 166, 0.1)",
                            "0 0 10px rgba(20, 184, 166, 0.2)",
                            "0 0 0px rgba(20, 184, 166, 0.1)",
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500 group-hover:text-teal-500/80 transition-colors">
                          <path d={item.icon}/>
                        </svg>
                      </motion.div>
                      <div className="group-hover:-translate-x-1 transition-transform">
                        <h3 className="font-semibold text-lg group-hover:text-teal-500 transition-colors">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section 
          className="py-16 bg-black relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.h2 
              className="text-3xl font-bold mb-12 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Benefits for Educational Institutions
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
                  title: "Cost Reduction",
                  desc: "Optimize waste collection schedules and resource allocation, reducing operational costs by up to 30%.",
                  color: "from-green-500 to-emerald-500"
                },
                {
                  icon: "M18 8a6 6 0 0 0-9.33-5 M10 2 1 5-5 1 M6 16a6 6 0 0 0 9.33 5 M14 22-1-5 5-1",
                  title: "Sustainability Goals",
                  desc: "Meet and exceed sustainability targets with data-driven waste reduction strategies and improved recycling rates.",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
                  title: "Educational Value",
                  desc: "Engage students in sustainability initiatives with real-world data and visualizations of campus waste management.",
                  color: "from-purple-500 to-pink-500"
                }
              ].map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="group bg-background/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    transition: { duration: 0.3 }
                  }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className={`bg-gradient-to-br ${benefit.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg`}
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1,
                      transition: { duration: 0.6 }
                    }}
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(0,0,0,0.1)",
                        "0 0 30px rgba(0,0,0,0.2)",
                        "0 0 20px rgba(0,0,0,0.1)",
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.8
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={benefit.icon}/>
                    </svg>
                  </motion.div>
                  <motion.h3 
                    className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors"
                    whileInView={{ opacity: [0, 1] }}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    {benefit.title}
                  </motion.h3>
                  <motion.p 
                    className="text-muted-foreground group-hover:text-foreground/80 transition-colors"
                    whileInView={{ opacity: [0, 1] }}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.4 }}
                    viewport={{ once: true }}
                  >
                    {benefit.desc}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-16 bg-black relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/10 rounded-full blur-2xl"
            animate={{
              scale: [1.3, 1, 1.3],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h2 
              className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Ready to Transform Your Campus Waste Management?
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 max-w-3xl mx-auto text-muted-foreground"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join leading educational institutions that are already benefiting from our AI-powered waste detection and 3D reconstruction technology.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.a 
                href="/playground" 
                className="relative bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 overflow-hidden group"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(var(--primary), 0.3)",
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Try Playground</span>
              </motion.a>
              <motion.a 
                href="/get-started" 
                className="relative bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 overflow-hidden group"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(var(--secondary), 0.3)",
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Get Started</span>
              </motion.a>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}