import { PrunI18N } from '@src/infrastructure/prun-ui/i18n';
import { observeChildListChanged } from '@src/utils/mutation-observer';

function onTileReady(tile: PrunTile) {
  const labelText = PrunI18N['CompanyPanel.data.bases']?.[0]?.value;
  subscribe($$(tile.anchor, C.FormComponent.containerPassive), async container => {
    const label = await $(container, C.FormComponent.label);
    if (label.textContent !== labelText) {
      return;
    }
    const bases = await $(container, C.StaticInput.static);
    const baseCount = ref(bases.childElementCount);
    observeChildListChanged(bases, () => (baseCount.value = bases.childElementCount));
    createFragmentApp(() => <span> {`(${baseCount.value})`}</span>).appendTo(label);
  });
}

function init() {
  tiles.observe('CO', onTileReady);
}

features.add(import.meta.url, init, 'CO: Displays a base count in the "Bases" label.');
