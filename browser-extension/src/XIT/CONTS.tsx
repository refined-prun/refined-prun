import { clearChildren, createLink, createMaterialElement, createTable, createTextDiv, createTextSpan } from '../util';

import { TextColors } from '../Style';

import { FactionHeaders } from '../GameProperties';
import xit from './xit-registry';
import { createXitAdapter } from '@src/XIT/LegacyXitAdapter';
import user from '@src/store/user';

interface ContractEntry extends PrunApi.Contract {
  FilteredConditions: {
    self: PartyConditions;
    partner: PartyConditions;
  };
  IsFaction: boolean;
  materialConditions: PrunApi.ContractCondition[];
}

interface PartyConditions {
  conditions: PrunApi.ContractCondition[];
  loanInstallment?: LoanInstallment;
}

interface LoanInstallment {
  total: number;
  filled: number;
  type: 'GROUPED_LOAN';
}

export class Contracts {
  private tile: HTMLElement;
  public parameters: string[];
  public pmmgSettings;
  private alive: boolean;

  public name = 'CONTRACTS';

  constructor(tile, parameters, pmmgSettings) {
    this.tile = tile;
    this.parameters = parameters;
    this.pmmgSettings = pmmgSettings;
    this.alive = true;
  }

  create_buffer() {
    clearChildren(this.tile);

    if (user.contracts.length === 0) {
      this.tile.textContent = 'Loading Contract Data...';
      this.tile.id = 'pmmg-reload';
      return;
    }

    const validContracts = user.contracts.filter(c => !invalidContractStatus.includes(c.status));

    const entries: ContractEntry[] = [];

    for (const contract of validContracts) {
      let isFaction = false;
      const materialConditions: PrunApi.ContractCondition[] = [];

      const selfConditions: PartyConditions = {
        conditions: [],
      };
      const partnerConditions: PartyConditions = {
        conditions: [],
      };

      for (const condition of contract.conditions) {
        // Determine if REPUTATION condition type exists to denote Faction contract
        if (condition.type === 'REPUTATION') isFaction = true;

        if (condition.quantity !== null && materialFulfilmentType.includes(condition.type))
          materialConditions.push(condition);

        // Clump loan repayments together
        if (condition.type == 'LOAN_INSTALLMENT') {
          if (condition.party === contract.party) {
            if (selfConditions.loanInstallment) {
              selfConditions.loanInstallment.total += 1;
              if (condition.status == 'FULFILLED') {
                selfConditions.loanInstallment.filled += 1;
              }
            } else {
              selfConditions.loanInstallment = {
                filled: condition.status == 'FULFILLED' ? 1 : 0,
                total: 1,
                type: 'GROUPED_LOAN',
              };
            }
          } else if (partnerConditions.loanInstallment) {
            partnerConditions.loanInstallment.total += 1;
            if (condition.status == 'FULFILLED') {
              partnerConditions.loanInstallment.filled += 1;
            }
          } else {
            partnerConditions.loanInstallment = {
              filled: condition.status == 'FULFILLED' ? 1 : 0,
              total: 1,
              type: 'GROUPED_LOAN',
            };
          }
          continue;
        }

        // Categorize conditions by who fulfills it
        if (condition.party === contract.party) selfConditions.conditions.push(condition);
        else partnerConditions.conditions.push(condition);
      }

      // Sort each category by ConditionIndex
      selfConditions.conditions.sort(conditionSort);
      partnerConditions.conditions.sort(conditionSort);

      entries.push({
        ...contract,
        FilteredConditions: {
          self: selfConditions,
          partner: partnerConditions,
        },
        IsFaction: isFaction,
        materialConditions,
      });
    }

    entries.sort(ContractSort);

    const table = createTable(this.tile, ['Contract ID', 'Material', "Partner's Conditions", 'My Conditions']);
    if (entries.length === 0) {
      const row = createNoContractsRow(4);
      table.appendChild(row);
    } else {
      entries.forEach(contract => {
        const row = createContractRow(contract);
        table.appendChild(row);
      });
    }

    this.update_buffer();
  }

  update_buffer() {
    this.alive = document.body.contains(this.tile);
    if (this.alive) {
      window.setTimeout(() => this.create_buffer(), 3000);
    }
  }
}

const invalidContractStatus = ['FULFILLED', 'BREACHED', 'TERMINATED', 'CANCELLED', 'REJECTED'];

function createContractRow(contract: ContractEntry) {
  const row = document.createElement('tr');

  const contractLink = createLink(contract.name || contract.localId, `CONT ${contract.localId}`);
  const contractIdColumn = document.createElement('td');

  contractIdColumn.appendChild(contract.IsFaction ? factionContract(contractLink) : contractLink);
  row.appendChild(contractIdColumn);

  // const deadlineColumn = document.createElement("td");
  // deadlineColumn.appendChild(createTextSpan(convertDurationToETA(new Date(contract["DateEpochMs"] / 1000).getSeconds())));
  // row.appendChild(deadlineColumn);

  const materialColumn = document.createElement('td');
  materialColumn.style.width = '32px';
  materialColumn.style.paddingLeft = '10px';

  const materialDiv = document.createElement('div');
  materialColumn.appendChild(materialDiv);

  if (contract.materialConditions.length > 0) {
    contract.materialConditions.forEach(materialCondition => {
      if (!materialCondition.quantity || !materialCondition.quantity.material) {
        return;
      }

      const materialElement = createMaterialElement(
        materialCondition.quantity.material.ticker,
        'prun-remove-js',
        materialCondition.quantity.amount.toString(),
        false,
        true,
      );

      if (materialElement) {
        materialElement.style.marginBottom = '4px';
        materialDiv.appendChild(materialElement);
      }
      return;
    });
  }
  row.appendChild(materialColumn);

  const partnerColumn = document.createElement('td');
  let faction;
  if (contract.IsFaction) {
    Object.keys(FactionHeaders).forEach(factionName => {
      if (contract.partner.name.includes(factionName)) {
        faction = FactionHeaders[factionName];
      }
      return;
    });
  }

  if (!faction) {
    let partnerLink;
    if (contract.partner.code) {
      partnerLink = createLink(contract.partner.name, `CO ${contract.partner.code}`);
    } else {
      partnerLink = createTextSpan(contract.preamble);
    }
    partnerColumn.appendChild(partnerLink);
  } else {
    const partnerLink = createLink(contract.partner.name, `FA ${faction}`);
    partnerColumn.appendChild(partnerLink);
  }

  for (const condition of contract.FilteredConditions.partner.conditions)
    partnerColumn.appendChild(conditionStatus(condition));

  // Display grouped loan repayments
  if (contract.FilteredConditions.partner.loanInstallment) {
    partnerColumn.appendChild(conditionStatus(contract.FilteredConditions.partner.loanInstallment));
  }

  row.appendChild(partnerColumn);

  const selfColumn = document.createElement('td');

  for (const condition of contract.FilteredConditions.self.conditions)
    selfColumn.appendChild(conditionStatus(condition));

  // Display grouped loan repayments
  if (contract.FilteredConditions.self.loanInstallment) {
    selfColumn.appendChild(conditionStatus(contract.FilteredConditions.self.loanInstallment));
  }

  row.appendChild(selfColumn);

  return row;
}

function createNoContractsRow(colspan) {
  const line = document.createElement('tr');

  const textColumn = document.createElement('td');
  textColumn.setAttribute('colspan', `${colspan}`);
  textColumn.textContent = 'No contracts';

  line.appendChild(textColumn);

  return line;
}

function conditionSort(a, b) {
  return a.index > b.index ? 1 : -1;
}

function ContractSort(a, b) {
  return (a.date ? a.date.timestamp : 0) > (b.date ? b.date.timestamp : 0) ? 1 : -1;
}

function factionContract(link) {
  const conditionDiv = createTextDiv('');

  const marker = createTextSpan(' ★');
  marker.style.color = TextColors.Yellow;
  marker.style.fontWeight = 'bold';
  marker.style.cursor = 'default';
  marker.title = 'Faction Contract';

  link.style.display = 'inline';

  conditionDiv.appendChild(link);
  conditionDiv.appendChild(marker);

  return conditionDiv;
}

function conditionStatus(condition: LoanInstallment | PrunApi.ContractCondition) {
  const conditionDiv = createTextDiv('');

  if (condition.type == 'GROUPED_LOAN') {
    const marker = createTextSpan(
      `${condition.filled.toLocaleString(undefined, { maximumFractionDigits: 0 })}/${condition.total.toLocaleString(
        undefined,
        { maximumFractionDigits: 0 },
      )}`,
    );

    marker.style.fontWeight = 'bold';
    conditionDiv.appendChild(marker);
  } else {
    const marker = createTextSpan(condition.status === 'FULFILLED' ? '✓' : 'X');
    marker.style.color = condition.status === 'FULFILLED' ? TextColors.Success : TextColors.Failure;
    marker.style.fontWeight = 'bold';

    conditionDiv.appendChild(marker);
  }

  const text = friendlyConditionText[condition.type] ? friendlyConditionText[condition.type] : condition.type;
  const textSpan = createTextSpan(` ${text}`);

  conditionDiv.appendChild(textSpan);

  return conditionDiv;
}

const friendlyConditionText = {
  COMEX_PURCHASE_PICKUP: 'Material Pickup',
  DELIVERY: 'Delivery',
  DELIVERY_SHIPMENT: 'Deliver Shipment',
  EXPLORATION: 'Exploration',
  REPUTATION: 'Reputation',
  PAYMENT: 'Payment',
  PICKUP_SHIPMENT: 'Pickup Shipment',
  PROVISION_SHIPMENT: 'Provision',
  PROVISION: 'Provision',
  LOAN_PAYOUT: 'Loan Payout',
  LOAN_INSTALLMENT: 'Loan Installment',
  POWER: 'Become Governor',
  GROUPED_LOAN: 'Loan Installment',
};

const materialFulfilmentType = ['DELIVERY', 'DELIVERY_SHIPMENT', 'PROVISION_SHIPMENT', 'COMEX_PURCHASE_PICKUP'];

xit.add({
  command: ['CONTS', 'CONTRACTS'],
  name: 'CONTRACTS',
  component: createXitAdapter(Contracts),
});
