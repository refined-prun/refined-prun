<script setup lang="ts">
import { useXitParameters } from '@src/hooks/use-xit-parameters';
import ExecuteActionPackage from '@src/features/XIT/ACT/ExecuteActionPackage.vue';
import { agentReadyPackages, parseChainId } from '@src/features/XIT/ACT/agent-sync';
import { AGENT_DONE } from '@src/features/XIT/ACT/action-steps/AGENT_DONE';
import { OPEN_SFC } from '@src/features/XIT/ACT/action-steps/OPEN_SFC';
import { MTRA_TRANSFER } from '@src/features/XIT/ACT/action-steps/MTRA_TRANSFER';
import { deserializeStorage } from '@src/features/XIT/ACT/actions/utils';
import { ActionStep, configurableValue } from '@src/features/XIT/ACT/shared-types';
import { getPlanetBurn } from '@src/core/burn';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';

const parameters = useXitParameters();
const messageId = parameters.join(' ');

// Snapshot the entry: AGENT_DONE removes it from agentReadyPackages mid-run.
// A computed entry would trigger v-if and unmount the runner before later steps finish.
const entry = agentReadyPackages.value.find(x => x.messageId === messageId);

// Plan base-to-ship loads from burn data before unloading, so newly delivered goods are excluded.
function buildLoadSteps(baseStore: PrunApi.Store, shipStore: PrunApi.Store) {
  const burn = getPlanetBurn(sitesStore.getById(baseStore.addressableId))?.burn;
  const loadAll: ActionStep[] = [];
  const playerReview: ActionStep[] = [];

  for (const item of baseStore.items) {
    if (!item.quantity) {
      continue;
    }
    const ticker = item.quantity.material.ticker;
    const invAmount = item.quantity.amount;
    if (invAmount <= 0) {
      continue;
    }

    // Missing burn data leaves both rates at zero, requiring player review for every ticker.
    const production = burn?.[ticker]?.output ?? 0;
    const consumption = (burn?.[ticker]?.input ?? 0) + (burn?.[ticker]?.workforce ?? 0);

    if (production > 0 && consumption === 0) {
      // Produced only - load everything available at execution time.
      loadAll.push(
        MTRA_TRANSFER({
          from: baseStore.id,
          to: shipStore.id,
          ticker,
          amount: invAmount,
          loadAll: true,
        }),
      );
    } else if (production > consumption && consumption > 0) {
      // Net produced but also consumed - leave a 2-day buffer at the base.
      playerReview.push(
        MTRA_TRANSFER({
          from: baseStore.id,
          to: shipStore.id,
          ticker,
          amount: Math.max(1, Math.floor(invAmount - 2 * consumption)),
          playerReview: true,
        }),
      );
    } else if (production === 0 && consumption === 0) {
      // Neutral (including tickers absent from burn) - player decides.
      playerReview.push(
        MTRA_TRANSFER({
          from: baseStore.id,
          to: shipStore.id,
          ticker,
          amount: invAmount,
          playerReview: true,
        }),
      );
    }
    // Consumed (net-negative or pure input/workforce): ignore.
  }

  return [...loadAll, ...playerReview];
}

const extraSteps = computed(() => {
  if (!entry) {
    return undefined;
  }
  const steps: ActionStep[] = [];
  if (entry.id) {
    steps.push(AGENT_DONE({ id: entry.id }));
  }

  const origin = entry.pkg.actions.find(x => x.type === 'MTRA')?.origin;
  if (origin === undefined || origin === configurableValue) {
    return steps;
  }
  const shipStore = deserializeStorage(origin);
  if (shipStore?.type !== 'SHIP_STORE') {
    return steps;
  }

  const mtraDest = entry.pkg.actions.find(x => x.type === 'MTRA')?.dest;
  let baseStore: PrunApi.Store | undefined;
  if (mtraDest !== undefined && mtraDest !== configurableValue) {
    const resolved = deserializeStorage(mtraDest);
    if (resolved?.type === 'STORE') {
      baseStore = resolved;
    }
  }

  // Chain destination for OPEN_SFC (optional - SFC still opens without one).
  let destination: string | undefined;
  if (entry.id) {
    const chain = parseChainId(entry.id);
    if (chain) {
      const next = agentReadyPackages.value.find(x => x.id === `${chain.base}-${chain.index + 1}`);
      const nextDest = next?.pkg.actions.find(x => x.type === 'MTRA')?.dest;
      if (nextDest !== undefined && nextDest !== configurableValue && nextDest.endsWith(' Base')) {
        destination = nextDest.slice(0, -' Base'.length);
      }
    }
  }

  if (baseStore) {
    steps.push(...buildLoadSteps(baseStore, shipStore));
  }
  steps.push(OPEN_SFC({ shipId: shipStore.addressableId, destination }));
  return steps;
});
</script>

<template>
  <div v-if="!entry"> Package "{{ messageId }}" not found. Refresh XIT AGT and try again. </div>
  <ExecuteActionPackage v-else :pkg="entry.pkg" :extra-steps="extraSteps" />
</template>
