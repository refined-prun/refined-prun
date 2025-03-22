import { productionStore } from '@src/infrastructure/prun-api/data/production';
import PrunLink from '@src/components/PrunLink.vue';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';

async function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.ProductionQueue.table), table => {
    subscribe($$(table, 'tr'), order => {
      const prunId = refPrunId(order);
      if (prunId.value) {
        watchEffectWhileNodeAlive(order, () => {
          const line = productionStore.getById(tile.parameter);
          const productionOrder = line?.orders.find(order => order.id === prunId.value);
          if (productionOrder) {
            linkifyMaterialNames(order.children[3].children, productionOrder.inputs);
            linkifyMaterialNames(order.children[4].children, productionOrder.outputs);
          }
        });
      }
    });
  });
}

function linkifyMaterialNames(elements: HTMLCollection, resources: PrunApi.MaterialAmountValue[]) {
  for (let i = 0; i < elements.length; i++) {
    const children = Array.from(elements[i].children) as HTMLSpanElement[];
    // In-progress orders have only one child, while queued ones have two.
    const materialName = children.length === 2 ? children[1] : children[0];
    materialName.innerText = '';
    const material = resources[i].material.ticker;
    createFragmentApp(() => (
      <PrunLink inline command={`MAT ${material}`}>
        {material}
      </PrunLink>
    )).appendTo(materialName);
  }
}

function init() {
  tiles.observe('PRODQ', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'PRODQ: Shortens material full names into their ticker with a link.',
);
