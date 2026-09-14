import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createNewDraft, saveConditions, saveDraftDetails } from './cont-utils';
import type { ActionStepExecuteContext } from '../shared-types';
import { Logger } from '../runner/logger';

const mocks = vi.hoisted(() => ({
  click: vi.fn(),
  select: vi.fn(),
  selectAll: vi.fn(),
  getDraft: vi.fn(),
  drafts: { value: [] as PrunApi.ContractDraft[] },
}));

vi.mock('@src/util', () => ({
  clickElement: mocks.click,
  changeSelectIndex: vi.fn(),
  changeTextAreaValue: vi.fn(),
  focusElement: vi.fn(),
  selectAndChangeInputValue: vi.fn(),
  selectMaterialInMaterialSelector: vi.fn(),
}));
vi.mock('@src/utils/select-dom', () => ({ _$: mocks.select, _$$: mocks.selectAll }));
vi.mock('@src/infrastructure/prun-api/data/contract-drafts', () => ({
  contractDraftsStore: { all: mocks.drafts, getByNaturalId: mocks.getDraft },
}));
vi.mock('@src/infrastructure/prun-ui/prun-css', () => ({
  C: { Button: { btn: 'button', disabled: 'disabled' } },
}));
vi.mock('@src/infrastructure/prun-ui/i18n', () => ({
  L: {
    ContractDrafts: { actions: { create: () => 'Create New' } },
    ContractDraft: { action: { save: () => 'Save' } },
    ContractDraftSend: { action: { save: () => 'Save conditions' } },
  },
}));

const tile = { anchor: {} } as PrunTile;

function draft(name = 'Saved name') {
  return {
    naturalId: 'DRAFT',
    name,
    preamble: 'Saved preamble',
    status: 'VALID',
    conditions: [{}],
  } as PrunApi.ContractDraft;
}

function context() {
  return {
    data: {},
    log: new Logger(vi.fn()),
    isFirstOfType: true,
    setStatus: vi.fn(),
    waitAct: vi.fn(),
    waitActionFeedback: vi.fn(),
    cacheDescription: vi.fn(),
    complete: vi.fn(),
    skip: vi.fn(),
    fail: message => {
      throw new Error(message);
    },
    assert: (condition, message) => {
      if (!condition) {
        throw new Error(message);
      }
    },
    requestTile: vi.fn(),
  } satisfies ActionStepExecuteContext<unknown>;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.resetAllMocks();
  mocks.drafts.value = [];
  const before = draft('Old name');
  mocks.getDraft.mockReturnValue(before);
  mocks.selectAll.mockReturnValue(
    ['Create New', 'Save', 'Save conditions'].map(textContent => ({
      textContent,
      classList: { contains: () => false },
    })),
  );
  mocks.select.mockImplementation((_anchor, selector) => ({
    value: selector === 'input' ? 'Saved name' : 'Saved preamble',
  }));
});

afterEach(() => vi.useRealTimers());

const operations = [
  ['create', (ctx: ActionStepExecuteContext<unknown>) => createNewDraft(ctx, tile)],
  [
    'save details',
    (ctx: ActionStepExecuteContext<unknown>) => saveDraftDetails(ctx, tile, 'DRAFT'),
  ],
  [
    'save conditions',
    (ctx: ActionStepExecuteContext<unknown>) => saveConditions(ctx, tile, 'DRAFT'),
  ],
] as const;

describe('contract draft action feedback', () => {
  it.each(operations)(
    '%s waits for feedback and then checks the saved draft',
    async (_name, run) => {
      const ctx = context();
      const saved = draft();
      ctx.waitActionFeedback.mockImplementation(async () => {
        expect(mocks.click).toHaveBeenCalledOnce();
        mocks.drafts.value = [saved];
        mocks.getDraft.mockReturnValue(saved);
      });

      await run(ctx);

      expect(ctx.waitActionFeedback).toHaveBeenCalledExactlyOnceWith(tile);
      expect(vi.getTimerCount()).toBe(0);
    },
  );

  it.each(operations)(
    '%s stops on feedback failure without polling for a missing save',
    async (_name, run) => {
      const ctx = context();
      ctx.waitActionFeedback.mockRejectedValue(new Error('Server rejected the action'));

      await expect(run(ctx)).rejects.toThrow('Server rejected the action');

      expect(mocks.click).toHaveBeenCalledOnce();
      expect(vi.getTimerCount()).toBe(0);
    },
  );

  it('does not accept success feedback without the saved draft details', async () => {
    const ctx = context();
    const result = expect(saveDraftDetails(ctx, tile, 'DRAFT')).rejects.toThrow(
      'Draft details were not saved',
    );

    await vi.runAllTimersAsync();
    await result;

    expect(ctx.waitActionFeedback).toHaveBeenCalledOnce();
  });
});
