import { h } from 'preact';
import ContractLink from '@src/XIT/CONTS/ContractLink';
import MaterialList from '@src/XIT/CONTS/MaterialList';
import PartnerLink from '@src/XIT/CONTS/PartnerLink';
import ConditionList from '@src/XIT/CONTS/ConditionList';
import { isPartnerCondition, isSelfCondition } from '@src/XIT/CONTS/utils';
import usePrunData from '@src/hooks/use-prun-data';
import { selectContractById } from '@src/prun-api/data/contracts';

export default function ContractRow(props: { id: string }) {
  const contract = usePrunData(s => selectContractById(s, props.id));
  const conditions = contract.conditions;
  const self = conditions.filter(x => isSelfCondition(contract, x));
  const partner = conditions.filter(x => isPartnerCondition(contract, x));
  return (
    <tr>
      <td>
        <ContractLink contract={contract} />
      </td>
      <td style={{ width: '32px', paddingLeft: '10px' }}>
        <MaterialList contract={contract} />
      </td>
      <td>
        <PartnerLink contract={contract} />
        <ConditionList conditions={partner} />
      </td>
      <td>
        <ConditionList conditions={self} />
      </td>
    </tr>
  );
}
