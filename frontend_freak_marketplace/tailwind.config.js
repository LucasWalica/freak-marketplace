/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Glassmorphism color palette
        glass: {
          primary: '#0f172a',
          secondary: '#1e293b', 
          accent: '#3b82f6',
          light: '#f8fafc',
          dark: '#1e293b',
          border: 'rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.05)',
          overlay: 'rgba(15, 23, 42, 0.15)',
          shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          glow: '0 0 20px rgba(57, 255, 20, 0.3)',
        },
        // Existing colors (kept for compatibility)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#fef3c7',
          100: '#fde68a',
          200: '#fcd34d',
          300: '#fbbf24',
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        // Boost colors
        neon: '#39ff14',
        gold: '#ffd700',
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          text: '#f1f5f9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px rgba(57, 255, 20, 0.5)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 10px rgba(57, 255, 20, 0.8)',
            transform: 'scale(1.05)'
          },
          '100%': { 
            boxShadow: '0 0 15px rgba(57, 255, 20, 1)',
            transform: 'scale(1.1)'
          },
        }
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
        glassHover: '0 8px 32px rgba(57, 255, 20, 0.15)',
        glow: '0 0 20px rgba(57, 255, 20, 0.3)',
      },
      borderRadius: {
        glass: '16px',
        card: '12px',
        button: '8px',
      },
      spacing: {
        '18': '4.5rem',
        '20': '5rem',
        '24': '6rem',
      }
    },
  },
  plugins: [],
}
