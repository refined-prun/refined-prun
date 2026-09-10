import { mirrorSubtree } from '@src/utils/mirror-subtree';

export function mirrorConfirmationOverlay(origin: Element, target: Element) {
  const originFrame = findTileFrame(origin);
  const targetFrame = findTileFrame(target);
  if (!originFrame || !targetFrame) {
    return;
  }
  mirrorSubtree(originFrame, targetFrame, [C.ActionFeedback.overlay]);
}

function findTileFrame(element: Element) {
  return element.closest(`.${C.TileFrame.body}`) ?? _$(element, C.TileFrame.body);
}
