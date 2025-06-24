import "./app/globals.css";

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",  // for React/Next.js
    "./public/index.html",         // for simple HTML projects
    "./app/**/*.{js,ts,jsx,tsx}",  // for Next.js 13+ app directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
