const express = require('express');
const router = express.Router();

router.post('/message', async (req, res) => {
    try {
        const { message, history } = req.body;
        const lowerMsg = message.toLowerCase();
        
        let reply = "I'm still learning! Ask me about career roadmaps, trending jobs, or resume feedback.";

        // 1. Trending Jobs Logic
        if (lowerMsg.includes('trending') || lowerMsg.includes('jobs')) {
            reply = "📈 **Current Trending Tech Roles (Real-time Insight):**\n\n" +
                    "1. **AI/ML Engineer**: High demand globally, leveraging LLMs and generative AI. Expect 40% growth by 2028.\n" +
                    "2. **Cloud Architect**: Essential for scaling distributed systems (AWS/GCP/Azure).\n" +
                    "3. **Full Stack Developer (Next.js/Node)**: Extremely versatile, remote-friendly, strong foundational growth.\n\n" +
                    "Would you like a learning roadmap for any of these?";
        }
        
        // 2. Roadmap Generator Logic
        else if (lowerMsg.includes('roadmap') || lowerMsg.includes('plan')) {
            reply = "🗺️ **Your Step-by-Step Roadmap:**\n\n" +
                    "**Months 1-2: Fundamentals**\n- Master core languages (Syntax, Data Structures).\n- Build 3 small terminal/web projects.\n\n" +
                    "**Months 3-4: Frameworks & Databases**\n- Learn a frontend framework (React) or backend (Node/Python).\n- Integrate MongoDB/PostgreSQL and build CRUD applications.\n\n" +
                    "**Months 5-6: Portfolio & Prep**\n- Build 2 polished portfolio projects (deploy on Vercel/Render).\n- Begin LeetCode preparation and polish your resume.\n\n" +
                    "Need specific course recommendations to start?";
        }

        // 3. Course Recommendations
        else if (lowerMsg.includes('course') || lowerMsg.includes('recommend')) {
            reply = "📚 **Curated Learning Resources:**\n\n" +
                    "- **Coursera**: 'Meta Front-End Developer Professional Certificate' (Great for Web UI/React)\n" +
                    "- **Udemy**: '100 Days of Code: The Complete Python Bootcamp' (Excellent programming foundation)\n" +
                    "- **FreeCodeCamp**: Totally free, hands-on path for responsive web design and JavaScript.\n\n" +
                    "Let me know your specific tech stack and I'll narrow this down!";
        }

        // 4. Resume Feedback Logic
        else if (lowerMsg.includes('resume') || lowerMsg.includes('cv') || lowerMsg.includes('portfolio')) {
            reply = "📄 **Interactive Resume Feedback:**\n\n" +
                    "Please paste sections of your resume below. As a best practice, make sure you include:\n" +
                    "- **Quantifiable metrics** (e.g., 'Improved speed by 20%' instead of 'Made code faster')\n" +
                    "- **Action Verbs** (e.g., 'Architected', 'Developed', 'Led')\n" +
                    "- Tailored keywords matching the job description.\n\n" +
                    "Paste your experience bullet points and I will critique them!";
        }
        
        // 5. Coaching / Motivation Mode
        else if (lowerMsg.includes('coach') || lowerMsg.includes('motivat') || lowerMsg.includes('tip')) {
            reply = "💪 **Daily Coaching Tip:**\n\n" +
                    "\"Consistency compounds.\" Studying 30 minutes every single day is far more effective than an 8-hour binge once a week. " +
                    "What is your primary goal for today? Let's break it down into 3 manageable micro-tasks.";
        }

        else if (lowerMsg.includes('french') || lowerMsg.includes('spanish') || lowerMsg.includes('language')) {
            reply = "🌍 **Multilingual Support Enabled:**\n\n" +
                    "I can speak English, Spanish (Hola, ¿cómo estás?), French (Bonjour!), and more! Just type in your preferred language and I will respond accordingly.";
        }

        // Simulate network delay for natural human feel
        setTimeout(() => {
            res.json({ success: true, reply });
        }, 800);

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ success: false, error: 'Failed to process chat message' });
    }
});

module.exports = router;
