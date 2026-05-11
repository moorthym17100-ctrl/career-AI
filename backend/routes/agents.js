const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const InterviewAgent = require('../ai-agents/InterviewAgent');
const ResumeAgent = require('../ai-agents/ResumeAgent');
const OpportunityAgent = require('../ai-agents/OpportunityAgent');
const User = require('../models/User');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const upload = multer({ storage: multer.memoryStorage() });
// @route POST /api/agents/interview/generate
router.post('/interview/generate', auth, async (req, res) => {
    try {
        const { role, experience } = req.body;
        const questions = await InterviewAgent.generateQuestions(role || 'developer', experience || 'beginner');
        res.json({ success: true, questions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// @route POST /api/agents/interview/feedback
router.post('/interview/feedback', auth, async (req, res) => {
    try {
        const { answers, questions, role, experience } = req.body;
        const result = await InterviewAgent.processMockInterview(answers || [], questions || [], role, experience);
        res.json({ success: true, ...result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// @route POST /api/agents/resume/analyze
router.post('/resume/analyze', auth, upload.single('resumeFile'), async (req, res) => {
    try {
        let resumeText = req.body.resumeText || '';
        const { targetRole, targetCompany } = req.body;
        
        if (req.file && req.file.mimetype === 'application/pdf') {
            const pdfData = await pdfParse(req.file.buffer);
            resumeText = pdfData.text;
        } else if (req.file && req.file.mimetype === 'text/plain') {
            resumeText = req.file.buffer.toString('utf8');
        }

        if (!resumeText.trim()) {
            return res.status(400).json({ success: false, error: 'No resume text or file provided' });
        }

        const analysis = await ResumeAgent.analyzeResume(resumeText, targetRole || '', targetCompany || '');
        res.json({ success: true, data: analysis });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// @route POST /api/agents/resume/save
router.post('/resume/save', auth, async (req, res) => {
    try {
        const { resumeData } = req.body;
        if (require('mongoose').connection.readyState !== 1) {
            global.mockResumes = global.mockResumes || {};
            global.mockResumes[req.user.id] = resumeData;
            return res.json({ success: true, message: 'Resume saved securely! ✅ (Mock local)' });
        }
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        
        user.savedResume = resumeData;
        await user.save();
        res.json({ success: true, message: 'Resume saved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// @route GET /api/agents/resume/load
router.get('/resume/load', auth, async (req, res) => {
    try {
        if (require('mongoose').connection.readyState !== 1) {
            global.mockResumes = global.mockResumes || {};
            return res.json({ success: true, resumeData: global.mockResumes[req.user.id] || {} });
        }
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        
        res.json({ success: true, resumeData: user.savedResume || {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// @route POST /api/agents/opportunities
router.post('/opportunities', auth, async (req, res) => {
    try {
        let profile = { skills: [] };
        
        if (require('mongoose').connection.readyState === 1) {
            try {
                const user = await User.findById(req.user.id);
                if (user && user.skills) {
                    profile.skills = user.skills;
                }
            } catch (authErr) {
                console.log('MongoDB User find sync issue, proceeding with mock skills', authErr.message);
            }
        }
        
        // If skills from body provided, override
        if (req.body.skills && req.body.skills.length > 0) {
            profile.skills = req.body.skills;
        }

        try {
            const axios = require('axios');
            const flaskRes = await axios.get('http://127.0.0.1:5001/api/jobs?limit=10');
            if (flaskRes.data.success) {
                const mappedOpps = flaskRes.data.opportunities.map(o => ({
                    ...o,
                    title: o.role,
                    type: o.job_type,
                    matchPercentage: o.match_score
                }));
                return res.json({ success: true, opportunities: mappedOpps });
            }
        } catch (flaskErr) {
            console.error('Error connecting to Flask API for opportunities, falling back to mock:', flaskErr.message);
        }

        const opportunities = OpportunityAgent.findOpportunities(profile);
        res.json({ success: true, opportunities });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// @route POST /api/agents/resume/enhance
router.post('/resume/enhance', auth, async (req, res) => {
    try {
        const { text, type } = req.body;
        if (!text) return res.status(400).json({ success: false, error: 'No text provided' });
        const enhancedText = await ResumeAgent.enhanceContent(text, type || 'content');
        res.json({ success: true, enhancedText });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
