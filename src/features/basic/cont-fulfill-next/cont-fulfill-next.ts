import FulfillButton from './FulfillButton.vue';
import Commands from '@src/components/forms/Commands.vue';

function onTileReady(tile: PrunTile) {
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

  subscribe($$(tile.anchor, C.FormComponent.containerCommand), container => {
    if (container.nextElementSibling?.classList.contains(C.FormComponent.containerPassive)) {
      return;
    }

    createFragmentApp(
      FulfillButton,
      reactive({
        contractId: tile.parameter!,
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

features.add(
  import.meta.url,
  init,
  'CONT: Adds a fulfill-next button with pending condition count.',
);
