import { html, LitElement } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import type { DuiSplitterPrimitive } from "@dui/primitives/splitter";

@customElement("docs-page-splitter")
export class DocsPageSplitter extends LitElement {
  protected override createRenderRoot() {
    return this;
  }

  // ── Controlled-mode demo state ─────────────────────────────────────────
  @state() accessor #controlledSizes: number[] = [25, 50, 25];

  #onControlledChange = (ev: Event): void => {
    const detail = (ev as CustomEvent<number[]>).detail;
    this.#controlledSizes = detail;
  };

  #resetControlled = (): void => {
    this.#controlledSizes = [25, 50, 25];
  };

  // ── Auto-save demo: clear stored layout ────────────────────────────────
  #clearAutoSave = (): void => {
    this.#clearStoredLayout("dui-splitter:docs-splitter-demo:");
  };

  #clearStoredLayout(prefix: string): void {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) keys.push(k);
      }
      for (const k of keys) localStorage.removeItem(k);
      location.reload();
    } catch {
      // ignore
    }
  }

  // ── Programmatic API demo ────────────────────────────────────
  @query("#prog-splitter")
  accessor #progSplitter!: DuiSplitterPrimitive;

  @state() accessor #progSizes: number[] = [25, 50, 25];
  @state() accessor #progCollapsed: string[] = [];

  #onProgChange = (ev: Event): void => {
    const detail = (ev as CustomEvent<number[]>).detail;
    this.#progSizes = detail.map((n) => Math.round(n * 10) / 10);
    // The collapsed-state mirror is read off the element itself — it's
    // local to the splitter, not part of value-change.
    const splitter = this.#progSplitter;
    if (splitter) {
      this.#progCollapsed = ["a", "b", "c"].filter((id) =>
        splitter.isPanelCollapsed(id),
      );
    }
  };

  #progCollapse = (id: string) => () => this.#progSplitter?.collapsePanel(id);
  #progExpand = (id: string) => () => this.#progSplitter?.expandPanel(id);
  #progReset = () => this.#progSplitter?.resetSizes();
  #progSetEqual = () => this.#progSplitter?.setSizes([33.33, 33.34, 33.33]);
  #progSetWide = () => this.#progSplitter?.setSizes([10, 80, 10]);

  // ── Auto-save with collapse ──────────────────────────────────
  @query("#persist-splitter")
  accessor #persistSplitter!: DuiSplitterPrimitive;

  #persistToggleSidebar = (): void => {
    const s = this.#persistSplitter;
    if (!s) return;
    if (s.isPanelCollapsed("sidebar")) s.expandPanel("sidebar");
    else s.collapsePanel("sidebar");
  };

  #clearPersistAutoSave = (): void => {
    this.#clearStoredLayout("dui-splitter:docs-splitter-collapse:");
  };

  override render() {
    return html`
      <h1>Splitter</h1>
      <p class="subtitle">
        Resizable panel group for dividing an area into draggable, constrained
        panes. Implements the
        <a
          href="https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/"
          target="_blank"
          rel="noopener"
        >W3C ARIA Window Splitter pattern</a>.
      </p>

      <!--
        ─────────────────────────────────────────────────────────────────────
        SHARED STYLES — the canonical styling pattern for splitters.

        Three key principles:

        1. SIZE THE CONTAINER. The splitter fills its parent — give it an
           explicit width AND height (or place it inside a flex/grid track
           that does). Without a height, vertical splitters collapse to 0.

        2. STYLE PANEL CONTENT VIA ::part(root), NOT THE HOST. The panel
           host is structural — it owns flex-basis. Padding, backgrounds,
           and content layout belong on [part="root"].

        3. PAINT THE HANDLE. The handle host has zero default size. Make
           it visible by setting width/height (depending on orientation).
           A 4-6px host with a thin centered visual line is common.
        ─────────────────────────────────────────────────────────────────────
      -->
      <style>
        .splitter-demo {
          width: 100%;
          height: 240px;
          border: 1px solid #ddd;
          border-radius: 6px;
          overflow: hidden;
          background: #fff;
        }

        /* Panel content surface — this is where consumers paint. */
        .splitter-demo dui-splitter-panel::part(root) {
          padding: 12px;
          font-size: 13px;
          color: #555;
          background: #fafafa;
          height: 100%;
          overflow: auto;
        }

        .splitter-demo dui-splitter-panel:nth-of-type(even)::part(root) {
          background: #f0f0f5;
        }

        /* Handle: 4px wide for horizontal, 4px tall for vertical. */
        .splitter-demo dui-splitter-handle[data-orientation="horizontal"] {
          flex: 0 0 4px;
        }
        .splitter-demo dui-splitter-handle[data-orientation="vertical"] {
          flex: 0 0 4px;
        }

        .splitter-demo dui-splitter-handle::part(root) {
          background: #e5e5e5;
          transition: background-color 0.15s ease;
        }

        .splitter-demo dui-splitter-handle:hover::part(root),
        .splitter-demo dui-splitter-handle[data-dragging]::part(root) {
          background: #2563eb;
        }

        .splitter-demo dui-splitter-handle[data-focused]::part(root) {
          outline: 2px solid #2563eb;
          outline-offset: -2px;
        }

        .splitter-demo dui-splitter-handle[data-disabled]::part(root) {
          background: #f0f0f0;
        }
        .splitter-demo dui-splitter-handle[data-disabled]:hover::part(root) {
          background: #f0f0f0;
        }

        /* Panel hosting a nested splitter: drop inner padding so the
           nested splitter fills flush, skip the alternating bg (inner
           panels paint their own), and clip rather than scroll — the
           base panel rule sets overflow:auto for text content, but a
           nested splitter fills 100%/100% and any sub-pixel rounding
           would otherwise surface a phantom scrollbar. */
        .splitter-demo dui-splitter-panel.nested-host::part(root) {
          padding: 0;
          background: transparent;
          overflow: hidden;
        }

        @media (prefers-color-scheme: dark) {
          .splitter-demo {
            border-color: #2a2a35;
            background: #1a1a22;
          }
          .splitter-demo dui-splitter-panel::part(root) {
            background: #1f1f29;
            color: #aaa;
          }
          .splitter-demo dui-splitter-panel:nth-of-type(even)::part(root) {
            background: #25252f;
          }
          .splitter-demo dui-splitter-panel.nested-host::part(root) {
            background: transparent;
          }
          .splitter-demo dui-splitter-handle::part(root) {
            background: #333340;
          }
        }

        /* Inline live-readout for the controlled demo. */
        .splitter-readout {
          margin-top: 8px;
          font-family:
            ui-monospace, "SF Mono", Menlo, Consolas, monospace;
          font-size: 12px;
          color: #666;
        }

        .demo-controls {
          margin-bottom: 12px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .demo-controls button {
          padding: 4px 10px;
          font-size: 12px;
          border: 1px solid #ccc;
          background: #fff;
          border-radius: 4px;
          cursor: pointer;
        }
        .demo-controls button:hover {
          background: #f5f5f5;
        }
      </style>

      <!-- ───────────────────── 1. Basic horizontal ─────────────────────── -->
      <prim-demo
        label="Basic horizontal — drag a handle to resize, double-click to reset"
      >
        <div class="splitter-demo">
          <dui-splitter>
            <dui-splitter-panel panel-id="left">Left</dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="middle">Middle</dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="right">Right</dui-splitter-panel>
          </dui-splitter>
        </div>
      </prim-demo>

      <!-- ───────────────────── 2. Vertical ─────────────────────────────── -->
      <prim-demo label="Vertical — default 30 / 70">
        <div class="splitter-demo">
          <dui-splitter
            orientation="vertical"
            .defaultValue=${[30, 70]}
          >
            <dui-splitter-panel panel-id="top">Top (30%)</dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="bottom">Bottom (70%)</dui-splitter-panel>
          </dui-splitter>
        </div>
      </prim-demo>

      <!-- ───────────────────── 3. Min/max constraints ──────────────────── -->
      <prim-demo
        label="Min / max constraints — middle panel locked between 20% and 40%"
      >
        <div class="splitter-demo">
          <dui-splitter .defaultValue=${[30, 30, 40]}>
            <dui-splitter-panel panel-id="a" min-size="10">
              A · min 10%
            </dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="b" min-size="20" max-size="40">
              B · 20%–40%
            </dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="c" min-size="10">
              C · min 10%
            </dui-splitter-panel>
          </dui-splitter>
        </div>
      </prim-demo>

      <!-- ───────────────────── 4. Controlled mode ──────────────────────── -->
      <prim-demo
        label="Controlled — sizes flow through the host's @state, mirrored back via .value"
      >
        <div class="demo-controls">
          <button @click=${this.#resetControlled}>Reset to 25 / 50 / 25</button>
          <button
            @click=${() => (this.#controlledSizes = [10, 80, 10])}
          >Set 10 / 80 / 10</button>
          <button
            @click=${() => (this.#controlledSizes = [50, 25, 25])}
          >Set 50 / 25 / 25</button>
        </div>
        <div class="splitter-demo">
          <dui-splitter
            .value=${this.#controlledSizes}
            @value-change=${this.#onControlledChange}
          >
            <dui-splitter-panel panel-id="x">Pane X</dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="y">Pane Y</dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="z">Pane Z</dui-splitter-panel>
          </dui-splitter>
        </div>
        <div class="splitter-readout">
          value = [${
            this.#controlledSizes.map((n) => n.toFixed(1)).join(", ")
          }]
        </div>
      </prim-demo>

      <!-- ───────────────────── 5. Auto-save ────────────────────────────── -->
      <prim-demo
        label="Auto-save — drag the handle, then reload the page. Layout persists via localStorage."
      >
        <div class="demo-controls">
          <button @click=${this.#clearAutoSave}>
            Clear saved layout & reload
          </button>
        </div>
        <div class="splitter-demo">
          <dui-splitter auto-save-id="docs-splitter-demo">
            <dui-splitter-panel panel-id="files">Files</dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="editor">Editor</dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="preview">Preview</dui-splitter-panel>
          </dui-splitter>
        </div>
      </prim-demo>

      <!-- ───────────────────── 6. Disabled ─────────────────────────────── -->
      <prim-demo label="Disabled — group-level and per-handle">
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div>
            <div class="splitter-readout" style="margin-bottom: 6px;">
              Group-level <code>disabled</code>
            </div>
            <div class="splitter-demo" style="height: 120px;">
              <dui-splitter disabled .defaultValue=${[40, 60]}>
                <dui-splitter-panel panel-id="a">Locked A</dui-splitter-panel>
                <dui-splitter-handle></dui-splitter-handle>
                <dui-splitter-panel panel-id="b">Locked B</dui-splitter-panel>
              </dui-splitter>
            </div>
          </div>
          <div>
            <div class="splitter-readout" style="margin-bottom: 6px;">
              Per-handle <code>disabled</code> — middle handle frozen,
              outer handles movable
            </div>
            <div class="splitter-demo" style="height: 120px;">
              <dui-splitter .defaultValue=${[25, 25, 25, 25]}>
                <dui-splitter-panel panel-id="p1">P1</dui-splitter-panel>
                <dui-splitter-handle></dui-splitter-handle>
                <dui-splitter-panel panel-id="p2">P2</dui-splitter-panel>
                <dui-splitter-handle disabled></dui-splitter-handle>
                <dui-splitter-panel panel-id="p3">P3</dui-splitter-panel>
                <dui-splitter-handle></dui-splitter-handle>
                <dui-splitter-panel panel-id="p4">P4</dui-splitter-panel>
              </dui-splitter>
            </div>
          </div>
        </div>
      </prim-demo>

      <!-- ───────────────────── 7. Keyboard ─────────────────────────────── -->
      <prim-demo label="Keyboard — Tab to a handle, then use the keys below">
        <div class="splitter-readout" style="margin-bottom: 8px;">
          <strong>Arrow keys</strong> nudge by
          <code>keyboard-step</code> ·
          <strong>Shift + Arrow</strong> nudges by
          <code>keyboard-step-large</code> ·
          <strong>Home</strong> snaps before-panel to its
          <code>min-size</code> ·
          <strong>End</strong> snaps before-panel to its <code>max-size</code>
          · <strong>Double-click</strong> a handle to reset its two adjacent
          panels to their initial sizes
        </div>
        <div class="splitter-demo">
          <dui-splitter
            keyboard-step="5"
            keyboard-step-large="20"
            .defaultValue=${[33, 34, 33]}
          >
            <dui-splitter-panel panel-id="kbd-a" min-size="10" max-size="80">
              Tab into a handle →
            </dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="kbd-b" min-size="10" max-size="80">
              5% per arrow, 20% with Shift
            </dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="kbd-c" min-size="10" max-size="80">
              Home / End jump to limits
            </dui-splitter-panel>
          </dui-splitter>
        </div>
      </prim-demo>

      <!-- ───────────────────── 8. Many panels ──────────────────────────── -->
      <prim-demo label="Many panels — five equal columns">
        <div class="splitter-demo">
          <dui-splitter>
            <dui-splitter-panel panel-id="m1">1</dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="m2">2</dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="m3">3</dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="m4">4</dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="m5">5</dui-splitter-panel>
          </dui-splitter>
        </div>
      </prim-demo>

      <!-- ─────────────────── 9. Programmatic API ─────────────── -->
      <prim-demo
        label="Programmatic API — collapsePanel / expandPanel / setSizes / resetSizes"
      >
        <div class="splitter-readout" style="margin-bottom: 8px;">
          The splitter element exposes imperative methods for layout
          control. <code>collapsePanel(id)</code> forces a panel to size 0
          (bypassing its <code>min-size</code>) and donates the space to a
          neighbor; <code>expandPanel(id)</code> reverses it.
          <code>setSizes(arr)</code> assigns sizes wholesale (works in
          uncontrolled mode — no need to mirror via <code>.value</code>).
          <code>resetSizes()</code> restores the layout active when the
          panel set first mounted and clears any collapsed panels.
        </div>
        <div class="demo-controls">
          <button @click=${this.#progCollapse("a")}>Collapse A</button>
          <button @click=${this.#progExpand("a")}>Expand A</button>
          <button @click=${this.#progCollapse("c")}>Collapse C</button>
          <button @click=${this.#progExpand("c")}>Expand C</button>
          <button @click=${this.#progSetEqual}>setSizes equal</button>
          <button @click=${this.#progSetWide}>setSizes 10 / 80 / 10</button>
          <button @click=${this.#progReset}>resetSizes</button>
        </div>
        <div class="splitter-demo">
          <dui-splitter
            id="prog-splitter"
            .defaultValue=${[25, 50, 25]}
            @value-change=${this.#onProgChange}
          >
            <dui-splitter-panel panel-id="a" min-size="15">
              A · min 15%
            </dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="b" min-size="20">
              B · min 20%
            </dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="c" min-size="15">
              C · min 15%
            </dui-splitter-panel>
          </dui-splitter>
        </div>
        <div class="splitter-readout">
          sizes = [${this.#progSizes.map((n) => n.toFixed(1)).join(", ")}]
          · collapsed = [${
            this.#progCollapsed.length === 0
              ? "—"
              : this.#progCollapsed.join(", ")
          }]
        </div>
      </prim-demo>

      <!-- ───────────── 10. Auto-save with collapse ───────────── -->
      <prim-demo
        label="Auto-save with collapse — collapse the sidebar, then reload. Both sizes and collapsed state persist."
      >
        <div class="demo-controls">
          <button @click=${this.#persistToggleSidebar}>
            Toggle sidebar collapse
          </button>
          <button @click=${this.#clearPersistAutoSave}>
            Clear saved layout & reload
          </button>
        </div>
        <div class="splitter-demo">
          <dui-splitter
            id="persist-splitter"
            auto-save-id="docs-splitter-collapse"
            .defaultValue=${[20, 80]}
          >
            <dui-splitter-panel panel-id="sidebar" min-size="15">
              Sidebar
            </dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="main">
              Main
            </dui-splitter-panel>
          </dui-splitter>
        </div>
      </prim-demo>

      <!-- ─────────────────── 11. Nested splitters ─────────────── -->
      <prim-demo
        label="Nested splitters — horizontal containing a vertical (IDE layout)"
      >
        <div class="splitter-readout" style="margin-bottom: 8px;">
          Each <code>&lt;dui-splitter&gt;</code> provides its own context
          — the inner vertical splitter's handles only resize its two
          children, never the outer panels. Try dragging both, plus
          double-click to reset each independently.
        </div>
        <div class="splitter-demo" style="height: 280px;">
          <dui-splitter .defaultValue=${[20, 55, 25]}>
            <dui-splitter-panel panel-id="files" min-size="10">
              Files
            </dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel
              panel-id="middle"
              min-size="20"
              class="nested-host"
            >
              <dui-splitter
                orientation="vertical"
                .defaultValue=${[65, 35]}
              >
                <dui-splitter-panel panel-id="editor">
                  Editor
                </dui-splitter-panel>
                <dui-splitter-handle></dui-splitter-handle>
                <dui-splitter-panel panel-id="terminal">
                  Terminal
                </dui-splitter-panel>
              </dui-splitter>
            </dui-splitter-panel>
            <dui-splitter-handle></dui-splitter-handle>
            <dui-splitter-panel panel-id="preview" min-size="10">
              Preview
            </dui-splitter-panel>
          </dui-splitter>
        </div>
      </prim-demo>

      <prim-demo label="ARIA orientation note">
        <p style="font-size: 13px; color: #666; margin: 0;">
          Per the W3C ARIA spec, the handle's
          <code>aria-orientation</code> describes the
          <em>separator line</em>, which is perpendicular to the splitter
          axis. A horizontal splitter (panels laid out left-to-right) has
          handles with <code>aria-orientation="vertical"</code> because the
          visible separator is a vertical line. This is intentional — not a
          bug — and matches the
          <a
            href="https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/"
            target="_blank"
            rel="noopener"
          >Window Splitter pattern</a>.
        </p>
      </prim-demo>
    `;
  }
}
