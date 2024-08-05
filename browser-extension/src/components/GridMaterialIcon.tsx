import prun from '@src/prun-api/prun';
import { h } from 'preact';
import GridItemView from '@src/components/GridItemView';
import MaterialIcon from '@src/components/MaterialIcon';

interface Props {
  ticker: string;
  amount?: number;
  text?: boolean;
  small?: boolean;
}

export default function GridMaterialIcon({ amount, small, text, ticker }: Props) {
  let name: string | undefined;
  if (!text) {
    name = undefined;
  } else if (ticker === 'SHPT') {
    name = 'Shipment';
  } else {
    const material = prun.materials.get(ticker);
    name = material?.displayName ?? '???';
  }

  return (
    <GridItemView name={name}>
      <MaterialIcon small={small} ticker={ticker} amount={amount} />
    </GridItemView>
  );
}
