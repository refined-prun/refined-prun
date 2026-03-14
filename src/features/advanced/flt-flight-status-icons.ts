import { PrunI18N } from '@src/infrastructure/prun-ui/i18n';
import { shipStatusI18nIconReplacements } from '@src/core/ship-status-icons';
import $style from './flt-flight-status-icons.module.css';

function init() {
  for (const { key, icon } of shipStatusI18nIconReplacements) {
    PrunI18N[key] = [
      {
        type: 0,
        value: icon,
      },
    ];
  }
  applyCssRule(['FLT', 'FLTS', 'FLTP'], `td:nth-child(4)`, $style.status);
}

features.add(import.meta.url, init, 'FLT: Replaces the flight status text with arrow icons.');
