// setAdminClaim.js
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Auto-generate: Get first user from Firebase Auth and make them admin
async function getFirstUserAndSetAdmin() {
  try {
    const listUsers = await admin.auth().listUsers(1);
    if (listUsers.users.length === 0) {
      console.log('❌ No users found in Firebase Authentication');
      console.log('💡 Create a user first by signing up through your app');
      process.exit(1);
    }
    
    const user = listUsers.users[0];
    console.log('🔍 Found user:', user.email || user.uid);
    return user.uid;
  } catch (error) {
    console.error('❌ Error listing users:', error);
    process.exit(1);
  }
}

const uid = await getFirstUserAndSetAdmin();

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
