const proxy = require("http-proxy-middleware");

const getLocalAzureToken = require("./local-azure");

const missingTokenError = {
  error: {
    code: "InvalidAuthenticationToken",
    message: "Unable to find an access token to send"
  }
};

module.exports = function azureProxyMiddleware(config) {
  const options = {
    target: "https://management.azure.com",
    changeOrigin: true,
    onProxyReq
  };

  return proxy(options);

  function onProxyReq(proxyReq, req, res) {
    // Trim middleware's mount path off the front of the proxy path
    proxyReq.path = proxyReq.path.substring(req.baseUrl.length);

    const token = getValidToken(req);
    if (!token) {
      proxyReq.abort();
      res.status(401).json(missingTokenError);
    }
    proxyReq.setHeader("Authorization", `Bearer ${token}`);
  }

  function getValidToken(req) {
    if (config.aadAuth) {
      return req.headers["x-ms-token-aad-access-token"];
    }
    return getLocalAzureToken();
  }
};
