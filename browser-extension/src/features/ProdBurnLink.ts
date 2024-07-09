import { Module } from '@src/ModuleRunner';
import { createContextButton, getBuffersFromList, parseProdName } from '@src/util';
import { Selector } from '@src/Selector';

/**
 * Add link to burn to PROD buffers
 */
export class ProdBurnLink implements Module {
  private tag = 'pb-prod-link';

  cleanup() {
    // Nothing to clean up.
    return;
  }
  run(allBuffers) {
    const buffers = getBuffersFromList('PROD ', allBuffers);

    if (!buffers) {
      return;
    }

    buffers.forEach(buffer => {
      const nameElem = buffer.querySelector(Selector.WorkforceConsumptionTable);
      if (!nameElem || !nameElem.textContent) return;
      const name = parseProdName(nameElem.textContent);

      if (!name) {
        return;
      }

      const contextButton = createContextButton('BURN', 'Enhanced Burn', 'XIT BURN_' + name);

      const contextBar = buffer.querySelector(Selector.ContextBar);

      if (!contextBar || !contextBar.children[0]) {
        return;
      }

      // Make run only once
      if (contextBar.classList.contains(this.tag)) {
        return;
      }
      contextBar.classList.add(this.tag);

      contextBar.insertBefore(contextButton, contextBar.children[0]);
    });

    return;
  }
}
