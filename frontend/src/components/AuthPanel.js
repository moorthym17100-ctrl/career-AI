import React, { useState } from 'react';
import axios from 'axios';
import { Lock, Mail, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AuthPanel({ setToken }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const res = await axios.post(`${endpoint}`, formData);
            if (res.data.token) {
                setToken(res.data.token);
                localStorage.setItem('token', res.data.token);
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Authentication failed');
        }
        setLoading(false);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-slate-400 mt-2">
                        {isLogin ? 'Login to access your AI tools' : 'Sign up to kickstart your career'}
                    </p>
                </div>
                
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                            <div className="flex items-center p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" /> {error}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence>
                        {!isLogin && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="w-5 h-5 text-indigo-400" />
                                </div>
                                <input 
                                    type="text" placeholder="Full Name" required 
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder-slate-500"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="w-5 h-5 text-indigo-400" />
                        </div>
                        <input 
                            type="email" placeholder="Email Address" required
                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder-slate-500"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="w-5 h-5 text-indigo-400" />
                        </div>
                        <input 
                            type="password" placeholder="Password" required
                            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder-slate-500"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full flex justify-center items-center py-4 mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50"
                    >
                        {isLogin ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                        {loading ? 'Authenticating...' : (isLogin ? 'Login' : 'Register')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="text-indigo-300 hover:text-white transition-colors text-sm font-medium"
                    >
                        {isLogin ? "Don't have an account? Create one." : "Already have an account? Connect."}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default AuthPanel;
