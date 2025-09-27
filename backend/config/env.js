import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables from backend directory
config({ path: '.env' });

// Define validation schema for environment variables
const envSchema = z.object({
  // Firebase Service Account Credentials (optional in production)
  FIREBASE_PROJECT_ID: z.string().min(1).optional(),
  FIREBASE_PRIVATE_KEY_ID: z.string().min(1).optional(),
  FIREBASE_PRIVATE_KEY: z.string().min(1).optional(),
  FIREBASE_CLIENT_EMAIL: z.string().email().optional(),
  FIREBASE_CLIENT_ID: z.string().min(1).optional(),
  FIREBASE_CLIENT_X509_CERT_URL: z.string().url().optional(),
  FIREBASE_API_KEY: z.string().min(1).optional(),
  FIREBASE_TOKEN: z.string().min(1).optional(),

  // Frontend Environment Variables
  FRONTEND_URL: z.string().optional().default('http://localhost:5173'),

  // Backend Environment Variables
  PORT: z.string().transform(Number).pipe(z.number().positive()).optional().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),

  // API Keys for External Services (optional in production)
  GEMINI_API_KEY: z.string().min(1).optional()
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