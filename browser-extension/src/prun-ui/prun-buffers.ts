import getMapArray from '@src/utils/get-map-array';
import PrunCss from '@src/prun-ui/prun-css';
import { castArray } from '@src/utils/cast-array';
import { observeChildListChanged } from '@src/utils/mutation-observer';
import onetime from 'onetime';
import observeDocumentMutations from '@src/utils/document-mutation-observer';
import removeArrayElement from '@src/utils/remove-array-element';

interface PrunBufferObserver {
  (buffer: PrunBuffer): void;
}

const activeBuffers: PrunBuffer[] = [];
const commandObservers: Map<string, PrunBufferObserver[]> = new Map();
const anyCommandObservers: PrunBufferObserver[] = [];

const setupObserver = onetime(() => {
  observeDocumentMutations(reconciliate);
});

function reconciliate() {
  for (const buffer of activeBuffers) {
    if (!buffer.frame.isConnected) {
      deactivateBuffer(buffer);
    }
  }

  const frameElements = document.getElementsByClassName(
    PrunCss.TileFrame.frame,
  ) as HTMLCollectionOf<HTMLDivElement>;
  if (frameElements.length === activeBuffers.length) {
    return;
  }

  const newFrames: Set<HTMLDivElement> = new Set();

  for (let i = 0; i < frameElements.length; i++) {
    newFrames.add(frameElements[i]);
  }
  for (const buffer of activeBuffers) {
    newFrames.delete(buffer.frame);
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
  const commandElement = frame.getElementsByClassName(PrunCss.TileFrame.cmd)[0];
  const fullCommand = commandElement.textContent!;
  const indexOfSpace = fullCommand.indexOf(' ');
  const buffer: PrunBuffer = {
    frame,
    fullCommand,
    command: (indexOfSpace > 0 ? fullCommand.slice(0, indexOfSpace) : fullCommand).toUpperCase(),
    parameter: indexOfSpace > 0 ? fullCommand.slice(indexOfSpace + 1) : undefined,
    firstActivation: true,
  };
  frame.setAttribute('data-rp-command', buffer.command);
  activateBuffer(buffer);

  observeChildListChanged(anchor, () => {
    if (anchor.children.length === 0) {
      deactivateBuffer(buffer);
    }
  });
}

function activateBuffer(buffer: PrunBuffer) {
  if (activeBuffers.includes(buffer)) {
    return;
  }

  activeBuffers.push(buffer);
  for (const observer of getMapArray(commandObservers, buffer.command)) {
    observer(buffer);
  }
  for (const observer of anyCommandObservers) {
    observer(buffer);
  }
  buffer.firstActivation = false;
}

function deactivateBuffer(buffer: PrunBuffer) {
  if (!activeBuffers.includes(buffer)) {
    return;
  }

  removeArrayElement(activeBuffers, buffer);
}

function observeBuffers(commands: Arrayable<string>, observer: PrunBufferObserver) {
  setupObserver();
  for (let command of castArray(commands)) {
    command = command.toUpperCase();
    const observers = getMapArray(commandObservers, command);
    observers.push(observer);
    for (const buffer of activeBuffers) {
      if (buffer.command === command) {
        observer(buffer);
      }
    }
  }
}

function observeAllBuffers(observer: PrunBufferObserver) {
  setupObserver();
  anyCommandObservers.push(observer);
  for (const buffer of activeBuffers) {
    observer(buffer);
  }
}

const buffers = {
  observe: observeBuffers,
  observeAll: observeAllBuffers,
};

export default buffers;
