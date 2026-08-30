---
title: "TikTok"
---

# TikTok

OAuth 2.0 authorization code provider for TikTok.

Also see [OAuth 2.0 with PKCE](https://github.com/pablote/arctic2/blob/main/docs/pages/guides/oauth2-pkce.md).

## Initialization

```ts
import * as arctic from "arctic2";

const tiktok = new arctic.TikTok(clientKey, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic2";

const state = arctic.generateState();
const codeVerifier = arctic.generateCodeVerifier();
const scopes = ["user.info.basic", "video.list"];
const url = tiktok.createAuthorizationURL(state, codeVerifier, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Tokens/index.md), or throw one of [`OAuth2RequestError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2RequestError.md), [`ArcticFetchError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/ArcticFetchError.md), [`UnexpectedResponseError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedResponseError.md), or [`UnexpectedErrorResponseBodyError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedErrorResponseBodyError.md). TikTok returns an access token, the access token expiration, and a refresh token.

```ts
import * as arctic from "arctic2";

try {
	const tokens = await tiktok.validateAuthorizationCode(code, codeVerifier);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
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

The refresh token expiration is returned as `refresh_expires_in`.

```ts
const tokens = await tiktok.validateAuthorizationCode(code);
if ("refresh_expires_in" in tokens.data && typeof tokens.data.refresh_expires_in === "number") {
	const refreshTokenExpiresIn = tokens.data.refresh_expires_in;
}
```

## Refresh access tokens

Use `refreshAccessToken()` to get a new access token using a refresh token. This method's behavior is identical to `validateAuthorizationCode()`.

```ts
import * as arctic from "arctic2";

try {
	const tokens = await tiktok.refreshAccessToken(refreshToken);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
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

## Revoke tokens

Pass a token to `revokeToken()` to revoke a token. This can throw the same errors as `validateAuthorizationCode()`.

```ts
try {
	await tiktok.revokeToken(refreshToken);
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

> Token revocation must be enabled in the settings.
