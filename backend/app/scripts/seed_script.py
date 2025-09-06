# app/scripts/seed_script.py
import pandas as pd
import requests
import time
import uuid
import os
from pathlib import Path
from dotenv import load_dotenv

from app.models import models
from app.core.database import SessionLocal

# --- ROBUST CONFIGURATION ---
script_dir = Path(__file__).resolve().parent
backend_dir = script_dir.parent.parent
env_path = backend_dir / ".env"
load_dotenv(dotenv_path=env_path)

GEOAPIFY_API_KEY = os.getenv("GEOAPIFY_API_KEY")

# --- FILE PATHS ---
ORIGINAL_CSV_PATH = backend_dir / "engineering_colleges_in_India.csv"
PROGRESS_CSV_PATH = backend_dir / "colleges_with_coords.csv" # For saving progress

# IMPORTANT: Make sure these column names match your CSV file exactly.
CSV_COL_NAME = "College Name"
CSV_COL_CITY = "City"
CSV_COL_STATE = "State"
CSV_COL_CAMPUS_SIZE = "Campus Size"

ACRES_TO_SQ_METERS = 4046.86

def get_coordinates(college_name, city, state):
    """Calls the Geoapify API to get lat/long for an address."""
    if not GEOAPIFY_API_KEY:
        print("ERROR: GEOAPIFY_API_KEY not found in .env file.")
        return None, None
        
    address = f"{college_name}, {city}, {state}, India"
    url = f"https://api.geoapify.com/v1/geocode/search?text={address}&apiKey={GEOAPIFY_API_KEY}"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        if data.get('features'):
            lon, lat = data['features'][0]['geometry']['coordinates']
            print(f"SUCCESS: Found coordinates for {college_name}, {city}: ({lat}, {lon})")
            return lat, lon
        else:
            print(f"WARNING: Could not find coordinates for {college_name}, {city}. Response: {data}")
            return None, None
    except Exception as e:
        print(f"ERROR: An error occurred for {college_name}, {city}: {e}")
        return None, None

# --- MAIN SCRIPT LOGIC ---

# 1. RESUME LOGIC: Check if a progress file exists
if PROGRESS_CSV_PATH.exists():
    print("Resuming from progress file...")
    df = pd.read_csv(PROGRESS_CSV_PATH)
else:
    print("Starting from scratch. Reading original CSV...")
    try:
        df = pd.read_csv(ORIGINAL_CSV_PATH)
        # Prepare DataFrame for new data
        df['latitude'] = None
        df['longitude'] = None
    except FileNotFoundError:
        print(f"ERROR: The file was not found at {ORIGINAL_CSV_PATH}")
        exit()

# 2. GEOCODING LOOP: Get coordinates for any missing colleges
print("Starting geocoding process (will skip completed entries)...")
for index, row in df.iterrows():
    # Skip rows that are already completed from a previous run
    if pd.notna(row.get('latitude')) and pd.notna(row.get('longitude')):
        continue

    college_name = row[CSV_COL_NAME]
    city = row[CSV_COL_CITY]
    state = row[CSV_COL_STATE]
    
    lat, lon = get_coordinates(college_name, city, state)
    
    if lat and lon:
        df.at[index, 'latitude'] = lat
        df.at[index, 'longitude'] = lon
        
        # Save progress to the file after each successful API call
        df.to_csv(PROGRESS_CSV_PATH, index=False)
    
    time.sleep(0.1)

print("Geocoding complete. Now preparing to insert into the database...")

# 3. DATABASE INSERTION LOOP
db = SessionLocal()
try:
    processed_campuses = set()
    new_campuses_to_add = []

    for index, row in df.iterrows():
        # Skip any row that failed to geocode in the previous run
        if pd.isna(row.get('latitude')):
            continue

        college_name = row[CSV_COL_NAME]
        city = row[CSV_COL_CITY]
        state = row[CSV_COL_STATE]

        # Smart duplicate check for this run
        campus_identifier = (college_name, city, state)
        if campus_identifier in processed_campuses:
            continue

        # Check against the database for campuses from previous runs
        existing_campus = db.query(models.Campus).filter_by(
            name=college_name, city=city, state=state
        ).first()
        if existing_campus:
            continue

        # --- THIS IS THE CORRECTED LOGIC FOR CAMPUS SIZE ---
        campus_size_sq_meters = None # Default to None
        try:
            # Get the raw string value, e.g., "647 Acres"
            size_str = str(row[CSV_COL_CAMPUS_SIZE])
            
            # Clean the string to get just the number
            cleaned_str = size_str.lower().replace("acres", "").replace(",", "").strip()

            # Now, convert the clean number string to a float
            campus_size_acres = float(cleaned_str)
            campus_size_sq_meters = campus_size_acres * ACRES_TO_SQ_METERS
            
        except (ValueError, TypeError):
            # This handles cases where the size is "N/A" or just empty.
            # It will correctly result in campus_size_sq_meters being None.
            pass
        # --- END OF CORRECTED LOGIC ---

        new_campus = models.Campus(
            public_id=uuid.uuid4(),
            name=college_name,
            city=city,
            state=state,
            center_latitude=row['latitude'],
            center_longitude=row['longitude'],
            campus_area_sq_meters=campus_size_sq_meters
        )
        new_campuses_to_add.append(new_campus)
        processed_campuses.add(campus_identifier)

    if new_campuses_to_add:
        print(f"Adding {len(new_campuses_to_add)} new campuses to the database...")
        db.add_all(new_campuses_to_add)
        db.commit()
        print("Commit successful.")
    else:
        print("No new campuses to add. All campuses from the CSV are already in the DB.")

finally:
    db.close()
    print("Seeding Complete. DB session closed.")