import * as esbuild from "esbuild";
import { resolve, join } from "jsr:@std/path@^1";
import { primitiveRegistry } from "./src/primitive-registry.ts";

const DEFAULT_PORT = 4041;
const STATIC_DIR = resolve(import.meta.dirname!, "static");
const DOCS_ENTRY = resolve(import.meta.dirname!, "src/index.ts");
const WORKSPACE_ROOT = resolve(import.meta.dirname!, "../..");
const PKG_VERSION: string = JSON.parse(
  Deno.readTextFileSync(join(WORKSPACE_ROOT, "packages/primitives/deno.json")),
).version;

/**
 * Resolve `@dui/*` workspace package imports using the primitives deno.json exports map.
 */
const workspacePackages: Record<string, { dir: string; exports: Record<string, string> }> = {
  "@dui/primitives": {
    dir: join(WORKSPACE_ROOT, "packages/primitives"),
    exports: JSON.parse(Deno.readTextFileSync(join(WORKSPACE_ROOT, "packages/primitives/deno.json"))).exports,
  },
};

const duiWorkspacePlugin: esbuild.Plugin = {
  name: "dui-workspace",
  setup(build) {
    build.onResolve({ filter: /^@dui\// }, (args) => {
      for (const [pkgName, pkg] of Object.entries(workspacePackages)) {
        if (!args.path.startsWith(pkgName)) continue;
        const subpath = "." + args.path.slice(pkgName.length);
        const mapped = pkg.exports[subpath || "."];
        if (mapped) {
          return { path: resolve(pkg.dir, mapped) };
        }
      }
      return undefined;
    });
  },
};

/** Import `.css` files as raw text strings. */
const cssRawTextPlugin: esbuild.Plugin = {
  name: "css-raw-text",
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const text = await Deno.readTextFile(args.path);
      return { contents: text, loader: "text" };
    });
  },
};

// Generate llms.txt from primitive registry
function generateLlmsTxt(): string {
  const lines: string[] = [
    "# DUI Primitives — Unstyled, Accessible Web Components",
    "",
    "> Structure and behavior only. No aesthetic opinions.",
    "> Extend with your own CSS to build any design system.",
    "",
    "## Getting Started",
    "",
    "Install: npm install @deepfuture/dui-primitives",
    'Import: import { DuiButtonPrimitive } from "@dui/primitives/button";',
    "",
    "## Primitives",
    "",
  ];

  for (const c of primitiveRegistry) {
    lines.push(`### ${c.name}`);
    lines.push(`- Tag: \`<${c.tagName}>\``);
    lines.push(`- Import: \`${c.importPath}\``);
    lines.push(`- Description: ${c.description}`);

    if (c.properties.length > 0) {
      const props = c.properties
        .map((p) => `${p.name} (${p.type}${p.default ? `, ${p.default}` : ""})`)
        .join(", ");
      lines.push(`- Properties: ${props}`);
    }

    if (c.events.length > 0) {
      const events = c.events
        .map((e) => `${e.name}${e.detail ? ` (${e.detail})` : ""}`)
        .join(", ");
      lines.push(`- Events: ${events}`);
    }

    if (c.slots.length > 0) {
      const slots = c.slots
        .map((s) => `${s.name} (${s.description})`)
        .join(", ");
      lines.push(`- Slots: ${slots}`);
    }

    lines.push("");
  }

  return lines.join("\n");
}

// Write llms.txt before starting the server
const llmsTxt = generateLlmsTxt();
await Deno.writeTextFile(join(STATIC_DIR, "llms.txt"), llmsTxt);
console.log("Generated llms.txt");

const buildMode = Deno.args.includes("--build");

if (buildMode) {
  await esbuild.build({
    entryPoints: [DOCS_ENTRY],
    bundle: true,
    format: "esm",
    target: "es2022",
    outdir: STATIC_DIR,
    write: true,
    minify: true,
    plugins: [duiWorkspacePlugin, cssRawTextPlugin],
    nodePaths: [join(WORKSPACE_ROOT, "node_modules")],
    define: { __DUI_VERSION__: JSON.stringify(PKG_VERSION) },
  });
  console.log("Build complete → packages/docs/static/");
  esbuild.stop();
} else {
  const ctx = await esbuild.context({
    entryPoints: [DOCS_ENTRY],
    bundle: true,
    format: "esm",
    target: "es2022",
    outdir: STATIC_DIR,
    write: false,
    plugins: [duiWorkspacePlugin, cssRawTextPlugin],
    nodePaths: [join(WORKSPACE_ROOT, "node_modules")],
    define: { __DUI_VERSION__: JSON.stringify(PKG_VERSION) },
    banner: {
      js: `(() => { new EventSource("/esbuild").addEventListener("change", () => location.reload()); })();`,
    },
  });

  await ctx.watch();

  let port: number;
  try {
    ({ port } = await ctx.serve({
      port: DEFAULT_PORT,
      servedir: STATIC_DIR,
    }));
  } catch {
    ({ port } = await ctx.serve({
      port: 0,
      servedir: STATIC_DIR,
    }));
  }

  console.log(`DUI Primitives docs → http://localhost:${port} (live reload enabled)`);
}
