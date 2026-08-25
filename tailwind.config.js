/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#08080a',
          900: '#0f1013',
          850: '#14151a',
          800: '#1a1b22',
          750: '#22232c',
          700: '#2a2c37',
          600: '#383a48',
          500: '#525464',
          400: '#76798c',
          300: '#a3a6b7',
          200: '#cfd2df',
          100: '#f0f1f6',
        },
        brand: {
          DEFAULT: '#ffffff',
          light: '#f4f4f5',
          dark: '#18181b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(255, 255, 255, 0.05)',
        'glow-card': '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'glow-modal': '0 25px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'glow-button': '0 0 20px 2px rgba(255, 255, 255, 0.12)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.2s ease-out',
        'slideUp': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'slideIn': 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}
