/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'hsl(220, 100%, 98%)',
          100: 'hsl(220, 100%, 95%)',
          200: 'hsl(220, 100%, 90%)',
          300: 'hsl(220, 100%, 82%)',
          400: 'hsl(220, 100%, 70%)',
          500: 'hsl(220, 100%, 60%)',
          600: 'hsl(220, 100%, 50%)',
          700: 'hsl(220, 90%, 45%)',
          800: 'hsl(220, 85%, 40%)',
          900: 'hsl(220, 80%, 35%)',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.1)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        'gradient-primary': 'linear-gradient(135deg, hsl(220, 100%, 60%), hsl(220, 90%, 45%))',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)' },
        }
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}