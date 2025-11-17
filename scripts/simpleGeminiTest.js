import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

console.log('Testing Gemini API...\n');
console.log('API Key:', API_KEY ? 'Found ✅' : 'Not Found ❌');

if (!API_KEY) {
  console.log('\n❌ Add GEMINI_API_KEY to .env file!');
  process.exit(1);
}

const body = {
  contents: [{
    parts: [{
      text: 'Translate to Indonesian: Hello World'
    }]
  }]
};

console.log('Calling Gemini API...');

fetch(`${API_URL}?key=${API_KEY}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
})
.then(res => {
  console.log('Status:', res.status);
  return res.json();
})
.then(data => {
  if (data.error) {
    console.log('\n❌ ERROR:', JSON.stringify(data.error, null, 2));
  } else {
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('\n✅ SUCCESS!');
    console.log('Result:', result);
  }
})
.catch(err => {
  console.log('\n❌ Error:', err.message);
});
