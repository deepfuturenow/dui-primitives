---
name: publish-to-npm
description: Publish a new DUI primitives release to npm AND GitHub. Bumps version, builds, verifies, publishes @deepfuture/dui-primitives, pushes commits/tags, and creates a GitHub Release. Use when the user says "push a new release", "publish a new release", "publish to npm", "release a new version", "bump and publish", or "npm publish".
---

# Publish DUI Primitives (npm + GitHub)

Publish the single `@deepfuture/dui-primitives` package to npm **and** update GitHub
(push commits, push tags, create a GitHub Release). This is meant to run start-to-finish
without manual intervention — the user makes a code change, invokes this skill, and both
npm and GitHub end up updated.

The source of truth for the current version is `packages/primitives/deno.json`.

## Prerequisites

### npm auth (must be non-interactive)

Publishing must work **without an OTP prompt**, because this skill runs npm in a
subprocess with no interactive terminal. That requires a valid npm **granular/automation
access token** (this token type bypasses 2FA) stored in `~/.npmrc`:

```
//registry.npmjs.org/:_authToken=npm_xxxxxxxx
@deepfuture:registry=https://registry.npmjs.org/
```

**Verify auth before doing anything else:**

```bash
npm whoami
```

- If it prints a username → auth is good, proceed.
- If it returns `401 Unauthorized` → the token is dead/expired. **Stop** and tell the
  user to mint a new **Granular Access Token** at npmjs.com → Avatar → Access Tokens →
  Generate New Token → Granular Access Token (Packages and scopes: Read and write, scoped
  to `@deepfuture`). Once they paste it, replace the `_authToken=` line in `~/.npmrc`.
  Do **not** fall back to interactive `npm login` / OTP — it will hang in this environment.

`scripts/publish.ts` also honors an `NPM_TOKEN` env var (it writes a temporary `.npmrc`),
but a valid `~/.npmrc` token is the standard, preferred setup.

### GitHub auth

```bash
gh auth status
```

Must show a logged-in account. Used for `gh release create` in the final step.

### Working tree

- All product changes committed (the version-bump commit is created by this skill at the end).

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

This runs `npm publish --access public` using the `~/.npmrc` token (no OTP prompt).

If it fails with a `401`/`E401`/OTP error, the token is invalid — go back to the
**npm auth** prerequisite. Do not retry interactively.

### 7. Commit and tag

```bash
git add -A
git commit -m "chore: release vX.Y.Z"
git tag vX.Y.Z
```

Replace `X.Y.Z` with the actual version number.

### 8. Push to GitHub

Push the release commit and the tag to the remote:

```bash
git push && git push --tags
```

### 9. Create the GitHub Release

Create a Release for the new tag with auto-generated notes:

```bash
gh release create vX.Y.Z --title "vX.Y.Z" --generate-notes
```

`--generate-notes` builds the changelog from merged PRs / commits since the previous tag.
Confirm the command prints the release URL. If `gh` reports the release already exists,
skip (do not fail the whole flow).

### 10. Notify downstream

After publishing, the `dui` design system repo may need to update its dependency pins. If the version bump included API changes:

1. Update `@dui/primitives` import map entries in `dui/deno.json`
2. Verify `deno check` and dev server still work in the `dui` repo

For non-breaking changes, the `dui` repo picks up changes automatically via the local checkout import map.

### 11. Summary

Tell the user:
- The version that was published, and the package name with the new version
- The npm URL: `https://www.npmjs.com/package/@deepfuture/dui-primitives`
- The GitHub Release URL (from step 9)
- Whether the `dui` repo needs updating (only if there were API changes)
