import PrunCss, { loadPrunCss } from '@src/infrastructure/prun-ui/prun-css';
import { loadRefinedPrunCss } from '@src/infrastructure/prun-ui/refined-prun-css';
import { readPrunI18N } from '@src/infrastructure/prun-ui/i18n';
import { overrideIconColorStyle } from '@src/infrastructure/prun-ui/icon-color-override';

export async function initializeUI() {
  await loadPrunCss();
  await $(document.documentElement, PrunCss.App.container);
  overrideIconColorStyle();
  await Promise.all([loadRefinedPrunCss(), readPrunI18N()]);
}
