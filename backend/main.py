import os
import json
import io
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image

# 1. Load Environment Variables
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini
if API_KEY:
    genai.configure(api_key=API_KEY)
else:
    print("❌ ERROR: GEMINI_API_KEY is missing from environment variables!")

app = FastAPI()

# 2. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "status": "Backend is running",
        "platform": "Google Cloud Run",
        "ai_model": "Gemini 1.5 Flash",
        "port_assigned": os.environ.get("PORT", "8080")
    }

@app.post("/upload")
async def analyze_image(file: UploadFile = File(...)):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured on server.")

    try:
        # Read the uploaded image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Define the Prompt
        prompt = """
        You are an expert AI Tutor. Analyze this image of study notes.
        1. Create a concise 'summary' (max 4 sentences).
        2. Create a 'quiz' with 3 multiple-choice questions.
        3. Provide the correct answer for each question.

        IMPORTANT: Return RAW JSON ONLY. No Markdown, no backticks, no code blocks.
        Format: {"summary": "...", "quiz": [{"question": "...", "options": [], "answer": "..."}]}
        """

        # Using Gemini 1.5 Flash
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content([prompt, image])
        
        # Clean the response text
        raw_text = response.text
        clean_text = raw_text.replace("```json", "").replace("```", "").strip()
        
        return json.loads(clean_text)

    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI Analysis failed: {str(e)}")

# 3. PRODUCTION STARTUP LOGIC
# This ensures the app listens to the exact PORT Google Cloud Run provides
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, log_level="info")
