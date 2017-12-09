const http = require('http');

const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bootstrapPackageJson = require('bootstrap/package.json');

const azureExplorer = require('./azure-explorer');

const dev = process.env.NODE_ENV != 'production';
const config = {
  dev,
  port: process.env.PORT || 2017,
  sessionKeys: (process.env.SESSION_KEYS || (dev ? 'x' : '')).split(','),
  azure: {
    subscriptions: (process.env.ARM_SUBSCRIPTIONS || '').split(','),
  },
  auth: {
    aad: process.env.WEBSITE_AUTH_AUTO_AAD,
    clientID: process.env.WEBSITE_AUTH_CLIENT_ID,
    clientSecret: process.env.WEBSITE_AUTH_CLIENT_SECRET,
  },
};

const azure = azureExplorer(config.azure);

const app = express();
app.set('view engine', 'ejs');
app.set('trust proxy', true);
app.use(expressEjsLayouts);

app.use(morgan(config.dev ? 'dev' : 'short'));

app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: config.sessionKeys,

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000,
  secure: !dev,
}));

app.get('/bootstrap.css', (req, res) => {
  res.sendFile(require.resolve(`bootstrap/${bootstrapPackageJson.style}`));
});
app.get('/logout', (req, res) => {
  Object.keys(req.cookies).forEach(name => res.clearCookie(name));
  res.redirect('/');
});

app.get('/', (req, res) => {
  res.render('dashboard', {headers: req.headers});
});

const server = http.createServer(app);
server.listen(config.port, () => {
  console.log("listening on http://localhost:%d", config.port);
});
