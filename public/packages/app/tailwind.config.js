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
        primary: "#1a1c20",
        secondary: "#22252b",
        canvas: "#131517",
        link: "#6e9fff",
        contrast: "#ffffff",
        error: "#9a1950"
      },
      textColor: {
        primary: "#CCCCDC",
        secondary: "#CCCCDCA6",
        error: "#9a1950"
      },
      fontSize: {
        "2xs": "11px"
      }
    }
  },
  plugins: []
};
