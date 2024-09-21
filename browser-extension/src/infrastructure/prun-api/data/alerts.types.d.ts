declare namespace PrunApi {
  export interface Alert {
    id: string;
    type: AlertType;
    contextId: string;
    naturalId: string;
    time: DateTime;
    data: AlertData[];
    seen: boolean;
    read: boolean;
  }

  export type AlertType =
    | 'COMEX_ORDER_FILLED'
    | 'PRODUCTION_ORDER_FINISHED'
    | 'SITE_EXPERT_DROPPED'
    | 'COMEX_TRADE'
    | 'COGC_PROGRAM_CHANGED'
    | 'SHIP_FLIGHT_ENDED'
    | 'ADMIN_CENTER_MOTION_PASSED'
    | 'FOREX_ORDER_FILLED'
    | 'FOREX_TRADE'
    | 'CONTRACT_CONDITION_FULFILLED'
    | 'CONTRACT_CONTRACT_RECEIVED'
    | 'COGC_UPKEEP_STARTED'
    | 'POPULATION_REPORT_AVAILABLE'
    | 'CONTRACT_CONTRACT_CLOSED'
    | 'LOCAL_MARKET_AD_ACCEPTED'
    | 'LOCAL_MARKET_AD_EXPIRED'
    | 'POPULATION_PROJECT_UPGRADED'
    | 'ADMIN_CENTER_GOVERNOR_ELECTED'
    | 'ADMIN_CENTER_ELECTION_STARTED'
    | 'CONTRACT_CONTRACT_TERMINATED'
    | 'CONTRACT_CONTRACT_TERMINATION_REQUESTED'
    | 'CONTRACT_CONTRACT_CANCELLED'
    | 'CONTRACT_DEADLINE_EXCEEDED_WITH_CONTROL'
    | 'WORKFORCE_LOW_SUPPLIES'
    | 'CONTRACT_CONTRACT_REJECTED';

  type AlertData =
    | { key: 'commodity'; value: string }
    | { key: 'exchange'; value: ExchangeOperator }
    | { key: 'quantity'; value: number }
    | { key: 'address'; value: { address: Address } }
    | { key: 'material'; value: string }
    | { key: 'expertiseCategory'; value: string }
    | { key: 'planet'; value: { address: Address } }
    | { key: 'program'; value: string }
    | { key: 'destination'; value: { address: Address } }
    | { key: 'registration'; value: string }
    | { key: 'shipId'; value: string }
    | { key: 'motionId'; value: string }
    | { key: 'motionStatus'; value: string }
    | { key: 'adminCenterId'; value: string }
    | { key: 'motionName'; value: string }
    | { key: 'trades'; value: number }
    | { key: 'partner'; value: ContractPartner }
    | { key: 'contract'; value: string }
    | { key: 'ticker'; value: string }
    | { key: 'level'; value: number }
    | { key: 'type'; value: string }
    | { key: string; value: unknown };
}
