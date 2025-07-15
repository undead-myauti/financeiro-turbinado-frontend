/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        gray: {
          800: '#0f172a',
          900: '#020617',
        }
      }
    },
  },
  plugins: [],
} 