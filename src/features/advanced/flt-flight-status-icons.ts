import { PrunI18N } from '@src/infrastructure/prun-ui/i18n';
import $style from './flt-flight-status-icons.module.css';

function init() {
  const replacements = [
    {
      key: 'ShipStatus.takeoff',
      icon: '↑',
    },
    {
      key: 'ShipStatus.departure',
      icon: '↗',
    },
    {
      key: 'ShipStatus.transit',
      icon: '⟶',
    },
    {
      key: 'ShipStatus.charge',
      icon: '±',
    },
    {
      key: 'ShipStatus.jump',
      icon: '➾',
    },
    {
      key: 'ShipStatus.float',
      icon: '↑',
    },
    {
      key: 'ShipStatus.approach',
      icon: '↘',
    },
    {
      key: 'ShipStatus.landing',
      icon: '↓',
    },
    {
      key: 'ShipStatus.lock',
      icon: '⟴',
    },
    {
      key: 'ShipStatus.decay',
      icon: '⟴',
    },
    {
      key: 'ShipStatus.jumpgateway',
      icon: '⟴',
    },
  ];
  for (const { key, icon } of replacements) {
    const localized = PrunI18N[key]?.[0];
    if (localized) {
      localized.value = icon;
    }
  }
  applyCssRule(['FLT', 'FLTS', 'FLTP'], `td:nth-child(4)`, $style.status);
}

features.add(import.meta.url, init, 'FLT: Replaces the flight status text with arrow icons.');
