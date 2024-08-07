import { h } from 'preact';
import ShipmentIcon from '@src/components/ShipmentIcon';
import MaterialIcon from '@src/components/MaterialIcon';
import { isPartnerCondition } from '@src/XIT/CONTS/utils';

export default function MaterialList(props: { contract: PrunApi.Contract }) {
  const { contract } = props;

  const items: h.JSX.Element[] = [];
  for (const condition of contract.conditions) {
    switch (condition.type) {
      case 'PROVISION_SHIPMENT': {
        if (isPartnerCondition(contract, condition)) {
          items.push(
            <div style={{ marginBottom: '4px' }}>
              <ShipmentIcon small contractId={contract.id} />
            </div>,
          );
          continue;
        }
        break;
      }
      case 'PROVISION':
      case 'PICKUP_SHIPMENT': {
        continue;
      }
    }

    const quantity = condition.quantity;
    if (!quantity?.material) {
      continue;
    }

    const amount = quantity.amount;
    const ticker = quantity.material.ticker;
    items.push(
      <div style={{ marginBottom: '4px' }}>
        <MaterialIcon small ticker={ticker} amount={amount} />
      </div>,
    );
  }
  return <div>{items}</div>;
}
