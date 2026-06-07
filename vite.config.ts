import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Project page lives at https://ali-hamedi.github.io/model-optimization/
// The base MUST match the repo name or hashed assets 404 in production.
export default defineConfig({
  base: '/model-optimization/',
  plugins: [react()],
});
