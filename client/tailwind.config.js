/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        astro: {
          bg: '#f8fafc', // slate-50
          surface: '#ffffff',
          card: '#ffffff',
          border: '#e2e8f0', // slate-200
          textPrimary: '#0f172a', // slate-900
          textSecondary: '#475569', // slate-600
          textMuted: '#94a3b8', // slate-400
          primary: '#0284c7', // sky-600
          primaryLight: '#e0f2fe',
          teal: '#0d9488', // teal-600
          tealLight: '#ccfbf1',
          normal: '#10b981', // emerald-500
          normalLight: '#d1fae5',
          warning: '#f59e0b', // amber-500
          warningLight: '#fef3c7',
          critical: '#ef4444', // red-500
          criticalLight: '#fee2e2',
        }
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'elevated': '0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
      }
    },
  },
  plugins: [],
}
