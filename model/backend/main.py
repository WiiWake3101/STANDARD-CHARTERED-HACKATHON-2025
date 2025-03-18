from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF for PDF text extraction
import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
OPENROUTER_API_KEY = "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"
UPLOAD_DIR = "uploads"

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Function to extract text from PDF
def extract_text_from_pdf(file_path):
    """Extracts text from a PDF file."""
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        doc = fitz.open(file_path)
        text = "\n".join(page.get_text("text") for page in doc)
        doc.close()
        return text.strip() or "No text extracted"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF processing error: {str(e)}")

# Upload PDF endpoint
@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """Handles PDF upload and saves it."""
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save the file
    with open(file_path, "wb") as f:
        while chunk := await file.read(1024 * 1024):  # Read in chunks
            f.write(chunk)

    return {"filename": file.filename}

# Query the document using OpenRouter
@app.get("/query")
async def query_document(filename: str = Query(...)):
    """Handles querying extracted text from a document."""
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Extract text
    extracted_text = extract_text_from_pdf(file_path)

    # Your financial analysis query
    full_query = (
        f"Based on the extracted financial data, provide a detailed monthly summary of the following:\n"
        f"1. Total monthly deposits\n"
        f"2. Total monthly withdrawals\n"
        f"3. Recurring payments\n"
        f"4. Other noticeable spending habits\n\n"
        f"Based on this information, analyze whether the individual is eligible for a loan.\n"
        f"Highlight:\n"
        f"- Potential loan decision (if possible)\n"
        f"- Evidence\n"
        f"- Red flags\n"
        f"- Positive signs\n"
        f"\nExtracted Text:\n{extracted_text}"
    )

    # Query OpenRouter
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}", "Content-Type": "application/json"},
        json={"model": "google/gemma-3-1b-it:free", "messages": [{"role": "user", "content": full_query}]}
    )
    
    return {"response": response.json().get("choices", [{}])[0].get("message", {}).get("content", "No response")}