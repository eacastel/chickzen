import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
  fontFamily: {
    sans: ['var(--font-inter)', 'Arial', 'Helvetica', 'sans-serif'],
    serif: ['var(--font-playfair)', 'serif'],
  },
      colors: {
        background: '#fdfdfc',
        foreground: '#171717',
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontFamily: 'var(--font-playfair)',
              fontWeight: '700',
              color: '#171717',
            },
            h2: {
              fontFamily: 'var(--font-playfair)',
              fontWeight: '600',
              marginTop: '2em',
              marginBottom: '1em',
              color: '#171717',
            },
            p: {
              marginBottom: '1.25em',
              color: '#444',
            },
            ul: {
              marginBottom: '1.5em',
              paddingLeft: '1.25em',
              listStyleType: 'disc',
            },
            a: {
              color: '#5a7d88',
              textDecoration: 'underline',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
  darkMode: false,
}

export default config
