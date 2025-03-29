import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { env } from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccount = {
  type: 'service_account',
  project_id: env.FIREBASE_PROJECT_ID,
  private_key_id: env.FIREBASE_PRIVATE_KEY_ID,
  private_key: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: env.FIREBASE_CLIENT_EMAIL,
  client_id: env.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: env.FIREBASE_CLIENT_X509_CERT_URL
};

// Ensure Firebase Admin SDK is initialized only once
if (!admin.apps.length) {
  console.log('🔍 Initializing Firebase Admin SDK...');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${env.FIREBASE_PROJECT_ID}.appspot.com`
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
