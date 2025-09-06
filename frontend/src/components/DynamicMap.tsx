"use client";
import { MapContainer } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import React from "react";

interface DynamicMapProps {
  center: [number, number];
  zoom: number;
  children: React.ReactNode;
  onMapReady?: (map: LeafletMap) => void;
  style?: React.CSSProperties;
}

export default function DynamicMap({
  center,
  zoom,
  children,
  onMapReady,
  style,
}: DynamicMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={style || { height: "100%", width: "100%" }}
      whenCreated={(map) => {
        if (onMapReady) onMapReady(map);
      }}
    >
      {children}
    </MapContainer>
  );
}
