import { act } from '@src/features/XIT/ACT/act-registry';
import { deepToRaw } from '@src/utils/deep-to-raw';
import { Logger } from '@src/features/XIT/ACT/runner/logger';
import { TileAllocator } from '@src/features/XIT/ACT/runner/tile-allocator';
import { StepMachine } from '@src/features/XIT/ACT/runner/step-machine';
import { StepGenerator } from '@src/features/XIT/ACT/runner/step-generator';
import { ActionPackageConfig, ActionStep } from '@src/features/XIT/ACT/shared-types';
import { materialsStore } from '@src/infrastructure/prun-api/data/materials';
import { fixed02 } from '@src/utils/format';
import { LogPart } from '@src/features/XIT/ACT/runner/logger';

interface ActionRunnerOptions {
  tile: PrunTile;
  log: Logger;
  onBufferSplit: () => void;
  onStart: () => void;
  onEnd: () => void;
  onStatusChanged: (status: string, keepReady?: boolean) => void;
  onActReady: () => void;
  onSkipReady: () => void;
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

  async preview(
    pkg: UserData.ActionPackageData,
    config: ActionPackageConfig,
    extraSteps?: ActionStep[],
  ) {
    if (this.isRunning) {
      this.log.error('Action Package is already running');
      return;
    }
    // Create a copy to prevent changes during execution.
    const copy = structuredClone(deepToRaw(pkg));
    const { steps, fail } = await this.stepGenerator.generateSteps(copy, config, true);
    if (!fail && extraSteps && extraSteps.length > 0) {
      steps.push(...extraSteps);
    }
    if (steps.length === 0) {
      return;
    }
    this.log.info(formatTotals(steps));
    if (fail) {
      this.log.info('Generated steps for valid actions:');
    }
    for (const step of steps) {
      const stepInfo = act.getActionStepInfo(step.type);
      this.log.action(stepInfo.description(step));
    }
  }

  async execute(
    pkg: UserData.ActionPackageData,
    config: ActionPackageConfig,
    extraSteps?: ActionStep[],
  ) {
    if (this.isRunning) {
      this.log.error('Action Package is already running');
      return;
    }
    // Create a copy to prevent changes during execution.
    const copy = structuredClone(deepToRaw(pkg));
    const { steps, fail } = await this.stepGenerator.generateSteps(copy, config, false);
    if (fail) {
      this.log.error('Action Package execution failed');
      return;
    }
    if (extraSteps && extraSteps.length > 0) {
      steps.push(...extraSteps);
    }
    this.log.info('Action Package execution started');
    this.log.info(formatTotals(steps));
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

function formatTotals(steps: ActionStep[]): LogPart[] {
  const aggregated: Record<string, number> = {};
  for (const step of steps) {
    const info = act.getActionStepInfo(step.type);
    const mats = info.totalMaterials?.(step);
    if (mats) {
      for (const [ticker, amount] of Object.entries(mats)) {
        aggregated[ticker] = (aggregated[ticker] ?? 0) + amount;
      }
    }
  }
  let totalWeight = 0;
  let totalVolume = 0;
  for (const [ticker, amount] of Object.entries(aggregated)) {
    const mat = materialsStore.getByTicker(ticker);
    if (mat) {
      totalWeight += mat.weight * amount;
      totalVolume += mat.volume * amount;
    }
  }
  return [
    { text: 'Total Weight ' },
    { text: `${fixed02(totalWeight)}t`, yellow: true },
    { text: ', Total Volume ' },
    { text: `${fixed02(totalVolume)}m³`, yellow: true },
  ];
}
