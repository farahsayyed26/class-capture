import os
import json
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image
import io

# 1. Load the Secure API Key
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("No API Key found! Did you create the .env file?")

# 2. Configure Gemini AI
genai.configure(api_key=API_KEY)

# 3. Initialize the App
app = FastAPI()

# Allow your React Frontend to talk to this Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- THE AI PROMPT ---
# This instruction tells the AI exactly what to do with the image.
SYSTEM_PROMPT = """
You are an expert AI tutor. Analyze the provided image (which may be handwritten notes, a whiteboard, or a textbook page).
Extract the key concepts and return a JSON object with exactly two fields:

1. "summary": A concise, bullet-point summary of the content (use emojis for bullet points).
2. "quiz": An array of 3 multiple-choice questions based on the content.

The JSON format must be strictly:
{
  "summary": "String with bullet points...",
  "quiz": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "The correct option text"
    }
  ]
}
IMPORTANT: Return ONLY raw JSON. Do not use Markdown formatting like ```json.
"""

@app.get("/")
def home():
    return {"status": "Backend is running", "ai_model": "Gemini 1.5 Flash"}

@app.post("/upload")
async def analyze_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        prompt = """
        You are an expert AI Tutor. Analyze this image of study notes.
        1. Create a concise 'summary' (max 4 sentences).
        2. Create a 'quiz' with 3 multiple-choice questions.
        IMPORTANT: Return RAW JSON ONLY. No Markdown. No backslashes.
        Format: {"summary": "...", "quiz": [{"question": "...", "options": [], "answer": "..."}]}
        """

        # --- 1. SMART AUTO-DISCOVERY ---
        print("🔍 Scanning for available models...")
        available_models = []
        try:
            # Get all models that support generating content
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    name = m.name.replace("models/", "")
                    available_models.append(name)
        except Exception as e:
            print(f"⚠️ Could not list models: {e}")
            # Fallback list if discovery fails
            available_models = ["gemini-flash-latest", "gemini-1.5-flash-latest", "gemini-pro-latest"]

        # Sort to prefer "Flash" and "1.5" (Fastest & Most Reliable) first
        # We want to avoid "Pro" or "Exp" if possible to avoid limits
        available_models.sort(key=lambda x: "flash" not in x) 
        
        print(f"📋 Found models: {available_models[:5]}...") # Print top 5

        # --- 2. LOOP: Try found models ---
        last_error = None
        
        for model_name in available_models:
            # Skip the ones we KNOW are blocked based on your logs
            if "2.0" in model_name or "exp" in model_name: 
                continue

            print(f"🔄 Trying model: {model_name}...")
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content([prompt, image])
                
                print(f"✅ SUCCESS using: {model_name}")
                
                # CLEAN UP RESPONSE
                raw_text = response.text
                clean_text = raw_text.replace("```json", "").replace("```", "").strip()
                if "\\" in clean_text: clean_text = clean_text.replace("\\", "\\\\")
                
                return json.loads(clean_text)

            except Exception as e:
                # If it's a "Not Found" or "Limit" error, just try the next one
                print(f"⚠️ Failed ({model_name}): {str(e)}")
                last_error = e
                continue 

        print("❌ ALL MODELS FAILED.")
        raise HTTPException(status_code=500, detail=f"All models failed. Last error: {str(last_error)}")

    except Exception as e:
        print(f"❌ CRITICAL ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)