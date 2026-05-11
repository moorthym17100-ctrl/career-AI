import React, { useState } from 'react';
import axios from 'axios';
import { Mic, Send, RefreshCw, Trophy, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function InterviewPanel({ token }) {
    const [role, setRole] = useState('developer');
    const [experience, setExperience] = useState('beginner');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateQuestions = async () => {
        setLoading(true);
        setError(null);
        setQuestions([]);
        setAnswers({});
        setFeedback(null);
        try {
            const res = await axios.post('/api/agents/interview/generate', 
                { role, experience },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setQuestions(res.data.questions);
            } else {
                setError(res.data.error || 'Failed to generate questions');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred during interview generation.');
        }
        setLoading(false);
    };

    const submitAnswers = async () => {
        setLoading(true);
        setError(null);
        try {
            const answersArray = questions.map((_, i) => answers[i] || '');
            const res = await axios.post('/api/agents/interview/feedback', 
                { answers: answersArray, questions, role, experience },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setFeedback(res.data);
            } else {
                setError(res.data.error || 'Failed to analyze answers');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred during answer submission.');
        }
        setLoading(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
        >
            <div className="flex items-center mb-8 pb-4 border-b border-white/10">
                <div className="bg-indigo-500/20 p-3 rounded-2xl mr-4">
                    <Mic className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                        AI Mock Interviewer
                    </h2>
                    <p className="text-slate-400 mt-1">Hone your skills with role-specific, dynamic AI interviews</p>
                </div>
            </div>
            
            <AnimatePresence mode="wait">
                {!questions.length ? (
                    <motion.div 
                        key="setup"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="space-y-6 max-w-md mx-auto"
                    >
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Target Role</label>
                            <input 
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder-slate-500" 
                                type="text" 
                                placeholder="e.g. Frontend Developer"
                                value={role} 
                                onChange={e => setRole(e.target.value)} 
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Experience Level</label>
                            <select 
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition [&>option]:bg-slate-800" 
                                value={experience} 
                                onChange={e => setExperience(e.target.value)}
                            >
                                <option value="beginner">Entry Level / Beginner</option>
                                <option value="intermediate">Mid-Level / Intermediate</option>
                                <option value="advanced">Senior / Advanced</option>
                            </select>
                        </div>

                        <button 
                            className="w-full flex justify-center items-center px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed" 
                            onClick={generateQuestions} 
                            disabled={loading || !role}
                        >
                            {loading ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <Mic className="w-5 h-5 mr-2" />}
                            {loading ? 'Initializing AI...' : 'Start Interview'}
                        </button>
                        
                        {error && (
                            <div className="flex items-center p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" /> {error}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="interview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div className="space-y-6">
                            {questions.map((q, i) => (
                                <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-lg">
                                    <div className="flex items-start mb-4">
                                        <span className="flex items-center justify-center bg-indigo-500 text-white font-bold rounded-lg w-8 h-8 mr-3 mt-1 flex-shrink-0">
                                            {i+1}
                                        </span>
                                        <p className="text-lg font-medium text-slate-200">{q}</p>
                                    </div>
                                    <textarea 
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder-slate-600 min-h-[120px]" 
                                        placeholder="Type your comprehensive answer here..."
                                        value={answers[i] || ''}
                                        onChange={(e) => setAnswers({...answers, [i]: e.target.value})}
                                    ></textarea>
                                    
                                    <AnimatePresence>
                                        {feedback && feedback.feedback && feedback.feedback[i] && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-4 p-4 bg-indigo-500/10 border-l-4 border-indigo-400 rounded-r-xl text-indigo-300"
                                            >
                                                <div className="flex">
                                                    <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                                                    <p>{feedback.feedback[i]}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                        
                        {!feedback ? (
                            <div className="flex flex-col items-center pt-4">
                                {error && (
                                    <div className="flex items-center mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl w-full max-w-md">
                                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" /> {error}
                                    </div>
                                )}
                                <button 
                                    className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold transition-all shadow-lg shadow-emerald-500/30 flex items-center disabled:opacity-50" 
                                    onClick={submitAnswers} 
                                    disabled={loading}
                                >
                                    {loading ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
                                    {loading ? 'AI Analyzing Responses...' : 'Submit Final Answers'}
                                </button>
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="mt-8 p-8 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 rounded-3xl text-center"
                            >
                                <div className="inline-flex justify-center items-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl mb-6">
                                    <Trophy className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-3xl font-extrabold text-white mb-2">
                                    Score: {feedback.finalScore != null ? Number(feedback.finalScore).toFixed(0) : 0}/100
                                </h3>
                                <p className="text-xl text-indigo-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                                    {feedback.tips}
                                </p>
                                <button 
                                    className="px-8 py-3 bg-white hover:bg-slate-100 text-indigo-900 rounded-full font-bold transition-all shadow-lg" 
                                    onClick={() => { setQuestions([]); setFeedback(null); }}
                                >
                                    Start Another Interview
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default InterviewPanel;
