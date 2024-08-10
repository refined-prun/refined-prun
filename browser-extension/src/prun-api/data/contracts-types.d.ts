declare module PrunApi {
  export interface Contract {
    id: string;
    localId: string;
    date: DateTime;
    party: ContractParty;
    partner: ContractPartner;
    status: ContractStatus;
    conditions: ContractCondition[];
    extensionDeadline: null;
    canExtend: boolean;
    canRequestTermination: boolean;
    dueDate: DateTime | null;
    name: string | null;
    preamble: null | string;
    terminationSent: boolean;
    terminationReceived: boolean;
    agentContract: boolean;
    relatedContracts: string[];
    contractType: null | string;
  }

  export interface ContractCondition {
    quantity?: MaterialAmount | null;
    address?: Address;
    blockId?: null;
    type: ContractConditionType;
    id: string;
    party: ContractParty;
    index: number;
    status: ContractConditionStatus;
    dependencies: string[];
    deadlineDuration: TimeSpan | null;
    deadline: DateTime | null;
    amount?: CurrencyAmount;
    pickedUp?: MaterialAmount;
    weight?: number;
    volume?: number;
    autoProvisionStoreId?: null | string;
    destination?: Address;
    shipmentItemId?: string;
    countryId?: string;
    reputationChange?: number;
    interest?: CurrencyAmount;
    repayment?: CurrencyAmount;
    total?: CurrencyAmount;
  }

  export type ContractParty = 'CUSTOMER' | 'PROVIDER';

  export type ContractConditionStatus = 'PENDING' | 'FULFILLED';

  export type ContractConditionType =
    | 'BASE_CONSTRUCTION'
    | 'COMEX_PURCHASE_PICKUP'
    | 'DELIVERY'
    | 'DELIVERY_SHIPMENT'
    | 'EXPLORATION'
    | 'FINISH_FLIGHT'
    | 'LOAN_INSTALLMENT'
    | 'LOAN_PAYOUT'
    | 'PAYMENT'
    | 'PICKUP_SHIPMENT'
    | 'PLACE_ORDER'
    | 'PRODUCTION_ORDER_COMPLETED'
    | 'PRODUCTION_RUN'
    | 'PROVISION'
    | 'PROVISION_SHIPMENT'
    | 'REPUTATION'
    | 'START_FLIGHT'
    | 'POWER';

  export interface ContractPartner {
    id?: string;
    name: string;
    code?: null | string;
    agentId?: string;
    countryId?: string;
    countryCode?: string;
    type?: ContractPartnerTypeEnum;
  }

  export type ContractPartnerTypeEnum = 'EXPLORATION' | 'GOVERNANCE' | 'LOGISTICS';

  export type ContractStatus =
    | 'OPEN'
    | 'CLOSED'
    | 'CANCELLED'
    | 'FULFILLED'
    | 'PARTIALLY_FULFILLED'
    | 'REJECTED'
    | 'TERMINATED';
}
