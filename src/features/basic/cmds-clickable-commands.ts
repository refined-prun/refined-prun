import link from '@src/infrastructure/prun-ui/css/link.module.css';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { isPresent } from 'ts-extras';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tbody'), tbody => {
    subscribe($$(tbody, 'tr'), tr => {
      const commandColumn = tr.children[0] as HTMLElement;
      const command = commandColumn?.textContent;
      const mandatoryParameters = tr.children[2];
      if (!isPresent(command) || mandatoryParameters === undefined) {
        return;
      }
      commandColumn.classList.add(link.link);
      commandColumn.addEventListener('click', e => {
        void showBuffer(command, { autoSubmit: (mandatoryParameters.textContent ?? '') === '' });
        e.stopPropagation();
        e.preventDefault();
      });
    });
  });
}

function init() {
  tiles.observe('CMDS', onTileReady);
}

features.add(import.meta.url, init, 'CMDS: Makes commands clickable.');
