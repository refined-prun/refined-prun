import './hide-redundant-info.css';
import features from '@src/feature-registry';
import buffers from '@src/prun-ui/prun-buffers';
import {
  observeReadyElementsByClassName,
  observeReadyElementsByTagName,
} from '@src/utils/mutation-observer';
import PrunCss from '@src/prun-ui/prun-css';
import { Stations } from '@src/GameProperties';
import { widgetAfter } from '@src/utils/vue-mount';
import { reactive } from 'vue';
import { refTextContent } from '@src/utils/reactive-dom';
import ShipStatusLabel from '@src/features/hide-redundant-info/ShipStatusLabel.vue';

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
        link.textContent = cleanPlanetName(link.textContent);
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
  // Only clean INV buffers with no other parameters
  if (buffer.parameter) {
    return;
  }

  // Shorten planet names
  observeReadyElementsByClassName(PrunCss.Link.link, {
    baseElement: buffer.frame,
    callback: link => {
      if (link.textContent) {
        link.textContent = cleanPlanetName(link.textContent);
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

function cleanPlanetName(text: string) {
  text = text
    // Clear parenthesis
    .replace(/\s*\([^)]*\)/, '')
    // Clear space between system and planet
    .replace(/(\d)\s+(?=[a-zA-Z])/, '$1')
    // Clear system name in named systems
    .replace(/.*\s-\s/, '');
  return Stations[text] ?? text;
}

const cleanINVNames = {
  'Cargo hold': 'Ship',
  'Base storage': 'Base',
  'Warehouse unit': 'WAR',
  'STL fuel tank': 'STL',
  'FTL fuel tank': 'FTL',
};

export function init() {
  buffers.observe('COGCPEX', cleanCOGCPEX);
  buffers.observe('FLT', cleanFLT);
  buffers.observe('INV', cleanINV);
}

void features.add({
  id: 'hide-redundant-info',
  init,
  attribute: true,
});
