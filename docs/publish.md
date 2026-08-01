# Publish — ngx-fy-carousel

How to publish this library to npm. The workspace root (`ngx-fy-carousel-ws`) is `private` and is never published. Only the built package in `dist/ngx-fy-carousel` goes to the registry.

## Version strategy

One npm package name, three major lines aligned with Angular:

| Branch | Angular peers | npm version line |
| --- | --- | --- |
| `angular-20` | `^20.0.0` | `20.x.x` |
| `angular-21` | `^21.0.0` | `21.x.x` |
| `angular-22` | `^22.0.0` | `22.x.x` |

Bump **only** `projects/ngx-fy-carousel/package.json` → `version`. Keep the root workspace version at `0.0.0`.

## One-time setup

### 1. npm account

1. Create an account at [npmjs.com](https://www.npmjs.com/signup).
2. Enable 2FA on the account.
3. Confirm the package name is available:

```bash
npm view ngx-fy-carousel
```

If the command 404s, the name is free.

### 2. npm access token (GitHub Actions)

1. npm → **Access Tokens** → generate an **Automation** token (or Granular token with publish permission for `ngx-fy-carousel`).
2. In the GitHub repo: **Settings → Secrets and variables → Actions**.
3. Create secret `NPM_TOKEN` with that token value.

The workflow [`.github/workflows/publish.yml`](../.github/workflows/publish.yml) uses `NODE_AUTH_TOKEN` + npm provenance (`id-token: write`).

### 3. Optional: Trusted Publishing

Instead of (or in addition to) a classic token, you can configure [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers) for this GitHub repo/workflow. Keep `NPM_TOKEN` until trusted publishing is confirmed working.

### 4. Local login (manual publish only)

```bash
npm login
npm whoami
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run build:lib` | Build the library into `dist/ngx-fy-carousel` |
| `npm run pack:lib` | Build + create a local `.tgz` for inspection |
| `npm run publish:lib:dry` | Build + dry-run publish (no upload) |
| `npm run publish:lib` | Build + publish to npm (manual) |

## Recommended flow (CI via GitHub Release)

Use this for production publishes.

1. Checkout the target branch (`angular-20`, `angular-21`, or `angular-22`).
2. Bump `version` in `projects/ngx-fy-carousel/package.json` (semver).
3. Commit and push the branch.
4. Create a GitHub Release whose tag matches the package version with a `v` prefix:
   - package `20.0.1` → tag `v20.0.1`
   - package `21.0.0` → tag `v21.0.0`
   - package `22.0.0` → tag `v22.0.0`
5. Target the release at the commit on the correct Angular branch.
6. Publishing the release triggers **Publish npm**:
   - install → test → build lib
   - assert tag `vX.Y.Z` equals package version `X.Y.Z`
   - `npm publish ./dist/ngx-fy-carousel --access public --provenance`

CLI equivalent:

```bash
# on the correct branch, after bumping version and pushing
git tag v22.0.0
git push origin v22.0.0
gh release create v22.0.0 --title "v22.0.0" --notes "Release notes here"
```

## Manual publish (local)

Use only for emergencies or first validation.

```bash
npm test
npm run publish:lib:dry   # inspect what would be published
npm run publish:lib       # real publish — requires npm login
```

## Dry-run checklist

Before the first real publish of a version:

```bash
npm test
npm run publish:lib:dry
```

Confirm the tarball contents include:

- compiled FESM / typings from ng-packagr
- `package.json` with correct `name`, `version`, `peerDependencies`
- `README.md` and license files

## CI overview

| Workflow | Trigger | What it does |
| --- | --- | --- |
| `CI` | push / PR on `angular-20`–`angular-22` | `npm ci` → test → `build:lib` |
| `Publish npm` | GitHub Release published | test → build → version check → `npm publish` |

## Rules

- Never publish from the repo root.
- Never reuse a version that already exists on npm.
- Always release from the branch that matches the major version line.
- Tag format is mandatory: `v` + exact `projects/ngx-fy-carousel/package.json` version.
- Consumers install with the major that matches their Angular version, e.g. `npm i ngx-fy-carousel@22`.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `403` / `ENEEDAUTH` | Check `NPM_TOKEN` secret or run `npm login` locally |
| `403` publish denied | Confirm you own the package name / org permissions |
| Version already exists | Bump version and create a new tag/release |
| Tag mismatch fails CI | Retag so `vX.Y.Z` matches package.json, or bump package to match the tag |
| Provenance errors | Ensure workflow has `id-token: write` and uses the official `actions/checkout` + `actions/setup-node` flow |
