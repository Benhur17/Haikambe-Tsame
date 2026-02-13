const http = require('http');

const data = JSON.stringify({
  username: 'admin',
  email: 'admin@example.com',
  password: 'admin123456',
  fullName: 'System Administrator',
  role: 'Super Admin'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(responseData);
      
      if (res.statusCode === 201) {
        console.log('✅ Admin user created successfully!');
        console.log('Token:', result.token);
        console.log('User:', result.user);
      } else {
        console.error('❌ Error creating admin:');
        console.error('Status:', res.statusCode);
        console.error('Message:', result.message);
        if (result.error) console.error('Details:', result.error);
      }
    } catch (error) {
      console.error('❌ Failed to parse response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.write(data);
req.end();

