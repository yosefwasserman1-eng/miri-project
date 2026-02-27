/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // Ensure Tailwind uses logical properties or works well with MUI
  // by prefixing or disabling preflight if needed. Using standard for now.
  plugins: [],
}
