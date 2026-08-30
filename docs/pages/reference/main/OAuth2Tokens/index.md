---
title: "OAuth2Tokens"
---

# OAuth2Tokens

Represents a JSON-parsed successful token response body.

## Constructor

```ts
function constructor(data: object): this;
```

### Parameters

- `data`: JSON-parsed successful response body.

## Methods

- [`accessToken()`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Tokens/accessToken.md)
- [`accessTokenExpiresAt()`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Tokens/accessTokenExpiresAt.md)
- [`accessTokenExpiresInSeconds()`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Tokens/accessTokenExpiresInSeconds.md)
- [`hasRefreshToken()`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Tokens/hasRefreshToken.md)
- [`refreshToken()`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Tokens/refreshToken.md)

## Properties

```ts
interface Properties {
	data: object;
}
```

- `data`: `JSON.parse()`-ed response body.
