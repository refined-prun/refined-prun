import FulfillButton from './FulfillButton.vue';
import Commands from '@src/components/forms/Commands.vue';
import { refAnimationFrame } from '@src/utils/reactive-dom';

function onTileReady(tile: PrunTile) {
  let fulfillButtons: HTMLCollectionOf<HTMLButtonElement> | undefined = undefined;

  subscribe($$(tile.anchor, 'table'), table => {
    fulfillButtons = table.getElementsByClassName(
      C.Button.success,
    ) as HTMLCollectionOf<HTMLButtonElement>;
  });

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

  const fulfillableCount = refAnimationFrame(tile.anchor, () => fulfillButtons?.length ?? 0);

  const onFulfillNext = () => {
    const buttons = _$$(tile.anchor, C.Button.success);
    const fulfillBtn = buttons.find(x => x.textContent?.trim().toLowerCase() === 'fulfill');
    if (fulfillBtn) {
      fulfillBtn.click();
    }
  };

  subscribe($$(tile.anchor, C.FormComponent.containerCommand), container => {
    if (container.nextElementSibling?.classList.contains(C.FormComponent.containerPassive)) {
      return;
    }

    createFragmentApp(
      FulfillButton,
      reactive({ count: fulfillableCount, onClick: onFulfillNext }),
    ).appendTo(container);
  });
}

function init() {
  tiles.observe('CONT', onTileReady);
}

features.add(import.meta.url, init, 'CONT: Adds fulfill-next button and pending condition count.');
