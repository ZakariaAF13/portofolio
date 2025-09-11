# 🔥 Firebase Admin Setup Instructions

## 📋 Langkah-langkah Setup

### 1. Setup Admin User dengan Custom Claims

1. **Buat user admin di Firebase Console:**
   - Buka Firebase Console → Authentication → Users
   - Klik "Add user" dan buat akun admin
   - **CATAT UID USER** yang baru dibuat

2. **Edit file `setAdminClaim.js`:**
   ```javascript
   const uid = 'USER_UID_DARI_CONSOLE'; // GANTI dengan UID yang dicatat
   ```

3. **Jalankan script untuk set admin claim:**
   ```bash
   node setAdminClaim.js
   ```

### 2. Setup Firestore Security Rules

1. **Buka Firebase Console → Firestore Database → Rules**
2. **Copy paste rules dari file `firestore-rules.txt`**
3. **Pilih salah satu:**
   - **Development Rules**: Semua user authenticated bisa read/write
   - **Production Rules**: Public read, hanya admin yang bisa write
4. **Klik "Publish"**

### 3. Seed Data Awal (Opsional)

**Jalankan script untuk membuat data awal:**
```bash
node seedFirestore.js
```

**Ini akan membuat collections:**
- `portfolio_projects`
- `portfolio_skills` 
- `portfolio_profile`
- `portfolio_what_i_do`
- `portfolio_knowledge`
- `portfolio_experiences`
- `portfolio_educations`

### 4. Environment Variables (Production)

1. **Copy `.env.example` ke `.env`:**
   ```bash
   cp .env.example .env
   ```

2. **Isi dengan nilai Firebase config Anda:**
   ```env
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   # ... dst
   ```

3. **Untuk Netlify deployment:**
   - Buka Netlify Dashboard → Site settings → Environment variables
   - Tambahkan semua `VITE_FIREBASE_*` variables
   - Redeploy site

### 5. Test Admin Access

1. **Login ke `/admin` dengan akun admin yang sudah dibuat**
2. **Jika masih belum bisa akses admin:**
   - Sign out dan sign in lagi
   - Atau refresh token dengan memanggil `refreshClaims()` di context

### 6. Struktur Firebase yang Sudah Siap

✅ **Firebase Authentication** - Login/logout dengan email/password  
✅ **Firestore Database** - Semua data portfolio tersimpan di cloud  
✅ **Firebase Analytics** - Tracking user behavior  
✅ **Admin Claims** - Role-based access control  
✅ **Security Rules** - Proper data access control  

## 🚀 Fitur Admin Dashboard

- **Projects Management** - CRUD operations untuk projects
- **Skills Management** - Manage technical skills
- **Profile Management** - Update profile information  
- **Experience & Education** - Manage work history
- **Contact Messages** - View messages dari contact form
- **Real-time Sync** - Data otomatis tersinkron dengan Firestore

## 🔧 Troubleshooting

**Problem: Admin access denied**
- Pastikan custom claim sudah di-set dengan `setAdminClaim.js`
- User harus sign out dan sign in lagi setelah claim di-set

**Problem: Firestore permission denied**
- Cek security rules sudah di-publish
- Pastikan user sudah authenticated

**Problem: Environment variables tidak terbaca**
- Pastikan prefix `VITE_` untuk Vite
- Restart development server setelah update .env

## 📞 Support

Jika ada masalah, cek:
1. Firebase Console untuk error logs
2. Browser console untuk JavaScript errors
3. Network tab untuk failed requests
