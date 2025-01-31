import { loadPrunCss } from '@src/infrastructure/prun-ui/prun-css';
import { loadRefinedPrunCss } from '@src/infrastructure/prun-ui/refined-prun-css';
import { loadPrunI18N } from '@src/infrastructure/prun-ui/i18n';
import { trackItemTickers } from '@src/infrastructure/prun-ui/item-tracker';

export function initializeUI() {
  loadPrunCss();
  loadPrunI18N();
  loadRefinedPrunCss();
  trackItemTickers();
}
