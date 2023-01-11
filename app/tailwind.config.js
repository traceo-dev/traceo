module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        primary: "#181b1f",
        secondary: "#22252b",
        "light-secondary": "#2d3139",
        canvas: "#111217"
      }
    }
  },
  plugins: []
};
