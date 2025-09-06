"use client";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Prism from "@/components/Prism";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import type { CampusGridProps } from "@/components/CampusGrid";
import LocationButton from "@/components/LocationButton";
interface CampusData {
  public_id: string;
  name: string;
  center_latitude: number;
  center_longitude: number;
  campus_area_sq_meters: number;
}

const CampusGrid = dynamic<CampusGridProps>(
  () => import("@/components/CampusGrid"),
  { ssr: false }
);

const Globe = dynamic(() => import("@/components/ui/globe"), { ssr: false });

export default function Dashboard() {
  useAuthGuard();
  const [campusData, setCampusData] = useState<CampusData | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [showGlobe, setShowGlobe] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<{
    campus_id?: string;
    name?: string;
  }>({});
  const [error, setError] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [uploadedImages, setUploadedImages] = useState<Record<string, File[]>>(
    {}
  );
  const [detectionResults, setDetectionResults] = useState<any[]>([]);
  // --- 💡 DEVELOPER TOGGLE ---
  // Set to 'true' to use hardcoded data below.
  // Set to 'false' to fetch data from the API.
  const USE_HARDCODED_DATA = false;
  const DEFAULT_CAMPUS_DATA: CampusData = {
    public_id: "default-campus-id",
    name: "GNIT (Hardcoded)",
    center_latitude: 22.6951,
    center_longitude: 88.3788,
    campus_area_sq_meters: 28000,
  };

  const zones = [
    "Zone A - Main Entrance",
    "Zone B - Academic Block",
    "Zone C - Cafeteria",
    "Zone D - Sports Ground",
  ];

  const handleImageUpload = (zone: string, files: FileList) => {
    setUploadedImages((prev) => ({
      ...prev,
      [zone]: [...(prev[zone] || []), ...Array.from(files)],
    }));
  };

  const handleAnalyze = async () => {
    // Placeholder for image analysis logic
    setDetectionResults([
      { zone: "Zone A", wasteType: "Plastic", confidence: "95%" },
      { zone: "Zone B", wasteType: "Paper", confidence: "87%" },
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  useEffect(() => {
    // If the developer toggle is on, use hardcoded data and skip the API call
    if (USE_HARDCODED_DATA) {
      console.warn("DEV MODE: Using hardcoded campus data.");
      setCampusData(DEFAULT_CAMPUS_DATA);
      setUserData({ name: "Dev User" }); // Set some mock user data if needed
      setIsLoading(false);
      return; // Exit the effect early
    }
    // --- This part only runs if USE_HARDCODED_DATA is false ---
    const fetchUserData = async () => {
      try {
        const API_BASE =
          process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/signin");
          return;
        }

        // Check backend health
        try {
          const healthCheck = await fetch(`${API_BASE}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(5000),
          });

          if (!healthCheck.ok) throw new Error("Backend not available");
        } catch (healthErr) {
          console.error("Backend unavailable:", healthErr);
          setError("Backend server is not available. Please try again later.");
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE}/api/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUserData(data);
        if (data && data.campus) {
          console.log("✅ Received Campus Data from API:", data.campus);
          setCampusData(data.campus);
        } else {
          // If the user for some reason doesn't have a campus
          throw new Error("Campus data not found in user profile.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(
          "Failed to load user data. Please check if backend is running."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => setShowGlobe(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Navbar />
      <div className="flex relative font-custom flex-col min-h-screen text-white">
        {/* Prism background
      <div className="h-screen z-9 w-full relative">
        <Prism
          animationType="rotate"
          timeScale={0.7}
          height={2.7}
          baseWidth={4.8}
          scale={3}
          hueShift={3.06}
          colorFrequency={4}
          noise={0}
          glow={1.4}
        />
      </div> */}
        {/* Burger Button */}
        <div className="relative">
          <AnimatePresence>
            {!isMenuOpen && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMenuOpen(true)}
                className="fixed top-28 left-9 z-[1000] p-2.5 rounded-xl hover:bg-white/10 backdrop-blur-xl border border-white/10 transition cursor-pointer"
              >
                <Menu size={20} className="text-white" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="sidebar"
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-24 left-8 bottom-20 h-[85%] w-64 bg-black/80 backdrop-blur-xl border-r rounded-2xl border-white/20 shadow-2xl z-[1000] flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <h2 className="text-lg font-bold">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-md hover:bg-white/10 transition"
                >
                  <X size={20} className="text-white hover:text-lime-400" />
                </button>
              </div>

              <nav className="flex-1 px-5 py-5 space-y-4 text-sm">
                <a href="/dashboard" className="block hover:text-lime-400">
                  Dashboard
                </a>
                <a href="/" className="block hover:text-lime-400">
                  Home
                </a>
                <a href="/about" className="block hover:text-lime-400">
                  About
                </a>
                <button
                  onClick={handleLogout}
                  className="block text-left w-full font-bold text-red-400 hover:text-lime-400"
                >
                  Logout
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard */}
        <main className="relative h-full left-0 right-0 top-24 container mx-auto px-24 py-6">
          <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-8 backdrop-blur-sm">
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-1 opacity-80">
                Please check if the backend server is running and try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm transition-colors"
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* Top Section - First Viewport */}
          <div className="h-[100vh] grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Large Campus Map - Left Side */}
            <div className="lg:col-span-8 col-span-1">
              <div className="bg-black/40 rounded-xl border border-white/10 shadow-xl p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Campus Map</h2>
                  {campusData && !userLocation && (
                    <LocationButton
                      onLocationFound={(coords) => setUserLocation(coords)}
                    />
                  )}
                </div>

                <div className="relative w-full h-[calc(100%-3rem)] rounded-lg overflow-hidden bg-black/40 border border-white/10 z-10">
                  <AnimatePresence mode="wait">
                    {showGlobe ? (
                      <motion.div
                        key="globe"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black"
                      >
                        <Globe />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="map"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center h-full">
                            <p>Loading Map...</p>
                          </div>
                        ) : campusData ? (
                          <CampusGrid
                            name={campusData.name}
                            // Use user's location if available, otherwise fall back to DB location
                            centerLat={
                              userLocation?.lat ?? campusData.center_latitude
                            }
                            centerLon={
                              userLocation?.lon ?? campusData.center_longitude
                            }
                            campusArea={campusData.campus_area_sq_meters}
                            campusId={campusData.public_id}
                            // Other props
                            onPreviewOpen={() => {}}
                            isPreviewMode={false}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p>Could not load campus data.</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Upload Zones - Right Side */}
            <div className="lg:col-span-4 col-span-1">
              <div className="bg-black/40 rounded-xl border border-white/10 shadow-xl p-6 h-full flex flex-col">
                <h2 className="text-xl font-semibold mb-6">Upload Zones</h2>
                <div className="space-y-4 flex-1 overflow-y-auto">
                  {zones.map((zone) => (
                    <div key={zone} className="p-4 bg-black/20 rounded-lg">
                      <h3 className="text-sm font-medium mb-3">{zone}</h3>
                      <div className="flex items-center gap-4">
                        <label className="flex-1">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(zone, e.target.files!)
                            }
                          />
                          <div className="flex items-center justify-center p-3 border-2 border-dashed border-white/20 rounded-lg hover:border-lime-400 transition-colors cursor-pointer">
                            <Upload size={16} className="mr-2" />
                            <span className="text-sm">Upload Images</span>
                          </div>
                        </label>
                        {uploadedImages[zone]?.length > 0 && (
                          <span className="text-sm text-lime-400 font-medium">
                            {uploadedImages[zone].length} files
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAnalyze}
                  className="w-full py-3 mt-6 font-semibold bg-lime-400 hover:bg-zinc-800 rounded-lg transition-all duration-500"
                >
                  Analyze All Zones
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section - Second Viewport */}
          <div className="h-[100vh] mb-10">
            <div className="bg-black/40 rounded-xl border border-white/10 shadow-xl p-8 h-full flex flex-col">
              <h2 className="text-2xl font-semibold mb-8">Analysis Results</h2>
              <div className="flex-1 overflow-y-auto">
                {detectionResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {detectionResults.map((result, index) => (
                      <div
                        key={index}
                        className="p-6 bg-black/20 rounded-lg border border-white/5 hover:border-lime-400/30 transition-colors"
                      >
                        <h3 className="font-semibold text-lg mb-4">
                          {result.zone}
                        </h3>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300">
                            <span className="font-medium">Waste Type:</span>{" "}
                            {result.wasteType}
                          </p>
                          <p className="text-sm text-gray-300">
                            <span className="font-medium">Confidence:</span>
                            <span className="text-lime-400 ml-1">
                              {result.confidence}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-white/10 border-t-lime-400 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-400 text-lg mb-2">
                        No analysis results yet
                      </p>
                      <p className="text-gray-500 text-sm">
                        Upload images to the zones above and click "Analyze All
                        Zones" to begin processing.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <div className="relative mt-20 bottom-0 z-10">
          <Footer />
        </div>
      </div>
    </>
  );
}