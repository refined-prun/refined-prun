import classes from './hide-redundant-info.module.css';
import features from '@src/feature-registry';
import tiles from '@src/infrastructure/prun-ui/tiles';
import {
  observeReadyElementsByClassName,
  observeReadyElementsByTagName,
} from '@src/utils/mutation-observer';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { widgetAfter } from '@src/utils/vue-mount';
import { reactive } from 'vue';
import { refTextContent } from '@src/utils/reactive-dom';
import ShipStatusLabel from './ShipStatusLabel.vue';
import { extractPlanetName } from '@src/util';
import { _$$ } from '@src/utils/get-element-by-class-name';
import { planetsStore } from '@src/infrastructure/prun-api/data/planets';
import {
  applyScopedClassCssRule,
  applyScopedCssRule,
} from '@src/infrastructure/prun-ui/refined-prun-css';

function cleanCOGCPEX(tile: PrunTile) {
  // Replace 'view details/vote' with 'vote'
  observeReadyElementsByClassName(PrunCss.Button.darkInline, {
    baseElement: tile.frame,
    callback: button => {
      button.textContent = 'vote';
    },
  });

  // Remove redundant title parts
  observeReadyElementsByClassName(PrunCss.Link.link, {
    baseElement: tile.frame,
    callback: link => {
      if (link.textContent) {
        link.textContent = link
          .textContent!.replace('Advertising Campaign: ', '')
          .replace('Education Events: ', '');
      }
    },
  });
}

function cleanFLT(tile: PrunTile) {
  // Cargo capacity labels
  observeReadyElementsByClassName(PrunCss.ShipStore.store, {
    baseElement: tile.frame,
    callback: div => {
      // div -> div
      const label = div.children[2];
      if (label) {
        label.textContent = (label.textContent || '')
          .replace(/(t|m³)/g, '')
          .replace(/(\d+)([,.]?000)/g, (_, x) => `${x}k`);
      }
    },
  });

  // Shorten planet names
  observeReadyElementsByClassName(PrunCss.Link.link, {
    baseElement: tile.frame,
    callback: link => {
      if (link.textContent) {
        link.textContent = extractPlanetName(link.textContent);
      }
    },
  });

  // Shorten flight status
  observeReadyElementsByTagName('tr', {
    baseElement: tile.frame,
    callback: row => {
      const status = row.children[3]?.children[0] as HTMLDivElement;
      if (status) {
        status.style.display = 'none';
        widgetAfter(
          status,
          ShipStatusLabel,
          reactive({
            shipRegistration: refTextContent(row.children[0]),
          }),
        );
      }
    },
  });
}

function cleanINV(tile: PrunTile) {
  // Only clean the main INV tile
  if (tile.parameter) {
    return;
  }

  // Shorten planet names
  observeReadyElementsByClassName(PrunCss.Link.link, {
    baseElement: tile.frame,
    callback: link => {
      if (link.textContent) {
        link.textContent = extractPlanetName(link.textContent);
      }
    },
  });

  // Shorten storage types
  observeReadyElementsByTagName('tr', {
    baseElement: tile.frame,
    callback: row => {
      // tr -> td -> span
      const typeLabel = row.firstChild?.firstChild;
      const type = typeLabel?.textContent;
      if (type && cleanINVNames[type]) {
        typeLabel.textContent = cleanINVNames[type];
      }
    },
  });
}

const cleanINVNames = {
  'Cargo hold': 'Ship',
  'Base storage': 'Base',
  'Warehouse unit': 'WAR',
  'STL fuel tank': 'STL',
  'FTL fuel tank': 'FTL',
};

function cleanLM(tile: PrunTile) {
  observeReadyElementsByClassName(PrunCss.CommodityAd.text, {
    baseElement: tile.frame,
    callback: ad => {
      if (ad.firstChild?.textContent === 'SHIPPING') {
        cleanShipmentAd(tile, ad);
      }
      for (const node of Array.from(ad.childNodes)) {
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
      cleanContractType(ad);
    },
  });
}

function cleanShipmentAd(tile: PrunTile, ad: HTMLElement) {
  // Shorten planet names
  const links = _$$(PrunCss.Link.link, ad) as HTMLDivElement[];
  const parameter = tile.parameter;
  for (const link of links) {
    const planetName = extractPlanetName(link.textContent);
    const planet = planetsStore.getByIdOrName(planetName);
    if (parameter === planetName || parameter === planet?.naturalId) {
      // Hide 'from' links from shipment ads on the same planet/station.
      link.previousSibling!.textContent = '';
      link.style.display = 'none';
      continue;
    }
    link.textContent = planetName;
  }
}

function cleanContractType(ad: HTMLElement) {
  switch (ad.firstChild?.textContent) {
    case 'SHIPPING':
      ad.firstChild.textContent = '';
      break;
    case 'BUYING':
      ad.firstChild.textContent = 'BUY';
      break;
    case 'SELLING':
      ad.firstChild.textContent = 'SELL';
      break;
  }
}

export function init() {
  // Hide Exchange column
  applyScopedCssRule('CXOS', 'tr > *:first-child', classes.hide);
  // Hide Transponder column
  applyScopedCssRule('FLT', 'tr > *:first-child', classes.hide);
  // Hide sort options
  applyScopedClassCssRule('SHPF', PrunCss.InventorySortControls.controls, classes.hide);
  // Hide Weight and Volume labels
  applyScopedClassCssRule('SHPF', PrunCss.StoreView.name, classes.hide);
  tiles.observe('COGCPEX', cleanCOGCPEX);
  tiles.observe('FLT', cleanFLT);
  tiles.observe('INV', cleanINV);
  tiles.observe('LM', cleanLM);
}

void features.add({
  id: 'hide-redundant-info',
  init,
  attribute: true,
});
