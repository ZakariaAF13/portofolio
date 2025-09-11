# 🔥 Firestore Database Configuration Guide

## 📋 Step-by-Step Setup

### 1. **Buka Firebase Console**
1. Pergi ke [Firebase Console](https://console.firebase.google.com/)
2. Pilih project Anda
3. Klik **Firestore Database** di sidebar kiri

### 2. **Pilih Mode Database**
Anda akan melihat 2 opsi:
- **Start in test mode** (Development)
- **Start in production mode** (Production)

**Pilih "Start in production mode"** untuk keamanan yang lebih baik.

### 3. **Pilih Lokasi Database**
Pilih lokasi server yang terdekat dengan target user Anda:
- **asia-southeast1** (Singapore) - Untuk Indonesia
- **us-central1** (Iowa) - Untuk global/US
- **europe-west1** (Belgium) - Untuk Eropa

### 4. **Configure Security Rules**

Setelah database dibuat, Anda perlu mengatur security rules:

#### A. Buka Tab "Rules"
1. Di Firestore Database, klik tab **"Rules"**
2. Anda akan melihat rules default yang sangat ketat:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false; // Tidak ada akses sama sekali
    }
  }
}
```

#### B. Replace dengan Production Rules
Copy paste rules berikut ke editor:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Portfolio collections - public read, admin write
    match /portfolio_projects/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /portfolio_skills/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /portfolio_profile/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /portfolio_what_i_do/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /portfolio_knowledge/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /portfolio_experiences/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /portfolio_educations/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Contact messages - anyone can create, admin can read/update
    match /contact_messages/{document} {
      allow read, update, delete: if request.auth != null && request.auth.token.admin == true;
      allow create: if true; // Anyone can send contact messages
    }
  }
}
```

#### C. Publish Rules
1. Klik tombol **"Publish"**
2. Tunggu hingga rules berhasil di-deploy

## 🛡️ Penjelasan Security Rules

### Portfolio Collections
- **Read Access**: `if true` - Semua orang bisa membaca data portfolio
- **Write Access**: `if request.auth != null && request.auth.token.admin == true`
  - Hanya user yang authenticated DAN memiliki custom claim `admin = true`

### Contact Messages
- **Create**: `if true` - Siapa saja bisa mengirim pesan contact
- **Read/Update/Delete**: Hanya admin yang bisa mengelola pesan

## 🔧 Testing Rules

### 1. **Rules Playground**
Firebase Console menyediakan Rules Playground untuk testing:
1. Klik tab **"Rules"** → **"Rules Playground"**
2. Test berbagai skenario:
   - Unauthenticated user reading portfolio data ✅
   - Unauthenticated user writing portfolio data ❌
   - Admin user writing portfolio data ✅
   - Anyone creating contact message ✅

### 2. **Real Application Testing**
1. Buka website Anda
2. Test portfolio data loading (harus berhasil)
3. Test contact form submission (harus berhasil)
4. Login ke admin dan test CRUD operations (harus berhasil)

## 🚨 Troubleshooting

### Error: "Missing or insufficient permissions"
**Penyebab**: Rules terlalu ketat atau user tidak memiliki admin claim

**Solusi**:
1. Pastikan rules sudah di-publish dengan benar
2. Untuk admin operations, pastikan user memiliki custom claim `admin: true`
3. Run `setAdminClaim.js` untuk set admin privileges

### Error: "Permission denied"
**Penyebab**: User mencoba akses yang tidak diizinkan rules

**Solusi**:
1. Check console browser untuk error detail
2. Verify rules syntax di Firebase Console
3. Pastikan authentication state sudah benar

### Data tidak muncul di website
**Penyebab**: Rules memblokir read access atau data belum ada

**Solusi**:
1. Pastikan rules allow `read: if true` untuk portfolio collections
2. Run `seedFirestore.js` untuk populate data awal
3. Check Network tab di DevTools untuk failed requests

## 📊 Collections Structure

Setelah rules di-setup, Anda akan memiliki collections berikut:

```
📁 portfolio_projects/
📁 portfolio_skills/
📁 portfolio_profile/
📁 portfolio_what_i_do/
📁 portfolio_knowledge/
📁 portfolio_experiences/
📁 portfolio_educations/
📁 contact_messages/
```

## ✅ Verification Checklist

- [ ] Database created in production mode
- [ ] Security rules published successfully
- [ ] Portfolio data readable by public
- [ ] Contact form can submit messages
- [ ] Admin user can login to `/admin`
- [ ] Admin can perform CRUD operations
- [ ] Rules tested in playground

## 🎯 Next Steps

1. **Set up admin user**: Run `setAdminClaim.js`
2. **Seed initial data**: Run `seedFirestore.js`
3. **Test admin dashboard**: Login to `/admin`
4. **Deploy website**: Push to production

Your Firestore database is now configured securely and ready for production! 🚀
