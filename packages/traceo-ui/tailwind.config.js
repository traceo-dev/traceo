module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        secondary: "#22252b",
        "light-secondary": "#2d3139",
        canvas: "#111217",
        link: "#6e9fff",
        contrast: "#ffffff",
      },
      fontSize: {
        "2xs": "11px",
      },
    },
  },
  plugins: [],
};
