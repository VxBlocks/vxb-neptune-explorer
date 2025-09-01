
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.NEXT_PUBLIC_API_URL || 'https://neptune.vxb.ai',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    })
  );
};