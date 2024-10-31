import css from '@src/utils/css-utils.module.css';
import classes from './hide-redundant-info.module.css';
import features from '@src/feature-registry';
import tiles from '@src/infrastructure/prun-ui/tiles';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { computed } from 'vue';
import { extractPlanetName } from '@src/util';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import {
  applyClassCssRule,
  applyScopedClassCssRule,
  applyScopedCssRule,
} from '@src/infrastructure/prun-ui/refined-prun-css';
import { getPrunId, refPrunId } from '@src/infrastructure/prun-ui/attributes';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { watchEffectWhileNodeAlive } from '@src/utils/watch-effect-while-node-alive';
import { localAdsStore } from '@src/infrastructure/prun-api/data/local-ads';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { subscribe } from '@src/utils/subscribe-async-generator';
import { $, $$ } from '@src/utils/select-dom';

function cleanCOGCPEX(tile: PrunTile) {
  // Replace 'view details/vote' with 'vote'
  subscribe($$(tile.anchor, PrunCss.Button.darkInline), button => {
    button.textContent = 'vote';
  });

  // Remove redundant title parts
  subscribe($$(tile.anchor, PrunCss.Link.link), link => {
    if (link.textContent) {
      link.textContent = link
        .textContent!.replace('Advertising Campaign: ', '')
        .replace('Education Events: ', '');
    }
  });
}

function cleanFLT(tile: PrunTile) {
  // Cargo capacity labels
  subscribe($$(tile.anchor, PrunCss.ShipStore.store), div => {
    // div -> div
    const label = div.children[2];
    if (label) {
      label.textContent = (label.textContent || '')
        .replace(/(t|m³)/g, '')
        .replace(/(\d+)([,.]?000)/g, (_, x) => `${x}k`);
    }
  });

  // Shorten planet names
  subscribe($$(tile.anchor, PrunCss.Link.link), link => {
    if (link.textContent) {
      link.textContent = extractPlanetName(link.textContent);
    }
  });

  // Shorten flight status
  subscribe($$(tile.anchor, 'tr'), row => {
    const id = refPrunId(row);
    const ship = computed(() => shipsStore.getById(id.value));
    const flight = computed(() => flightsStore.getById(ship.value?.flightId));

    const labels = {
      TAKE_OFF: '↑',
      DEPARTURE: '↗',
      CHARGE: '±',
      JUMP: '⟿',
      TRANSIT: '⟶',
      APPROACH: '↘',
      LANDING: '↓',
    };

    const statusLabel = computed(() => {
      if (!ship.value) {
        return undefined;
      }

      if (!flight.value) {
        return '⦁';
      }

      const segment = flight.value.segments[flight.value.currentSegmentIndex];
      if (!segment) {
        return undefined;
      }

      return labels[segment.type] ?? undefined;
    });

    function replaceStatus() {
      if (statusLabel.value === undefined) {
        return;
      }
      const statusCell = row.children[3] as HTMLTableCellElement;
      if (!statusCell) {
        return;
      }

      const nodes = Array.from(statusCell.childNodes).filter(
        x => x.nodeType === Node.TEXT_NODE || x.nodeType === Node.ELEMENT_NODE,
      );
      if (nodes.length === 0) {
        return;
      }
      if (statusCell.style.textAlign !== 'center') {
        statusCell.style.textAlign = 'center';
      }
      if (nodes[0].textContent !== statusLabel.value) {
        nodes[0].textContent = statusLabel.value;
      }
      for (const node of nodes.slice(1)) {
        if (node.textContent) {
          node.textContent = '';
        }
      }
    }
    replaceStatus();
    const observer = new MutationObserver(replaceStatus);
    observer.observe(row, { childList: true, subtree: true, characterData: true });
  });
}

function cleanINV(tile: PrunTile) {
  // Only clean the main INV tile
  if (tile.parameter) {
    return;
  }

  // Shorten planet names
  subscribe($$(tile.anchor, PrunCss.Link.link), link => {
    if (link.textContent) {
      link.textContent = extractPlanetName(link.textContent);
    }
  });

  // Shorten storage types
  subscribe($$(tile.anchor, 'tr'), row => {
    const id = refPrunId(row);
    const name = computed(() => {
      const storage = storagesStore.getById(id.value);
      switch (storage?.type) {
        case 'STORE':
          return 'Base';
        case 'WAREHOUSE_STORE':
          return 'WAR';
        case 'SHIP_STORE':
          return 'Ship';
        case 'STL_FUEL_STORE':
          return 'STL';
        case 'FTL_FUEL_STORE':
          return 'FTL';
        default:
          return null;
      }
    });
    watchEffectWhileNodeAlive(row, () => {
      // tr -> td -> span
      const typeLabel = row.firstChild?.firstChild;
      if (typeLabel && name) {
        typeLabel.textContent = name.value;
      }
    });
  });
}

function cleanLM(tile: PrunTile) {
  subscribe($$(tile.anchor, PrunCss.CommodityAd.container), async container => {
    const text = await $(container, PrunCss.CommodityAd.text);
    const id = getPrunId(container);
    const ad = localAdsStore.getById(id);
    if (!ad) {
      return;
    }
    if (ad.type === 'COMMODITY_SHIPPING') {
      cleanShipmentAd(tile, text);
    }
    for (const node of Array.from(text.childNodes)) {
      if (!node.textContent) {
        continue;
      }

      node.textContent = node.textContent.replace('.00', '');
      node.textContent = node.textContent
        .replace(' for ', '')
        .replace('delivery', '')
        .replace('collection', '')
        .replace(' within ', ' in ')
        .replace('for delivery within', 'in');
      node.textContent = node.textContent.replace(/(\d+)\s+days*/i, '$1d');
    }
    cleanContractType(text, ad);
  });
}

function cleanShipmentAd(tile: PrunTile, ad: HTMLElement) {
  // Shorten planet names
  const parameter = tile.parameter;
  for (const link of $$(ad, PrunCss.Link.link)) {
    const planetName = extractPlanetName(link.textContent);
    const planet = planetsStore.find(planetName);
    if (parameter === planetName || parameter === planet?.naturalId) {
      // Hide 'from' links from shipment ads on the same planet/station.
      link.previousSibling!.textContent = '';
      link.style.display = 'none';
      continue;
    }
    link.textContent = planetName;
  }
}

function cleanContractType(text: HTMLElement, ad: PrunApi.LocalAd) {
  if (!text.firstChild) {
    return;
  }
  switch (ad.type) {
    case 'COMMODITY_SHIPPING':
      text.firstChild.textContent = '';
      break;
    case 'COMMODITY_BUYING':
      text.firstChild.textContent = 'BUY';
      break;
    case 'COMMODITY_SELLING':
      text.firstChild.textContent = 'SELL';
      break;
  }
}

export function init() {
  // Hide Exchange column
  applyScopedCssRule('CXOS', 'tr > *:first-child', css.hidden);
  // Hide Transponder column
  applyScopedCssRule('FLT', 'tr > *:first-child', css.hidden);
  // Hide sort options
  applyScopedClassCssRule('SHPF', PrunCss.InventorySortControls.controls, css.hidden);
  // Hide Weight and Volume labels
  applyScopedClassCssRule('SHPF', PrunCss.StoreView.name, css.hidden);
  // Hide item names in inventories
  applyClassCssRule(PrunCss.GridItemView.name, css.hidden);
  // Remove gaps between items in GridView
  applyClassCssRule(PrunCss.GridItemView.container, classes.gridItem);
  // Hide error messages in form components
  // Remove hard-coded ones when molp fixes class duplication
  applyClassCssRule(PrunCss.FormComponent.containerError, classes.containerError);
  applyClassCssRule('FormComponent__containerError___pN__L1Q', classes.containerError);
  applyClassCssRule(PrunCss.FormComponent.errorMessage, css.hidden);
  applyClassCssRule('FormComponent__errorMessage___mBdvpz5', css.hidden);
  tiles.observe('COGCPEX', cleanCOGCPEX);
  tiles.observe('FLT', cleanFLT);
  tiles.observe('INV', cleanINV);
  tiles.observe('LM', cleanLM);
}

void features.add({
  id: 'hide-redundant-info',
  init,
});
