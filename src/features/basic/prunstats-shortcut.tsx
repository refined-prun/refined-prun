import PrunButton from '@src/components/PrunButton.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import fa from '@src/utils/font-awesome.module.css';

function onCoReady(tile: PrunTile) {
  subscribe($$(tile.anchor, C.FormComponent.containerPassive), async row => {
    // Return if the field is not the 'Managing Director' (8th) Field.
    if (row.parentElement?.children[7] != row) {
      return;
    }
    const usernameField = await $(row, C.StaticInput.static);
    const username = usernameField.textContent.trim();
    if (!username) {
      return;
    }
    createFragmentApp(() => (
      <>
        <br />
        <PrunButton
          primary
          inline
          onClick={() =>
            showBuffer(
              `XIT PRUNSTATS_type-compTotals_chartType-treemap_metric-volume_companyName-${username}_hideOptions`,
            )
          }>
          <span class={[fa.solid]}>{'\uf275'}</span>
          Prod.
        </PrunButton>
        <PrunButton
          primary
          inline
          onClick={() =>
            showBuffer(
              `XIT PRUNSTATS_type-compHistory_metric-volume_companyName-${username}_hideOptions`,
            )
          }>
          <span class={[fa.solid]}>{'\ue0e3'}</span>
          Hist.
        </PrunButton>
      </>
    )).appendTo(usernameField!);
  });
}

function onUsrReady(tile: PrunTile) {
  const username = tile.parameter?.trim();
  if (username) {
    subscribe($$(tile.frame, C.ContextControls.container), contextControls => {
      createFragmentApp(() => (
        <>
          <div
            class={[C.ContextControls.item, C.fonts.fontRegular, C.type.typeSmall]}
            onClick={() =>
              showBuffer(
                `XIT PRUNSTATS_type-compTotals_chartType-treemap_metric-volume_companyName-${username}_hideOptions`,
              )
            }>
            <span class={[fa.solid]}>{'\uf275'}</span>
            Prod.
          </div>
          <div
            class={[C.ContextControls.item, C.fonts.fontRegular, C.type.typeSmall]}
            onClick={() =>
              showBuffer(
                `XIT PRUNSTATS_type-compHistory_metric-volume_companyName-${username}_hideOptions`,
              )
            }>
            <span class={[fa.solid]}>{'\ue0e3'}</span>
            Hist.
          </div>
        </>
      )).prependTo(contextControls);
    });
  }
}

function init() {
  tiles.observe(['CO'], onCoReady);
  tiles.observe(['USR'], onUsrReady);
}

features.add(
  import.meta.url,
  init,
  'CO, USR: Adds shortcuts to PMMG-Product (XIT PRUNSTAT) graphs',
);
