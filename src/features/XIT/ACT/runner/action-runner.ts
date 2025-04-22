import { act } from '@src/features/XIT/ACT/act-registry';
import { deepToRaw } from '@src/utils/deep-to-raw';
import { Logger } from '@src/features/XIT/ACT/runner/logger';
import { TileAllocator } from '@src/features/XIT/ACT/runner/tile-allocator';
import { StepMachine } from '@src/features/XIT/ACT/runner/step-machine';
import { StepGenerator } from '@src/features/XIT/ACT/runner/step-generator';
import { ActionPackageConfig } from '@src/features/XIT/ACT/shared-types';

interface ActionRunnerOptions {
  tile: PrunTile;
  log: Logger;
  onBufferSplit: () => void;
  onStart: () => void;
  onEnd: () => void;
  onStatusChanged: (status: string) => void;
  onActReady: () => void;
}

export class ActionRunner {
  private readonly tileAllocator: TileAllocator;
  private readonly stepGenerator: StepGenerator;
  private stepMachine?: StepMachine;

  constructor(private options: ActionRunnerOptions) {
    this.tileAllocator = new TileAllocator(options);
    this.stepGenerator = new StepGenerator(options);
  }

  get log() {
    return this.options.log;
  }

  get isRunning() {
    return this.stepMachine?.isRunning ?? false;
  }

  async preview(pkg: UserData.ActionPackageData, config: ActionPackageConfig) {
    if (this.isRunning) {
      this.log.error('Action Package is already running');
      return;
    }
    // Create a copy to prevent changes during execution.
    const copy = structuredClone(deepToRaw(pkg));
    const { steps, fail } = await this.stepGenerator.generateSteps(copy, config);
    if (steps.length === 0) {
      return;
    }
    if (fail) {
      this.log.info('Generated steps for valid actions:');
    }
    for (const step of steps) {
      const stepInfo = act.getActionStepInfo(step.type);
      this.log.action(stepInfo.description(step));
    }
  }

  async execute(pkg: UserData.ActionPackageData, config: ActionPackageConfig) {
    if (this.isRunning) {
      this.log.error('Action Package is already running');
      return;
    }
    // Create a copy to prevent changes during execution.
    const copy = structuredClone(deepToRaw(pkg));
    const { steps, fail } = await this.stepGenerator.generateSteps(copy, config);
    if (fail) {
      this.log.error('Action Package execution failed');
      return;
    }
    this.log.info('Action Package execution started');
    this.stepMachine = new StepMachine(steps, {
      ...this.options,
      tileAllocator: this.tileAllocator,
    });
    this.stepMachine.start();
  }

  act() {
    this.stepMachine?.act();
    if (!this.stepMachine?.isRunning) {
      this.stepMachine = undefined;
    }
  }

  skip() {
    this.stepMachine?.skip();
    if (!this.stepMachine?.isRunning) {
      this.stepMachine = undefined;
    }
  }

  cancel() {
    this.stepMachine?.cancel();
    this.stepMachine = undefined;
  }
}
