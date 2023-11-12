const colors = require('tailwindcss/colors')
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      mapBg: '#FBF8F4',
      dark: colors.slate[900],
      darkLight: colors.slate[700],
      gray: colors.slate[400],
      light: colors.slate[200],
      white: colors.slate[50],
      primary: colors.sky[600],
      success: '#27C485',
      warning: '#F1B650',
      error: '#EC2D18',
    },
    extend: {
      fontSize: {
        base: ['18px', '24px'],
        small: ['16px', '20px'],
      },
      fontFamily: {
        sans: ['var(--font-catamaran)', ...fontFamily.sans],
      },
    },
  },
}
