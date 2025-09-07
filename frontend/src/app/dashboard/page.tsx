"use client";

import { useState, useEffect, useCallback } from "react";
import { Toaster, toast } from "sonner";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Upload, Loader2, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Prism from "@/components/Prism";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import type { CampusGridProps } from "@/components/CampusGrid";
import LocationButton from "@/components/LocationButton";

// --- Type Definitions ---
interface CampusData {
  public_id: string;
  name: string;
  center_latitude: number;
  center_longitude: number;
  campus_area_sq_meters: number;
}

interface Zone {
  id: string; // public_id from backend
  name: string; // zone_code from backend
  coords: [number, number][];
  status: string;
}

const CampusGrid = dynamic<CampusGridProps>(
  () => import("@/components/CampusGrid"),
  { ssr: false, loading: () => <div className="flex h-full w-full items-center justify-center bg-black/20">Loading Map...</div> }
);

const Globe = dynamic(() => import("@/components/ui/globe"), { ssr: false });

// --- Helper Function for Demo ---
const generateRandomPointInPolygon = (polygonCoords: [number, number][]) => {
    const lons = polygonCoords.map(p => p[1]);
    const lats = polygonCoords.map(p => p[0]);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    
    return {
      lat: Math.random() * (maxLat - minLat) + minLat,
      lon: Math.random() * (maxLon - minLon) + minLon,
    };
};

export default function Dashboard() {
  useAuthGuard();
  
  // --- State Management ---
  const [campusData, setCampusData] = useState<CampusData | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [showGlobe, setShowGlobe] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<{ campus_id?: string; name?: string; }>({});
  const [error, setError] = useState("");
  
  const [zones, setZones] = useState<Zone[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResults, setScanResults] = useState<any[]>([]);


  // --- Data Fetching Logic ---

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

        // Fetch user/campus data, zone data, and scan results in parallel
        const [userRes, zonesRes, scanResultsRes] = await Promise.all([
          fetch(`${API_BASE}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/api/zones/map`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/api/scans/results`, { headers: { Authorization: `Bearer ${token}` } }),

      
        ]);

        if (!userRes.ok) throw new Error("Failed to fetch user data.");
        if (!zonesRes.ok) throw new Error("Failed to fetch zone data.");

        if (!scanResultsRes.ok) throw new Error("Failed to fetch scan results.");

        const userData = await userRes.json();
        const zonesData = await zonesRes.json();
        const scanResultsData = await scanResultsRes.json();
        
        setUserData(userData);
        setCampusData(userData.campus);
        setScanResults(scanResultsData);


        const formattedZones = zonesData.map((zone: any) => ({
          id: zone.public_id,
          name: zone.zone_code,
          coords: zone.geo_boundary.coordinates[0].slice(0, -1).map((p: number[]) => [p[1], p[0]]),
          status: zone.current_status,
        }));
        setZones(formattedZones);

      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data.");
        toast.error(err.message || "Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [router]);


  useEffect(() => {
    const timer = setTimeout(() => setShowGlobe(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  const handleAnalyze = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please sign in.");
    if (uploadedImages.length === 0) return toast.info("Please select images to upload.");
    if (zones.length === 0) return toast.error("Campus zones not loaded. Cannot assign coordinates.");

    setIsProcessing(true);
    const loadingToast = toast.loading(`Uploading ${uploadedImages.length} images...`);

    const uploadPromises = uploadedImages.map(file => {
      // Randomly select a zone from the zones state
      const randomZone = zones[Math.floor(Math.random() * zones.length)];
      // Generate a random GPS point inside the zone's boundary
      const { lat, lon } = generateRandomPointInPolygon(randomZone.coords);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("latitude", lat.toString());
      formData.append("longitude", lon.toString());

      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
      return fetch(`${API_BASE}/api/scans`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    });

    try {
      // Send all requests in parallel
      await Promise.all(uploadPromises);
      toast.dismiss(loadingToast);
      toast.info("Uploads complete. Processing scans... The map will update when ready.");
      
      // Store the initial zone statuses for comparison during polling
      const initialZoneStatuses = JSON.stringify(zones.map((z: Zone) => z.status));
      
      // Begin polling for updates
      const pollingInterval = setInterval(async () => {
        try {
          const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

          // Fetch both zones and scan results in parallel
          const [zonesRes, scanResultsRes] = await Promise.all([
            fetch(`${API_BASE}/api/zones/map`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API_BASE}/api/scans/results`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);
          
          if (!zonesRes.ok) throw new Error("Failed to poll zone data.");
          if (!scanResultsRes.ok) throw new Error("Failed to poll scan results.");
          
          const zonesData = await zonesRes.json();
          const scanResultsData = await scanResultsRes.json();
          

          const latestZones = zonesData.map((zone: any) => ({
            id: zone.public_id,
            name: zone.zone_code,
            coords: zone.geo_boundary.coordinates[0].slice(0, -1).map((p: number[]) => [p[1], p[0]]),
            status: zone.current_status,
          }));
          
          const latestZoneStatuses = JSON.stringify(latestZones.map((z: Zone) => z.status));

          // If statuses have changed, update the UI and stop polling
          if (latestZoneStatuses !== initialZoneStatuses) {
            clearInterval(pollingInterval);
            setZones(latestZones);

            setScanResults(scanResultsData);

            setUploadedImages([]);
            setIsProcessing(false);
            toast.success("Waste map has been updated with new scan results!");
          }
        } catch (err: any) {
          console.error("Polling error:", err);
          // Don't stop polling on error, just log it
        }
      }, 10000); // Poll every 10 seconds

      // Safety cleanup: stop polling after 5 minutes if no changes detected
      setTimeout(() => {
        clearInterval(pollingInterval);
        if (isProcessing) {
          setIsProcessing(false);
          toast.info("Processing complete, but no zone status changes were detected.");
        }
      }, 5 * 60 * 1000);

    } catch (err: any) {
      setIsProcessing(false);
      toast.dismiss(loadingToast);
      toast.error(err.message || "An error occurred during upload.");
    }
  };

  // --- Render ---
  if (isLoading) return <div className="flex h-screen items-center justify-center bg-black text-white">Loading Dashboard...</div>;
  if (error) return <div className="flex h-screen items-center justify-center bg-black text-white">Error: {error}</div>;

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Navbar />
      <div className="flex relative font-custom flex-col min-h-screen text-white">
        
        {/* Burger and Sidebar - No changes needed here */}
        
        <main className="relative h-full left-0 right-0 top-24 container mx-auto px-4 md:px-24 py-6">
          <h1 className="text-2xl font-bold mb-8">{campusData?.name}</h1>

          <div className="h-[100vh] grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            
            {/* Left Side: Map */}
            <div className="lg:col-span-8 col-span-1">
              <div className="bg-black/40 rounded-xl border border-white/10 shadow-xl p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Campus Map</h2>
                  {/* {campusData && !userLocation && (
                    <LocationButton
                      onLocationFound={(coords) => setUserLocation(coords)}
                    />
                  )} */}
                </div>

                <div className="relative w-full h-[calc(100%-3rem)] rounded-lg overflow-hidden bg-black/40 border border-white/10 z-10">
                  <AnimatePresence mode="wait">
                    {showGlobe ? (
                      <motion.div key="globe" /* ... */ >
                        <Globe />
                      </motion.div>
                    ) : (
                      <motion.div key="map" /* ... */ >
                        {campusData && (
                          <CampusGrid
                            name={campusData.name}
                            centerLat={userLocation?.lat ?? campusData.center_latitude}
                            centerLon={userLocation?.lon ?? campusData.center_longitude}
                            campusArea={campusData.campus_area_sq_meters}
                            campusId={campusData.public_id}
                            zones={zones}
                            setZones={setZones}
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Side: Uploader */}
            <div className="lg:col-span-4 col-span-1">
              <div className="bg-black/40 rounded-xl border border-white/10 shadow-xl p-6 h-full flex flex-col">
                <h2 className="text-xl font-semibold mb-6">Bulk Image Scan</h2>
                <div className="flex-1">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-lime-400 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">Up to 10 images</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg, image/png"
                      className="hidden"
                      onChange={(e) => setUploadedImages(Array.from(e.target.files || []).slice(0, 10))}
                    />
                  </label>
                  {uploadedImages.length > 0 && (
                    <div className="mt-4 text-sm text-gray-300">
                      <p className="font-semibold">{uploadedImages.length} file(s) selected:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1 max-h-48 overflow-y-auto">
                        {uploadedImages.map(f => <li key={f.name} className="truncate">{f.name}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={isProcessing || uploadedImages.length === 0}
                  className="w-full py-3 mt-6 font-semibold bg-lime-400 text-black rounded-lg hover:bg-zinc-800 hover:text-lime-400 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                >
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2" />}
                  {isProcessing ? 'Processing...' : `Analyze ${uploadedImages.length} Images`}
                </button>
              </div>
            </div>
            
          </div>

          {/* Analysis Results Section */}
          <div className="bg-black/40 rounded-xl border border-white/10 shadow-xl p-6 mb-16">
            <h2 className="text-xl font-semibold mb-6">Analysis Results</h2>
            
            {scanResults.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
                <p>No scan results available yet. Upload images to analyze waste.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-black/30">
                    <tr>
                      <th scope="col" className="px-6 py-3">Image</th>
                      <th scope="col" className="px-6 py-3">Zone</th>
                      <th scope="col" className="px-6 py-3">Waste Volume (cm³)</th>
                      <th scope="col" className="px-6 py-3">Processed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scanResults.map((result, index) => (
                      <tr key={index} className="border-b border-white/10 hover:bg-black/20">
                        <td className="px-6 py-4">
                          <div className="w-16 h-16 rounded overflow-hidden">
                            <img 
                              src={result.image_url} 
                              alt={`Scan of ${result.zone_code}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">{result.zone_code}</td>
                        <td className="px-6 py-4">{result.waste_volume_estimate.toFixed(2)}</td>
                        <td className="px-6 py-4">{new Date(result.processed_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
        <Footer />
      </div>
    </>
  );
}