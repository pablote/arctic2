---
title: "Yahoo"
---

# Yahoo

OAuth 2.0 provider for Yahoo.

Also see the [OAuth 2.0](https://github.com/pablote/arctic2/blob/main/docs/pages/guides/oauth2.md) guide.

## Initialization

```ts
import * as arctic from "arctic2";
const yahoo = new arctic.Yahoo(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic2";

const state = arctic.generateState();
const scopes = ["openid", "profile"];
const url = yahoo.createAuthorizationURL(state, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Tokens/index.md), or throw one of [`OAuth2RequestError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2RequestError.md), [`ArcticFetchError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/ArcticFetchError.md), [`UnexpectedResponseError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedResponseError.md), or [`UnexpectedErrorResponseBodyError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedErrorResponseBodyError.md). Yahoo returns an access token, the access token expiration, and a refresh token.

```ts
import * as arctic from "arctic2";

try {
	const tokens = await yahoo.validateAuthorizationCode(code);
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

## Refresh access tokens

Use `refreshAccessToken()` to get a new access token using a refresh token. Yahoo returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import * as arctic from "arctic2";

try {
	const tokens = await yahoo.refreshAccessToken(refreshToken);
	const accessToken = tokens.accessToken();
	const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
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

## OpenID Connect

Use OpenID Connect with the `openid` scope to get the user's profile with an ID token or the [`userinfo` endpoint](https://developer.yahoo.com/sign-in-with-yahoo/#get-user-info-api). Arctic provides [`decodeIdToken()`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/decodeIdToken.md) for decoding the token's payload.

```ts
const scopes = ["openid"];
const url = yahoo.createAuthorizationURL(state, scopes);
```

```ts
import * as arctic from "arctic2";

const tokens = await yahoo.validateAuthorizationCode(code);
const idToken = tokens.idToken();
const claims = arctic.decodeIdToken(idToken);
```

```ts
const response = await fetch("https://api.login.yahoo.com/openid/v1/userinfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```

### Get user profile

Make sure to add the `profile` scope to get the user profile and the `email` scope to get the user email.

```ts
const scopes = ["openid", "profile", "email"];
const url = yahoo.createAuthorizationURL(state, scopes);
```
