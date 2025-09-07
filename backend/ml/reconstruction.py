# backend/ml/reconstruction.py

# --- CONFIGURATION ---
# These constants belong here as they are part of the reconstruction logic.
PIXEL_TO_CM = 0.1      # Each pixel ~0.1 cm (adjust if calibration available)
ASSUMED_HEIGHT_CM = 5  # Assume avg height of waste pile in cm

def estimate_volume_from_detections(detection_results: list) -> float:
    """
    Estimates 3D waste volume from a list of 2D bounding box detections.

    Args:
        detection_results: A list of detection dictionaries from the detection module.
                           Example: [{"box": [x1, y1, x2, y2], ...}, ...]

    Returns:
        The estimated volume of waste in cubic centimeters (cm³).
    """
    total_area_pixels = 0
    for detection in detection_results:
        x1, y1, x2, y2 = detection["box"]
        width_pixels = x2 - x1
        height_pixels = y2 - y1
        area_pixels = width_pixels * height_pixels
        total_area_pixels += area_pixels

    # Convert total pixel area to real-world area (cm²)
    total_area_cm2 = total_area_pixels * (PIXEL_TO_CM ** 2)

    # Extrude the 2D area into a 3D volume using an assumed height
    total_volume_cm3 = total_area_cm2 * ASSUMED_HEIGHT_CM

    return total_volume_cm3