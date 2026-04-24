/**
 * Base reset + host defaults shared by all DUI components.
 * Contains layout resets, behavioral defaults, and font-smoothing.
 */

import { css } from "lit";

export const base = css`
  * {
    box-sizing: border-box;
  }

  p,
  ul,
  ol,
  dl,
  dd,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  figure,
  blockquote,
  fieldset {
    margin: 0;
    padding: 0;
  }

  ul,
  ol {
    list-style: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-size: inherit;
    line-height: inherit;
    font-weight: normal;
  }

  img,
  svg,
  video,
  canvas {
    display: block;
    max-width: 100%;
  }

  a,
  a:visited,
  a:hover,
  a:active {
    color: inherit;
  }

  img,
  video {
    height: auto;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  li,
  blockquote,
  dt,
  dd {
    text-box: trim-both cap alphabetic;
  }

  :host {
    font-size: inherit;
    letter-spacing: inherit;
    font-optical-sizing: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
