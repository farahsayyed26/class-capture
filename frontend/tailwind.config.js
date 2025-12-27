/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#A3B3D1', // Panels, highlights
          main: '#8094BD',  // Buttons, main UI
          muted: '#61688C', // Secondary elements
          dark: '#343750',  // Text, icons, contrast
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Optional: cleaner font
      }
    },
  },
  plugins: [],
}