import FulfillButton from './FulfillButton.vue';
import Commands from '@src/components/forms/Commands.vue';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { isFulfillable } from '@src/core/contract-conditions';

function onTileReady(tile: PrunTile) {
  const contract = computed(() => contractsStore.getByLocalId(tile.parameter));

  subscribe($$(tile.anchor, C.FormComponent.containerPassive), container => {
    // Some contracts don't have the "CMD" form component, so we create it manually.
    const nextElement = container.nextElementSibling;
    if (
      !nextElement ||
      nextElement.classList.contains(C.FormComponent.containerPassive) ||
      nextElement.classList.contains(C.FormComponent.containerCommand)
    ) {
      return;
    }

    createFragmentApp(Commands).after(container);
  });

  const fulfillableCount = computed(
    () => contract.value?.conditions.filter(x => isFulfillable(contract.value, x)).length ?? 0,
  );

  subscribe($$(tile.anchor, C.FormComponent.containerCommand), container => {
    if (container.nextElementSibling?.classList.contains(C.FormComponent.containerPassive)) {
      return;
    }

    createFragmentApp(
      FulfillButton,
      reactive({
        count: fulfillableCount,
        onClick: () => {
          const table = _$(tile.anchor, 'table');
          if (!table) {
            return;
          }
          const button = _$(table, C.Button.success);
          button?.click();
        },
      }),
    ).appendTo(container);
  });
}

function init() {
  tiles.observe('CONT', onTileReady);
}

features.add(import.meta.url, init, 'CONT: Adds fulfill-next button and pending condition count.');
