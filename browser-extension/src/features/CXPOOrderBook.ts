import { Module } from '../ModuleRunner';
import { getBuffersFromList, createTextSpan } from '../util';
import { Exchanges, ExchangeTickers } from '../GameProperties';
import { Selector } from '../Selector';
import { Style } from '../Style';
import { userData } from '@src/prun-api/user-data';
import materials from '@src/prun-api/materials';

export class CXPOOrderBook implements Module {
  private tag = 'pb-cxpo-ob';

  private userInfo;

  constructor(userInfo) {
    this.userInfo = userInfo;
  }

  cleanup() {
    // Nothing to clean up
  }

  run(allBuffers) {
    if (this.userInfo['PMMG-User-Info'] && this.userInfo['PMMG-User-Info']['company-name']) {
      const buffers = getBuffersFromList('CXPO ', allBuffers);
      buffers.forEach(buffer => {
        addOrderBook(buffer, this.userInfo, this.tag);
      });
    }
  }
}

function addOrderBook(buffer, userInfo, tag) {
  const form = buffer.querySelector('form');
  if (!form) {
    return;
  }

  const exchange = document.evaluate(
    "div[label/span[text()='Exchange']]//div/div",
    form,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue as HTMLDivElement;
  if (!exchange || !exchange.textContent) {
    return;
  }

  const exchangeTicker =
    exchange.textContent.length == 3
      ? (ExchangeTickers[exchange.textContent as string] as string)
      : ExchangeTickers[Exchanges[exchange.textContent as string] as string];
  if (!exchangeTicker) {
    return;
  }

  const material = document.evaluate(
    "div[label/span[text()='Material']]//div/div",
    form,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue as HTMLDivElement;
  const ticker = materials.getTickerByName(material?.textContent);
  if (ticker === undefined) {
    return;
  }

  const fullTicker = `${ticker}.${exchangeTicker}`;

  if (!userData.cxob[fullTicker] || !form.parentElement) {
    return;
  }

  if (form.classList.contains(userData.cxob[fullTicker].timestamp.toString())) {
    return;
  }
  form.classList.add(userData.cxob[fullTicker].timestamp);

  if (form.parentElement.children[1]) {
    form.parentElement.children[1].remove();
  }

  if (Exchanges[exchange.textContent]) {
    exchange.textContent = Exchanges[exchange.textContent];
  }

  form.parentElement.style.display = 'flex';

  // Create order book parent div
  const orderBook = document.createElement('div');
  orderBook.classList.add('pb-scroll');
  orderBook.style.height = '248px';
  form.parentElement.appendChild(orderBook);

  // Format order form
  form.style.flex = '1';
  Array.from(form.querySelectorAll(Selector.FormLabels) as HTMLLabelElement[]).forEach(label => {
    label.style.minWidth = '95px';
  });

  // Format tooltips
  Array.from(form.querySelectorAll(Selector.FormTooltip) as HTMLSpanElement[]).forEach(span => {
    span.setAttribute('data-tooltip-position', 'right');
  });
  // Create order book table
  const orderTable = document.createElement('table');
  orderBook.appendChild(orderTable);

  const header = document.createElement('thead');
  orderTable.appendChild(header);
  const headerRow = document.createElement('tr');
  header.appendChild(headerRow);
  for (const label of ['Amt.', 'Price']) {
    const th = document.createElement('th');
    th.appendChild(createTextSpan(label as string, tag));
    headerRow.appendChild(th);
  }

  const offerBody = document.createElement('tbody');
  orderTable.appendChild(offerBody);
  const offerRow = document.createElement('tr');
  offerBody.appendChild(offerRow);
  const offerRowHeader = document.createElement('th');
  offerRowHeader.appendChild(createTextSpan('Offers', tag));
  offerRowHeader.colSpan = 2;
  offerRow.appendChild(offerRowHeader);

  const orderInfo = userData.cxob[fullTicker];
  if (orderInfo.sellingOrders.length > 0) {
    // Build ask table. Add own name highlighting at some point
    const sortedOrders = orderInfo.sellingOrders.slice().reverse();
    sortedOrders.forEach(order => {
      const orderRow = document.createElement('tr');
      offerBody.appendChild(orderRow);
      const amountColumn = document.createElement('td');
      amountColumn.classList.add(...Style.CXOBAmount);
      const priceColumn = document.createElement('td');
      priceColumn.classList.add(...Style.CXOBOffer);
      priceColumn.style.padding = '2px 2px';

      orderRow.appendChild(amountColumn);
      orderRow.appendChild(priceColumn);

      amountColumn.appendChild(
        createTextSpan(order.amount ? order.amount.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '∞', tag),
      );
      priceColumn.appendChild(
        createTextSpan(
          order.limit.amount.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }),
          tag,
        ),
      );

      if (order.amount && order.trader.name == userInfo['PMMG-User-Info']['company-name']) {
        amountColumn.style.background = 'rgba(255, 255, 255, 0.15)';
        priceColumn.style.background = 'rgba(255, 255, 255, 0.15)';
      }
    });
  } else {
    // Create empty row
    const emptyRow = document.createElement('tr');
    offerBody.appendChild(emptyRow);
    const emptyColumn = document.createElement('td');
    emptyColumn.classList.add(...Style.CXOBEmpty);
    emptyColumn.colSpan = 2;
    emptyColumn.appendChild(createTextSpan('No offers.', tag));
    emptyRow.appendChild(emptyColumn);
  }

  // Add spread
  const spreadBody = document.createElement('tbody');
  orderTable.appendChild(spreadBody);
  const spreadRow = document.createElement('tr');
  spreadBody.appendChild(spreadRow);
  const spreadColumn = document.createElement('td');
  spreadColumn.colSpan = 2;
  spreadColumn.classList.add(...Style.CXOBSpread);
  spreadRow.appendChild(spreadColumn);
  spreadColumn.textContent = 'Spread: ';
  if (orderInfo.sellingOrders.length > 0 && orderInfo.buyingOrders.length > 0) {
    const minSell = orderInfo.sellingOrders.reduce((minValue, obj) => Math.min(minValue, obj.limit.amount), Infinity);
    const maxBuy = orderInfo.buyingOrders.reduce((maxValue, obj) => Math.max(maxValue, obj.limit.amount), -Infinity);
    const spreadElem = createTextSpan(
      (minSell - maxBuy).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      tag,
    );
    spreadElem.style.color = '#eee';
    spreadColumn.appendChild(spreadElem);
  } else {
    // Add empty spread row
    const spreadElem = createTextSpan('--', tag);
    spreadElem.style.color = '#eee';
    spreadColumn.appendChild(spreadElem);
  }

  const requestBody = document.createElement('tbody');
  orderTable.appendChild(requestBody);
  const requestRow = document.createElement('tr');
  requestBody.appendChild(requestRow);
  const requestRowHeader = document.createElement('th');
  requestRowHeader.appendChild(createTextSpan('Requests', tag));
  requestRowHeader.colSpan = 2;
  requestRow.appendChild(requestRowHeader);

  if (orderInfo.buyingOrders.length > 0) {
    // Build bid table. Add own name highlighting at some point
    const sortedOrders = orderInfo.buyingOrders;
    sortedOrders.forEach(order => {
      const orderRow = document.createElement('tr');
      requestBody.appendChild(orderRow);
      const amountColumn = document.createElement('td');
      amountColumn.classList.add(...Style.CXOBAmount);
      const priceColumn = document.createElement('td');
      priceColumn.classList.add(...Style.CXOBRequest);
      priceColumn.style.padding = '2px 2px';

      orderRow.appendChild(amountColumn);
      orderRow.appendChild(priceColumn);

      amountColumn.appendChild(
        createTextSpan(order.amount ? order.amount.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '∞', tag),
      );
      priceColumn.appendChild(
        createTextSpan(
          order.limit.amount.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }),
          tag,
        ),
      );

      if (order.amount && order.trader.name == userInfo['PMMG-User-Info']['company-name']) {
        amountColumn.style.background = 'rgba(255, 255, 255, 0.15)';
        priceColumn.style.background = 'rgba(255, 255, 255, 0.15)';
      }
    });
  } else {
    // Create empty row
    const emptyRow = document.createElement('tr');
    requestBody.appendChild(emptyRow);
    const emptyColumn = document.createElement('td');
    emptyColumn.classList.add(...Style.CXOBEmpty);
    emptyColumn.colSpan = 2;
    emptyColumn.appendChild(createTextSpan('No requests.', tag));
    emptyRow.appendChild(emptyColumn);
  }

  // Scroll to middle
  orderBook.scrollTop = Math.max(offerBody.offsetHeight - 90, 0);
}
