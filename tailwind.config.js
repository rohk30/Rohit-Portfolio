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
        // Custom background color for the portfolio
        background: '#0a0a0a',
        // Accent colors based on design spec
        accent: {
          DEFAULT: '#60a5fa', // blue-400
          hover: '#3b82f6',   // blue-500
        },
        // Glassmorphism surface colors
        glass: {
          DEFAULT: 'rgba(15, 23, 42, 0.4)', // slate-900/40
          hover: 'rgba(30, 41, 59, 0.5)',   // slate-800/50
          border: 'rgba(255, 255, 255, 0.1)',
          'border-hover': 'rgba(255, 255, 255, 0.2)',
        },
      },
      backdropBlur: {
        glass: '12px',
      },
      boxShadow: {
        'glass': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glass-hover': '0 25px 50px -12px rgba(59, 130, 246, 0.1)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'ticker': 'ticker 20s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
