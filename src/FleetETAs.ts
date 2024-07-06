import { Module } from "./ModuleRunner";
import { convertDurationToETA, parseDuration, createTextSpan, genericCleanup, getBuffersFromList } from "./util";

/**
 * Parse Fleet ETA times and add the actual date-time of arrival
 */
export class FleetETAs implements Module {
  private tag = "pb-flt-eta";

  cleanup() {
    genericCleanup(this.tag);
  }

  run(allBuffers) {
    const buffers = getBuffersFromList("FLT", allBuffers);
    if (buffers == undefined) return;
    for (let buffer of buffers) {
      const elements = Array.from(buffer.querySelectorAll("table > tbody > tr"));
      elements.forEach(targetRow => {
        const etaData = (targetRow as HTMLElement).children[7];
        if (etaData.textContent != "") {
          const eta = convertDurationToETA(parseDuration(etaData.textContent));
          etaData.appendChild(createTextSpan(` (${eta})`, this.tag));
        }
      });
    }
    return;
  }
}
