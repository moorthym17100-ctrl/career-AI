const jwt = require('jsonwebtoken');
const token = jwt.sign({user: {id: '123'}}, 'secret_token_123');

async function test() {
    console.log("Testing Interview Generate...");
    let res = await fetch('http://localhost:5000/api/agents/interview/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: 'developer', experience: 'beginner' })
    });
    console.log(await res.text());

    console.log("Testing Opportunity...");
    res = await fetch('http://localhost:5000/api/agents/opportunities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skills: ['react', 'node'] })
    });
    console.log(await res.text());
}
test();
