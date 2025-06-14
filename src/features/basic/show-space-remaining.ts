import { fixed02 } from '@src/utils/format';
import { getInvStore } from '@src/core/store-id';
import { createReactiveSpan } from '@src/utils/reactive-element';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.StoreView.column), async column => {
    const capacities = _$$(column, C.StoreView.capacity);
    if (capacities.length < 2) {
      return;
    }

    const [weightIndex, volumeIndex] = tile.command === 'SHPI' ? [0, 1] : [1, 2];

    const weightText = computed(() => {
      const store = tile.parameter ? getInvStore(tile.parameter) : undefined;
      return store ? ` (${fixed02(store.weightCapacity - store.weightLoad)}t)` : undefined;
    });

    const weightSpan = createReactiveSpan(capacities[weightIndex], weightText);
    weightSpan.style.whiteSpace = 'pre';
    capacities[weightIndex].appendChild(weightSpan);

    const volumeText = computed(() => {
      const store = tile.parameter ? getInvStore(tile.parameter) : undefined;
      return store ? ` (${fixed02(store.volumeCapacity - store.volumeLoad)}m³)` : undefined;
    });

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
