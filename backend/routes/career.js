const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recommendation = require('../models/Recommendation');
const CareerAdvisor = require('../ai-agents/CareerAdvisor');
const SkillGapAnalyzer = require('../ai-agents/SkillGapAnalyzer');
const JobRecommender = require('../ai-agents/JobRecommender');
const DigitalTwinAgent = require('../ai-agents/DigitalTwinAgent');

router.post('/analyze', async (req, res) => {
    try {
        const { skills, interests, education, experience, name, email } = req.body;
        
        // Create or find user (Optional gracefully fallback if DB is offline)
        let user = null;
        try {
            user = await User.findOne({ email });
            if (!user) {
                user = new User({
                    name,
                    email,
                    skills: skills.split(',').map(s => s.trim()),
                    interests: interests.split(',').map(s => s.trim()),
                    education,
                    experience
                });
                await user.save();
            }
        } catch (dbError) {
            console.warn('MongoDB not available, skipping user save:', dbError.message);
            user = { _id: 'temp-id-no-db' };
        }
        
        // Run 3 AI agents with DYNAMIC inputs
        const careerAdvice = CareerAdvisor.analyze({
            skills: skills.split(',').map(s => s.trim()),
            interests: interests.split(',').map(s => s.trim()),
            education,
            experience
        });
        
        const skillGaps = SkillGapAnalyzer.analyze(
            skills.split(',').map(s => s.trim()),
            interests.split(',').map(s => s.trim())
        );
        
        const jobRecs = JobRecommender.recommend(
            skills.split(',').map(s => s.trim()),
            experience
        );
        
        const digitalTwin = DigitalTwinAgent.simulate({
            skills: skills.split(',').map(s => s.trim()),
            experience: parseInt(experience) || 0
        });
        
        // Save recommendation (Optional gracefully fallback if DB is offline)
        try {
            if (user._id !== 'temp-id-no-db') {
                const recommendation = new Recommendation({
                    userId: user._id,
                    careerPaths: careerAdvice.careers,
                    skillGaps,
                    jobRecommendations: jobRecs,
                    advisorNotes: careerAdvice.advice,
                    confidence: careerAdvice.confidence
                });
                await recommendation.save();
            }
        } catch (dbError) {
            console.warn('MongoDB not available, skipping recommendation save:', dbError.message);
        }
        
        res.json({
            success: true,
            data: {
                careerAdvisor: careerAdvice,
                skillGapAnalyzer: skillGaps,
                jobRecommender: jobRecs,
                digitalTwin: digitalTwin
            }
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/history/:userId', async (req, res) => {
    try {
        const history = await Recommendation.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .limit(10);
        res.json({ success: true, history });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;