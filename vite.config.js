import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  appType: 'spa',
  build: {
    // Raise the warning threshold so expected large chunks don't spam the log.
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Split heavy dependencies into their own cached chunks so the main
        // bundle stays small and browsers only re-download what changed.
        manualChunks: {
          // React core — almost never changes
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Excalidraw is ~3 MB; isolate it so it only loads on the Notes page
          'vendor-excalidraw': ['@excalidraw/excalidraw'],
          // Supabase client
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
})
