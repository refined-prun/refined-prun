import xit from './xit-registry';
import { h } from 'preact';
import useReactive from '@src/hooks/use-reactive';
import user from '@src/store/user';
import PrunCss from '@src/prun-ui/prun-css';
import prun from '@src/prun-api/prun';
import { useEffect } from 'preact/compat';
import { showBuffer } from '@src/util';

interface Entry {
  order: PrunApi.COMEX_TRADER_ORDERS.Order;
  trade: PrunApi.COMEX_TRADER_ORDERS.Trade;
  timestamp: number;
}

function CXTS() {
  useEffect(() => {
    showBuffer('CXOS 9999', true, true);
  }, []);

  const orders = useReactive(() => user.cxos);

  const entries: Entry[] = [];
  for (const order of orders) {
    for (const trade of order.trades) {
      entries.push({
        order,
        trade,
        timestamp: trade.time.timestamp,
      });
    }
  }

  if (entries.length === 0) {
    return <div>No recent trades!</div>;
  }

  entries.sort(({ timestamp: a }, { timestamp: b }) => b - a);

  const rows = [] as h.JSX.Element[];
  let lastDate = new Date(entries[0].timestamp);
  const pendingRows: h.JSX.Element[] = [];
  const accumulatedTotals: { [currency: string]: number } = {};

  for (const { order, trade, timestamp } of entries) {
    const mat = prun.materials.get(order.material.ticker);
    if (!mat) {
      continue;
    }

    const date = new Date(timestamp);
    if (!sameDay(lastDate, date)) {
      const style = {
        borderBottom: '1px solid #2b485a',
        borderTop: '1px solid #2b485a',
      };
      const secondPartStyle = {
        backgroundColor: '#23282b',
        borderLeft: 'none',
        ...style,
      };
      const totals: h.JSX.Element[] = [];
      const keys = Object.keys(accumulatedTotals);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = accumulatedTotals[key];
        if (value === 0) {
          continue;
        }
        const formatted = formatPrice(value.toFixed(2));
        totals.push(
          <span>
            {formatted} {key}
          </span>,
        );
        if (i !== keys.length - 1) {
          totals.push(<br />);
        }
        accumulatedTotals[key] = 0;
      }
      rows.push(
        <tr key={trade.id}>
          <td colSpan={6} style={style}>
            <span>{formatDate(lastDate)}</span>
          </td>
          <td class={PrunCss.ComExOrdersTable.number} style={secondPartStyle}>
            {totals}
          </td>
        </tr>,
      );
      rows.push(...pendingRows);
      pendingRows.length = 0;
    }

    lastDate = date;
    const total = trade.price.amount * trade.amount * (order.type === 'SELLING' ? 1 : -1);
    const priceLabel = formatPrice(trade.price.amount.toFixed(2));
    const totalLabel = formatPrice(total.toFixed(2));
    const currency = trade.price.currency;
    accumulatedTotals[currency] = (accumulatedTotals[currency] ?? 0) + total;
    const typeClass = order.type === 'SELLING' ? PrunCss.OrderTypeLabel.SELLING : PrunCss.OrderTypeLabel.BUYING;
    const fullTicker = `${mat.ticker}.${order.exchange.code}`;
    const onTimeClick = () => showBuffer(`CXO ${order.id.substring(0, 8)}`);
    const onTickerClick = () => showBuffer(`CXOB ${fullTicker}`);
    pendingRows.push(
      <tr key={trade.id}>
        <td>
          <span class={PrunCss.Link.link} onClick={onTimeClick}>
            {formatTime(date)}
          </span>
        </td>
        <td>
          <span class={typeClass}>{order.type === 'SELLING' ? 'SELL' : 'BUY'}</span>
        </td>
        <td>
          <span class={PrunCss.Link.link} onClick={onTickerClick}>
            {fullTicker}
          </span>
        </td>
        <td>
          <span>{mat.displayName}</span>
        </td>
        <td class={PrunCss.ComExOrdersTable.number}>{trade.amount}</td>
        <td class={PrunCss.ComExOrdersTable.number}>
          {priceLabel} {currency}
        </td>
        <td class={PrunCss.ComExOrdersTable.number}>
          {totalLabel} {currency}
        </td>
      </tr>,
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Type</th>
          <th>Ticker</th>
          <th>Material</th>
          <th>Amount</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function sameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return `${day}/${month}/${year}`;
}

function formatTime(date: Date) {
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${hours}:${minutes}:${seconds}`;
}

function pad(number: number) {
  return (number < 10 ? '0' : '') + number;
}

function formatPrice(x: string) {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

xit.add({
  command: ['CXTS'],
  name: 'Recent Trades',
  component: () => <CXTS />,
});
