import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Mirrors the "@/*" path in tsconfig.app.json — shadcn/ui's
      // generated imports (e.g. "@/components/ui/button") expect this.
      '@': `${import.meta.dirname}/src`,
    },
  },
})
