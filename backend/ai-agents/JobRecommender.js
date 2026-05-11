class JobRecommender {
    static recommend(skills, experience) {
        const jobLevels = [
            { title: 'Junior Developer', minExp: 0, maxExp: 2, matchMultiplier: 1.0 },
            { title: 'Mid-Level Developer', minExp: 2, maxExp: 5, matchMultiplier: 1.1 },
            { title: 'Senior Developer', minExp: 5, maxExp: 8, matchMultiplier: 1.2 },
            { title: 'Tech Lead', minExp: 8, maxExp: 12, matchMultiplier: 1.3 }
        ];
        
        const level = jobLevels.find(l => experience >= l.minExp && experience <= l.maxExp) || jobLevels[0];
        const techStack = skills[0] || 'Full Stack';
        const jobs = [
            { title: `${techStack} Developer`, company: 'Tech Company', match: 0.85 * level.matchMultiplier },
            { title: 'Software Engineer', company: 'Startup', match: 0.80 * level.matchMultiplier },
            { title: level.title, company: 'Enterprise', match: 0.90 * level.matchMultiplier }
        ];
        
        const avgMatch = jobs.reduce((sum, job) => sum + job.match, 0) / jobs.length;
        
        return {
            topJobs: jobs,
            matchScore: Math.round(avgMatch * 100),
            experienceLevel: level.title
        };
    }
}

module.exports = JobRecommender;