/** Ported from original DUI: deep-future-app/app/client/components/dui/dropzone */
import { LitElement, type TemplateResult } from "lit";
export type DropzoneErrorCode = "FILE_DIALOG_OPEN_FAILED" | "FILE_PROCESSING_FAILED";
export type DropzoneRejectionCode = "TOO_MANY_FILES" | "FILE_TOO_LARGE" | "FILE_TOO_SMALL" | "FILE_INVALID_TYPE";
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
export declare const dropzoneDropEvent: (detail: DropzoneDropDetail) => CustomEvent<DropzoneDropDetail>;
export declare const dropAcceptedEvent: (detail: DropzoneAcceptedDetail) => CustomEvent<DropzoneAcceptedDetail>;
export declare const dropRejectedEvent: (detail: DropzoneRejectedDetail) => CustomEvent<DropzoneRejectedDetail>;
export declare const dropzoneDragEnterEvent: (detail: void) => CustomEvent<void>;
export declare const dropzoneDragOverEvent: (detail: void) => CustomEvent<void>;
export declare const dropzoneDragLeaveEvent: (detail: void) => CustomEvent<void>;
export declare const dropzoneErrorEvent: (detail: DropzoneErrorDetail) => CustomEvent<DropzoneErrorDetail>;
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
export declare class DuiDropzonePrimitive extends LitElement {
    #private;
    static tagName: "dui-dropzone";
    static styles: any[];
    static readonly ERROR_CODES: Record<DropzoneErrorCode, DropzoneErrorCode>;
    static readonly REJECTION_CODES: Record<DropzoneRejectionCode, DropzoneRejectionCode>;
    /** Accepted file types (e.g. "image/*,.pdf"). */
    accessor accept: string | undefined;
    /** Allow multiple files. */
    accessor multiple: boolean;
    /** Disable the dropzone. */
    accessor disabled: boolean;
    /** Maximum number of files allowed. */
    accessor maxFiles: number;
    /** Maximum file size in bytes. */
    accessor maxSize: number;
    /** Minimum file size in bytes. */
    accessor minSize: number;
    /** Auto-focus the dropzone on mount. */
    accessor autoFocus: boolean;
    /** Disable default dropzone styling. */
    accessor noStyle: boolean;
    connectedCallback(): void;
    /** Opens the native file dialog programmatically. */
    openFileDialog(): void;
    render(): TemplateResult;
}
