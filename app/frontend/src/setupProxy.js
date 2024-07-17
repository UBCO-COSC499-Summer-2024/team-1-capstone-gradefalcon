const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://backend", 
      pathRewrite: { "^/api": "" },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.sendStatus(500);
      }
    })
  );
};