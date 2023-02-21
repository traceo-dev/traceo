module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        "light-secondary": "#2d3139",
        primary: "#181b1f",
        secondary: "#22252b",
        canvas: "#111217",
        contrast: "#ffffff"
      },
      textColor: {
        primary: "#CCCCDC",
        secondary: "#CCCCDCA6"
      },
      fontSize: {
        "2xs": "11px"
      }
    }
  },
  plugins: []
};
