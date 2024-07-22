/* eslint-disable @typescript-eslint/no-explicit-any */
import { clearChildren } from '../util';

export class Calculator {
  private tile: HTMLElement;
  public name = 'CALCULATOR';

  constructor(tile) {
    this.tile = tile;
  }

  create_buffer() {
    clearChildren(this.tile);
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.desmos.com/scientific';
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.borderWidth = '0';
    this.tile.appendChild(iframe);
    return;
  }

  update_buffer() {
    // Nothing to update
  }

  destroy_buffer() {
    // Nothing constantly running so nothing to destroy
  }
}
