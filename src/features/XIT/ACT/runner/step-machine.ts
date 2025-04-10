import { act } from '@src/features/XIT/ACT/act-registry';
import { ActionStep } from '@src/features/XIT/ACT/shared-types';
import { Logger } from '@src/features/XIT/ACT/runner/logger';
import { TileAllocator } from '@src/features/XIT/ACT/runner/tile-allocator';
import { clickElement } from '@src/util';

interface StepMachineOptions {
  tile: PrunTile;
  log: Logger;
  tileAllocator: TileAllocator;
  onBufferSplit: () => void;
  onStart: () => void;
  onEnd: () => void;
  onStatusChanged: (status: string) => void;
  onActReady: () => void;
}

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
    this.loadNext();
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
    this.log.warning(`Skipped ${info.description(next)}`);
    this.nextAct = undefined;
    this.loadNext();
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

  private loadNext() {
    if (this.steps.length === 0) {
      this.log.success('Action Package execution completed');
      this.stop();
      return;
    }
    this.next = this.steps.shift()!;
    const info = act.getActionStepInfo(this.next.type);
    info.execute({
      data: this.next,
      log: this.options.log,
      setStatus: status => this.options.onStatusChanged(status),
      waitAct: async status => {
        status ??= info.description(this.next);
        await this.waitAct(status);
      },
      waitActionFeedback: async tile => {
        this.options.onStatusChanged('Waiting for action feedback...');
        const error = await waitActionFeedback(tile);
        if (error) {
          this.log.error(`Action failed: ${error}`);
          this.stop();
          return;
        }
      },
      complete: () => {
        this.log.success(info.description(this.next));
        this.loadNext();
      },
      fail: () => {
        this.log.error('Action Package execution failed');
        this.stop();
        return;
      },
      requestTile: async command => await this.requestTile(command),
    });
  }

  private async requestTile(command: string) {
    let tile = tiles.find(command, true)[0];
    if (tile) {
      return tile;
    }
    await this.waitAct(`Open ${command}`);
    this.options.onStatusChanged(`Opening ${command}...`);
    tile = await this.options.tileAllocator.requestTile(command);
    if (!tile) {
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

async function waitActionFeedback(tile: PrunTile) {
  const overlay = await $(tile.frame, C.ActionFeedback.overlay);
  await waitActionProgress(overlay);
  if (overlay.classList.contains(C.ActionConfirmationOverlay.container)) {
    const confirm = _$$(overlay, C.Button.btn)[1];
    if (!confirm) {
      return 'Confirmation overlay is missing confirm button';
    }
    await clickElement(confirm);
    await waitActionProgress(overlay);
  }
  if (overlay.classList.contains(C.ActionFeedback.success)) {
    await clickElement(overlay);
    return;
  }
  if (overlay.classList.contains(C.ActionFeedback.error)) {
    const message = _$(overlay, C.ActionFeedback.message)?.textContent;
    const dismiss = _$(overlay, C.ActionFeedback.dismiss)?.textContent;
    return dismiss ? message?.replace(dismiss, '') : message;
  }

  return 'Unknown action feedback overlay';
}

async function waitActionProgress(overlay: HTMLElement) {
  if (!overlay.classList.contains(C.ActionFeedback.progress)) {
    return;
  }
  await new Promise<void>(resolve => {
    const mutationObserver = new MutationObserver(() => {
      if (!overlay.classList.contains(C.ActionFeedback.progress)) {
        mutationObserver.disconnect();
        resolve();
      }
    });
    mutationObserver.observe(overlay, { attributes: true });
  });
}
