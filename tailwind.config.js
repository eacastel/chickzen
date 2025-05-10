/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['var(--font-inter)', 'sans-serif'],
          serif: ['var(--font-playfair)', 'serif'],
        },
        colors: {
          background: '#fdfdfc',
          foreground: '#171717',
        },
      },
    },
    plugins: [require('@tailwindcss/typography')],
    darkMode: false,
  }
  