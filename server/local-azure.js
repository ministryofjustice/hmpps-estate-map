const execSync = require("child_process").execSync;

const cache = {
  token: "",
  expiry: -1
};

module.exports = function getLocalAzureToken() {
  if (cache.expiry >= new Date()) {
    console.log("Using cached CLI token");
    return cache.token;
  }
  try {
    console.log("Fetching new token from CLI");
    const tokenInfo = JSON.parse(
      execSync("az account get-access-token", {
        encoding: "utf8",
        windowsHide: true
      })
    );
    cache.token = tokenInfo.accessToken;
    cache.expiry = new Date(tokenInfo.expiresOn);

    return cache.token;
  } catch (err) {
    console.warn("Failed to grab CLI token", err);
    return null;
  }
};
