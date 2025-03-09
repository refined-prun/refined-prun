declare namespace PrunApi {
  export interface ContractDraft {
    id: string;
    name: string;
    naturalId: string;
    status: ContractDraftStatus;
    preamble: string;
    creation: DateTime;
    conditions: ContractCondition[];
  }

  export type ContractDraftStatus = 'VALID' | 'IN_PROGRESS';
}
