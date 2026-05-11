const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    skills: [String],
    interests: [String],
    education: { type: String, required: false },
    experience: { type: Number, default: 0 },
    savedResume: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);