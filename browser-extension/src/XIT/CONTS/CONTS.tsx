import xit from '../xit-registry';
import { h } from 'preact';
import ContractRow from '@src/XIT/CONTS/ContractRow';
import features from '@src/feature-registry';
import usePrunData from '@src/hooks/use-prun-data';
import { selectContracts, selectContractsFetched } from '@src/prun-api/data/contracts';
import { Loading } from '@src/components/Loading';

function CONTS() {
  const fetched = usePrunData(selectContractsFetched);
  const contracts = usePrunData(selectContracts);

  if (!fetched) {
    return <Loading />;
  }

  const rows = contracts
    .filter(shouldShowContract)
    .sort(compareContracts)
    .map(c => <ContractRow key={c.id} id={c.id} />);

  if (rows.length === 0) {
    rows.push(
      <tr>
        <td colSpan={4}>No active contracts</td>
      </tr>,
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Material</th>
          <th>Partner&apos;s Conditions</th>
          <th>My Conditions</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function shouldShowContract(contract: PrunApi.Contract) {
  switch (contract.status) {
    case 'OPEN':
    case 'CLOSED':
    case 'PARTIALLY_FULFILLED': {
      return true;
    }
    default: {
      return false;
    }
  }
}

function compareContracts(a: PrunApi.Contract, b: PrunApi.Contract) {
  return (a.date?.timestamp ?? 0) - (b.date?.timestamp ?? 0);
}

function init() {
  xit.add({
    command: ['CONTS', 'CONTRACTS'],
    name: 'ACTIVE CONTRACTS',
    component: () => <CONTS />,
  });
}

features.add({
  id: 'xit-conts',
  init,
});
