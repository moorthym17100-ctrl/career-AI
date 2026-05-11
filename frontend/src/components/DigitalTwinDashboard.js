import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Target, TrendingUp, Map } from 'lucide-react';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DigitalTwinDashboard = ({ twinData }) => {
  if (!twinData) return null;

  const { roles, salaryGrowth, roadmap } = twinData;

  const chartData = {
    labels: salaryGrowth?.labels || [],
    datasets: [
      {
        label: 'Projected Salary ($)',
        data: salaryGrowth?.data || [],
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointRadius: 5,
        pointHoverRadius: 8
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
            color: '#e2e8f0',
            font: { family: 'Inter, sans-serif' }
        }
      },
    },
    scales: {
        x: {
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
        },
        y: {
            beginAtZero: false,
            ticks: {
                color: '#94a3b8',
                callback: function(value) {
                    return '$' + value.toLocaleString();
                }
            },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
        }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 space-y-8">
        <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                🤖 Career Digital Twin
            </h2>
            <p className="text-slate-400 text-lg">Your personalized 5-year AI career trajectory simulation</p>
        </div>

      {/* Future Job Roles Prediction */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Target className="w-6 h-6 mr-3 text-red-400" /> Future Roles Prediction
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles?.map((role, index) => (
            <motion.div 
                whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}
                key={index} className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-2xl border border-indigo-500/20 shadow-lg"
            >
              <div className="text-indigo-300 font-bold text-xl mb-3">{role}</div>
              <p className="text-sm text-slate-400 leading-relaxed">Projected role based on your current skill velocity and trajectory.</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Salary Growth Simulation */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl flex flex-col">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
             <TrendingUp className="w-6 h-6 mr-3 text-blue-400" /> Salary Growth Simulation
          </h3>
          <div className="flex-1 bg-slate-900/50 rounded-2xl p-4 border border-white/5 min-h-[300px]">
            {salaryGrowth ? (
              <Line options={chartOptions} data={chartData} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">No salary data available</div>
            )}
          </div>
        </div>

        {/* Skill Roadmap Timeline */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
             <Map className="w-6 h-6 mr-3 text-emerald-400" /> Skill Roadmap Generator
          </h3>
          <div className="relative border-l-2 border-indigo-500/30 ml-4 space-y-8 pb-4">
            {roadmap?.map((step, index) => (
              <div key={index} className="relative ml-8">
                <div className="absolute -left-[41px] top-1 h-4 w-4 rounded-full bg-emerald-400 border-[3px] border-slate-900 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors shadow-lg">
                    <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider rounded-lg mb-3">
                        {step.timeframe}
                    </span>
                    <h4 className="font-bold text-white text-lg mb-3">{step.goal}</h4>
                    <div className="flex flex-wrap gap-2">
                        {step.skillsToAcquire?.map((skill, idx) => (
                            <span key={idx} className="text-xs bg-indigo-500/20 text-indigo-200 border border-indigo-500/20 px-3 py-1.5 rounded-lg font-medium">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DigitalTwinDashboard;
