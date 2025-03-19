import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBXQZx9DXVmIn5ZnQq5D9GsLB2VqRpHH-Y",
  authDomain: "humai-health.firebaseapp.com",
  projectId: "humai-health",
  storageBucket: "humai-health.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);