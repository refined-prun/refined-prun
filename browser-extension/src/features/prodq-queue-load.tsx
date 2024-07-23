import { parseDuration } from '../util';
import buffers from '@src/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import { $$ } from 'select-dom';
import { dot } from '@src/utils/dot';
import { h } from 'dom-chef';
import PrunCss from '@src/prun-ui/prun-css';

function updateBuffer(buffer: PrunBuffer) {
  if (!buffer.frame.isConnected) {
    return;
  }

  const tag = 'rprun-prod-queue-load';
  for (const element of Array.from(buffer.frame.getElementsByClassName(tag))) {
    element.remove();
  }

  const tables = $$(dot(PrunCss.ProductionQueue.table), buffer.frame);
  for (const table of tables) {
    const rows = $$('tbody:nth-of-type(2) > tr', table);
    const totalTime = rows.map(getEtaFromRow).reduce((x, y) => x + y, 0);
    if (totalTime === 0) {
      continue;
    }
    for (const row of rows) {
      const eta = getEtaFromRow(row);
      const percent = ((eta / totalTime) * 100).toFixed(2);
      const textField = $$('td', row)[6];
      if (textField && eta > 0) {
        textField.appendChild(<span className={tag}> {percent}%</span>);
      }
    }
  }

  requestAnimationFrame(() => updateBuffer(buffer));
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
  buffers.observe('PRODQ', updateBuffer);
}

void features.add({
  id: 'sfc-arrival-eta',
  init,
});
