import { LitElement, html, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { toast } from "@dui/primitives/toast";

type ToastType = "default" | "info" | "success" | "warning" | "error" | "loading";

type Item = {
  id: number;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
};

const themedIcon = (type: ToastType): TemplateResult | null => {
  switch (type) {
    case "success":
      return html`<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5l3 3 6.5-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    case "error":
      return html`<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
    case "warning":
      return html`<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1.5L14.5 13.5h-13z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 6v3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="8" cy="11.5" r="0.9" fill="currentColor"/></svg>`;
    case "info":
      return html`<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 7.5v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="8" cy="4.7" r="0.9" fill="currentColor"/></svg>`;
    case "loading":
      return html`<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="22 14"/></svg>`;
    default:
      return null;
  }
};

let nextId = 1;

@customElement("docs-page-toast")
export class DocsPageToast extends LitElement {
  protected override createRenderRoot() {
    return this;
  }

  @state() accessor #items: Item[] = [];
  @state() accessor #stackedItems: Item[] = [];
  @state() accessor #position:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right" = "bottom-right";

  // ---- Recipe 1 (themed) ----
  @state() accessor #themedItems: Item[] = [];

  // ---- Recipe 2 (sectional) ----
  @state() accessor #sectionalItems: Item[] = [];
  @state() accessor #profileName = "Alex Carter";
  @state() accessor #profileEmail = "alex@example.com";

  // ---- Recipe 3 (promise/loading) ----
  @state() accessor #profileSaving = false;
  @state() accessor #profileDraft = "Alex Carter";

  // ---- Recipe 4 (form validation) ----
  @state() accessor #formName = "";
  @state() accessor #formEmail = "";

  #spawn(item: Omit<Item, "id">) {
    this.#items = [...this.#items, { id: nextId++, ...item }];
  }

  #spawnStacked(item: Omit<Item, "id">) {
    this.#stackedItems = [...this.#stackedItems, { id: nextId++, ...item }];
  }

  #spawnThemed(item: Omit<Item, "id">) {
    this.#themedItems = [...this.#themedItems, { id: nextId++, ...item }];
  }

  #spawnSectional(item: Omit<Item, "id">) {
    this.#sectionalItems = [...this.#sectionalItems, { id: nextId++, ...item }];
  }

  #removeItem(id: number) {
    this.#items = this.#items.filter((i) => i.id !== id);
  }

  #removeStacked(id: number) {
    this.#stackedItems = this.#stackedItems.filter((i) => i.id !== id);
  }

  #removeThemed(id: number) {
    this.#themedItems = this.#themedItems.filter((i) => i.id !== id);
  }

  #removeSectional(id: number) {
    this.#sectionalItems = this.#sectionalItems.filter((i) => i.id !== id);
  }

  // ---- Recipe 3 logic ----

  #saveProfile() {
    if (this.#profileSaving) return;
    this.#profileSaving = true;
    const id = "recipe-save-profile";
    const value = this.#profileDraft;

    toast.loading("Saving profile…", {
      id,
      description: "Persisting changes to the server.",
    });

    new Promise<string>((resolve, reject) => {
      setTimeout(
        () => Math.random() > 0.4 ? resolve(value) : reject(new Error("Network timeout")),
        1400,
      );
    }).then(
      (saved) => {
        toast.success("Profile saved", {
          id,
          description: `Display name set to \u201C${saved}\u201D.`,
        });
        this.#profileSaving = false;
      },
      (err: Error) => {
        toast.error("Failed to save", {
          id,
          description: err.message,
          duration: 0,
          priority: "assertive",
          action: {
            label: "Retry",
            onClick: () => {
              this.#profileSaving = false;
              this.#saveProfile();
            },
          },
          closeButton: true,
        });
        this.#profileSaving = false;
      },
    );
  }

  // ---- Recipe 4 logic ----

  #validateEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  #submitValidationForm(e: Event) {
    e.preventDefault();
    const errors: { id: string; field: string; message: string }[] = [];
    if (!this.#formName.trim()) {
      errors.push({
        id: "recipe-err-name",
        field: "recipe-form-name",
        message: "Name is required",
      });
    } else {
      toast.dismiss("recipe-err-name");
    }
    if (!this.#formEmail.trim()) {
      errors.push({
        id: "recipe-err-email",
        field: "recipe-form-email",
        message: "Email is required",
      });
    } else if (!this.#validateEmail(this.#formEmail)) {
      errors.push({
        id: "recipe-err-email",
        field: "recipe-form-email",
        message: "Email format looks invalid",
      });
    } else {
      toast.dismiss("recipe-err-email");
    }

    if (errors.length === 0) {
      toast.success("Form submitted", {
        description: `Welcome, ${this.#formName}!`,
      });
      this.#formName = "";
      this.#formEmail = "";
      return;
    }

    for (const err of errors) {
      toast.error(err.message, {
        id: err.id,
        priority: "assertive",
        duration: 0,
        action: {
          label: "Fix",
          onClick: () => {
            const input = document.getElementById(err.field) as HTMLInputElement | null;
            input?.focus();
          },
        },
      });
    }
  }

  #onFormFieldInput(field: "name" | "email", value: string) {
    if (field === "name") {
      this.#formName = value;
      if (value.trim()) toast.dismiss("recipe-err-name");
    } else {
      this.#formEmail = value;
      if (value.trim() && this.#validateEmail(value)) {
        toast.dismiss("recipe-err-email");
      }
    }
  }

  override render() {
    // Minimal styling — just enough to see the toast's behavior. Consumers
    // would write their own theme on top of [part="root"], [part="title"], etc.
    const toastStyle = `
      --toast-bg: white;
      --toast-fg: #111;
      --toast-border: #ddd;
    `;

    const toastInternalCss = html`
      <style>
        /* Global styles — apply to BOTH the scoped declarative demos and the
           auto-created region the imperative facade puts under <body>. */
        dui-toast::part(root) {
          background: white;
          color: #111;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 12px 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          gap: 4px;
          opacity: 1;
          transition: opacity 200ms ease;
        }
        dui-toast::part(title) { font-weight: 600; font-size: 14px; }
        dui-toast::part(description) { font-size: 13px; color: #555; }
        /* Open/close fade. We don't override transform here so the swipe
           transform from the primitive's shadow stays in effect. */
        dui-toast[data-state="open"][data-starting-style]::part(root),
        dui-toast[data-ending-style]::part(root) {
          opacity: 0;
        }
        dui-toast[data-type="success"]::part(root) { border-color: #22c55e; }
        dui-toast[data-type="error"]::part(root)   { border-color: #ef4444; }
        dui-toast[data-type="warning"]::part(root) { border-color: #f59e0b; }
        dui-toast[data-type="info"]::part(root)    { border-color: #3b82f6; }
        dui-toast button {
          font: inherit; padding: 4px 8px;
          border: 1px solid #ccc; border-radius: 4px;
          background: white; cursor: pointer;
        }

        .toast-demo dui-toast::part(root) {
          background: var(--toast-bg, white);
          color: var(--toast-fg, #111);
          border: 1px solid var(--toast-border, #ddd);
          border-radius: 8px;
          padding: 12px 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          gap: 4px;
          opacity: 1;
          transition: opacity 200ms ease;
        }
        .toast-demo dui-toast::part(title) {
          font-weight: 600;
          font-size: 14px;
        }
        .toast-demo dui-toast::part(description) {
          font-size: 13px;
          color: #555;
        }
        .toast-demo dui-toast[data-state="open"][data-starting-style]::part(root),
        .toast-demo dui-toast[data-ending-style]::part(root) {
          opacity: 0;
        }
        .toast-demo dui-toast[data-type="success"]::part(root) {
          border-color: #22c55e;
        }
        .toast-demo dui-toast[data-type="error"]::part(root) {
          border-color: #ef4444;
        }
        .toast-demo dui-toast[data-type="warning"]::part(root) {
          border-color: #f59e0b;
        }
        .toast-demo dui-toast[data-type="info"]::part(root) {
          border-color: #3b82f6;
        }
        .toast-demo dui-toast button {
          font: inherit;
          padding: 4px 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: white;
          cursor: pointer;
        }

        /* Swipe transform + transitions are owned by the primitive's shadow
           CSS (transform on [part="root"] using --swipe-amount-x/y, plus
           per-data-swipe transition tweaks). No consumer CSS required. */

        /* ---- Stacked (Sonner-style) demo ---- */
        .stacked-demo {
          /* Reserve enough vertical space for the demo when expanded. */
          height: 200px;
          position: relative;
          border: 1px dashed #ddd;
          border-radius: 6px;
          padding: 12px;
          background: #fafafa;
        }
        .stacked-demo dui-toast-region {
          /* Anchor inside the demo box rather than the viewport. */
          position: absolute !important;
          inset: auto 12px 12px auto;
          --toast-region-gap: 0;
          --toast-region-width: 320px;
        }
        .stacked-demo dui-toast-region::part(list) {
          /* Absolute children stack on top of each other; min-height keeps
             the region clickable even when collapsed. */
          position: relative;
          min-height: 60px;
        }
        .stacked-demo dui-toast {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          transition: transform 350ms cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 250ms ease;
          /* Collapsed cascade: scale down + lift behind for bottom positions. */
          transform:
            translateY(calc(var(--toast-index, 0) * -14px))
            scale(calc(1 - var(--toast-index, 0) * 0.05));
          transform-origin: bottom center;
        }
        .stacked-demo dui-toast[data-position^="top-"] {
          top: 0;
          bottom: auto;
          transform-origin: top center;
          transform:
            translateY(calc(var(--toast-index, 0) * 14px))
            scale(calc(1 - var(--toast-index, 0) * 0.05));
        }
        /* Front toast and any expanded toasts are interactive. */
        .stacked-demo dui-toast[data-front],
        .stacked-demo dui-toast[data-region-expanded] {
          pointer-events: auto;
        }
        /* Expanded: lay out by cumulative height + per-step gap. */
        .stacked-demo dui-toast[data-region-expanded] {
          transform: translateY(
            calc(-1 * var(--toasts-before-height, 0px) - var(--toast-index, 0) * 8px)
          );
        }
        .stacked-demo dui-toast[data-position^="top-"][data-region-expanded] {
          transform: translateY(
            calc(var(--toasts-before-height, 0px) + var(--toast-index, 0) * 8px)
          );
        }
        /* Overflow toasts: hidden when collapsed, revealed when expanded. */
        .stacked-demo dui-toast[data-overflow] {
          opacity: 0;
          pointer-events: none;
        }
        .stacked-demo dui-toast[data-overflow][data-region-expanded] {
          opacity: 1;
          pointer-events: auto;
        }

        /* ============================================================ */
        /* Recipe 1: Themed (Sonner-style)                              */
        /* ============================================================ */
        .recipe-sonner {
          position: relative;
          height: 220px;
          padding: 16px;
          background:
            linear-gradient(135deg, #fafafa 0%, #f0f0f3 100%);
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          overflow: hidden;
        }
        .recipe-sonner dui-toast-region {
          position: absolute !important;
          inset: auto 16px 16px auto;
          --toast-region-gap: 0;
          --toast-region-width: 360px;
        }
        .recipe-sonner dui-toast-region::part(list) {
          position: relative;
          min-height: 60px;
        }
        .recipe-sonner dui-toast {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          pointer-events: none;
          transition:
            transform 400ms cubic-bezier(0.21, 1, 0.21, 1),
            opacity 250ms ease;
          transform-origin: bottom center;
          transform:
            translateY(calc(var(--toast-index, 0) * -10px))
            scale(calc(1 - var(--toast-index, 0) * 0.05));
        }
        .recipe-sonner dui-toast[data-front],
        .recipe-sonner dui-toast[data-region-expanded] {
          pointer-events: auto;
        }
        .recipe-sonner dui-toast[data-region-expanded] {
          transform: translateY(
            calc(-1 * var(--toasts-before-height, 0px) - var(--toast-index, 0) * 10px)
          );
        }
        .recipe-sonner dui-toast[data-overflow] { opacity: 0; pointer-events: none; }
        .recipe-sonner dui-toast[data-overflow][data-region-expanded] {
          opacity: 1; pointer-events: auto;
        }
        .recipe-sonner dui-toast::part(root) {
          background: white;
          color: #0a0a0a;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          padding: 13px 14px;
          box-shadow:
            0 4px 10px rgba(0,0,0,0.05),
            0 14px 32px -10px rgba(0,0,0,0.10);
          font-size: 13px;
          line-height: 1.5;
        }
        .recipe-sonner dui-toast::part(title) { font-weight: 500; }
        .recipe-sonner dui-toast .t-title-row {
          display: flex; align-items: center; gap: 10px;
        }
        .recipe-sonner dui-toast .t-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 16px; height: 16px; flex-shrink: 0;
        }
        .recipe-sonner dui-toast[data-type="success"] .t-icon { color: #16a34a; }
        .recipe-sonner dui-toast[data-type="error"]   .t-icon { color: #dc2626; }
        .recipe-sonner dui-toast[data-type="warning"] .t-icon { color: #ea580c; }
        .recipe-sonner dui-toast[data-type="info"]    .t-icon { color: #2563eb; }
        .recipe-sonner dui-toast[data-type="loading"] .t-icon { color: #525252; }
        .recipe-sonner dui-toast[data-type="loading"] .t-icon svg {
          animation: recipe-sonner-spin 1s linear infinite;
        }
        @keyframes recipe-sonner-spin { to { transform: rotate(360deg); } }
        .recipe-sonner dui-toast::part(description) {
          font-size: 12px; color: #707070;
          margin-top: 2px; margin-left: 26px;
        }

        /* ============================================================ */
        /* Recipe 2: Inline sectional notifications                     */
        /* ============================================================ */
        .recipe-sectional {
          position: relative;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          padding: 20px 20px 80px;
          background: white;
          max-width: 520px;
          overflow: hidden;
        }
        .recipe-sectional h3 {
          margin: 0 0 16px;
          font-size: 14px;
          font-weight: 600;
          color: #111;
        }
        .recipe-sectional .field {
          display: grid;
          grid-template-columns: 110px 1fr auto;
          gap: 8px;
          align-items: center;
          margin-bottom: 12px;
        }
        .recipe-sectional label {
          font-size: 13px; color: #444;
        }
        .recipe-sectional input {
          padding: 6px 10px;
          border: 1px solid #d4d4d4;
          border-radius: 5px;
          font: inherit;
          font-size: 13px;
        }
        .recipe-sectional .save-btn {
          font: inherit; font-size: 12px;
          padding: 6px 10px;
          border: 1px solid #d4d4d4; border-radius: 5px;
          background: white; cursor: pointer;
        }
        .recipe-sectional .save-btn:hover { background: #fafafa; }
        .recipe-sectional dui-toast-region {
          /* Override the primitive's position: fixed to scope to this panel. */
          position: absolute !important;
          inset: auto 16px 16px auto;
          --toast-region-width: 280px;
          z-index: 10;
        }
        .recipe-sectional dui-toast::part(root) {
          background: #f0fdf4;
          color: #14532d;
          border: 1px solid #86efac;
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 12px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          line-height: 1.4;
        }
        .recipe-sectional dui-toast::part(title) { font-weight: 600; }
        .recipe-sectional dui-toast::part(description) {
          margin-top: 2px; color: #166534; font-weight: 400;
        }

        /* ============================================================ */
        /* Recipe 4: Form-validation                                    */
        /* ============================================================ */
        .recipe-form {
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          padding: 20px;
          background: white;
          max-width: 480px;
        }
        .recipe-form .field {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 8px;
          align-items: center;
          margin-bottom: 12px;
        }
        .recipe-form label { font-size: 13px; color: #444; }
        .recipe-form input {
          padding: 6px 10px;
          border: 1px solid #d4d4d4;
          border-radius: 5px;
          font: inherit; font-size: 13px;
        }
        .recipe-form input:focus-visible {
          outline: 2px solid #2563eb; outline-offset: 1px;
          border-color: transparent;
        }
        .recipe-form button[type="submit"] {
          font: inherit; font-size: 13px;
          padding: 8px 16px;
          border: 1px solid #2563eb;
          background: #2563eb; color: white;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 4px;
        }
      </style>
    `;

    const btn = `
      padding: 8px 14px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background: #f5f5f5;
      cursor: pointer;
      font-size: 13px;
    `;

    const onDismiss = (e: CustomEvent<{ id: string; reason: string }>) => {
      // Match by toastId attribute we set below.
      const idStr = e.detail.id;
      const num = Number(idStr.replace(/\D/g, ""));
      this.#removeItem(num);
    };

    return html`
      ${toastInternalCss}
      <h1>Toast</h1>
      <p class="subtitle">
        A notification stack with auto-dismiss, hover/focus/visibility pause,
        and ARIA live-region wiring. Phase 1 ships the declarative compound
        primitive — stacking visuals, swipe, and the imperative
        <code>toast()</code> helper come in later phases.
      </p>

      <prim-demo label="Basic — spawn toasts">
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
          <button style="${btn}" @click=${() =>
        this.#spawn({
          title: "Saved",
          description: "Your changes are live.",
          type: "success",
        })}>
            Success
          </button>
          <button style="${btn}" @click=${() =>
        this.#spawn({
          title: "Heads up",
          description: "Something to be aware of.",
          type: "info",
        })}>
            Info
          </button>
          <button style="${btn}" @click=${() =>
        this.#spawn({
          title: "Careful",
          description: "Double-check before continuing.",
          type: "warning",
        })}>
            Warning
          </button>
          <button style="${btn}" @click=${() =>
        this.#spawn({
          title: "Failed",
          description: "Could not save your changes.",
          type: "error",
        })}>
            Error
          </button>
          <button style="${btn}" @click=${() =>
        this.#spawn({
          title: "Working…",
          type: "loading",
          duration: 0,
        })}>
            Loading (no auto-dismiss)
          </button>
        </div>
        <p style="font-size: 13px; color: #666; margin: 0;">
          Hover the toast region to pause auto-dismiss. Tab into it to pause
          on focus. Switch to another tab — timers pause via
          <code>visibilitychange</code>.
        </p>

        <div class="toast-demo">
          <dui-toast-region
            position=${this.#position}
            @toast-dismiss=${onDismiss}
          >
            ${this.#items.map((item) =>
              html`
                <dui-toast
                  toast-id="t-${item.id}"
                  type=${item.type}
                  duration=${item.duration ?? 4000}
                  style="${toastStyle}"
                >
                  <span slot="title">${item.title}</span>
                  ${item.description
                    ? html`<span slot="description">${item.description}</span>`
                    : null}
                  <div slot="close" style="margin-top: 4px; display: flex; justify-content: flex-end;">
                    <dui-toast-close>
                      <button aria-label="Dismiss">Close</button>
                    </dui-toast-close>
                  </div>
                </dui-toast>
              `
            )}
          </dui-toast-region>
        </div>
      </prim-demo>

      <prim-demo label="Position">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${(["top-left","top-center","top-right","bottom-left","bottom-center","bottom-right"] as const).map((p) => html`
            <button
              style="${btn} ${this.#position === p ? "background: #111; color: white;" : ""}"
              @click=${() => { this.#position = p; }}
            >${p}</button>
          `)}
        </div>
        <p style="font-size: 13px; color: #666; margin-top: 8px;">
          Active region: <code>${this.#position}</code>
        </p>
      </prim-demo>

      <prim-demo label="Action button — dismisses with reason 'action'">
        <button style="${btn}" @click=${() =>
        this.#spawn({
          title: "Email archived",
          description: "Removed from your inbox.",
          type: "default",
          duration: 8000,
        })}>
          Spawn with Undo
        </button>
        <p style="font-size: 13px; color: #666; margin-top: 8px;">
          The action's <code>click</code> handler runs, then the toast dismisses.
          Listen for <code>dismiss</code> with reason <code>"action"</code> to
          run the undo.
        </p>
      </prim-demo>

      <prim-demo label="Tier 2: full content control via default slot">
        <button style="${btn}" @click=${() =>
        this.#spawn({
          title: "__custom__",
          type: "default",
          duration: 5000,
        })}>
          Spawn custom-content toast
        </button>
        <p style="font-size: 13px; color: #666; margin-top: 8px;">
          When you use the default slot only (no <code>title</code>/<code>description</code>),
          you own the entire layout. The toast still announces via its live-region
          role and still respects auto-dismiss + pause behavior.
        </p>
      </prim-demo>

      <prim-demo label="Bare-metal escape hatch: [data-toast-dismiss]">
        <p style="font-size: 13px; color: #666; margin: 0;">
          Any descendant element with <code>data-toast-dismiss</code> will
          dismiss the parent toast on click — no need for
          <code>&lt;dui-toast-close&gt;</code>:
        </p>
        <pre style="font-size: 12px; background: #f5f5f5; padding: 8px; border-radius: 4px; overflow: auto;"><code>&lt;dui-toast&gt;
  &lt;span slot="title"&gt;Saved&lt;/span&gt;
  &lt;button data-toast-dismiss&gt;×&lt;/button&gt;
&lt;/dui-toast&gt;</code></pre>
      </prim-demo>

      <prim-demo label="Imperative API: toast(message, opts)">
        <p style="font-size: 13px; color: #555; margin: 0 0 12px;">
          Phase 3 ships a Sonner-style imperative facade that auto-creates a
          default <code>&lt;dui-toast-region&gt;</code> on first call. Same primitive
          underneath — imperative and declarative usage interleave freely.
        </p>
        <pre style="font-size: 12px; background: #f5f5f5; padding: 8px; border-radius: 4px; overflow: auto; margin: 0 0 12px;"><code>import { toast } from "@dui/primitives/toast";

toast("Saved", { description: "Your changes are live." });
toast.success("Profile updated");
toast.error("Network failed");
toast.promise(savePromise, {
  loading: "Saving…",
  success: (data) => \`Saved as \${data.name}\`,
  error: (err) => \`Failed: \${err.message}\`,
});</code></pre>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
          <button style="${btn}" @click=${() => toast("Quick note", { description: "Default type, polite priority." })}>
            toast()
          </button>
          <button style="${btn}" @click=${() => toast.success("Saved", { description: "Profile updated." })}>
            .success()
          </button>
          <button style="${btn}" @click=${() => toast.error("Network failed", { description: "Try again in a moment.", priority: "assertive" })}>
            .error()
          </button>
          <button style="${btn}" @click=${() => toast.warning("Heads up", { description: "This action is irreversible." })}>
            .warning()
          </button>
          <button style="${btn}" @click=${() => toast.info("Tip", { description: "Press F1 for shortcuts." })}>
            .info()
          </button>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button style="${btn}" @click=${() => {
            const id = toast.loading("Uploading…");
            setTimeout(() => toast.success("Upload complete", { id }), 1800);
          }}>
            .loading() → .success() (same id)
          </button>
          <button style="${btn}" @click=${() => {
            toast.promise(
              new Promise<{ name: string }>((resolve) =>
                setTimeout(() => resolve({ name: "report.pdf" }), 1500),
              ),
              {
                loading: "Generating report…",
                success: (data) => `Saved ${data.name}`,
                error: (err) => `Failed: ${err}`,
              },
            );
          }}>
            .promise() (resolves)
          </button>
          <button style="${btn}" @click=${() => {
            toast.promise(
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("timeout")), 1500),
              ),
              {
                loading: "Generating report…",
                success: "Saved",
                error: (err) => `Failed: ${(err as Error).message}`,
              },
            );
          }}>
            .promise() (rejects)
          </button>
          <button style="${btn}" @click=${() => {
            toast("Email archived", {
              description: "Removed from your inbox.",
              duration: 8000,
              action: {
                label: "Undo",
                onClick: () => toast.success("Restored"),
              },
              closeButton: true,
            });
          }}>
            with action + close
          </button>
          <button style="${btn}" @click=${() => toast.dismiss()}>
            dismiss all
          </button>
        </div>
        <p style="font-size: 12px; color: #888; margin-top: 8px;">
          The auto-region is appended to <code>&lt;body&gt;</code> on first call. Use
          <code>toast.configure({ position, target, region })</code> to customize.
        </p>
      </prim-demo>

      <prim-demo label="Stacked mode (Sonner-style cascade + expand on hover)">
        <p style="font-size: 13px; color: #555; margin: 0 0 12px;">
          Phase 2 exposes <code>--toast-index</code>, <code>--toast-height</code>,
          <code>--toasts-before-height</code>, plus <code>data-front</code>,
          <code>data-overflow</code>, and <code>data-region-expanded</code> on each toast.
          The demo below applies a Sonner-style scale cascade when collapsed and
          translates each toast by its measured cumulative offset when expanded.
          <strong>All visuals are consumer CSS</strong> — the primitive only owns the math.
        </p>
        <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
          <button style="${btn}" @click=${() =>
        this.#spawnStacked({
          title: "New message",
          description: "Hover the stack to expand.",
          type: "default",
          duration: 8000,
        })}>
            Spawn toast
          </button>
          <button style="${btn}" @click=${() => {
            for (let i = 0; i < 5; i++) {
              setTimeout(() =>
                this.#spawnStacked({
                  title: `Toast #${i + 1}`,
                  description: "Cumulative height drives the expanded layout.",
                  type: i === 2 ? "success" : "default",
                  duration: 12000,
                }), i * 80);
            }
          }}>
            Spawn 5 quickly
          </button>
          <button style="${btn}" @click=${() => {
            this.#stackedItems = [];
          }}>
            Clear
          </button>
        </div>
        <div class="toast-demo stacked-demo">
          <dui-toast-region
            position="bottom-right"
            max-visible="3"
            @toast-dismiss=${(e: CustomEvent<{ id: string }>) => {
              const num = Number(e.detail.id.replace(/\D/g, ""));
              this.#removeStacked(num);
            }}
          >
            ${this.#stackedItems.map((item) =>
              html`
                <dui-toast
                  toast-id="s-${item.id}"
                  type=${item.type}
                  duration=${item.duration ?? 4000}
                  style="${toastStyle}"
                >
                  <span slot="title">${item.title}</span>
                  ${item.description
                    ? html`<span slot="description">${item.description}</span>`
                    : null}
                </dui-toast>
              `
            )}
          </dui-toast-region>
        </div>
        <p style="font-size: 12px; color: #888; margin-top: 8px;">
          Hover the stack to expand. Older toasts beyond <code>max-visible=3</code>
          fade out via consumer CSS keyed on <code>data-overflow</code>, and reappear
          when the region is expanded.
        </p>
      </prim-demo>

      <prim-demo label="Swipe to dismiss">
        <p style="font-size: 13px; color: #555; margin: 0 0 12px;">
          Phase 4 ships a pointer-based swipe gesture per toast. The region
          decides allowed directions (default: outward from the anchor). Each
          toast exposes <code>data-swipe="start|move|end|cancel"</code> and
          <code>--swipe-amount-x</code> / <code>--swipe-amount-y</code> for the
          consumer to choreograph.
        </p>
        <p style="font-size: 13px; color: #555; margin: 0 0 12px;">
          <strong>Try it:</strong> spawn a toast and drag it. Mouse, touch, and
          pen all work via Pointer Events. <code>Delete</code> or
          <code>Backspace</code> while the toast (or anything inside) has focus
          dismisses with reason <code>"keyboard"</code>. Swipes also suppress
          the synthetic click on inner buttons so action handlers don't
          accidentally fire.
        </p>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button style="${btn}" @click=${() =>
            toast("Drag me", {
              description: "Swipe outward to dismiss.",
              duration: 0,
              closeButton: true,
            })}>
            Spawn (default direction)
          </button>
          <button style="${btn}" @click=${() => {
            const region = toast.getAutoRegion();
            if (region) region.swipeDirections = "left,right";
            toast("Swipe either way", {
              description: "Region overridden to left,right.",
              duration: 0,
              closeButton: true,
            });
          }}>
            Allow left + right
          </button>
          <button style="${btn}" @click=${() => {
            const region = toast.getAutoRegion();
            if (region) region.swipeDirections = "none";
            toast("Swipe disabled", {
              description: "Region's swipe-directions is 'none'.",
              duration: 0,
              closeButton: true,
            });
          }}>
            Disable swipe
          </button>
          <button style="${btn}" @click=${() => {
            const region = toast.getAutoRegion();
            if (region) {
              region.swipeDirections = undefined as unknown as string;
              region.removeAttribute("swipe-directions");
            }
          }}>
            Reset directions
          </button>
        </div>
      </prim-demo>

      <prim-demo label="Region hotkey + arrow navigation">
        <p style="font-size: 13px; color: #555; margin: 0 0 12px;">
          Each <code>&lt;dui-toast-region&gt;</code> registers a global hotkey (default
          <kbd style="font: inherit; background: #f0f0f0; border: 1px solid #ccc; border-radius: 3px; padding: 1px 5px;">Alt</kbd> +
          <kbd style="font: inherit; background: #f0f0f0; border: 1px solid #ccc; border-radius: 3px; padding: 1px 5px;">T</kbd>)
          that jumps focus into the front toast from anywhere on the page.
          From there, arrow keys navigate the stack visually,
          <kbd style="font: inherit; background: #f0f0f0; border: 1px solid #ccc; border-radius: 3px; padding: 1px 5px;">Home</kbd>/<kbd style="font: inherit; background: #f0f0f0; border: 1px solid #ccc; border-radius: 3px; padding: 1px 5px;">End</kbd>
          jump to the ends, and
          <kbd style="font: inherit; background: #f0f0f0; border: 1px solid #ccc; border-radius: 3px; padding: 1px 5px;">Esc</kbd>
          restores the focus that was active before you entered.
        </p>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
          <button style="${btn}" @click=${() => {
            for (let i = 0; i < 3; i++) {
              setTimeout(() =>
                toast(`Toast #${i + 1}`, {
                  description: "Press Alt+T to focus, then ↑/↓ to navigate.",
                  duration: 0,
                  closeButton: true,
                }), i * 80);
            }
          }}>
            Spawn 3 toasts (no auto-dismiss)
          </button>
          <button style="${btn}" @click=${() => toast.dismiss()}>
            Dismiss all
          </button>
        </div>
        <p style="font-size: 12px; color: #888; margin: 0;">
          Once focused on a toast: <code>Delete</code>/<code>Backspace</code>
          dismisses it (focus moves to the next toast or restores prior focus
          if the region empties). <code>Tab</code> moves into the toast's
          interactive content (action / close buttons).
        </p>
      </prim-demo>

      <prim-demo label="Tier 3: headless toast (full content control)">
        <p style="font-size: 13px; color: #555; margin: 0 0 12px;">
          The <code>headless</code> attribute strips the title/description/action/close
          slot wrappers. Only the default slot renders. Behavior
          (live-region role, dismiss timer, swipe gestures, registry membership,
          <code>data-toast-dismiss</code> click delegation) is preserved.
        </p>
        <pre style="font-size: 12px; background: #f5f5f5; padding: 8px; border-radius: 4px; overflow: auto; margin: 0 0 12px;"><code>&lt;dui-toast headless aria-label="Custom notification"&gt;
  &lt;my-fancy-toast&gt;
    ✨ Anything goes here — layout, icons, buttons.
    &lt;button data-toast-dismiss&gt;Dismiss&lt;/button&gt;
  &lt;/my-fancy-toast&gt;
&lt;/dui-toast&gt;</code></pre>
        <button style="${btn}" @click=${() => {
          const node = document.createElement("div");
          node.style.cssText =
            "display:flex;align-items:center;gap:10px;padding:4px 0;";
          node.innerHTML =
            '<span style="font-size:20px;">✨</span>' +
            '<div style="flex:1;"><strong style="font-size:13px;">Headless toast</strong>' +
            '<div style="font-size:12px;color:#666;">Default-slot only — no wrapper divs in the shadow.</div></div>' +
            '<button data-toast-dismiss aria-label="Dismiss" style="font:inherit;border:1px solid #ccc;border-radius:4px;background:white;padding:2px 8px;cursor:pointer;">✕</button>';
          toast.custom(node, { duration: 0 });
          // Mark the most-recently-created toast headless. The auto-region's
          // last child is the new toast.
          const region = toast.getAutoRegion();
          const last = region?.lastElementChild as HTMLElement | null;
          last?.setAttribute("headless", "");
          last?.setAttribute("aria-label", "Headless toast example");
        }}>
          Spawn headless toast
        </button>
      </prim-demo>

      <prim-demo label="Keyboard & a11y summary">
        <ul style="font-size: 13px; color: #444; margin: 0; padding-left: 20px;">
          <li>Each toast renders <code>role="status"</code> (or <code>"alert"</code> for <code>priority="assertive"</code>) with matching <code>aria-live</code>.</li>
          <li><code>aria-labelledby</code> / <code>aria-describedby</code> auto-wire only when the corresponding slot has assigned nodes (and not at all when <code>headless</code>).</li>
          <li>The region is a landmark: <code>role="region"</code> with <code>aria-label</code> (default "Notifications").</li>
          <li>Pause-on-pointer, pause-on-focus, pause-on-tab-hidden — all three contribute to the timer pause.</li>
          <li>Region hotkey (default <code>Alt+T</code>) jumps focus into the front toast; <code>Esc</code> restores prior focus.</li>
          <li>Arrow keys navigate; direction tracks visual layout (inverts for <code>top-*</code> positions).</li>
          <li><code>Delete</code> / <code>Backspace</code> dismisses the focused toast; focus moves to a sibling or restores prior focus when the region empties.</li>
          <li>Swipe-to-dismiss + click suppression on inner buttons; gestures don't accidentally trigger actions.</li>
        </ul>
      </prim-demo>

      <h2 style="margin-top: 56px; padding-top: 28px; border-top: 1px solid #e5e5e5;">Recipes</h2>
      <p class="subtitle" style="margin-bottom: 24px;">
        Realistic, copy-pasteable patterns that use the primitive end-to-end.
        Lift the consumer CSS and adapt it to your design system.
      </p>

      <prim-demo label="Recipe: Themed (Sonner-style)">
        <p style="font-size: 13px; color: #555; margin: 0 0 12px;">
          A polished theme: per-type icons + colors, smooth cascade-and-expand
          stacking, loading spinner, soft layered shadow. The primitive owns
          all behavior — this recipe is purely consumer CSS plus an icon slotted
          into the title.
        </p>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
          <button style="${btn}" @click=${() =>
            this.#spawnThemed({ title: "Profile updated", description: "Display name set to Alex Carter.", type: "success" })}>
            Success
          </button>
          <button style="${btn}" @click=${() =>
            this.#spawnThemed({ title: "Heads up", description: "This action is irreversible.", type: "warning" })}>
            Warning
          </button>
          <button style="${btn}" @click=${() =>
            this.#spawnThemed({ title: "Connection failed", description: "Check your network and try again.", type: "error" })}>
            Error
          </button>
          <button style="${btn}" @click=${() =>
            this.#spawnThemed({ title: "New release available", description: "v2.4.0 is ready to install.", type: "info" })}>
            Info
          </button>
          <button style="${btn}" @click=${() =>
            this.#spawnThemed({ title: "Uploading…", type: "loading", duration: 0 })}>
            Loading
          </button>
          <button style="${btn}" @click=${() => {
            for (let i = 0; i < 5; i++) {
              setTimeout(() => this.#spawnThemed({
                title: ["Saved", "Synced", "Backed up", "Pushed", "Deployed"][i],
                description: `Step ${i + 1} of 5 completed.`,
                type: "success",
                duration: 12000,
              }), i * 80);
            }
          }}>
            Spawn 5 (hover to expand)
          </button>
        </div>
        <div class="recipe-sonner">
          <dui-toast-region
            position="bottom-right"
            max-visible="3"
            hotkey="none"
            @toast-dismiss=${(e: CustomEvent<{ id: string }>) => {
              const num = Number(e.detail.id.replace(/\D/g, ""));
              this.#removeThemed(num);
            }}
          >
            ${this.#themedItems.map((item) =>
              html`
                <dui-toast
                  toast-id="th-${item.id}"
                  type=${item.type}
                  duration=${item.duration ?? 4000}
                >
                  <span slot="title">
                    <span class="t-title-row">
                      <span class="t-icon">${themedIcon(item.type)}</span>
                      <span>${item.title}</span>
                    </span>
                  </span>
                  ${item.description
                    ? html`<span slot="description">${item.description}</span>`
                    : null}
                </dui-toast>
              `
            )}
          </dui-toast-region>
        </div>
      </prim-demo>

      <prim-demo label="Recipe: Inline sectional notifications">
        <p style="font-size: 13px; color: #555; margin: 0 0 12px;">
          A region scoped <em>inside</em> a panel — useful when a notification
          should be tied to a section rather than the global viewport. Override
          the primitive's <code>position: fixed</code> with
          <code>position: absolute !important</code> and give the region its own
          <code>aria-label</code>. Disable the global hotkey on sectional regions.
        </p>
        <div class="recipe-sectional">
          <h3>Account settings</h3>
          <div class="field">
            <label for="recipe-sec-name">Display name</label>
            <input
              id="recipe-sec-name"
              type="text"
              .value=${this.#profileName}
              @input=${(e: Event) => { this.#profileName = (e.target as HTMLInputElement).value; }}
            />
            <button class="save-btn" @click=${() =>
              this.#spawnSectional({ title: "Display name updated", description: this.#profileName, type: "success" })}>
              Save
            </button>
          </div>
          <div class="field">
            <label for="recipe-sec-email">Email</label>
            <input
              id="recipe-sec-email"
              type="email"
              .value=${this.#profileEmail}
              @input=${(e: Event) => { this.#profileEmail = (e.target as HTMLInputElement).value; }}
            />
            <button class="save-btn" @click=${() =>
              this.#spawnSectional({ title: "Email updated", description: this.#profileEmail, type: "success" })}>
              Save
            </button>
          </div>
          <dui-toast-region
            position="bottom-right"
            label="Settings notifications"
            max-visible="2"
            hotkey="none"
            @toast-dismiss=${(e: CustomEvent<{ id: string }>) => {
              const num = Number(e.detail.id.replace(/\D/g, ""));
              this.#removeSectional(num);
            }}
          >
            ${this.#sectionalItems.map((item) =>
              html`
                <dui-toast
                  toast-id="sec-${item.id}"
                  type=${item.type}
                  duration="3000"
                >
                  <span slot="title">${item.title}</span>
                  ${item.description
                    ? html`<span slot="description">${item.description}</span>`
                    : null}
                </dui-toast>
              `
            )}
          </dui-toast-region>
        </div>
      </prim-demo>

      <prim-demo label="Recipe: Promise / loading flow with retry">
        <p style="font-size: 13px; color: #555; margin: 0 0 12px;">
          A real save flow: in-flight loading toast, success → quick
          auto-dismiss, error → sticky with a Retry action. Re-using the same
          <code>id</code> keeps the entire flow inside one toast slot — no
          flicker, no stacking duplicates. The retry action calls back into the
          same handler, so the flow loops cleanly.
        </p>
        <pre style="font-size: 12px; background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto; margin: 0 0 12px;"><code>const id = "save-profile";  // stable id, transitions in place
toast.loading("Saving profile…", { id });

saveAsync(name).then(
  (saved) =&gt; toast.success("Profile saved", { id, description: saved }),
  (err)   =&gt; toast.error("Failed to save", {
    id, duration: 0, priority: "assertive",
    description: err.message,
    action: { label: "Retry", onClick: retry },
    closeButton: true,
  }),
);</code></pre>
        <div class="recipe-form">
          <div class="field">
            <label for="recipe-promise-name">Display name</label>
            <input
              id="recipe-promise-name"
              type="text"
              .value=${this.#profileDraft}
              @input=${(e: Event) => { this.#profileDraft = (e.target as HTMLInputElement).value; }}
            />
          </div>
          <button
            type="button"
            style="font: inherit; font-size: 13px; padding: 8px 16px; border: 1px solid #2563eb; background: #2563eb; color: white; border-radius: 5px; cursor: pointer; margin-top: 4px;"
            ?disabled=${this.#profileSaving}
            @click=${() => this.#saveProfile()}
          >
            ${this.#profileSaving ? "Saving…" : "Save profile"}
          </button>
          <p style="font-size: 12px; color: #888; margin: 8px 0 0;">
            ~60% chance of success. Toasts appear in the global region (bottom-right).
          </p>
        </div>
      </prim-demo>

      <prim-demo label="Recipe: Form-validation error toasts">
        <p style="font-size: 13px; color: #555; margin: 0 0 12px;">
          Submitting an invalid form spawns one assertive error toast per
          problem. Each toast carries an <code>id</code> tied to the offending
          field; the <strong>Fix</strong> action focuses the field, and editing
          a field automatically dismisses its associated toast. Errors use
          <code>priority="assertive"</code> so screen readers interrupt to
          announce them.
        </p>
        <form class="recipe-form" @submit=${(e: Event) => this.#submitValidationForm(e)} novalidate>
          <div class="field">
            <label for="recipe-form-name">Name</label>
            <input
              id="recipe-form-name"
              type="text"
              .value=${this.#formName}
              @input=${(e: Event) => this.#onFormFieldInput("name", (e.target as HTMLInputElement).value)}
              autocomplete="off"
            />
          </div>
          <div class="field">
            <label for="recipe-form-email">Email</label>
            <input
              id="recipe-form-email"
              type="email"
              .value=${this.#formEmail}
              @input=${(e: Event) => this.#onFormFieldInput("email", (e.target as HTMLInputElement).value)}
              autocomplete="off"
            />
          </div>
          <button type="submit">Submit</button>
          <p style="font-size: 12px; color: #888; margin: 8px 0 0;">
            Try submitting with empty fields, or with a malformed email.
          </p>
        </form>
      </prim-demo>
    `;
  }
}
