// postcss.config.cjs
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'), // Alterado de 'tailwindcss' para '@tailwindcss/postcss'
    require('autoprefixer')
  ],
};