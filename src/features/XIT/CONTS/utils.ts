export function isFactionContract(contract: PrunApi.Contract) {
  return !!contract.partner.countryCode;
}

export function canAcceptContract(contract: PrunApi.Contract) {
  return contract.party === 'CUSTOMER' && contract.status === 'OPEN';
}

export function canPartnerAcceptContract(contract: PrunApi.Contract) {
  return contract.party === 'PROVIDER' && contract.status === 'OPEN';
}

export function isSelfCondition(contract: PrunApi.Contract, condition: PrunApi.ContractCondition) {
  return contract.party === condition.party;
}

export function isPartnerCondition(
  contract: PrunApi.Contract,
  condition: PrunApi.ContractCondition,
) {
  return contract.party !== condition.party;
}

export function friendlyConditionText(type: PrunApi.ContractConditionType) {
  switch (type) {
    case 'BASE_CONSTRUCTION':
      return 'Construct Base';
    case 'COMEX_PURCHASE_PICKUP':
      return 'Material Pickup';
    case 'CONSTRUCT_SHIP':
      return 'Construct Ship';
    case 'CONTRIBUTION':
      return 'Contribution';
    case 'DELIVERY':
      return 'Delivery';
    case 'DELIVERY_SHIPMENT':
      return 'Deliver Shipment';
    case 'EXPLORATION':
      return 'Exploration';
    case 'FINISH_FLIGHT':
      return 'Finish Flight';
    case 'GATEWAY_FUEL':
      return 'Gateway Fuel';
    case 'HEADQUARTERS_UPGRADE':
      return 'Upgrade HQ';
    case 'INFRASTRUCTURE_CONSTRUCTION_FINISH':
      return 'Infra Build Finish';
    case 'INFRASTRUCTURE_CONSTRUCTION_START':
      return 'Infra Build Start';
    case 'INFRASTRUCTURE_UPGRADE_FINISH':
      return 'Infra Upgrade Finish';
    case 'INFRASTRUCTURE_UPGRADE_START':
      return 'Infra Upgrade Start';
    case 'INFRASTRUCTURE_UPKEEP':
      return 'Infra Upkeep';
    case 'LOAN_INSTALLMENT':
      return 'Loan Installment';
    case 'LOAN_PAYOUT':
      return 'Loan Payout';
    case 'PAYMENT':
      return 'Payment';
    case 'PICKUP':
      return 'Pickup';
    case 'PICKUP_SHIPMENT':
      return 'Pickup';
    case 'PLACE_ORDER':
      return 'Place Order';
    case 'POWER':
      return 'Become Governor';
    case 'PRODUCTION_ORDER_COMPLETED':
      return 'Complete Production Order';
    case 'PRODUCTION_RUN':
      return 'Run Production';
    case 'PROVISION':
      return 'Provision';
    case 'PROVISION_SHIPMENT':
      return 'Provision';
    case 'REPAIR_SHIP':
      return 'Repair Ship';
    case 'REPUTATION':
      return 'Reputation';
    case 'START_FLIGHT':
      return 'Start Flight';
    case 'WORKFORCE_PROGRAM_PAYMENT':
      return 'WF Payment';
    case 'WORKFORCE_PROGRAM_START':
      return 'WF Program Start';
    default:
      return type;
  }
}
