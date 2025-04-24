import $style from './cmds-clickable-commands.module.css';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { isPresent } from 'ts-extras';

function onTileReady(tile: PrunTile) {
  subscribe($$(tile.anchor, 'tbody'), tbody => {
    subscribe($$(tbody, 'tr'), tr => {
      const commandColumn = tr.children[0];
      const command = commandColumn?.textContent;
      const mandatoryParameters = tr.children[2];
      if (!isPresent(command) || mandatoryParameters === undefined) {
        return;
      }
      commandColumn.addEventListener('click', () => {
        void showBuffer(command, { autoSubmit: (mandatoryParameters.textContent ?? '') === '' });
      });
    });
  });
}

function init() {
  applyCssRule('CMDS', 'tbody', $style.tbody);
  tiles.observe('CMDS', onTileReady);
}

features.add(import.meta.url, init, 'CMDS: Makes commands clickable.');
