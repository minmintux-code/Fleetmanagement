import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            // Silently suppress ECONNREFUSED terminal noise when backend is starting
            if (res && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ status: 503, message: 'Backend service initializing...' }));
            }
          });
        },
      },
    },
  },
});
