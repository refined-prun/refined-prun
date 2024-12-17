import { loadPrunCss } from '@src/infrastructure/prun-ui/prun-css';
import { loadRefinedPrunCss } from '@src/infrastructure/prun-ui/refined-prun-css';
import { readPrunI18N } from '@src/infrastructure/prun-ui/i18n';
import { trackItemTickers } from '@src/infrastructure/prun-ui/item-tracker';

export async function initializeUI() {
  await loadPrunCss();
  await $(document.documentElement, C.App.container);
  loadRefinedPrunCss();
  trackItemTickers();
  await readPrunI18N();
}
