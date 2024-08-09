import './nots-improve-notifications.css';
import prun from '@src/prun-api/prun';
import PrunCss from '@src/prun-ui/prun-css';
import features from '@src/feature-registry';
import buffers from '@src/prun-ui/prun-buffers';
import { observeDescendantListChanged } from '@src/utils/mutation-observer';
import { h } from 'dom-chef';
import { store } from '@src/prun-api/data/store';
import { selectShips } from '@src/prun-api/data/ships';

function onBufferReady(buffer: PrunBuffer) {
  const notifications = buffer.frame.getElementsByClassName(PrunCss.AlertListItem.content);
  const processed: WeakSet<Element> = new WeakSet();
  observeDescendantListChanged(buffer.frame, () => {
    for (let i = 0; i < notifications.length; i++) {
      const element = notifications[i];
      if (processed.has(element)) {
        continue;
      }

      if (processNotification(element)) {
        processed.add(element);
      }
    }
  });
}

function processNotification(element: Element) {
  // Don't mess with loading notifications
  if (element.textContent?.includes('Loading…')) {
    return false;
  }

  const textElement = element.children[0];
  const textContent = textElement?.textContent;
  if (!textContent) {
    return false;
  }

  for (const search of searchers) {
    const match = textContent.toLowerCase().match(new RegExp(search[0]));
    if (match == null) {
      continue;
    }

    textElement.before(
      <div className="rprun-notification-type" style={{ color: search[2] }}>
        {search[1].toUpperCase()}
      </div>,
    );
    let newText = textContent;
    newText = newText.replace(/Chamber of Global Commerce/, 'COGC');
    switch (search[0]) {
      case 'produced': {
        newText = newText
          .replace(/at your base /, '')
          .replace(/One /, '1 ')
          .replace(/ have been/, '')
          .replace(/ units? of/, '');
        const match = newText.match(/ ([A-z -]+) produced/)?.[1];
        const ticker = prun.materials.getTickerByName(match);
        if (match && ticker) {
          newText = newText.replace(new RegExp(match), ticker);
        }
        break;
      }
      case 'trade': {
        const match = newText.match(/your ([A-z -]+) order/)?.[1];
        const ticker = prun.materials.getTickerByName(match);
        if (match && ticker) {
          newText = newText.replace(new RegExp(match), ticker);
        }
        break;
      }
      case 'order filled': {
        newText = newText.replace(/ Commodity Exchange/, '');
        const match = newText.match(/([A-z -]+) order/)?.[1];
        const ticker = prun.materials.getTickerByName(match);
        if (match && ticker) {
          newText = newText.replace(new RegExp(match), ticker);
        }
        break;
      }
      case 'accepted': {
        newText = newText.replace(/ the/, '').replace(/ local market/, '');
        break;
      }
      case 'contract': {
        newText = newText.replace(/Your partner /, '');
        break;
      }
      case 'arrived at': {
        newText = newText.replace(/its destination /, '');
        const match = newText.match(/AVI-[0-9A-Z]{5}/)?.[0];
        const ships = selectShips(store.getState());
        const ship = ships.find(x => x.registration === match && x.name);
        if (match && ship) {
          newText = newText.replace(match, ship.name);
        }
        break;
      }
      case 'cogc':
      case 'chamber of global commerce': {
        newText = newText.replace(/ a new economic program/, '').replace(/ Advertising Campaign:/, '');
        break;
      }
      case 'population infrastructure project': {
        newText = newText.replace(/population infrastructure/, 'POPI');
        break;
      }
    }
    textElement.textContent = newText;
    break;
  }

  return true;
}

function init() {
  buffers.observe('NOTS', onBufferReady);
}

void features.add({
  id: 'nots-improve-notifications',
  init,
});

// Words to search for, their types, and colors courtesy of Ray K
// Searches must be lower case
const searchers = [
  // German searchers
  ['antrag', 'antrag', '#ffda94'],
  ['vertrag', 'vertrag', 'rgb(247, 166, 0)'],
  ['vertragskondition erfüllt', 'vertrag', 'rgb(247, 166, 0)'],
  ['einladung', 'konzern', '#8f52cc'],
  ['produziert', 'prod', '#3fa2de'],
  ['angenommen', 'anzeige', '#449c57'],
  ['transaktionwurden', 'handel', '#008000'],
  ['transaktionenwurden', 'handel', '#008000'],
  ['order erfüllt', 'order', '#cc2929'],
  ['zielort', 'schiff', '#b336b3'],
  ['bevölkerungsbericht', 'bericht', '#00aa77'],
  ['die wahl', 'wahl', '#ffda94'],
  ['kandidatur', 'parlament', '#ffda94'],
  ['rules', 'rules', '#ffda94'], // Missing
  ['globale handelskammer', 'COGC', '#8f52cc'],
  ['expert', 'expert', '#ff8a00'], // Missing
  ['bevölkerungsinfrastr', 'POPI', '#8f52cc'],
  ['warehous', 'war', '#cc2929'], // Missing
  ['shipbuilding project', 'ship', '#8f52cc'], // Missing
  ['planetary project', 'infra', '#8f52cc'], // Missing
  ['versorgungsgüter', 'erhaltung', '#b37b32'], // Placeholder

  // English searchers
  ['a new motion', 'motion', '#ffda94'],
  ['contract', 'contract', 'rgb(247, 166, 0)'],
  ['our corporation', 'corp', '#8f52cc'],
  ['accepted our invitation', 'corp', '#8f52cc'],
  ['received an invitation', 'corp', '#8f52cc'],
  ['produced', 'produced', '#3fa2de'],
  ['accepted', 'advert', '#449c57'],
  ['expired', 'advert', '#449c57'],
  ['trade', 'trade', '#008000'],
  ['order filled', 'order', '#cc2929'],
  ['arrived at', 'arrival', '#b336b3'],
  ['report', 'report', '#00aa77'],
  ['election', 'election', '#ffda94'],
  ['government has been', 'parliment', '#ffda94'],
  ['your run', 'parliment', '#ffda94'],
  ['rules', 'rules', '#ffda94'],
  ['cogc', 'COGC', '#8f52cc'],
  ['chamber of global commerce', 'COGC', '#8f52cc'],
  ['expert', 'expert', '#ff8a00'],
  ['population infrastructure project', 'POPI', '#8f52cc'],
  ['POPI', 'POPI', '#8f52cc'],
  ['apex', 'update', '#00aa77'],
  ['warehous', 'war', '#cc2929'],
  ['shipbuilding project', 'ship', '#8f52cc'],
  ['planetary project', 'infra', '#8f52cc'],
  ['consumable supplies', 'supplies', '#b37b32'],
  ['motion', 'motion', '#ffda94'],
];
