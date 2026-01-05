const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  chainWebpack: (config) => {
    config.performance.maxEntrypointSize(4000000).maxAssetSize(4000000);
  },
});
