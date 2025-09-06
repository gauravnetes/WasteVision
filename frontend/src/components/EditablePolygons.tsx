// EditablePolygons.tsx
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";

interface Props {
  zones: { id: string; coords: [number, number][] }[];
  setZones: React.Dispatch<React.SetStateAction<any>>;
  campusBoundary?: [number, number][]; // outer polygon
}

export default function EditablePolygons({
  zones,
  setZones,
  campusBoundary,
}: Props) {
  const map = useMap();

  useEffect(() => {
    if (!map.pm) return;

    // clean old zone layers
    map.eachLayer((layer: any) => {
      if (layer.options?.zoneId) {
        map.removeLayer(layer);
      }
    });

    zones.forEach((zone) => {
      const polygon = L.polygon(zone.coords, {
        color: "#38bdf8",
        zoneId: zone.id,
      }).addTo(map);

      // enable edit + drag
      polygon.pm.enable({
        snappable: true,
        allowSelfIntersection: false,
        draggable: true,
      });

      // when user edits shape
      polygon.on("pm:edit", () => {
        const coords = polygon
          .getLatLngs()[0]
          .map((ll: any) => [ll.lat, ll.lng]);
        setZones((prev) =>
          prev.map((z) => (z.id === zone.id ? { ...z, coords } : z))
        );
      });

      // when user drags the whole polygon
      polygon.on("pm:dragend", () => {
        const coords = polygon
          .getLatLngs()[0]
          .map((ll: any) => [ll.lat, ll.lng]);
        setZones((prev) =>
          prev.map((z) => (z.id === zone.id ? { ...z, coords } : z))
        );
      });
    });
  }, [zones, map]);

  return null;
}
