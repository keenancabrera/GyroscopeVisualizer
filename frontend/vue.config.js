const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/GyroscopeVisualizer/" : "/",
  pages: {
    index: {
      entry: 'src/main.js',
      title: "Gyroscope Visualizer"
    }
  }
})
