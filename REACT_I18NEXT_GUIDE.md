# 🌐 React-i18next Implementation Guide

## ✅ What's Done

### **1. Installation**
```bash
npm install react-i18next i18next i18next-browser-languagedetector
```

### **2. Project Structure**
```
src/
├── i18n/
│   ├── config.ts           # i18n configuration
│   └── locales/
│       ├── en.json          # English translations
│       └── id.json          # Indonesian translations
├── components/
│   └── LanguageSwitcher.tsx # Language toggle button
└── main.tsx                 # i18n initialized here
```

### **3. Files Created**
- ✅ `src/i18n/config.ts` - i18n setup with language detection
- ✅ `src/i18n/locales/en.json` - English translations
- ✅ `src/i18n/locales/id.json` - Indonesian translations
- ✅ `src/components/LanguageSwitcher.tsx` - Language switcher component
- ✅ `tsconfig.app.json` - Updated with `resolveJsonModule: true`
- ✅ `main.tsx` - Import i18n config

---

## 🎯 How It Works

### **1. UI Text (Static Content)**
Use `useTranslation()` hook untuk semua text di UI:

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('hero.greeting')}</h1>
      <p>{t('hero.description')}</p>
      <button>{t('hero.viewProjects')}</button>
    </div>
  );
}
```

### **2. Database Content (Dynamic Content)**
Render conditional berdasarkan `i18n.language`:

```tsx
import { useTranslation } from 'react-i18next';

function ProjectCard({ project }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  
  return (
    <div>
      {/* Use bilingual fields from database */}
      <h2>{currentLang === 'id' ? project.titleId : project.titleEn}</h2>
      <p>{currentLang === 'id' ? project.descriptionId : project.descriptionEn}</p>
    </div>
  );
}
```

### **3. Helper Function for Bilingual Fields**
```tsx
// Create a utility
function getBilingualText(item: any, field: string, lang: string) {
  const idField = `${field}Id`;
  const enField = `${field}En`;
  return lang === 'id' ? item[idField] : item[enField];
}

// Usage
<h2>{getBilingualText(project, 'title', i18n.language)}</h2>
```

---

## 📝 Translation Keys Structure

### **en.json / id.json**
```json
{
  "nav": {
    "home": "Home" / "Beranda",
    "about": "About" / "Tentang",
    ...
  },
  "hero": {
    "greeting": "Hi, I'm" / "Hai, Saya",
    "role": "Full Stack Developer",
    ...
  },
  "projects": {
    "title": "Projects" / "Proyek",
    "categories": {
      "all": "All" / "Semua",
      "web": "Web",
      ...
    }
  }
}
```

---

## 🔄 Migration Strategy

### **Phase 1: UI Components (Static Content)**
Refactor komponen untuk pakai `useTranslation()`:

**Before:**
```tsx
<h1>Projects</h1>
<p>My recent work</p>
```

**After:**
```tsx
const { t } = useTranslation();
<h1>{t('projects.title')}</h1>
<p>{t('projects.subtitle')}</p>
```

### **Phase 2: Database Content (Dynamic Content)**
Update rendering untuk conditional bilingual:

**Before:**
```tsx
<h2>{project.title}</h2>
```

**After:**
```tsx
const { i18n } = useTranslation();
<h2>{i18n.language === 'id' ? project.titleId : project.titleEn}</h2>
```

### **Phase 3: Remove Old Translation System**
After full migration:
- ❌ Remove `LanguageContext.tsx` (admin only)
- ❌ Remove `translate.ts` utility
- ✅ Keep bilingual fields in database
- ✅ Keep auto-translate for admin input

---

## 🚀 Implementation Steps

### **Step 1: Add Language Switcher to App**
```tsx
// src/App.tsx
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  return (
    <>
      <YourAppContent />
      <LanguageSwitcher /> {/* Floating button bottom-right */}
    </>
  );
}
```

### **Step 2: Refactor Navbar**
```tsx
// Before
<Link to="/">Home</Link>
<Link to="/about">About</Link>

// After
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<Link to="/">{t('nav.home')}</Link>
<Link to="/about">{t('nav.about')}</Link>
```

### **Step 3: Refactor Hero Section**
```tsx
const { t, i18n } = useTranslation();
const currentLang = i18n.language;

<h1>{t('hero.greeting')} <span>{profile.name}</span></h1>
<p>{currentLang === 'id' ? profile.bioId : profile.bioEn}</p>
```

### **Step 4: Refactor Project Cards**
```tsx
const { i18n } = useTranslation();
const lang = i18n.language;

projects.map(project => (
  <div key={project.id}>
    <h3>{lang === 'id' ? project.titleId : project.titleEn}</h3>
    <p>{lang === 'id' ? project.descriptionId : project.descriptionEn}</p>
  </div>
))
```

---

## 🎨 Language Switcher Usage

### **Floating Button (Default)**
Sudah include di `LanguageSwitcher.tsx`:
- Position: Bottom-right corner
- Fixed position
- Z-index: 50
- Animated hover/tap
- Shows flag emoji (🇬🇧/🇮🇩) + language code

### **Navbar Integration (Alternative)**
```tsx
import { useTranslation } from 'react-i18next';

function Navbar() {
  const { i18n } = useTranslation();
  
  return (
    <nav>
      {/* Other nav items */}
      <button onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'id' : 'en')}>
        {i18n.language === 'en' ? '🇮🇩 ID' : '🇬🇧 EN'}
      </button>
    </nav>
  );
}
```

---

## 📦 Database Schema (No Changes Needed!)

Bilingual fields tetap sama:

```typescript
// Projects
{
  title: string;        // Original (optional legacy)
  titleId: string;      // Indonesian
  titleEn: string;      // English
  description: string;  // Original (optional legacy)
  descriptionId: string;
  descriptionEn: string;
  category?: string;    // Optional legacy
  categoryId?: string;
  categoryEn?: string;
}
```

---

## 🔧 Utility Helper (Optional)

Create `src/utils/bilingual.ts`:

```typescript
export function getBilingualText(
  item: any,
  field: string,
  lang: string,
  fallbackField?: string
): string {
  const idField = `${field}Id`;
  const enField = `${field}En`;
  
  if (lang === 'id') {
    return item[idField] || item[fallbackField || field] || '';
  }
  return item[enField] || item[fallbackField || field] || '';
}

// Usage
import { getBilingualText } from '@/utils/bilingual';
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();
<h2>{getBilingualText(project, 'title', i18n.language)}</h2>
```

---

## ✅ Benefits

### **vs LibreTranslate/MyMemory API:**
- ✅ **No CORS issues** - pure client-side
- ✅ **No API limits** - all offline
- ✅ **Instant** - no network delay
- ✅ **Reliable** - no external dependency
- ✅ **Industry standard** - react-i18next widely used

### **vs Manual LanguageContext:**
- ✅ **More features** - language detection, persistence, pluralization
- ✅ **Better DX** - simpler API, better TypeScript support
- ✅ **Community support** - extensive documentation & plugins
- ✅ **Scalable** - easy to add more languages

---

## 🎯 Admin Dashboard

**Admin tetap pakai LanguageContext** (sudah ada):
- Admin UI punya sistem sendiri
- Admin form tetap auto-translate untuk database content
- Tidak conflict dengan react-i18next (public site only)

**Flow:**
1. Admin input → auto-translate → save bilingual fields
2. Public site → render based on i18n.language → show correct language

---

## 📚 Adding More Translations

### **1. Add to locale files:**
```json
// en.json
{
  "newSection": {
    "title": "New Section",
    "description": "Description here"
  }
}

// id.json
{
  "newSection": {
    "title": "Seksi Baru",
    "description": "Deskripsi di sini"
  }
}
```

### **2. Use in component:**
```tsx
const { t } = useTranslation();
<h1>{t('newSection.title')}</h1>
```

---

## 🔍 Debugging

### **Check current language:**
```tsx
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();
console.log('Current language:', i18n.language);
```

### **Force change language:**
```tsx
i18n.changeLanguage('id'); // Switch to Indonesian
i18n.changeLanguage('en'); // Switch to English
```

### **Check available languages:**
```tsx
console.log('Available languages:', i18n.languages);
```

---

## 🎉 Next Steps

1. ✅ Install packages - DONE
2. ✅ Create i18n config - DONE
3. ✅ Create locale files - DONE
4. ✅ Add language switcher - DONE
5. 🔄 Refactor components to use `useTranslation()` - IN PROGRESS
6. ⏳ Test all pages - PENDING
7. ⏳ Update documentation - PENDING

---

## 📖 Resources

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- [Best Practices](https://react.i18next.com/latest/using-with-hooks#not-using-suspense)

---

## 🎨 Example Migration

### **Before (Manual):**
```tsx
const [lang, setLang] = useState('en');

<h1>{lang === 'en' ? 'Projects' : 'Proyek'}</h1>
<button onClick={() => setLang(lang === 'en' ? 'id' : 'en')}>
  Switch
</button>
```

### **After (react-i18next):**
```tsx
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();

<h1>{t('projects.title')}</h1>
<button onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'id' : 'en')}>
  Switch
</button>
```

**Much cleaner & scalable!** ✨
