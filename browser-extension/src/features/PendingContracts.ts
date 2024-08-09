import { Module } from '../ModuleRunner';
import { createTextSpan, genericCleanup, createContractDict } from '../util';
import { Selector } from '../Selector';
import { store } from '@src/prun-api/data/store';
import { selectContracts } from '@src/prun-api/data/contracts';

export class PendingContracts implements Module {
  private tag = 'pb-pending-contracts';

  cleanup() {
    genericCleanup(this.tag);
  }

  run() {
    const contractLines = Array.from(document.querySelectorAll(Selector.SidebarContract)) as HTMLElement[]; // All the contract lines

    const contracts = selectContracts(store.getState());
    if (contractLines.length > 0 && contracts.length > 0) {
      const contractdict = {};

      createContractDict(contracts, contractdict); // Turn the array into a dictionary with keys being contract IDs

      contractLines.forEach(contract => {
        // For each contract...
        const contractIDElement = contract.querySelector(Selector.SidebarContractId); // Find the ID and store it
        if (!contractIDElement) {
          return;
        }
        const contractID = contractIDElement.textContent;
        if (!contractID) {
          return;
        }

        if (contractdict[contractID] && contractdict[contractID].partner.name) {
          // If the contract ID is in FIO
          let partnercode = contractdict[contractID].partner.name; // Label with partner's name
          if (partnercode.length > 17) {
            // Unless unknown or too long, then use company code
            partnercode = contractdict[contractID].partner.code || contractdict[contractID].partner.name.split(' ')[0];
          }
          const nameSpan = createTextSpan(`${partnercode}`, this.tag); // Add it to the row
          nameSpan.style.width = '100px';
          contract.insertBefore(nameSpan, contract.firstChild);
          return;
        }

        const nameSpan = createTextSpan('Unknown', this.tag); // If unknown, add unknown to the row
        nameSpan.style.width = '100px';
        contract.insertBefore(nameSpan, contract.firstChild);
      });
      return;
    }
    return;
  }
}
