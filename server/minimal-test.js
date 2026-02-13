require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.json());

app.post('/api/auth/register', (req, res) => {
  console.log('Request received:', req.body);
  res.json({
    status: 'success',
    message: 'Registration would work here',
    received: req.body
  });
});

app.listen(5002, () => {
  console.log('Test server running on port 5002');
});