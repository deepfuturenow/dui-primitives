export { base } from "./base.ts";
export {
  getRootDocument,
  getComposedFocusableElements,
  isApplePlatform,
  queryComposedTree,
  queryComposedAutofocus,
} from "./dom.ts";
export type { GetRootDocumentOptions } from "./dom.ts";
export { customEvent } from "./event.ts";
export {
  waitForAnimationFrame,
  onTransitionEnd,
  renderArrow,
  ReopenGuard,
  computeFixedPosition,
  startFixedAutoUpdate,
} from "./floating-popup-utils.ts";
export type {
  AlignInnerOptions,
  FloatingPopupSide,
  ComputeFixedPositionOptions,
} from "./floating-popup-utils.ts";
export { FloatingTopLayerController } from "./floating-top-layer-controller.ts";
export type { FloatingTopLayerControllerOptions } from "./floating-top-layer-controller.ts";
export type { StackGap } from "./layout-types.ts";
