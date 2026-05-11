const jwt = require('jsonwebtoken');
const token = jwt.sign({ user: { id: '123' } }, 'secret_token_123');
fetch('http://localhost:5000/api/agents/opportunities', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({})
}).then(res => res.json()).then(data => console.log(data)).catch(err => console.error(err));
