import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { downloadJson } from '@src/utils/json-file';
import { dataCatalog } from '@src/infrastructure/data-catalog';
import { exportTileDataFromCatalog } from '@src/infrastructure/data-catalog/tile-export-providers';
import { getRenderedTileMetadata } from '@src/infrastructure/data-catalog/tile-sources';

export function initTileDataExport() {
  subscribe($$(document, C.TileFrame.cmd), cmd => {
    cmd.addEventListener('click', e => {
      if (e.altKey) {
        const tile = cmd.closest(`.${C.Tile.tile}`) as HTMLElement;
        downloadTileData(tile, cmd.textContent.trim());
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      return true;
    });
  });
}

function downloadTileData(el: HTMLElement, fullCommand: string) {
  const id = getPrunId(el);
  if (!id) {
    return;
  }
  const space = fullCommand.indexOf(' ');
  const data = exportTileDataFromCatalog(
    dataCatalog,
    {
      id,
      fullCommand,
      command: (space === -1 ? fullCommand : fullCommand.slice(0, space)).toUpperCase(),
      ...(space === -1 ? {} : { parameter: fullCommand.slice(space + 1) }),
    },
    new Date(),
    getRenderedTileMetadata,
  );
  downloadJson(data, `${data.tile.command} ${id}.json`, { pretty: true });
}
