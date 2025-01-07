import getMapArray from '@src/utils/get-map-array';
import { castArray } from '@src/utils/cast-array';
import onetime from 'onetime';
import { onNodeTreeMutation } from '@src/utils/on-node-tree-mutation';
import removeArrayElement from '@src/utils/remove-array-element';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import onNodeDisconnected from '@src/utils/on-node-disconnected';
import { matchBufferSize } from '@src/infrastructure/prun-ui/buffer-sizes';
import { setBufferSize } from '@src/infrastructure/prun-ui/buffers';

interface PrunTileObserver {
  (tile: PrunTile): void;
}

const pastWindows: WeakSet<Element> = new WeakSet();
const activeTiles: PrunTile[] = [];
const commandObservers: Map<string, PrunTileObserver[]> = new Map();
const anyCommandObservers: PrunTileObserver[] = [];

const setupObserver = onetime(() => onNodeTreeMutation(document, reconciliate));

function reconciliate(mutations: MutationRecord[]) {
  if (mutations.some(x => x.removedNodes.length > 0)) {
    for (const tile of activeTiles) {
      if (!tile.frame.isConnected) {
        deactivateTile(tile);
      }
    }
  }

  if (mutations.every(x => x.addedNodes.length === 0)) {
    return;
  }

  const frameElements = document.getElementsByClassName(C.TileFrame.frame);
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

  const newFrames: Set<Element> = new Set();

  for (let i = 0; i < frameElements.length; i++) {
    newFrames.add(frameElements[i]);
  }
  for (const tile of activeTiles) {
    newFrames.delete(tile.frame);
  }

  for (const frame of newFrames) {
    const anchor = _$(frame, C.TileFrame.anchor);
    if (!anchor) {
      continue;
    }

    activateFrame(frame as HTMLDivElement, anchor as HTMLDivElement);
  }
}

function activateFrame(frame: HTMLDivElement, anchor: HTMLDivElement) {
  const tileElement = frame.parentElement!;
  const container = tileElement.parentElement!;
  const docked = !container.classList.contains(C.Window.body);
  const id = getPrunId(tileElement)!;
  const commandElement = _$(frame, C.TileFrame.cmd);
  const fullCommand = commandElement!.textContent!.trim();
  const indexOfSpace = fullCommand.indexOf(' ');
  const tile: PrunTile = {
    id,
    container,
    frame,
    anchor,
    docked,
    fullCommand,
    command: (indexOfSpace > 0 ? fullCommand.slice(0, indexOfSpace) : fullCommand).toUpperCase(),
    parameter: indexOfSpace > 0 ? fullCommand.slice(indexOfSpace + 1) : undefined,
  };
  frame.setAttribute('data-rp-command', tile.command);
  activateTile(tile);
  onNodeDisconnected(frame, () => deactivateTile(tile));
  if (!docked && !pastWindows.has(container)) {
    pastWindows.add(container);
    const size = matchBufferSize(fullCommand);
    if (size) {
      setBufferSize(id, size[0], size[1]);
    }
  }
}

function activateTile(tile: PrunTile) {
  if (activeTiles.includes(tile)) {
    return;
  }

  activeTiles.push(tile);
  for (const observer of getMapArray(commandObservers, tile.command)) {
    runObserver(observer, tile);
  }
  for (const observer of anyCommandObservers) {
    runObserver(observer, tile);
  }
}

function runObserver(observer: PrunTileObserver, tile: PrunTile) {
  try {
    observer(tile);
  } catch (error) {
    console.error(error);
  }
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
        runObserver(observer, tile);
      }
    }
  }
}

function observeAllTiles(observer: PrunTileObserver) {
  setupObserver();
  anyCommandObservers.push(observer);
  for (const tile of activeTiles) {
    runObserver(observer, tile);
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
