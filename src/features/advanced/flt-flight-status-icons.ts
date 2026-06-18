import $style from './flt-flight-status-icons.module.css';

function init() {
  applyLocalizationPatch(L.ships.status.stationary, () => '⦁');
  applyLocalizationPatch(L.ShipStatus.takeoff, () => '↑');
  applyLocalizationPatch(L.ShipStatus.departure, () => '↗');
  applyLocalizationPatch(L.ShipStatus.transit, () => '⟶');
  applyLocalizationPatch(L.ShipStatus.charge, () => '±');
  applyLocalizationPatch(L.ShipStatus.jump, () => '➾');
  applyLocalizationPatch(L.ShipStatus.float, () => '↑');
  applyLocalizationPatch(L.ShipStatus.approach, () => '↘');
  applyLocalizationPatch(L.ShipStatus.landing, () => '↓');
  applyLocalizationPatch(L.ShipStatus.lock, () => '⟴');
  applyLocalizationPatch(L.ShipStatus.decay, () => '⟴');
  applyLocalizationPatch(L.ShipStatus.jumpgateway, () => '⟴');
  applyCssRule(['FLT', 'FLTS', 'FLTP'], `td:nth-child(4)`, $style.status);
}

features.add(import.meta.url, init, 'FLT: Replaces the flight status text with arrow icons.');
