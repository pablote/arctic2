---
title: "VK"
---

# VK

OAuth 2.0 provider for VK.

Also see the [OAuth 2.0](https://github.com/pablote/arctic2/blob/main/docs/pages/guides/oauth2.md) guide.

## Initialization

```ts
import * as arctic from "arctic2";

const vk = new arctic.VK(clientId, clientSecret, redirectURI);
```

## Create authorization URL

Optionally use the `offline` scope to get access tokens with no expiration.

```ts
import * as arctic from "arctic2";

const state = arctic.generateState();
const scopes = ["email", "messages", "offline"];
const url = vk.createAuthorizationURL(state, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Tokens/index.md), or throw one of [`OAuth2RequestError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2RequestError.md), [`ArcticFetchError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/ArcticFetchError.md), [`UnexpectedResponseError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedResponseError.md), or [`UnexpectedErrorResponseBodyError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedErrorResponseBodyError.md). VK will return an access token.

```ts
import * as arctic from "arctic2";

try {
	const tokens = await vk.validateAuthorizationCode(code);
	const accessToken = tokens.accessToken();
	// Only if `offline` scope is not used.
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

## Get user profile

Use the [`users.get` endpoint](https://dev.vk.com/en/method/users.get).

```ts
const response = await fetch("https://api.vk.com/method/users.get", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
