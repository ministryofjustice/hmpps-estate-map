const http = require("http");

const config = require("./server/config");
const azureProxyMiddleware = require("./server/azure")(config);

let app = require("./server/app")(config, azureProxyMiddleware);

if (config.dev) {
  app = require("./server/webpack")(app);
}

const server = http.createServer(app);
server.listen(config.port, () => {
  console.log("listening on http://localhost:%d", config.port);
});
