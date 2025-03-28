import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

// Load environment variables
config();

// Required environment variables
const requiredEnvVars = {
  frontend: [
    'VITE_APP_FIREBASE_API_KEY',
    'VITE_APP_FIREBASE_AUTH_DOMAIN',
    'VITE_APP_FIREBASE_PROJECT_ID',
    'VITE_APP_FIREBASE_STORAGE_BUCKET',
    'VITE_APP_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_APP_FIREBASE_APP_ID'
  ],
  backend: [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_CLIENT_ID',
    'FIREBASE_CLIENT_X509_CERT_URL',
    'FIREBASE_API_KEY',
    'FIREBASE_TOKEN',
    'PORT',
    'NODE_ENV'
  ],
  external: ['OPENAI_API_KEY']
};

// Validate environment variables
const validateEnv = () => {
  const missingVars = [];
  
  Object.entries(requiredEnvVars).forEach(([section, vars]) => {
    vars.forEach(variable => {
      if (!process.env[variable]) {
        missingVars.push(variable);
      }
    });
  });

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
  }
};

// Validate project structure
const validateProjectStructure = () => {
  const requiredPaths = [
    './frontend',
    './backend',
    './frontend/package.json',
    './backend/package.json',
    './frontend/vite.config.prod.js',
    './backend/config/production.js'
  ];

  const missingPaths = requiredPaths.filter(path => !existsSync(resolve(process.cwd(), path)));

  if (missingPaths.length > 0) {
    console.error('❌ Missing required project files/directories:', missingPaths.join(', '));
    process.exit(1);
  }
};

// Production build configuration
const productionConfig = {
  frontend: {
    buildCommand: 'npm run build',
    outputDir: 'dist',
    configFile: 'vite.config.prod.js'
  },
  backend: {
    buildCommand: 'npm run build',
    startCommand: 'npm start',
    configFile: 'config/production.js'
  }
};

// Export configuration
export {
  validateEnv,
  validateProjectStructure,
  productionConfig
};