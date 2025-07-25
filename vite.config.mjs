import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = env.VITE_APP_API;
  const PORT = parseInt(env.PORT) || 2020;

  return {
    server: {
      open: true,
      port: PORT,
      host: true,   
      proxy: {
        '/public': {
          target: API_URL,
          changeOrigin: true,
          rewrite: (path) => path,
        },
        '/countries': {
          target: API_URL,
          changeOrigin: true,
          rewrite: (path) => path,
        },
        // Add more API routes as needed
      },
    },
    preview: {
      open: true,
      host: true
    },
    define: {
      global: 'window'
    },
    resolve: {
      alias: []
    },
    base: '/',
    plugins: [react(), jsconfigPaths()]
  };
});
