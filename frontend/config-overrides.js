module.exports = function override(config, env) {
  return {
    ...config,
    devServer: {
      allowedHosts: "all",
    },
  };
};
