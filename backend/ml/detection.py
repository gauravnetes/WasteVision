# backend/ml/detection.py
from ultralytics import YOLO

# Define the output directory for saved images
OUTPUT_DIR = "ml/detected_images"

def run_detection(model: YOLO, image_path: str, save_output: bool = False) -> list:
    """
    Runs detection on a single image and returns structured results.
    saves the annotated image.
    """
    try:
        # Pass save=True to the predict method if requested
        results = model.predict(
            source=image_path,
            conf=0.4,
            verbose=False,
            save=save_output, # <-- Controls whether to save the image
            project=OUTPUT_DIR,
            name="runs",
            exist_ok=True
        )
        
        detections = []
        if results and results[0].boxes is not None:
            for box in results[0].boxes:
                class_id = int(box.cls[0])
                detections.append({
                    "box": box.xyxy[0].tolist(),
                    "label": model.names[class_id],
                    "confidence": float(box.conf[0])
                })
        return detections
    except Exception as e:
        print(f"❌ Error during YOLO detection: {e}")
        return []