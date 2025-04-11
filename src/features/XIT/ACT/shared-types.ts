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

export interface ActionStepGenerateContext<TConfig>
  extends ActionRunnerContext<UserData.ActionData> {
  config: TConfig;
  fail: () => void;
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
  complete: () => void;
  fail: () => void;
  requestTile: (Command: string) => Promise<PrunTile | undefined>;
}

export const configurableValue = 'Configure on Execution';
