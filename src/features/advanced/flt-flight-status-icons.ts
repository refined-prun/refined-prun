import $style from './flt-flight-status-icons.module.css';
import IntlMessageFormat from 'intl-messageformat';
import { LiteralElement } from '@formatjs/icu-messageformat-parser';

function init() {
  const replace = (message: { imf: IntlMessageFormat }, icon: string) => {
    const localized = message.imf.getAst()[0] as LiteralElement | undefined;
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
