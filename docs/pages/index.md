---
title: "Arctic2 documentation"
---

# Arctic2 documentation

Arctic2 is an independently maintained, drop-in successor to Arctic v3.7. It is a collection of lightweight, fully typed, runtime-agnostic OAuth 2.0 clients for popular providers. Only the authorization code flow is supported.

```ts
import * as arctic from "arctic2";

const github = new arctic.GitHub(clientId, clientSecret, redirectURI);

const state = arctic.generateState();
const scopes = ["user:email"];
const authorizationURL = github.createAuthorizationURL(state, scopes);

// ...

const tokens = await github.validateAuthorizationCode(code);
const accessToken = tokens.accessToken();
```

> Arctic2 only supports providers that follow the OAuth 2.0 or OpenID Connect specifications, including PKCE and token revocation where available.

## Installation

```
npm install arctic2
```

## Compatibility

Arctic2 3.7 preserves Arctic v3.7's public behavior and provider coverage. Existing users only need to change the package name in their install command and imports.

## Semver

Arctic2 follows semantic versioning. Breaking public API changes are only released in a new major version, including changes required by provider API updates.
