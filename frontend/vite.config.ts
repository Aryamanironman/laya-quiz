import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function stripCrossorigin() {
  return {
    name: 'strip-crossorigin',
    transformIndexHtml(html: string) {
      return html.replaceAll(' crossorigin', '')
    },
  }
}

export default defineConfig({
  plugins: [react(), stripCrossorigin()],
  base: './',
  build: {
    modulePreload: false,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
  preview: {
    port: 4173,
  },
})
