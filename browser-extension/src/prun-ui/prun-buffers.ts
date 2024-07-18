import observe from '@src/utils/selector-observer';
import getMapArray from '@src/utils/get-map-array';
import PrUnCss from '@src/prun-ui/prun-css';
import { dot } from '@src/utils/dot';

interface PrUnBufferObserver {
  (buffer: PrUnBuffer): void;
}

const activeBuffers: PrUnBuffer[] = [];
const commandBuffers: Map<string, PrUnBuffer[]> = new Map();
const commandObservers: Map<string, PrUnBufferObserver[]> = new Map();

function track() {
  observe(dot(PrUnCss.TileFrame.frame), onFrameAdded);
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

function removeBuffer(buffer: PrUnBuffer) {
  const buffers = getMapArray(commandBuffers, buffer.command);
  let index = buffers.indexOf(buffer);
  buffers.splice(index, 1);
  index = activeBuffers.indexOf(buffer);
  activeBuffers.splice(index, 1);
}

async function onFrameAdded(frame: HTMLDivElement) {
  await waitUntilLoaded(frame);
  const commandElement = frame.getElementsByClassName(PrUnCss.TileFrame.cmd)[0];
  const commandParts = commandElement.textContent!.split(' ');
  const buffer: PrUnBuffer = {
    frame,
    command: commandParts[0].toUpperCase(),
    parameter: commandParts[1],
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
  const scrollView = frame.getElementsByClassName(PrUnCss.ScrollView.view)[0];
  await waitUntilScrollViewNotEmpty(scrollView);
  await new Promise<void>(resolve => {
    const elements = scrollView.getElementsByClassName(PrUnCss.Loading.loader);
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

function observeBuffers(command: string, observer: PrUnBufferObserver) {
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
