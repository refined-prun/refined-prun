import { Logger } from '@src/features/XIT/ACT/runner/logger';

export interface ActionPackageConfig {
  materialGroups: Record<string, unknown>[];
  actions: Record<string, unknown>[];
}

export interface ActionStep {
  type: string;
}

export interface ActionRunnerContext<T> {
  data: T;
  log: Logger;
}

export interface MaterialGroupGenerateContext<TConfig>
  extends ActionRunnerContext<UserData.MaterialGroupData> {
  config: TConfig;
  setStatus: (status: string) => void;
}

// Prices are per unit in the currency of the action's target exchange.
export type MaterialBill = Record<string, { quantity: number; price?: number }>;

export function materialBillFromQuantities(quantities: Record<string, number>): MaterialBill {
  const materials: MaterialBill = {};
  for (const ticker in quantities) {
    materials[ticker] = { quantity: quantities[ticker] };
  }
  return materials;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AssertFn = (condition: any, message: string) => asserts condition;

export interface ActionStepGenerateContext<TConfig>
  extends ActionRunnerContext<UserData.ActionData> {
  config: TConfig;
  packageName: string;
  preview: boolean;
  fail: (message?: string) => void;
  assert: AssertFn;
  getMaterialGroup: (name: string | undefined) => Promise<MaterialBill | undefined>;
  getMaterialGroupPlanet: (name: string | undefined) => string | undefined;
  emitStep: (step: ActionStep) => void;
  state: {
    WAR: {
      [exchange: string]: {
        [mat: string]: number;
      };
    };
    // Reserve ids across actions during generation, before any posts update channel history.
    reservedAgentIds: Set<string>;
  };
}

export interface WaitActOptions {
  actDelayMs?: number;
}

export interface ActionStepExecuteContext<T> extends ActionRunnerContext<T> {
  // False once an earlier step of this type has started; spacing delays skip the first step.
  isFirstOfType: boolean;
  setStatus: (status: string) => void;
  waitAct: (status?: string, opts?: WaitActOptions) => Promise<void>;
  waitActionFeedback: (tile: PrunTile) => Promise<void>;
  cacheDescription: () => void;
  complete: () => void;
  skip: (opts?: { silent?: boolean }) => void;
  fail: (message?: string) => never;
  assert: AssertFn;
  requestTile: (command: string, opts?: WaitActOptions) => Promise<PrunTile | undefined>;
}

export const configurableValue = 'Configure on Execution';
export const groupTargetPrefix = 'group:';
