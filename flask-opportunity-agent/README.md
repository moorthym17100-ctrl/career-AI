# AI Opportunity Agent

This standalone module provides the **Opportunity Agent** feature for your AI academic and career assistant, built with a Flask backend and a vanilla HTML/JS frontend, as requested.

## Features Included:
- **Resume Upload**: Upload `.pdf` or `.txt` resumes.
- **Skill Extraction**: Text processing extracts known technical skills (e.g., Python, React, SQL, AWS) from the resume.
- **Job Matching**: Matches extracted skills against a structured job/internship database.
- **Scoring System**: Calculates a match percentage based on the intersection of user skills and required skills.
- **Aesthetic UI**: A modern, glassmorphism-inspired UI with dynamic animations to give a premium feel.

## How to Run This Application

### 1. Setup the Backend (Flask)
Open a terminal and navigate to the `flask-opportunity-agent\backend` folder:
```bash
cd "c:\Users\ELCOT\Documents\career AI\flask-opportunity-agent\backend"
```

Install the dependencies:
```bash
pip install -r requirements.txt
```

Run the server:
```bash
python app.py
```
*(The server will start on `http://127.0.0.1:5001` or `http://localhost:5001`)*

### 2. Run the Frontend
Simply double-click the `index.html` file located in `flask-opportunity-agent\frontend\index.html` to open it in your browser.

Alternatively, you can serve it via Python:
```bash
cd "c:\Users\ELCOT\Documents\career AI\flask-opportunity-agent\frontend"
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

## Integration Note
If you want to plug this back into your **React + Node.js** `career AI` ecosystem later, you have two options:
1. **Microservice Approach**: Keep this Flask server running on port `5001` and call its `api/upload-resume` endpoint directly from your React frontend using `fetch`.
2. **Port Logic**: Translate the Python extraction logic into `OpportunityAgent.js` and `ResumeAgent.js` on your Node server.
