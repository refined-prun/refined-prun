import {
  ActionStep,
  ActionStepExecuteContext,
  ActionStepGenerateContext,
  MaterialGroupGenerateContext,
} from '@src/features/XIT/ACT/shared-types';

interface MaterialGroupInfo<TConfig> {
  type: UserData.MaterialGroupType;
  description: (data: UserData.MaterialGroupData, config?: TConfig) => string;
  editComponent: Component;
  configureComponent?: Component;
  needsConfigure?: (data: UserData.MaterialGroupData) => boolean;
  isValidConfig?: (data: UserData.MaterialGroupData, config: TConfig) => boolean;
  generateMaterialBill: (
    ctx: MaterialGroupGenerateContext<TConfig>,
  ) => Promise<Record<string, number> | undefined>;
}

const materialGroups: MaterialGroupInfo<unknown>[] = [];

function addMaterialGroup<TConfig>(info: MaterialGroupInfo<TConfig>) {
  materialGroups.push(info as MaterialGroupInfo<unknown>);
}

function getMaterialGroupInfo(type: UserData.MaterialGroupType) {
  return materialGroups.find(x => x.type === type);
}

function getMaterialGroupTypes() {
  return materialGroups.map(x => x.type);
}

interface ActionInfo<TConfig> {
  type: UserData.ActionType;
  description: (data: UserData.ActionData, config?: TConfig) => string;
  editComponent: Component;
  configureComponent?: Component;
  needsConfigure?: (data: UserData.ActionData) => boolean;
  isValidConfig?: (data: UserData.ActionData, config: TConfig) => boolean;
  generateSteps: (ctx: ActionStepGenerateContext<TConfig>) => Promise<void>;
}

const actions: ActionInfo<unknown>[] = [];

function addAction<TConfig>(info: ActionInfo<TConfig>) {
  actions.push(info as ActionInfo<unknown>);
}

function getActionInfo(type: UserData.ActionType) {
  return actions.find(x => x.type === type);
}

function getActionTypes() {
  return actions.map(x => x.type);
}

interface ActionStepInfo<T> {
  type: string;
  preProcessData?: (data: T) => T;
  description: (data: T) => string;
  execute: (ctx: ActionStepExecuteContext<T>) => Promise<void>;
}

const actionSteps: ActionStepInfo<unknown>[] = [];

function addActionStep<T>(info: ActionStepInfo<T>) {
  actionSteps.push(info as ActionStepInfo<unknown>);
  return (data: T) => {
    return {
      ...(info.preProcessData?.(data) ?? data),
      type: info.type,
    } as T & ActionStep;
  };
}

function getActionStepInfo(type: string) {
  // Use ! operator here because there is a runtime guarantee
  // that all action steps have existing type (see addActionStep).
  return actionSteps.find(x => x.type === type)!;
}

export const act = {
  addMaterialGroup,
  getMaterialGroupInfo,
  getMaterialGroupTypes,
  addAction,
  getActionInfo,
  getActionTypes,
  addActionStep,
  getActionStepInfo,
};
