/** Ported from ShadCN/ui: https://ui.shadcn.com/docs/components/card */
import { LitElement, type TemplateResult } from "lit";
/**
 * `<dui-card>` — A container for grouped content with header, body,
 * and footer sections.
 *
 * Uses flex-column + gap for vertical rhythm. The card owns all internal
 * spacing; consumers slot content into named regions.
 *
 * @slot - Main card content (body).
 * @slot title - Card heading text.
 * @slot description - Helper text below the title.
 * @slot action - Top-right header action (button, badge, etc.).
 * @slot footer - Footer content (buttons, links, etc.).
 *
 * @csspart root - The outer card container.
 * @csspart header - The header section (title + description + action).
 * @csspart header-text - The vertical stack holding title and description.
 * @csspart content - The wrapper around the default slot.
 * @csspart footer - The footer section.
 */
export declare class DuiCardPrimitive extends LitElement {
    #private;
    static tagName: "dui-card";
    static styles: any[];
    /** Card size — controls internal spacing via `--card-*` tokens. */
    accessor size: string;
    render(): TemplateResult;
}
