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
  const material = prun.materials.get(ticker);
  if (!material && ticker != 'SHPT') {
    return null;
  }

  const name = text ? material?.displayName || 'Shipment' : undefined;

  return (
    <GridItemView name={name}>
      <MaterialIcon small={small} ticker={ticker} amount={amount} />
    </GridItemView>
  );
}
