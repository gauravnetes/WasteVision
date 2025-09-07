# backend/ml/pipeline.py
import os
import glob
import pandas as pd
from ultralytics import YOLO
from . import detection
from . import reconstruction

# --- MODEL LOADING ---
# This loads the model once, making it efficient for the worker and tests.
MODEL_PATH = "ml/models/best.pt"
MODEL = YOLO(MODEL_PATH)
print("✅ YOLO model loaded successfully into pipeline.")

def process_waste_image(image_path: str, save_detections: bool = False) -> float:
    """
    The main pipeline function that orchestrates the entire ML process for one image.
    """
    print(f"🚀 Starting ML pipeline for: {os.path.basename(image_path)}")
    
    # Step 1: Run 2D detection to get bounding boxes
    detection_results = detection.run_detection(MODEL, image_path, save_output=save_detections)
    
    if not detection_results:
        print("-> No waste detected in image.")
        return 0.0
    
    print(f"-> Found {len(detection_results)} waste objects.")

    # Step 2: Pass detection results to the reconstruction logic
    waste_volume_cm3 = reconstruction.estimate_volume_from_detections(detection_results)
    
    print(f"-> Estimated waste volume: {waste_volume_cm3:.2f} cm³")
    return waste_volume_cm3

# ====================================================================
# MAIN TEST RUNNER BLOCK
# This code only runs when you execute the script directly for testing.
# ====================================================================
def main():
    """
    A function to test the pipeline on a directory of images.
    """
    # Define paths for test input and output
    TEST_IMAGES_DIR = "ml/test_images"
    OUTPUT_CSV_PATH = "ml/data/analysis_summary.csv"
    
    # Create the data output directory if it doesn't exist
    os.makedirs("ml/data", exist_ok=True)

    # Find all image files in the test directory
    image_paths = glob.glob(os.path.join(TEST_IMAGES_DIR, "*.jpg")) + \
                  glob.glob(os.path.join(TEST_IMAGES_DIR, "*.png"))

    if not image_paths:
        print(f"❌ No images found in '{TEST_IMAGES_DIR}'. Please add images to test.")
        return

    print(f"\nFound {len(image_paths)} images to process. Starting test run...\n")
    
    results_summary = []
    # Loop through each image and process it
    for img_path in image_paths:
        volume = process_waste_image(img_path, save_detections=True)
        results_summary.append({
            "image_filename": os.path.basename(img_path),
            "estimated_volume_cm3": volume
        })
        print("-" * 20)

    # Save the summary to a CSV file
    df_results = pd.DataFrame(results_summary)
    df_results.to_csv(OUTPUT_CSV_PATH, index=False)

    print("\n🎉 Test run complete!")
    print(f"📊 Summary of results saved to: {OUTPUT_CSV_PATH}")
    print("\nFinal Results:")
    print(df_results)

if __name__ == "__main__":
    main()