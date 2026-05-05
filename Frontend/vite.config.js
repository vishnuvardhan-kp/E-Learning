import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Make API_URL available globally as a constant
    API_URL: 'window.API_URL',
    __API_URL__: 'window.API_URL' // Maintain compatibility with older code
  }
})
