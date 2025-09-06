/**
 * Converts meters to degrees for both latitude and longitude
 * @param lat - Latitude in degrees
 * @param metersLat - Meters in north-south direction
 * @param metersLon - Meters in east-west direction
 * @returns Object with degLat and degLon
 */
export function metersToDegrees(lat: number, metersLat: number, metersLon: number) {
  // 1 degree of latitude is approximately 111,132 meters
  const degLat = metersLat / 111_132;
  
  // 1 degree of longitude varies with latitude (due to earth's curvature)
  // At the equator it's about 111,320 meters, and decreases as we move towards the poles
  const degLon = metersLon / (111_132 * Math.cos((lat * Math.PI) / 180));
  
  return { degLat, degLon };
}

/**
 * Determines if a point is inside a polygon using the ray casting algorithm
 * @param point - [lat, lng] coordinates of the point to check
 * @param polygon - Array of [lat, lng] coordinates forming the polygon
 * @returns Boolean indicating if the point is inside the polygon
 */
export function pointInPolygon(
  point: [number, number],
  polygon: [number, number][]
): boolean {
  // Ray casting algorithm implementation
  const [lat, lng] = point;
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [lat1, lng1] = polygon[i];
    const [lat2, lng2] = polygon[j];
    
    // Check if the ray from point crosses this edge
    const intersect = 
      ((lat1 > lat) !== (lat2 > lat)) && 
      (lng < (lng2 - lng1) * (lat - lat1) / (lat2 - lat1) + lng1);
    
    if (intersect) {
      inside = !inside;
    }
  }
  
  return inside;
}