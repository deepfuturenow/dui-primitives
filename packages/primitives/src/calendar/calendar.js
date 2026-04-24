var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
export const valueChangeEvent = customEvent("value-change", { bubbles: true, composed: true });
/** Structural styles only — layout CSS. */
const styles = css `
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
let DuiCalendarPrimitive = (() => {
    let _classSuper = LitElement;
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _defaultValue_decorators;
    let _defaultValue_initializers = [];
    let _defaultValue_extraInitializers = [];
    let _min_decorators;
    let _min_initializers = [];
    let _min_extraInitializers = [];
    let _max_decorators;
    let _max_initializers = [];
    let _max_extraInitializers = [];
    let _locale_decorators;
    let _locale_initializers = [];
    let _locale_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _readOnly_decorators;
    let _readOnly_initializers = [];
    let _readOnly_extraInitializers = [];
    let _private_internalValue_decorators;
    let _private_internalValue_initializers = [];
    let _private_internalValue_extraInitializers = [];
    let _private_internalValue_descriptor;
    let _private_focusedDate_decorators;
    let _private_focusedDate_initializers = [];
    let _private_focusedDate_extraInitializers = [];
    let _private_focusedDate_descriptor;
    let _private_viewMonth_decorators;
    let _private_viewMonth_initializers = [];
    let _private_viewMonth_extraInitializers = [];
    let _private_viewMonth_descriptor;
    let _private_viewYear_decorators;
    let _private_viewYear_initializers = [];
    let _private_viewYear_extraInitializers = [];
    let _private_viewYear_descriptor;
    return class DuiCalendarPrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _value_decorators = [property()];
            _defaultValue_decorators = [property({ attribute: "default-value" })];
            _min_decorators = [property()];
            _max_decorators = [property()];
            _locale_decorators = [property()];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _readOnly_decorators = [property({ type: Boolean, reflect: true, attribute: "read-only" })];
            _private_internalValue_decorators = [state()];
            _private_focusedDate_decorators = [state()];
            _private_viewMonth_decorators = [state()];
            _private_viewYear_decorators = [state()];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(this, null, _defaultValue_decorators, { kind: "accessor", name: "defaultValue", static: false, private: false, access: { has: obj => "defaultValue" in obj, get: obj => obj.defaultValue, set: (obj, value) => { obj.defaultValue = value; } }, metadata: _metadata }, _defaultValue_initializers, _defaultValue_extraInitializers);
            __esDecorate(this, null, _min_decorators, { kind: "accessor", name: "min", static: false, private: false, access: { has: obj => "min" in obj, get: obj => obj.min, set: (obj, value) => { obj.min = value; } }, metadata: _metadata }, _min_initializers, _min_extraInitializers);
            __esDecorate(this, null, _max_decorators, { kind: "accessor", name: "max", static: false, private: false, access: { has: obj => "max" in obj, get: obj => obj.max, set: (obj, value) => { obj.max = value; } }, metadata: _metadata }, _max_initializers, _max_extraInitializers);
            __esDecorate(this, null, _locale_decorators, { kind: "accessor", name: "locale", static: false, private: false, access: { has: obj => "locale" in obj, get: obj => obj.locale, set: (obj, value) => { obj.locale = value; } }, metadata: _metadata }, _locale_initializers, _locale_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _readOnly_decorators, { kind: "accessor", name: "readOnly", static: false, private: false, access: { has: obj => "readOnly" in obj, get: obj => obj.readOnly, set: (obj, value) => { obj.readOnly = value; } }, metadata: _metadata }, _readOnly_initializers, _readOnly_extraInitializers);
            __esDecorate(this, _private_internalValue_descriptor = { get: __setFunctionName(function () { return this.#internalValue_accessor_storage; }, "#internalValue", "get"), set: __setFunctionName(function (value) { this.#internalValue_accessor_storage = value; }, "#internalValue", "set") }, _private_internalValue_decorators, { kind: "accessor", name: "#internalValue", static: false, private: true, access: { has: obj => #internalValue in obj, get: obj => obj.#internalValue, set: (obj, value) => { obj.#internalValue = value; } }, metadata: _metadata }, _private_internalValue_initializers, _private_internalValue_extraInitializers);
            __esDecorate(this, _private_focusedDate_descriptor = { get: __setFunctionName(function () { return this.#focusedDate_accessor_storage; }, "#focusedDate", "get"), set: __setFunctionName(function (value) { this.#focusedDate_accessor_storage = value; }, "#focusedDate", "set") }, _private_focusedDate_decorators, { kind: "accessor", name: "#focusedDate", static: false, private: true, access: { has: obj => #focusedDate in obj, get: obj => obj.#focusedDate, set: (obj, value) => { obj.#focusedDate = value; } }, metadata: _metadata }, _private_focusedDate_initializers, _private_focusedDate_extraInitializers);
            __esDecorate(this, _private_viewMonth_descriptor = { get: __setFunctionName(function () { return this.#viewMonth_accessor_storage; }, "#viewMonth", "get"), set: __setFunctionName(function (value) { this.#viewMonth_accessor_storage = value; }, "#viewMonth", "set") }, _private_viewMonth_decorators, { kind: "accessor", name: "#viewMonth", static: false, private: true, access: { has: obj => #viewMonth in obj, get: obj => obj.#viewMonth, set: (obj, value) => { obj.#viewMonth = value; } }, metadata: _metadata }, _private_viewMonth_initializers, _private_viewMonth_extraInitializers);
            __esDecorate(this, _private_viewYear_descriptor = { get: __setFunctionName(function () { return this.#viewYear_accessor_storage; }, "#viewYear", "get"), set: __setFunctionName(function (value) { this.#viewYear_accessor_storage = value; }, "#viewYear", "set") }, _private_viewYear_decorators, { kind: "accessor", name: "#viewYear", static: false, private: true, access: { has: obj => #viewYear in obj, get: obj => obj.#viewYear, set: (obj, value) => { obj.#viewYear = value; } }, metadata: _metadata }, _private_viewYear_initializers, _private_viewYear_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-calendar";
        static styles = [base, styles];
        #value_accessor_storage = __runInitializers(this, _value_initializers, undefined);
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #defaultValue_accessor_storage = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _defaultValue_initializers, undefined));
        get defaultValue() { return this.#defaultValue_accessor_storage; }
        set defaultValue(value) { this.#defaultValue_accessor_storage = value; }
        #min_accessor_storage = (__runInitializers(this, _defaultValue_extraInitializers), __runInitializers(this, _min_initializers, undefined));
        get min() { return this.#min_accessor_storage; }
        set min(value) { this.#min_accessor_storage = value; }
        #max_accessor_storage = (__runInitializers(this, _min_extraInitializers), __runInitializers(this, _max_initializers, undefined));
        get max() { return this.#max_accessor_storage; }
        set max(value) { this.#max_accessor_storage = value; }
        #locale_accessor_storage = (__runInitializers(this, _max_extraInitializers), __runInitializers(this, _locale_initializers, "en-US"));
        get locale() { return this.#locale_accessor_storage; }
        set locale(value) { this.#locale_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _locale_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #readOnly_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _readOnly_initializers, false));
        get readOnly() { return this.#readOnly_accessor_storage; }
        set readOnly(value) { this.#readOnly_accessor_storage = value; }
        #internalValue_accessor_storage = (__runInitializers(this, _readOnly_extraInitializers), __runInitializers(this, _private_internalValue_initializers, undefined));
        get #internalValue() { return _private_internalValue_descriptor.get.call(this); }
        set #internalValue(value) { return _private_internalValue_descriptor.set.call(this, value); }
        #focusedDate_accessor_storage = (__runInitializers(this, _private_internalValue_extraInitializers), __runInitializers(this, _private_focusedDate_initializers, new Date()));
        get #focusedDate() { return _private_focusedDate_descriptor.get.call(this); }
        set #focusedDate(value) { return _private_focusedDate_descriptor.set.call(this, value); }
        #viewMonth_accessor_storage = (__runInitializers(this, _private_focusedDate_extraInitializers), __runInitializers(this, _private_viewMonth_initializers, new Date().getMonth()));
        get #viewMonth() { return _private_viewMonth_descriptor.get.call(this); }
        set #viewMonth(value) { return _private_viewMonth_descriptor.set.call(this, value); }
        #viewYear_accessor_storage = (__runInitializers(this, _private_viewMonth_extraInitializers), __runInitializers(this, _private_viewYear_initializers, new Date().getFullYear()));
        get #viewYear() { return _private_viewYear_descriptor.get.call(this); }
        set #viewYear(value) { return _private_viewYear_descriptor.set.call(this, value); }
        get #selectedValue() {
            return this.value ?? this.#internalValue;
        }
        connectedCallback() {
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
        #formatISO(date) {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const d = String(date.getDate()).padStart(2, "0");
            return `${y}-${m}-${d}`;
        }
        #isSameDay(a, b) {
            return (a.getFullYear() === b.getFullYear() &&
                a.getMonth() === b.getMonth() &&
                a.getDate() === b.getDate());
        }
        #isDateDisabled(date) {
            if (this.disabled)
                return true;
            const iso = this.#formatISO(date);
            if (this.min && iso < this.min)
                return true;
            if (this.max && iso > this.max)
                return true;
            return false;
        }
        #getDaysInMonth(year, month) {
            return new Date(year, month + 1, 0).getDate();
        }
        #getFirstDayOfWeek() {
            // Use Intl to determine first day of week for locale
            // Fallback to Sunday (0) for most locales
            try {
                const locale = new Intl.Locale(this.locale);
                // @ts-ignore — weekInfo is a newer API
                const weekInfo = locale.weekInfo ?? locale.getWeekInfo?.();
                return weekInfo?.firstDay === 7 ? 0 : (weekInfo?.firstDay ?? 0);
            }
            catch {
                return 0;
            }
        }
        #buildGrid() {
            const year = this.#viewYear;
            const month = this.#viewMonth;
            const daysInMonth = this.#getDaysInMonth(year, month);
            const firstDay = new Date(year, month, 1).getDay();
            const firstDayOfWeek = this.#getFirstDayOfWeek();
            const today = new Date();
            const selectedIso = this.#selectedValue;
            let startOffset = firstDay - firstDayOfWeek;
            if (startOffset < 0)
                startOffset += 7;
            const cells = [];
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
            const rows = [];
            for (let i = 0; i < cells.length; i += 7) {
                rows.push(cells.slice(i, i + 7));
            }
            return rows;
        }
        #getWeekdayNames() {
            const formatter = new Intl.DateTimeFormat(this.locale, { weekday: "short" });
            const firstDayOfWeek = this.#getFirstDayOfWeek();
            const names = [];
            for (let i = 0; i < 7; i++) {
                // Jan 4 2015 is a Sunday
                const date = new Date(2015, 0, 4 + firstDayOfWeek + i);
                names.push(formatter.format(date));
            }
            return names;
        }
        #getMonthYearHeading() {
            const date = new Date(this.#viewYear, this.#viewMonth, 1);
            return new Intl.DateTimeFormat(this.locale, {
                month: "long",
                year: "numeric",
            }).format(date);
        }
        #selectDate(iso) {
            if (this.disabled || this.readOnly)
                return;
            if (this.value === undefined) {
                this.#internalValue = iso;
            }
            this.dispatchEvent(valueChangeEvent({ value: iso }));
        }
        #navigateMonth(delta) {
            let newMonth = this.#viewMonth + delta;
            let newYear = this.#viewYear;
            if (newMonth < 0) {
                newMonth = 11;
                newYear--;
            }
            else if (newMonth > 11) {
                newMonth = 0;
                newYear++;
            }
            this.#viewMonth = newMonth;
            this.#viewYear = newYear;
            this.#focusedDate = new Date(newYear, newMonth, 1);
        }
        #onDayClick = (__runInitializers(this, _private_viewYear_extraInitializers), (e) => {
            const button = e.currentTarget;
            const iso = button.dataset.date;
            if (iso && !button.disabled) {
                this.#selectDate(iso);
            }
        });
        #onKeyDown = (e) => {
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
                    }
                    else {
                        focused.setMonth(focused.getMonth() - 1);
                    }
                    break;
                case "PageDown":
                    if (e.shiftKey) {
                        focused.setFullYear(focused.getFullYear() + 1);
                    }
                    else {
                        focused.setMonth(focused.getMonth() + 1);
                    }
                    break;
                case "Home": {
                    focused.setDate(1);
                    break;
                }
                case "End": {
                    const daysInMonth = this.#getDaysInMonth(focused.getFullYear(), focused.getMonth());
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
                    const btn = this.shadowRoot?.querySelector(`[data-date="${iso}"]`);
                    btn?.focus();
                });
            }
        };
        #onPrevClick = () => {
            this.#navigateMonth(-1);
        };
        #onNextClick = () => {
            this.#navigateMonth(1);
        };
        render() {
            const grid = this.#buildGrid();
            const weekdays = this.#getWeekdayNames();
            const heading = this.#getMonthYearHeading();
            const focusedIso = this.#formatISO(this.#focusedDate);
            return html `
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
          ${weekdays.map((name) => html `<div part="weekday" role="columnheader">${name}</div>`)}
          ${grid.flat().map((cell) => html `
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
    };
})();
export { DuiCalendarPrimitive };
