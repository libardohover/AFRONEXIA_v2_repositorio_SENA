import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // El frontend llama a /api/... y Vite lo reenvía al backend: evita problemas de CORS en desarrollo.
    proxy: { '/api': { target: 'http://127.0.0.1:5000', changeOrigin: true } },
  },
});
