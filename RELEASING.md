# Releasing Arctic2

Arctic2 publishes to npm when a version tag is pushed. The workflow never changes the version itself and only accepts a tag whose commit is already on `main`.

## Initial npm Setup

1. Enable two-factor authentication on the `pablote` npm account.
2. On npmjs.com, open **Access Tokens** and create a granular token with read/write access to all packages. A package-specific token cannot select `arctic2` until the first version exists.
3. Enable **Bypass two-factor authentication** for the token so GitHub Actions can publish unattended.
4. Give the bootstrap token the shortest practical expiration.
5. In the GitHub repository, open **Settings**, **Secrets and variables**, **Actions**, then create the repository secret `NPM_TOKEN` with the token value.

The initial token can create any package owned by the npm account, so revoke it immediately after the first successful release.

## Publish a Version

1. Set the intended version without creating a tag. The repository is already set to `3.7.0` for the initial release, so skip this command the first time:

```sh
npm version 3.7.1 --no-git-tag-version
```

2. Run the release checks:

```sh
npm ci
npm run check
npm run pack:check
```

3. Commit and merge the version change to `main`.
4. Update the local `main` branch, create an annotated matching tag, and push only that tag:

```sh
git switch main
git pull --ff-only
git tag -a v3.7.0 -m "Arctic2 v3.7.0"
git push origin v3.7.0
```

The `Publish to npm` workflow validates that the tag is `v${package.json.version}`, validates that the commit belongs to `main`, repeats all checks, and publishes the package with npm provenance. It does not create a GitHub Release page.

## Restrict the Token

After `arctic2@3.7.0` exists:

1. Create a new granular npm token with read/write access only to `arctic2` and enable bypass-2FA.
2. Replace the `NPM_TOKEN` GitHub Actions secret with the new value.
3. Revoke the all-packages bootstrap token.
4. Track the token expiration and rotate it before the next release that follows it.

Trusted Publishing can later replace `NPM_TOKEN` with short-lived GitHub OIDC credentials. That migration is intentionally deferred from the initial release flow and tracked in [issue #2](https://github.com/pablote/arctic2/issues/2).

Optional GitHub Release pages are separately tracked in [issue #1](https://github.com/pablote/arctic2/issues/1).
