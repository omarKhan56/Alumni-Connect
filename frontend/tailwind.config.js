/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],

  theme: {
    extend: {

      /* 🎨 COLORS */
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5bafc',
          400: '#8193f8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },

        accent: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },

        /* 🌑 DARK UI BASE */
        dark: {
          100: '#0f172a',
          200: '#020617',
          300: '#020617',
        }
      },

      /* 🔤 FONTS */
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },

      /* 🌈 GRADIENTS */
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right, #8b5cf6, #3b82f6)',
        'glass-gradient': 'linear-gradient(to bottom right, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
      },

      /* 💎 SHADOWS */
      boxShadow: {
        card: '0 10px 30px rgba(0,0,0,0.3)',
        glow: '0 0 25px rgba(139,92,246,0.4)',
        hover: '0 20px 40px rgba(0,0,0,0.4)',
      },

      /* 🔥 BLUR (Glassmorphism) */
      backdropBlur: {
        xs: '2px',
      },

      /* 🎬 ANIMATIONS */
      animation: {
        'fade-in': 'fadeIn .4s ease forwards',
        'slide-up': 'slideUp .4s ease forwards',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },

  plugins: [],
}