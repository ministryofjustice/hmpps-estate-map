const dev = process.env.NODE_ENV != "production";

module.exports = {
  dev,
  port: getenv("PORT", Number, 2017),
  sessionKeys: getenv("SESSION_KEYS", s => s.split(","), ["x"], true),
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
