import { h } from 'preact';
import { TextColors } from '@src/Style';
import { Link } from '@src/components/Link';
import { isFactionContract, isPartnerCondition } from '@src/XIT/CONTS/utils';

export default function ContractLink(props: { contract: PrunApi.Contract }) {
  const { contract } = props;

  const isFaction = isFactionContract(contract);
  const icons: h.JSX.Element[] = [];
  if (isActionable(contract)) {
    icons.push(<span style={{ color: TextColors.Failure, fontWeight: 'bold' }}>❗</span>);
  }
  const linkStyle = {
    display: isFaction ? 'inline' : 'block',
  };
  return (
    <Link command={`CONT ${contract.localId}`} style={linkStyle}>
      {icons} {contract.name || contract.localId}
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
