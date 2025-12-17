/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        chrimson: {
          50: '#fdf2f2',
          100: '#fde8e8',
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#f98080',
          500: '#f05252',
          600: '#e02424',
          700: '#B40000', // Primary Brand Color
          800: '#9b1c1c',
          900: '#771d1d',
          950: '#430b1b',
        },
        sand: {
          50: '#fbf9f6',
          100: '#f7f2ed',
          200: '#f1e6d8', // Warm Sand (Accent)
          300: '#e6d3ba',
          400: '#d7b895',
          500: '#ca9d74',
          600: '#bd865e',
          700: '#9d6b4c',
          800: '#815842',
          900: '#684838',
        },
        slate: {
          50: '#f4f6f8',
          100: '#eef2f6',
          200: '#dae0ea',
          300: '#bcc7d8',
          400: '#9aaaba',
          500: '#7d8e9f',
          600: '#627284',
          700: '#4f5b69',
          800: '#434c56',
          900: '#0f1724', // Deep Slate Blue (Text)
          950: '#080c13',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'blob': 'blob 10s infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      backgroundImage: {
        'gradient-mesh': 'radial-gradient(at 0% 0%, #F1E6D8 0px, transparent 50%), radial-gradient(at 100% 0%, #8B1E3F 0px, transparent 50%), radial-gradient(at 100% 100%, #0F1724 0px, transparent 50%), radial-gradient(at 0% 100%, #F1E6D8 0px, transparent 50%)',
      }
    },
  },
  plugins: [],
}