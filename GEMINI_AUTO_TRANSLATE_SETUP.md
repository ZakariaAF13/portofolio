# 🤖 Gemini Auto-Translate Setup Guide

## ✅ Yang Sudah Saya Setup

1. **Script auto-translate:** `scripts/cacheGeminiTranslations.js`
2. **Test script:** `scripts/testGemini.js`
3. **Helper utility:** `src/utils/geminiTranslate.ts`
4. **Component:** `src/components/LongContent.tsx`
5. **NPM Scripts:** Added to package.json
6. **Dependencies:** Installed `dotenv` and `node-fetch@2`

---

## 🚀 Cara Menggunakan

### **Step 1: Verifikasi API Key**

Jalankan test untuk memastikan Gemini API bekerja:

```bash
npm run test:gemini
```

**Expected output:**
```
🧪 Testing Gemini API Connection...

✅ API Key found: AIzaSyDfFZ...a2Gc
🔄 Testing translation: "Hello World" => Indonesian...

✅ SUCCESS! Gemini API is working!
📝 Result: "Halo Dunia"

==================================================
✅ Gemini API is configured correctly!
💡 Now you can run: npm run cache:i18n
==================================================
```

**Jika error:**
- Pastikan `.env` berisi: `GEMINI_API_KEY=AIzaSyDfFZHiK0Lo0W2BqdebR3mmC3YqMzZa2Gc`
- Cek koneksi internet
- Verifikasi API key valid di [Google AI Studio](https://makersuite.google.com/app/apikey)

---

### **Step 2: Preview Translations (Dry-Run)**

Lihat apa yang akan diterjemahkan tanpa menulis ke file:

```bash
npm run cache:i18n:dry
```

**Expected output:**
```
📚 Starting Gemini i18n Auto-Translate...

Mode: 🔍 DRY-RUN (preview only)

📂 Reading locale files...
✅ Files loaded successfully!

🔍 Scanning for missing Indonesian translations...

🔄 Translating: about.fallbackBio
   [dry-run] "Fullstack Web Developer..." => "Pengembang Web Fullstack..."

🔄 Translating: projects.clickToReadMore
   [dry-run] "Click to read more" => "Klik untuk baca selengkapnya"

==================================================
📝 Dry-run complete. Would fill 15 keys.
💡 Run "npm run cache:i18n" to actually save the translations.
==================================================
```

---

### **Step 3: Translate dan Save**

Jalankan yang sebenarnya untuk menulis hasil ke `id.json`:

```bash
npm run cache:i18n
```

**Expected output:**
```
📚 Starting Gemini i18n Auto-Translate...

Mode: ✍️  WRITE (will save to id.json)

📂 Reading locale files...
✅ Files loaded successfully!

🔍 Scanning for missing Indonesian translations...

🔄 Translating: about.fallbackBio
   ✅ "Pengembang Web Fullstack yang berfokus..."

🔄 Translating: projects.clickToReadMore
   ✅ "Klik untuk baca selengkapnya"

==================================================
✅ SUCCESS! Filled 15 keys and wrote to id.json
💡 Check src/i18n/locales/id.json to see the results!
==================================================
```

---

### **Step 4: Verifikasi Hasil**

Buka file `src/i18n/locales/id.json` dan lihat terjemahan baru:

```json
{
  "about": {
    "fallbackBio": "Pengembang Web Fullstack yang berfokus...",
    "title": "Tentang"
  },
  "projects": {
    "clickToReadMore": "Klik untuk baca selengkapnya",
    "clickToCollapse": "Klik untuk tutup"
  }
}
```

---

## 🎯 Bagaimana Cara Kerjanya?

### **Untuk Static UI Text (Short Content)**

Script akan:
1. Membaca `src/i18n/locales/en.json`
2. Mencari key yang kosong/missing di `src/i18n/locales/id.json`
3. Menerjemahkan dengan Gemini API
4. Menulis hasil ke `id.json`

**Keuntungan:**
- ✅ Hanya translate sekali (build-time)
- ✅ Tidak ada API call di production
- ✅ Hemat biaya
- ✅ Cepat karena sudah di-cache

### **Untuk Dynamic Long Content (Runtime)**

Gunakan komponen `<LongContent>`:

```tsx
import LongContent from './components/LongContent';

const longText = `
Ini adalah konten yang sangat panjang yang mungkin 
berisi artikel, tutorial, atau deskripsi detail lainnya.
Konten ini akan diterjemahkan secara otomatis sesuai 
bahasa yang dipilih user.
`;

<LongContent content={longText} />
```

**Keuntungan:**
- ✅ Terjemahan natural dan kontekstual
- ✅ Auto-cache di localStorage
- ✅ Mendukung switch bahasa instant

---

## 📋 Checklist

- [x] Install dependencies (`dotenv`, `node-fetch@2`)
- [x] Create `.env` with `GEMINI_API_KEY`
- [x] Add npm scripts to `package.json`
- [x] Create translation script
- [x] Create test script
- [ ] **Run `npm run test:gemini`** ← Jalankan ini dulu!
- [ ] **Run `npm run cache:i18n:dry`**
- [ ] **Run `npm run cache:i18n`**
- [ ] Verify results in `id.json`

---

## 🐛 Troubleshooting

### **Script tidak ada output**

Kemungkinan:
1. Semua key di `id.json` sudah terisi (tidak perlu translate)
2. API key tidak ditemukan di `.env`

**Solusi:** Jalankan `npm run test:gemini` untuk debug.

### **Error: Missing GEMINI_API_KEY**

**Solusi:** 
1. Pastikan file `.env` ada di root project
2. Isi dengan: `GEMINI_API_KEY=AIzaSyDfFZHiK0Lo0W2BqdebR3mmC3YqMzZa2Gc`
3. Restart terminal/console

### **Error: Gemini HTTP 400/403**

**Solusi:**
- API key salah/expired
- Quota habis
- Cek di [Google AI Studio](https://makersuite.google.com/)

### **Error: fetch is not defined**

**Solusi:** Sudah dihandle dengan `node-fetch@2`. Jika masih error, cek versi Node.js (minimum v14).

---

## 💰 Biaya & Limit

**Gemini API (Free Tier):**
- 60 requests per minute
- 1500 requests per day
- Cukup untuk translate ratusan key

**Best Practice:**
- Jalankan cache script saat development
- Deploy dengan `id.json` yang sudah terisi
- Hindari memanggil Gemini di production (kecuali untuk LongContent yang benar-benar perlu)

---

## 🎉 Hasil Akhir

**Sekarang Anda punya:**
- ✅ Auto-translate untuk semua static UI text
- ✅ Komponen `LongContent` untuk konten dinamis panjang
- ✅ Cache localStorage + file JSON (hemat API calls)
- ✅ No limit karakter (unlimited!)
- ✅ Natural translation dari Gemini AI

**Next Steps:**
1. Jalankan `npm run test:gemini` untuk verifikasi
2. Jalankan `npm run cache:i18n` untuk translate semua
3. Test di browser dengan switch language (EN/ID)
4. Enjoy bilingual content! 🚀

---

**Created by:** Cascade AI  
**Date:** November 3, 2025  
**Status:** ✅ Ready to use!
