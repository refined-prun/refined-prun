import { h } from 'dom-chef';
import { $ } from 'select-dom';
import { convertDurationToETA, parseDuration } from '@src/util';
import features from '@src/feature-registry';
import buffers from '@src/prun-ui/prun-buffers';
import { observeCharacterDataChanged, observeChildListChanged, observeChildren } from '@src/utils/mutation-observer';

function observeBuffer(frame: HTMLDivElement) {
  const tbody = $('table > tbody', frame);
  if (tbody === undefined) {
    if (frame.isConnected) {
      requestAnimationFrame(() => observeBuffer(frame));
    }
    return;
  }

  observeChildren(tbody, observeRow);
}

function observeRow(row: Node) {
  if (!(row instanceof HTMLTableRowElement)) {
    return;
  }
  const etaColumn = row.children[7];
  const etaSpan = <span className="rprun-flt-eta" />;
  observeChildListChanged(etaColumn, () => updateEtaColumn(etaColumn, etaSpan));
}

function updateEtaColumn(etaColumn: Element, etaSpan: Element) {
  const children = etaColumn.children;
  if (children.length === 0) {
    // A ship is stationary, duration span is not present.
    return;
  }

  if (children.length === 2) {
    // ETA span was added already.
    return;
  }

  if (children.length > 2) {
    // IDK what's happening, remove etaSpan just in case.
    etaColumn.removeChild(etaSpan);
    return;
  }

  const child = children[0];
  if (child === etaSpan) {
    // Ship became stationary, duration span was removed.
    etaColumn.removeChild(etaSpan);
    return;
  }

  etaColumn.appendChild(etaSpan);
  observeCharacterDataChanged(child, () => setEta(child, etaSpan));
}

function setEta(durationSpan: Element, etaSpan: Element) {
  const duration = durationSpan?.textContent ?? '';
  if (duration == '') {
    etaSpan.textContent = '';
    return;
  }
  const eta = convertDurationToETA(parseDuration(duration));
  etaSpan.textContent = ` (${eta})`;
}

function onBufferCreated(buffer: PrunBuffer) {
  observeBuffer(buffer.frame);
}

function init() {
  buffers.observe('FLT', onBufferCreated);
}

void features.add({
  id: 'flt-arrival-eta',
  init,
});
