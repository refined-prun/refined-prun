import { Module } from '../ModuleRunner';
import { Selector } from '../Selector';
import { convertDurationToETA, parseDuration, createTextSpan, genericCleanup } from '../util';
import PrunCss from '@src/prun-ui/prun-css';

export class OrderETAs implements Module {
  private tag = 'pb-order-eta';

  cleanup() {
    genericCleanup(this.tag);
  }

  run() {
    this.beautifyOrders();
  }

  /**
   * Parse all orders (PROD Screen)
   * @private
   */
  private beautifyOrders() {
    const elements = Array.from(document.querySelectorAll(Selector.ProdQueue));
    elements.forEach(queue => {
      const prodSlots = Array.from(queue.children);
      let inQueue = false;
      let lineTimes = [] as number[];
      let timeElapsed = 0;
      prodSlots.forEach(prodItem => {
        if (prodItem.classList.contains(PrunCss.OrderSlot.container)) {
          try {
            let duration;
            if (inQueue) {
              if (prodItem.children[0].children.length < 2) {
                return;
              }
              lineTimes.sort((a, b) => {
                return a - b;
              });
              const minTime = lineTimes[0];
              timeElapsed += minTime;
              lineTimes.shift();
              lineTimes = lineTimes.map(value => {
                return value - minTime;
              });

              duration = parseDuration(prodItem.children[0].children[1].textContent);
              lineTimes.push(duration);
              if (!isNaN(duration + timeElapsed)) {
                prodItem.children[0].children[1].appendChild(
                  createTextSpan(` (${convertDurationToETA(duration + timeElapsed)})`, this.tag),
                );
              }
            } else {
              duration = parseDuration(prodItem.children[1].children[1].textContent);
              lineTimes.push(duration);
              if (!isNaN(duration)) {
                prodItem.children[1].children[1].appendChild(
                  createTextSpan(` (${convertDurationToETA(duration)})`, this.tag),
                );
              }
            }
          } catch {
            /* empty */
          }
        } else {
          inQueue = true;
        }
      });
    });
  }
}
