---
title: "OAuth 2.0 with PKCE"
---

# OAuth 2.0 with PKCE

Most providers require a client ID, client secret, and redirect URI. The API is nearly identical across providers but always check each provider's guide before implementing.

```ts
import * as arctic from "arctic2";

const google = new arctic.Google(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Generate a state and code verifier using `generateState()` and `generateCodeVerifier()`. Use them to create an authorization URL with `createAuthorizationURL()`, store the state and code verifier as cookies, and redirect the user to the authorization url.

```ts
import * as arctic from "arctic2";

const state = arctic.generateState();
const codeVerifier = arctic.generateCodeVerifier();
const scopes = ["user:email", "repo"];
const url = google.createAuthorizationURL(state, codeVerifier, scopes);

// store state as cookie
setCookie("state", state, {
	secure: true, // set to false in localhost
	path: "/",
	httpOnly: true,
	maxAge: 60 * 10 // 10 min
});

// store code verifier as cookie
setCookie("code_verifier", codeVerifier, {
	secure: true, // set to false in localhost
	path: "/",
	httpOnly: true,
	maxAge: 60 * 10 // 10 min
});

return redirect(url);
```

## Validate authorization code

Compare the state, and use `validateAuthorizationCode()` to validate the authorization code and code verifier. This returns an [`OAuth2Tokens`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Tokens/index.md), or throw one of [`OAuth2RequestError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2RequestError.md), [`ArcticFetchError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/ArcticFetchError.md), [`UnexpectedResponseError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedResponseError.md), or [`UnexpectedErrorResponseBodyError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedErrorResponseBodyError.md)..

```ts
import * as arctic from "arctic2";

const code = request.url.searchParams.get("code");
const state = request.url.searchParams.get("state");

const storedState = getCookie("state");
const storedCodeVerifier = getCookie("code_verifier");

if (code === null || storedState === null || state !== storedState || storedCodeVerifier === null) {
	// 400
	throw new Error("Invalid request");
}

try {
	const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
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

Calling `OAuth2Tokens.accessToken()` for example parses the response and returns the `access_token` field. If it doesn't exist, it will throw a parse `Error`. See each provider's guides for the actual return values.

```ts
const accessToken = tokens.accessToken();
const accessTokenExpiresInSeconds = tokens.accessTokenExpiresInSeconds();
const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
const refreshToken = tokens.refreshToken();
const idToken = tokens.idToken();
```

Arctic provides [`decodeIdToken()`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/decodeIdToken.md) for decoding the token's payload.

```ts
const claims = arctic.decodeIdToken(idToken);
```
