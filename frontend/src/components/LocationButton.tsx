"use client";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

interface LocationButtonProps {
  onLocationFound: (coords: { lat: number; lon: number }) => void;
}

export default function LocationButton({
  onLocationFound,
}: LocationButtonProps) {
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    toast.loading("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      // Success Callback
      (position) => {
        toast.dismiss(); // Dismiss the loading toast
        toast.success("Location found!");
        onLocationFound({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      // Error Callback
      (error) => {
        toast.dismiss();
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location access denied. Using default campus location.");
        } else {
          toast.error("Could not get your location.");
        }
      }
    );
  };

  return (
    <button
      onClick={handleGetLocation}
      className="flex items-center gap-2 px-4 py-2 z-99 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all animate-pulse"
    >
      {/* <MapPin size={20} /> */}
      <p className="text-sm cursor-pointer">Enable Accurate Location</p>
    </button>
  );
}
