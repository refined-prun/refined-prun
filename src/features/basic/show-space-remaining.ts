import { fixed02 } from '@src/utils/format';
import { getInvStore } from '@src/core/store-id';
import { createReactiveSpan } from '@src/utils/reactive-element';

function onTileReady(tile: PrunTile) {
  const store = computed(() => getInvStore(tile.parameter));
  const [weightIndex, volumeIndex] = tile.command === 'SHPI' ? [0, 1] : [1, 2];

  subscribe($$(tile.anchor, C.StoreView.column), column => {
    const capacities = _$$(column, C.StoreView.capacity);
    if (capacities.length < 2) {
      return;
    }

    const weightText = computed(() =>
      store.value
        ? ` (${fixed02(store.value.weightCapacity - store.value.weightLoad)}t)`
        : undefined,
    );

    const weightSpan = createReactiveSpan(capacities[weightIndex], weightText);
    weightSpan.style.whiteSpace = 'pre';
    capacities[weightIndex].appendChild(weightSpan);

    const volumeText = computed(() =>
      store.value
        ? ` (${fixed02(store.value.volumeCapacity - store.value.volumeLoad)}m³)`
        : undefined,
    );

    const volumeSpan = createReactiveSpan(capacities[volumeIndex], volumeText);
    volumeSpan.style.whiteSpace = 'pre';
    capacities[volumeIndex].appendChild(volumeSpan);
  });
}

function init() {
  tiles.observe(['INV', 'SHPI'], onTileReady);
}

features.add(
  import.meta.url,
  init,
  'Shows the remaining weight and volume capacity of the selected store in INV and SHPI',
);
