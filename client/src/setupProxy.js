const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // 백엔드의 index.js에서 선언한 포트가 5000이므로, 여기도 5000으로 맞춘다.
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};