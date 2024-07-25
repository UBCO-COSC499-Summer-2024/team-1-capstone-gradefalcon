const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://backend", 
      pathRewrite: { "^/api": "" },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
      },
      timeout: 5000, // Set timeout to 5 seconds
      proxyTimeout: 5000, // Set proxy timeout to 5 seconds
    })
  );
};