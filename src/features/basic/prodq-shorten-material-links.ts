import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { getEntityNameFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import PrunLink from '@src/components/PrunLink.vue';
import { watchEffectWhileNodeAlive } from '@src/utils/watch';
import { refPrunId } from '@src/infrastructure/prun-ui/attributes';

async function onTileReady(tile: PrunTile) {
  const parameter = tile.parameter;
  if (!parameter) {
    return;
  }

  if (!productionStore.getById(parameter)) {
    const unwatch = watchEffect(() => {
      if (productionStore.all.value?.find(line => line.id.substring(0, 8) === parameter)) {
        setupBuffer(tile, parameter);
        unwatch();
      }
    });
  } else {
    setupBuffer(tile, parameter);
  }
}

function setupBuffer(tile: PrunTile, parameter: string) {
  subscribe($$(tile.anchor, C.ProductionQueue.table), table => {
    subscribe($$(table, 'tr'), order => {
      if (_$(order, 'th')) {
        return;
      }
      const prunId = refPrunId(order);
      watchEffectWhileNodeAlive(order, () => {
        if (!prunId.value) {
          return;
        }

        const line = productionStore.getById(parameter)!;
        const productionOrder = line.orders.find(order => order.id === prunId.value);
        if (!productionOrder) {
          return;
        }

        subscribe($$(order.children[2], 'span'), span => {
          span.innerText = getEntityNameFromAddress(line.address)!;
        });
        const columnInputs = Array.from(order.children[3].children) as HTMLDivElement[];
        createAppForRow(columnInputs, productionOrder.inputs);
        const columnOutputs = Array.from(order.children[4].children) as HTMLDivElement[];
        createAppForRow(columnOutputs, productionOrder.outputs);
      });
    });
  });
}

function createAppForRow(elements: HTMLDivElement[], resources: PrunApi.MaterialAmountValue[]) {
  for (const [index, materialCount] of elements.entries()) {
    let materialName = {} as HTMLSpanElement;
    if (materialCount.children.length === 2) {
      materialName = materialCount.children[1] as HTMLSpanElement;
    } else {
      materialName = materialCount.children[0] as HTMLSpanElement;
    }
    const material = resources[index].material.ticker;
    materialName.innerText = '';
    createFragmentApp(
      PrunLink,
      reactive({
        command: `MAT ${material}`,
        inline: true,
        linkText: `${material}`,
      }),
    ).appendTo(materialName);
  }
}

function init() {
  tiles.observe('PRODQ', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'PRODQ: Shortens material and government full names into their ticker and planet with a link.',
);
