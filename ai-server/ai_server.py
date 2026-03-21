from fastapi import FastAPI, UploadFile, File
from PIL import Image
from transformers import pipeline
import io

app = FastAPI()

classifier = pipeline(
    "image-classification",
    model="nateraw/food"
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    result = classifier(image)[0]

    return {
        "food": result["label"],
        "confidence": result["score"]
    }