#!/usr/bin/env node
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

console.log('\n🧪 Testing Gemini API Connection...\n');

if (!API_KEY) {
  console.error('❌ No API key found in .env');
  console.error('   Please add: GEMINI_API_KEY=your-key-here');
  process.exit(1);
}

console.log(`✅ API Key found: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)}`);

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function testTranslate() {
  console.log('\n🔄 Testing translation: "Hello World" => Indonesian...\n');
  
  const body = {
    contents: [{
      parts: [{
        text: 'Translate to Indonesian: Hello World'
      }]
    }]
  };

  try {
    const res = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ API Error:', res.status, errorText);
      return false;
    }

    const data = await res.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (result) {
      console.log('✅ SUCCESS! Gemini API is working!');
      console.log(`📝 Result: "${result.trim()}"`);
      return true;
    } else {
      console.error('❌ No result from API');
      console.error('Response:', JSON.stringify(data, null, 2));
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

testTranslate().then(success => {
  console.log('\n' + '='.repeat(50));
  if (success) {
    console.log('✅ Gemini API is configured correctly!');
    console.log('💡 Now you can run: npm run cache:i18n');
  } else {
    console.log('❌ Something went wrong. Check the errors above.');
  }
  console.log('='.repeat(50) + '\n');
  process.exit(success ? 0 : 1);
});
