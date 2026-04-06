import { act } from '@src/features/XIT/ACT/act-registry';
import { ActionStep } from '@src/features/XIT/ACT/shared-types';
import { Logger } from '@src/features/XIT/ACT/runner/logger';
import { TileAllocator } from '@src/features/XIT/ACT/runner/tile-allocator';
import { sleep } from '@src/utils/sleep';
import { waitActionFeedback } from '@src/utils/action-feedback';

interface StepMachineOptions {
  tile: PrunTile;
  log: Logger;
  tileAllocator: TileAllocator;
  onBufferSplit: () => void;
  onStart: () => void;
  onEnd: () => void;
  onStatusChanged: (status: string, keepReady?: boolean) => void;
  onActReady: () => void;
}

const AssertionError = new Error('Assertion failed');

export class StepMachine {
  private next?: ActionStep;
  private nextAct?: () => void;

  constructor(
    private steps: ActionStep[],
    private options: StepMachineOptions,
  ) {}

  get isRunning() {
    return this.next !== undefined;
  }

  get log() {
    return this.options.log;
  }

  start() {
    this.options.onStart();
    void this.startNext();
  }

  act() {
    if (!this.ensureRunning()) {
      return;
    }
    const nextAct = this.nextAct;
    this.nextAct = undefined;
    nextAct?.();
  }

  skip() {
    if (!this.ensureRunning()) {
      return;
    }
    const next = this.next;
    if (!next) {
      return;
    }
    const info = act.getActionStepInfo(next.type);
    this.log.skip(info.description(next));
    this.nextAct = undefined;
    void this.startNext();
  }

  cancel() {
    if (!this.ensureRunning()) {
      return;
    }
    this.log.cancel('Action Package execution canceled');
    this.stop();
  }

  stop() {
    this.next = undefined;
    this.nextAct = undefined;
    this.options.onEnd();
  }

  private async startNext() {
    if (this.steps.length === 0) {
      this.log.success('Action Package execution completed');
      this.stop();
      return;
    }
    const next = this.steps.shift()!;
    this.next = next;
    const info = act.getActionStepInfo(next.type);
    let description: string | undefined;
    const log = this.options.log;
    try {
      await info.execute({
        data: next,
        log,
        setStatus: status => this.options.onStatusChanged(status),
        waitAct: async status => {
          status ??= description ?? info.description(next);
          await this.waitAct(status);
        },
        waitActionFeedback: async tile => {
          this.options.onStatusChanged('Waiting for action feedback...');
          const error = await waitActionFeedback(tile.frame);
          if (error) {
            log.error(error);
            log.error(description ?? info.description(next));
            log.error('Action Package execution failed');
            this.stop();
            return;
          }
        },
        cacheDescription: () => {
          description = info.description(next);
          this.options.onStatusChanged(description, true);
        },
        complete: async () => {
          // Wait a moment to allow data to update.
          await sleep(0);
          log.success(description ?? info.description(next));
          void this.startNext();
        },
        skip: () => this.skip(),
        fail: message => {
          if (message) {
            log.error(message);
          }
          log.error('Action Package execution failed');
          this.stop();
          return;
        },
        assert: (condition, message) => {
          if (!condition) {
            log.error(message);
            throw AssertionError;
          }
        },
        requestTile: async command => await this.requestTile(command),
      });
    } catch (e) {
      if (e !== AssertionError) {
        log.runtimeError(e);
      }
      this.stop();
    }
  }

  private async requestTile(command: string) {
    let tile = tiles.find(command, true)[0];
    if (tile !== undefined) {
      return tile;
    }
    await this.waitAct(`Open ${command}`);
    this.options.onStatusChanged(`Opening ${command}...`);
    tile = await this.options.tileAllocator.requestTile(command);
    if (tile === undefined) {
      this.log.error(`Failed to open ${command}`);
      this.stop();
    }
    return tile;
  }

  private async waitAct(status: string) {
    this.options.onStatusChanged(status);
    this.options.onActReady();
    await new Promise<void>(resolve => (this.nextAct = resolve));
  }

  private ensureRunning() {
    if (!this.isRunning) {
      this.log.error('Action Package is not running');
    }
    return this.isRunning;
  }
}
