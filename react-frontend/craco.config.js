module.exports = {
  devServer: {
    host: 'localhost',
    port: 3000,
    allowedHosts: 'all',
    client: {
      webSocketURL: 'ws://localhost:3000/ws',
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // Fix for potential issues with webpack dev server
      if (webpackConfig.devServer) {
        webpackConfig.devServer.allowedHosts = 'all';
      }
      return webpackConfig;
    },
  },
};
