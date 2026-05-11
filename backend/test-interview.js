const jwt = require('jsonwebtoken');
const token = jwt.sign({ user: { id: '123' } }, 'secret_token_123');

async function test() {
    try {
        const res = await fetch('http://localhost:5000/api/agents/interview/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ role: 'developer', experience: 'beginner' })
        });
        const data = await res.json();
        console.log('Interview Generation:', data);
    } catch(err) { console.error(err) }

    try {
        const res2 = await fetch('http://localhost:5000/api/agents/resume/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ resumeText: 'React backend developer with python skills', targetRole: 'developer' })
        });
        const data2 = await res2.json();
        console.log('Resume Analyze:', data2);
    } catch(err) { console.error(err) }
}
test();
