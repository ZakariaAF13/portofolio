#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

console.log('🔍 Checking environment variables...');
if (!API_KEY) {
  console.error('❌ Missing GEMINI_API_KEY (or VITE_GEMINI_API_KEY) in .env file.');
  console.error('💡 Make sure you have added it to your .env file.');
  process.exit(1);
}
console.log('✅ API key found!');

// Get project root (parent of scripts folder)
const projectRoot = path.resolve(__dirname, '..');
const enPath = path.join(projectRoot, 'src', 'i18n', 'locales', 'en.json');
const idPath = path.join(projectRoot, 'src', 'i18n', 'locales', 'id.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

async function translate(text) {
  const body = {
    contents: [
      {
        parts: [
          {
            text: `Translate the following UI text to Indonesian. Keep it concise, natural, and do not add extra quotes or commentary. If there are placeholders like {name}, keep them unchanged.\n\nTEXT:\n${text}`,
          },
        ],
      },
    ],
  };

  const res = await fetch(`${API_URL}?key=${encodeURIComponent(API_KEY)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini HTTP ${res.status}: ${err}`);
  }
  const data = await res.json();
  const out = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim?.();
  if (!out) throw new Error('Gemini returned no text');
  return out;
}

function isString(x) { return typeof x === 'string'; }

async function fillMissing(enObj, idObj, prefix = '', dryRun = false) {
  let changed = 0;

  for (const key of Object.keys(enObj)) {
    const currEn = enObj[key];
    const currId = idObj[key];
    const pathKey = prefix ? `${prefix}.${key}` : key;

    if (isString(currEn)) {
      const needs = !isString(currId) || String(currId).trim() === '';
      if (needs) {
        console.log(`🔄 Translating: ${pathKey}`);
        const translated = await translate(currEn);
        if (dryRun) {
          console.log(`   [dry-run] "${currEn}" => "${translated}"`);
        } else {
          console.log(`   ✅ "${translated}"`);
          idObj[key] = translated;
        }
        changed++;
      }
    } else if (currEn && typeof currEn === 'object' && !Array.isArray(currEn)) {
      idObj[key] = idObj[key] && typeof idObj[key] === 'object' ? idObj[key] : {};
      changed += await fillMissing(currEn, idObj[key], pathKey, dryRun);
    }
  }

  return changed;
}

(async function main() {
  console.log('\n📚 Starting Gemini i18n Auto-Translate...\n');
  
  const dryRun = process.argv.includes('--dry-run');
  console.log(`Mode: ${dryRun ? '🔍 DRY-RUN (preview only)' : '✍️  WRITE (will save to id.json)'}\n`);
  
  console.log('📂 Reading locale files...');
  const en = readJson(enPath);
  const id = readJson(idPath);
  console.log('✅ Files loaded successfully!\n');

  console.log('🔍 Scanning for missing Indonesian translations...\n');
  const changed = await fillMissing(en, id, '', dryRun);

  console.log('\n' + '='.repeat(50));
  if (!dryRun && changed > 0) {
    writeJson(idPath, id);
    console.log(`\n✅ SUCCESS! Filled ${changed} keys and wrote to id.json`);
    console.log('💡 Check src/i18n/locales/id.json to see the results!');
  } else if (dryRun && changed > 0) {
    console.log(`\n📝 Dry-run complete. Would fill ${changed} keys.`);
    console.log('💡 Run "npm run cache:i18n" to actually save the translations.');
  } else {
    console.log('\n✨ Nothing to update. id.json is already complete!');
  }
  console.log('='.repeat(50) + '\n');
})().catch((e) => {
  console.error('\n❌ ERROR:', e.message);
  console.error('\n💡 Make sure:');
  console.error('   1. GEMINI_API_KEY is set in .env');
  console.log('   2. API key is valid');
  console.error('   3. You have internet connection\n');
  process.exit(1);
});
