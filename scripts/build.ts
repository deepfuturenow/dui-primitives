#!/usr/bin/env -S deno run --allow-all
/**
 * Build script — compiles DUI primitives to npm-publishable JS + .d.ts.
 *
 * Following Lit's publishing guidance:
 * - Compile TypeScript → JavaScript + declaration files
 * - Don't bundle (let consumer bundlers deduplicate Lit)
 * - Don't minify (consumer bundlers handle this)
 * - Preserve module structure
 *
 * Uses tsc for compilation (handles decorators on private fields correctly).
 *
 * Output: dist/dui-primitives/
 */

import { resolve, join } from "jsr:@std/path@^1";
import { ensureDir, exists } from "jsr:@std/fs@^1";

const ROOT = resolve(import.meta.dirname!, "..");
const DIST = join(ROOT, "dist");

const PKG = {
  name: "@deepfuture/dui-primitives",
  srcDir: "packages/primitives",
  distDir: "dui-primitives",
  description: "DUI primitives — unstyled, accessible web components built with Lit. Structure and behavior only.",
  dependencies: {
    "lit": "^3.3.2",
    "@lit/context": "^1.1.3",
    "@floating-ui/dom": "^1.7.4",
  },
} as const;

/** Read version from packages/primitives/deno.json */
async function getVersion(): Promise<string> {
  const json = JSON.parse(
    await Deno.readTextFile(join(ROOT, "packages/primitives/deno.json")),
  );
  return json.version ?? "0.1.0";
}

/** Build the "exports" field for package.json from the deno.json exports */
function buildExportsMap(): Record<string, { import: string; types: string } | string> {
  const denoJson = JSON.parse(
    Deno.readTextFileSync(join(ROOT, PKG.srcDir, "deno.json")),
  );
  const exports: Record<string, { import: string; types: string } | string> = {};

  for (const [key, value] of Object.entries(denoJson.exports as Record<string, string>)) {
    const jsPath = (value as string)
      .replace(/^\.\/src\//, "./")
      .replace(/\.ts$/, ".js");
    const dtsPath = jsPath.replace(/\.js$/, ".d.ts");

    exports[key] = {
      import: jsPath,
      types: dtsPath,
    };
  }

  return exports;
}

/** Walk directory recursively, yielding file paths */
async function* walkDir(dir: string): AsyncGenerator<string> {
  for await (const entry of Deno.readDir(dir)) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory) {
      yield* walkDir(fullPath);
    } else {
      yield fullPath;
    }
  }
}

/** Fix .ts extensions in import/export statements → .js */
async function fixExtensionsInDir(dir: string): Promise<void> {
  for await (const entry of Deno.readDir(dir)) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory) {
      await fixExtensionsInDir(fullPath);
    } else if (entry.name.endsWith(".js") || entry.name.endsWith(".d.ts")) {
      let content = await Deno.readTextFile(fullPath);
      const fixed = content.replace(
        /((?:from|import)\s+["'])(\.\.?\/[^"']*?)\.ts(["'])/g,
        "$1$2.js$3",
      );
      if (fixed !== content) {
        await Deno.writeTextFile(fullPath, fixed);
      }
    }
  }
}

/** Generate package.json for the npm package */
function generatePackageJson(version: string): Record<string, unknown> {
  return {
    name: PKG.name,
    version,
    description: PKG.description,
    type: "module",
    license: "MIT",
    repository: {
      type: "git",
      url: "https://github.com/deepfuturenow/dui-primitives.git",
    },
    exports: buildExportsMap(),
    types: "./global.d.ts",
    typesVersions: { "*": { "*": ["./*"] } },
    files: ["**/*.js", "**/*.d.ts", "**/*.css", "README.md"],
    dependencies: { ...PKG.dependencies },
    keywords: [
      "web-components",
      "lit",
      "unstyled",
      "primitives",
      "accessible",
      "dui",
    ],
  };
}

/** Remove .js and .d.ts files that tsc leaked into source directories */
async function cleanTscArtifacts(dir: string): Promise<void> {
  for await (const entry of Deno.readDir(dir)) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory) {
      await cleanTscArtifacts(fullPath);
    } else if (
      (entry.name.endsWith(".js") || entry.name.endsWith(".d.ts")) &&
      !entry.name.endsWith(".global.d.ts")
    ) {
      const tsPath = fullPath.replace(/\.js$/, ".ts").replace(/\.d\.ts$/, ".ts");
      try {
        await Deno.stat(tsPath);
        await Deno.remove(fullPath);
      } catch { /* no .ts source → keep it */ }
    }
  }
}

// --- Main ---
async function main() {
  console.log("🔨 DUI Primitives Build — compiling package for npm distribution\n");

  const outDir = join(DIST, PKG.distDir);

  // Clean dist
  try {
    await Deno.remove(outDir, { recursive: true });
  } catch { /* doesn't exist */ }
  await ensureDir(DIST);
  await ensureDir(outDir);

  const version = await getVersion();
  console.log(`📋 Version: ${version}`);

  const srcRoot = join(ROOT, PKG.srcDir, "src");

  console.log(`\n📦 Building ${PKG.name}...`);

  // Create tsconfig for the build
  const tsconfig = {
    compilerOptions: {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "bundler",
      declaration: true,
      declarationMap: false,
      sourceMap: false,
      outDir: outDir,
      rootDir: srcRoot,
      lib: ["DOM", "DOM.Iterable", "ES2022"],
      skipLibCheck: true,
      strict: false,
      noEmit: false,
      noEmitOnError: false,
    },
    include: [srcRoot + "/**/*.ts"],
    exclude: [srcRoot + "/**/*.test.ts"],
  };

  const tsconfigPath = join(outDir, "_tsconfig.build.json");
  await Deno.writeTextFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));

  // Run tsc
  console.log(`   Compiling with tsc...`);
  const tscCmd = new Deno.Command("npx", {
    args: ["tsc", "--project", tsconfigPath],
    cwd: ROOT,
    stdout: "piped",
    stderr: "piped",
  });
  const tscResult = await tscCmd.output();
  const stderr = new TextDecoder().decode(tscResult.stderr);
  const stdout = new TextDecoder().decode(tscResult.stdout);

  if (!tscResult.success) {
    const output = (stdout + stderr).trim();
    const lines = output.split("\n");
    const serious = lines.filter(l =>
      l.includes("error TS") &&
      !l.includes("TS5097") &&
      !l.includes("TS6059") &&
      !l.includes("TS2304") &&
      !l.includes("TS2307") &&
      !l.includes("TS2823")
    );
    if (serious.length > 0) {
      console.warn(`   ⚠️  tsc errors (${serious.length}):\n${serious.slice(0, 5).join("\n")}`);
    }
  }

  // Clean up tsconfig
  await Deno.remove(tsconfigPath);

  // Fix .ts extension imports in output .js files → .js
  await fixExtensionsInDir(outDir);

  // Generate package.json
  const packageJson = generatePackageJson(version);
  await Deno.writeTextFile(
    join(outDir, "package.json"),
    JSON.stringify(packageJson, null, 2) + "\n",
  );

  // Copy global.d.ts (HTMLElementTagNameMap)
  const globalDts = join(ROOT, PKG.srcDir, "src/global.d.ts");
  if (await exists(globalDts)) {
    let content = await Deno.readTextFile(globalDts);
    content = content.replace(
      /(from\s+["'])(\.\.?\/[^"']*?)\.ts(["'])/g,
      '$1$2.js$3',
    );
    await Deno.writeTextFile(join(outDir, "global.d.ts"), content);
    console.log(`   ✅ HTMLElementTagNameMap declarations included`);
  }

  // Copy README
  const readmePath = join(ROOT, "README.md");
  if (await exists(readmePath)) {
    await Deno.copyFile(readmePath, join(outDir, "README.md"));
  }

  // Count output files
  let jsCount = 0, dtsCount = 0;
  for await (const entry of walkDir(outDir)) {
    if (entry.endsWith(".js")) jsCount++;
    if (entry.endsWith(".d.ts")) dtsCount++;
  }

  console.log(`   ✅ ${PKG.name} → dist/${PKG.distDir}/ (${jsCount} .js, ${dtsCount} .d.ts)`);

  // Clean up any tsc artifacts leaked into source directories
  await cleanTscArtifacts(join(ROOT, "packages"));

  console.log("\n✨ Build complete! Output in dist/dui-primitives/");
}

main();
