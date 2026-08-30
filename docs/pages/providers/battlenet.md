---
title: "Battle.net"
---

# Battle.net

OAuth 2.0 provider for Battle.net.

Also see the [OAuth 2.0](https://github.com/pablote/arctic2/blob/main/docs/pages/guides/oauth2.md) guide.

## Initialization

```ts
import * as arctic from "arctic2";

const battlenet = new arctic.BattleNet(clientId, clientSecret, redirectURI);
```

## Create authorization URL

```ts
import * as arctic from "arctic2";

const state = arctic.generateState();
const scopes = ["openid", "wow.profile"];
const url = battlenet.createAuthorizationURL(state, scopes);
```

## Validate authorization code

`validateAuthorizationCode()` will either return an [`OAuth2Tokens`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Tokens/index.md), or throw one of [`OAuth2RequestError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2RequestError.md), [`ArcticFetchError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/ArcticFetchError.md), [`UnexpectedResponseError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedResponseError.md), or [`UnexpectedErrorResponseBodyError`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/UnexpectedErrorResponseBodyError.md). Battle.net returns an access token and the access token expiration.

```ts
import * as arctic from "arctic2";

try {
	const tokens = await battlenet.validateAuthorizationCode(code);
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

## Get user profile

Use the [`User Info` endpoint](https://develop.battle.net/documentation/battle-net/oauth-apis).

```ts
const response = await fetch("https://oauth.battle.net/userinfo", {
	headers: {
		Authorization: `Bearer ${accessToken}`
	}
});
const user = await response.json();
```
