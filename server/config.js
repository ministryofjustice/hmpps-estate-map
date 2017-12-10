const dev = process.env.NODE_ENV != "production";

module.exports = {
  dev,
  port: getenv("PORT", String, "2017"), // number or socket
  aadAuth: getenv("WEBSITE_AUTH_AUTO_AAD", Boolean, false)
};

function getenv(name, coerce, defaultValue, requireInProd) {
  if (name in process.env) {
    return coerce(process.env[name]);
  }
  if (defaultValue === undefined || (requireInProd && !dev)) {
    throw new Error(`Missing ${name} environment variable`);
  }
  return defaultValue;
}
