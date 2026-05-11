import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Code, Star, GraduationCap, Briefcase, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CareerForm({ setResults, setLoading, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    interests: '',
    education: '',
    experience: 0
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/career/analyze', formData);
      setResults(response.data.data);
    } catch (err) {
      setError('Error: Backend server may not be running. Start backend first!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={formVariants} initial="hidden" animate="visible"
      className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          Career Profile Analysis
        </h2>
        <p className="text-slate-400 mt-3 font-medium">
          Fill out your profile to generate a customized AI-driven career roadmap.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-indigo-400" />
            </div>
            <input
              type="text"
              placeholder="Full Name *"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder-slate-500"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-indigo-400" />
            </div>
            <input
              type="email"
              placeholder="Email Address *"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder-slate-500"
            />
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Code className="w-5 h-5 text-emerald-400" />
          </div>
          <input
            type="text"
            placeholder="Skills (comma separated, e.g., React, Python, Cloud) *"
            required
            value={formData.skills}
            onChange={(e) => setFormData({...formData, skills: e.target.value})}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition placeholder-slate-500"
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Star className="w-5 h-5 text-emerald-400" />
          </div>
          <input
            type="text"
            placeholder="Interests (comma separated, e.g., Web Dev, AI, Data Science) *"
            required
            value={formData.interests}
            onChange={(e) => setFormData({...formData, interests: e.target.value})}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition placeholder-slate-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <GraduationCap className="w-5 h-5 text-purple-400" />
            </div>
            <input
              type="text"
              placeholder="Education (e.g., BSc Computer Science) *"
              required
              value={formData.education}
              onChange={(e) => setFormData({...formData, education: e.target.value})}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-slate-500"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Briefcase className="w-5 h-5 text-purple-400" />
            </div>
            <input
              type="number"
              placeholder="Years of Experience *"
              required
              min="0"
              max="50"
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value) || 0})}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-slate-500"
            />
          </div>
        </div>
        
        {error && (
          <div className="flex items-center p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex justify-center items-center py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-70"
        >
          {loading ? <RefreshCw className="w-6 h-6 mr-3 animate-spin" /> : '🚀 '}
          {loading ? 'AI is Analyzing...' : 'Get Comprehensive Career Analysis'}
        </button>
      </form>
    </motion.div>
  );
}
