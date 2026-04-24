declare const __DUI_VERSION__: string;

import { LitElement, html, css, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { NAV_GROUPS } from "./primitive-registry.ts";

/**
 * Minimal docs shell for dui-primitives.
 * Developer-tool aesthetic — clean, minimal, behavior-focused.
 */
@customElement("docs-app")
export class DocsApp extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1a1a2e;
      background: #fafafa;
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      :host {
        color: #e0e0e0;
        background: #111118;
      }
      .top-bar { border-color: #2a2a35; background: #111118; }
      .sidebar { border-color: #2a2a35; background: #16161e; }
      .sidebar a { color: #a0a0b0; }
      .sidebar a:hover, .sidebar a.active { color: #fff; background: #22222e; }
      .main-content { background: #111118; }
    }

    /* ── Top bar ── */
    .top-bar {
      position: sticky;
      top: 0;
      z-index: 40;
      height: 52px;
      display: flex;
      align-items: center;
      padding: 0 24px;
      border-bottom: 1px solid #e5e5e5;
      background: #fafafa;
    }

    .logo {
      font-size: 15px;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: inherit;
      text-decoration: none;
    }

    .logo span { opacity: 0.5; font-weight: 400; margin-left: 8px; }

    /* ── Layout ── */
    .layout {
      display: flex;
      flex: 1;
    }

    /* ── Sidebar ── */
    .sidebar {
      width: 240px;
      flex-shrink: 0;
      border-right: 1px solid #e5e5e5;
      padding: 16px 0;
      position: sticky;
      top: 52px;
      height: calc(100vh - 52px);
      overflow-y: auto;
    }

    .sidebar h3 {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #888;
      padding: 12px 20px 4px;
      margin: 0;
    }

    .sidebar a {
      display: block;
      padding: 5px 20px;
      font-size: 13px;
      color: #555;
      text-decoration: none;
      border-radius: 0;
    }

    .sidebar a:hover {
      background: #f0f0f0;
      color: #111;
    }

    .sidebar a.active {
      color: #111;
      font-weight: 600;
      background: #eee;
    }

    /* ── Main content ── */
    .main-content {
      flex: 1;
      min-width: 0;
      padding: 32px 48px;
      max-width: 900px;
    }

    .main-content h1 {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px;
    }

    .main-content .subtitle {
      font-size: 15px;
      color: #666;
      margin: 0 0 32px;
    }
  `;

  @state() accessor #currentSlug = this.#getSlugFromHash();

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener("hashchange", () => {
      this.#currentSlug = this.#getSlugFromHash();
    });
  }

  #getSlugFromHash(): string {
    const hash = location.hash.replace("#", "");
    return hash || "button";
  }

  #navigate(slug: string) {
    location.hash = slug;
    this.#currentSlug = slug;
  }

  override render() {
    return html`
      <div class="top-bar">
        <a class="logo" href="#button" @click=${() => this.#navigate("button")}>
          dui-primitives <span>v${__DUI_VERSION__}</span>
        </a>
      </div>

      <div class="layout">
        <nav class="sidebar">
          ${NAV_GROUPS.map(group => html`
            <h3>${group.label}</h3>
            ${group.slugs.map(slug => html`
              <a
                href="#${slug}"
                class=${this.#currentSlug === slug ? "active" : ""}
                @click=${() => this.#navigate(slug)}
              >${slug}</a>
            `)}
          `)}
        </nav>

        <main class="main-content">
          ${this.#renderPage()}
        </main>
      </div>
    `;
  }

  #renderPage() {
    // Each demo page is a custom element named docs-page-{slug}
    const tag = `docs-page-${this.#currentSlug}`;
    if (customElements.get(tag)) {
      const el = document.createElement(tag);
      return html`${el}`;
    }
    return html`
      <h1>${this.#currentSlug}</h1>
      <p class="subtitle">Demo page coming soon. This primitive is registered and functional — try it in the console.</p>
    `;
  }
}
