const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bootstrapPackageJson = require("bootstrap/package.json");

module.exports = function createApp(config, azureProxyMiddleware) {
  const app = express();

  app.set("trust proxy", true);

  app.set("view engine", "ejs");
  app.use(expressEjsLayouts);

  app.use(morgan(config.dev ? "dev" : "short"));

  app.use(cookieParser());

  app.get("/bootstrap.css", (req, res) => {
    res.sendFile(require.resolve(`bootstrap/${bootstrapPackageJson.style}`));
  });

  app.get("/logout", (req, res) => {
    clearAllCookies(req, res);
    res.redirect("/");
  });

  app.use("/azure", azureProxyMiddleware);

  app.get("/", (req, res) => {
    res.render("dump", {
      mode: config.aadAuth ? "AAD" : "CLI",
      dump: req.headers
    });
  });

  return app;
};

function clearAllCookies(req, res) {
  Object.keys(req.cookies).forEach(name => res.clearCookie(name));
}
