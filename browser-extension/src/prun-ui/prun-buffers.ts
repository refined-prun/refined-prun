import observe from '@src/utils/selector-observer';
import getMapArray from '@src/utils/get-map-array';
import PrunCss from '@src/prun-ui/prun-css';
import { dot } from '@src/utils/dot';

interface PrunBufferObserver {
  (buffer: PrunBuffer): void;
}

const activeBuffers: PrunBuffer[] = [];
const commandBuffers: Map<string, PrunBuffer[]> = new Map();
const commandObservers: Map<string, PrunBufferObserver[]> = new Map();

function track() {
  observe(dot(PrunCss.TileFrame.frame), onFrameAdded);
  const observer = new MutationObserver(validateActiveBuffers);
  observer.observe(document.body, { childList: true, subtree: true });
}

function validateActiveBuffers() {
  for (const buffer of activeBuffers) {
    if (!buffer.frame.isConnected) {
      removeBuffer(buffer);
    }
  }
}

function removeBuffer(buffer: PrunBuffer) {
  const buffers = getMapArray(commandBuffers, buffer.command);
  let index = buffers.indexOf(buffer);
  buffers.splice(index, 1);
  index = activeBuffers.indexOf(buffer);
  activeBuffers.splice(index, 1);
}

async function onFrameAdded(frame: HTMLDivElement) {
  await waitUntilLoaded(frame);
  const commandElement = frame.getElementsByClassName(PrunCss.TileFrame.cmd)[0];
  const fullCommand = commandElement.textContent!;
  const indexOfSpace = fullCommand.indexOf(' ');
  const buffer: PrunBuffer = {
    frame,
    command: indexOfSpace > 0 ? fullCommand.slice(0, indexOfSpace) : fullCommand,
    parameter: indexOfSpace > 0 ? fullCommand.slice(indexOfSpace + 1) : undefined,
  };
  const buffers = getMapArray(commandBuffers, buffer.command);
  buffers.push(buffer);
  activeBuffers.push(buffer);
  const observers = getMapArray(commandObservers, buffer.command);
  for (const observer of observers) {
    observer(buffer);
  }
}

async function waitUntilLoaded(frame: HTMLDivElement) {
  const scrollView = frame.getElementsByClassName(PrunCss.ScrollView.view)[0];
  await waitUntilScrollViewNotEmpty(scrollView);
  await new Promise<void>(resolve => {
    const elements = scrollView.getElementsByClassName(PrunCss.Loading.loader);
    if (elements.length === 0) {
      resolve();
      return;
    }

    const loader = elements[0];
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        mutation.removedNodes.forEach(node => {
          if (loader === node) {
            resolve();
          }
        });
      }
    });

    observer.observe(scrollView, { childList: true });
  });
}

async function waitUntilScrollViewNotEmpty(scrollView: Element) {
  await new Promise<void>(resolve => {
    if (scrollView.childNodes.length > 0) {
      resolve();
      return;
    }

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          resolve();
          observer.disconnect();
        }
      }
    });

    observer.observe(scrollView, { childList: true });
  });
}

function observeBuffers(command: string, observer: PrunBufferObserver) {
  command = command.toUpperCase();
  const observers = getMapArray(commandObservers, command);
  observers.push(observer);
  const buffers = getMapArray(commandBuffers, command);
  for (const buffer of buffers) {
    observer(buffer);
  }
}

const buffers = {
  track,
  observe: observeBuffers,
};

export default buffers;
