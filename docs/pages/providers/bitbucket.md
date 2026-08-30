---
title: "Bitbucket"
---

# Bitbucket

OAuth 2.0 provider for Bitbucket.

Also see the [OAuth 2.0](https://github.com/pablote/arctic2/blob/main/docs/pages/guides/oauth2.md) guide.

## Initialization

```ts
import * as arctic from "arctic2";

const bitBucket = new arctic.Bitbucket(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic2";

const state = arctic.generateState();
const url = bitBucket.createAuthorizationURL(state);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Tokens/index.md), or throw one of [`OAuth2RequestError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2RequestError.md), [`ArcticFetchError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/ArcticFetchError.md), [`UnexpectedResponseError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedResponseError.md), or [`UnexpectedErrorResponseBodyError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedErrorResponseBodyError.md). BitBucket returns an access token and a refresh token.

```ts
import * as arctic from "arctic2";

try {
	const tokens = await bitBucket.validateAuthorizationCode(code);
	// Accessing other fields will throw an error
	const accessToken = tokens.accessToken();
	const refreshToken = tokens.refreshToken();
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

## Refresh access tokens

Use `refreshAccessToken()` to get a new access token using a refresh token. This method's behavior is identical to `validateAuthorizationCode()`.

```ts
import * as arctic from "arctic2";

try {
	const tokens = await bitBucket.refreshAccessToken(refreshToken);
	// Accessing other fields will throw an error
	const accessToken = tokens.accessToken();
	const refreshToken = tokens.refreshToken();
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

## Get user profile

Enable the `account` scope on your account page and use the [`/user` endpoint](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-users/#api-user-get).

```ts
const response = await fetch("https://api.bitbucket.org/2.0/user", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
