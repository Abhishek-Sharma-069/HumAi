import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDKrnRJYKt99lTH-pJIa5e9v2ROy6nMXf8",
  authDomain: "humai-069s.firebaseapp.com",
  projectId: "humai-069s",
  storageBucket: "humai-069s.firebasestorage.app",
  messagingSenderId: "792570618581",
  appId: "1:792570618581:web:8f30cbce408acac0b1385c",
  measurementId: "G-B8R3CJ7D2S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, googleProvider, analytics };