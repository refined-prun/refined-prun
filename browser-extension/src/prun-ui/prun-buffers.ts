import observeReadyElements from '@src/utils/selector-observer';
import getMapArray from '@src/utils/get-map-array';
import PrunCss from '@src/prun-ui/prun-css';
import { dot } from '@src/utils/dot';
import { castArray } from '@src/utils/cast-array';
import oneMutation from 'one-mutation';
import childElementPresent from '@src/utils/child-element-present';

interface PrunBufferObserver {
  (buffer: PrunBuffer): void;
}

const commandBuffers: Map<string, PrunBuffer[]> = new Map();
const commandObservers: Map<string, PrunBufferObserver[]> = new Map();

function track() {
  observeReadyElements(dot(PrunCss.TileFrame.frame), onFrameAdded);
}

async function onFrameAdded(frame: HTMLDivElement) {
  await waitUntilLoaded(frame);
  const commandElement = frame.getElementsByClassName(PrunCss.TileFrame.cmd)[0];
  const fullCommand = commandElement.textContent!;
  const indexOfSpace = fullCommand.indexOf(' ');
  const buffer: PrunBuffer = {
    frame,
    command: (indexOfSpace > 0 ? fullCommand.slice(0, indexOfSpace) : fullCommand).toUpperCase(),
    parameter: indexOfSpace > 0 ? fullCommand.slice(indexOfSpace + 1) : undefined,
  };
  const buffers = getMapArray(commandBuffers, buffer.command);
  buffers.push(buffer);
  const observers = getMapArray(commandObservers, buffer.command);
  for (const observer of observers) {
    observer(buffer);
  }
}

async function waitUntilLoaded(frame: HTMLDivElement) {
  const scrollView = await childElementPresent(frame, PrunCss.ScrollView.view);
  const loaders = scrollView.getElementsByClassName(PrunCss.Loading.loader);

  const isLoaded = () => Array.from(loaders).every(x => x.parentElement !== scrollView);

  if (isLoaded()) {
    return;
  }

  await oneMutation(scrollView, {
    childList: true,
    filter: isLoaded,
  });
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

const buffers = {
  track,
  observe: observeBuffers,
};

export default buffers;
