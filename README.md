# HMPPS Estate Map

An attempt to make a nicer way to browse azure resources.

## Requirements

* Node.js 8.4 or newer
* Yarn 1.3.2 or newer
* [Azure CLI](https://github.com/Azure/azure-cli) 2 or newer (for local dev)

## Running

```
node server.js
```

## Application Architecture

The application abdicates responsibility for managing authentication or authorization to azure APIs or resources. It does this by:

* Not storing any data
* Relying on external systems for acquiring Azure access tokens
* Relying on the authorization grants of those tokens

An API proxy is set up on `/azure` using the methods described below, and then API calls are made through this from an entirely browser-based application. This is roughly how the azure portal itself works.

## Authentication

Authentication is a bit fiddly here, there are two modes

* _CLI_ - Shells out to the `az` command line client to acquire tokens. This is intended for use when developing locally.
* _AAD_ - Uses an Azure App Service's AD Authentication proxy to take care of acquiring tokens. This is intended for use when deployed.

### CLI Authentication

This the default when running the application. When a request comes through the middleware shells out to `az account get-access-token` to get an access token, and uses this for proxied API requests. The token is cached in memory to speed things up a bit.

If you get authentication errors, have a look at the stdout/stderr logs.

### AAD Authentication

This system is enabled by setting the `WEBSITE_AUTH_AUTO_AAD` environment variable - which is set automatically when enabling [App Service Authentication][1].

The App Service Authentication must be set to:

1. Require login before accessing any page
2. Use the [Azure AD backend][2]
3. Override the target resource to be the ARM API.

For step 3 we use a modified version of [this graph API approach][3], but we set `additionalLoginParams` to `["resource=https://management.core.windows.net/"]`.

This causes the `x-ms-token-aad-access-token` header to be present on all incoming requests, which we use to authenticate with the Azure API.

See https://cgillum.tech/2016/03/07/app-service-token-store/ for information about token refresh calls.

[1]: https://docs.microsoft.com/en-us/azure/app-service/app-service-authentication-overview
[2]: https://docs.microsoft.com/en-us/azure/app-service/app-service-mobile-how-to-configure-active-directory-authentication
[3]: https://cgillum.tech/2016/03/25/app-service-auth-aad-graph-api/

## TODO

Features

* Include more VM information
  * Power state
  * description tags
* Plan out what's actually required feature-wise

Implementation

* Automatically handle token refresh
  * Remove proxy from server
  * use /.auth/me to get token onto client
  * use /.auth.refresh to refresh when token expires
* Separate concerns to improve perf and hot reloading
  * Raw API Data storage
  * Querying Raw API data from cache
  * Component Rendering & auto subscription
  * MobX / Custom Query Layer / DataScript?
