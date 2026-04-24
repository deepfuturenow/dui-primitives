---
name: publish-to-npm
description: Publish a new DUI primitives release to npm. Bumps version across core + primitives, builds, verifies, and publishes to the @deepfuture npm org. Use when the user says "push a new release to npm", "publish a new release", "publish to npm", "release a new version", "bump and publish", or "npm publish".
---

# Publish DUI Primitives to npm

Lockstep publish of the primitives packages to npm:

- `@deepfuture/dui-core`
- `@deepfuture/dui-primitives`

Both packages share the same version number. The source of truth for the current version is `packages/core/deno.json`.

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
grep '"version"' packages/core/deno.json
```

Tell the user the current version and ask what the new version should be. Offer three options:

- **patch** (e.g. 0.0.21 → 0.0.22) — bug fixes, safe changes
- **minor** (e.g. 0.0.21 → 0.1.0) — new features, non-breaking
- **major** (e.g. 0.0.21 → 1.0.0) — breaking changes

Wait for the user to confirm before proceeding.

### 3. Bump version

```bash
deno task version <patch|minor|major|X.Y.Z>
```

This updates `version` in both `packages/core/deno.json` and `packages/primitives/deno.json`.

### 4. Build

```bash
deno task build
```

Compiles both packages via tsc to `dist/`. Verify the output shows ✅ for both:

- `dist/dui-core/`
- `dist/dui-primitives/`

If the build fails, stop and fix the issue before continuing.

### 5. Dry-run publish

```bash
deno task publish
```

Without `--publish`, this does a dry run. It builds, verifies both `package.json` files, and runs `npm publish --dry-run` for each package.

Check that:
- Both packages show the correct new version
- No errors (ignore the `repository.url` normalization warning)

### 6. Publish for real

```bash
deno task publish:live
```

This runs `npm publish --access public` for each package in dependency order:
1. `dui-core` (no DUI deps)
2. `dui-primitives` (depends on core)

### 7. Commit and tag

```bash
git add -A
git commit -m "chore: release vX.Y.Z"
git tag vX.Y.Z
```

Replace `X.Y.Z` with the actual version number.

### 8. Notify downstream

After publishing, the `dui` design system repo may need to update its dependency pins. If the version bump included API changes:

1. Update `@dui/core` and `@dui/primitives` import map entries in `dui/deno.json`
2. Verify `deno check` and dev server still work in the `dui` repo
3. Update the lockstep version in `dui/scripts/build.ts` (the `getPrimitivesVersion()` reads from the local checkout)

For non-breaking changes, the `dui` repo picks up changes automatically via the local checkout import map.

### 9. Summary

Tell the user:
- The version that was published
- Both package names with the new version
- Remind them to `git push && git push --tags` if they want to push to the remote
- Remind them to update the `dui` repo if there were API changes
