import getMapArray from '@src/utils/get-map-array';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { castArray } from '@src/utils/cast-array';
import { observeChildListChanged } from '@src/utils/mutation-observer';
import onetime from 'onetime';
import observeDocumentMutations from '@src/utils/document-mutation-observer';
import removeArrayElement from '@src/utils/remove-array-element';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';

interface PrunTileObserver {
  (tile: PrunTile): void;
}

const activeTiles: PrunTile[] = [];
const commandObservers: Map<string, PrunTileObserver[]> = new Map();
const anyCommandObservers: PrunTileObserver[] = [];

const setupObserver = onetime(() => {
  observeDocumentMutations(reconciliate);
});

function reconciliate() {
  for (const tile of activeTiles) {
    if (!tile.frame.isConnected) {
      deactivateTile(tile);
    }
  }

  const frameElements = document.getElementsByClassName(
    PrunCss.TileFrame.frame,
  ) as HTMLCollectionOf<HTMLDivElement>;
  if (frameElements.length === activeTiles.length) {
    let sameTiles = true;
    for (let i = 0; i < frameElements.length; i++) {
      if (activeTiles[i].frame !== frameElements[i]) {
        sameTiles = false;
        break;
      }
    }
    if (sameTiles) {
      return;
    }
  }

  const newFrames: Set<HTMLDivElement> = new Set();

  for (let i = 0; i < frameElements.length; i++) {
    newFrames.add(frameElements[i]);
  }
  for (const tile of activeTiles) {
    newFrames.delete(tile.frame);
  }

  for (const frame of newFrames) {
    const anchor = frame.getElementsByClassName(PrunCss.TileFrame.anchor)[0];
    if (anchor?.children.length === 0) {
      continue;
    }

    activateFrame(frame, anchor);
  }
}

function activateFrame(frame: HTMLDivElement, anchor: Element) {
  const id = getPrunId(frame.parentElement!)!;
  const commandElement = frame.getElementsByClassName(PrunCss.TileFrame.cmd)[0];
  const fullCommand = commandElement.textContent!;
  const indexOfSpace = fullCommand.indexOf(' ');
  const tile: PrunTile = {
    id,
    frame,
    fullCommand,
    command: (indexOfSpace > 0 ? fullCommand.slice(0, indexOfSpace) : fullCommand).toUpperCase(),
    parameter: indexOfSpace > 0 ? fullCommand.slice(indexOfSpace + 1) : undefined,
    firstActivation: true,
  };
  frame.setAttribute('data-rp-command', tile.command);
  activateTile(tile);

  observeChildListChanged(anchor, () => {
    if (anchor.children.length === 0) {
      deactivateTile(tile);
    }
  });
}

function activateTile(tile: PrunTile) {
  if (activeTiles.includes(tile)) {
    return;
  }

  activeTiles.push(tile);
  for (const observer of getMapArray(commandObservers, tile.command)) {
    observer(tile);
  }
  for (const observer of anyCommandObservers) {
    observer(tile);
  }
  tile.firstActivation = false;
}

function deactivateTile(tile: PrunTile) {
  if (!activeTiles.includes(tile)) {
    return;
  }

  removeArrayElement(activeTiles, tile);
}

function observeTiles(commands: Arrayable<string>, observer: PrunTileObserver) {
  setupObserver();
  for (let command of castArray(commands)) {
    command = command.toUpperCase();
    const observers = getMapArray(commandObservers, command);
    observers.push(observer);
    for (const tile of activeTiles) {
      if (tile.command === command) {
        observer(tile);
      }
    }
  }
}

function observeAllTiles(observer: PrunTileObserver) {
  setupObserver();
  anyCommandObservers.push(observer);
  for (const tile of activeTiles) {
    observer(tile);
  }
}

function findTiles(command: string) {
  return activeTiles.filter(tile => tile.fullCommand === command);
}

const tiles = {
  observe: observeTiles,
  observeAll: observeAllTiles,
  find: findTiles,
};

export default tiles;
