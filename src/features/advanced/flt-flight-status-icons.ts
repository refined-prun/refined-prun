import $style from './flt-flight-status-icons.module.css';
import { LiteralElement } from '@formatjs/icu-messageformat-parser';
import { LiteralLocalizationLeaf } from '@src/infrastructure/prun-ui/i18n';

function init() {
  const replace = (message: LiteralLocalizationLeaf, icon: string) => {
    const localized = message.getFormat().getAst()[0] as LiteralElement | undefined;
    if (localized) {
      localized.value = icon;
    }
  };
  replace(L.ships.status.stationary, '⦁');
  replace(L.ShipStatus.takeoff, '↑');
  replace(L.ShipStatus.departure, '↗');
  replace(L.ShipStatus.transit, '⟶');
  replace(L.ShipStatus.charge, '±');
  replace(L.ShipStatus.jump, '➾');
  replace(L.ShipStatus.float, '↑');
  replace(L.ShipStatus.approach, '↘');
  replace(L.ShipStatus.landing, '↓');
  replace(L.ShipStatus.lock, '⟴');
  replace(L.ShipStatus.decay, '⟴');
  replace(L.ShipStatus.jumpgateway, '⟴');
  applyCssRule(['FLT', 'FLTS', 'FLTP'], `td:nth-child(4)`, $style.status);
}

features.add(import.meta.url, init, 'FLT: Replaces the flight status text with arrow icons.');
