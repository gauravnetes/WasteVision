# 🗑️ WasteVision

**WasteVision** is a smart waste detection and monitoring system.  
It uses **YOLOv8** for detecting and classifying different categories of waste in campus/public areas.  
The project aims to combine **AI-based detection** with **3D depth estimation (MiDaS)** for real-world waste volume measurement.  
Ultimately, WasteVision will power a **full-stack application** (FastAPI backend + Next.js frontend) for campus administrators and municipal authorities to manage waste efficiently.


## 🚀 Features
- 🔍 **Waste Detection** – Train a YOLOv8 model on a custom waste dataset (Roboflow annotated).
- ♻️ **Multi-class Classification** – Detects hazardous waste, kitchen waste, recyclable waste, and others.
- 🖼️ **Inference on Images** – Run detection on campus images and save results with bounding boxes.
- 📊 **Metrics Tracking** – Training logs include precision, recall, mAP, and loss curves.
- 🧮 **Future (3D Estimation)** – Use MiDaS to estimate waste area and volume from images.
- 📡 **Future (Deployment)** – Deploy as a web app with FastAPI backend & Next.js frontend.

---

## 📂 Project Structure
```

waste-vision/
│── dataset/             # Training dataset (train/valid/test + data.yaml)
│   ├── train/images
│   ├── train/labels
│   ├── valid/images
│   ├── valid/labels
│   ├── test/images
│   ├── test/labels
│   └── data.yaml
│
│── notebooks/
│   └── WasteVision\_YOLOv8.ipynb   # Colab notebook for training & testing
│
│── runs/                # YOLOv8 training results (auto-generated)
│── results/             # Inference results (auto-generated)
│── test\_images/         # Campus images for detection testing
│
│── backend/             # (Future) FastAPI backend
│── frontend/            # (Future) Next.js frontend
│── README.md            # Documentation

````

---

## 📊 Dataset
The dataset is collected and annotated via **Roboflow**.

- **Classes (nc=4):**
  - `hazardous waste`
  - `kitchen waste`
  - `other waste`
  - `recyclable waste`

- Example `data.yaml`:
```yaml
# Waste Vision YOLOv8 dataset config

path: /content/drive/MyDrive/WASTE VISION/dataset  # base dataset folder

train: train/images
val: valid/images
test: test/images

nc: 4
names: ['hazardous waste', 'kitchen waste', 'other waste', 'recyclable waste']

````

---

## 🛠️ Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/waste-vision.git
cd waste-vision
```

Install dependencies:

```bash
pip install ultralytics
```

(Optional) If using Google Colab:

* Mount Google Drive
* Place dataset in `MyDrive/WASTE VISION/dataset/`
* Open `notebooks/WasteVision_YOLOv8.ipynb`

---

## 🏋️ Training YOLOv8

In **Colab** or locally:

```python
from ultralytics import YOLO

# Load pretrained YOLOv8 model
model = YOLO("yolov8s.pt")

# Train
model.train(
    data="dataset/data.yaml",
    epochs=50,
    imgsz=640,
    batch=16,
    project="runs",
    name="exp1"
)
```

* Trained model: `runs/exp1/weights/best.pt`
* Logs: `runs/exp1/`

---

## 🔍 Inference

Run detection on an image:

```python
from ultralytics import YOLO

model = YOLO("runs/exp1/weights/best.pt")
results = model.predict("test_images/campus1.jpg", save=True, conf=0.5)
```

Results are saved in:

```
results/detections/
```

Batch detection:

```python
results = model.predict("test_images", save=True, conf=0.5)
```

---

## 📈 Metrics & Visualization

YOLOv8 generates metrics automatically:

* Precision
* Recall
* mAP\@0.5
* mAP\@0.5:0.95
* Loss curves

Example plotting in Colab:

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("runs/exp1/results.csv")

plt.plot(df['epoch'], df['metrics/precision(B)'], label="Precision")
plt.plot(df['epoch'], df['metrics/recall(B)'], label="Recall")
plt.plot(df['epoch'], df['metrics/mAP50(B)'], label="mAP@0.5")
plt.legend()
plt.show()
```

---

## 🔄 Resuming Training

If training stops (e.g., Colab disconnects), resume from last checkpoint:

```python
from ultralytics import YOLO
model = YOLO("runs/exp1/weights/last.pt")
model.train(resume=True)
```

---

## 📌 Roadmap

* [x] Dataset preparation (Roboflow)
* [x] Train YOLOv8 on waste dataset
* [x] Run inference on campus images
* [x] Save results in Drive
* [ ] Add segmentation support
* [ ] Integrate MiDaS for depth & volume estimation
* [ ] Build FastAPI backend
* [ ] Build Next.js frontend dashboard
* [ ] Deploy as full-stack application

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch (`feature-branch`)
3. Commit changes
4. Push and open a PR

---

## 👥 Contributors

* **Your Name** – Lead Developer
* Team Members – Dataset collection, testing, documentation

---

## 📜 License

This project is licensed under the **MIT License** – free to use and modify.


