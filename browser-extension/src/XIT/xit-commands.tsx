import './xit-commands.css';
import features from '@src/feature-registry';
import buffers from '@src/prun-ui/prun-buffers';
import PrunCss from '@src/prun-ui/prun-css';
import descendantPresent from '@src/utils/descendant-present';
import { _$ } from '@src/utils/get-element-by-class-name';
import xit from '@src/XIT/xit-registry';
import { createApp } from 'vue';
import XITContainer from '@src/XIT/XITContainer.vue';
import LegacyXITAdapter from '@src/XIT/LegacyXITAdapter.vue';
import { widgetAfter } from '@src/utils/vue-mount';
import ContextControls from '@src/components/ContextControls.vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let xitArgs: any;
export const getXitArgs = () => xitArgs;

export function applyXITParameters(pmmgSettings, modules) {
  xitArgs = {
    modules,
    pmmgSettings,
  };
}

async function onBufferCreated(buffer: PrunBuffer) {
  const frame = buffer.frame;
  const scrollView = await descendantPresent(frame, PrunCss.ScrollView.view);
  // XIT command produces a buffer with full-size green screen on top.
  // For custom XIT commands we just draw on top of it.
  const greenScreen = scrollView.children[0] as HTMLDivElement;
  if (!greenScreen) {
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

  const container = document.createElement('div');
  container.className = 'rp-XIT-container';
  greenScreen.appendChild(container);

  const xitCommand = xit.get(command);
  if (!xitCommand) {
    container.textContent = 'Error! No Matching Function!';
    return;
  }

  _$(PrunCss.TileFrame.title, frame)!.textContent =
    typeof xitCommand.name === 'string' ? xitCommand.name : xitCommand.name(parameters);

  if (xitCommand.contextItems) {
    const items = xitCommand.contextItems(parameters);
    if (items.length > 0) {
      const header = _$(PrunCss.TileFrame.header, frame)!;
      widgetAfter(header, ContextControls, { items });
    }
  }

  if (xitCommand.module) {
    // eslint-disable-next-line vue/one-component-per-file
    createApp(LegacyXITAdapter, {
      module: (container: HTMLDivElement) => {
        const args = getXitArgs();
        return new xitCommand.module!(container, parameters, args.pmmgSettings, args.modules);
      },
    }).mount(container);
  } else if (xitCommand.component) {
    // eslint-disable-next-line vue/one-component-per-file
    createApp(XITContainer, {
      buffer: xitCommand.component(parameters),
      parameters: parameters,
    }).mount(container);
  }
}

export function init() {
  buffers.observe('XIT', onBufferCreated);
}

void features.add({
  id: 'xit-commands',
  init,
});
