/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // FreakMarket Geek Color Palette
        freak: {
          primary: '#6a0dad',       // Morado vibrante
          secondary: '#00b4d8',     // Azul eléctrico
          accent: '#ff6b6b',        // Rojo vibrante
          success: '#51cf66',       // Verde neón
          warning: '#ffd166',       // Amarillo vibrante
          danger: '#ff4757',        // Rojo intenso
          info: '#0652dd',          // Azul profundo
          dark: '#1a1a2e',          // Oscuro profundo
          light: '#f8f9fa',        // Claro suave
          neon: '#39ff14',          // Verde neón
          gold: '#ffd700',          // Dorado
          cyber: {
            pink: '#ff2e63',        // Rosa cyberpunk
            blue: '#08d9d6',        // Azul cyberpunk
            purple: '#9d50bb',      // Morado cyberpunk
          },
        },
        // Gradient colors for geek theme
        gradient: {
          cyberpunk: 'linear-gradient(135deg, #ff2e63 0%, #08d9d6 50%, #9d50bb 100%)',
          retro: 'linear-gradient(135deg, #6a0dad 0%, #00b4d8 100%)',
          neon: 'linear-gradient(135deg, #39ff14 0%, #ffd700 100%)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter'],
        geek: ['"Press Start 2P"', 'cursive'], // Fuente estilo retro para títulos
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
        'cyber-glow': 'cyberGlow 3s ease-in-out infinite alternate',
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
        },
        cyberGlow: {
          '0%': {
            boxShadow: '0 0 5px rgba(255, 46, 99, 0.5), 0 0 10px rgba(8, 217, 214, 0.5)',
            transform: 'scale(1)'
          },
          '50%': {
            boxShadow: '0 0 10px rgba(255, 46, 99, 0.8), 0 0 20px rgba(8, 217, 214, 0.8)',
            transform: 'scale(1.02)'
          },
          '100%': {
            boxShadow: '0 0 15px rgba(255, 46, 99, 1), 0 0 30px rgba(8, 217, 214, 1)',
            transform: 'scale(1.05)'
          },
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(57, 255, 20, 0.3)',
        cyber: '0 0 20px rgba(255, 46, 99, 0.3), 0 0 40px rgba(8, 217, 214, 0.2)',
        neon: '0 0 10px rgba(57, 255, 20, 0.5), 0 0 20px rgba(57, 255, 20, 0.3)',
      },
      borderRadius: {
        card: '16px',
        button: '12px',
        input: '12px',
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
