import { Module } from '@src/ModuleRunner';
import { genericCleanup, getBuffersFromList, showBuffer } from '@src/util';
import { Selector } from '@src/Selector';

// Creates top right buttons (calculator + open new buffer for now)
export class TopRightButtons implements Module {
  private tag = 'pb-buttons';
  frequency = 2;

  cleanup(full: boolean = false) {
    full && genericCleanup(this.tag);
  }

  run(allBuffers) {
    const buffers = getBuffersFromList('', allBuffers);
    buffers.forEach(buffer => {
      const tileControls = buffer.querySelector(Selector.TileControls);
      const header = buffer.querySelector(Selector.BufferHeader);
      if (!header || !tileControls || !header.textContent) {
        return;
      }

      if (tileControls.classList.contains(this.tag)) {
        return;
      }
      tileControls.classList.add(this.tag);

      // Insert open button
      const openDiv = document.createElement('div');
      openDiv.classList.add('button-upper-right');
      openDiv.textContent = '↗';
      openDiv.style.marginTop = __CHROME__ ? '3px' : '-3px';
      openDiv.style.fontSize = __CHROME__ ? '16px' : '20px';
      openDiv.style.paddingRight = '1px';
      openDiv.style.paddingLeft = '1px';

      openDiv.addEventListener('click', function () {
        showBuffer(header.textContent);
      });

      const hiddenControls = tileControls.querySelector(Selector.HiddenControls);
      if (!hiddenControls) {
        return;
      }

      hiddenControls.firstChild.insertBefore(openDiv, hiddenControls.firstChild.children[0]);
    });
  }
}
