module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@core": "./src/core",
            "@application": "./src/application",
            "@infrastructure": "./src/infrastructure",
            "@ui": "./src/ui",
            "@navigation": "./src/navigation",
            "@config": "./src/config",
          },
        },
      ],
    ],
  };
};
