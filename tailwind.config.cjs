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
