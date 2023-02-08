module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        "light-secondary": "#1C202E",
        primary: "#1b1b28",
        secondary: "#282a3b",
        canvas: "#14141f",
        link: "#6e9fff",
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
