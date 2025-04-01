import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables from root directory
config({ path: '../.env' });

// Define validation schema for environment variables
const envSchema = z.object({
  // Firebase Service Account Credentials
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_PRIVATE_KEY_ID: z.string().min(1),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_CLIENT_ID: z.string().min(1),
  FIREBASE_CLIENT_X509_CERT_URL: z.string().url(),
  FIREBASE_API_KEY: z.string().min(1),
  FIREBASE_TOKEN: z.string().min(1),

  // Frontend Environment Variables
  FRONTEND_URL: z.string().url().optional().default('http://localhost:5174'),

  // Backend Environment Variables
  PORT: z.string().transform(Number).pipe(z.number().positive()),
  NODE_ENV: z.enum(['development', 'production', 'test']),

  // API Keys for External Services
  GEMINI_API_KEY: z.string().min(1).refine(val => val !== 'your-gemini-api-key', {
    message: 'Please replace the default Gemini API key with your actual API key'
  })
});

// Validate environment variables
const validateEnv = () => {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    console.error('❌ Environment validation failed:', error.errors);
    process.exit(1);
  }
};

// Export validated environment variables
export const env = validateEnv();