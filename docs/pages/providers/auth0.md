---
title: "Auth0"
---

# Auth0

OAuth 2.0 provider for Auth0.

Also see the [OAuth 2.0](https://github.com/pablote/arctic2/blob/main/docs/pages/guides/oauth2.md) guide for confidential clients and the [OAuth 2.0 with PKCE](https://github.com/pablote/arctic2/blob/main/docs/pages/guides/oauth2-pkce.md) guide for public clients.

## Initialization

The domain should not include the protocol or path. Pass the client secret for confidential clien.ts

```ts
import * as arctic from "arctic2";

const domain = "xxx.auth0.com";
const auth0 = new arctic.Auth0(domain, clientId, clientSecret, redirectURI);
const auth0 = new arctic.Auth0(domain, clientId, null, redirectURI);
```

## Create authorization URL

For confidential clients, pass the state and scopes. **PKCE is not supported for confidential clients.**

```ts
import * as arctic from "arctic2";

const state = arctic.generateState();
const scopes = ["openid", "profile"];
const url = auth0.createAuthorizationURL(state, null, scopes);
```

For public clients, pass the state, PKCE code verifier, and scopes.

```ts
import * as arctic from "arctic2";

const state = arctic.generateState();
const codeVerifier = arctic.generateCodeVerifier();
const scopes = ["openid", "profile"];
const url = auth0.createAuthorizationURL(state, codeVerifier, scopes);
```

## Validate authorization code

For confidential clients, pass the authorization code.

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Tokens/index.md), or throw one of [`OAuth2RequestError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2RequestError.md), [`ArcticFetchError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/ArcticFetchError.md), [`UnexpectedResponseError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedResponseError.md), or [`UnexpectedErrorResponseBodyError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedErrorResponseBodyError.md). Auth0 returns an access token, the access token expiration, and a refresh token.

```ts
import * as arctic from "arctic2";

try {
	const tokens = await auth0.validateAuthorizationCode(code, null);
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

For public clients, pass the authorization code and code verifier.

```ts
const tokens = await auth0.validateAuthorizationCode(code, codeVerifier);
```

## Refresh access tokens

Use `refreshAccessToken()` to get a new access token using a refresh token. Auth0 returns the same values as during the authorization code validation. This method also returns `OAuth2Tokens` and throws the same errors as `validateAuthorizationCode()`

```ts
import * as arctic from "arctic2";

try {
	const tokens = await auth0.refreshAccessToken(refreshToken);
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

## OpenID Connect

Use OpenID Connect with the `openid` scope to get the user's profile with an ID token or the `userinfo` endpoint. Arctic provides [`decodeIdToken()`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/decodeIdToken.md) for decoding the token's payload.

```ts
const scopes = ["openid"];
const url = auth0.createAuthorizationURL(state, codeVerifier, scopes);
```

```ts
import * as arctic from "arctic2";

const tokens = await auth0.validateAuthorizationCode(code, codeVerifier);
const idToken = tokens.idToken();
const claims = arctic.decodeIdToken(idToken);
```

```ts
const response = await fetch("https://xxx.auth.com/userinfo", {
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
const url = auth0.createAuthorizationURL(state, codeVerifier, scopes);
```

## Revoke tokens

Revoke tokens with `revokeToken()`. Currently, only refresh tokens can be revoked. It throws the same errors as `validateAuthorizationCode()`.

```ts
try {
	await auth0.revokeToken(refreshToken);
} catch (e) {
	// Handle errors
}
```
