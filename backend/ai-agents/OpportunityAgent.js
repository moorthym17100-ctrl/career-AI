class OpportunityAgent {
    static findOpportunities(profile) {
        // Expanded mock dataset of opportunities with multiple required and preferred skills
        const mockDatabase = [
            { id: 1, type: 'job', title: 'Frontend Developer', company: 'TechCorp', requiredSkills: ['react', 'javascript', 'css'], preferredSkills: ['typescript', 'redux'] },
            { id: 2, type: 'job', title: 'Backend Engineer', company: 'DataSystems', requiredSkills: ['node', 'express', 'mongodb'], preferredSkills: ['docker', 'aws'] },
            { id: 3, type: 'internship', title: 'Data Science Intern', company: 'AI Labs', requiredSkills: ['python', 'sql'], preferredSkills: ['machine learning', 'pandas'] },
            { id: 4, type: 'course', title: 'Advanced React patterns', company: 'Udemy', requiredSkills: ['javascript', 'react'], preferredSkills: [] },
            { id: 5, type: 'job', title: 'UX Designer', company: 'Creative Studio', requiredSkills: ['figma', 'design'], preferredSkills: ['user research', 'css'] },
            { id: 6, type: 'internship', title: 'Marketing Intern', company: 'GrowthX', requiredSkills: ['marketing', 'communication'], preferredSkills: ['seo', 'social media'] },
            { id: 7, type: 'scholarship', title: 'Women in Tech Scholarship', company: 'Google', requiredSkills: ['computer science'], preferredSkills: ['leadership'] },
            { id: 8, type: 'job', title: 'Full Stack Developer', company: 'StartupInc', requiredSkills: ['react', 'node', 'javascript'], preferredSkills: ['postgresql', 'aws', 'docker'] },
            { id: 9, type: 'course', title: 'Machine Learning A-Z', company: 'Coursera', requiredSkills: ['python'], preferredSkills: ['math', 'statistics'] },
            { id: 10, type: 'scholarship', title: 'Open Source Grant', company: 'Mozilla', requiredSkills: ['open source', 'coding'], preferredSkills: ['javascript', 'python'] }
        ];

        let results = [];
        
        let userSkillsLower = (profile?.skills || []).map(s => s.toLowerCase());

        results = mockDatabase.map(opp => {
            let matchCount = 0;
            let totalSkillsToMatch = opp.requiredSkills.length + opp.preferredSkills.length;
            
            // Check for matches in both REQUIRED and PREFERRED skills
            opp.requiredSkills.forEach(req => {
                if (userSkillsLower.some(us => us.includes(req) || req.includes(us))) matchCount += 1.5; // weight required skills more
            });

            opp.preferredSkills.forEach(pref => {
                if (userSkillsLower.some(us => us.includes(pref) || pref.includes(us))) matchCount += 1;
            });
            
            // Allow basic match by title just in case skills are empty but title matches something vaguely 
            if (userSkillsLower.length > 0 && userSkillsLower.some(us => opp.title.toLowerCase().includes(us))) {
                matchCount += 1;
            }

            // Normalization of percentage
            let matchPercentage = totalSkillsToMatch > 0 
                ? Math.min(Math.round((matchCount / (opp.requiredSkills.length * 1.5 + opp.preferredSkills.length)) * 100), 100) 
                : 50;

            // Give a baseline if they have no skills specified but need default reqs
            if (userSkillsLower.length === 0) matchPercentage = Math.floor(Math.random() * 30) + 40; 

            return {
                ...opp,
                matchPercentage,
                matchedSkills: [...opp.requiredSkills, ...opp.preferredSkills].filter(req => userSkillsLower.some(us => us.includes(req)))
            };
        });

        // Filter out very low matches if skills were provided, then sort
        if (userSkillsLower.length > 0) {
            results = results.filter(r => r.matchPercentage > 20);
        }

        results.sort((a, b) => b.matchPercentage - a.matchPercentage);

        // Fallback: Return top 5 generic ones if no results found
        if (results.length === 0) {
            results = mockDatabase.slice(0, 5).map(opp => ({ ...opp, matchPercentage: Math.floor(Math.random() * 20) + 50, matchedSkills: [] }));
        }

        return results.slice(0, 8); // top 8 results
    }
}

module.exports = OpportunityAgent;
