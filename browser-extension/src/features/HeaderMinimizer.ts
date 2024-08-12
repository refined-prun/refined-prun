import { Module } from '../ModuleRunner';
import { getBuffersFromList } from '../util';
import { Selector } from '../Selector';
import { Style } from '../Style';

/**
 * Minimize Large Headers on Buffers
 */
export class HeaderMinimizer implements Module {
  private minByDefault;
  private tag = 'pb-min-headers';

  constructor(minByDefault) {
    this.minByDefault = minByDefault;
  }

  cleanup() {
    // Nothing to clean up.
    return;
  }

  run(allBuffers) {
    let buffers = getBuffersFromList('CX ', allBuffers);
    if (!buffers) {
      return;
    }

    buffers.forEach(buffer => {
      minimizeHeaders(buffer, this.minByDefault, this.tag);
    });

    buffers = getBuffersFromList('CONT ', allBuffers);
    if (!buffers) {
      return;
    }

    buffers.forEach(buffer => {
      minimizeHeaders(buffer, this.minByDefault, this.tag);
    });

    buffers = getBuffersFromList('LM ', allBuffers);
    if (!buffers) {
      return;
    }

    buffers.forEach(buffer => {
      minimizeHeaders(buffer, this.minByDefault, this.tag);
    });

    buffers = getBuffersFromList('SYSI ', allBuffers);
    if (!buffers) {
      return;
    }

    buffers.forEach(buffer => {
      minimizeHeaders(buffer, this.minByDefault, this.tag);
    });

    return;
  }
}

function minimizeHeaders(buffer, minByDefault, tag) {
  const bufferPanel = buffer.querySelector(Selector.BufferPanel);
  if (!bufferPanel || !bufferPanel.firstChild) {
    return;
  }
  const headers = buffer.querySelectorAll(Selector.HeaderRow);
  if (headers.length == 0) {
    return;
  } // Don't populate empty buffers yet
  if (headers[0] && headers[0].classList.contains(tag)) {
    return;
  }
  if (minByDefault) {
    (Array.from(headers) as HTMLElement[]).forEach(header => {
      const label = header.querySelector(Selector.ContDFormLabel);
      if (label && label.textContent == 'Termination request') {
        const value = header.querySelector(Selector.ContDFormInput);
        if (value && value.textContent != '--') {
          return;
        }
      }
      if (!header.classList.contains(tag)) {
        header.style.display = 'none';
      }
    });
  }
  const minimizeButton = document.createElement('div');
  minimizeButton.textContent = minByDefault ? '+' : '-';
  minimizeButton.classList.add('pb-minimize');
  minimizeButton.classList.add('pb-minimize-cx');
  minimizeButton.addEventListener('click', () => {
    const minimize = minimizeButton.textContent == '-';
    minimizeButton.textContent = minimize ? '+' : '-';
    (Array.from(headers) as HTMLElement[]).forEach(header => {
      const label = header.querySelector(Selector.ContDFormLabel);
      if (label && label.textContent == 'Termination request') {
        const value = header.querySelector(Selector.ContDFormInput);
        if (value && value.textContent != '--') {
          return;
        }
      }
      if (!header.classList.contains(tag)) {
        header.style.display = minimize ? 'none' : 'flex';
      }
      return;
    });
    return;
  });

  headers[0].parentElement.insertBefore(
    createHeaderRow('Minimize', minimizeButton, tag),
    headers[0],
  );
  return;
}

// Move to util eventually, maybe
function createHeaderRow(labelText: string, rightSideContents: Element, tag: string) {
  const row = document.createElement('div');
  row.classList.add(...Style.HeaderRow);
  row.classList.add(tag);
  const label = document.createElement('label');
  label.classList.add(...Style.FormLabel);
  label.textContent = labelText;
  row.appendChild(label);
  const content = document.createElement('div');
  content.classList.add(...Style.FormSaveInput);

  const rightSideDiv = document.createElement('div');
  rightSideDiv.appendChild(rightSideContents);
  content.appendChild(rightSideDiv);
  row.appendChild(content);
  return row;
}
