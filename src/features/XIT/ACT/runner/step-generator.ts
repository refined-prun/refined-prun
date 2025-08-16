import { ActionPackageConfig, ActionStep } from '@src/features/XIT/ACT/shared-types';
import { Logger } from '@src/features/XIT/ACT/runner/logger';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { exchangesStore } from '@src/infrastructure/prun-api/data/exchanges';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { act } from '@src/features/XIT/ACT/act-registry';

interface StepGeneratorOptions {
  log: Logger;
  onStatusChanged: (status: string) => void;
}

const AssertionError = new Error('Assertion failed');

export class StepGenerator {
  constructor(private options: StepGeneratorOptions) {}

  get log() {
    return this.options.log;
  }

  async generateSteps(pkg: UserData.ActionPackageData, config: ActionPackageConfig) {
    const state = generateState();
    const steps = [] as ActionStep[];
    let fail = false;
    for (const action of pkg.actions) {
      const info = act.getActionInfo(action.type);
      if (!info) {
        continue;
      }
      const actionConfig = config.actions[action.name!] ?? {};
      const log = new Logger((tag, message) =>
        this.log.logMessage(tag, `[${action.name}] ${message}`),
      );
      try {
        await info.generateSteps({
          data: action,
          config: actionConfig,
          log,
          fail: message => {
            if (message) {
              log.error(message);
            }
            fail = true;
          },
          assert: (condition, message) => {
            if (!condition) {
              log.error(message);
              throw AssertionError;
            }
          },
          emitStep: step => steps.push(step),
          getMaterialGroup: async name => await this.getMaterialGroup(pkg, config, name),
          state,
        });
      } catch (e) {
        if (e !== AssertionError) {
          this.log.runtimeError(e);
        }
        fail = true;
      }

      if (fail) {
        break;
      }
    }
    if (steps.length === 0) {
      this.log.error('No actions were generated');
      fail = true;
    }
    return { steps, fail };
  }

  private async getMaterialGroup(
    pkg: UserData.ActionPackageData,
    config: ActionPackageConfig,
    name: string | undefined,
  ) {
    if (!name) {
      this.log.error('Missing material group');
    }
    const group = pkg.groups.find(x => x.name === name);
    if (!group) {
      this.log.error('Unrecognized material group');
      return undefined;
    }

    const info = act.getMaterialGroupInfo(group.type);
    if (!info) {
      this.log.error('Unrecognized material group type');
      return undefined;
    }

    this.options.onStatusChanged(`Generating material bill for ${group.name}...`);
    const groupConfig = config.materialGroups[name!] ?? {};
    return await info.generateMaterialBill({
      data: group,
      config: groupConfig,
      log: new Logger((tag, message) => this.log.logMessage(tag, `[${group.name}] ${message}`)),
      setStatus: status => this.options.onStatusChanged(status),
    });
  }
}

function generateState() {
  const war = {} as Record<string, Record<string, number>>;
  for (const ticker of ['AI1', 'CI1', 'CI2', 'IC1', 'NC1', 'NC2']) {
    war[ticker] = {};
    const naturalId = exchangesStore.getNaturalIdFromCode(ticker);
    const warehouse = warehousesStore.getByEntityNaturalId(naturalId);
    const inv = storagesStore.getById(warehouse?.storeId);

    if (inv) {
      for (const mat of inv.items) {
        const quantity = mat.quantity;
        if (quantity) {
          war[ticker][quantity.material.ticker] = quantity.amount;
        }
      }
    }
  }
  return {
    WAR: war,
  };
}
