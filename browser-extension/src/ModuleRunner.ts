import { showBuffer, getBuffers } from './util';
import { FriendlyNames } from './GameProperties';
import { Selector } from './Selector';
import { saveSettings, Settings } from './Settings';

export interface Module {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,no-unused-vars
  run(buffers: any[]);

  cleanup();

  frequency?: number;
}

interface ModuleEntry {
  module: Module;
  name: string;
  friendlyName: string;
  enabled: boolean;
  count: number;
  cleanupTime: number;
  runTime: number;
}

export class ModuleRunner {
  private readonly modules: ModuleEntry[]; // The list of features run by the extension
  private result: Settings; // The stored settings
  private iteration;

  constructor(modules: Module[], result: Settings) {
    // Construct global variables
    this.iteration = 0;
    this.modules = modules.map(m => this.moduleToME(m));
    this.result = result;
    this.updateActiveModules(result);
  }

  // Enable or disable features based on settings preference
  private updateActiveModules(result) {
    if (result['PMMGExtended']['disabled'] == undefined) {
      return;
    }
    this.modules.forEach(mp => {
      if (result['PMMGExtended']['disabled'] && result['PMMGExtended']['disabled'].includes(mp.name)) {
        mp.enabled = false;
      }
    });
  }

  private moduleToME(module: Module): ModuleEntry {
    return {
      module,
      name: module.constructor.name,
      friendlyName: FriendlyNames[module.constructor.name] || module.constructor.name,
      enabled: true,
      count: 0,
      cleanupTime: 0,
      runTime: 0,
    };
  }

  loop() {
    // Gets all buffers
    const bufferDivs = getBuffers('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffers = [] as any[];
    bufferDivs.forEach(buffer => {
      const header = buffer.querySelector(Selector.BufferHeader);
      if (!header) {
        return;
      }

      const parameters = header.textContent;

      buffers.push([parameters, buffer]);
    });

    // Action testing
    /*
    const mtra = getBuffers("MTRA");
      if(mtra && mtra[0])
      {
          const x = (mtra[0].getElementsByClassName("MaterialSelector__suggestionsContainer___ugUNHkA")[0].children[0]);
          if(x)
          {
              console.log(x.children[0]);
              x.children[0].click();
          }
      }*/

    // Run intro if it hasn't run already
    if (!this.result.PMMGExtended.loaded_before) {
      this.result.PMMGExtended.loaded_before = showBuffer('XIT START');
      if (this.result.PMMGExtended.loaded_before) {
        saveSettings(this.result);
      }
    }

    // For each module, run it, clean it, and measure its performance
    this.modules.map(entry => {
      if (entry.enabled && (!entry.module.frequency || this.iteration % entry.module.frequency == 0)) {
        const t0 = performance.now();
        entry.module.cleanup();
        const cleanupTime = performance.now() - t0;
        const t1 = performance.now();
        entry.module.run(buffers);
        const runTime = performance.now() - t1;
        entry.count++;
        entry.cleanupTime += cleanupTime;
        entry.runTime += runTime;
      }
    });

    this.iteration++;

    // @TODO: Vary the interval based on module performance
    window.setTimeout(() => this.loop(), 250);
  }
}
