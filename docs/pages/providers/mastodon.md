---
title: "Mastodon"
---

# Mastodon

OAuth 2.0 provider for Mastodon.

Also see the [OAuth 2.0 with PKCE](https://github.com/pablote/arctic2/blob/main/docs/pages/guides/oauth2-pkce.md) guide.

## Initialization

The `baseURL` parameter is the full URL where the Mastodon instance is hosted.

```ts
import * as arctic from "arctic2";

const baseURL = "https://mastodon.social";
const mastodon = new arctic.Mastodon(baseURL, clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic2";

const state = arctic.generateState();
const codeVerifier = arctic.generateCodeVerifier();
const scopes = ["read", "write"];
const url = mastodon.createAuthorizationURL(state, codeVerifier, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Tokens/index.md), or throw one of [`OAuth2RequestError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2RequestError.md), [`ArcticFetchError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/ArcticFetchError.md), [`UnexpectedResponseError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedResponseError.md), or [`UnexpectedErrorResponseBodyError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedErrorResponseBodyError.md). Mastodon will only return an access token (no expiration).

```ts
import * as arctic from "arctic2";

try {
	const tokens = await mastodon.validateAuthorizationCode(code, codeVerifier);
	const accessToken = tokens.accessToken();
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

## Revoke tokens

Use `revokeToken()` to revoke a token. This can throw the same errors as `validateAuthorizationCode()`.

```ts
try {
	await mastodon.revokeToken(token);
} catch (e) {
	if (e instanceof arctic.OAuth2RequestError) {
		// Invalid authorization code, credentials, or redirect URI
	}
	if (e instanceof arctic.ArcticFetchError) {
		// Failed to call `fetch()`
	}
	// Parse error
}
```
