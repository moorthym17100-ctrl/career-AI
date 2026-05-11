import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, LogIn, ClipboardList, MessageSquare, Mic, FileText, Send, Briefcase, ChevronRight } from 'lucide-react';
import CareerForm from './components/CareerForm';
import ChatBot from './components/ChatBot';
import AuthPanel from './components/AuthPanel';
import InterviewPanel from './components/InterviewPanel';
import ResumePanel from './components/ResumePanel';
import OpportunityPanel from './components/OpportunityPanel';
import DigitalTwinDashboard from './components/DigitalTwinDashboard';
import ResumeBuilder from './components/ResumeBuilder';
import './index.css';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('token');
    return t === 'null' ? null : t;
  });

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setActiveTab('form');
  };

  const tabs = [
    { id: 'form', label: 'Profile Analysis', icon: ClipboardList },
    { id: 'chat', label: 'AI Coaching', icon: MessageSquare },
    { id: 'interview', label: 'Mock Interviews', icon: Mic },
    { id: 'resume', label: 'Resume Analyzer', icon: FileText },
    { id: 'build-resume', label: 'Build Resume', icon: Send },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
  ];

  if (!token && ['interview', 'resume', 'build-resume', 'opportunities'].includes(activeTab)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
              🔒 Authentication Required
            </h1>
            <button 
              onClick={() => setActiveTab('form')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 transition-all duration-200"
            >
              Back to Public Platform
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <AuthPanel setToken={setToken} />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-4 md:space-y-0 pb-6 border-b border-white/10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-md"
          >
            🎓 Career AI Platform
          </motion.h1>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {token ? (
              <button 
                onClick={handleLogout} 
                className="inline-flex items-center px-5 py-2.5 bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50 rounded-xl font-medium transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" /> Logout
              </button>
            ) : (
              <button 
                onClick={() => setActiveTab('interview')} 
                className="inline-flex items-center px-5 py-2.5 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/50 rounded-xl font-medium transition-colors"
              >
                <LogIn className="w-5 h-5 mr-2" /> Login / Signup
              </button>
            )}
          </motion.div>
        </header>

        <nav className="flex flex-wrap justify-center gap-3 mb-12 backdrop-blur-md bg-white/5 p-2 rounded-2xl border border-white/10 shadow-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id && !(tab.id === 'form' && results);
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); if (tab.id === 'form') setResults(null); }}
                className={`group flex items-center px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ease-out ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105' 
                    : 'text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 mr-2 ${isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <AnimatePresence mode="wait">
          <motion.main
            key={activeTab + (results ? '-results' : '')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-5xl mx-auto"
          >
            {results && activeTab === 'form' ? (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    Your Tailored Career Analysis
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 space-y-8">
                  {/* Recommended Career Paths */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Briefcase className="w-6 h-6 mr-3 text-blue-400" /> Recommended Career Paths
                    </h3>
                    <div className="space-y-3">
                      {results.careerAdvisor?.careers?.map((career, i) => (
                        <div key={i} className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10 text-lg">
                          <ChevronRight className="w-5 h-5 mr-3 text-emerald-400" /> {career}
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 p-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl">
                      <div className="flex items-start">
                        <MessageSquare className="w-6 h-6 mr-3 text-indigo-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-indigo-300 mb-1">Expert Advice</h4>
                          <p className="text-slate-300 leading-relaxed">{results.careerAdvisor?.advice || "Keep learning and adapting."}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skill Gap Analysis */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <ClipboardList className="w-6 h-6 mr-3 text-orange-400" /> Skill Gap Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold text-orange-300 mb-4 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-orange-400 mr-2"></span> Missing Skills
                        </h4>
                        <div className="space-y-2">
                          {results.skillGapAnalyzer?.gaps?.map((gap, i) => (
                            <div key={i} className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl">
                              • {gap}
                            </div>
                          ))}
                          {(!results.skillGapAnalyzer?.gaps || results.skillGapAnalyzer.gaps.length === 0) && (
                            <p className="text-slate-400 italic">No major skill gaps identified! Great job.</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-emerald-300 mb-4 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span> Learning Plan
                        </h4>
                        <div className="space-y-2">
                          {results.skillGapAnalyzer?.learningPlan?.map((plan, i) => (
                            <div key={i} className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 rounded-xl">
                              → {plan}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Matches */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Briefcase className="w-6 h-6 mr-3 text-cyan-400" /> Top Job Matches
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.jobRecommender?.topJobs?.map((job, i) => {
                        const matchPercent = typeof job.match === 'number' ? (job.match > 1 ? job.match : Math.round(job.match * 100)) : parseInt(job.match) || 'N/A';
                        return (
                          <div key={i} className="group p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors flex justify-between items-center">
                            <div>
                              <h4 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">{job.title}</h4>
                              <p className="text-sm text-slate-400 mt-1">{job.company}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-900 font-bold text-sm shadow-lg">
                                {matchPercent}%
                              </span>
                              <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Match</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {results.digitalTwin && (
                    <DigitalTwinDashboard twinData={results.digitalTwin} />
                  )}

                  <div className="pt-8 text-center">
                    <button 
                      onClick={() => setResults(null)}
                      className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full font-bold transition-all shadow-xl hover:-translate-y-1"
                    >
                      Analyze Another Profile
                    </button>
                  </div>
                </div>
              </div>
            ) : activeTab === 'form' ? (
              <CareerForm setResults={setResults} setLoading={setLoading} loading={loading} />
            ) : null}

            {activeTab === 'chat' && <ChatBot />}
            {activeTab === 'interview' && <InterviewPanel token={token} />}
            {activeTab === 'resume' && <ResumePanel token={token} />}
            {activeTab === 'build-resume' && <ResumeBuilder token={token} />}
            {activeTab === 'opportunities' && <OpportunityPanel token={token} />}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
