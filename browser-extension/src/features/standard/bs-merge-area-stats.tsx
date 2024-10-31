import { subscribe } from '@src/utils/subscribe-async-generator';
import { $$, _$$ } from '@src/utils/select-dom';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { watchEffectWhileNodeAlive } from '@src/utils/watch-effect-while-node-alive';
import { refValue } from '@src/utils/reactive-dom';
import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';

async function onTileReady(tile: PrunTile) {
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

export function init() {
  tiles.observe('BS', onTileReady);
}

void features.add({
  id: 'bs-merge-area-stats',
  init,
});
