declare namespace PrunApi {
  interface Alert {
    id: string;
    type: AlertType;
    contextId: string;
    naturalId: string;
    time: DateTime;
    data: AlertData[];
    seen: boolean;
    read: boolean;
  }

  type AlertType =
    | 'ADMIN_CENTER_ELECTION_STARTED'
    | 'ADMIN_CENTER_GOVERNOR_ELECTED'
    | 'ADMIN_CENTER_MOTION_ENDED'
    | 'ADMIN_CENTER_MOTION_PASSED'
    | 'ADMIN_CENTER_MOTION_VOTING_STARTED'
    | 'ADMIN_CENTER_NO_GOVERNOR_ELECTED'
    | 'ADMIN_CENTER_RUN_SUCCEEDED'
    | 'COGC_PROGRAM_CHANGED'
    | 'COGC_STATUS_CHANGED'
    | 'COGC_UPKEEP_STARTED'
    | 'COMEX_ORDER_FILLED'
    | 'COMEX_TRADE'
    | 'CONTRACT_CONDITION_FULFILLED'
    | 'CONTRACT_CONTRACT_BREACHED'
    | 'CONTRACT_CONTRACT_CANCELLED'
    | 'CONTRACT_CONTRACT_CLOSED'
    | 'CONTRACT_CONTRACT_EXTENDED'
    | 'CONTRACT_CONTRACT_RECEIVED'
    | 'CONTRACT_CONTRACT_REJECTED'
    | 'CONTRACT_CONTRACT_TERMINATED'
    | 'CONTRACT_CONTRACT_TERMINATION_REQUESTED'
    | 'CONTRACT_DEADLINE_EXCEEDED_WITH_CONTROL'
    | 'CONTRACT_DEADLINE_EXCEEDED_WITHOUT_CONTROL'
    | 'CORPORATION_MANAGER_INVITE_ACCEPTED'
    | 'CORPORATION_MANAGER_INVITE_REJECTED'
    | 'CORPORATION_MANAGER_SHAREHOLDER_LEFT'
    | 'CORPORATION_PROJECT_FINISHED'
    | 'CORPORATION_SHAREHOLDER_DIVIDEND_RECEIVED'
    | 'CORPORATION_SHAREHOLDER_INVITE_RECEIVED'
    | 'FOREX_ORDER_FILLED'
    | 'FOREX_TRADE'
    | 'LOCAL_MARKET_AD_ACCEPTED'
    | 'LOCAL_MARKET_AD_EXPIRED'
    | 'PLANETARY_PROJECT_FINISHED'
    | 'POPULATION_PROJECT_UPGRADED'
    | 'POPULATION_REPORT_AVAILABLE'
    | 'PRODUCTION_ORDER_FINISHED'
    | 'RELEASE_NOTES'
    | 'SHIP_FLIGHT_ENDED'
    | 'SHIPYARD_PROJECT_FINISHED'
    | 'SITE_EXPERT_DROPPED'
    | 'TUTORIAL_TASK_FINISHED'
    | 'WAREHOUSE_STORE_LOCKED_INSUFFICIENT_FUNDS'
    | 'WAREHOUSE_STORE_UNLOCKED'
    | 'WORKFORCE_LOW_SUPPLIES'
    | 'WORKFORCE_OUT_OF_SUPPLIES'
    | 'WORKFORCE_UNSATISFIED';

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
