# Releasing Arctic2

Arctic2 publishes to npm when a version tag is pushed. The workflow never changes the version itself and only accepts a tag whose commit is already on `main`.

## Release Credentials

Publishing authenticates with the GitHub Actions repository secret `NPM_TOKEN`. Keep it set to an unexpired granular npm token with read/write access only to `arctic2` and **Bypass two-factor authentication** enabled.

Rotate the token before it expires:

1. Create a replacement token with the same package restriction and permissions.
2. Replace the `NPM_TOKEN` repository secret.
3. Revoke the previous token.

Trusted Publishing can later replace `NPM_TOKEN` with short-lived GitHub OIDC credentials. That migration is tracked in [issue #2](https://github.com/pablote/arctic2/issues/2).

## Publish a Version

1. Set the intended version without creating a tag. For example:

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
version=$(node -p "require('./package.json').version")
git tag -a "v${version}" -m "Arctic2 v${version}"
git push origin "v${version}"
```

The `Publish to npm` workflow validates that the tag is `v${package.json.version}`, validates that the commit belongs to `main`, repeats all checks, and publishes the package with npm provenance. It does not create a GitHub Release page.

Optional GitHub Release pages are separately tracked in [issue #1](https://github.com/pablote/arctic2/issues/1).
