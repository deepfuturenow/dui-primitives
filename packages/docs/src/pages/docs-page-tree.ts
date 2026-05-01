import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("docs-page-tree")
export class DocsPageTree extends LitElement {
  protected override createRenderRoot() {
    return this;
  }

  // Controlled-mode state — driven by buttons in the demo.
  @state() accessor #ctrlExpanded: string[] = ["alpha"];
  @state() accessor #ctrlSelected: string[] = ["alpha-2"];

  override render() {
    const treeStyle = `
      display: block;
      max-width: 380px;
      font-size: 14px;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 4px;
      background: #fff;
    `;

    return html`
      <h1>Tree</h1>
      <p class="subtitle">
        A hierarchical tree view with keyboard navigation and optional selection.
        Follows the
        <a
          href="https://www.w3.org/WAI/ARIA/apg/patterns/treeview/"
          target="_blank"
          rel="noopener"
        >W3C APG Treeview pattern</a>.
      </p>

      <!--
        ─────────────────────────────────────────────────────────────────────
        SHARED STYLES — demonstrating the correct styling pattern for trees.
        Two key principles:

        1. INDICATOR ALWAYS RESERVES SPACE.
           [part="indicator"] is rendered for both branches AND leaves. By
           setting a width on it, the leaf labels align with branch labels at
           the same nesting level. The chevron content is added only for
           branches via ::part(indicator)::before with a [data-branch] guard
           on the host.

        2. STYLE THE ROW, NOT THE ROOT.
           [part="root"] wraps both the row [part="content"] and the children
           [part="group"]. Styling :hover on root would bleed onto descendants.
           Always style ::part(content) for backgrounds, hover, and selected.
           State attrs (data-selected, data-expanded, etc.) are reflected to
           the host so we can write [data-selected]::part(content).
        ─────────────────────────────────────────────────────────────────────
      -->
      <style>
        /* Indentation: applied to the row; level - 1 gives 0 for top-level */
        .tree-demo dui-tree-item::part(content) {
          padding-block: 4px;
          padding-inline-start: calc(8px + (var(--dui-tree-level) - 1) * 22px);
          padding-inline-end: 8px;
          border-radius: 6px;
          cursor: pointer;
          gap: 6px;
          user-select: none;
        }

        /* Indicator: ALWAYS reserves space, regardless of branch/leaf */
        .tree-demo dui-tree-item::part(indicator) {
          width: 16px;
          height: 16px;
        }

        /* Chevron: only for branches, via [data-branch] on the host */
        .tree-demo dui-tree-item[data-branch]::part(indicator)::before {
          content: "▸";
          font-size: 11px;
          line-height: 1;
          color: #888;
          transition: transform 200ms ease;
          display: inline-block;
        }

        .tree-demo dui-tree-item[data-expanded]::part(indicator)::before {
          transform: rotate(90deg);
        }

        /* Hover/selected on CONTENT (not root) to avoid bleeding to children */
        .tree-demo dui-tree-item::part(content):hover {
          background: #f3f4f6;
        }

        .tree-demo dui-tree-item[data-selected]::part(content) {
          background: #dbeafe;
        }

        .tree-demo dui-tree-item[data-selected]::part(content):hover {
          background: #c7daf8;
        }

        .tree-demo dui-tree-item[data-disabled]::part(content) {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .tree-demo dui-tree-item[data-disabled]::part(content):hover {
          background: transparent;
        }

        .tree-demo dui-tree-item[data-focus]::part(content) {
          outline: 2px solid #3b82f6;
          outline-offset: -2px;
        }

        /* "End" slot styling */
        .tree-demo [slot="end"] {
          font-size: 11px;
          color: #888;
        }

        /* Dark mode tweaks */
        @media (prefers-color-scheme: dark) {
          .tree-demo {
            background: #1a1a22 !important;
            border-color: #2a2a35 !important;
            color: #e0e0e0;
          }
          .tree-demo dui-tree-item::part(content):hover {
            background: #2a2a35;
          }
          .tree-demo dui-tree-item[data-selected]::part(content) {
            background: #1e3a8a;
          }
          .tree-demo dui-tree-item[data-selected]::part(content):hover {
            background: #224aa8;
          }
          .tree-demo [slot="end"] {
            color: #999;
          }
        }
      </style>

      <!-- ─────────────────────────────────────────────────────────────── -->
      <prim-demo label="Basic file tree (selection-mode='none')">
        <p style="font-size:13px;color:#666;margin:0 0 8px;">
          Click a folder to expand/collapse. Click a file to fire
          <code>dui-action</code>. Notice how files (leaves) align with folders
          (branches) at the same level — the indicator always reserves space.
        </p>
        <dui-tree
          class="tree-demo"
          aria-label="Project files"
          default-expanded-values='["src","src-utils"]'
          style="${treeStyle}"
          @dui-action=${this.#bindLog("basic-action")}
          @dui-expanded-change=${this.#bindLog("basic-expanded")}
        >
          <dui-tree-item value="src">
            <span slot="label">📁 src</span>
            <span slot="end">3 items</span>
            <dui-tree-item value="src-index">
              <span slot="label">📄 index.ts</span>
              <span slot="end">✅</span>
            </dui-tree-item>
            <dui-tree-item value="src-utils">
              <span slot="label">📁 utils</span>
              <dui-tree-item value="src-utils-helpers">
                <span slot="label">📄 helpers.ts</span>
                <span slot="end">⚠️</span>
              </dui-tree-item>
              <dui-tree-item value="src-utils-types">
                <span slot="label">📄 types.ts</span>
              </dui-tree-item>
            </dui-tree-item>
            <dui-tree-item value="src-app">
              <span slot="label">📄 app.tsx</span>
            </dui-tree-item>
          </dui-tree-item>
          <dui-tree-item value="package">
            <span slot="label">📄 package.json</span>
          </dui-tree-item>
          <dui-tree-item value="readme">
            <span slot="label">📄 README.md</span>
          </dui-tree-item>
        </dui-tree>
        <pre id="basic-action" style="${this.#logStyle()}">dui-action: —</pre>
      </prim-demo>

      <!-- ─────────────────────────────────────────────────────────────── -->
      <prim-demo label="Single selection">
        <p style="font-size:13px;color:#666;margin:0 0 8px;">
          With <code>selection-mode="single"</code>, clicking the row toggles
          selection. Click the chevron (indicator) to expand without selecting.
        </p>
        <dui-tree
          class="tree-demo"
          aria-label="Nav"
          selection-mode="single"
          default-expanded-values='["nav-comp"]'
          default-selected-values='["nav-comp-button"]'
          style="${treeStyle}"
          @dui-selection-change=${this.#bindLog("single-sel")}
        >
          <dui-tree-item value="nav-comp">
            <span slot="label">Components</span>
            <dui-tree-item value="nav-comp-button">
              <span slot="label">Button</span>
            </dui-tree-item>
            <dui-tree-item value="nav-comp-input">
              <span slot="label">Input</span>
            </dui-tree-item>
            <dui-tree-item value="nav-comp-select">
              <span slot="label">Select</span>
            </dui-tree-item>
          </dui-tree-item>
          <dui-tree-item value="nav-hooks">
            <span slot="label">Hooks</span>
            <dui-tree-item value="nav-hooks-state">
              <span slot="label">useState</span>
            </dui-tree-item>
            <dui-tree-item value="nav-hooks-effect">
              <span slot="label">useEffect</span>
            </dui-tree-item>
          </dui-tree-item>
          <dui-tree-item value="nav-utils">
            <span slot="label">Utilities</span>
            <dui-tree-item value="nav-utils-cn">
              <span slot="label">cn()</span>
            </dui-tree-item>
          </dui-tree-item>
        </dui-tree>
        <pre id="single-sel" style="${this.#logStyle()}">selection: ["nav-comp-button"]</pre>
      </prim-demo>

      <!-- ─────────────────────────────────────────────────────────────── -->
      <prim-demo label="Multiple selection">
        <p style="font-size:13px;color:#666;margin:0 0 8px;">
          With <code>selection-mode="multiple"</code>, clicks toggle items in
          and out of the selection set.
        </p>
        <dui-tree
          class="tree-demo"
          aria-label="Files"
          selection-mode="multiple"
          default-expanded-values='["multi-assets"]'
          style="${treeStyle}"
          @dui-selection-change=${this.#bindLog("multi-sel")}
        >
          <dui-tree-item value="multi-assets">
            <span slot="label">📁 assets</span>
            <dui-tree-item value="multi-logo">
              <span slot="label">🖼️ logo.png</span>
            </dui-tree-item>
            <dui-tree-item value="multi-icon">
              <span slot="label">🖼️ icon.svg</span>
            </dui-tree-item>
            <dui-tree-item value="multi-banner">
              <span slot="label">🖼️ banner.jpg</span>
            </dui-tree-item>
          </dui-tree-item>
          <dui-tree-item value="multi-docs">
            <span slot="label">📁 docs</span>
            <dui-tree-item value="multi-guide">
              <span slot="label">📄 guide.md</span>
            </dui-tree-item>
            <dui-tree-item value="multi-api">
              <span slot="label">📄 api.md</span>
            </dui-tree-item>
          </dui-tree-item>
        </dui-tree>
        <pre id="multi-sel" style="${this.#logStyle()}">selection: []</pre>
      </prim-demo>

      <!-- ─────────────────────────────────────────────────────────────── -->
      <prim-demo label="Disabled item (and its descendants)">
        <p style="font-size:13px;color:#666;margin:0 0 8px;">
          Disabling a tree-item disables its descendants too. Try clicking
          <em>private/</em> or any of its children.
        </p>
        <dui-tree
          class="tree-demo"
          aria-label="Restricted"
          selection-mode="single"
          default-expanded-values='["root","root-private"]'
          style="${treeStyle}"
        >
          <dui-tree-item value="root">
            <span slot="label">📁 root</span>
            <dui-tree-item value="root-public">
              <span slot="label">📁 public</span>
              <dui-tree-item value="root-public-index">
                <span slot="label">📄 index.html</span>
              </dui-tree-item>
            </dui-tree-item>
            <dui-tree-item value="root-private" disabled>
              <span slot="label">🔒 private</span>
              <dui-tree-item value="root-private-secret">
                <span slot="label">📄 secret.txt</span>
              </dui-tree-item>
              <dui-tree-item value="root-private-keys">
                <span slot="label">📄 keys.env</span>
              </dui-tree-item>
            </dui-tree-item>
            <dui-tree-item value="root-readme">
              <span slot="label">📄 README.md</span>
            </dui-tree-item>
          </dui-tree-item>
        </dui-tree>
      </prim-demo>

      <!-- ─────────────────────────────────────────────────────────────── -->
      <prim-demo label="Hover-bleed test">
        <p style="font-size:13px;color:#666;margin:0 0 8px;">
          Hover the <strong>parent</strong> row only (<em>build/</em>). The
          hover background applies to that row, NOT to the expanded children
          below it. This works because the demo styles
          <code>::part(content):hover</code>, not
          <code>::part(root):hover</code>.
        </p>
        <dui-tree
          class="tree-demo"
          aria-label="Hover test"
          default-expanded-values='["build","build-out"]'
          style="${treeStyle}"
        >
          <dui-tree-item value="build">
            <span slot="label">📁 build</span>
            <dui-tree-item value="build-out">
              <span slot="label">📁 out</span>
              <dui-tree-item value="build-out-bundle">
                <span slot="label">📄 bundle.js</span>
              </dui-tree-item>
              <dui-tree-item value="build-out-map">
                <span slot="label">📄 bundle.js.map</span>
              </dui-tree-item>
            </dui-tree-item>
            <dui-tree-item value="build-config">
              <span slot="label">📄 config.json</span>
            </dui-tree-item>
          </dui-tree-item>
        </dui-tree>
      </prim-demo>

      <prim-demo label="Async loading (has-children + dui-load-children)">
        <p style="font-size:13px;color:#666;margin:0 0 8px;">
          Branches with <code>has-children</code> render as branches even though
          they're empty. The first time the user expands one,
          <code>dui-load-children</code> fires. Set <code>loading</code> while
          fetching, then append child <code>&lt;dui-tree-item&gt;</code>
          elements when the data arrives.
        </p>
        <style>
          .async-tree dui-tree-item[data-loading]::part(indicator)::before {
            content: "⧗";
            font-size: 13px;
            color: #888;
            animation: dui-tree-spin 1s linear infinite;
            transform: none !important;
          }
          @keyframes dui-tree-spin {
            to { transform: rotate(360deg); }
          }
        </style>
        <dui-tree
          class="tree-demo async-tree"
          aria-label="Remote files"
          style="${treeStyle}"
          @dui-load-children=${this.#onLoadChildren}
        >
          <dui-tree-item value="remote-src" has-children>
            <span slot="label">📁 remote/src</span>
          </dui-tree-item>
          <dui-tree-item value="remote-docs" has-children>
            <span slot="label">📁 remote/docs</span>
          </dui-tree-item>
          <dui-tree-item value="remote-readme">
            <span slot="label">📄 README.md</span>
          </dui-tree-item>
        </dui-tree>
      </prim-demo>

      <prim-demo label="Controlled mode (external state)">
        <p style="font-size:13px;color:#666;margin:0 0 8px;">
          Bind <code>.expandedValues</code> and <code>.selectedValues</code>
          to your own reactive state. The buttons mutate state directly; the
          tree dispatches change events back so the state stays in sync.
        </p>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
          <button type="button" style="${this.#btnStyle()}" @click=${this.#expandAll}>Expand all</button>
          <button type="button" style="${this.#btnStyle()}" @click=${this.#collapseAll}>Collapse all</button>
          <button type="button" style="${this.#btnStyle()}" @click=${this.#selectRandom}>Select random</button>
          <button type="button" style="${this.#btnStyle()}" @click=${this.#clearSelection}>Clear selection</button>
        </div>
        <dui-tree
          class="tree-demo"
          aria-label="Controlled tree"
          selection-mode="single"
          .expandedValues=${this.#ctrlExpanded}
          .selectedValues=${this.#ctrlSelected}
          style="${treeStyle}"
          @dui-expanded-change=${(e: CustomEvent) => {
            this.#ctrlExpanded = (e.detail as { values: string[] }).values;
          }}
          @dui-selection-change=${(e: CustomEvent) => {
            this.#ctrlSelected = (e.detail as { values: string[] }).values;
          }}
        >
          <dui-tree-item value="alpha">
            <span slot="label">Alpha</span>
            <dui-tree-item value="alpha-1"><span slot="label">Alpha 1</span></dui-tree-item>
            <dui-tree-item value="alpha-2"><span slot="label">Alpha 2</span></dui-tree-item>
          </dui-tree-item>
          <dui-tree-item value="beta">
            <span slot="label">Beta</span>
            <dui-tree-item value="beta-1"><span slot="label">Beta 1</span></dui-tree-item>
            <dui-tree-item value="beta-2"><span slot="label">Beta 2</span></dui-tree-item>
          </dui-tree-item>
          <dui-tree-item value="gamma">
            <span slot="label">Gamma</span>
          </dui-tree-item>
        </dui-tree>
        <pre style="${this.#logStyle()}">expanded: ${JSON.stringify(this.#ctrlExpanded)}
selected: ${JSON.stringify(this.#ctrlSelected)}</pre>
      </prim-demo>

      <prim-demo label="SVG chevron (alternative to ::before text)">
        <p style="font-size:13px;color:#666;margin:0 0 8px;">
          Instead of <code>::part(indicator)::before { content: "▸" }</code>,
          use a <code>mask-image</code> with an inline SVG. Works in older
          browsers (e.g. Firefox &lt; 128) and lets you color the chevron via
          <code>background-color</code>.
        </p>
        <style>
          .svg-chevron dui-tree-item[data-branch]::part(indicator) {
            background-color: #888;
            -webkit-mask: var(--chev) no-repeat center / 60% 60%;
            mask: var(--chev) no-repeat center / 60% 60%;
            transition: transform 200ms ease;
            --chev: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5 3 L12 8 L5 13 Z' fill='black'/></svg>");
          }
          .svg-chevron dui-tree-item[data-expanded]::part(indicator) {
            transform: rotate(90deg);
          }
          /* Override the text-based chevron from the shared style block. */
          .svg-chevron dui-tree-item[data-branch]::part(indicator)::before {
            content: none;
          }
        </style>
        <dui-tree
          class="tree-demo svg-chevron"
          aria-label="SVG chevron tree"
          default-expanded-values='["svg-pkg"]'
          style="${treeStyle}"
        >
          <dui-tree-item value="svg-pkg">
            <span slot="label">📦 packages</span>
            <dui-tree-item value="svg-pkg-core"><span slot="label">core</span></dui-tree-item>
            <dui-tree-item value="svg-pkg-ui"><span slot="label">ui</span></dui-tree-item>
          </dui-tree-item>
          <dui-tree-item value="svg-readme">
            <span slot="label">📄 README.md</span>
          </dui-tree-item>
        </dui-tree>
      </prim-demo>

      <prim-demo label="Long labels (truncation with ellipsis)">
        <p style="font-size:13px;color:#666;margin:0 0 8px;">
          Labels can overflow at deep nesting levels. Make the label slot
          flex-grow with <code>min-width: 0</code> so it can shrink, then add
          <code>text-overflow: ellipsis</code>.
        </p>
        <style>
          .truncate-tree [slot="label"] {
            flex: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        </style>
        <dui-tree
          class="tree-demo truncate-tree"
          aria-label="Long labels"
          default-expanded-values='["trunc-1","trunc-2"]'
          style="${treeStyle.replace("380px", "260px")}"
        >
          <dui-tree-item value="trunc-1">
            <span slot="label">a-very-long-folder-name-that-overflows</span>
            <dui-tree-item value="trunc-1-a">
              <span slot="label">nested-and-deeply-indented-file-name.tsx</span>
              <span slot="end">12k</span>
            </dui-tree-item>
            <dui-tree-item value="trunc-2">
              <span slot="label">another-deeply-nested-folder</span>
              <dui-tree-item value="trunc-2-a">
                <span slot="label">extremely-long-component-implementation.tsx</span>
                <span slot="end">⚠️</span>
              </dui-tree-item>
            </dui-tree-item>
          </dui-tree-item>
          <dui-tree-item value="trunc-short">
            <span slot="label">short.md</span>
          </dui-tree-item>
        </dui-tree>
      </prim-demo>

      <!-- ─────────────────────────────────────────────────────────────── -->
      <prim-demo label="Keyboard navigation">
        <p style="font-size:13px;color:#666;margin:0 0 12px;">
          Tab into the tree, then use:
        </p>
        <table
          style="font-size:13px;border-collapse:collapse;width:100%;max-width:560px;"
        >
          <tbody>
            ${[
              ["↓ / ↑", "Move focus to next / previous visible item"],
              [
                "→",
                "Closed branch: expand. Open branch: move to first child. Leaf: nothing.",
              ],
              [
                "←",
                "Open branch: collapse. Closed branch or leaf: move to parent.",
              ],
              [
                "Enter / Space",
                "Activate (toggles selection if selectable, else expands branches or fires dui-action on leaves)",
              ],
              ["Home / End", "Move to first / last visible item"],
              ["*", "Expand all sibling branches at the focused level"],
              ["a–z", "Type-ahead: jump to next item whose label starts with typed character(s)"],
            ].map(([key, desc]) => html`
              <tr style="border-bottom:1px solid #f0f0f0;">
                <td
                  style="padding:6px 16px 6px 0;white-space:nowrap;vertical-align:top;"
                >
                  <kbd style="${this.#kbdStyle()}">${key}</kbd>
                </td>
                <td style="padding:6px 0;color:#444;">${desc}</td>
              </tr>
            `)}
          </tbody>
        </table>
      </prim-demo>

      <!-- ─────────────────────────────────────────────────────────────── -->
      <prim-demo label="Styling pattern (read me!)">
        <p style="font-size:13px;color:#444;margin:0 0 8px;">
          Two structural details to remember when styling trees:
        </p>
        <pre style="${this.#codeStyle()}"><code>/*
 * 1. Indent the ROW, not the host. The indicator always reserves space
 *    so leaves and branches at the same level align horizontally.
 */
dui-tree-item::part(content) {
  padding-inline-start: calc((var(--dui-tree-level) - 1) * 22px + 8px);
}
dui-tree-item::part(indicator) {
  width: 16px;  /* reserves space even on leaves */
}

/*
 * 2. Add chevron content via [data-branch] on the host.
 *    [part="indicator"] is rendered for both branches AND leaves;
 *    we only show the chevron on branches.
 */
dui-tree-item[data-branch]::part(indicator)::before {
  content: "▸";
  transition: transform 200ms;
}
dui-tree-item[data-expanded]::part(indicator)::before {
  transform: rotate(90deg);
}

/*
 * 3. Style ::part(content) for hover and selection — NOT ::part(root).
 *    [part="root"] contains the children's group, so styling :hover on
 *    it would bleed the highlight onto every descendant row.
 */
dui-tree-item::part(content):hover         { background: #f3f4f6; }
dui-tree-item[data-selected]::part(content){ background: #dbeafe; }</code></pre>
        <p style="font-size:13px;color:#444;margin:8px 0 0;">
          State attrs reflected to the host element:
          <code>data-expanded</code>, <code>data-selected</code>,
          <code>data-disabled</code>, <code>data-branch</code>,
          <code>data-leaf</code>, <code>data-focus</code>,
          <code>data-level</code>.
        </p>
      </prim-demo>
    `;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  #bindLog(elementId: string) {
    return (e: CustomEvent) => {
      const el = this.querySelector(`#${elementId}`);
      if (!el) return;
      const detail = e.detail as Record<string, unknown>;
      const eventName = e.type.replace(/^dui-/, "");
      const value =
        "values" in detail
          ? JSON.stringify(detail.values)
          : "value" in detail
          ? JSON.stringify(detail.value)
          : JSON.stringify(detail);
      el.textContent = `${eventName}: ${value}`;
    };
  }

  #logStyle(): string {
    return `
      margin: 8px 0 0;
      padding: 6px 10px;
      font-size: 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      background: #f8f8f8;
      border: 1px solid #eee;
      border-radius: 4px;
      color: #555;
    `.replace(/\n\s+/g, " ");
  }

  #kbdStyle(): string {
    return `
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 12px;
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 3px;
      border: 1px solid #ddd;
    `.replace(/\n\s+/g, " ");
  }

  #codeStyle(): string {
    return `
      font-size: 12px;
      background: #f8f8f8;
      border: 1px solid #eee;
      border-radius: 4px;
      padding: 12px;
      overflow: auto;
      margin: 0;
      line-height: 1.5;
    `.replace(/\n\s+/g, " ");
  }

  #btnStyle(): string {
    return `
      font: inherit;
      font-size: 12px;
      padding: 4px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: #fff;
      cursor: pointer;
    `.replace(/\n\s+/g, " ");
  }

  // ─── Controlled-mode handlers ────────────────────────────────────────────

  #expandAll = (): void => {
    this.#ctrlExpanded = ["alpha", "beta"];
  };

  #collapseAll = (): void => {
    this.#ctrlExpanded = [];
  };

  #selectRandom = (): void => {
    const all = ["alpha", "alpha-1", "alpha-2", "beta", "beta-1", "beta-2", "gamma"];
    this.#ctrlSelected = [all[Math.floor(Math.random() * all.length)]];
  };

  #clearSelection = (): void => {
    this.#ctrlSelected = [];
  };

  // ─── Async-loading handler ───────────────────────────────────────────────

  #onLoadChildren = async (e: CustomEvent<{ value: string }>): Promise<void> => {
    const item = e.target as HTMLElement & { loading?: boolean };
    if (!item) return;

    item.loading = true;

    // Simulate a network fetch
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Append fake children
    const children = [
      { value: `${e.detail.value}-a`, label: "index.ts" },
      { value: `${e.detail.value}-b`, label: "types.ts" },
      { value: `${e.detail.value}-c`, label: "utils.ts" },
    ];
    for (const c of children) {
      const el = document.createElement("dui-tree-item");
      el.setAttribute("value", c.value);
      const label = document.createElement("span");
      label.setAttribute("slot", "label");
      label.textContent = `📄 ${c.label}`;
      el.appendChild(label);
      item.appendChild(el);
    }

    item.loading = false;
  };
}
