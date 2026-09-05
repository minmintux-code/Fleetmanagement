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
        fleet: {
          bg: '#120B08',
          card: '#1C120D',
          border: '#382218',
          primary: '#C87A38',
          primaryDark: '#B36423',
          primaryLight: '#E89A4F',
          success: '#22C55E',
          warning: '#D48B46',
          danger: '#EF4444',
          text: '#FBF8F3',
          secondary: '#A39185',
        },
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '14px',
        md: '10px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
}

