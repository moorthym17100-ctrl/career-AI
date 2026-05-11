import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, RefreshCw, Upload, AlertCircle, Building2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

function OpportunityPanel({ token }) {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOpportunities = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('/api/agents/opportunities', 
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setOpportunities(res.data.opportunities);
            } else {
                setError(res.data.error || 'Failed to fetch opportunities');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while connecting to the Opportunity Agent.');
        }
        setLoading(false);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoading(true);
        setError(null);
        setOpportunities([]);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            const res = await axios.post('http://localhost:5001/api/upload-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                const mapped = res.data.opportunities.map(o => ({
                    ...o,
                    type: o.job_type,
                    title: o.role,
                    matchPercentage: o.match_score
                }));
                // Sort by match percentage
                mapped.sort((a, b) => b.matchPercentage - a.matchPercentage);
                setOpportunities(mapped);
            } else {
                setError(res.data.error || 'Failed to analyze resume via Flask Opportunity Agent.');
            }
        } catch (err) {
            console.error(err);
            setError('Error connecting to Flask Agent (port 5001). Check if it is running.');
        }
        setLoading(false);
        if (event.target) event.target.value = '';
    };

    useEffect(() => {
        fetchOpportunities();
        // eslint-disable-next-line
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
        >
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                <div className="flex items-center">
                    <div className="bg-emerald-500/20 p-3 rounded-2xl mr-4">
                        <Briefcase className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Opportunity Finder
                        </h2>
                        <p className="text-slate-400 mt-1">Real-time matching of jobs, courses, and internships</p>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10">
                <button 
                    className="flex-1 flex justify-center items-center px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold transition-all disabled:opacity-50" 
                    onClick={fetchOpportunities} 
                    disabled={loading}
                >
                    <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Basic Profile Refresh
                </button>
                
                <div className="hidden md:flex items-center justify-center text-slate-500 font-medium">OR</div>
                
                <label className="flex-1 flex justify-center items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white rounded-xl font-bold cursor-pointer transition-all shadow-lg shadow-emerald-500/25">
                    <Upload className="w-5 h-5 mr-2" />
                    Deep Match (Upload PDF/TXT)
                    <input type="file" accept=".txt,.pdf" className="hidden" onChange={handleFileUpload} disabled={loading} />
                </label>
            </div>

            {error && (
                <div className="flex items-center mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" /> {error}
                </div>
            )}

            <div className="space-y-4">
                {opportunities.map((opp, i) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        key={i} 
                        className="group flex flex-col sm:flex-row justify-between sm:items-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-colors shadow-lg"
                    >
                        <div className="mb-4 sm:mb-0 space-y-2">
                            <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                                {opp.type}
                            </span>
                            <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                                {opp.title}
                            </h3>
                            <div className="flex items-center text-slate-400 text-sm">
                                <Building2 className="w-4 h-4 mr-1" /> <span className="mr-4">{opp.company}</span>
                            </div>
                        </div>
                        <div className="flex sm:flex-col items-center justify-between sm:justify-center">
                            <div className="text-sm text-slate-400 sm:mb-1 uppercase tracking-wider font-semibold">Match Score</div>
                            <span className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-lg font-bold shadow-inner ${
                                opp.matchPercentage >= 75 ? 'bg-emerald-500 text-white shadow-emerald-500/50' : 
                                opp.matchPercentage >= 50 ? 'bg-yellow-500 text-white shadow-yellow-500/50' : 
                                'bg-slate-700 text-slate-300'
                            }`}>
                                {opp.matchPercentage}%
                            </span>
                        </div>
                    </motion.div>
                ))}

                {opportunities.length === 0 && !loading && !error && (
                    <div className="text-center py-12 px-4 border-2 border-dashed border-white/10 rounded-3xl">
                        <Briefcase className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-300 mb-2">No Opportunities Found</h3>
                        <p className="text-slate-500">Upload your resume or wait for the initial fetch to see matches.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default OpportunityPanel;
