import { loadPrunCss } from '@src/infrastructure/prun-ui/prun-css';
import { loadRefinedPrunCss } from '@src/infrastructure/prun-ui/refined-prun-css';
import { loadPrunI18N } from '@src/infrastructure/prun-ui/i18n';
import { trackItemTickers } from '@src/infrastructure/prun-ui/item-tracker';
import { tagUI } from '@src/infrastructure/prun-ui/tagger';
import { initTileDataExport } from '@src/infrastructure/prun-ui/tile-data-export';
import { initRenderErrorWarning } from '@src/infrastructure/prun-ui/render-error-warning';

export async function initializeUI() {
  await loadPrunCss();
  loadPrunI18N();
  initRenderErrorWarning();
  loadRefinedPrunCss();
  tagUI();
  trackItemTickers();
  initTileDataExport();
}
