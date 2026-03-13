const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
  // 1. Get token
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  // 2. Upload file
  const form = new FormData();
  form.append('file', fs.createReadStream('test_assets/test.jpg'));

  const uploadRes = await fetch('http://localhost:5000/api/admin/upload/event-flyer', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: form
  });

  const uploadData = await uploadRes.json();
  console.log("Upload Response:", uploadData);
}

testUpload();
