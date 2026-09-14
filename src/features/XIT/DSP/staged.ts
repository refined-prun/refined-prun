export interface StagedDispatch {
  pkg: UserData.ActionPackageData;
}

export const stagedDispatch = ref<StagedDispatch | undefined>(undefined);
