#!/usr/bin/env -S deno run --allow-all
/**
 * Publish — builds and publishes @deepfuture/dui-primitives to npm.
 *
 * Usage:
 *   deno run --allow-all scripts/publish.ts           # dry run
 *   deno run --allow-all scripts/publish.ts --publish  # real publish
 *
 * Authentication (pick one):
 *   1. NPM_TOKEN env var — granular/automation token that bypasses OTP
 *      Create at: npmjs.com → Avatar → Access Tokens → Granular Access Token
 *      Set permissions: Read and write, scoped to @deepfuture packages
 *      Then: NPM_TOKEN=npm_xxxx deno task publish:live
 *
 *   2. --otp <code> flag — pass a TOTP code from your authenticator app
 *      Then: deno task publish:live --otp 123456
 *
 *   3. Interactive npm login (may not work — npm masks auth URLs in subprocesses)
 *
 * Prerequisites:
 *   - npm login (or NPM_TOKEN set)
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
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  const result = await proc.output();
  return result.success;
}

/** Parse --otp <code> from args */
function getOtp(args: string[]): string | undefined {
  const idx = args.indexOf("--otp");
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
  return undefined;
}

/**
 * Write a temporary .npmrc in the package dir so `npm publish` uses the token.
 * Returns the path so we can clean it up after.
 */
async function writeNpmrc(pkgDir: string, token: string): Promise<string> {
  const npmrcPath = join(pkgDir, ".npmrc");
  await Deno.writeTextFile(
    npmrcPath,
    `//registry.npmjs.org/:_authToken=${token}\n`,
  );
  return npmrcPath;
}

/** Remove temporary .npmrc files */
async function cleanupNpmrc(path: string): Promise<void> {
  try {
    await Deno.remove(path);
  } catch { /* ignore */ }
}

async function main() {
  const dryRun = !Deno.args.includes("--publish");
  const otp = getOtp(Deno.args);
  const npmToken = Deno.env.get("NPM_TOKEN");

  if (dryRun) {
    console.log("🏗️  DUI Primitives Publish — DRY RUN (pass --publish to actually publish)\n");
  } else {
    console.log("🚀 DUI Primitives Publish — LIVE PUBLISH to npm\n");
    if (npmToken) {
      console.log("   🔑 Using NPM_TOKEN for authentication\n");
    } else if (otp) {
      console.log(`   🔑 Using OTP code for authentication\n`);
    } else {
      console.log("   ⚠️  No NPM_TOKEN or --otp provided. If publish fails with OTP errors,");
      console.log("      set NPM_TOKEN env var or pass --otp <code>.\n");
      console.log("      Create a token at: npmjs.com → Avatar → Access Tokens → Granular Access Token\n");
    }
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

  const args = ["npm", "publish", "--access", "public"];
  if (dryRun) args.push("--dry-run");
  if (otp) args.push("--otp", otp);

  let npmrcPath: string | undefined;

  try {
    // If NPM_TOKEN is set, write temporary .npmrc so npm uses it
    if (npmToken) {
      npmrcPath = await writeNpmrc(PKG_DIR, npmToken);
    }

    console.log(`   📤 dui-primitives...`);
    const ok = await run(args, PKG_DIR);
    if (!ok) {
      console.error(`   ❌ Failed to publish dui-primitives`);
      Deno.exit(1);
    }
  } finally {
    // Always clean up temporary .npmrc (don't leave tokens on disk)
    if (npmrcPath) {
      await cleanupNpmrc(npmrcPath);
    }
  }

  console.log(`\n✨ ${dryRun ? "Dry run" : "Publish"} complete!`);
  if (dryRun) {
    console.log("   Run with --publish to actually publish to npm.");
  }
}

main();
