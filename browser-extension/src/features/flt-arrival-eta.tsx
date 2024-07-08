import { h } from 'dom-chef';
import { $ } from 'select-dom';
import { convertDurationToETA, parseDuration } from '@src/util';
import features from '@src/feature-registry';
import buffers from '@src/prun-ui/prun-buffers';

function observeBuffer(frame: HTMLDivElement) {
  const tbody = $('table > tbody', frame);
  if (tbody === undefined) {
    if (frame.isConnected) {
      requestAnimationFrame(() => observeBuffer(frame));
    }
    return;
  }

  Array.from(tbody.rows).forEach(observeRow);
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(observeRow);
    }
  });
  observer.observe(tbody, { childList: true });
}

function observeRow(node: Node) {
  const row = node as HTMLTableRowElement;
  const etaColumn = row.children[7];
  const etaSpan = <span className="rpu-flt-eta" />;
  observeEtaColumn(etaColumn, etaSpan);
  const observer = new MutationObserver(() => observeEtaColumn(etaColumn, etaSpan));
  observer.observe(etaColumn, { childList: true });
}

function observeEtaColumn(etaColumn: Element, etaSpan: Element) {
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
  observeDurationSpan(child, etaSpan);
}

function observeDurationSpan(durationSpan: Element, etaSpan: Element) {
  setEta(durationSpan, etaSpan);
  const observer = new MutationObserver(() => setEta(durationSpan, etaSpan));
  observer.observe(durationSpan, { characterData: true });
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

function onBufferCreated(buffer: PrUnBuffer) {
  observeBuffer(buffer.frame);
}

export function init() {
  buffers.observe('FLT', onBufferCreated);
}

void features.add({
  id: 'flt-arrival-eta',
  init,
});
