// Simulate a Career Digital Twin
class DigitalTwinAgent {
    static simulate(profile) {
        const { skills = [], experience = 0 } = profile;
        
        // 1. Future Job Roles Prediction
        const futureRoles = this.predictFutureRoles(skills, experience);
        
        // 2. Salary Growth Simulation
        const salaryData = this.simulateSalary(futureRoles[0], experience);
        
        // 3. Skill Roadmap Generator
        const roadmap = this.generateSkillRoadmap(skills, futureRoles[0]);
        
        return {
            roles: futureRoles,
            salaryGrowth: salaryData,
            roadmap: roadmap
        };
    }

    static predictFutureRoles(skills, experience) {
        let baseRoles = ["Software Developer", "Data Analyst", "System Admin"];
        
        const lowercaseSkills = skills.map(s => s.toLowerCase());
        
        if (lowercaseSkills.some(s => s.includes('react') || s.includes('frontend') || s.includes('css'))) {
            baseRoles = ["Senior Frontend Engineer", "UI/UX Developer", "Full Stack Engineer"];
        } else if (lowercaseSkills.some(s => s.includes('node') || s.includes('python') || s.includes('backend'))) {
            baseRoles = ["Backend Technical Lead", "Cloud Architect", "DevOps Engineer"];
        } else if (lowercaseSkills.some(s => s.includes('data') || s.includes('machine learning') || s.includes('ai'))) {
            baseRoles = ["Lead Data Scientist", "Machine Learning Engineer", "AI Product Manager"];
        }
        
        if (experience > 3) {
            baseRoles = baseRoles.map(role => `Principal ${role}`);
        }
        
        return baseRoles.slice(0, 3);
    }

    static simulateSalary(topRole, experience) {
        // Base salary roughly assigned per role
        let baseSalary = 60000;
        if (topRole && topRole.includes('Senior') || topRole.includes('Lead')) {
            baseSalary = 90000;
        }
        if (topRole && topRole.includes('Principal')) {
            baseSalary = 120000;
        }

        // Add experience multiplier
        baseSalary += experience * 5000;
        
        return {
            labels: ['Current', 'Year 1', 'Year 3', 'Year 5'],
            data: [
                baseSalary,
                baseSalary * 1.10, // 10% raise
                baseSalary * 1.35, // 35% growth in 3 years
                baseSalary * 1.70  // 70% growth in 5 years (promotion)
            ].map(val => Math.round(val))
        };
    }

    static generateSkillRoadmap(currentSkills, targetRole) {
        // Example dynamic generation of roadmap logic
        const roadmap = [
            {
                timeframe: "Next 3 Months",
                goal: "Master framework fundamentals and core concepts.",
                skillsToAcquire: ["Advanced Problem Solving", "System Architecture basics"]
            },
            {
                timeframe: "6-12 Months",
                goal: "Gain hands-on experience with production-level applications.",
                skillsToAcquire: ["Cloud Deployment (AWS/GCP)", "CI/CD Pipelines"]
            },
            {
                timeframe: "1-2 Years",
                goal: `Transition into ${targetRole || 'Advanced Role'}.`,
                skillsToAcquire: ["Leadership and Mentoring", "High-level System Design"]
            }
        ];
        
        return roadmap;
    }
}

module.exports = DigitalTwinAgent;
