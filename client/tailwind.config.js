/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['Satoshi', 'DM Sans', 'Inter', 'sans-serif'],
        'general-sans': ['General Sans', 'DM Sans', 'Inter', 'sans-serif'],
      },
      colors: {
        neon: {
          teal: '#0d9488',
          cyan: '#06b6d4',
          green: '#10b981',
          red: '#ef4444',
          amber: '#f59e0b',
          purple: '#8b5cf6',
        },
        mono: {
          0: '#000000',
          50: '#0A0A0A',
          100: '#111111',
          150: '#171717',
          200: '#1A1A1A',
          300: '#262626',
          400: '#525252',
          500: '#737373',
          600: '#9CA3AF',
          700: '#A3A3A3',
          800: '#D4D4D4',
          900: '#E5E7EB',
          950: '#F3F4F6',
          1000: '#FAFAFA',
          white: '#FFFFFF',
        },
      },
      keyframes: {
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        slideInUp: 'slideInUp 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};
