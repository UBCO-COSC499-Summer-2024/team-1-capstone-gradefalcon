const { override, addWebpackResolve } = require('customize-cra');

module.exports = override(
  addWebpackResolve({
    fallback: {
      "console": require.resolve("console-browserify"),
      "util": require.resolve("util/"),
      "assert": require.resolve("assert/"),
    },
  })
);
