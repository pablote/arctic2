# Contributing

## Repository

Changes are proposed against `main`. Please open an issue before implementing a new provider or a public API change so its scope can be agreed first.

## Contributing to the docs

Documentation is Markdown under `docs/pages`. Update the relevant provider and reference guidance when changing public behavior.

## Contributing to the source code

Arctic2 is intentionally limited to thin OAuth 2.0 and OpenID Connect provider clients for the authorization-code flow. Provider SDKs, user-profile APIs, and unrelated authentication flows are out of scope.

### Set up

Install dependencies with npm.

```sh
npm install
```

### Testing

Run the same checks used by CI:

```sh
npm run check
npm run pack:check
```
