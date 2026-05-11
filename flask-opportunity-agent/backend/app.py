from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import io
import re
import numpy as np

app = Flask(__name__)
CORS(app)

JOB_DATABASE = [
    {
        "id": 1,
        "company": "Tech Innovators Inc.",
        "role": "Frontend Developer",
        "description": "Looking for a skilled frontend developer with JavaScript, React, HTML, CSS and UI/UX experience to build scalable applications.",
        "required_skills": ["javascript", "react", "html", "css", "ui/ux"],
        "job_type": "full-time"
    },
    {
        "id": 2,
        "company": "DataWorks LLC",
        "role": "Data Science Intern",
        "description": "Internship for data enthusiasts. Work with python, sql, machine learning, pandas and perform data analysis on large datasets.",
        "required_skills": ["python", "sql", "machine learning", "pandas", "data analysis"],
        "job_type": "internship"
    },
    {
        "id": 3,
        "company": "CloudScape",
        "role": "Backend Engineer",
        "description": "Backend engineer needed. Must be proficient in Python, Flask, Django, SQL, APIs, and Node.js to build cloud infrastructure.",
        "required_skills": ["python", "flask", "django", "sql", "api", "node.js"],
        "job_type": "full-time"
    },
    {
        "id": 4,
        "company": "Startup Hub",
        "role": "Full Stack Intern",
        "description": "Join our startup as a full stack intern! Work with JavaScript, React, Node.js, MongoDB, and HTML.",
        "required_skills": ["javascript", "react", "node.js", "mongodb", "html"],
        "job_type": "internship"
    },
    {
        "id": 5,
        "company": "FinTech Secure",
        "role": "Security Analyst",
        "description": "Cybersecurity role. Need strong network, python, linux and security skills to protect our financial systems.",
        "required_skills": ["cybersecurity", "network", "python", "linux", "security"],
        "job_type": "full-time"
    }
]

KNOWN_SKILLS = [
    "python", "java", "javascript", "c++", "c#", "ruby", "php", "sql", "html", "css",
    "react", "angular", "vue", "node.js", "express", "flask", "django", "spring",
    "machine learning", "data analysis", "pandas", "numpy", "tensorflow", "pytorch",
    "aws", "azure", "gcp", "docker", "kubernetes", "linux", "cybersecurity", "network",
    "ui/ux", "mongodb", "postgresql", "mysql", "api"
]

try:
    from sentence_transformers import SentenceTransformer
    import faiss
    embedder = None
    index = None

    def initialize_faiss():
        global embedder, index
        print("Initializing FAISS embeddings...")
        embedder = SentenceTransformer('all-MiniLM-L6-v2')
        descriptions = [job['description'] for job in JOB_DATABASE]
        job_embeddings = embedder.encode(descriptions, convert_to_numpy=True)
        dimension = job_embeddings.shape[1]
        
        # Use exact search 
        index = faiss.IndexFlatL2(dimension)
        # Normalize for cosine similarity
        faiss.normalize_L2(job_embeddings)
        index.add(job_embeddings)
        print("FAISS initialized successfully.")

    # Lazy init or pre-init ok
    initialize_faiss()
    HAS_FAISS = True
except Exception as e:
    print(f"FAISS/SentenceTransformers not available. Using fallback exact match. Error: {e}")
    HAS_FAISS = False

def extract_text_from_pdf(file_stream):
    try:
        reader = PyPDF2.PdfReader(file_stream)
        text = ""
        for page in reader.pages:
            if page.extract_text():
                text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def extract_skills(text):
    text_lower = text.lower()
    found_skills = set()
    for skill in KNOWN_SKILLS:
        escaped_skill = re.escape(skill)
        pattern = r'(?<![a-z0-9])' + escaped_skill + r'(?![a-z0-9])'
        if re.search(pattern, text_lower):
            found_skills.add(skill)
    return list(found_skills)

def calculate_match_score(user_skills, required_skills):
    if not required_skills:
        return 0
    matched = set(user_skills).intersection(set(required_skills))
    score = (len(matched) / len(required_skills)) * 100
    return round(score)

@app.route('/api/upload-resume', methods=['POST'])
def upload_resume():
    try:
        if 'resume' not in request.files:
            return jsonify({"error": "No resume file provided."}), 400
            
        file = request.files['resume']
        
        if file.filename == '':
            return jsonify({"error": "No selected file."}), 400
            
        filename = file.filename.lower()
        text = ""
        
        if filename.endswith('.pdf'):
            text = extract_text_from_pdf(file)
        elif filename.endswith('.txt'):
            text = file.read().decode('utf-8')
        else:
            return jsonify({"error": "Unsupported file format. Please upload a PDF or TXT file."}), 400
            
        if not text.strip():
            return jsonify({"error": "Could not extract text from the file or file is empty."}), 400
            
        extracted_skills = extract_skills(text)
        opportunities = []

        if HAS_FAISS and embedder and index:
            user_embedding = embedder.encode([text], convert_to_numpy=True)
            faiss.normalize_L2(user_embedding)
            D, I = index.search(user_embedding, k=len(JOB_DATABASE))
            
            for i, idx in enumerate(I[0]):
                job = JOB_DATABASE[idx]
                distance = D[0][i]
                similarity = (2.0 - distance) / 2.0  # approximate conversion to 0-1 range
                score = min(max(round(similarity * 100) + 15, 0), 100) # boosted for aesthetics
                opportunities.append({
                    "company": job['company'],
                    "role": job['role'],
                    "required_skills": job['required_skills'],
                    "job_type": job['job_type'],
                    "match_score": int(score)
                })
        else:
            # Fallback
            for job in JOB_DATABASE:
                score = calculate_match_score(extracted_skills, job['required_skills'])
                opportunities.append({
                    "company": job['company'],
                    "role": job['role'],
                    "required_skills": job['required_skills'],
                    "job_type": job['job_type'],
                    "match_score": score
                })
            opportunities.sort(key=lambda x: x['match_score'], reverse=True)
        
        return jsonify({
            "success": True,
            "extracted_skills": extracted_skills,
            "opportunities": opportunities
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": "An internal server error occurred."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
