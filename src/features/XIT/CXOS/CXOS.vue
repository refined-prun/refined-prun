<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { cxosStore } from '@src/infrastructure/prun-api/data/cxos';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import TickerRow from '@src/features/XIT/CXOS/TickerRow.vue';
import { isEmpty } from 'ts-extras';
import { getPrunId } from '@src/infrastructure/prun-ui/attributes';
import { setBufferSize } from '@src/infrastructure/prun-ui/buffers';
import { sleep } from '@src/utils/sleep';
import { C } from '@src/infrastructure/prun-ui/prun-css';
import { openTickerDetails, hasCxosFilters } from '@src/features/XIT/CXOS/multi-buffer';
import { userData } from '@src/store/user-data';
import { storagesStore } from '@src/infrastructure/prun-api/data/storage';
import { materialCategoriesStore } from '@src/infrastructure/prun-api/data/material-categories';
import { calcMaterialAmountPrice } from '@src/infrastructure/fio/cx';
import { fixed0 } from '@src/utils/format';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { warehousesStore } from '@src/infrastructure/prun-api/data/warehouses';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import {
  getEntityNameFromAddress,
  getLocationLineFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';

export interface AggregatedTicker {
  id: string;
  ticker: string;
  exchange: string;
  currency: string;
  buyVolume: number;
  sellVolume: number;
  totalVolume: number;
  buyItems: number;
  sellItems: number;
}

const EXCHANGE_CURRENCIES: Record<string, string> = {
  CI1: 'CIS',
  NC1: 'NCC',
  AI1: 'AIC',
  IC1: 'ICA',
  CI2: 'CIS',
  NC2: 'NCC',
};

const EXCHANGE_STATIONS: Record<string, string> = {
  CI1: 'Benten',
  NC1: 'Moria',
  AI1: 'Antares',
  IC1: 'Hortus',
  CI2: 'Arclight',
  NC2: 'Hubur',
};

const rootEl = ref<HTMLElement | null>(null);
const currentMode = ref<'transactions' | 'stock'>('transactions');
const timeFrameHours = ref(24);
const orders = computed(() => cxosStore.all.value);

const quickTicker = ref('');
const quickExchange = ref('CI1');

// Filters & Selections
// The exchange, category and search filters are a PRO feature in the native CXOS.
const hasFilters = computed(() => hasCxosFilters());
const filterExchange = computed({
  get: () => (hasFilters.value ? userData.settings.cxosExchange : 'ALL'),
  set: (x: string) => {
    userData.settings.cxosExchange = x as UserData.Exchange | 'ALL';
  },
});
const filterCategory = ref<string>('ALL');
const stockSearchQuery = ref('');
const valueMode = ref<'total' | 'inStock'>('total');

// Sorting State
const sortBy = ref<string>('invValue');
const sortDesc = ref<boolean>(true);

const categoryOptions = computed(() =>
  (materialCategoriesStore.all.value ?? []).slice().sort((a, b) => a.name.localeCompare(b.name)),
);

const defaultCurrency = computed(() => EXCHANGE_CURRENCIES[quickExchange.value] || 'CIS');

const openQuickLink = async () => {
  const ticker = quickTicker.value.trim().toUpperCase();
  const exchange = quickExchange.value;
  if (ticker && exchange) {
    await openTickerDetails(ticker, exchange);
  }
};

const onTickerClick = async (row: { ticker: string; exchange: string }) => {
  await openTickerDetails(row.ticker, row.exchange);
};

const formatElapsedTime = (timestamp: number | null): string => {
  if (timestamp === null) {
    return '-';
  }
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const handleSort = (column: string) => {
  if (sortBy.value === column) {
    sortDesc.value = !sortDesc.value;
  } else {
    sortBy.value = column;
    sortDesc.value = true;
  }
};

// Location Resolution Helpers
function resolveStorageLocationName(storage: PrunApi.Store): string {
  switch (storage.type) {
    case 'STORE': {
      const site = sitesStore.getById(storage.addressableId);
      return getEntityNameFromAddress(site?.address) ?? '';
    }
    case 'WAREHOUSE_STORE': {
      const warehouse = warehousesStore.getById(storage.addressableId);
      return getEntityNameFromAddress(warehouse?.address) ?? '';
    }
    case 'SHIP_STORE':
    case 'STL_FUEL_STORE':
    case 'FTL_FUEL_STORE': {
      const ship = shipsStore.getById(storage.addressableId);
      return ship?.name ?? storage.name ?? '';
    }
    default:
      return storage.name ?? '';
  }
}

function isStationWarehouse(storage: PrunApi.Store): boolean {
  if (storage.type !== 'WAREHOUSE_STORE') {
    return false;
  }
  const warehouse = warehousesStore.getById(storage.addressableId);
  const location = getLocationLineFromAddress(warehouse?.address);
  return location?.type === 'STATION';
}

// Mode A: Transactions (Volume Trade History)
const aggregatedTickers = computed(() => {
  if (!orders.value) {
    return [];
  }

  const map = new Map<string, AggregatedTicker>();
  const cutoffTime = Date.now() - timeFrameHours.value * 60 * 60 * 1000;

  for (const order of orders.value) {
    const tickerStr = order.material.ticker;
    const exchangeStr = order.exchange.code;
    const id = `${tickerStr}.${exchangeStr}`;

    if (!map.has(id)) {
      map.set(id, {
        id,
        ticker: tickerStr,
        exchange: exchangeStr,
        currency: order.limit?.currency || '',
        buyVolume: 0,
        sellVolume: 0,
        totalVolume: 0,
        buyItems: 0,
        sellItems: 0,
      });
    }

    const agg = map.get(id)!;

    // Aggregate recent trades by CURRENCY VOLUME
    for (const trade of order.trades) {
      if (trade.time.timestamp >= cutoffTime) {
        const tradeValue = trade.amount * trade.price.amount;
        agg.currency = trade.price.currency;

        if (order.type === 'BUYING') {
          agg.buyVolume += tradeValue;
          agg.buyItems += trade.amount;
        } else {
          agg.sellVolume += tradeValue;
          agg.sellItems += trade.amount;
        }
      }
    }

    agg.totalVolume = agg.buyVolume + agg.sellVolume;
  }

  return Array.from(map.values())
    .filter(agg => agg.totalVolume > 0)
    .sort((a, b) => b.totalVolume - a.totalVolume);
});

// Helper to filter storages reactively, isolating to CX Station Warehouses
const filteredStorages = computed(() => {
  const storages = storagesStore.all.value;
  if (!storages) {
    return [];
  }
  return storages.filter(storage => {
    // 1. Always restrict scope strictly to CX Warehouses (Station Storage)
    if (!isStationWarehouse(storage)) {
      return false;
    }

    // 2. Filter by selected location / exchange station
    if (filterExchange.value !== 'ALL') {
      const resolvedName = resolveStorageLocationName(storage).toLowerCase();
      const keyword = EXCHANGE_STATIONS[filterExchange.value]?.toLowerCase();
      if (keyword && !resolvedName.includes(keyword)) {
        return false;
      }
    }

    return true;
  });
});

// Mode B: Stock & Bids Raw Data
const rawStockAndBidsData = computed(() => {
  if (!orders.value) {
    return [];
  }
  const storages = filteredStorages.value;

  // 1. Gather all unique physical storage assets grouped by ticker
  const physicalStockMap = new Map<string, { material: PrunApi.Material; amount: number }>();
  for (const storage of storages) {
    for (const item of storage.items) {
      if (item.quantity === undefined || item.quantity.amount === 0) {
        continue;
      }
      const ticker = item.quantity.material.ticker;
      if (!physicalStockMap.has(ticker)) {
        physicalStockMap.set(ticker, {
          material: item.quantity.material,
          amount: 0,
        });
      }
      physicalStockMap.get(ticker)!.amount += item.quantity.amount;
    }
  }

  // 2. Build rows representing active/recent tickers and exchanges
  const rowsMap = new Map<
    string,
    {
      id: string;
      ticker: string;
      exchange: string;
      material: PrunApi.Material;
      currency: string;
      physicalStock: number;
      listedSells: number;
      activeBids: number;
      bestBidPrice: number;
      lastBuyTime: number | null;
      lastSellTime: number | null;
    }
  >();

  for (const order of orders.value) {
    const ticker = order.material.ticker;
    const exchange = order.exchange.code;
    const id = `${ticker}.${exchange}`;

    // Apply active exchange filter on rows mapping
    if (filterExchange.value !== 'ALL' && exchange !== filterExchange.value) {
      continue;
    }

    if (!rowsMap.has(id)) {
      rowsMap.set(id, {
        id,
        ticker,
        exchange,
        material: order.material,
        currency: order.limit?.currency || '',
        physicalStock: 0,
        listedSells: 0,
        activeBids: 0,
        bestBidPrice: 0,
        lastBuyTime: null,
        lastSellTime: null,
      });
    }

    const row = rowsMap.get(id)!;
    if (order.status !== 'FILLED') {
      if (order.type === 'SELLING') {
        row.listedSells += order.amount;
      } else if (order.type === 'BUYING') {
        row.activeBids += order.amount;
        if (order.limit.amount > row.bestBidPrice) {
          row.bestBidPrice = order.limit.amount;
        }
      }
    }

    // Determine Trade Recency
    for (const trade of order.trades) {
      const time = trade.time.timestamp;
      if (order.type === 'BUYING') {
        if (row.lastBuyTime === null || time > row.lastBuyTime) {
          row.lastBuyTime = time;
        }
      } else {
        if (row.lastSellTime === null || time > row.lastSellTime) {
          row.lastSellTime = time;
        }
      }
    }
  }

  // Ensure items with physical stock that don't have order history are rendered under the current exchange scope
  for (const [ticker, stock] of physicalStockMap.entries()) {
    const existingRows = Array.from(rowsMap.values()).filter(r => r.ticker === ticker);
    if (existingRows.length === 0) {
      const exchange =
        filterExchange.value !== 'ALL' ? filterExchange.value : quickExchange.value || 'CI1';
      const id = `${ticker}.${exchange}`;
      rowsMap.set(id, {
        id,
        ticker,
        exchange,
        material: stock.material,
        currency: EXCHANGE_CURRENCIES[exchange] || '',
        physicalStock: 0,
        listedSells: 0,
        activeBids: 0,
        bestBidPrice: 0,
        lastBuyTime: null,
        lastSellTime: null,
      });
    }
  }

  // 3. Assign physical stock to the primary exchange row
  for (const [ticker, stock] of physicalStockMap.entries()) {
    const existingRows = Array.from(rowsMap.values()).filter(r => r.ticker === ticker);
    if (existingRows.length > 0) {
      let primaryRow = existingRows.find(r => r.listedSells > 0 || r.activeBids > 0);
      if (!primaryRow) {
        existingRows.sort((a, b) => a.exchange.localeCompare(b.exchange));
        primaryRow = existingRows[0];
      }
      primaryRow.physicalStock = stock.amount;
    }
  }

  // Calculate market valuations
  return Array.from(rowsMap.values()).map(row => {
    const totalInvAmount =
      valueMode.value === 'inStock' ? row.physicalStock : row.physicalStock + row.listedSells;
    let invValue = 0;
    if (totalInvAmount > 0) {
      const val = calcMaterialAmountPrice({ material: row.material, amount: totalInvAmount });
      if (val !== undefined) {
        invValue = val;
      }
    }

    const bidValue = row.activeBids * row.bestBidPrice;

    return {
      ...row,
      invValue,
      bidValue,
    };
  });
});

// Mode B: Category + live ticker search, applied before sorting
const filteredStockAndBidsData = computed(() => {
  const query = stockSearchQuery.value.trim().toLowerCase();
  return rawStockAndBidsData.value.filter(row => {
    if (filterCategory.value !== 'ALL' && row.material.category !== filterCategory.value) {
      return false;
    }
    if (query && !row.ticker.toLowerCase().includes(query)) {
      return false;
    }
    return true;
  });
});

// Mode B: Sorted Data based on active column headers
const sortedStockAndBidsData = computed(() => {
  const data = [...filteredStockAndBidsData.value];
  data.sort((a, b) => {
    let valA: string | number;
    let valB: string | number;

    switch (sortBy.value) {
      case 'ticker':
        valA = a.id;
        valB = b.id;
        break;
      case 'stock':
        valA = a.physicalStock + a.listedSells;
        valB = b.physicalStock + b.listedSells;
        break;
      case 'invValue':
        valA = a.invValue;
        valB = b.invValue;
        break;
      case 'activeBids':
        valA = a.activeBids;
        valB = b.activeBids;
        break;
      case 'bidValue':
        valA = a.bidValue;
        valB = b.bidValue;
        break;
      case 'bestBidPrice':
        valA = a.bestBidPrice;
        valB = b.bestBidPrice;
        break;
      case 'lastBuy':
        valA = a.lastBuyTime ?? 0;
        valB = b.lastBuyTime ?? 0;
        break;
      case 'lastSell':
        valA = a.lastSellTime ?? 0;
        valB = b.lastSellTime ?? 0;
        break;
      default:
        valA = a.invValue;
        valB = b.invValue;
    }

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDesc.value ? valB.localeCompare(valA) : valA.localeCompare(valB);
    }

    return sortDesc.value ? valB - valA : valA - valB;
  });
  return data;
});

// Matches a material against the active category/search filters (Stock & Bids mode).
function matchesStockFilters(material: PrunApi.Material, query: string) {
  if (filterCategory.value !== 'ALL' && material.category !== filterCategory.value) {
    return false;
  }
  return !query || material.ticker.toLowerCase().includes(query);
}

// Summed Valuation Overviews (Respects active filters, including category/search/value mode)
const totalInventoryValue = computed(() => {
  let sum = 0;
  const storages = filteredStorages.value;
  const query = stockSearchQuery.value.trim().toLowerCase();
  for (const storage of storages) {
    for (const item of storage.items) {
      if (!item.quantity || !matchesStockFilters(item.quantity.material, query)) {
        continue;
      }
      const val = calcMaterialAmountPrice(item.quantity);
      if (val !== undefined) {
        sum += val;
      }
    }
  }

  // Include active selling listings values as part of inventory (respect exchange filter if
  // active), unless the value mode is scoped to physical stock only.
  if (valueMode.value === 'total' && orders.value) {
    for (const order of orders.value) {
      if (order.status !== 'FILLED' && order.type === 'SELLING') {
        if (
          (filterExchange.value === 'ALL' || order.exchange.code === filterExchange.value) &&
          matchesStockFilters(order.material, query)
        ) {
          const val = calcMaterialAmountPrice({ material: order.material, amount: order.amount });
          if (val !== undefined) {
            sum += val;
          }
        }
      }
    }
  }
  return sum;
});

const totalBidValue = computed(() => {
  let sum = 0;
  const query = stockSearchQuery.value.trim().toLowerCase();
  if (orders.value) {
    for (const order of orders.value) {
      if (order.status !== 'FILLED' && order.type === 'BUYING') {
        if (
          (filterExchange.value === 'ALL' || order.exchange.code === filterExchange.value) &&
          matchesStockFilters(order.material, query)
        ) {
          sum += order.amount * order.limit.amount;
        }
      }
    }
  }
  return sum;
});

// Helper to change timeframe
const setTimeFrame = (hours: number) => {
  timeFrameHours.value = hours;
};

onMounted(async () => {
  await sleep(100);
  if (!rootEl.value) {
    return;
  }

  const tile = rootEl.value.closest(`.${C.Tile.tile}`);
  if (!tile) {
    return;
  }

  const id = getPrunId(tile);
  if (id) {
    const idealWidth = Math.floor(document.body.clientWidth * 0.4);
    const idealHeight = document.body.clientHeight - 150;
    setBufferSize(id, idealWidth, idealHeight);
  }
});
</script>

<template>
  <LoadingSpinner v-if="orders === undefined" />
  <div v-else ref="rootEl" :class="$style.container">
    <!-- Top Row: Mode & Quick Link -->
    <div :class="$style.controls">
      <div :class="$style.group">
        <span>Mode: </span>
        <button
          :class="[
            C.Button.btn,
            C.Button.neutral,
            { [$style.active]: currentMode === 'transactions' },
          ]"
          @click="currentMode = 'transactions'"
          >Transactions</button
        >
        <button
          :class="[C.Button.btn, C.Button.neutral, { [$style.active]: currentMode === 'stock' }]"
          @click="currentMode = 'stock'"
          >Stock & Bids</button
        >
      </div>

      <div style="flex-grow: 1" />

      <div :class="$style.group">
        <span>Quick Link: </span>
        <input
          v-model="quickTicker"
          type="text"
          placeholder="Ticker"
          :class="$style.customInput"
          style="width: 70px; text-transform: uppercase"
          @keydown.enter="openQuickLink" />
        <select v-model="quickExchange" :class="$style.customSelect" @keydown.enter="openQuickLink">
          <option value="CI1">CI1</option>
          <option value="NC1">NC1</option>
          <option value="AI1">AI1</option>
          <option value="IC1">IC1</option>
          <option value="CI2">CI2</option>
          <option value="NC2">NC2</option>
        </select>
        <button
          :class="[C.Button.btn, $style.goBtn]"
          :disabled="!quickTicker.trim() || !quickExchange"
          @click="openQuickLink">
          Go
        </button>
      </div>
    </div>

    <!-- Second Row: Mode-Specific Controls -->
    <div v-if="currentMode === 'transactions'" :class="$style.controls">
      <span>Timeframe: </span>
      <button
        :class="[C.Button.btn, C.Button.neutral, { [$style.active]: timeFrameHours === 24 }]"
        @click="setTimeFrame(24)"
        >24h</button
      >
      <button
        :class="[C.Button.btn, C.Button.neutral, { [$style.active]: timeFrameHours === 48 }]"
        @click="setTimeFrame(48)"
        >48h</button
      >
      <button
        :class="[C.Button.btn, C.Button.neutral, { [$style.active]: timeFrameHours === 72 }]"
        @click="setTimeFrame(72)"
        >72h</button
      >
      <span style="margin-left: 10px">Custom (Hrs):</span>
      <input
        v-model.lazy="timeFrameHours"
        type="number"
        :class="$style.customInput"
        title="Custom Hours"
        min="1" />
    </div>

    <div v-else-if="currentMode === 'stock'" :class="$style.controls">
      <template v-if="hasFilters">
        <span>CX: </span>
        <select v-model="filterExchange" :class="[$style.customSelect, $style.exchangeSelect]">
          <option value="ALL">ALL</option>
          <option value="CI1">CI1</option>
          <option value="NC1">NC1</option>
          <option value="AI1">AI1</option>
          <option value="IC1">IC1</option>
          <option value="CI2">CI2</option>
          <option value="NC2">NC2</option>
        </select>
        <span>Category: </span>
        <select v-model="filterCategory" :class="[$style.customSelect, $style.categorySelect]">
          <option value="ALL">ALL</option>
          <option v-for="category in categoryOptions" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <span>Search: </span>
        <input
          v-model="stockSearchQuery"
          type="text"
          :class="$style.customInput"
          style="width: 45px; text-transform: uppercase" />
      </template>
      <div style="flex-grow: 1" />
      <span>Value: </span>
      <button
        :class="[
          C.Button.btn,
          C.Button.neutral,
          $style.smallButton,
          { [$style.active]: valueMode === 'total' },
        ]"
        @click="valueMode = 'total'"
        >Total</button
      >
      <button
        :class="[
          C.Button.btn,
          C.Button.neutral,
          $style.smallButton,
          { [$style.active]: valueMode === 'inStock' },
        ]"
        @click="valueMode = 'inStock'"
        >In Stock</button
      >
    </div>

    <div v-if="currentMode === 'stock'" :class="$style.summaryHeader">
      <div
        >{{ valueMode === 'total' ? 'Total Inv Value:' : 'Total In-Stock Value:' }}
        <span style="color: #f7a600; font-weight: bold"
          >{{ fixed0(totalInventoryValue) }} {{ defaultCurrency }}</span
        ></div
      >
      <div
        >Total Bid Value:
        <span style="color: #f7a600; font-weight: bold"
          >{{ fixed0(totalBidValue) }} {{ defaultCurrency }}</span
        ></div
      >
    </div>

    <!-- Mode A: Historical Trade Volume Transactions -->
    <table v-if="currentMode === 'transactions'">
      <thead>
        <tr>
          <th>Ticker</th>
          <th style="text-align: right">Total Vol</th>
          <th style="text-align: right; color: #5cb85c">Buys</th>
          <th style="text-align: right; color: #d9534f">Sells</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isEmpty(aggregatedTickers)">
          <td colSpan="4">No trades found.</td>
        </tr>
        <template v-else>
          <TickerRow v-for="ticker in aggregatedTickers" :key="ticker.id" :data="ticker" />
        </template>
      </tbody>
    </table>

    <!-- Mode B: Stock Inventory and Bids -->
    <table v-else-if="currentMode === 'stock'">
      <thead>
        <tr>
          <th :class="$style.clickableHeader" @click="handleSort('ticker')">
            Ticker {{ sortBy === 'ticker' ? (sortDesc ? '▼' : '▲') : '' }}
          </th>
          <th :class="[$style.clickableHeader, $style.alignRight]" @click="handleSort('stock')">
            In Stock (Phys/List) {{ sortBy === 'stock' ? (sortDesc ? '▼' : '▲') : '' }}
          </th>
          <th :class="[$style.clickableHeader, $style.alignRight]" @click="handleSort('invValue')">
            {{ valueMode === 'total' ? 'Inv. Value' : 'In Stock Value' }}
            {{ sortBy === 'invValue' ? (sortDesc ? '▼' : '▲') : '' }}
          </th>
          <th
            :class="[$style.clickableHeader, $style.alignRight]"
            @click="handleSort('activeBids')">
            Bids {{ sortBy === 'activeBids' ? (sortDesc ? '▼' : '▲') : '' }}
          </th>
          <th :class="[$style.clickableHeader, $style.alignRight]" @click="handleSort('bidValue')">
            Bid Value {{ sortBy === 'bidValue' ? (sortDesc ? '▼' : '▲') : '' }}
          </th>
          <th
            :class="[$style.clickableHeader, $style.alignRight]"
            @click="handleSort('bestBidPrice')">
            Bid Price {{ sortBy === 'bestBidPrice' ? (sortDesc ? '▼' : '▲') : '' }}
          </th>
          <th :class="[$style.clickableHeader, $style.alignRight]" @click="handleSort('lastBuy')">
            Last Buy {{ sortBy === 'lastBuy' ? (sortDesc ? '▼' : '▲') : '' }}
          </th>
          <th :class="[$style.clickableHeader, $style.alignRight]" @click="handleSort('lastSell')">
            Last Sell {{ sortBy === 'lastSell' ? (sortDesc ? '▼' : '▲') : '' }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isEmpty(sortedStockAndBidsData)">
          <td colSpan="8">No stock or active bids found.</td>
        </tr>
        <template v-else>
          <tr v-for="row in sortedStockAndBidsData" :key="row.id">
            <td>
              <span :class="C.Link.link" @click="onTickerClick(row)">
                {{ row.id }}
              </span>
            </td>
            <td style="text-align: right">
              {{ fixed0(row.physicalStock) }} /
              <span style="color: #d9534f">{{
                row.listedSells ? fixed0(row.listedSells) : '—'
              }}</span>
            </td>
            <td style="text-align: right"
              >{{ fixed0(row.invValue) }} {{ row.currency || defaultCurrency }}</td
            >
            <td style="text-align: right; color: #5cb85c">{{
              row.activeBids ? fixed0(row.activeBids) : '—'
            }}</td>
            <td style="text-align: right"
              >{{ row.bidValue ? fixed0(row.bidValue) : '—' }}
              {{ row.currency || defaultCurrency }}</td
            >
            <td style="text-align: right"
              >{{ row.bestBidPrice ? fixed0(row.bestBidPrice) : '—' }}
              {{ row.currency || defaultCurrency }}</td
            >
            <td style="text-align: right">{{ formatElapsedTime(row.lastBuyTime) }}</td>
            <td style="text-align: right">{{ formatElapsedTime(row.lastSellTime) }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style module>
/* No inner scroller: the game's ScrollView scrolls the tile, as in DISPATCH. */
.container {
  display: flex;
  flex-direction: column;
  padding: 5px;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #2b485a;
}
.group {
  display: flex;
  gap: 6px;
  align-items: center;
}
.active {
  background: #f7a600 !important;
  color: #111e25 !important;
  border: 1px solid #f7a600 !important;
  font-weight: bold;
}
.goBtn {
  background: #f7a600 !important;
  color: #111e25 !important;
  border: 1px solid #f7a600 !important;
  font-weight: bold;
  padding: 2px 8px;
  cursor: pointer;
}
.goBtn:disabled {
  background: #20323e !important;
  color: #5c6e7a !important;
  border: 1px solid #2b485a !important;
  cursor: not-allowed;
}
.customInput {
  width: 60px;
  background: transparent;
  color: white;
  border: 1px solid #2b485a;
  text-align: center;
  padding: 2px 5px;
}
.customSelect {
  width: 80px;
  background: #111e25;
  color: white;
  border: 1px solid #2b485a;
  padding: 2px 5px;
  cursor: pointer;
}
.exchangeSelect {
  width: 56px;
}
.categorySelect {
  width: 136px;
}
.smallButton {
  padding: 2px 6px;
  font-size: 10px;
}
.summaryHeader {
  display: flex;
  justify-content: space-between;
  background: #111e25;
  border: 1px solid #2b485a;
  padding: 6px 10px;
  margin-bottom: 8px;
  font-size: 12px;
}
.clickableHeader {
  cursor: pointer;
  user-select: none;
}
.clickableHeader:hover {
  color: #f7a600 !important;
}
.alignRight {
  text-align: right;
}
</style>
