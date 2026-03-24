import { PrunI18N } from '@src/infrastructure/prun-ui/i18n';
import Passive from '@src/components/forms/Passive.vue';

function onTileReady(tile: PrunTile) {
  const basesText = PrunI18N['CompanyPanel.data.bases']?.[0]?.value;
  subscribe($$(tile.anchor, C.FormComponent.containerPassive), async container => {
    const label = await $(container, 'label');
    if (label.textContent !== basesText) {
      return;
    }
    const bases = await $(container, C.StaticInput.static);
    createFragmentApp(() => (
      <Passive label="Base Count">
        <span>{bases.childElementCount}</span>
      </Passive>
    )).before(container);
  });
}

function init() {
  tiles.observe('CO', onTileReady);
}

features.add(import.meta.url, init, 'CO: Adds a "Base Count" row.');
