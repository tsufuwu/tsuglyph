/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        unipad: {
          dark: '#0f1117',
          card: '#181b24',
          border: '#2a2f3f',
          accent: '#3b82f6',
          green: '#10b981',
          red: '#ef4444',
          yellow: '#f59e0b',
          purple: '#8b5cf6',
          cyan: '#06b6d4',
        }
      },
      boxShadow: {
        glow: '0 0 20px -5px rgba(59, 130, 246, 0.5)',
        glowGreen: '0 0 20px -5px rgba(16, 185, 129, 0.5)',
        glowYellow: '0 0 20px -5px rgba(245, 158, 11, 0.5)',
      }
    },
  },
  plugins: [],
};
