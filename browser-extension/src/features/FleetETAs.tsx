import { h } from 'dom-chef';
import { Module } from '../ModuleRunner';
import { convertDurationToETA, genericCleanup, getBuffersFromList, parseDuration } from '../util';

/**
 * Parse Fleet ETA times and add the actual date-time of arrival
 */
export class FleetETAs implements Module {
  private tag = 'pb-flt-eta';

  cleanup() {
    genericCleanup(this.tag);
  }

  run(allBuffers) {
    const buffers = getBuffersFromList('FLT', allBuffers);
    if (buffers == undefined) return;
    for (const buffer of buffers) {
      const elements = Array.from(buffer.querySelectorAll('table > tbody > tr'));
      elements.forEach(targetRow => {
        const etaData = (targetRow as HTMLElement).children[7];
        if (etaData.textContent != '') {
          const eta = convertDurationToETA(parseDuration(etaData.textContent));
          etaData.appendChild(<span className={this.tag}> ({eta})</span>);
        }
      });
    }
    return;
  }
}
