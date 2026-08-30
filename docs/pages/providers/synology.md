---
title: "Synology"
---

# Synology

OAuth 2.0 provider for Synology SSO and OAuth Apps.

Also see the [OAuth 2.0 with PKCE](https://github.com/pablote/arctic2/blob/main/docs/pages/guides/oauth2-pkce.md) guide.

## Prerequisites

To use this provider, you have to install [SSO Server](https://www.synology.com/en-us/dsm/packages/SSOServer) package on your Synology NAS.

There you have to:

1. Configure the base URL under which the SSO Server will be reachable
2. Enable the OIDC service
3. Create a new OAuth App

> Note: Both the _base URL_ and the _redirect URI_ have to use `https`.

## Initialization

The `baseURL` parameter is the full URL of your Synology NAS that you have configured in the SSO Server.

```ts
import * as arctic from "arctic2";

const baseURL = "https://my_synology_nas.local:5001";
const baseURL = "https://sso.nas.example.com";
const synology = new arctic.Synology(baseUrl, applicationId, applicationSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic2";

const state = arctic.generateState();
const codeVerifier = arctic.generateCodeVerifier();
const scopes = ["email", "groups", "openid"];
const url = synology.createAuthorizationURL(state, codeVerifier, scopes);
```

> Note: You can find all available scopes in `/webman/sso/.well-known/openid-configuration`

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Tokens/index.md), or throw one of [`OAuth2RequestError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2RequestError.md), [`ArcticFetchError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/ArcticFetchError.md), [`UnexpectedResponseError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedResponseError.md), or [`UnexpectedErrorResponseBodyError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedErrorResponseBodyError.md).

Synology returns an access token and the access token expiration.

```ts
import * as arctic from "arctic2";

try {
	const tokens = await synology.validateAuthorizationCode(code, codeVerifier);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
} catch (e) {
	if (e instanceof arctic.OAuth2RequestError) {
		// Invalid authorization code, credentials, or redirect URI
		const code = e.code;
		// ...
	}
	if (e instanceof arctic.ArcticFetchError) {
		// Failed to call `fetch()`
		const cause = e.cause;
		// ...
	}
	// Parse error
}
```

## Get user info

Use the `/webman/sso/SSOUserInfo.cgi` endpoint.

```ts
const user_info = await fetch("https://example.com/webman/sso/SSOUserInfo.cgi", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
