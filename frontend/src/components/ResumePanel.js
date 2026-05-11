import React, { useState } from 'react';
import axios from 'axios';
import { FileText, Upload, RefreshCw, AlertCircle, Target, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ResumePanel({ token }) {
    const [resumeText, setResumeText] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [targetRole, setTargetRole] = useState('');
    const [targetCompany, setTargetCompany] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const formData = new FormData();
            formData.append('resumeText', resumeText);
            formData.append('targetRole', targetRole);
            formData.append('targetCompany', targetCompany);
            if (resumeFile) {
                formData.append('resumeFile', resumeFile);
            }

            const res = await axios.post('/api/agents/resume/analyze', 
                formData,
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
            );
            if (res.data.success) {
                setAnalysis(res.data.data);
            } else {
                setError(res.data.error || 'Failed to analyze resume');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred during resume analysis.');
        }
        setLoading(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl"
        >
            <div className="flex items-center mb-8 pb-6 border-b border-white/10">
                <div className="bg-orange-500/20 p-3 rounded-2xl mr-4">
                    <FileText className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">
                        Advanced AI Resume Optimizer
                    </h2>
                    <p className="text-slate-400 mt-1">Check your ATS compatibility against target roles and companies</p>
                </div>
            </div>
            
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Target Role (Optional)</label>
                        <input 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition placeholder-slate-500" 
                            type="text" 
                            placeholder="e.g. Frontend Developer" 
                            value={targetRole} 
                            onChange={e => setTargetRole(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Target Company (Optional)</label>
                        <input 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition placeholder-slate-500" 
                            type="text" 
                            placeholder="e.g. Google, Stripe" 
                            value={targetCompany} 
                            onChange={e => setTargetCompany(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Upload Resume (PDF/TXT) OR Paste Text</label>
                    <div className="flex items-center mb-4">
                        <label className="flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold transition-all cursor-pointer">
                            <Upload className="w-5 h-5 mr-2 text-orange-300" />
                            {resumeFile ? resumeFile.name : 'Choose File'}
                            <input 
                                type="file" 
                                accept=".pdf,.txt" 
                                className="hidden" 
                                onChange={e => setResumeFile(e.target.files[0])}
                            />
                        </label>
                    </div>
                    <textarea 
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition placeholder-slate-600 min-h-[160px]" 
                        placeholder="Or paste your professional experience, skills, and summary here..."
                        value={resumeText}
                        onChange={e => setResumeText(e.target.value)}
                    ></textarea>
                </div>

                <button 
                    className="w-full flex justify-center items-center px-6 py-4 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50" 
                    onClick={handleAnalyze} 
                    disabled={loading || (!resumeText.trim() && !resumeFile)}
                >
                    {loading ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <Target className="w-5 h-5 mr-2" />}
                    {loading ? 'Running Deep NLP Analysis...' : 'Optimize Resume'}
                </button>

                {error && (
                    <div className="flex items-center p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" /> {error}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {analysis && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="mt-10 pt-8 border-t border-white/10 space-y-8"
                    >
                        <div className="text-center">
                            <div className={`mx-auto flex items-center justify-center w-28 h-28 rounded-full border-4 shadow-xl mb-6 ${
                                analysis.score >= 80 ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' :
                                analysis.score >= 60 ? 'border-yellow-400 bg-yellow-500/20 text-yellow-300' :
                                'border-red-400 bg-red-500/20 text-red-300'
                            }`}>
                                <span className="text-4xl font-black">{analysis.score}%</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white">{analysis.summary}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Extracted Skills */}
                            {analysis.extractedSkills && analysis.extractedSkills.length > 0 && (
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <h4 className="flex items-center text-lg font-bold text-slate-200 mb-4 pb-2 border-b border-white/10">
                                        🧠 Extracted Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.extractedSkills.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/10 text-slate-300 rounded-lg text-sm font-medium border border-white/10">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Verbs */}
                            {analysis.foundVerbs && analysis.foundVerbs.length > 0 && (
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <h4 className="flex items-center text-lg font-bold text-slate-200 mb-4 pb-2 border-b border-white/10">
                                        <Zap className="w-5 h-5 mr-2 text-yellow-400" /> Power Verbs Found
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.foundVerbs.map((verb, i) => (
                                            <span key={i} className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg text-sm font-medium border border-yellow-500/20">
                                                {verb}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Company Specific Matching */}
                        {analysis.companyAnalysis && (
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <h4 className="flex items-center text-xl font-bold text-white mb-6 pb-2 border-b border-white/10">
                                    🏢 {analysis.companyAnalysis.company} Alignment Profile
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h5 className="font-bold text-emerald-400 mb-3 flex items-center">
                                            <CheckCircle2 className="w-5 h-5 mr-2" /> Matched Requirements
                                        </h5>
                                        <ul className="space-y-2">
                                            {analysis.companyAnalysis.matchingSpecs.length > 0 ? (
                                                analysis.companyAnalysis.matchingSpecs.map((s, i) => (
                                                    <li key={i} className="flex text-emerald-200/80 text-sm bg-emerald-500/10 px-3 py-2 rounded-lg">
                                                        ✓ {s}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-slate-500 text-sm italic">None explicitly matched.</li>
                                            )}
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-red-400 mb-3 flex items-center">
                                            <XCircle className="w-5 h-5 mr-2" /> Missing Requirements
                                        </h5>
                                        <ul className="space-y-2">
                                            {analysis.companyAnalysis.missingSpecs.length > 0 ? (
                                                analysis.companyAnalysis.missingSpecs.map((s, i) => (
                                                    <li key={i} className="flex text-red-200/80 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
                                                        ✗ {s}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-slate-500 text-sm italic">All requirements appear covered!</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Improvements */}
                        {analysis.improvements && analysis.improvements.length > 0 && (
                            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-6 rounded-2xl border border-indigo-500/30">
                                <h4 className="text-xl font-bold text-indigo-300 mb-4 flex items-center">
                                    🚀 Actionable Recommendations
                                </h4>
                                <ul className="space-y-3">
                                    {analysis.improvements.map((imp, i) => (
                                        <li key={i} className="flex items-start text-slate-300">
                                            <span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 mr-3 flex-shrink-0"></span>
                                            <span dangerouslySetInnerHTML={{ __html: imp.replace(/🏢/g, '<span class="text-orange-400 font-bold">🏢</span>') }} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default ResumePanel;
