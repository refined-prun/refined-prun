export interface StagedGovBurn {
  pkg: UserData.ActionPackageData;
}

export const stagedGovBurn = ref<StagedGovBurn | undefined>(undefined);
