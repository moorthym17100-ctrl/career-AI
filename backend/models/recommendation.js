const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    careerPaths: [String],
    skillGaps: Object,
    jobRecommendations: Object,
    advisorNotes: String,
    confidence: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);