declare namespace PrunApi {
  interface Contract {
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

  interface ContractCondition {
    quantity?: MaterialAmount | null;
    address?: Address;
    blockId?: string | null;
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

  type ContractParty = 'CUSTOMER' | 'PROVIDER';

  type ContractConditionStatus =
    | 'PENDING'
    | 'IN_PROGRESS'
    | 'FULFILLED'
    | 'PARTLY_FULFILLED'
    | 'FULFILLMENT_ATTEMPTED'
    | 'VIOLATED';

  type ContractConditionType =
    | 'BASE_CONSTRUCTION'
    | 'COMEX_PURCHASE_PICKUP'
    | 'CONSTRUCT_SHIP'
    | 'CONTRIBUTION'
    | 'DELIVERY'
    | 'DELIVERY_SHIPMENT'
    | 'EXPLORATION'
    | 'FINISH_FLIGHT'
    | 'GATEWAY_FUEL'
    | 'HEADQUARTERS_UPGRADE'
    | 'INFRASTRUCTURE_CONSTRUCTION_FINISH'
    | 'INFRASTRUCTURE_CONSTRUCTION_START'
    | 'INFRASTRUCTURE_UPGRADE_FINISH'
    | 'INFRASTRUCTURE_UPGRADE_START'
    | 'INFRASTRUCTURE_UPKEEP'
    | 'LOAN_INSTALLMENT'
    | 'LOAN_PAYOUT'
    | 'PAYMENT'
    | 'PICKUP'
    | 'PICKUP_SHIPMENT'
    | 'PLACE_ORDER'
    | 'POWER'
    | 'PRODUCTION_ORDER_COMPLETED'
    | 'PRODUCTION_RUN'
    | 'PROVISION'
    | 'PROVISION_SHIPMENT'
    | 'REPAIR_SHIP'
    | 'REPUTATION'
    | 'START_FLIGHT'
    | 'WORKFORCE_PROGRAM_PAYMENT'
    | 'WORKFORCE_PROGRAM_START';

  interface ContractPartner {
    id?: string;
    name: string;
    code?: null | string;
    agentId?: string;
    countryId?: string;
    countryCode?: string;
    type?: ContractPartnerTypeEnum;
    currency?: Currency;
  }

  type ContractPartnerTypeEnum = 'EXPLORATION' | 'GOVERNANCE' | 'LOGISTICS';

  type ContractStatus =
    | 'OPEN'
    | 'CLOSED'
    | 'CANCELLED'
    | 'FULFILLED'
    | 'PARTIALLY_FULFILLED'
    | 'REJECTED'
    | 'DEADLINE_EXCEEDED'
    | 'BREACHED'
    | 'TERMINATED';
}
