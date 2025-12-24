import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({ 
      hostname: 'https://ontracourier.us',
      exclude: ['/tracking'], // This excludes the tracking page
      // Add the line below to fix the Netlify deploy error
      outDir: 'dist' 
    }) 
  ],
})