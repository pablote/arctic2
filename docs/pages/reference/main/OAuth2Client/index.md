---
title: "OAuth2Client"
---

# OAuth2Client

A generic client for OAuth 2.0 authorization code flow based on [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749), [RFC 7009](https://datatracker.ietf.org/doc/html/rfc7009), and [RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636).

Only client password authentication is supported and is done with the HTTP basic authentication scheme.

## Constructor

```ts
function constructor(
	clientId: string,
	clientPassword: string | null,
	redirectURI: string | null
): this;
```

### Parameters

- `clientId`
- `clientPassword`
- `redirectURI`

## Methods

- [`createAuthorizationURL()`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Client/createAuthorizationURL.md)
- [`createAuthorizationURLWithPKCE()`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Client/createAuthorizationURLWithPKCE.md)
- [`refreshAccessToken()`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Client/refreshAccessToken.md)
- [`revokeToken()`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Client/revokeToken.md)
- [`validateAuthorizationCode()`](https://github.com/pablote/arctic2/blob/main/docs/pages/reference/main/OAuth2Client/validateAuthorizationCode.md)

## Properties

```ts
interface Properties {
	clientId: string;
}
```

- `clientId`
