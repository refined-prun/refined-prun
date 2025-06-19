import { createFragmentApp } from '@src/utils/vue-fragment-app';
import ContextControls from '@src/components/ContextControls.vue';
import { tileStatePlugin } from '@src/store/user-data-tiles';
import { startMeasure, stopMeasure } from '@src/utils/performance-measure';
import { isEmpty } from 'ts-extras';
import { xitParametersKey } from '@src/hooks/use-xit-parameters';
import { xitCommandKey } from '@src/hooks/use-xit-command';
import { userData } from '@src/store/user-data';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { tileKey } from '@src/hooks/use-tile';

function onTileReady(tile: PrunTile) {
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
  if (isEmpty(parameters)) {
    return;
  }

  const command = parameters[0];
  if (command.toUpperCase() == 'FIO' || command.toUpperCase() == 'COL') {
    // Exception for FIO and PrUn-Collector to use XIT
    return;
  }
  const xitCommand = xit.get(command);
  parameters = parameters.slice(1);

  if (xitCommand) {
    _$(tile.frame, C.TileFrame.title)!.textContent =
      typeof xitCommand.name === 'string' ? xitCommand.name : xitCommand.name(parameters);

    if (xitCommand.contextItems) {
      const items = xitCommand.contextItems(parameters);
      if (!isEmpty(items)) {
        const header = _$(tile.frame, C.TileFrame.header)!;
        createFragmentApp(ContextControls, { items }).after(header);
      }
    }
  }

  subscribe($$(tile.anchor, C.ScrollView.view), scrollView => {
    // XIT command produces a tile with full-size green screen as its content.
    // Custom XIT tiles are just mounted inside this green screen.
    const container = scrollView.children[0] as HTMLDivElement;
    if (container === undefined) {
      return;
    }

    container.removeAttribute('style');
    container.style.width = '100%';
    container.style.height = '100%';

    if (!xitCommand) {
      container.textContent = 'Error! No Matching Function!';
      return;
    }

    startMeasure(tile.fullCommand);
    createFragmentApp(xitCommand.component(parameters))
      .use(tileStatePlugin, { tile })
      .provide(tileKey, tile)
      .provide(xitCommandKey, command)
      .provide(xitParametersKey, parameters)
      .appendTo(container);
    stopMeasure();
  });
}

export function initializeXitCommands() {
  tiles.observe('XIT', onTileReady);
  if (userData.settings.mode === undefined) {
    setTimeout(() => showBuffer('XIT START'), 1000);
    return;
  }
  if (userData.configVersion !== config.version) {
    setTimeout(() => showBuffer('XIT CHANGELOG'), 1000);
    userData.configVersion = config.version;
  }
}
