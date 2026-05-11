const { OpenAI } = require('openai');

class InterviewAgent {
    static async generateQuestions(role, experience) {
        if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
            console.warn("⚠️ API keys not found. Using fallback mock questions.");
            return this.getMockQuestions(role, experience);
        }

        try {
            const prompt = `You are an expert technical interviewer. Generate exactly 4 distinct, challenging interview questions for a ${experience} level ${role}. 
The questions should test both deep technical knowledge and problem-solving skills.
Return ONLY a valid JSON array of 4 strings representing the questions, with no other formatting or markdown.`;

            let content = '';
            if (process.env.OPENAI_API_KEY) {
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                const response = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 300,
                    temperature: 0.7,
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
            
            const questions = JSON.parse(content);
            if (Array.isArray(questions) && questions.length > 0) {
                return questions.slice(0, 4);
            }
            throw new Error("Invalid format returned by OpenAI");
        } catch (error) {
            console.error("OpenAI Question Generation Error:", error);
            // Fallback to mock on error
            return this.getMockQuestions(role, experience);
        }
    }

    static getMockQuestions(role, experience) {
        let questions = [];
        const normalizedRole = role.toLowerCase();
        
        if (normalizedRole.includes('front') || normalizedRole.includes('ui')) {
            questions.push('How do you manage state in a complex React application?');
            questions.push('Can you explain the virtual DOM and how it improves performance?');
        } else if (normalizedRole.includes('back') || normalizedRole.includes('node') || normalizedRole.includes('api')) {
            questions.push('How do you design a scalable architecture for a REST API?');
            questions.push('What are the strategies you use to handle database transactions and avoid race conditions?');
        } else {
            questions.push(`Tell me about a time you leveraged your skills as a ${role} to solve a complex problem.`);
            questions.push('What are the core metrics you track to ensure success in your role?');
        }

        if (experience === 'beginner') {
            questions.push('What is the most challenging bug you faced and how did you debug it?');
            questions.push('How do you keep your technical skills sharp?');
        } else {
            questions.push('Describe a situation where you disagreed with a colleague on technical direction. How did you resolve it?');
            questions.push('How do you balance technical debt with the need to ship features quickly?');
        }
        
        return questions;
    }

    static async processMockInterview(answers, questions, role, experience) {
        if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
            console.warn("⚠️ API keys not found. Using fallback mock feedback.");
            return this.getMockFeedback(answers, questions, role, experience);
        }

        try {
            const interviewData = questions.map((q, i) => ({
                Question: q,
                Answer: answers[i] || ""
            }));

            const prompt = `You are a strict but fair technical interviewer evaluating a ${experience} level ${role}.
Review the candidate's answers below:
${JSON.stringify(interviewData, null, 2)}

Provide detailed, constructive feedback for each answer. If an answer is blank or too short, deduct points and mention it.
Grade the overall interview out of 100.
Return ONLY a valid JSON object matching exactly this schema:
{
  "feedback": ["feedback for Q1", "feedback for Q2", ...],
  "finalScore": 85,
  "tips": "Overall tip to improve"
}`;

            let content = '';
            if (process.env.OPENAI_API_KEY) {
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                const response = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 600,
                    temperature: 0.5,
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
            if (parsed.feedback && parsed.finalScore != null && parsed.tips) {
                return parsed;
            }
            throw new Error("Invalid feedback format from OpenAI");
        } catch (error) {
            console.error("OpenAI Feedback Generation Error:", error);
            return this.getMockFeedback(answers, questions, role, experience);
        }
    }

    static getMockFeedback(answers, questions, role, experience) {
        let feedback = [];
        let score = 0;
        const targetWordCount = experience === 'beginner' ? 30 : 60; 

        answers.forEach((ans, idx) => {
            const wordCount = ans.split(' ').length;
            let qScore = 0;
            
            if (ans.trim().length === 0) {
                feedback.push(`Question ${idx + 1}: No answer provided. In a real interview, doing your best to attempt an answer is better than silence.`);
                return;
            }

            let qFeedback = `Question ${idx + 1}: `;

            if (wordCount < 15) {
                qFeedback += `Your answer is too short (${wordCount} words). Try to provide more context. `;
                qScore += 2;
            } else if (wordCount < targetWordCount) {
                qFeedback += `Good start, but you could elaborate more. `;
                qScore += 6;
            } else {
                qFeedback += `Great depth in your answer. `;
                qScore += 10;
            }

            qScore = Math.min(qScore, 10);
            score += qScore;
            feedback.push(qFeedback.trim());
        });

        const maxPossible = answers.length * 10;
        const totalScore = answers.length > 0 ? (score / maxPossible) * 100 : 0;
        
        let tips = "Remember to follow up with questions for your interviewer.";
        if (totalScore < 50) tips = "You need to practice providing more detailed, concrete examples from your past experience.";
        else if (totalScore < 80) tips = "Solid effort! Focus on structuring your answers and including quantified achievements.";
        else tips = "Outstanding! You demonstrate strong articulation and depth of experience.";

        return {
            feedback,
            finalScore: Math.round(totalScore),
            tips
        };
    }
}

module.exports = InterviewAgent;
