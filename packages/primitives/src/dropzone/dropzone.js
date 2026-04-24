/** Ported from original DUI: deep-future-app/app/client/components/dui/dropzone */
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
// Event Factories
export const dropzoneDropEvent = customEvent("drop", {
    bubbles: true,
    composed: true,
});
export const dropAcceptedEvent = customEvent("drop-accepted", { bubbles: true, composed: true });
export const dropRejectedEvent = customEvent("drop-rejected", { bubbles: true, composed: true });
export const dropzoneDragEnterEvent = customEvent("dragenter", {
    bubbles: true,
    composed: true,
});
export const dropzoneDragOverEvent = customEvent("dragover", {
    bubbles: true,
    composed: true,
});
export const dropzoneDragLeaveEvent = customEvent("dragleave", {
    bubbles: true,
    composed: true,
});
export const dropzoneErrorEvent = customEvent("dropzone-error", { bubbles: true, composed: true });
/** Structural styles only — layout CSS. */
const styles = css `
  :host {
    display: block;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  :host([no-style]) [part="root"] {
    all: unset;
  }

  [part="root"] {
    text-align: center;
    cursor: pointer;
  }

  input[type="file"] {
    display: none;
  }
`;
/**
 * `<dui-dropzone>` — A drag-and-drop file upload area.
 *
 * @slot - Custom content for the dropzone area.
 * @csspart root - The dropzone container.
 *
 * @fires drop - Files dropped or selected (valid or invalid).
 * @fires drop-accepted - Files that passed validation.
 * @fires drop-rejected - Files that failed validation.
 * @fires dragenter - File dragged over the dropzone.
 * @fires dragover - File hovering over the dropzone.
 * @fires dragleave - File dragged away from the dropzone.
 * @fires dropzone-error - Internal error (e.g. file dialog failure).
 */
let DuiDropzonePrimitive = (() => {
    var _a;
    let _classSuper = LitElement;
    let _accept_decorators;
    let _accept_initializers = [];
    let _accept_extraInitializers = [];
    let _multiple_decorators;
    let _multiple_initializers = [];
    let _multiple_extraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _disabled_extraInitializers = [];
    let _maxFiles_decorators;
    let _maxFiles_initializers = [];
    let _maxFiles_extraInitializers = [];
    let _maxSize_decorators;
    let _maxSize_initializers = [];
    let _maxSize_extraInitializers = [];
    let _minSize_decorators;
    let _minSize_initializers = [];
    let _minSize_extraInitializers = [];
    let _autoFocus_decorators;
    let _autoFocus_initializers = [];
    let _autoFocus_extraInitializers = [];
    let _noStyle_decorators;
    let _noStyle_initializers = [];
    let _noStyle_extraInitializers = [];
    let _private_isDragOver_decorators;
    let _private_isDragOver_initializers = [];
    let _private_isDragOver_extraInitializers = [];
    let _private_isDragOver_descriptor;
    return class DuiDropzonePrimitive extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _accept_decorators = [property({ type: String, reflect: true })];
            _multiple_decorators = [property({ type: Boolean, reflect: true })];
            _disabled_decorators = [property({ type: Boolean, reflect: true })];
            _maxFiles_decorators = [property({ type: Number, reflect: true, attribute: "max-files" })];
            _maxSize_decorators = [property({ type: Number, reflect: true, attribute: "max-size" })];
            _minSize_decorators = [property({ type: Number, reflect: true, attribute: "min-size" })];
            _autoFocus_decorators = [property({ type: Boolean, reflect: true, attribute: "auto-focus" })];
            _noStyle_decorators = [property({ type: Boolean, reflect: true, attribute: "no-style" })];
            _private_isDragOver_decorators = [state()];
            __esDecorate(this, null, _accept_decorators, { kind: "accessor", name: "accept", static: false, private: false, access: { has: obj => "accept" in obj, get: obj => obj.accept, set: (obj, value) => { obj.accept = value; } }, metadata: _metadata }, _accept_initializers, _accept_extraInitializers);
            __esDecorate(this, null, _multiple_decorators, { kind: "accessor", name: "multiple", static: false, private: false, access: { has: obj => "multiple" in obj, get: obj => obj.multiple, set: (obj, value) => { obj.multiple = value; } }, metadata: _metadata }, _multiple_initializers, _multiple_extraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } }, metadata: _metadata }, _disabled_initializers, _disabled_extraInitializers);
            __esDecorate(this, null, _maxFiles_decorators, { kind: "accessor", name: "maxFiles", static: false, private: false, access: { has: obj => "maxFiles" in obj, get: obj => obj.maxFiles, set: (obj, value) => { obj.maxFiles = value; } }, metadata: _metadata }, _maxFiles_initializers, _maxFiles_extraInitializers);
            __esDecorate(this, null, _maxSize_decorators, { kind: "accessor", name: "maxSize", static: false, private: false, access: { has: obj => "maxSize" in obj, get: obj => obj.maxSize, set: (obj, value) => { obj.maxSize = value; } }, metadata: _metadata }, _maxSize_initializers, _maxSize_extraInitializers);
            __esDecorate(this, null, _minSize_decorators, { kind: "accessor", name: "minSize", static: false, private: false, access: { has: obj => "minSize" in obj, get: obj => obj.minSize, set: (obj, value) => { obj.minSize = value; } }, metadata: _metadata }, _minSize_initializers, _minSize_extraInitializers);
            __esDecorate(this, null, _autoFocus_decorators, { kind: "accessor", name: "autoFocus", static: false, private: false, access: { has: obj => "autoFocus" in obj, get: obj => obj.autoFocus, set: (obj, value) => { obj.autoFocus = value; } }, metadata: _metadata }, _autoFocus_initializers, _autoFocus_extraInitializers);
            __esDecorate(this, null, _noStyle_decorators, { kind: "accessor", name: "noStyle", static: false, private: false, access: { has: obj => "noStyle" in obj, get: obj => obj.noStyle, set: (obj, value) => { obj.noStyle = value; } }, metadata: _metadata }, _noStyle_initializers, _noStyle_extraInitializers);
            __esDecorate(this, _private_isDragOver_descriptor = { get: __setFunctionName(function () { return this.#isDragOver_accessor_storage; }, "#isDragOver", "get"), set: __setFunctionName(function (value) { this.#isDragOver_accessor_storage = value; }, "#isDragOver", "set") }, _private_isDragOver_decorators, { kind: "accessor", name: "#isDragOver", static: false, private: true, access: { has: obj => #isDragOver in obj, get: obj => obj.#isDragOver, set: (obj, value) => { obj.#isDragOver = value; } }, metadata: _metadata }, _private_isDragOver_initializers, _private_isDragOver_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static tagName = "dui-dropzone";
        static styles = [base, styles];
        static ERROR_CODES = {
            FILE_DIALOG_OPEN_FAILED: "FILE_DIALOG_OPEN_FAILED",
            FILE_PROCESSING_FAILED: "FILE_PROCESSING_FAILED",
        };
        static REJECTION_CODES = {
            TOO_MANY_FILES: "TOO_MANY_FILES",
            FILE_TOO_LARGE: "FILE_TOO_LARGE",
            FILE_TOO_SMALL: "FILE_TOO_SMALL",
            FILE_INVALID_TYPE: "FILE_INVALID_TYPE",
        };
        #accept_accessor_storage = __runInitializers(this, _accept_initializers, void 0);
        /** Accepted file types (e.g. "image/*,.pdf"). */
        get accept() { return this.#accept_accessor_storage; }
        set accept(value) { this.#accept_accessor_storage = value; }
        #multiple_accessor_storage = (__runInitializers(this, _accept_extraInitializers), __runInitializers(this, _multiple_initializers, false));
        /** Allow multiple files. */
        get multiple() { return this.#multiple_accessor_storage; }
        set multiple(value) { this.#multiple_accessor_storage = value; }
        #disabled_accessor_storage = (__runInitializers(this, _multiple_extraInitializers), __runInitializers(this, _disabled_initializers, false));
        /** Disable the dropzone. */
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #maxFiles_accessor_storage = (__runInitializers(this, _disabled_extraInitializers), __runInitializers(this, _maxFiles_initializers, Infinity));
        /** Maximum number of files allowed. */
        get maxFiles() { return this.#maxFiles_accessor_storage; }
        set maxFiles(value) { this.#maxFiles_accessor_storage = value; }
        #maxSize_accessor_storage = (__runInitializers(this, _maxFiles_extraInitializers), __runInitializers(this, _maxSize_initializers, Infinity));
        /** Maximum file size in bytes. */
        get maxSize() { return this.#maxSize_accessor_storage; }
        set maxSize(value) { this.#maxSize_accessor_storage = value; }
        #minSize_accessor_storage = (__runInitializers(this, _maxSize_extraInitializers), __runInitializers(this, _minSize_initializers, 0));
        /** Minimum file size in bytes. */
        get minSize() { return this.#minSize_accessor_storage; }
        set minSize(value) { this.#minSize_accessor_storage = value; }
        #autoFocus_accessor_storage = (__runInitializers(this, _minSize_extraInitializers), __runInitializers(this, _autoFocus_initializers, false));
        /** Auto-focus the dropzone on mount. */
        get autoFocus() { return this.#autoFocus_accessor_storage; }
        set autoFocus(value) { this.#autoFocus_accessor_storage = value; }
        #noStyle_accessor_storage = (__runInitializers(this, _autoFocus_extraInitializers), __runInitializers(this, _noStyle_initializers, false));
        /** Disable default dropzone styling. */
        get noStyle() { return this.#noStyle_accessor_storage; }
        set noStyle(value) { this.#noStyle_accessor_storage = value; }
        #isDragOver_accessor_storage = (__runInitializers(this, _noStyle_extraInitializers), __runInitializers(this, _private_isDragOver_initializers, false));
        get #isDragOver() { return _private_isDragOver_descriptor.get.call(this); }
        set #isDragOver(value) { return _private_isDragOver_descriptor.set.call(this, value); }
        connectedCallback() {
            super.connectedCallback();
            if (this.autoFocus && !this.disabled) {
                this.updateComplete.then(() => {
                    this.shadowRoot?.querySelector("[part='root']")?.focus();
                });
            }
        }
        /** Opens the native file dialog programmatically. */
        openFileDialog() {
            if (this.disabled)
                return;
            const input = this.shadowRoot?.querySelector('input[type="file"]');
            if (!input)
                return;
            try {
                input.click();
            }
            catch (error) {
                this.dispatchEvent(dropzoneErrorEvent({
                    error,
                    code: DuiDropzonePrimitive.ERROR_CODES.FILE_DIALOG_OPEN_FAILED,
                }));
            }
        }
        #handleDragEnter = (__runInitializers(this, _private_isDragOver_extraInitializers), (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.disabled)
                return;
            this.#isDragOver = true;
            this.dispatchEvent(dropzoneDragEnterEvent());
        });
        #handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.disabled)
                return;
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = "copy";
            }
            this.dispatchEvent(dropzoneDragOverEvent());
        };
        #handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.disabled)
                return;
            this.#isDragOver = false;
            this.dispatchEvent(dropzoneDragLeaveEvent());
        };
        #handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.disabled)
                return;
            this.#isDragOver = false;
            try {
                const files = Array.from(e.dataTransfer?.files ?? []);
                this.#processFiles(files);
            }
            catch (error) {
                this.dispatchEvent(dropzoneErrorEvent({
                    error,
                    code: DuiDropzonePrimitive.ERROR_CODES.FILE_PROCESSING_FAILED,
                }));
            }
        };
        #handleClick = () => {
            if (this.disabled)
                return;
            this.openFileDialog();
        };
        #handleKeyDown = (e) => {
            if (this.disabled)
                return;
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                this.openFileDialog();
            }
        };
        #handleInputChange = (e) => {
            if (this.disabled)
                return;
            const input = e.target;
            const files = Array.from(input.files ?? []);
            try {
                this.#processFiles(files);
            }
            catch (error) {
                this.dispatchEvent(dropzoneErrorEvent({
                    error,
                    code: DuiDropzonePrimitive.ERROR_CODES.FILE_PROCESSING_FAILED,
                }));
            }
            finally {
                input.value = "";
            }
        };
        #processFiles(files) {
            const { acceptedFiles, rejectedFiles } = this.#validateFiles(files);
            this.dispatchEvent(dropzoneDropEvent({ acceptedFiles, rejectedFiles }));
            if (acceptedFiles.length > 0) {
                this.dispatchEvent(dropAcceptedEvent({ acceptedFiles }));
            }
            if (rejectedFiles.length > 0) {
                this.dispatchEvent(dropRejectedEvent({ rejectedFiles }));
            }
        }
        #validateFiles(files) {
            const acceptedFiles = [];
            const rejectedFiles = [];
            const maxAllowed = this.multiple ? this.maxFiles : 1;
            if (files.length > maxAllowed) {
                for (const file of files) {
                    rejectedFiles.push({
                        file,
                        errors: [
                            {
                                code: DuiDropzonePrimitive.REJECTION_CODES.TOO_MANY_FILES,
                                message: this.multiple
                                    ? `Too many files. Maximum allowed is ${this.maxFiles}.`
                                    : "Multiple files not allowed.",
                            },
                        ],
                    });
                }
                return { acceptedFiles, rejectedFiles };
            }
            for (const file of files) {
                const errors = [];
                if (file.size > this.maxSize) {
                    errors.push({
                        code: DuiDropzonePrimitive.REJECTION_CODES.FILE_TOO_LARGE,
                        message: `File is too large. Maximum size is ${this.maxSize} bytes.`,
                    });
                }
                if (file.size < this.minSize) {
                    errors.push({
                        code: DuiDropzonePrimitive.REJECTION_CODES.FILE_TOO_SMALL,
                        message: `File is too small. Minimum size is ${this.minSize} bytes.`,
                    });
                }
                if (this.accept && !this.#isValidFileType(file)) {
                    errors.push({
                        code: DuiDropzonePrimitive.REJECTION_CODES.FILE_INVALID_TYPE,
                        message: `File type not accepted. Allowed types: ${this.accept}`,
                    });
                }
                if (errors.length > 0) {
                    rejectedFiles.push({ file, errors });
                }
                else {
                    acceptedFiles.push(file);
                }
            }
            return { acceptedFiles, rejectedFiles };
        }
        #isValidFileType(file) {
            if (!this.accept)
                return true;
            const acceptedTypes = this.accept
                .split(",")
                .map((type) => type.trim().toLowerCase());
            for (const acceptedType of acceptedTypes) {
                if (acceptedType.startsWith(".")) {
                    if (file.name.toLowerCase().endsWith(acceptedType)) {
                        return true;
                    }
                }
                else if (acceptedType.endsWith("/*")) {
                    const baseType = acceptedType.slice(0, -2);
                    if (file.type.toLowerCase().startsWith(baseType)) {
                        return true;
                    }
                }
                else {
                    if (file.type.toLowerCase() === acceptedType) {
                        return true;
                    }
                }
            }
            return false;
        }
        render() {
            return html `
      <div
        part="root"
        tabindex="${this.disabled ? -1 : 0}"
        ?data-dragover="${this.#isDragOver}"
        ?data-disabled="${this.disabled}"
        @dragenter="${this.#handleDragEnter}"
        @dragover="${this.#handleDragOver}"
        @dragleave="${this.#handleDragLeave}"
        @drop="${this.#handleDrop}"
        @click="${this.#handleClick}"
        @keydown="${this.#handleKeyDown}"
      >
        <slot>
          <span>Drag and drop files here or click to select</span>
        </slot>
      </div>
      <input
        type="file"
        ?multiple="${this.multiple}"
        accept="${this.accept || ""}"
        ?disabled="${this.disabled}"
        @change="${this.#handleInputChange}"
        tabindex="-1"
        aria-hidden="true"
        hidden
      />
    `;
        }
    };
})();
export { DuiDropzonePrimitive };
