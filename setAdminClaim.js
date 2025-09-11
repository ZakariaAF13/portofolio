// setAdminClaim.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Ganti dengan UID user yang akan dijadikan admin
// Dapatkan UID dari Firebase Console → Authentication → Users
const uid = 'USER_UID_DARI_CONSOLE'; // GANTI DENGAN UID YANG SEBENARNYA

console.log('Setting admin claim for user:', uid);

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('✅ Custom claim "admin" berhasil di-set untuk user:', uid);
    console.log('📝 Minta user untuk sign out dan sign in lagi untuk mengaktifkan admin access');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error setting custom claims:', err);
    console.log('💡 Pastikan:');
    console.log('   1. serviceAccountKey.json ada di folder yang sama');
    console.log('   2. UID user sudah benar');
    console.log('   3. User sudah terdaftar di Firebase Authentication');
    process.exit(1);
  });
