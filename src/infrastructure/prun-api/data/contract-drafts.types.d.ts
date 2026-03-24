declare namespace PrunApi {
  interface ContractDraft {
    id: string;
    name: string;
    naturalId: string;
    status: ContractDraftStatus;
    preamble: string;
    creation: DateTime;
    conditions: ContractCondition[];
  }

  type ContractDraftStatus = 'VALID' | 'IN_PROGRESS';
}
