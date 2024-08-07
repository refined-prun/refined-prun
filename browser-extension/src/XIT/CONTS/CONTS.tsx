import xit from '../xit-registry';
import { h } from 'preact';
import { selectContracts } from '@src/store/database/selectors';
import useDatabase from '@src/hooks/use-database';
import ContractRow from '@src/XIT/CONTS/ContractRow';

function CONTS() {
  const contracts = useDatabase(selectContracts);

  if (contracts.length === 0) {
    return <div>Loading Contract Data...</div>;
  }

  const rows = contracts
    .filter(shouldShowContract)
    .sort(compareContracts)
    .map(c => <ContractRow key={c.id} id={c.id} />);

  if (rows.length === 0) {
    rows.push(
      <tr>
        <td colSpan={4}>No contracts</td>
      </tr>,
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Contract ID</th>
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

xit.add({
  command: ['CONTS', 'CONTRACTS'],
  name: 'CONTRACTS',
  component: () => <CONTS />,
});
