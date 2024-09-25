const path = require('path');
const { override, addWebpackAlias, overrideDevServer } = require('customize-cra');

const devServerConfig = () => config => {
  // Remove undefined values and ensure each allowedHost is a non-empty string
  if (!config.allowedHosts) {
    config.allowedHosts = [];
  }
  config.allowedHosts = config.allowedHosts.filter(host => typeof host === 'string' && host.trim() !== '');
  config.allowedHosts.push('localhost');
  
  console.log('Current devServer config after setting allowedHosts:', config);
  return config;
};

module.exports = {
  webpack: override(
    addWebpackAlias({
      '@': path.resolve(__dirname, 'src'),
    }),
  ),
  devServer: overrideDevServer(devServerConfig())
};
