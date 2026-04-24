#!/usr/bin/env -S deno run --allow-all
/**
 * Publish — builds and publishes @deepfuture/dui-primitives to npm.
 *
 * Usage:
 *   deno run --allow-all scripts/publish.ts           # dry run
 *   deno run --allow-all scripts/publish.ts --publish  # real publish
 *
 * Prerequisites:
 *   - npm login (must be authenticated to @deepfuture org)
 *   - All changes committed and pushed
 */

import { resolve, join } from "jsr:@std/path@^1";

const ROOT = resolve(import.meta.dirname!, "..");
const DIST = join(ROOT, "dist");
const PKG_DIR = join(DIST, "dui-primitives");

async function run(cmd: string[], cwd: string): Promise<boolean> {
  const proc = new Deno.Command(cmd[0], {
    args: cmd.slice(1),
    cwd,
    stdout: "inherit",
    stderr: "inherit",
  });
  const result = await proc.output();
  return result.success;
}

async function main() {
  const dryRun = !Deno.args.includes("--publish");

  if (dryRun) {
    console.log("🏗️  DUI Primitives Publish — DRY RUN (pass --publish to actually publish)\n");
  } else {
    console.log("🚀 DUI Primitives Publish — LIVE PUBLISH to npm\n");
  }

  // Step 1: Build
  console.log("Step 1: Building package...\n");
  const buildOk = await run(["deno", "run", "--allow-all", "scripts/build.ts"], ROOT);
  if (!buildOk) {
    console.error("❌ Build failed");
    Deno.exit(1);
  }

  // Step 2: Verify package.json
  console.log("\nStep 2: Verifying package...\n");
  try {
    const pkgJson = JSON.parse(
      await Deno.readTextFile(join(PKG_DIR, "package.json")),
    );
    console.log(`   ✅ ${pkgJson.name}@${pkgJson.version}`);
  } catch {
    console.error(`   ❌ dui-primitives: missing package.json`);
    Deno.exit(1);
  }

  // Step 3: Publish (or dry-run)
  console.log(`\nStep 3: ${dryRun ? "Dry-run" : "Publishing"}...\n`);

  const args = dryRun
    ? ["npm", "publish", "--access", "public", "--dry-run"]
    : ["npm", "publish", "--access", "public"];

  console.log(`   📤 dui-primitives...`);
  const ok = await run(args, PKG_DIR);
  if (!ok) {
    console.error(`   ❌ Failed to publish dui-primitives`);
    Deno.exit(1);
  }

  console.log(`\n✨ ${dryRun ? "Dry run" : "Publish"} complete!`);
  if (dryRun) {
    console.log("   Run with --publish to actually publish to npm.");
  }
}

main();
