import { expertsStore } from '@src/infrastructure/prun-api/data/experts';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { timestampEachMinute } from '@src/utils/dayjs';
import { formatEta } from '@src/utils/format';
import { createReactiveDiv } from '@src/utils/reactive-element';

const expertise = [
  'AGRICULTURE',
  'CHEMISTRY',
  'CONSTRUCTION',
  'ELECTRONICS',
  'FOOD_INDUSTRIES',
  'FUEL_REFINING',
  'MANUFACTURING',
  'METALLURGY',
  'RESOURCE_EXTRACTION',
];

const expertDays = [10.0, 12.5, 57.57, 276.5, 915.1];

function onTileReady(tile: PrunTile) {
  const site = sitesStore.getById(tile.parameter)!;

  let index = 0;
  subscribe($$(tile.anchor, 'tr'), tr => {
    if (_$(tr, 'th')) {
      const header = document.createElement('th');
      header.textContent = 'Expert ETA';
      tr.append(header);
      return;
    }
    onExpertRowReady(tr, index++, site.siteId);
  });
}

function onExpertRowReady(row: HTMLTableRowElement, index: number, siteId: string) {
  const expertField = computed(() => {
    const experts = expertsStore.getBySiteId(siteId);
    return experts?.experts.find(field => field.category === expertise[index]);
  });

  const expertOrders = computed(() => {
    const production = productionStore.getBySiteId(siteId);
    // Combine all production orders from all lines that contribute to this expert field.
    const expertFieldLines = production?.filter(line =>
      line.efficiencyFactors.some(
        factor => factor.type === 'EXPERTS' && factor.expertiseCategory === expertise[index],
      ),
    );
    // Sort them by ascending completion time if ongoing, and by ascending creation time if queued.
    return expertFieldLines?.flatMap(line => line.orders).sort(sortOrders);
  });

  const completion = computed(() => {
    if (!expertField.value) {
      return undefined;
    }
    if (expertField.value.entry.current === 5) {
      return [-1];
    }
    const orders = expertOrders.value;
    if (orders && orders.length > 0) {
      const entry = expertField.value.entry;
      const msToGo = (1 - entry.progress) * expertDays[entry.current] * 86400000;

      // Get completion time and duration for all orders, including queued ones.
      const completions: number[] = [];
      let contributingOrdersTime = 0;
      for (const order of orders) {
        const duration = order.completion
          ? order.completion!.timestamp - Date.now()
          : order.duration!.millis;
        contributingOrdersTime += duration;
        if (order.completion) {
          completions.push(order.completion.timestamp);
        } else {
          completions.push(completions.shift()! + duration);
          completions.sort();
        }
        if (contributingOrdersTime > msToGo) {
          return [-2, completions[completions.length - 1]];
        }
      }

      // All ongoing and queued orders completed, but we still need more for a new expert.
      return [-3, completions[completions.length - 1], msToGo - contributingOrdersTime];
    }
    return undefined;
  });

  const text = computed(() => {
    if (!completion.value) {
      return 'No production.';
    } else if (completion.value[0] === -1) {
      return 'Experts Maxed.';
    } else if (completion.value[0] === -2) {
      return `(${formatEta(timestampEachMinute.value, completion.value[1])})`;
    } else if (completion.value[0] === -3) {
      return `(${formatEta(timestampEachMinute.value, completion.value[1])}) +\n(${formatDuration(completion.value[2])}) needed`;
    }
    return `Error`;
  });

  const div = createReactiveDiv(row, text);
  div.style.whiteSpace = 'pre-wrap';
  const td = document.createElement('td');
  td.append(div);
  row.append(td);
}

function sortOrders(a: PrunApi.ProductionOrder, b: PrunApi.ProductionOrder) {
  if (!a.completion && !b.completion) {
    return a.created.timestamp - b.created.timestamp;
  }
  if (!a.completion) {
    return 1;
  }
  if (!b.completion) {
    return -1;
  }
  return a.completion!.timestamp - b.completion!.timestamp;
}

// Would have used Intl.DurationFormat but it doesn't exist in the typescript.
function formatDuration(millis: number) {
  const seconds = Math.floor(millis / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;

  return `${days}d, ${remainingHours}h, ${remainingMinutes}m`;
}

function init() {
  tiles.observe('EXP', onTileReady);
}

features.add(import.meta.url, init, 'EXP: Display ETA for next expert to appear.');
