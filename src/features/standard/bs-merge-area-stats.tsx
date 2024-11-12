import { watchEffectWhileNodeAlive } from '@src/utils/watch-effect-while-node-alive';
import { refValue } from '@src/utils/reactive-dom';

function onTileReady(tile: PrunTile) {
  // Only process BS tiles with parameter
  if (!tile.parameter) {
    return;
  }

  subscribe($$(tile.anchor, PrunCss.Site.info), info => {
    const elements = _$$(info, PrunCss.FormComponent.containerPassive);
    if (elements.length < 2) {
      return;
    }

    const areaRow = elements[0];
    areaRow.style.display = 'none';
    const areaBar = areaRow.getElementsByTagName('progress')[0];
    if (!areaBar) {
      return;
    }

    const areaBarCopy = areaBar.cloneNode(true) as HTMLProgressElement;
    const areaValue = refValue(areaBar);
    watchEffectWhileNodeAlive(areaBar, () => (areaBarCopy.value = areaValue.value));
    const editDiv = elements[1].getElementsByTagName('div')[0] as HTMLElement;
    editDiv.insertBefore(areaBarCopy, editDiv.lastChild);
  });
}

function init() {
  tiles.observe('BS', onTileReady);
}

features.add({
  id: 'bs-merge-area-stats',
  description: 'BS: Merges the area progress bar field with the detailed area stats row.',
  init,
});
