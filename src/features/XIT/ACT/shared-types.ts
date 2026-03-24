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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AssertFn = (condition: any, message: string) => asserts condition;

export interface ActionStepGenerateContext<TConfig>
  extends ActionRunnerContext<UserData.ActionData> {
  config: TConfig;
  fail: (message?: string) => void;
  assert: AssertFn;
  getMaterialGroup: (name: string | undefined) => Promise<Record<string, number> | undefined>;
  emitStep: (step: ActionStep) => void;
  state: {
    WAR: {
      [exchange: string]: {
        [mat: string]: number;
      };
    };
  };
}

export interface ActionStepExecuteContext<T> extends ActionRunnerContext<T> {
  setStatus: (status: string) => void;
  waitAct: (status?: string) => Promise<void>;
  waitActionFeedback: (tile: PrunTile) => Promise<void>;
  cacheDescription: () => void;
  complete: () => void;
  skip: () => void;
  fail: (message?: string) => void;
  assert: AssertFn;
  requestTile: (Command: string) => Promise<PrunTile | undefined>;
}

export const configurableValue = 'Configure on Execution';
