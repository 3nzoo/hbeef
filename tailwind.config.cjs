/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '320px',
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.975rem',
      '4xl': '2.5rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
      '9xl': '8rem',
    },
    fontFamily: {
      dance: ['Dancing Script'],
    },
    lineHeight: {
      14: '8rem',
    },
    extend: {
      backgroundImage: {
        'mosaic-pattern': "url('/public/pattern.png')",
      },
      colors: {
        yellow: {
          250: '#FFF895',
          350: '#FFFCDF',
        },
        blue: {
          250: '#1B2FF0',
          550: '#020F8F',
        },
        red: {
          250: '#D0021B',
        },
        black: {
          250: 'rgba(0,0,0,0.55)',
        },
      },
    },
  },
  plugins: [],
};
