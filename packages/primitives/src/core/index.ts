export { base } from "./base.ts";
export {
  getComposedFocusableElements,
  getRootDocument,
  isApplePlatform,
  queryComposedAutofocus,
  queryComposedTree,
} from "./dom.ts";
export type { GetRootDocumentOptions } from "./dom.ts";
export { customEvent } from "./event.ts";
export {
  computeFixedPosition,
  onTransitionEnd,
  renderArrow,
  ReopenGuard,
  resolveScrollContainer,
  startFixedAutoUpdate,
  waitForAnimationFrame,
} from "./floating-popup-utils.ts";
export type {
  AlignInnerOptions,
  ComputeFixedPositionOptions,
  FloatingPopupSide,
} from "./floating-popup-utils.ts";
export { FloatingTopLayerController } from "./floating-top-layer-controller.ts";
export type { FloatingTopLayerControllerOptions } from "./floating-top-layer-controller.ts";
export type { StackGap } from "./layout-types.ts";
