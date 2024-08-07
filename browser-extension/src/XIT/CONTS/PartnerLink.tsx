import { Link } from '@src/components/Link';
import { h } from 'preact';
import { isFactionContract } from '@src/XIT/CONTS/utils';
import { TextColors } from '@src/Style';

export default function PartnerLink(props: { contract: PrunApi.Contract }) {
  const { contract } = props;
  if (isFactionContract(contract)) {
    return (
      <Link command={`FA ${contract.partner.countryCode}`}>
        <span style={{ color: TextColors.Yellow, fontWeight: 'bold' }} title="Faction Contract">
          ✦&nbsp;
        </span>
        {contract.partner.name}
      </Link>
    );
  }
  if (contract.partner.name) {
    return <Link command={`CO ${contract.partner.code}`}>{contract.partner.name}</Link>;
  }
  if (contract.partner.code) {
    return <Link command={`CO ${contract.partner.code}`} />;
  }
  return <div>{contract.preamble}</div>;
}
