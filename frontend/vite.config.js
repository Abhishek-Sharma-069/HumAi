import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on mode in the root directory
  process.env = { ...process.env, ...loadEnv(mode, path.resolve(__dirname, '..'), '') };

  return {
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  preview: {
    port: 4173
  }
  };
});
