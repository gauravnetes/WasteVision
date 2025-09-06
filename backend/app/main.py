from fastapi import FastAPI

app = FastAPI(title="WasteVision API")

@app.get("/")
def read_root():
    return {"message": "WasteVision Backend is running 🚀"}

@app.get("/health")
def health_check():
    return {"status": "ok"}