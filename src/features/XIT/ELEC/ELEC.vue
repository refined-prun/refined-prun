<script setup lang="ts">
import PrunButton from '@src/components/PrunButton.vue';
import PrunLink from '@src/components/PrunLink.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import {
  getEntityNameFromAddress,
  getEntityNaturalIdFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';
import { alertsStore } from '@src/infrastructure/prun-api/data/alerts';
import { sitesStore } from '@src/infrastructure/prun-api/data/sites';
import { dayjsEachSecond, timestampEachMinute } from '@src/utils/dayjs';

interface ElectionRow {
  planet: string;
  planetNaturalId: string;
  electionStart?: number;
  electionEnd?: number;
}

const rows = computed<ElectionRow[] | undefined>(() => {
  const sites = sitesStore.all.value;
  if (!sites) {
    return undefined;
  }

  const electionTimestampByPlanet = new Map<string, number>();
  for (const alert of alertsStore.all.value ?? []) {
    if (alert.type !== 'ADMIN_CENTER_GOVERNOR_ELECTED') {
      continue;
    }
    const naturalId = getPlanetNaturalIdFromAlert(alert)?.toUpperCase();
    if (!naturalId) {
      continue;
    }
    const timestamp = alert.time.timestamp;
    const existing = electionTimestampByPlanet.get(naturalId);
    if (existing === undefined || timestamp > existing) {
      electionTimestampByPlanet.set(naturalId, timestamp);
    }
  }

  const map = new Map<string, ElectionRow>();
  for (const site of sites) {
    const planetNaturalId = getEntityNaturalIdFromAddress(site.address);
    const planetName = getEntityNameFromAddress(site.address);
    if (!planetNaturalId || !planetName) {
      continue;
    }

    const key = planetNaturalId.toUpperCase();
    if (map.has(key)) {
      continue;
    }

    const planet = `${planetName} (${planetNaturalId})`;
    const electionTimestamp = electionTimestampByPlanet.get(key);
    map.set(key, {
      planet,
      planetNaturalId,
      electionStart: electionTimestamp ? electionTimestamp + dayMs * 20 : undefined,
      electionEnd: electionTimestamp ? electionTimestamp + dayMs * 28 : undefined,
    });
  }

  return Array.from(map.values()).sort(compareRows);
});

function compareRows(a: ElectionRow, b: ElectionRow) {
  const groupA = getSortGroup(a);
  const groupB = getSortGroup(b);
  if (groupA !== groupB) {
    return groupA - groupB;
  }

  if (
    a.electionStart !== undefined &&
    b.electionStart !== undefined &&
    a.electionStart !== b.electionStart
  ) {
    return a.electionStart - b.electionStart;
  }

  return a.planetNaturalId.localeCompare(b.planetNaturalId);
}

function getSortGroup(row: ElectionRow) {
  if (isElectionOpen(row)) {
    return 0;
  }
  if (row.electionStart !== undefined) {
    return 1;
  }
  return 2;
}

function isElectionOpen(row: ElectionRow) {
  return (
    row.electionStart !== undefined &&
    row.electionEnd !== undefined &&
    timestampEachMinute.value >= row.electionStart &&
    timestampEachMinute.value < row.electionEnd
  );
}

function formatRelative(timestamp?: number) {
  if (timestamp === undefined) {
    return '—';
  }
  return dayjsEachSecond.value.to(timestamp);
}

function openBuffer(command: string) {
  void showBuffer(command, { force: true });
}

function getPlanetNaturalIdFromAlert(alert: PrunApi.Alert) {
  for (const item of alert.data) {
    if (item.key === 'planet' || item.key === 'address') {
      const address = (item.value as { address?: PrunApi.Address } | undefined)?.address;
      const naturalId = getEntityNaturalIdFromAddress(address);
      if (naturalId) {
        return naturalId;
      }
    }
  }
  return alert.naturalId;
}

const dayMs = 24 * 60 * 60 * 1000;
</script>

<template>
  <LoadingSpinner v-if="rows === undefined" />
  <table v-else>
    <thead>
      <tr>
        <th>Planet</th>
        <th>Voting</th>
        <th>Election</th>
        <th>CMD</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.planetNaturalId">
        <td>
          <PrunLink inline :command="`PLI ${row.planetNaturalId}`">{{ row.planet }}</PrunLink>
        </td>
        <td>
          <PrunLink v-if="isElectionOpen(row)" inline :command="`ADM ${row.planetNaturalId}`">
            {{ formatRelative(row.electionStart) }}
          </PrunLink>
          <template v-else>{{ formatRelative(row.electionStart) }}</template>
        </td>
        <td>{{ formatRelative(row.electionEnd) }}</td>
        <td>
          <div :class="$style.buttons">
            <PrunButton
              inline
              :dark="!isElectionOpen(row)"
              :primary="isElectionOpen(row)"
              @click="openBuffer(`ADM ${row.planetNaturalId}`)">
              ADM
            </PrunButton>
            <PrunButton dark inline @click="openBuffer(`GOV ${row.planetNaturalId}`)">
              GOV
            </PrunButton>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style module>
.buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.25rem;
}
</style>
