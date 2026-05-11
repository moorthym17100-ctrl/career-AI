import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const ResumeBuilder = ({ token }) => {
    const [resumeData, setResumeData] = useState({
        name: '',
        email: '',
        phone: '',
        summary: '',
        experience: [{ title: '', company: '', duration: '', description: '' }],
        education: [{ degree: '', school: '', year: '' }],
        skills: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const resumeRef = useRef();

    useEffect(() => {
        if (token) {
            loadResume();
        }
    }, [token]);

    const loadResume = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/agents/resume/load', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && keysLength(res.data.resumeData) > 0) {
                setResumeData(res.data.resumeData);
            }
        } catch (err) {
            console.error('Error loading resume:', err);
        }
        setLoading(false);
    };

    const keysLength = (obj) => Object.keys(obj || {}).length;

    const saveResume = async () => {
        setLoading(true);
        setMessage('');
        try {
            const res = await axios.post('/api/agents/resume/save', 
                { resumeData },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setMessage('Resume saved securely! ✅');
            }
        } catch (err) {
            setMessage('Failed to save resume ❌');
        }
        setLoading(false);
    };

    const downloadPDF = () => {
        const element = resumeRef.current;
        const opt = {
            margin: 0.5,
            filename: `${resumeData.name || 'Resume'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const handleUpdate = (field, value) => {
        setResumeData({ ...resumeData, [field]: value });
    };

    const handleArrayUpdate = (index, arrayName, field, value) => {
        const newArray = [...resumeData[arrayName]];
        newArray[index] = { ...newArray[index], [field]: value };
        setResumeData({ ...resumeData, [arrayName]: newArray });
    };

    const addArrayItem = (arrayName, emptyItem) => {
        setResumeData({ ...resumeData, [arrayName]: [...resumeData[arrayName], emptyItem] });
    };

    const removeArrayItem = (index, arrayName) => {
        const newArray = [...resumeData[arrayName]];
        newArray.splice(index, 1);
        setResumeData({ ...resumeData, [arrayName]: newArray });
    };

    return (
        <div className="bg-white/95 rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                ✨ Pro Resume Builder
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="space-y-6 overflow-y-auto max-h-[800px] pr-4">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">Personal Details</h3>
                        <input className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Full Name" value={resumeData.name} onChange={(e) => handleUpdate('name', e.target.value)} />
                        <div className="flex gap-4">
                            <input className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Email" value={resumeData.email} onChange={(e) => handleUpdate('email', e.target.value)} />
                            <input className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Phone" value={resumeData.phone} onChange={(e) => handleUpdate('phone', e.target.value)} />
                        </div>
                        <textarea className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500" placeholder="Professional Summary" value={resumeData.summary} onChange={(e) => handleUpdate('summary', e.target.value)}></textarea>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex justify-between">Experience
                            <button onClick={() => addArrayItem('experience', { title: '', company: '', duration: '', description: '' })} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">+ Add Role</button>
                        </h3>
                        {resumeData.experience.map((exp, i) => (
                            <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3 relative">
                                <button onClick={() => removeArrayItem(i, 'experience')} className="absolute top-2 right-2 text-red-500 hover:text-red-700">✕</button>
                                <input className="w-full p-2 border rounded" placeholder="Job Title" value={exp.title} onChange={(e) => handleArrayUpdate(i, 'experience', 'title', e.target.value)} />
                                <div className="flex gap-2">
                                    <input className="w-1/2 p-2 border rounded" placeholder="Company" value={exp.company} onChange={(e) => handleArrayUpdate(i, 'experience', 'company', e.target.value)} />
                                    <input className="w-1/2 p-2 border rounded" placeholder="Duration (e.g. 2021-2023)" value={exp.duration} onChange={(e) => handleArrayUpdate(i, 'experience', 'duration', e.target.value)} />
                                </div>
                                <textarea className="w-full p-2 border rounded h-20" placeholder="Describe responsibilities and achievements..." value={exp.description} onChange={(e) => handleArrayUpdate(i, 'experience', 'description', e.target.value)}></textarea>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 flex justify-between">Education
                            <button onClick={() => addArrayItem('education', { degree: '', school: '', year: '' })} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">+ Add Degree</button>
                        </h3>
                        {resumeData.education.map((edu, i) => (
                            <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3 relative">
                                <button onClick={() => removeArrayItem(i, 'education')} className="absolute top-2 right-2 text-red-500 hover:text-red-700">✕</button>
                                <input className="w-full p-2 border rounded" placeholder="Degree / Certificate" value={edu.degree} onChange={(e) => handleArrayUpdate(i, 'education', 'degree', e.target.value)} />
                                <div className="flex gap-2">
                                    <input className="w-2/3 p-2 border rounded" placeholder="School / University" value={edu.school} onChange={(e) => handleArrayUpdate(i, 'education', 'school', e.target.value)} />
                                    <input className="w-1/3 p-2 border rounded" placeholder="Year" value={edu.year} onChange={(e) => handleArrayUpdate(i, 'education', 'year', e.target.value)} />
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">Skills</h3>
                        <input className="w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g. React, Node.js, Python, Leadership (comma separated)" value={resumeData.skills} onChange={(e) => handleUpdate('skills', e.target.value)} />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button onClick={saveResume} disabled={loading} className="w-1/2 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition disabled:opacity-50">
                            {loading ? 'Saving...' : '💾 Save Resume'}
                        </button>
                        <button onClick={downloadPDF} className="w-1/2 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
                            ⬇️ Download PDF
                        </button>
                    </div>
                    {message && <p className="text-center font-semibold mt-2 text-green-600">{message}</p>}
                </div>

                {/* Preview Section */}
                <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-600 mb-4 text-center">Live Preview</h3>
                    <div className="bg-white mx-auto shadow-sm" style={{ width: '100%', minHeight: '600px', padding: '40px', boxSizing: 'border-box' }} ref={resumeRef}>
                        <div className="border-b-2 border-gray-800 pb-4 mb-4 text-center">
                            <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-900">{resumeData.name || 'YOUR NAME'}</h1>
                            <p className="text-gray-600 mt-2 text-sm">{resumeData.email} {resumeData.email && resumeData.phone ? ' | ' : ''} {resumeData.phone}</p>
                        </div>
                        {resumeData.summary && (
                            <div className="mb-6">
                                <p className="text-gray-700 text-sm leading-relaxed">{resumeData.summary}</p>
                            </div>
                        )}
                        {/* Skills */}
                        {resumeData.skills && (
                            <div className="mb-6">
                                <h3 className="text-lg font-bold uppercase border-b border-gray-300 mb-2 text-gray-800">Skills</h3>
                                <p className="text-gray-700 text-sm">{resumeData.skills}</p>
                            </div>
                        )}
                        {/* Experience */}
                        {<div className="mb-6">
                            <h3 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 text-gray-800">Experience</h3>
                            <div className="space-y-4">
                                {resumeData.experience.map((exp, i) => (
                                    exp.title || exp.company ? (
                                        <div key={i}>
                                            <div className="flex justify-between font-bold text-gray-900 text-sm">
                                                <span>{exp.title}</span>
                                                <span className="text-gray-600">{exp.duration}</span>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-700 mb-1">{exp.company}</div>
                                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{exp.description}</p>
                                        </div>
                                    ) : null
                                ))}
                            </div>
                        </div>}
                        {/* Education */}
                        {<div className="mb-6">
                            <h3 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 text-gray-800">Education</h3>
                            <div className="space-y-3">
                                {resumeData.education.map((edu, i) => (
                                    edu.degree || edu.school ? (
                                        <div key={i}>
                                            <div className="flex justify-between font-bold text-gray-900 text-sm">
                                                <span>{edu.degree}</span>
                                                <span className="text-gray-600">{edu.year}</span>
                                            </div>
                                            <div className="text-sm text-gray-700">{edu.school}</div>
                                        </div>
                                    ) : null
                                ))}
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
