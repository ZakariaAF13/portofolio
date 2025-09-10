const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Setting up environment variables for Admin Dashboard\n');

const questions = [
  {
    name: 'VITE_SUPABASE_URL',
    message: 'Enter your Supabase URL:',
    default: 'https://your-project-id.supabase.co'
  },
  {
    name: 'VITE_SUPABASE_ANON_KEY',
    message: 'Enter your Supabase anon/public key:',
    default: 'your-supabase-anon-key'
  },
  {
    name: 'VITE_OPENAI_API_KEY',
    message: '(Optional) Enter your OpenAI API key for AI features:',
    default: ''
  }
];

const envVars = {};

const askQuestion = (index) => {
  if (index >= questions.length) {
    // All questions answered, write to .env file
    let envContent = '# Environment Variables for Admin Dashboard\n\n';
    for (const [key, value] of Object.entries(envVars)) {
      if (value) {  // Only write non-empty values
        envContent += `${key}=${value}\n`;
      }
    }
    
    // Create .env file
    fs.writeFileSync('.env', envContent);
    console.log('\n✅ .env file created successfully!');
    console.log('\nNext steps:');
    console.log('1. Run: npm install');
    console.log('2. Run: npm run dev');
    console.log('\nAccess the admin dashboard at: http://localhost:5173/admin');
    console.log('Default login: admin@example.com / password123');
    
    readline.close();
    return;
  }

  const q = questions[index];
  readline.question(`${q.message} (${q.default}): `, (answer) => {
    envVars[q.name] = answer.trim() || q.default;
    askQuestion(index + 1);
  });
};

// Start asking questions
askQuestion(0);
