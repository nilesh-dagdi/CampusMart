import { defineConfig } from 'vite'
// Trigger deploy
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
