const { OpenAI } = require('openai');

const commonSkills = [
    'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'swift', 'typescript', 'php',
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring',
    'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
    'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'ci/cd', 'jenkins', 'terraform',
    'html', 'css', 'sass', 'redux', 'graphql', 'rest api', 'agile', 'scrum',
    'machine learning', 'deep learning', 'nlp', 'tensorflow', 'pytorch', 'data analysis'
];

class ResumeAgent {
    static extractSkillsMock(text) {
        return commonSkills.filter(skill => {
            const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(^|[^a-zA-Z0-9_#\\\\+])${escapedSkill}(?=[^a-zA-Z0-9_#\\\\+]|$)`, 'i');
            return regex.test(text);
        });
    }

    static async analyzeResume(resumeText, targetRole, targetCompany) {
        if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
            console.warn("⚠️ API keys not found. Using fallback mock Resume analysis.");
            return this.analyzeResumeMock(resumeText, targetRole, targetCompany);
        }

        try {
            const prompt = `You are an expert AI recruiter and ATS optimizer.
Analyze the following resume text against the target role "${targetRole || 'General'}" and target company "${targetCompany || 'General'}".
Extract the technical skills present in the resume. Also find any strong action verbs used.
Provide a specific fit analysis (missing skills for the role, suggestions for improvement).
Calculate an ATS optimization score strictly between 0 and 100 based on quantifiable metrics, formatting, and relevance.

Resume Text:
"""
${resumeText.substring(0, 3000)} /* Truncated for safety */
"""

Provide the output strictly as a JSON object matching this schema:
{
  "score": 85,
  "extractedSkills": ["React", "Node", "Python"],
  "foundVerbs": ["architected", "delivered", "spearheaded"],
  "improvements": [
    "Quantify your achievements.",
    "Add more keywords related to Azure for Microsoft."
  ],
  "companyAnalysis": {
    "company": "${targetCompany || 'General'}",
    "matchingSpecs": ["React", "Node"],
    "missingSpecs": ["TypeScript", "GraphQL"]
  },
  "summary": "Highly ATS Optimized"
}`;

            let content = '';
            if (process.env.OPENAI_API_KEY) {
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                const response = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 800,
                    temperature: 0.3,
                });
                content = response.choices[0].message.content.trim();
            } else if (process.env.GEMINI_API_KEY) {
                const { GoogleGenerativeAI } = require('@google/generative-ai');
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = await model.generateContent(prompt);
                content = result.response.text().trim();
            }

            content = content.replace(/```json/gi, '').replace(/```/g, '').trim();

            const parsed = JSON.parse(content);
            if (parsed.score != null && Array.isArray(parsed.extractedSkills)) {
                return parsed;
            }
            throw new Error("Invalid output format from OpenAI");
        } catch (error) {
            console.error("OpenAI Resume Analysis Error:", error);
            // Fallback to mock on error
            return this.analyzeResumeMock(resumeText, targetRole, targetCompany);
        }
    }

    static analyzeResumeMock(resumeText, targetRole, targetCompany) {
        const textLower = resumeText.toLowerCase();
        let extractedSkills = this.extractSkillsMock(resumeText);
        
        let score = 40; 
        let improvements = [];
        let matchingSpecs = [];
        let missingSpecs = [];

        const actionVerbs = ['managed', 'developed', 'led', 'created', 'designed', 'optimized', 'improved', 'spearheaded', 'architected', 'implemented', 'delivered', 'reduced', 'increased'];
        let foundVerbs = actionVerbs.filter(kw => {
            const regex = new RegExp(`\\b${kw}\\b`, 'i');
            return regex.test(textLower);
        });
        
        score += Math.min(foundVerbs.length * 2, 20); 
        
        if (foundVerbs.length < 4) {
            improvements.push("💡 ATS Tip: Use more impactful action verbs (e.g., 'spearheaded', 'architected', 'optimized').");
        }

        if (!textLower.includes('%') && !textLower.match(/\\d{2,}/) && !textLower.includes('$')) {
            improvements.push("💡 ATS Tip: Quantify your achievements. ATS systems and recruiters look for numbers, metrics, or revenue impact.");
        } else {
            score += 15; 
        }

        if (targetRole) {
            const roleTokens = targetRole.toLowerCase().split(' ');
            let roleMatch = roleTokens.filter(token => {
                if (token.length <= 2) return false;
                const regex = new RegExp(`\\b${token}\\b`, 'i');
                return regex.test(textLower);
            });
            if (roleMatch.length === 0) {
                improvements.push(`💡 Role Fit: We didn't find keywords closely related to your target role '${targetRole}'.`);
            } else {
                score += 15;
            }
        } else {
            score += 10; 
        }

        if (targetCompany) {
            improvements.push(`🏢 Company Tip: Research ${targetCompany}'s tech stack and incorporate it.`);
            score += 10; 
        } else {
            score += 10; 
        }

        if (score > 100) score = 100;
        if (score < 0) score = 0;

        return {
            score: Math.round(score),
            extractedSkills,
            foundVerbs,
            improvements,
            companyAnalysis: targetCompany ? { company: targetCompany, matchingSpecs: [], missingSpecs: [] } : null,
            summary: score >= 85 ? 'Highly ATS Optimized 🔥' : (score >= 65 ? 'Good, Needs Fine-Tuning 👍' : 'Needs Significant Improvement 📉')
        };
    }
}

module.exports = ResumeAgent;
