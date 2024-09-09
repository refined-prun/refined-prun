import { parseDuration } from '@src/util';
import tiles from '@src/infrastructure/prun-ui/tiles';
import features from '@src/feature-registry';
import PrunCss from '@src/infrastructure/prun-ui/prun-css';
import { $$ } from 'select-dom';
import { _$$ } from '@src/utils/get-element-by-class-name';
import { widgetAppend } from '@src/utils/vue-mount';
import { sumBy } from '@src/utils/sum-by';
import { percent2 } from '@src/utils/format';

function onTileReady(tile: PrunTile) {
  if (!tile.frame.isConnected) {
    return;
  }

  const tag = 'rp-prod-queue-load';
  for (const element of _$$(tag, tile.frame)) {
    element.remove();
  }

  const tables = _$$(PrunCss.ProductionQueue.table, tile.frame);
  for (const table of tables) {
    const rows = $$('tbody:nth-of-type(2) > tr', table);
    const totalTime = sumBy(rows, getEtaFromRow);
    if (totalTime === 0) {
      continue;
    }
    for (const row of rows) {
      const eta = getEtaFromRow(row);
      const percent = eta / totalTime;
      const textField = $$('td', row)[6];
      if (textField && eta > 0) {
        widgetAppend(textField, () => <span class={tag}> {percent2(percent)}</span>);
      }
    }
  }

  requestAnimationFrame(() => onTileReady(tile));
}

function getEtaFromRow(row: Element) {
  const etaCell = row.getElementsByTagName('td').item(5);
  if (etaCell) {
    const etaSpan = etaCell.getElementsByTagName('span').item(0);
    if (etaSpan) {
      return parseDuration(etaSpan.textContent);
    }
  }
  return 0;
}

function init() {
  tiles.observe('PRODQ', onTileReady);
}

void features.add({
  id: 'prodq-queue-load',
  init,
});
