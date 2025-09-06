"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

// import type { Map as LMap } from "leaflet";
import type { Map as LeafletMap } from "leaflet";
import {
  Polygon,
  Tooltip,
  FeatureGroup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { Pencil, X, Save, RotateCcw, Move } from "lucide-react";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

// Import leaflet and leaflet.pm CSS
import "leaflet/dist/leaflet.css";
import "leaflet.pm/dist/leaflet.pm.css";

// Import custom utility functions
import { metersToDegrees, pointInPolygon } from "../utils/geo";

// --- Types ---
export interface CampusGridProps {
  name: string; // no longer optional
  centerLat: number; // no longer optional
  centerLon: number; // no longer optional
  campusArea: number; // no longer optional
  campusId: string; // no longer optional
  onPreviewOpen?: () => void;
  isPreviewMode?: boolean;
}

type LatLngTuple = [number, number];

interface Zone {
  id: string;
  name: string;
  coords: LatLngTuple[];
  originalCoords?: LatLngTuple[];
}

// --- Dynamic Map (no SSR) ---
const DynamicMap = dynamic(() => import("./DynamicMap"), { ssr: false });

// --- Map Controller Component ---
interface MapControllerProps {
  isEditing: boolean;
  isMoving: boolean;
  zones: Zone[];
  setZones: React.Dispatch<React.SetStateAction<Zone[]>>;
  campusBoundary: LatLngTuple[];
  resetZonesRef: React.MutableRefObject<() => void>;
}

function MapController({
  isEditing,
  isMoving,
  zones,
  setZones,
  campusBoundary,
  resetZonesRef,
}: MapControllerProps) {
  const map = useMap();
  const polygonLayersRef = useRef<Record<string, L.Polygon>>({});
  const originalCoordsRef = useRef<Record<string, LatLngTuple[]>>({});

  // Initialize leaflet.pm controls
  useEffect(() => {
    if (!map) return;

    // Enable leaflet.pm controls
    map.pm.addControls({
      position: "topleft",
      drawCircle: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawPolygon: false,
      drawMarker: false,
      cutPolygon: false,
      editMode: true,
      dragMode: true,
      removalMode: false,
    });

    // Set global options for leaflet.pm
    map.pm.setGlobalOptions({
      allowSelfIntersection: false,
      limitMarkersToCount: 20,
      editable: true,
      draggable: true,
      snappable: true,
    });

    return () => {
      if (map && map.pm) {
        map.pm.removeControls();
      }
    };
  }, [map]);

  // Handle edit mode
  useEffect(() => {
    if (!map || !zones.length) return;

    // Clean up existing polygon layers
    Object.values(polygonLayersRef.current).forEach((layer) => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
    polygonLayersRef.current = {};

    // Create polygon layers for each zone
    zones.forEach((zone) => {
      const polygon = L.polygon(zone.coords, {
        color: isEditing ? "#f97316" : isMoving ? "#6366f1" : "#38bdf8",
        weight: 2,
        fillOpacity: 0.1,
      }).addTo(map);

      // Store reference to the polygon layer
      polygonLayersRef.current[zone.id] = polygon;

      // Add tooltip
      polygon.bindTooltip(zone.name, { sticky: true });

      // Enable/disable vertex editing based on isEditing state
      if (isEditing) {
        polygon.pm.enable({
          allowSelfIntersection: false,
          preventMarkerRemoval: true,
          snapDistance: 15,
          snapSegment: true,
          finishOn: "contextmenu",
        });

        // Make vertices more visible
        const markers = polygon.pm._markers || [];
        markers.forEach((marker: any) => {
          if (marker && marker._icon) {
            marker._icon.style.width = "12px";
            marker._icon.style.height = "12px";
            marker._icon.style.border = "2px solid #f97316";
            marker._icon.style.background = "white";
          }
        });

        // Force redraw to make vertices visible
        setTimeout(() => {
          polygon.pm.disable();
          polygon.pm.enable({
            allowSelfIntersection: false,
            preventMarkerRemoval: true,
          });
        }, 50);

        // Handle edit events
        polygon.on("pm:edit", (e: any) => {
          console.log("pm:edit event fired", e);
          const newCoords = polygon
            .getLatLngs()[0]
            .map((ll: any) => [ll.lat, ll.lng]);

          // Check if the edited polygon is still within campus boundary
          const isWithinBoundary = newCoords.every((coord: LatLngTuple) => {
            return pointInPolygon(coord, campusBoundary);
          });

          if (isWithinBoundary) {
            setZones((prev) =>
              prev.map((z) =>
                z.id === zone.id
                  ? { ...z, coords: newCoords as LatLngTuple[] }
                  : z
              )
            );
          } else {
            // Revert changes if outside boundary
            toast.error("Zone must stay within campus boundary");
            const originalCoords = zone.originalCoords || zone.coords;
            polygon.setLatLngs(originalCoords);
            setZones((prev) =>
              prev.map((z) =>
                z.id === zone.id ? { ...z, coords: [...originalCoords] } : z
              )
            );
          }
        });
      } else {
        polygon.pm.disable();
      }
    });

    return () => {
      // Clean up polygon layers when component unmounts or dependencies change
      Object.values(polygonLayersRef.current).forEach((layer) => {
        layer.off("pm:edit");
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      });
      polygonLayersRef.current = {};
    };
  }, [map, zones, isEditing, campusBoundary, setZones]);

  // Handle moving mode
  useEffect(() => {
    if (!map || !zones.length) return;

    // Store original coordinates before dragging
    zones.forEach((zone) => {
      const polygon = polygonLayersRef.current[zone.id];
      if (polygon) {
        originalCoordsRef.current[zone.id] = [...zone.coords];

        if (isMoving) {
          // Make polygon more visible during movement
          polygon.setStyle({
            color: "#6366f1",
            weight: 3,
            fillOpacity: 0.2,
          });

          // Enable dragging
          polygon.pm.enable({
            allowSelfIntersection: false,
            preventVertexEdit: true,
            preventMarkerRemoval: true,
            draggable: true,
          });

          // Force enable dragging if not already active
          if (!polygon.dragging) {
            polygon.pm.enableDrag();
          }

          // Log events for debugging
          polygon.on("pm:dragstart", () => {
            console.log("pm:dragstart event fired");
          });

          polygon.on("dragstart", () => {
            console.log("dragstart event fired");
          });

          polygon.on("pm:dragend", (e: any) => {
            console.log("pm:dragend event fired", e);
            const newCoords = polygon
              .getLatLngs()[0]
              .map((ll: any) => [ll.lat, ll.lng]);

            // Check if the moved polygon is still within campus boundary
            const isWithinBoundary = newCoords.every((coord: LatLngTuple) => {
              return pointInPolygon(coord, campusBoundary);
            });

            if (isWithinBoundary) {
              setZones((prev) =>
                prev.map((z) =>
                  z.id === zone.id
                    ? { ...z, coords: newCoords as LatLngTuple[] }
                    : z
                )
              );
            } else {
              // Revert changes if outside boundary
              toast.error("Zone must stay within campus boundary");
              const originalCoords =
                originalCoordsRef.current[zone.id] || zone.coords;
              polygon.setLatLngs(originalCoords);
              setZones((prev) =>
                prev.map((z) =>
                  z.id === zone.id ? { ...z, coords: [...originalCoords] } : z
                )
              );
            }
          });

          // Also handle regular dragend event
          polygon.on("dragend", (e: any) => {
            console.log("dragend event fired", e);
            const newCoords = polygon
              .getLatLngs()[0]
              .map((ll: any) => [ll.lat, ll.lng]);
            setZones((prev) =>
              prev.map((z) =>
                z.id === zone.id
                  ? { ...z, coords: newCoords as LatLngTuple[] }
                  : z
              )
            );
          });
        } else {
          // Disable dragging
          polygon.pm.disable();
          polygon.off("pm:dragstart");
          polygon.off("pm:dragend");
          polygon.off("dragstart");
          polygon.off("dragend");
          polygon.off("drag");

          // Reset style
          polygon.setStyle({
            color: "#38bdf8",
            weight: 2,
            fillOpacity: 0.1,
          });
        }
      }
    });

    // Implement resetZones function
    resetZonesRef.current = () => {
      zones.forEach((zone) => {
        const polygon = polygonLayersRef.current[zone.id];
        if (polygon && zone.originalCoords) {
          polygon.setLatLngs(zone.originalCoords);
        }
      });
    };

    return () => {
      // Clean up event listeners
      zones.forEach((zone) => {
        const polygon = polygonLayersRef.current[zone.id];
        if (polygon) {
          polygon.off("pm:dragstart");
          polygon.off("pm:dragend");
          polygon.off("dragstart");
          polygon.off("dragend");
          polygon.off("drag");
          polygon.pm.disable();
        }
      });
    };
  }, [map, zones, isMoving, campusBoundary, setZones]);

  return null;
}

export default function CampusGrid({
  name,
  centerLat,
  centerLon,
  campusArea,
  campusId,
  isPreviewMode = false,
  onPreviewOpen,
}: CampusGridProps): JSX.Element {
  const center = useMemo(
    () => ({ lat: centerLat, lon: centerLon }),
    [centerLat, centerLon]
  );
  const zoneSize = 100;

  const [isEditing, setIsEditing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [zones, setZones] = useState<Zone[]>([]);
  const [originalZones, setOriginalZones] = useState<Zone[]>([]);
  const [campusBoundary, setCampusBoundary] = useState<LatLngTuple[]>([]);
  const [helperText, setHelperText] = useState<string>("");
  const [boundaryPadding, setBoundaryPadding] = useState(100);

  const mapRef = useRef<LeafletMap | null>(null);
  const fgRef = useRef<L.FeatureGroup | null>(null);
  const polygonRefs = useRef<Record<string, L.Polygon>>({});
  const resetZonesRef = useRef<() => void>(() => {});
  const isMounted = useRef<boolean>(true);

  // --- Cleanup map instance properly ---
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (mapRef.current) {
        try {
          mapRef.current.remove();
          mapRef.current = null;
        } catch (err) {
          console.error("Error cleaning up map:", err);
        }
      }
    };
  }, []);

  // This is the CORRECTED useEffect for the frontend component
  useEffect(() => {
    // This function will fetch the latest zone data from your backend
    const fetchZones = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // Handle user not being logged in (e.g., redirect)
        return;
      }

      try {
        const API_BASE =
          process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
        const res = await fetch(`${API_BASE}/api/zones/map`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch zone data from the server.");
        }

        const zonesFromAPI = await res.json();

        // Convert the backend data into the format your frontend state expects
        const formattedZones = zonesFromAPI.map((zone) => ({
          id: zone.public_id, // Use the public_id as the unique ID on the frontend
          name: zone.zone_code,
          // Leaflet expects [lat, lon], but GeoJSON is [lon, lat], so we swap them.
          // Also remove the last point which is a duplicate to close the polygon.
          coords: zone.geo_boundary.coordinates[0]
            .slice(0, -1)
            .map((p) => [p[1], p[0]]),
        }));

        // Set both the display state and the "original" state for future comparisons
        setZones(formattedZones);
        setOriginalZones(JSON.parse(JSON.stringify(formattedZones)));
      } catch (error) {
        console.error("Error fetching zones:", error);
        // Show an error toast to the user
      }
    };

    fetchZones();
  }, []); // The empty array [] ensures this effect runs only ONCE when the page loads
  useEffect(() => {
    // This effect runs only when it has the data it needs from the props.
    // It is responsible for drawing the green dashed boundary.
    if (!campusArea || !centerLat || !centerLon) return;

    const side = Math.sqrt(campusArea);
    const { degLat: campusLat, degLon: campusLon } = metersToDegrees(
      centerLat,
      side + boundaryPadding,
      side + boundaryPadding
    );
    const boundary: LatLngTuple[] = [
      [centerLat + campusLat / 2, centerLon - campusLon / 2],
      [centerLat + campusLat / 2, centerLon + campusLon / 2],
      [centerLat - campusLat / 2, centerLon + campusLon / 2],
      [centerLat - campusLat / 2, centerLon - campusLon / 2],
      [centerLat + campusLat / 2, centerLon - campusLon / 2], // Close the polygon
    ];
    setCampusBoundary(boundary);
  }, [centerLat, centerLon, campusArea, boundaryPadding]);
  // --- Helper text ---
  useEffect(() => {
    if (isEditing) {
      setHelperText("Drag corner points to edit zones.");
    } else if (isMoving) {
      setHelperText("Drag polygons to move them (must stay inside boundary).");
    } else {
      setHelperText("");
    }
  }, [isEditing, isMoving]);

  // --- Keyboard shortcuts ---
  useEffect(() => {
    if (isPreviewMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditing(false);
        setIsMoving(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreviewMode]);

  // --- Reset zones ---
  const resetZones = () => {
    const newZones = JSON.parse(JSON.stringify(originalZones));
    setZones(newZones);
    setIsEditing(false);
    setIsMoving(false);
    setHelperText("");
    resetZonesRef.current();
    toast.success("Zones reset to original state");
  };

  // --- Save zones ---
const saveZones = async () => {
  try {
    const API_BASE =
      process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in.");
      return;
    }
    const modifiedZones = zones.filter((zone) => {
      const originalZone = originalZones.find((oz) => oz.id === zone.id);
      if (!originalZone) return true;
      if (originalZone.coords.length !== zone.coords.length) return true;
      return zone.coords.some(
        (c, i) =>
          c[0] !== originalZone.coords[i][0] ||
          c[1] !== originalZone.coords[i][1]
      );
    });
    if (modifiedZones.length === 0) {
      toast.info("No changes detected");
      return;
    }

    const loadingToast = toast.loading("Saving zones...");

    // --- 👇 THIS IS THE CORRECTED PART ---
    const payload = modifiedZones.map((zone) => {
      // Create a new array with the first coordinate added to the end to close the polygon
      const closedCoords = [...zone.coords, zone.coords[0]];

      return {
        public_id: zone.id,
        geo_boundary: {
          type: "Polygon",
          // Use the new closedCoords array and swap lat/lon for GeoJSON
          coordinates: [closedCoords.map((c) => [c[1], c[0]])],
        },
      };
    });

    console.log("Saving zones payload:", payload);

    const res = await fetch(`${API_BASE}/api/zones`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("API response:", data);

    if (!res.ok) throw new Error(data.detail || "Failed to save zones");

    setOriginalZones(JSON.parse(JSON.stringify(zones)));
    toast.dismiss(loadingToast);
    toast.success(
      `${modifiedZones.length} zone${
        modifiedZones.length > 1 ? "s" : ""
      } updated successfully!`
    );
  } catch (err: any) {
    toast.dismiss();
    toast.error(`Failed to save zones: ${err.message || "Unknown error"}`);
    console.error("Save zones error:", err);
  }
};

  return (
    <div className="relative w-full h-full flex flex-col">
      <DynamicMap
        key={`map-${center.lat}-${center.lon}-${
          isPreviewMode ? "preview" : "edit"
        }`} // ✅ prevents reuse error
        center={[center.lat, center.lon]}
        zoom={18}
        style={{
          height: isPreviewMode ? "80vh" : "65vh",
          width: "100%",
          borderRadius: "0.75rem",
        }}
        onMapReady={(map: LeafletMap) => (mapRef.current = map)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* Campus boundary */}
        {campusBoundary.length > 0 && (
          <Polygon
            positions={campusBoundary}
            pathOptions={{
              color: "#22c55e",
              weight: 2,
              dashArray: "6 6",
              fillOpacity: 0.05,
            }}
          />
        )}
        {/* Zones */}
        <FeatureGroup ref={(fg) => (fgRef.current = fg)}>
          {zones.map((zone) => (
            <Polygon
              key={zone.id}
              positions={zone.coords}
              pathOptions={{
                color: isEditing ? "#f97316" : isMoving ? "#6366f1" : "#38bdf8",
                weight: 2,
                fillOpacity: 0.1,
              }}
              ref={(poly) => {
                if (poly && isMounted.current)
                  polygonRefs.current[zone.id] = poly;
              }}
            >
              <Tooltip sticky={true as any}>{zone.name}</Tooltip>
            </Polygon>
          ))}
        </FeatureGroup>
        Map Controller for editing and moving
        {(isEditing || isMoving) && !isPreviewMode && (
          <MapController
            isEditing={isEditing}
            isMoving={isMoving}
            zones={zones}
            setZones={setZones}
            campusBoundary={campusBoundary}
            resetZonesRef={resetZonesRef}
          />
        )}
      </DynamicMap>

      {/* Helper text */}
      {helperText && (
        <div className="text-sm text-center mt-2 text-gray-600 bg-gray-100 p-2 rounded-md">
          {helperText}
        </div>
      )}

      {/* Control buttons */}
      <div className="flex justify-center font-semibold gap-4 mt-4 mb-2">
        <button
          onClick={() => {
            setIsEditing((prev) => !prev);
            if (isMoving) setIsMoving(false);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-zinc-800 text-sm transition-all duration-500 text-black hover:text-white rounded-md"
        >
          {isEditing ? (
            <>
              <X size={16} /> Exit Edit
            </>
          ) : (
            <>
              <Pencil size={16} /> Edit Zones
            </>
          )}
        </button>

        <button
          onClick={resetZones}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-400 hover:bg-zinc-800 text-sm text-white hover:text-orange-400 transition-all duration-500 rounded-md"
        >
          <RotateCcw size={16} /> Reset Zones
        </button>

        <button
          onClick={saveZones}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-400 hover:bg-zinc-800 text-sm text-white hover:text-green-400 transition-all duration-500 rounded-md"
        >
          <Save size={16} /> Save Zones
        </button>
      </div>
    </div>
  );
}