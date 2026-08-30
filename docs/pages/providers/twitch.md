---
title: "Twitch"
---

# Twitch

OAuth 2.0 provider for Twitch.

Also see the [OAuth 2.0](https://github.com/pablote/arctic2/blob/main/docs/pages/guides/oauth2.md) guide.

## Initialization

```ts
import * as arctic from "arctic2";

const twitch = new arctic.Twitch(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic2";

const state = arctic.generateState();
const scopes = ["activity:write", "read"];
const url = twitch.createAuthorizationURL(state, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Tokens/index.md), or throw one of [`OAuth2RequestError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2RequestError.md), [`ArcticFetchError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/ArcticFetchError.md), [`UnexpectedResponseError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedResponseError.md), or [`UnexpectedErrorResponseBodyError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedErrorResponseBodyError.md). Twitch returns an access token, the access token expiration, and a refresh token.

```ts
import * as arctic from "arctic2";

try {
	const tokens = await twitch.validateAuthorizationCode(code);
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

## OpenID Connect

Use OpenID Connect with the `openid` scope to get the user's profile with an ID token or the `userinfo` endpoint. Arctic provides [`decodeIdToken()`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/decodeIdToken.md) for decoding the token's payload.

Also see [ID token claims](https://dev.twitch.tv/docs/authentication/getting-tokens-oidc/).

```ts
const scopes = ["openid"];
const url = twitch.createAuthorizationURL(state, scopes);
```

```ts
import * as arctic from "arctic2";

const tokens = await twitch.validateAuthorizationCode(code);
const idToken = tokens.idToken();
const claims = arctic.decodeIdToken(idToken);
```

```ts
const response = await fetch("https://id.twitch.tv/oauth2/userinfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

## Refresh access tokens

Use `refreshAccessToken()` to get a new access token using a refresh token. Twitch returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import * as arctic from "arctic2";

try {
	const tokens = await twitch.refreshAccessToken(refreshToken);
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

## Get user profile

Use the [`/users` endpoint](https://dev.twitch.tv/docs/api/reference/#get-users) without passing any arguments. The `user:read:email` scope is required to get the user's email from the endpoint.

```ts
const response = await fetch("https://api.twitch.tv/helix/users", {
	headers: {
		Authorization: `Bearer ${accessToken}`,
		"Client-Id": clientId
	}
});
const user = await response.json();
```
