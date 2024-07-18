import { Module } from '@src/ModuleRunner';
import { createContextButton, getBuffersFromList } from '@src/util';
import { Selector } from '@src/Selector';
import systems from '@src/prun-api/systems';

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

export function parseProdName(text) {
  try {
    let match = text.match(/([A-Z]{2}-[0-9]{3} [a-z]) Production/); // Unnamed system unnamed planet
    if (match && match[1]) {
      return match[1].replace(' ', '');
    }
    match = text.match(/([A-z ]*) - ([A-z ]*) Production/); // Named system named planet
    if (match && match[1] && match[2]) {
      return match[2];
    }
    match = text.match(/([A-z ]*) ([A-z]) Production/); // Named system unnamed planet
    const system = systems.getByName(match?.[1]);
    if (system) {
      return system.naturalId + match[2].toLowerCase();
    }
    match = text.match(/[A-Z]{2}-[0-9]{3} - ([A-z ]*) Production/); // Unnamed system named planet
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch (TypeError) {
    return text;
  }
}
