import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change 'horror-portfolio' to your actual GitHub repo name
export default defineConfig({
  plugins: [react()],
  base: '/horror-portfolio/',
})
