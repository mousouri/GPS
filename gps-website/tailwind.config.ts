export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef8ff',
          100: '#d9eeff',
          200: '#bce2ff',
          300: '#8ed1ff',
          400: '#59b7ff',
          500: '#3396ff',
          600: '#1a75f5',
          700: '#135ee1',
          800: '#164db6',
          900: '#18438f',
          950: '#142a57',
        },
        accent: {
          50: '#edfcf2',
          100: '#d3f8df',
          200: '#aaf0c4',
          300: '#73e2a3',
          400: '#3bcc7e',
          500: '#17b364',
          600: '#0b9050',
          700: '#097342',
          800: '#0b5b36',
          900: '#0a4b2e',
          950: '#042a1a',
        },
        dark: {
          800: '#1a1a2e',
          900: '#0f0f1a',
          950: '#080810',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
