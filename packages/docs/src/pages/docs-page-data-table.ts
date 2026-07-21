import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import type { ColumnDef } from "@dui/primitives/data-table";

// ── Demo data ───────────────────────────────────────────────────────────

type Priority = "low" | "medium" | "high";

type Invoice = {
  id: string;
  status: "paid" | "pending" | "failed";
  email: string;
  amount: number;
  priority: Priority;
};

const INVOICES: Invoice[] = [
  { id: "INV-1001", status: "paid", email: "ken99@example.com", amount: 316, priority: "low" },
  { id: "INV-1002", status: "pending", email: "abe45@example.com", amount: 242, priority: "high" },
  { id: "INV-1003", status: "paid", email: "monserrat44@example.com", amount: 837, priority: "medium" },
  { id: "INV-1004", status: "failed", email: "carmella@example.com", amount: 721, priority: "high" },
  { id: "INV-1005", status: "paid", email: "silas22@example.com", amount: 149, priority: "low" },
  { id: "INV-1006", status: "pending", email: "jhon@example.com", amount: 594, priority: "medium" },
  { id: "INV-1007", status: "paid", email: "raquel@example.com", amount: 88, priority: "low" },
  { id: "INV-1008", status: "failed", email: "derek@example.com", amount: 1203, priority: "high" },
  { id: "INV-1009", status: "paid", email: "maria@example.com", amount: 455, priority: "medium" },
  { id: "INV-1010", status: "pending", email: "victor@example.com", amount: 67, priority: "low" },
  { id: "INV-1011", status: "paid", email: "noah@example.com", amount: 980, priority: "high" },
  { id: "INV-1012", status: "failed", email: "olivia@example.com", amount: 340, priority: "medium" },
  { id: "INV-1013", status: "paid", email: "liam@example.com", amount: 512, priority: "low" },
  { id: "INV-1014", status: "pending", email: "emma@example.com", amount: 275, priority: "high" },
  { id: "INV-1015", status: "paid", email: "ava@example.com", amount: 129, priority: "medium" },
];

const PRIORITY_RANK: Record<Priority, number> = { low: 0, medium: 1, high: 2 };
const PRIORITY_COLOR: Record<Priority, string> = {
  low: "#6b7280",
  medium: "#b45309",
  high: "#b91c1c",
};
const STATUS_COLOR: Record<Invoice["status"], string> = {
  paid: "#15803d",
  pending: "#b45309",
  failed: "#b91c1c",
};

const money = (v: unknown) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
    .format(Number(v));

const badge = (label: string, color: string) => html`
  <span
    style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:12px;
           font-weight:600;color:${color};background:${color}1a;text-transform:capitalize;"
  >${label}</span>
`;

// Shared column set. `amount` renders as currency; `priority` renders a label
// but sorts by severity via accessorFn (alphabetical order would be wrong).
const COLUMNS: ColumnDef<Invoice>[] = [
  { key: "id", header: "Invoice", sortable: true, width: "110px" },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (v) => badge(String(v), STATUS_COLOR[v as Invoice["status"]]),
  },
  { key: "email", header: "Email", sortable: true },
  {
    key: "priority",
    header: "Priority",
    sortable: true,
    accessorFn: (row) => PRIORITY_RANK[row.priority],
    render: (_v, row) => badge(row.priority, PRIORITY_COLOR[row.priority]),
  },
  {
    key: "amount",
    header: "Amount",
    sortable: true,
    width: "120px",
    render: (v) => money(v),
  },
];

// ── Page ────────────────────────────────────────────────────────────────

@customElement("docs-page-data-table")
export class DocsPageDataTable extends LitElement {
  protected override createRenderRoot() {
    return this;
  }

  @state() accessor #query = "";
  @state() accessor #selectedKeys: string[] = [];
  @state() accessor #picked: Invoice | undefined = undefined;

  // Stable identities — recreating these each render would reset paging/state.
  #rowKey = (row: Invoice) => row.id;
  #filterFn = (row: Invoice, filterValue: unknown) => {
    const q = String(filterValue ?? "").trim().toLowerCase();
    if (!q) return true;
    return (
      row.email.toLowerCase().includes(q) ||
      row.status.toLowerCase().includes(q) ||
      row.id.toLowerCase().includes(q)
    );
  };

  override render() {
    const selectedCount = this.#selectedKeys.length;

    return html`
      ${STYLES}
      <h1>Data Table</h1>
      <p class="subtitle">
        A sortable, filterable, paginated table with optional row selection.
        Pipeline is <code>data → filter → sort → paginate</code>; values are
        resolved through an optional per-column <code>accessorFn</code>.
      </p>

      <prim-demo label="Sorting, custom cells & pagination">
        <p class="demo-note">
          Click a header to cycle sort (asc → desc → off). <strong>Amount</strong>
          formats via <code>render</code>; <strong>Priority</strong> displays a
          label but sorts by severity via <code>accessorFn</code>. Page size is 5.
        </p>
        <dui-data-table
          .columns=${COLUMNS}
          .data=${INVOICES}
          .rowKey=${this.#rowKey}
          page-size="5"
        ></dui-data-table>
      </prim-demo>

      <prim-demo label="Global filtering">
        <p class="demo-note">
          One opaque <code>filterValue</code> + a <code>globalFilterFn</code>
          predicate covers search across email, status, and invoice id.
          Pagination totals track the filtered set.
        </p>
        <input
          class="filter-input"
          type="text"
          placeholder="Filter invoices…"
          .value=${this.#query}
          @input=${(e: Event) => {
            this.#query = (e.target as HTMLInputElement).value;
          }}
        />
        <dui-data-table
          .columns=${COLUMNS}
          .data=${INVOICES}
          .rowKey=${this.#rowKey}
          .filterValue=${this.#query}
          .globalFilterFn=${this.#filterFn}
          page-size="6"
        ></dui-data-table>
      </prim-demo>

      <prim-demo label="Row selection (multiple)">
        <p class="demo-note">
          Controlled selection keyed by <code>rowKey</code>. The header checkbox
          selects all across the filtered set (indeterminate when partial), and
          selection persists across sort and page changes.
        </p>
        <div class="toolbar">
          <span>${selectedCount} of ${INVOICES.length} selected</span>
          <button
            class="btn"
            ?disabled=${selectedCount === 0}
            @click=${() => (this.#selectedKeys = [])}
          >Clear</button>
        </div>
        <dui-data-table
          .columns=${COLUMNS}
          .data=${INVOICES}
          .rowKey=${this.#rowKey}
          selection-mode="multiple"
          .selectedKeys=${this.#selectedKeys}
          page-size="5"
          @selection-change=${(e: CustomEvent<{ selectedKeys: string[] }>) => {
            this.#selectedKeys = e.detail.selectedKeys;
          }}
        ></dui-data-table>
      </prim-demo>

      <prim-demo label="Single selection & row-click">
        <p class="demo-note">
          <code>selection-mode="single"</code> replaces the selection; the
          separate <code>row-click</code> event fires on row body clicks (never
          on the checkbox) — handy for opening a detail view.
        </p>
        <dui-data-table
          .columns=${COLUMNS}
          .data=${INVOICES.slice(0, 5)}
          .rowKey=${this.#rowKey}
          selection-mode="single"
          .selectedKeys=${this.#picked ? [this.#picked.id] : []}
          page-size="0"
          @selection-change=${(e: CustomEvent<{ selectedRows: Invoice[] }>) => {
            this.#picked = e.detail.selectedRows[0];
          }}
          @row-click=${(e: CustomEvent<{ row: Invoice }>) => {
            this.#picked = e.detail.row;
          }}
        ></dui-data-table>
        <p class="status">
          ${this.#picked
            ? html`Selected <strong>${this.#picked.id}</strong> — ${this.#picked.email}`
            : "Click a row or its checkbox."}
        </p>
      </prim-demo>
    `;
  }
}

// ── Demo styling ────────────────────────────────────────────────────────
// The primitive ships unstyled; this styles it entirely through its exposed
// ::part()s and the --data-table-selected-background custom property.

const STYLES = html`
  <style>
    docs-page-data-table .demo-note {
      font-size: 13px;
      color: #666;
      margin: 0 0 12px;
      line-height: 1.5;
    }
    docs-page-data-table code {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.9em;
      background: #eef0f2;
      padding: 1px 5px;
      border-radius: 4px;
    }

    /* Table shell */
    docs-page-data-table dui-data-table {
      --data-table-selected-background: #eaf1ff;
      display: block;
      font-size: 14px;
      color: #1a1a2e;
    }
    docs-page-data-table dui-data-table::part(table-window) {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }
    docs-page-data-table dui-data-table::part(table) {
      width: 100%;
    }

    /* Header */
    docs-page-data-table dui-data-table::part(header-cell) {
      padding: 9px 12px;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }
    docs-page-data-table dui-data-table::part(header-cell):hover {
      color: #111827;
    }
    docs-page-data-table dui-data-table::part(sort-icon) {
      width: 14px;
      height: 14px;
      margin-left: 4px;
      opacity: 0.45;
    }

    /* Body */
    docs-page-data-table dui-data-table::part(cell) {
      padding: 9px 12px;
      border-bottom: 1px solid #f1f2f4;
    }
    docs-page-data-table dui-data-table::part(row):hover {
      background: #f9fafb;
    }
    docs-page-data-table dui-data-table::part(row selected):hover {
      background: #e0ebff;
    }

    /* Pagination */
    docs-page-data-table dui-data-table::part(pagination) {
      padding: 10px 4px 0;
      font-size: 13px;
      color: #6b7280;
    }

    /* Selection checkbox — parts forwarded from the nested dui-checkbox. */
    docs-page-data-table dui-data-table::part(checkbox) {
      box-sizing: border-box;
      width: 16px;
      height: 16px;
      border: 1.5px solid #cbd5e1;
      border-radius: 4px;
      color: #2563eb;
    }
    docs-page-data-table dui-data-table::part(checkbox-indicator) {
      width: 13px;
      height: 13px;
    }

    /* Demo controls */
    docs-page-data-table .filter-input {
      display: block;
      width: 100%;
      max-width: 280px;
      box-sizing: border-box;
      margin-bottom: 12px;
      padding: 7px 10px;
      font-size: 14px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: #fff;
      color: inherit;
    }
    docs-page-data-table .toolbar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      font-size: 13px;
      color: #6b7280;
    }
    docs-page-data-table .btn {
      padding: 5px 12px;
      font-size: 13px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: #fff;
      color: #374151;
      cursor: pointer;
    }
    docs-page-data-table .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    docs-page-data-table .status {
      margin: 12px 0 0;
      font-size: 13px;
      color: #6b7280;
    }

    @media (prefers-color-scheme: dark) {
      docs-page-data-table .demo-note,
      docs-page-data-table .toolbar,
      docs-page-data-table .status { color: #9ca3af; }
      docs-page-data-table code { background: #22222e; }
      docs-page-data-table dui-data-table {
        --data-table-selected-background: #1e2a44;
        color: #e5e7eb;
      }
      docs-page-data-table dui-data-table::part(table-window) { border-color: #2a2a35; }
      docs-page-data-table dui-data-table::part(header-cell) {
        background: #16161e;
        color: #9ca3af;
        border-bottom-color: #2a2a35;
      }
      docs-page-data-table dui-data-table::part(header-cell):hover { color: #f3f4f6; }
      docs-page-data-table dui-data-table::part(cell) { border-bottom-color: #22222e; }
      docs-page-data-table dui-data-table::part(row):hover { background: #16161e; }
      docs-page-data-table dui-data-table::part(row selected):hover { background: #243b5e; }
      docs-page-data-table dui-data-table::part(checkbox) { border-color: #3f3f52; }
      docs-page-data-table .filter-input,
      docs-page-data-table .btn {
        background: #16161e;
        border-color: #2a2a35;
        color: #e5e7eb;
      }
    }
  </style>
`;
