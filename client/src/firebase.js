import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForDevAstronautApp2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "astrovital-nasa.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "astrovital-nasa",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "astrovital-nasa.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "109876543210",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:109876543210:web:abcdef123456"
};

let app, auth, db;
let isFirebaseConnected = false;

try {
  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    isFirebaseConnected = true;
  } else {
    // Development Mock Mode
    console.info('[ASTROVITAL] Running with local simulated database and role authentication.');
  }
} catch (err) {
  console.warn('[ASTROVITAL] Firebase initialization skipped, running in mock telemetry mode:', err.message);
}

export { app, auth, db, isFirebaseConnected };
