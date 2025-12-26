# class-capture
A professional tool for capturing, organizing, and managing classroom lectures and digital notes.
## Project Description

Class-Capture is an intelligent EdTech platform designed to bridge the gap between static classroom whiteboard photos and active learning using Google Gemini AI. By leveraging advanced vision models, the system converts messy, unorganized lecture snapshots into structured digital notes and actionable summaries. Beyond simple digitization, it ensures material mastery by automatically generating interactive practice quizzes and flashcards directly from the captured content. All data is securely hosted on a centralized Firebase cloud workspace, transforming buried gallery images into a searchable and accessible academic knowledge base.
## Table of Content 
* [About the Project](#-about-the-project)
* [The Problem Statement](#-the-problem-statement)
* [Key Features](#-key-features)
* [Technology Stack](#-technology-stack)
* [System Architecture](#-system-architecture)
* [Future Roadmap](#-future-roadmap)
* [Getting Started](#-getting-started)
## Problem Statement 
Modern students capture thousands of whiteboard photos, yet these valuable insights often die in the smartphone gallery, buried under personal media.
## Key Features
* Intelligent Capture: High-fidelity OCR specifically tuned for classroom environments and diverse handwriting styles.
* AI Summarization: Instant extraction of key concepts using Gemini 1.5 Flash.
* Interactive Quizzes: Automated generation of practice questions to ensure material mastery.
* Cloud Workspace: Centralized storage hosted on Firebase for easy access.
## Technology Stack
* Frontend: React.js, Tailwind CSS, Framer Motion.
* Backend: Python, FastAPI, Axios.
* AI Engine: Google Gemini 1.5 Pro & Flash.
* Database: Firebase Authentication & Firestore.
## System Architechture 
The project uses a decoupled architecture where a React dashboard sends data via secure POST requests to a FastAPI gateway, which then queries Google Gemini models based on the current load.
## Installation & Setup
1 Prerequisites
* VS Code (Recommended Editor) 
* Python 3.9+ (For the Backend) 
* Node.js & npm (For the Frontend)
   
2 Clone the Repository
* code: git clone https://github.com/your-username/class-capture.git

   cd class-capture

3 Backend Setup(FastAPI)
* Open the project folder in VS Code.
* Open a new terminal in VS Code and navigate to the backend directory: (cd backend)
* Create a virtual environment: (python -m venv venv)
* Activate the virtual environment:

  (Windows: venv\Scripts\activate)

  (Mac/Linux: source venv/bin/activate)
* Install dependencies: (pip install -r requirements.txt)
* Start the backend server: (uvicorn main:app --reload)

4 Frontend Setup (React)
* Open a second terminal in VS Code (Keep the backend running).
* Navigate to the frontend directory: (cd my-app)
* Install the necessary packages: (npm install)
* Start the React development server: (npm run dev)

5 Usage
* Once both servers are running, open your browser to http://localhost:3000.
* Drag and drop a whiteboard photo into the "Drop Zone".
* Wait for the Gemini AI to process the notes and generate your quiz.
  
