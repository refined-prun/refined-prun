import $style from './flt-flex-fuel.module.css';

function init() {
  applyCssRule(['FLT', 'FLTS', 'FLTP'], `.${C.ShipFuel.container}`, $style.fuelFlex);
}

features.add(
  import.meta.url,
  init,
  'FLT: Alows the fuel column layout to better use avaliable space',
);
