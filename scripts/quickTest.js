import dotenv from 'dotenv';
dotenv.config();

const geminiKey = process.env.GEMINI_API_KEY;
const viteGeminiKey = process.env.VITE_GEMINI_API_KEY;
const firebaseProjectId = process.env.VITE_FIREBASE_PROJECT_ID;

console.log('\n=== Environment Check ===\n');
console.log('GEMINI_API_KEY:', geminiKey ? '✅ Found' : '❌ Not found');
console.log('VITE_GEMINI_API_KEY:', viteGeminiKey ? '✅ Found' : '❌ Not found');
console.log('VITE_FIREBASE_PROJECT_ID:', firebaseProjectId || '❌ Not set (still "your-project-id")');
console.log('\nIf Firebase shows "your-project-id", update your .env with real credentials!\n');
