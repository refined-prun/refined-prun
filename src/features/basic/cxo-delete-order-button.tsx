import ActionBar from '@src/components/ActionBar.vue';
import PrunButton from '@src/components/PrunButton.vue';
import { deleteExchangeOrderFromClick } from '@src/infrastructure/prun-ui/utils/delete-exchange-order';
import { closeTileWindow } from '@src/infrastructure/prun-ui/utils/close-prun-window';

function onTileReady(tile: PrunTile) {
  const orderId = tile.parameter;
  if (!orderId) {
    return;
  }

  const isCX = tile.command === 'CXO';
  const ordersCommand = isCX ? 'CXOS' : 'FXOS';

  const onClick = async (event: MouseEvent) => {
    const success = await deleteExchangeOrderFromClick(event, orderId, ordersCommand);
    if (success) {
      await closeTileWindow(tile);
    }
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
