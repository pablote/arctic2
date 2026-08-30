---
title: "WorkOS"
---

# WorkOS

OAuth 2.0 provider for WorkOS.

Also see the [OAuth 2.0](https://github.com/pablote/arctic2/blob/main/docs/pages/guides/oauth2.md) guide.

## Initialization

Pass the client secret for confidential clients.

```ts
import * as arctic from "arctic2";

const workos = new arctic.WorkOS(clientId, clientSecret, redirectURI);
const workos = new arctic.WorkOS(clientId, null, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic2";

const state = arctic.generateState();
const url = workos.createAuthorizationURL(state);
```

## Validate authorization code

For confidential clients, pass the authorization code.

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Tokens/index.md), or throw one of [`OAuth2RequestError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2RequestError.md), [`ArcticFetchError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/ArcticFetchError.md), [`UnexpectedResponseError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedResponseError.md), or [`UnexpectedErrorResponseBodyError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedErrorResponseBodyError.md). WorkOS will only return an access token (no expiration).

```ts
import * as arctic from "arctic2";

try {
	const tokens = await workos.validateAuthorizationCode(code, null);
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

For public clients, pass the authorization code and code verifier.

```ts
const tokens = await workos.validateAuthorizationCode(code, codeVerifier);
```

## Get user profile

The [profile](https://workos.com/docs/reference/sso/profile) is included in the token response.

```ts
const tokens = await workos.validateAuthorizationCode(code);
if (
	"profile" in tokens.data &&
	typeof tokens.data.profile === "object" &&
	tokens.data.profile !== null
) {
	const profile = tokens.data.profile;
}
```
