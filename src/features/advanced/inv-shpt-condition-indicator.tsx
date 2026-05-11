import $style from './inv-shpt-condition-indicator.module.css';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { watchUntil } from '@src/utils/watch';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ColoredIcon.container), async container => {
    const label = await $(container, C.ColoredIcon.label);

    if (label.textContent !== 'SHPT' && label.textContent !== 'BLCK') {
      return;
    }

    const id = refPrunId(container);
    await watchUntil(() => !!id.value);

    const indicator = computed(() => {
      const contract = contractsStore.getByShipmentId(id.value);
      if (!contract) {
        return undefined;
      }

      let indicator = contract.localId.substring(0, 3);
      const conditions = contract.conditions.filter(x => x.type === 'DELIVERY_SHIPMENT');
      if (conditions.length === 1) {
        return indicator;
      }

      const condition = contract.conditions.find(
        x =>
          (x.type === 'PROVISION_SHIPMENT' && x.blockId === id.value) ||
          (x.type === 'PICKUP_SHIPMENT' && x.id === id.value),
      );
      if (!condition) {
        return indicator;
      }

      const index = condition?.index;
      if (index !== undefined) {
        indicator += ` #${index + 1}`;
      }

      return indicator;
    });

    createFragmentApp(() => (
      <div class={C.MaterialIcon.indicatorContainer}>
        <div
          class={[
            C.MaterialIcon.indicator,
            C.MaterialIcon.typeVerySmall,
            C.MaterialIcon.neutral,
            $style.indicator,
          ]}>
          {indicator.value}
        </div>
      </div>
    )).appendTo(container);
  });
}

function init() {
  applyCssRule(
    ['INV', 'SHPI'],
    [
      `.rp-ticker-SHPT .${C.ColoredIcon.labelContainer}`,
      `.rp-ticker-BLCK .${C.ColoredIcon.labelContainer}`,
    ],
    $style.labelContainer,
  );
  tiles.observe(['INV', 'SHPI'], onTileReady);
}

features.add(import.meta.url, init, 'INV/SHPI: Adds a condition indicator to SHPT and BLCK items.');
