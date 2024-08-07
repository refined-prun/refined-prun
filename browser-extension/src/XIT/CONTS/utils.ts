export function isFactionContract(contract: PrunApi.Contract) {
  return !!contract.partner.countryCode;
}

export function isSelfCondition(contract: PrunApi.Contract, condition: PrunApi.ContractCondition) {
  return contract.party === condition.party;
}

export function isPartnerCondition(contract: PrunApi.Contract, condition: PrunApi.ContractCondition) {
  return contract.party !== condition.party;
}
