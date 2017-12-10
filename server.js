const http = require('http');

const config = require('./server/config');
const azureProxyMiddleware = require('./server/azure')(config);
const app = require('./server/app')(config, azureProxyMiddleware);

const server = http.createServer(app);
server.listen(config.port, () => {
  console.log("listening on http://localhost:%d", config.port);
});
