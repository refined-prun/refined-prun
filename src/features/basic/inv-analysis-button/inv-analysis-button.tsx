import { getInvStore } from '@src/core/store-id';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { setBufferSize } from '@src/infrastructure/prun-ui/buffers';
import { openCompanionBuffer } from '@src/infrastructure/prun-ui/companion-buffer';
import { onNodeDisconnected } from '@src/utils/on-node-disconnected';
import ContextControlsItem from '@src/components/ContextControlsItem.vue';
import StoSummaryPanel from './StoSummaryPanel.vue';

async function onTileReady(tile: PrunTile) {
  if (!tile.parameter) {
    return;
  }

  const store = computed(() => getInvStore(tile.parameter));
  const site = computed(() => sitesStore.getById(store.value?.addressableId));
  const naturalId = computed(() => getEntityNaturalIdFromAddress(site.value?.address));

  const contextBar = await $(tile.frame, C.ContextControls.container);

  let panelShown = false;

  createFragmentApp(() => {
    if (!naturalId.value) {
      return null;
    }
    return (
      <ContextControlsItem
        cmd={`XIT STO ${naturalId.value}`}
        cmdText="ANALYSIS"
        onClick={() => {
          if (!panelShown) {
            showPanel(tile, naturalId.value!);
            panelShown = true;
          }
        }}
      />
    );
  }).prependTo(contextBar);
}

function showPanel(tile: PrunTile, naturalId: string) {
  const storeContainer = _$(tile.anchor, C.StoreView.container) as HTMLElement | null;
  if (!storeContainer) {
    return;
  }

  // Make anchor a flex column so the panel sits below the store view.
  tile.anchor.style.display = 'flex';
  tile.anchor.style.flexDirection = 'column';
  storeContainer.style.flex = '1';
  storeContainer.style.minHeight = '0';
  storeContainer.style.overflow = 'hidden';

  const panelWrapper = document.createElement('div');
  panelWrapper.style.flexShrink = '0';
  tile.anchor.appendChild(panelWrapper);

  let ro: ResizeObserver | undefined;

  createFragmentApp(StoSummaryPanel, {
    naturalId,
    onExpand: () => {
      ro?.disconnect();
      panelWrapper.remove();
      void openCompanionBuffer(tile, `XIT STO ${naturalId}`, 'below');
    },
  }).appendTo(panelWrapper);

  // Grow a solo floating buffer so the panel doesn't cover existing content.
  if (tile.container.classList.contains(C.Window.body)) {
    const parsedW = parseInt(tile.container.style.width, 10);
    const parsedH = parseInt(tile.container.style.height, 10);
    const w = Number.isNaN(parsedW) ? 600 : parsedW;
    const h = Number.isNaN(parsedH) ? 400 : parsedH;
    let prevPanelHeight = 0;
    ro = new ResizeObserver(() => {
      const panelHeight = panelWrapper.offsetHeight;
      if (panelHeight !== prevPanelHeight) {
        prevPanelHeight = panelHeight;
        setBufferSize(tile.id, w, h + panelHeight);
      }
    });
    ro.observe(panelWrapper);
    onNodeDisconnected(panelWrapper, () => ro?.disconnect());
  }
}

function init() {
  tiles.observe('INV', onTileReady);
}

features.add(
  import.meta.url,
  init,
  'INV: Adds an Analysis button that shows an XIT STO summary pane, expandable to a full companion buffer.',
);
