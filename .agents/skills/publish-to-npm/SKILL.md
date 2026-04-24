---
name: publish-to-npm
description: Publish a new DUI primitives release to npm. Bumps version, builds, verifies, and publishes @deepfuture/dui-primitives. Use when the user says "push a new release to npm", "publish a new release", "publish to npm", "release a new version", "bump and publish", or "npm publish".
---

# Publish DUI Primitives to npm

Publish the single `@deepfuture/dui-primitives` package to npm.

The source of truth for the current version is `packages/primitives/deno.json`.

## Prerequisites

- npm login to the `@deepfuture` org (run `npm whoami` to verify)
- All changes committed (the version bump itself will be committed at the end)

## Steps

All commands run from the **repo root** (not a package subdirectory).

### 1. Check for uncommitted changes

```bash
git status --short
```

If there are uncommitted changes, stop and ask the user whether to commit or stash them first. A release should always start from a clean working tree.

### 2. Read the current version

```bash
grep '"version"' packages/primitives/deno.json
```

Tell the user the current version and ask what the new version should be. Offer three options:

- **patch** (e.g. 1.0.0 → 1.0.1) — bug fixes, safe changes
- **minor** (e.g. 1.0.0 → 1.1.0) — new features, non-breaking
- **major** (e.g. 1.0.0 → 2.0.0) — breaking changes

Wait for the user to confirm before proceeding.

### 3. Bump version

```bash
deno task version <patch|minor|major|X.Y.Z>
```

This updates `version` in `packages/primitives/deno.json`.

### 4. Build

```bash
deno task build
```

Compiles the package via tsc to `dist/dui-primitives/`. Verify the output shows ✅.

If the build fails, stop and fix the issue before continuing.

### 5. Dry-run publish

```bash
deno task publish
```

Without `--publish`, this does a dry run. It builds, verifies the `package.json`, and runs `npm publish --dry-run`.

Check that:
- The package shows the correct new version
- No errors (ignore the `repository.url` normalization warning)

### 6. Publish for real

```bash
deno task publish:live
```

This runs `npm publish --access public`.

### 7. Commit and tag

```bash
git add -A
git commit -m "chore: release vX.Y.Z"
git tag vX.Y.Z
```

Replace `X.Y.Z` with the actual version number.

### 8. Notify downstream

After publishing, the `dui` design system repo may need to update its dependency pins. If the version bump included API changes:

1. Update `@dui/primitives` import map entries in `dui/deno.json`
2. Verify `deno check` and dev server still work in the `dui` repo

For non-breaking changes, the `dui` repo picks up changes automatically via the local checkout import map.

### 9. Summary

Tell the user:
- The version that was published
- The package name with the new version
- Remind them to `git push && git push --tags` if they want to push to the remote
- Remind them to update the `dui` repo if there were API changes
