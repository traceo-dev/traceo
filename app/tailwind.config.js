module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        primary: "#1B1B28",
        secondary: "#282A3B",
        canvas: "#14141F"
      }
    }
  },
  plugins: []
};
