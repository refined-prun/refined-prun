export function isFactionContract(contract: PrunApi.Contract) {
  return !!contract.partner.countryCode;
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

export function isConditionFulfilled(condition: PrunApi.ContractCondition) {
  return condition.status === 'FULFILLED';
}

export function friendlyConditionText(type: PrunApi.ContractConditionType) {
  switch (type) {
    case 'BASE_CONSTRUCTION':
      return 'Construct Base';
    case 'COMEX_PURCHASE_PICKUP':
      return 'Material Pickup';
    case 'DELIVERY':
      return 'Delivery';
    case 'DELIVERY_SHIPMENT':
      return 'Deliver Shipment';
    case 'EXPLORATION':
      return 'Exploration';
    case 'FINISH_FLIGHT':
      return 'Finish Flight';
    case 'LOAN_INSTALLMENT':
      return 'Loan Installment';
    case 'LOAN_PAYOUT':
      return 'Loan Payout';
    case 'PAYMENT':
      return 'Payment';
    case 'PICKUP_SHIPMENT':
      return 'Pickup Shipment';
    case 'PLACE_ORDER':
      return 'Place Order';
    case 'PRODUCTION_ORDER_COMPLETED':
      return 'Complete Production Order';
    case 'PRODUCTION_RUN':
      return 'Run Production';
    case 'PROVISION':
      return 'Provision';
    case 'PROVISION_SHIPMENT':
      return 'Provision';
    case 'REPUTATION':
      return 'Reputation';
    case 'START_FLIGHT':
      return 'Start Flight';
    case 'POWER':
      return 'Become Governor';
    default:
      return type;
  }
}
