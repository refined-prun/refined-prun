import classes from './hide-redundant-info.module.css';
import features from '@src/feature-registry';
import tiles from '@src/infrastructure/prun-ui/tiles';
import {
  observeReadyElementsByClassName,
  observeReadyElementsByTagName,
} from '@src/utils/mutation-observer';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import { computed, reactive } from 'vue';
import { refTextContent } from '@src/utils/reactive-dom';
import ShipStatusLabel from './ShipStatusLabel.vue';
import { extractPlanetName } from '@src/util';
import { _$, _$$ } from '@src/utils/get-element-by-class-name';
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
        createFragmentApp(
          ShipStatusLabel,
          reactive({
            shipRegistration: refTextContent(row.children[0]),
          }),
        ).after(status);
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
    },
  });
}

function cleanLM(tile: PrunTile) {
  observeReadyElementsByClassName(PrunCss.CommodityAd.container, {
    baseElement: tile.frame,
    callback: container => {
      const text = _$(PrunCss.CommodityAd.text, container);
      if (!text) {
        return;
      }
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
    },
  });
}

function cleanShipmentAd(tile: PrunTile, ad: HTMLElement) {
  // Shorten planet names
  const links = _$$(PrunCss.Link.link, ad) as HTMLDivElement[];
  const parameter = tile.parameter;
  for (const link of links) {
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
  applyScopedCssRule('CXOS', 'tr > *:first-child', classes.hide);
  // Hide Transponder column
  applyScopedCssRule('FLT', 'tr > *:first-child', classes.hide);
  // Hide sort options
  applyScopedClassCssRule('SHPF', PrunCss.InventorySortControls.controls, classes.hide);
  // Hide Weight and Volume labels
  applyScopedClassCssRule('SHPF', PrunCss.StoreView.name, classes.hide);
  // Hide item names in inventories
  applyClassCssRule(PrunCss.GridItemView.name, classes.hide);
  // Remove gaps between items in GridView
  applyClassCssRule(PrunCss.GridItemView.container, classes.gridItem);
  // Hide error messages in form components
  // Remove hard-coded ones when molp fixes class duplication
  applyClassCssRule(PrunCss.FormComponent.containerError, classes.containerError);
  applyClassCssRule('FormComponent__containerError___pN__L1Q', classes.containerError);
  applyClassCssRule(PrunCss.FormComponent.errorMessage, classes.hide);
  applyClassCssRule('FormComponent__errorMessage___mBdvpz5', classes.hide);
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
