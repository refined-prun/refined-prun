import ActionBar from '@src/components/ActionBar.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { deleteExchangeOrderFromClick } from '@src/infrastructure/prun-ui/utils/delete-exchange-order';

function onTileReady(tile: PrunTile) {
  const orderId = tile.parameter;
  if (!orderId) {
    return;
  }

  const isCX = tile.command === 'CXO';
  const ordersCommand = isCX ? 'CXOS' : 'FXOS';

  const onClick = async (event: MouseEvent) => {
    const success = await deleteExchangeOrderFromClick(event, orderId, ordersCommand);
    if (!success || tile.docked) {
      return;
    }
    const window = tile.container.closest(`.${C.Window.window}`);
    if (!window) {
      return;
    }
    const closeButton = _$$(window, C.Window.button).find(x => x.textContent === 'x');
    closeButton?.click();
  };

  subscribe($$(tile.anchor, 'table'), table => {
    createFragmentApp(() => (
      <ActionBar>
        <PrunButton danger onClick={onClick}>
          DELETE
        </PrunButton>
      </ActionBar>
    )).before(table);
  });
}

function init() {
  tiles.observe(['CXO', 'FXO'], onTileReady);
}

features.add(import.meta.url, init, 'CXO/FXO: Adds a delete button.');
