class SkillGapAnalyzer {
    static analyze(skills, interests) {
        const commonTechStack = {
            frontend: ['React', 'Vue', 'Angular', 'TypeScript'],
            backend: ['Node.js', 'Python', 'Java', 'Django', 'Express'],
            database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
            devops: ['Docker', 'AWS', 'Kubernetes', 'Git']
        };
        
        const gaps = [];
        const learningPlan = [];
        
        if (interests.includes('web') || interests.includes('frontend')) {
            if (!skills.some(s => commonTechStack.frontend.includes(s))) {
                gaps.push('Frontend Framework (React recommended)');
                learningPlan.push('High - Learn React in 4-6 weeks');
            }
        }
        
        if (!skills.some(s => commonTechStack.backend.includes(s))) {
            gaps.push('Backend Technology (Node.js/Django)');
            learningPlan.push('Medium - Essential for full-stack');
        }
        
        if (!skills.some(s => commonTechStack.database.includes(s))) {
            gaps.push('Database Knowledge (MongoDB recommended)');
            learningPlan.push('High - Learn databases in 3-4 weeks');
        }
        
        if (!skills.includes('Git')) {
            gaps.push('Version Control (Git)');
            learningPlan.push('Medium - Essential for collaboration');
        }
        
        return {
            currentSkills: skills,
            gaps,
            learningPlan,
            gapScore: Math.max(0.1, 1 - (skills.length * 0.1))
        };
    }
}

module.exports = SkillGapAnalyzer;