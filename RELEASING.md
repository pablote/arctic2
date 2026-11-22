# Releasing Arctic2

Arctic2 publishes to npm when a version tag is pushed. The workflow never changes the version itself and only accepts a tag whose commit is already on `main`.

## Release Credentials

Only the `npm publish` step in `.github/workflows/publish.yaml` uses the repository secret `NPM_TOKEN`. If the token expires, local builds, pull-request checks, and installs of published versions keep working. Replace it before the next release.

Rotate the token before it expires:

1. Sign in to npm as a maintainer of `arctic2`. Under **Access Tokens → Generate New Token**, create a granular token with a distinct name and an expiration date.
2. Under **Packages and scopes**, choose **Read and write (publish and stage)** and select only `arctic2`. Enable **Bypass two-factor authentication** so the release job can publish unattended. Leave **Organizations** at **No access**.
3. Generate the token and copy its value into the existing `NPM_TOKEN` secret under [GitHub → Settings → Secrets and variables → Actions](https://github.com/pablote/arctic2/settings/secrets/actions). Keep the secret name unchanged.
4. Revoke the old token on npm once its replacement is in place. Set a reminder for the new expiration. On the next planned release, confirm the **Publish package** step succeeds; a green CI build alone does not exercise the credential.

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
