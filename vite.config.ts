import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    host: true,
    proxy: {
      
        // target: 'https://e7d1-113-199-192-49.ngrok-free.app',
        '/transcribe': {
        target: 'http://fs.wiseyak.com:8048/',
        changeOrigin: false,

        
        // '/patients/audio': {
        // target: 'https://6864-2400-1a00-4b45-7fb0-d18d-e3d-ea9c-2aa6.ngrok-free.app',
        // changeOrigin: true,
        
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', req.method, req.url);
          });
        }
      }
    }
  }
})


