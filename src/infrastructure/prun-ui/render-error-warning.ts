export function initRenderErrorWarning() {
  applyLocalizationPatch(
    L.ErrorBoundary.error,
    x => `${x} This error may be caused by Refined PrUn.`,
  );
}
