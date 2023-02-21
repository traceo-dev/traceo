const tailwindcss = require("tailwindcss");
const env = require("postcss-preset-env");

module.exports = {
  plugins: [env, tailwindcss]
};
