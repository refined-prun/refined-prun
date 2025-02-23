import ContextRow from './inv-compress-inventory-info.vue';
import css from '@src/utils/css-utils.module.css';

function onTileReady(tile: PrunTile) {
  if (!tile.parameter) {
    return;
  }

  const storeViewRow = tile.anchor.children[0].children[0];

  storeViewRow.classList.add(css.hidden);

  const storeViewColumn = storeViewRow.children[0];

  storeViewColumn.children[1].children[1].children[0].setAttribute('weight', '');
  storeViewColumn.children[2].children[1].children[0].setAttribute('volume', '');

  const store = reactive({
    planetCmd: extractPlanetId(storeViewColumn.children[0].children[0].children[0].innerHTML) || '',
    weight: '',
    weightMax: '',
    volume: '',
    volumeMax: '',
  });

  //set initial values
  store.weight = Number(
    storeViewColumn.children[1].children[1].children[0].getAttribute('value'),
  ).toFixed(2);
  store.weightMax = String(storeViewColumn.children[1].children[1].children[0].getAttribute('max'));
  store.volume = Number(
    storeViewColumn.children[2].children[1].children[0].getAttribute('value'),
  ).toFixed(2);
  store.volumeMax = String(storeViewColumn.children[2].children[1].children[0].getAttribute('max'));

  //monitor for new values and change them accordingly
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if ((mutation.target as HTMLElement).attributes['weight']) {
        store.weight = Number((mutation.target as HTMLElement).attributes['value'].value).toFixed(
          2,
        );
        store.weightMax = String((mutation.target as HTMLElement).attributes['max'].value);
      } else if ((mutation.target as HTMLElement).attributes['volume']) {
        store.volume = Number((mutation.target as HTMLElement).attributes['value'].value).toFixed(
          2,
        );
        store.volumeMax = String((mutation.target as HTMLElement).attributes['max'].value);
      }
    });
  });

  // Start observing the specific element
  observer.observe(storeViewColumn, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  createFragmentApp(ContextRow, store).before(tile.anchor.children[0]);
}

function extractPlanetId(planet: string) {
  if (planet) {
    const split = planet.split(' ');
    return split[split.length - 1].replace('(', '').replace(')', '');
  }
  return '--';
}

function init() {
  tiles.observe('INV', onTileReady);
}

features.add(import.meta.url, init, 'INV: Compresses specific inventory info into a row.');
