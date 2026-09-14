import { act } from '@src/features/XIT/ACT/act-registry';
import { ActionStep, WaitActOptions } from '@src/features/XIT/ACT/shared-types';
import { Logger } from '@src/features/XIT/ACT/runner/logger';
import { TileAllocator } from '@src/features/XIT/ACT/runner/tile-allocator';
import { waitActionFeedback } from '@src/infrastructure/prun-ui/utils/action-feedback';
import { sleep } from '@src/utils/sleep';
import { closeAgentChannelSession } from '@src/infrastructure/prun-ui/agent-channel-messaging';

interface StepMachineOptions {
  tile: PrunTile;
  log: Logger;
  tileAllocator: TileAllocator;
  onBufferSplit: () => void;
  onStart: () => void;
  onEnd: () => void;
  onStatusChanged: (status: string, keepReady?: boolean) => void;
  onActReady: () => void;
  onSkipReady: () => void;
}

const AssertionError = new Error('Assertion failed');
const ExecutionStopped = new Error('Execution stopped');
const actionFeedbackTimeoutMs = 30_000;

export class StepMachine {
  private next?: ActionStep;
  private nextAct?: () => void;
  // Track started step types so spacing delays do not apply to the first of each type.
  private startedStepTypes = new Set<string>();

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

  skip(opts?: { silent?: boolean }) {
    if (!this.ensureRunning()) {
      return;
    }
    const next = this.next;
    if (!next) {
      return;
    }
    if (!opts?.silent) {
      const info = act.getActionStepInfo(next.type);
      this.log.skip(info.description(next));
    }
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
    closeAgentChannelSession();
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
    const isFirstOfType = !this.startedStepTypes.has(next.type);
    this.startedStepTypes.add(next.type);
    const info = act.getActionStepInfo(next.type);
    let description: string | undefined;
    const log = this.options.log;
    try {
      await info.execute({
        data: next,
        log,
        isFirstOfType,
        setStatus: status => this.options.onStatusChanged(status),
        waitAct: async (status, opts) => {
          if (this.next !== next) {
            throw ExecutionStopped;
          }

          status ??= description ?? info.description(next);
          await this.waitAct(status, opts);
        },
        waitActionFeedback: async tile => {
          this.options.onStatusChanged('Waiting for action feedback...');
          const { result, message } = await waitActionFeedback(tile.frame, {
            autoConfirm: true,
            dismissSuccess: true,
            timeoutMs: actionFeedbackTimeoutMs,
          });
          if (result === 'cancel') {
            log.cancel('Action Package execution canceled');
            this.stop();
            throw ExecutionStopped;
          }
          if (result === 'error') {
            log.error(message);
            log.error(description ?? info.description(next));
            log.error('Action Package execution failed');
            this.stop();
            throw ExecutionStopped;
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
        skip: opts => this.skip(opts),
        fail: message => {
          if (message) {
            log.error(message);
          }
          log.error('Action Package execution failed');
          this.stop();
          throw ExecutionStopped;
        },
        assert: (condition, message) => {
          if (!condition) {
            log.error(message);
            throw AssertionError;
          }
        },
        requestTile: async (command, opts) => await this.requestTile(command, opts),
      });
    } catch (e) {
      if (e === ExecutionStopped) {
        return;
      }
      if (e !== AssertionError) {
        log.runtimeError(e);
      }
      this.stop();
    }
  }

  private async requestTile(command: string, opts?: WaitActOptions) {
    let tile = tiles.find(command, true)[0];
    if (tile !== undefined) {
      return tile;
    }
    await this.waitAct(`Open ${command}`, opts);
    this.options.onStatusChanged(`Opening ${command}...`);
    tile = await this.options.tileAllocator.requestTile(command);
    if (tile === undefined) {
      this.log.error(`Failed to open ${command}`);
      this.stop();
      throw ExecutionStopped;
    }
    return tile;
  }

  private async waitAct(status: string, opts?: WaitActOptions) {
    this.options.onStatusChanged(status);
    const promise = new Promise<void>(resolve => (this.nextAct = resolve));
    const actDelayMs = opts?.actDelayMs ?? 0;
    if (actDelayMs > 0) {
      // SKIP/CANCEL work during the delay; ACT stays grayed until it elapses.
      this.options.onSkipReady();
      const armed = this.nextAct;
      await sleep(actDelayMs);
      if (this.nextAct === armed) {
        this.options.onActReady();
      }
    } else {
      this.options.onActReady();
    }
    await promise;
  }

  private ensureRunning() {
    if (!this.isRunning) {
      this.log.error('Action Package is not running');
    }
    return this.isRunning;
  }
}
