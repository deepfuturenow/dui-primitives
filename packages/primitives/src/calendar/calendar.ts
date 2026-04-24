import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";

export const valueChangeEvent = customEvent<{ value: string }>(
  "value-change",
  { bubbles: true, composed: true },
);

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: inline-block;
  }

  [part="root"] {
    display: flex;
    flex-direction: column;
  }

  [part="header"] {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  [part="heading"] {
    font-weight: 600;
    text-align: center;
    flex: 1;
  }

  [part="prev"],
  [part="next"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    font: inherit;
    color: inherit;
  }

  [part="grid"] {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  [part="weekday"] {
    text-align: center;
    font-weight: 600;
  }

  [part="day"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    font: inherit;
    color: inherit;
  }

  [part="day"]:disabled {
    cursor: not-allowed;
  }
`;

type DayCell = {
  date: Date;
  day: number;
  iso: string;
  isToday: boolean;
  isSelected: boolean;
  isOutsideMonth: boolean;
  isDisabled: boolean;
};

/**
 * `<dui-calendar>` — A date picker calendar grid.
 *
 * @csspart root - The outer container.
 * @csspart header - Month navigation header.
 * @csspart heading - The month/year heading text.
 * @csspart prev - Previous month button.
 * @csspart next - Next month button.
 * @csspart grid - The day grid container.
 * @csspart weekday - Weekday column header.
 * @csspart day - Individual day button.
 * @fires value-change - Fired when a date is selected. Detail: { value: string }
 */
export class DuiCalendarPrimitive extends LitElement {
  static tagName = "dui-calendar" as const;

  static override styles = [base, styles];

  @property()
  accessor value: string | undefined = undefined;

  @property({ attribute: "default-value" })
  accessor defaultValue: string | undefined = undefined;

  @property()
  accessor min: string | undefined = undefined;

  @property()
  accessor max: string | undefined = undefined;

  @property()
  accessor locale = "en-US";

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @property({ type: Boolean, reflect: true, attribute: "read-only" })
  accessor readOnly = false;

  @state()
  accessor #internalValue: string | undefined = undefined;

  @state()
  accessor #focusedDate: Date = new Date();

  @state()
  accessor #viewMonth: number = new Date().getMonth();

  @state()
  accessor #viewYear: number = new Date().getFullYear();

  get #selectedValue(): string | undefined {
    return this.value ?? this.#internalValue;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.value === undefined && this.defaultValue !== undefined) {
      this.#internalValue = this.defaultValue;
    }

    const selected = this.#selectedValue;
    if (selected) {
      const d = new Date(selected + "T00:00:00");
      this.#viewMonth = d.getMonth();
      this.#viewYear = d.getFullYear();
      this.#focusedDate = d;
    }
  }

  #formatISO(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  #isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  #isDateDisabled(date: Date): boolean {
    if (this.disabled) return true;
    const iso = this.#formatISO(date);
    if (this.min && iso < this.min) return true;
    if (this.max && iso > this.max) return true;
    return false;
  }

  #getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  #getFirstDayOfWeek(): number {
    // Use Intl to determine first day of week for locale
    // Fallback to Sunday (0) for most locales
    try {
      const locale = new Intl.Locale(this.locale);
      // @ts-ignore — weekInfo is a newer API
      const weekInfo = locale.weekInfo ?? locale.getWeekInfo?.();
      return weekInfo?.firstDay === 7 ? 0 : (weekInfo?.firstDay ?? 0);
    } catch {
      return 0;
    }
  }

  #buildGrid(): DayCell[][] {
    const year = this.#viewYear;
    const month = this.#viewMonth;
    const daysInMonth = this.#getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const firstDayOfWeek = this.#getFirstDayOfWeek();

    const today = new Date();
    const selectedIso = this.#selectedValue;

    let startOffset = firstDay - firstDayOfWeek;
    if (startOffset < 0) startOffset += 7;

    const cells: DayCell[] = [];

    // Days from previous month
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = this.#getDaysInMonth(prevYear, prevMonth);
    for (let i = startOffset - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(prevYear, prevMonth, day);
      cells.push({
        date,
        day,
        iso: this.#formatISO(date),
        isToday: this.#isSameDay(date, today),
        isSelected: this.#formatISO(date) === selectedIso,
        isOutsideMonth: true,
        isDisabled: this.#isDateDisabled(date),
      });
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      cells.push({
        date,
        day,
        iso: this.#formatISO(date),
        isToday: this.#isSameDay(date, today),
        isSelected: this.#formatISO(date) === selectedIso,
        isOutsideMonth: false,
        isDisabled: this.#isDateDisabled(date),
      });
    }

    // Fill remaining cells to make 6 rows
    const remaining = 42 - cells.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    for (let day = 1; day <= remaining; day++) {
      const date = new Date(nextYear, nextMonth, day);
      cells.push({
        date,
        day,
        iso: this.#formatISO(date),
        isToday: this.#isSameDay(date, today),
        isSelected: this.#formatISO(date) === selectedIso,
        isOutsideMonth: true,
        isDisabled: this.#isDateDisabled(date),
      });
    }

    // Split into rows of 7
    const rows: DayCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }
    return rows;
  }

  #getWeekdayNames(): string[] {
    const formatter = new Intl.DateTimeFormat(this.locale, { weekday: "short" });
    const firstDayOfWeek = this.#getFirstDayOfWeek();
    const names: string[] = [];
    for (let i = 0; i < 7; i++) {
      // Jan 4 2015 is a Sunday
      const date = new Date(2015, 0, 4 + firstDayOfWeek + i);
      names.push(formatter.format(date));
    }
    return names;
  }

  #getMonthYearHeading(): string {
    const date = new Date(this.#viewYear, this.#viewMonth, 1);
    return new Intl.DateTimeFormat(this.locale, {
      month: "long",
      year: "numeric",
    }).format(date);
  }

  #selectDate(iso: string): void {
    if (this.disabled || this.readOnly) return;

    if (this.value === undefined) {
      this.#internalValue = iso;
    }

    this.dispatchEvent(valueChangeEvent({ value: iso }));
  }

  #navigateMonth(delta: number): void {
    let newMonth = this.#viewMonth + delta;
    let newYear = this.#viewYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    this.#viewMonth = newMonth;
    this.#viewYear = newYear;
    this.#focusedDate = new Date(newYear, newMonth, 1);
  }

  #onDayClick = (e: Event): void => {
    const button = e.currentTarget as HTMLButtonElement;
    const iso = button.dataset.date;
    if (iso && !button.disabled) {
      this.#selectDate(iso);
    }
  };

  #onKeyDown = (e: KeyboardEvent): void => {
    const focused = new Date(this.#focusedDate);
    let handled = true;

    switch (e.key) {
      case "ArrowLeft":
        focused.setDate(focused.getDate() - 1);
        break;
      case "ArrowRight":
        focused.setDate(focused.getDate() + 1);
        break;
      case "ArrowUp":
        focused.setDate(focused.getDate() - 7);
        break;
      case "ArrowDown":
        focused.setDate(focused.getDate() + 7);
        break;
      case "PageUp":
        if (e.shiftKey) {
          focused.setFullYear(focused.getFullYear() - 1);
        } else {
          focused.setMonth(focused.getMonth() - 1);
        }
        break;
      case "PageDown":
        if (e.shiftKey) {
          focused.setFullYear(focused.getFullYear() + 1);
        } else {
          focused.setMonth(focused.getMonth() + 1);
        }
        break;
      case "Home": {
        focused.setDate(1);
        break;
      }
      case "End": {
        const daysInMonth = this.#getDaysInMonth(
          focused.getFullYear(),
          focused.getMonth(),
        );
        focused.setDate(daysInMonth);
        break;
      }
      case "Enter":
      case " ":
        e.preventDefault();
        if (!this.#isDateDisabled(focused)) {
          this.#selectDate(this.#formatISO(focused));
        }
        return;
      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault();
      this.#focusedDate = focused;
      this.#viewMonth = focused.getMonth();
      this.#viewYear = focused.getFullYear();

      // Focus the correct day button after render
      this.updateComplete.then(() => {
        const iso = this.#formatISO(focused);
        const btn = this.shadowRoot?.querySelector(
          `[data-date="${iso}"]`,
        ) as HTMLElement;
        btn?.focus();
      });
    }
  };

  #onPrevClick = (): void => {
    this.#navigateMonth(-1);
  };

  #onNextClick = (): void => {
    this.#navigateMonth(1);
  };

  override render(): TemplateResult {
    const grid = this.#buildGrid();
    const weekdays = this.#getWeekdayNames();
    const heading = this.#getMonthYearHeading();
    const focusedIso = this.#formatISO(this.#focusedDate);

    return html`
      <div part="root" role="grid" @keydown="${this.#onKeyDown}">
        <div part="header">
          <button
            part="prev"
            type="button"
            aria-label="Previous month"
            @click="${this.#onPrevClick}"
          >
            <slot name="prev">&lsaquo;</slot>
          </button>
          <div part="heading" aria-live="polite">${heading}</div>
          <button
            part="next"
            type="button"
            aria-label="Next month"
            @click="${this.#onNextClick}"
          >
            <slot name="next">&rsaquo;</slot>
          </button>
        </div>

        <div part="grid" role="grid">
          ${weekdays.map(
            (name) =>
              html`<div part="weekday" role="columnheader">${name}</div>`,
          )}
          ${grid.flat().map((cell) => html`
            <button
              part="day"
              type="button"
              role="gridcell"
              data-date="${cell.iso}"
              tabindex="${cell.iso === focusedIso ? 0 : -1}"
              ?data-selected="${cell.isSelected}"
              ?data-today="${cell.isToday}"
              ?data-outside-month="${cell.isOutsideMonth}"
              ?disabled="${cell.isDisabled}"
              aria-selected="${cell.isSelected ? "true" : "false"}"
              @click="${this.#onDayClick}"
            >${cell.day}</button>
          `)}
        </div>
      </div>
    `;
  }
}
