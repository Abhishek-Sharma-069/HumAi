import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account key using fs
const serviceAccountPath = resolve(__dirname, './serviceAccountKey.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

// Ensure Firebase Admin SDK is initialized only once
if (!admin.apps.length) {
  console.log('🔍 Initializing Firebase Admin SDK...');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
  });
} else {
  console.log('✅ Firebase Admin SDK already initialized');
}

// Export Firebase services
const app = admin.app(); // Use the default app
const auth = admin.auth(); // Reuse the default auth instance
const db = admin.firestore(); // Reuse the default Firestore instance
const storage = admin.storage(); // Reuse the default storage instance

export { app, auth, db, storage };