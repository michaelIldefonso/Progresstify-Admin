import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()) // Load environment variables

  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      port: parseInt(env.VITE_PORT, 10) || 3000, // Load VITE_PORT properly
    },
  }
})
