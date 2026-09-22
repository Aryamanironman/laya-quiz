/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        fire: '#ff6b35',
        neon: '#00ff88',
        dark: '#0a0a1a',
        card: '#1a1a2e',
      },
    },
  },
  plugins: [],
}
