const http = require('http');

const express = require('express');
const morgan = require('morgan');
const expressEjsLayouts = require('express-ejs-layouts');
const bootstrapPackageJson = require('bootstrap/package.json');

const azureExplorer = require('./azure-explorer');

const config = {
  dev: process.env.NODE_ENV != 'production',
  port: process.env.PORT || 2017,
  azure: {
    subscriptions: (process.env.ARM_SUBSCRIPTIONS || '').split(','),
  },
};

const azure = azureExplorer(config.azure);

const app = express();
app.set('view engine', 'ejs');

app.use(expressEjsLayouts);

app.use(morgan(config.dev ? 'dev' : short));

app.get('/bootstrap.css', (req, res) => {
  res.sendFile(require.resolve(`bootstrap/${bootstrapPackageJson.style}`));
});

app.get('/', (req, res) => {
  res.render('dashboard');
});

const server = http.createServer(app);
server.listen(config.port, () => {
  console.log("listening on http://localhost:%d", config.port);
});
