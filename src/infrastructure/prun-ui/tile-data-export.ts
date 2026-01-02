import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { downloadJson } from '@src/utils/json-file';
import { userData } from '@src/store/user-data';
import { uiDataStore } from '@src/infrastructure/prun-api/data/ui-data';
import { deepToRaw } from '@src/utils/deep-to-raw';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { contractsStore } from '@src/infrastructure/prun-api/data/contracts';
import { contractDraftsStore } from '@src/infrastructure/prun-api/data/contract-drafts';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { blueprintsStore } from '@src/infrastructure/prun-api/data/blueprints';
import { workforcesStore } from '@src/infrastructure/prun-api/data/workforces';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { cxobStore } from '@src/infrastructure/prun-api/data/cxob';
import { cxosStore } from '@src/infrastructure/prun-api/data/cxos';
import { getInvStore } from '@src/core/store-id';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { alertsStore } from '@src/infrastructure/prun-api/data/alerts';
import { shipyardProjectsStore } from '@src/infrastructure/prun-api/data/shipyard-projects';

export function initTileDataExport() {
  subscribe($$(document, C.TileFrame.cmd), cmd => {
    cmd.addEventListener('click', e => {
      if (e.altKey) {
        const tile = cmd.closest(`.${C.Tile.tile}`) as HTMLElement;
        exportTileData(tile, cmd.textContent!.trim());
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      return true;
    });
  });
}

function exportTileData(el: HTMLElement, command: string) {
  const id = getPrunId(el);
  if (!id) {
    return;
  }
  const data = {
    id,
    command,
    state: {
      game: uiDataStore.tileStates.find(x => x.containerId === id) ?? {},
      rprun: userData.tileState[id] ?? {},
    },
    data: deepToRaw(getTileData(command)),
  };
  downloadJson(data, `${data.command} ${id}.json`);
}

function getTileData(command: string): object {
  command = command.toUpperCase();

  if (command.startsWith('BBL ')) {
    const id = command.replace('BBL ', '').trim();
    return {
      buildings: sitesStore.getById(id)?.platforms,
    };
  }

  if (command.startsWith('BLU ')) {
    const id = command.replace('BLU ', '').trim();
    if (id) {
      return {
        blueprint: blueprintsStore.getByNaturalId(id),
      };
    }
    return {
      blueprints: blueprintsStore.all.value,
    };
  }

  if (command.startsWith('BS ')) {
    const naturalId = command.replace('BS ', '').trim();
    if (naturalId) {
      const site = sitesStore.getByPlanetNaturalId(naturalId);
      return {
        site,
        workforce: workforcesStore.getById(site?.siteId),
        production: productionStore.getBySiteId(site?.siteId),
      };
    }
    return {
      sites: sitesStore.all.value,
      workforce: workforcesStore.all.value,
      production: productionStore.all.value,
    };
  }

  if (command.startsWith('CONTD ')) {
    const id = command.replace('CONTD ', '').trim();
    if (id) {
      return {
        draft: contractDraftsStore.getByNaturalId(id),
      };
    }
    return {
      drafts: contractDraftsStore.all.value,
    };
  }

  if (command.startsWith('CONTS')) {
    return {
      contracts: contractsStore.all.value,
    };
  }

  if (command.startsWith('XIT CONTS')) {
    let contracts = contractsStore.all.value;
    if (contracts) {
      contracts = contracts.filter(
        x =>
          x.status === 'OPEN' ||
          x.status === 'CLOSED' ||
          x.status === 'PARTIALLY_FULFILLED' ||
          x.status === 'DEADLINE_EXCEEDED',
      );
    }
    return {
      contracts: contracts,
    };
  }

  if (command.startsWith('CONT ')) {
    const id = command.replace('CONT ', '').trim();
    return {
      contract: contractsStore.getByLocalId(id),
    };
  }

  if (command.startsWith('CXOB ')) {
    const ticker = command.replace('CXOB ', '').trim();
    return {
      orderBook: cxobStore.getByTicker(ticker),
    };
  }

  if (command.startsWith('CXOS')) {
    return {
      orders: cxosStore.all.value,
    };
  }

  if (command.startsWith('CXPO ')) {
    const ticker = command.replace('CXPO ', '').trim();
    return {
      orderBook: cxobStore.getByTicker(ticker),
    };
  }

  if (command.startsWith('FLT')) {
    return {
      ships: shipsStore.all.value,
      flights: flightsStore.all.value,
    };
  }

  if (command.startsWith('INV ')) {
    const parameter = command.replace('INV ', '').trim();
    if (parameter) {
      return {
        store: getInvStore(parameter),
      };
    }
    return {
      stores: storagesStore.all.value,
    };
  }

  if (command.startsWith('NOTS')) {
    return {
      alerts: alertsStore.all.value,
    };
  }

  if (command.startsWith('PROD ')) {
    const id = command.replace('PROD ', '').trim();
    if (id) {
      return {
        production: productionStore.getBySiteId(id),
      };
    }
    return {
      production: productionStore.all.value,
    };
  }

  if (command.startsWith('SHP ')) {
    const id = command.replace('SHP ', '').trim();
    return {
      ship: shipsStore.getByRegistration(id),
    };
  }

  if (command.startsWith('SHYP ')) {
    const id = command.replace('SHYP ', '').trim();
    if (id) {
      return {
        project: shipyardProjectsStore.getById(id),
      };
    }
    return {
      projects: shipyardProjectsStore.all.value,
    };
  }

  if (command.startsWith('WF ')) {
    const id = command.replace('WF ', '').trim();
    return {
      workforce: workforcesStore.getById(id),
    };
  }

  return {};
}
