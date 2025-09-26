// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics, Analytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAV70eDRwtH3TSpBpLbgdnI7_Kuhk5MZZg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "portfolio-zakariaaf.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "portfolio-zakariaaf",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "portfolio-zakariaaf.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "376170317018",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:376170317018:web:d27970a46c4458e41891e3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-C2YRNT2MHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Initialize Storage
const storage = getStorage(app);

// Analytics disabled temporarily to avoid CSP eval issues
// let analytics: Analytics | undefined;
const analytics = undefined;

export { app, db, auth, analytics, storage };
export default app;
