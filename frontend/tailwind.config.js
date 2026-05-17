/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FF7F50',
        linen: '#FAF0E6',
        'card-bg': '#FDF6EC',
        success: '#2E8B57',
        error: '#CD5C5C',
        'text-heading': '#333333',
        'text-body': '#555555',
        'text-muted': '#AAAAAA',
        'border-warm': '#e6d8cb',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        neu: '6px 6px 12px #e6d8cb, -6px -6px 12px #ffffff',
        'neu-sm': '2px 2px 4px #d9d2cb, -2px -2px 4px #ffffff',
        'neu-inset': 'inset 6px 6px 12px #e6d8cb, inset -6px -6px 12px #ffffff',
        'neu-pressed': 'inset 2px 2px 4px #d9d2cb, inset -2px -2px 4px #ffffff',
      },
    },
  },
  plugins: [],
}
