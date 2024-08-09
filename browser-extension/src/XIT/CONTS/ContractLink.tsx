import { h } from 'preact';
import { Link } from '@src/components/Link';
import { isFactionContract, isPartnerCondition } from '@src/XIT/CONTS/utils';

export default function ContractLink(props: { contract: PrunApi.Contract }) {
  const { contract } = props;

  const actionMark = isActionable(contract) ? '❗' : '';
  const linkStyle = {
    display: isFactionContract(contract) ? 'inline' : 'block',
  };
  return (
    <Link command={`CONT ${contract.localId}`} style={linkStyle}>
      {actionMark}
      {contract.name || contract.localId}
    </Link>
  );
}

function isActionable(contract: PrunApi.Contract) {
  if (contract.party === 'CUSTOMER' && contract.status === 'OPEN') {
    return true;
  }

  if (contract.status !== 'PARTIALLY_FULFILLED' && contract.status !== 'CLOSED') {
    return;
  }

  const conditionsById: Map<string, PrunApi.ContractCondition> = new Map();
  for (const condition of contract.conditions) {
    conditionsById.set(condition.id, condition);
  }
  for (const condition of contract.conditions) {
    if (isPartnerCondition(contract, condition) || condition.status === 'FULFILLED') {
      continue;
    }

    const hasPendingDependencies = condition.dependencies
      .map(x => conditionsById.get(x))
      .some(x => x && x.status === 'PENDING' && isPartnerCondition(contract, x));
    if (!hasPendingDependencies) {
      return true;
    }
  }

  return false;
}
