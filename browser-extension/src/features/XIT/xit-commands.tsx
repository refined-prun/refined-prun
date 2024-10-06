import './xit-commands.css';
import features from '@src/feature-registry';
import tiles from '@src/infrastructure/prun-ui/tiles';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import xit from '@src/features/XIT/xit-registry';
import LegacyXITAdapter from '@src/features/XIT/LegacyXITAdapter.vue';
import { createFragmentApp } from '@src/utils/vue-fragment-app';
import ContextControls from '@src/components/ContextControls.vue';

import { tileStatePlugin } from '@src/store/user-data-tiles';
import { startMeasure, stopMeasure } from '@src/utils/performance-measure';
import { $ } from '@src/utils/select-dom';

async function onTileReady(tile: PrunTile) {
  const frame = tile.frame;
  const scrollView = await $(frame, PrunCss.ScrollView.view);
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

  (await $(frame, PrunCss.TileFrame.title)).textContent =
    typeof xitCommand.name === 'string' ? xitCommand.name : xitCommand.name(parameters);

  if (xitCommand.contextItems) {
    const items = xitCommand.contextItems(parameters);
    if (items.length > 0) {
      const header = await $(frame, PrunCss.TileFrame.header);
      createFragmentApp(ContextControls, { items }).after(header);
    }
  }

  if (xitCommand.module) {
    createFragmentApp(LegacyXITAdapter, {
      module: (container: HTMLDivElement) => {
        return new xitCommand.module!(container, parameters);
      },
    }).appendTo(container);
  } else if (xitCommand.component) {
    startMeasure(tile.fullCommand);
    createFragmentApp(xitCommand.component(parameters))
      .use(tileStatePlugin, { tile })
      .provide(xit.command, command)
      .provide(xit.parameters, parameters.slice(1))
      .appendTo(container);
    stopMeasure();
  }
}

export function init() {
  tiles.observe('XIT', onTileReady);
}

void features.add({
  id: 'xit-commands',
  init,
});
