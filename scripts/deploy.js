import { validateEnv, validateProjectStructure, productionConfig } from '../deploy.config.js';
import { execSync } from 'child_process';
import { resolve } from 'path';

const deploy = async () => {
  try {
    console.log('🔍 Validating environment and project structure...');
    validateEnv();
    validateProjectStructure();

    // Frontend build
    console.log('🏗️ Building frontend...');
    process.chdir(resolve(process.cwd(), 'frontend'));
    execSync(`npm install`, { stdio: 'inherit' });
    execSync(`npm run build -- --config ${productionConfig.frontend.configFile}`, { stdio: 'inherit' });

    // Backend build
    console.log('🏗️ Building backend...');
    process.chdir(resolve(process.cwd(), '../backend'));
    execSync(`npm install`, { stdio: 'inherit' });
    execSync(`npm run build`, { stdio: 'inherit' });

    // Start production server
    console.log('🚀 Starting production server...');
    execSync('npm start', { stdio: 'inherit' });

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
};

deploy();