import './hide-redundant-info.css';
import features from '@src/feature-registry';
import buffers from '@src/infrastructure/prun-ui/prun-buffers';
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

function cleanCOGCPEX(buffer: PrunBuffer) {
  // Replace 'view details/vote' with 'vote'
  observeReadyElementsByClassName(PrunCss.Button.darkInline, {
    baseElement: buffer.frame,
    callback: button => {
      button.textContent = 'vote';
    },
  });

  // Remove redundant title parts
  observeReadyElementsByClassName(PrunCss.Link.link, {
    baseElement: buffer.frame,
    callback: link => {
      if (link.textContent) {
        link.textContent = link
          .textContent!.replace('Advertising Campaign: ', '')
          .replace('Education Events: ', '');
      }
    },
  });
}

function cleanFLT(buffer: PrunBuffer) {
  // Cargo capacity labels
  observeReadyElementsByClassName(PrunCss.ShipStore.store, {
    baseElement: buffer.frame,
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
    baseElement: buffer.frame,
    callback: link => {
      if (link.textContent) {
        link.textContent = extractPlanetName(link.textContent);
      }
    },
  });

  // Shorten flight status
  observeReadyElementsByTagName('tr', {
    baseElement: buffer.frame,
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

function cleanINV(buffer: PrunBuffer) {
  // Only clean the main INV buffer
  if (buffer.parameter) {
    return;
  }

  // Shorten planet names
  observeReadyElementsByClassName(PrunCss.Link.link, {
    baseElement: buffer.frame,
    callback: link => {
      if (link.textContent) {
        link.textContent = extractPlanetName(link.textContent);
      }
    },
  });

  // Shorten storage types
  observeReadyElementsByTagName('tr', {
    baseElement: buffer.frame,
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

function cleanLM(buffer: PrunBuffer) {
  observeReadyElementsByClassName(PrunCss.CommodityAd.text, {
    baseElement: buffer.frame,
    callback: ad => {
      if (ad.firstChild?.textContent === 'SHIPPING') {
        cleanShipmentAd(buffer, ad);
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

function cleanShipmentAd(buffer: PrunBuffer, ad: HTMLElement) {
  // Shorten planet names
  const links = _$$(PrunCss.Link.link, ad) as HTMLDivElement[];
  const parameter = buffer.parameter;
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
  applyScopedCssRule('CXOS', 'tr > *:first-child', 'first-column');
  // Hide Transponder column
  applyScopedCssRule('FLT', 'tr > *:first-child', 'first-column');
  // Hide sort options
  applyScopedClassCssRule('SHPF', PrunCss.InventorySortControls.controls, 'inventory-controls');
  // Hide Weight and Volume labels
  applyScopedClassCssRule('SHPF', PrunCss.StoreView.name, 'store-name');
  buffers.observe('COGCPEX', cleanCOGCPEX);
  buffers.observe('FLT', cleanFLT);
  buffers.observe('INV', cleanINV);
  buffers.observe('LM', cleanLM);
}

void features.add({
  id: 'hide-redundant-info',
  init,
  attribute: true,
});
