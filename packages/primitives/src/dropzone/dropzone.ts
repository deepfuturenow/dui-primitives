/** Ported from original DUI: deep-future-app/app/client/components/dui/dropzone */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { base } from "../core/base.ts";
import { customEvent } from "../core/event.ts";

// Type Definitions

export type DropzoneErrorCode =
  | "FILE_DIALOG_OPEN_FAILED"
  | "FILE_PROCESSING_FAILED";

export type DropzoneRejectionCode =
  | "TOO_MANY_FILES"
  | "FILE_TOO_LARGE"
  | "FILE_TOO_SMALL"
  | "FILE_INVALID_TYPE";

export type FileRejectionError = {
  code: DropzoneRejectionCode;
  message: string;
};

export type RejectedFile = {
  file: File;
  errors: FileRejectionError[];
};

export type DropzoneDropDetail = {
  acceptedFiles: File[];
  rejectedFiles: RejectedFile[];
};

export type DropzoneAcceptedDetail = {
  acceptedFiles: File[];
};

export type DropzoneRejectedDetail = {
  rejectedFiles: RejectedFile[];
};

export type DropzoneErrorDetail = {
  error: unknown;
  code: DropzoneErrorCode;
};

// Event Factories

export const dropzoneDropEvent = customEvent<DropzoneDropDetail>("drop", {
  bubbles: true,
  composed: true,
});

export const dropAcceptedEvent = customEvent<DropzoneAcceptedDetail>(
  "drop-accepted",
  { bubbles: true, composed: true },
);

export const dropRejectedEvent = customEvent<DropzoneRejectedDetail>(
  "drop-rejected",
  { bubbles: true, composed: true },
);

export const dropzoneDragEnterEvent = customEvent<void>("dragenter", {
  bubbles: true,
  composed: true,
});

export const dropzoneDragOverEvent = customEvent<void>("dragover", {
  bubbles: true,
  composed: true,
});

export const dropzoneDragLeaveEvent = customEvent<void>("dragleave", {
  bubbles: true,
  composed: true,
});

export const dropzoneErrorEvent = customEvent<DropzoneErrorDetail>(
  "dropzone-error",
  { bubbles: true, composed: true },
);

/** Structural styles only — layout CSS. */
const styles = css`
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
export class DuiDropzonePrimitive extends LitElement {
  static tagName = "dui-dropzone" as const;

  static override styles = [base, styles];

  static readonly ERROR_CODES: Record<DropzoneErrorCode, DropzoneErrorCode> = {
    FILE_DIALOG_OPEN_FAILED: "FILE_DIALOG_OPEN_FAILED",
    FILE_PROCESSING_FAILED: "FILE_PROCESSING_FAILED",
  };

  static readonly REJECTION_CODES: Record<
    DropzoneRejectionCode,
    DropzoneRejectionCode
  > = {
    TOO_MANY_FILES: "TOO_MANY_FILES",
    FILE_TOO_LARGE: "FILE_TOO_LARGE",
    FILE_TOO_SMALL: "FILE_TOO_SMALL",
    FILE_INVALID_TYPE: "FILE_INVALID_TYPE",
  };

  /** Accepted file types (e.g. "image/*,.pdf"). */
  @property({ type: String, reflect: true })
  accessor accept: string | undefined;

  /** Allow multiple files. */
  @property({ type: Boolean, reflect: true })
  accessor multiple = false;

  /** Disable the dropzone. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Maximum number of files allowed. */
  @property({ type: Number, reflect: true, attribute: "max-files" })
  accessor maxFiles = Infinity;

  /** Maximum file size in bytes. */
  @property({ type: Number, reflect: true, attribute: "max-size" })
  accessor maxSize = Infinity;

  /** Minimum file size in bytes. */
  @property({ type: Number, reflect: true, attribute: "min-size" })
  accessor minSize = 0;

  /** Auto-focus the dropzone on mount. */
  @property({ type: Boolean, reflect: true, attribute: "auto-focus" })
  accessor autoFocus = false;

  /** Disable default dropzone styling. */
  @property({ type: Boolean, reflect: true, attribute: "no-style" })
  accessor noStyle = false;

  @state()
  accessor #isDragOver = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.autoFocus && !this.disabled) {
      this.updateComplete.then(() => {
        this.shadowRoot?.querySelector<HTMLElement>("[part='root']")?.focus();
      });
    }
  }

  /** Opens the native file dialog programmatically. */
  openFileDialog(): void {
    if (this.disabled) return;

    const input =
      this.shadowRoot?.querySelector<HTMLInputElement>('input[type="file"]');

    if (!input) return;

    try {
      (input as HTMLInputElement).click();
    } catch (error) {
      this.dispatchEvent(
        dropzoneErrorEvent({
          error,
          code: DuiDropzonePrimitive.ERROR_CODES.FILE_DIALOG_OPEN_FAILED,
        }),
      );
    }
  }

  #handleDragEnter = (e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (this.disabled) return;

    this.#isDragOver = true;
    this.dispatchEvent(dropzoneDragEnterEvent());
  };

  #handleDragOver = (e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (this.disabled) return;

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }

    this.dispatchEvent(dropzoneDragOverEvent());
  };

  #handleDragLeave = (e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (this.disabled) return;

    this.#isDragOver = false;
    this.dispatchEvent(dropzoneDragLeaveEvent());
  };

  #handleDrop = (e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (this.disabled) return;

    this.#isDragOver = false;

    try {
      const files = Array.from(e.dataTransfer?.files ?? []);
      this.#processFiles(files);
    } catch (error) {
      this.dispatchEvent(
        dropzoneErrorEvent({
          error,
          code: DuiDropzonePrimitive.ERROR_CODES.FILE_PROCESSING_FAILED,
        }),
      );
    }
  };

  #handleClick = (): void => {
    if (this.disabled) return;
    this.openFileDialog();
  };

  #handleKeyDown = (e: KeyboardEvent): void => {
    if (this.disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.openFileDialog();
    }
  };

  #handleInputChange = (e: Event): void => {
    if (this.disabled) return;

    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    try {
      this.#processFiles(files);
    } catch (error) {
      this.dispatchEvent(
        dropzoneErrorEvent({
          error,
          code: DuiDropzonePrimitive.ERROR_CODES.FILE_PROCESSING_FAILED,
        }),
      );
    } finally {
      input.value = "";
    }
  };



  #processFiles(files: File[]): void {
    const { acceptedFiles, rejectedFiles } = this.#validateFiles(files);

    this.dispatchEvent(dropzoneDropEvent({ acceptedFiles, rejectedFiles }));

    if (acceptedFiles.length > 0) {
      this.dispatchEvent(dropAcceptedEvent({ acceptedFiles }));
    }

    if (rejectedFiles.length > 0) {
      this.dispatchEvent(dropRejectedEvent({ rejectedFiles }));
    }
  }

  #validateFiles(files: File[]): {
    acceptedFiles: File[];
    rejectedFiles: RejectedFile[];
  } {
    const acceptedFiles: File[] = [];
    const rejectedFiles: RejectedFile[] = [];

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
      const errors: FileRejectionError[] = [];

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
      } else {
        acceptedFiles.push(file);
      }
    }

    return { acceptedFiles, rejectedFiles };
  }

  #isValidFileType(file: File): boolean {
    if (!this.accept) return true;

    const acceptedTypes = this.accept
      .split(",")
      .map((type) => type.trim().toLowerCase());

    for (const acceptedType of acceptedTypes) {
      if (acceptedType.startsWith(".")) {
        if (file.name.toLowerCase().endsWith(acceptedType)) {
          return true;
        }
      } else if (acceptedType.endsWith("/*")) {
        const baseType = acceptedType.slice(0, -2);
        if (file.type.toLowerCase().startsWith(baseType)) {
          return true;
        }
      } else {
        if (file.type.toLowerCase() === acceptedType) {
          return true;
        }
      }
    }

    return false;
  }

  override render(): TemplateResult {
    return html`
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
}
