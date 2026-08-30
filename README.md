# Arctic2

[Documentation](https://github.com/pablote/arctic2/tree/main/docs/pages)

Arctic2 is an independently maintained, drop-in successor to Arctic v3.7. It provides lightweight, fully typed, runtime-agnostic OAuth 2.0 clients for popular providers. Only the authorization code flow is supported.

```sh
npm install arctic2
```

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

Existing Arctic v3.7 users only need to change the package name in their install command and imports.

> Arctic2 only supports providers that follow the OAuth 2.0 or OpenID Connect specifications, including PKCE and token revocation where available.

## Semver

Arctic2 follows semantic versioning. Breaking public API changes are only released in a new major version, including changes required by provider API updates.

## Supported providers

- 42 School
- Amazon Cognito
- AniList
- Apple
- Atlassian
- Auth0
- Authentik
- Autodesk Platform Services
- Battle.net
- Bitbucket
- Box
- Bungie
- Coinbase
- Discord
- DonationAlerts
- Dribbble
- Dropbox
- Etsy
- Epic Games
- Facebook
- Figma
- Gitea
- GitHub
- GitLab
- Google
- Intuit
- Kakao
- KeyCloak
- Kick
- Lichess
- Line
- Linear
- LinkedIn
- Mastodon
- MercadoLibre
- MercadoPago
- Microsoft Entra ID
- MyAnimeList
- Naver
- Notion
- Okta
- osu!
- Patreon
- Polar
- Reddit
- Roblox
- Salesforce
- Shikimori
- Slack
- Spotify
- Start.gg
- Strava
- Synology
- TikTok
- Tiltify
- Tumblr
- Twitch
- Twitter
- VK
- Withings
- WorkOS
- Yahoo
- Yandex
- Zoom

## Maintenance

Arctic2 is maintained by [pablote](https://github.com/pablote). It continues the MIT-licensed work created by Pilcrow and the original Arctic contributors, but is not an official upstream release.

See [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute and [RELEASING.md](./RELEASING.md) for the release process.
