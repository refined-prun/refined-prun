import { expertsStore } from '@src/infrastructure/prun-api/data/experts';
import { productionStore } from '@src/infrastructure/prun-api/data/production';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { timestampEachMinute } from '@src/utils/dayjs';
import { formatEta } from '@src/utils/format';
import { createReactiveDiv } from '@src/utils/reactive-element';
import { getRecurringOrders } from '@src/core/orders';
import { sumBy } from '@src/utils/sum-by';

const orderedExpertiseRows = [
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

// https://handbook.apex.prosperousuniverse.com/wiki/efficiency-factors/index.html#expert-spawn-rates--bonuses
const expertDays = [10.0, 12.5, 57.57, 276.5, 915.1];
const MS_IN_DAY = 24 * 60 * 60 * 1000;

function onTileReady(tile: PrunTile) {
  const site = sitesStore.getById(tile.parameter)!;

  subscribe($$(tile.anchor, 'tr'), tr => {
    if (_$(tr, 'th')) {
      const header = document.createElement('th');
      header.textContent = 'ETA';
      tr.append(header);
      return;
    }
    const parent = tr.parentElement!;
    const index = Array.from(parent.children).indexOf(tr);
    if (index >= orderedExpertiseRows.length) {
      return;
    }
    const expertise = orderedExpertiseRows[index];
    onExpertRowReady(tr, expertise, site.siteId);
  });
}

function onExpertRowReady(row: HTMLTableRowElement, expertise: string, siteId: string) {
  const expertEntry = computed(() => {
    const experts = expertsStore.getBySiteId(siteId);
    return experts?.experts.find(x => x.category === expertise)?.entry;
  });

  const expertLines = computed(() => {
    const production = productionStore.getBySiteId(siteId);
    return production?.filter(line =>
      line.efficiencyFactors.some(x => x.type === 'EXPERTS' && x.expertiseCategory === expertise),
    );
  });

  const eta = computed(() => {
    const entry = expertEntry.value;
    const lines = expertLines.value;
    return entry && lines ? calculateEta(entry, lines) : undefined;
  });

  const text = computed(() => {
    const entry = expertEntry.value;
    const lines = expertLines.value;
    if (!entry || !lines) {
      return '--';
    }

    if (getTotalExperts(entry) >= entry.limit) {
      return 'Maxed';
    }

    if (!eta.value) {
      return '--';
    }

    if (eta.value.type === 'precise') {
      return `${formatEta(timestampEachMinute.value, eta.value.ms)}`;
    }

    if (eta.value.type === 'estimate') {
      return `~${(eta.value.ms / MS_IN_DAY).toFixed(1)}d`;
    }

    return '--';
  });

  const div = createReactiveDiv(row, text);
  div.style.whiteSpace = 'pre-wrap';
  const td = document.createElement('td');
  td.append(div);
  row.append(td);
}

function calculateEta(entry: PrunApi.ExpertFieldEntry, lines: PrunApi.ProductionLine[]) {
  if (lines.length === 0) {
    return undefined;
  }

  const remainingExperience = (1 - entry.progress) * expertDays[getTotalExperts(entry)] * MS_IN_DAY;
  const inProgressOrders = lines
    .flatMap(line =>
      line.orders
        .filter(x => x.completion)
        .map(x => ({
          order: x,
          completion: x.completion!.timestamp,
          experience: getExperience(x, line),
        })),
    )
    .sort((a, b) => a.completion - b.completion);
  if (inProgressOrders.length === 0) {
    return undefined;
  }

  // If we can finish the current expert with the orders already in progress, return that time.
  let accumulatedExperience = 0;
  for (const order of inProgressOrders) {
    accumulatedExperience += order.experience;
    if (accumulatedExperience >= remainingExperience) {
      return {
        type: 'precise',
        ms: order.completion,
      };
    }
  }

  // Otherwise, estimate the remaining number of days.
  let experiencePerMs = 0;
  for (const line of lines) {
    const recurringOrders = getRecurringOrders(line);
    if (recurringOrders.length === 0) {
      continue;
    }
    const totalDuration = sumBy(
      recurringOrders,
      x => x.duration?.millis ?? Number.POSITIVE_INFINITY,
    );
    const totalExperience = sumBy(recurringOrders, x => getExperience(x, line));
    experiencePerMs += (line.capacity * totalExperience) / totalDuration;
  }

  return {
    type: 'estimate',
    ms: remainingExperience / experiencePerMs,
  };
}

function getExperience(order: PrunApi.ProductionOrder, line: PrunApi.ProductionLine) {
  const recipeId = order.recipeId;
  const template = line.productionTemplates.find(x => x.id === recipeId);
  if (!template) {
    return 0;
  }

  const orderSize = order.outputs[0].amount / template.outputFactors[0].factor;
  return template.experience * orderSize;
}

function getTotalExperts(entry: PrunApi.ExpertFieldEntry) {
  return entry.current + entry.available;
}

function init() {
  tiles.observe('EXP', onTileReady);
}

features.add(import.meta.url, init, 'EXP: Displays ETA for next expert to appear.');
