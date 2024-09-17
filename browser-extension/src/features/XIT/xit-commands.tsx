import './xit-commands.css';
import features from '@src/feature-registry';
import tiles from '@src/infrastructure/prun-ui/tiles';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import descendantPresent from '@src/utils/descendant-present';
import { _$ } from '@src/utils/get-element-by-class-name';
import xit from '@src/features/XIT/xit-registry';
import XITContainer from '@src/features/XIT/XITContainer.vue';
import LegacyXITAdapter from '@src/features/XIT/LegacyXITAdapter.vue';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import ContextControls from '@src/components/ContextControls.vue';

import { tileStatePlugin } from '@src/store/user-data-tiles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let xitArgs: any;
export const getXitArgs = () => xitArgs;

export function applyXITParameters(pmmgSettings) {
  xitArgs = {
    modules: [],
    pmmgSettings,
  };
}

async function onTileReady(tile: PrunTile) {
  const frame = tile.frame;
  const scrollView = await descendantPresent(frame, PrunCss.ScrollView.view);
  // XIT command produces a tile with full-size green screen as its content.
  // Custom XIT tiles are just mounted inside this green screen.
  const container = scrollView.children[0] as HTMLDivElement;
  if (!container) {
    return;
  }

  const rawParameter = tile.parameter;
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
  if (command.toUpperCase() == 'FIO' || command.toUpperCase() == 'COL') {
    // Exception for FIO and PrUn-Collector to use XIT
    return;
  }

  // Remove green screen styling
  container.removeAttribute('style');
  container.style.width = '100%';
  container.style.height = '100%';

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
      createFragmentApp(ContextControls, { items }).after(header);
    }
  }

  if (xitCommand.module) {
    createFragmentApp(LegacyXITAdapter, {
      module: (container: HTMLDivElement) => {
        const args = getXitArgs();
        return new xitCommand.module!(container, parameters, args.pmmgSettings, args.modules);
      },
    }).appendTo(container);
  } else if (xitCommand.component) {
    createFragmentApp(XITContainer, {
      component: xitCommand.component(parameters),
      parameters: parameters,
    })
      .use(tileStatePlugin, { tile })
      .appendTo(container);
  }
}

export function init() {
  tiles.observe('XIT', onTileReady);
}

void features.add({
  id: 'xit-commands',
  init,
});
