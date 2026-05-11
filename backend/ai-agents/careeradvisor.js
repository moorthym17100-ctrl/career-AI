class CareerAdvisor {
    static analyze(userData) {
        const { skills, interests, education, experience } = userData;
        const careers = [];
        
        if (skills.includes('Python') || skills.includes('machine learning')) {
            careers.push('AI/ML Engineer - High demand, $120k+ avg salary');
        }
        if (skills.includes('React') || skills.includes('JavaScript')) {
            careers.push('Full Stack Developer - Remote friendly, $95k+ avg');
        }
        if (skills.includes('Management') || experience > 5) {
            careers.push('Technical Lead/Engineering Manager - Leadership track');
        }
        if (interests.includes('data') || interests.includes('analytics')) {
            careers.push('Data Scientist - Growing field, $110k+ avg');
        }
        
        if (careers.length === 0) {
            careers.push('Software Developer - Versatile tech career');
        }
        
        const strength = skills[0] || 'programming';
        const advice = `With your ${experience} years of experience and ${education}, focus on strengthening your ${strength} skills. Consider ${careers[0].split(' - ')[0]} as a primary path.`;
        
        return {
            careers,
            advice,
            confidence: Math.min(0.95, 0.65 + (experience * 0.05))
        };
    }
}

module.exports = CareerAdvisor;