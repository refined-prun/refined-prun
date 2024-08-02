import './xit-commands.css';
import features from '@src/feature-registry';
import buffers from '@src/prun-ui/prun-buffers';
import PrunCss from '@src/prun-ui/prun-css';
import descendantPresent from '@src/utils/descendant-present';
import { _$ } from '@src/utils/get-element-by-class-name';
import xit from '@src/XIT/xit-registry';
import { render } from 'preact';
import { appendRootFragment } from '@src/utils/create-root-fragment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let xitArgs: any;
export const getXitArgs = () => xitArgs;

export function applyXITParameters(pmmgSettings, userInfo, webData, modules) {
  xitArgs = {
    userInfo,
    webData,
    modules,
    pmmgSettings,
  };
}

async function onBufferCreated(buffer: PrunBuffer) {
  const frame = buffer.frame;
  const scrollView = await descendantPresent(frame, PrunCss.ScrollView.view);
  const body = scrollView.children[0] as HTMLDivElement;
  if (!body) {
    return;
  }

  const rawParameter = buffer.parameter;
  if (!rawParameter) {
    return;
  }

  let parameters = [] as string[];
  if (rawParameter[0] === '1') {
    const keyValues = rawParameter.split(' ');
    parameters.push(...keyValues.map(x => x.slice(2)));
  } else {
    parameters = rawParameter.split(/[_ ]+/g);
  }
  if (parameters.length === 0) {
    return;
  }

  const command = parameters[0];
  if (command.toUpperCase() == 'FIO') {
    // Exception for FIO to use XIT
    return;
  }

  // Remove green screen
  body.style.background = '';
  body.classList.add('rprun-xit-tile');

  const xitCommand = xit.get(command);
  if (!xitCommand) {
    body.textContent = 'Error! No Matching Function!';
    return;
  }

  _$(PrunCss.TileFrame.title, frame)!.textContent =
    typeof xitCommand.name === 'string' ? xitCommand.name : xitCommand.name(parameters);

  const vNode = xitCommand.component(parameters);
  render(vNode, appendRootFragment(body, 'div'));
}

export function init() {
  buffers.observe('XIT', onBufferCreated);
}

void features.add({
  id: 'xit-commands',
  init,
});
