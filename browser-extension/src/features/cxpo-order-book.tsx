import './cxpo-order-book.css';
import user from '@src/prun-api/user';
import buffers from '@src/prun-ui/prun-buffers';
import features from '@src/feature-registry';
import { appendRootFragment } from '@src/utils/create-root-fragment';
import { h, render } from 'preact';
import PrunCss from '@src/prun-ui/prun-css';
import { useLayoutEffect, useRef } from 'preact/compat';
import classNames from 'classnames';
import descendantPresent from '@src/utils/descendant-present';
import useReactive from '@src/hooks/use-reactive';
import { _$$ } from '@src/utils/get-element-by-class-name';

async function onBufferCreated(buffer: PrunBuffer) {
  if (!buffer.parameter) {
    return;
  }

  const form = await descendantPresent(buffer.frame, PrunCss.ComExPlaceOrderForm.form);
  const formParent = form.parentElement!;
  formParent.style.display = 'flex';
  form.style.flex = '1';
  for (const label of _$$(PrunCss.FormComponent.label, form)) {
    (label as HTMLLabelElement).style.minWidth = '95px';
  }
  for (const span of _$$(PrunCss.Tooltip.container, form)) {
    span.setAttribute('data-tooltip-position', 'right');
  }

  render(<OrderBook ticker={buffer.parameter} />, appendRootFragment(formParent, 'div'));
}

function OrderBook(props: { ticker: string }) {
  const orderInfo = useReactive(() => user.cxob[props.ticker]);

  const offers = (orderInfo?.sellingOrders ?? [])
    .slice()
    .reverse()
    .map(x => <OrderRow key={x.id} order={x} type="offer" />);

  if (offers.length === 0) {
    offers.push(
      <tr>
        <td class={PrunCss.ComExOrderBookPanel.empty} colSpan={2}>
          No offers.
        </td>
      </tr>,
    );
  }

  const ask = orderInfo?.ask?.price.amount;
  const bid = orderInfo?.bid?.price.amount;
  const spread = ask && bid ? (ask - bid).toFixed(2) : '--';

  const spreadBody = (
    <tbody>
      <tr>
        <td colSpan={2} class={PrunCss.ComExOrderBookPanel.spread}>
          Spread: <span style={{ color: '#eee' }}>{spread}</span>
        </td>
      </tr>
    </tbody>
  );

  const requests = (orderInfo?.buyingOrders ?? []).map(x => <OrderRow key={x.id} order={x} type="request" />);

  if (requests.length === 0) {
    requests.push(
      <tr>
        <td class={PrunCss.ComExOrderBookPanel.empty} colSpan={2}>
          No requests.
        </td>
      </tr>,
    );
  }

  const orderBook = useRef<HTMLDivElement>(null);
  const offerBody = useRef<HTMLTableSectionElement>(null);
  useLayoutEffect(() => {
    orderBook.current!.scrollTop = Math.max(offerBody.current!.offsetHeight - 90, 0);
  }, []);
  return (
    <div class="rprun-cxpo-order-book" ref={orderBook}>
      <table>
        <thead>
          <tr>
            <th>Amt.</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody ref={offerBody}>
          <tr>
            <th colSpan={2}>Offers</th>
          </tr>
          {offers}
        </tbody>
        {spreadBody}
        <tbody>
          <tr>
            <th colSpan={2}>Requests</th>
          </tr>
          {requests}
        </tbody>
      </table>
    </div>
  );
}

function OrderRow(props: { order: PrunApi.COMEX_BROKER_DATA.Order; type: 'offer' | 'request' }) {
  const { order, type } = props;
  const ownOrderClass = {
    'rprun-cxpo-order-column--own-order': order.amount && order.trader.id === user.company.id,
  };
  const amount = order.amount ? order.amount.toFixed(0) : '∞';
  const amountClass = classNames(PrunCss.ComExOrderBookPanel.amount, ownOrderClass);
  const price = order.limit.amount.toFixed(2);
  const priceClass = classNames(
    type === 'request' ? PrunCss.ComExOrderBookPanel.requestPrice : PrunCss.ComExOrderBookPanel.offerPrice,
    ownOrderClass,
    'rprun-cxpo-order-column--price',
  );
  return (
    <tr>
      <td class={amountClass}>{amount}</td>
      <td class={priceClass} style={{ padding: '2px' }}>
        {price}
      </td>
    </tr>
  );
}

export function init() {
  buffers.observe('CXPO', onBufferCreated);
}

void features.add({
  id: 'cxpo-order-book',
  init,
});
