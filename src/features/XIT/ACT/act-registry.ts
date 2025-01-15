interface MaterialGroupInfo {
  type: UserData.MaterialGroupType;
  description: (data: UserData.MaterialGroupData) => string;
  editForm: Component;
}

const materialGroups: MaterialGroupInfo[] = [];

function addMaterialGroup(info: MaterialGroupInfo) {
  materialGroups.push(info);
}

function getMaterialGroupInfo(type: UserData.MaterialGroupType) {
  return materialGroups.find(x => x.type === type);
}

function getMaterialGroupTypes() {
  return materialGroups.map(x => x.type);
}

interface ActionInfo {
  type: UserData.ActionType;
  description: (data: UserData.ActionData) => string;
  editForm: Component;
}

const actions: ActionInfo[] = [];

function addAction(info: ActionInfo) {
  actions.push(info);
}

function getActionInfo(type: UserData.ActionType) {
  return actions.find(x => x.type === type);
}

function getActionTypes() {
  return actions.map(x => x.type);
}

export const act = {
  addMaterialGroup,
  getMaterialGroupInfo,
  getMaterialGroupTypes,
  addAction,
  getActionInfo,
  getActionTypes,
};
