/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        freak: {
          // Fondos y Superficies
          dark: '#0b0e14',        // Fondo profundo (Deep Space)
          card: '#161b22',        // Superficie de tarjetas
          lighter: '#1e293b',     // Para elementos secundarios
          
          // Colores de Identidad (Fusionados y Mejorados)
          primary: '#bc13fe',     // El morado eléctrico que queríamos
          secondary: '#00f5ff',   // Cyan neón
          accent: '#ff007f',      // Rosa Cyberpunk (el tuyo era #ff6b6b, este tiene más "punch")
          
          // Estados (Mezcla de tus neones y los nuevos)
          success: '#39ff14',     // Tu verde neón
          warning: '#ffd166',     // Tu amarillo vibrante
          danger: '#ff4757',      // Tu rojo intenso
          gold: '#ffd700',        // Tu dorado
          
          // Sub-paleta Cyberpunk (Tus colores originales)
          cyber: {
            pink: '#ff2e63',
            blue: '#08d9d6',
            purple: '#9d50bb',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'], // Esta fuente es más clara pero futurista
        geek: ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        // Rescatadas y mejoradas
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'cyber-glow': 'cyberGlow 3s ease-in-out infinite alternate',
        'float': 'float 4s ease-in-out infinite',
        
        // Transiciones y Entrada (Tus originales)
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in',
        'scale-in': 'scaleIn 0.2s ease-out',
        
        // Nuevas Adictivas
        'border-flow': 'borderFlow 4s linear infinite',
        'glitch': 'glitch 0.3s cubic-bezier(.25,.46,.45,.94) both infinite',
      },
      keyframes: {
        // Mantengo tus lógicas de glow pero con los nuevos colores
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(57, 255, 20, 0.4)', transform: 'scale(1)' },
          '100%': { boxShadow: '0 0 20px rgba(57, 255, 20, 0.8)', transform: 'scale(1.02)' },
        },
        cyberGlow: {
          '0%': { boxShadow: '0 0 10px rgba(255, 46, 99, 0.4), 0 0 10px rgba(8, 217, 214, 0.4)' },
          '100%': { boxShadow: '0 0 25px rgba(255, 46, 99, 0.9), 0 0 40px rgba(8, 217, 214, 0.9)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        borderFlow: {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '200% 50%' },
        },
        // Keyframes de movimiento para slides (Tus originales implícitos)
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '25%': { transform: 'translate(-2px, 2px)' },
          '50%': { transform: 'translate(2px, -2px)' },
          '75%': { transform: 'translate(-2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        }
      },
      // Tus bordes y blurs personalizados
      borderRadius: {
        card: '16px',
        button: '12px',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}