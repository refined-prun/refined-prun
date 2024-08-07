import { h, Fragment } from 'preact';
import { TextColors } from '@src/Style';

export default function ConditionList(props: { conditions: PrunApi.ContractCondition[] }) {
  const conditions = props.conditions.slice().sort(compareConditions);

  const items: h.JSX.Element[] = [];
  let loanFilled = 0;
  let loanTotal = 0;

  for (const condition of conditions) {
    const isFulfilled = condition.status === 'FULFILLED';

    if (condition.type == 'LOAN_INSTALLMENT') {
      loanTotal++;
      loanFilled += isFulfilled ? 1 : 0;
      continue;
    }

    const color = isFulfilled ? TextColors.Success : TextColors.Failure;
    const icon = isFulfilled ? '✓' : '✗';
    items.push(
      <div>
        <span style={{ color, fontWeight: 'bold' }}>{icon}</span>
        <span> {friendlyConditionText(condition.type)}</span>
      </div>,
    );
  }

  if (loanTotal) {
    items.push(
      <div>
        {loanFilled}/{loanTotal} Loan Installment
      </div>,
    );
  }

  return <>{items}</>;
}

function compareConditions(a: PrunApi.ContractCondition, b: PrunApi.ContractCondition) {
  return a.index - b.index;
}

function friendlyConditionText(type: PrunApi.ContractConditionType) {
  switch (type) {
    case 'BASE_CONSTRUCTION':
      return 'Construct Base';
    case 'COMEX_PURCHASE_PICKUP':
      return 'Material Pickup';
    case 'DELIVERY':
      return 'Delivery';
    case 'DELIVERY_SHIPMENT':
      return 'Deliver Shipment';
    case 'EXPLORATION':
      return 'Exploration';
    case 'FINISH_FLIGHT':
      return 'Finish Flight';
    case 'LOAN_INSTALLMENT':
      return 'Loan Installment';
    case 'LOAN_PAYOUT':
      return 'Loan Payout';
    case 'PAYMENT':
      return 'Payment';
    case 'PICKUP_SHIPMENT':
      return 'Pickup Shipment';
    case 'PLACE_ORDER':
      return 'Place Order';
    case 'PRODUCTION_ORDER_COMPLETED':
      return 'Complete Production Order';
    case 'PRODUCTION_RUN':
      return 'Run Production';
    case 'PROVISION':
      return 'Provision';
    case 'PROVISION_SHIPMENT':
      return 'Provision';
    case 'REPUTATION':
      return 'Reputation';
    case 'START_FLIGHT':
      return 'Start Flight';
    case 'POWER':
      return 'Become Governor';
    default:
      return type;
  }
}
