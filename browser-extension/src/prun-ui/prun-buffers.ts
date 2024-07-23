import observeReadyElements from '@src/utils/selector-observer';
import getMapArray from '@src/utils/get-map-array';
import PrunCss from '@src/prun-ui/prun-css';
import { dot } from '@src/utils/dot';
import { castArray } from '@src/utils/cast-array';
import childElementPresent from '@src/utils/child-element-present';
import { observeChildListChanged } from '@src/utils/mutation-observer';
import { onElementDisconnected } from '@src/utils/on-element-disconnected';

interface PrunBufferObserver {
  (buffer: PrunBuffer): void;
}

const activeBuffers: Set<PrunBuffer> = new Set();
const commandBuffers: Map<string, PrunBuffer[]> = new Map();
const commandObservers: Map<string, PrunBufferObserver[]> = new Map();
const anyCommandObservers: PrunBufferObserver[] = [];

function track() {
  observeReadyElements(dot(PrunCss.TileFrame.frame), onFrameReady);
}

async function onFrameReady(frame: HTMLDivElement) {
  const anchor = await childElementPresent(frame, PrunCss.TileFrame.anchor);
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
  onElementDisconnected(frame, () => deactivateBuffer(buffer));

  observeChildListChanged(anchor, () => {
    if (anchor.children.length === 0) {
      deactivateBuffer(buffer);
    } else {
      activateBuffer(buffer);
    }
  });
}

function activateBuffer(buffer: PrunBuffer) {
  if (activeBuffers.has(buffer)) {
    return;
  }

  const buffers = getMapArray(commandBuffers, buffer.command);
  buffers.push(buffer);
  for (const observer of getMapArray(commandObservers, buffer.command)) {
    observer(buffer);
  }
  for (const observer of anyCommandObservers) {
    observer(buffer);
  }
  buffer.firstActivation = false;
}

function deactivateBuffer(buffer: PrunBuffer) {
  if (!activeBuffers.has(buffer)) {
    return;
  }

  activeBuffers.delete(buffer);
  const buffers = getMapArray(commandBuffers, buffer.command);
  const index = buffers.indexOf(buffer);
  if (index >= 0) {
    buffers.splice(index, 1);
  }
}

function observeBuffers(commands: Arrayable<string>, observer: PrunBufferObserver) {
  for (let command of castArray(commands)) {
    command = command.toUpperCase();
    const observers = getMapArray(commandObservers, command);
    observers.push(observer);
    const buffers = getMapArray(commandBuffers, command);
    for (const buffer of buffers) {
      observer(buffer);
    }
  }
}

function observeAllBuffers(observer: PrunBufferObserver) {
  anyCommandObservers.push(observer);
  for (const buffers of commandBuffers.values()) {
    for (const buffer of buffers) {
      observer(buffer);
    }
  }
}

const buffers = {
  track,
  observe: observeBuffers,
  observeAll: observeAllBuffers,
};

export default buffers;
