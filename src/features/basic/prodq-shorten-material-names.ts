import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import PrunLink from '@src/components/PrunLink.vue';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { refAttributeValue, refTextContent } from '@src/utils/reactive-dom';

function onTileReady(tile: PrunTile) {
  const parameter = tile.parameter;
  if (!parameter) {
    return;
  }
  watch(
    productionStore.fetched,
    fetched => {
      if (fetched) {
        setupBuffer(tile, parameter);
      }
    },
    { once: true },
  );
}

function setupBuffer(tile: PrunTile, parameter: string) {
  const line = productionStore.getById(parameter)!;
  const planet = getEntityNameFromAddress(line.address)!;

  subscribe($$(tile.anchor, C.ProductionQueue.table), table => {
    subscribe($$(table, 'tr'), order => {
      if (!getPrunId(order)) {
        return;
      }
      console.log(order);
      subscribe($$(order.children[2], 'span'), span => {
        span.innerText = planet;
      });

      const columnInputs = Array.from(order.children[3].children) as HTMLDivElement[];
      createAppForRow(columnInputs);

      const columnOutputs = Array.from(order.children[4].children) as HTMLDivElement[];
      createAppForRow(columnOutputs);
    });
  });
}

function createAppForRow(elements: HTMLDivElement[]) {
  for (const materialCount of elements) {
    const materialName = materialCount.children[0] as HTMLSpanElement;
    const material = //TODO;
      (materialName.innerText = '');
    createFragmentApp(
      PrunLink,
      reactive({
        command: `MAT ${material.ticker}`,
        inline: true,
        linkText: `${material.ticker}`,
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
