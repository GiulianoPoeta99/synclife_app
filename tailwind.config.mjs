/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        lightHover: '#D593D1',
        lightColor: '#D593D1',
        darkBg: '#121212',
        darkContainer: '#1E1E1E',
        darkAccent: '#FF8C00',
        darkHover: '#FF1490',
        darkText: '#F5F5F5',
        darkMuted: '#BDBDBD',
      },
    },
  },
  plugins: [require('daisyui')],
};
