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
import { timestampEachSecond } from '@src/utils/dayjs';
import dayjs from 'dayjs';

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
      electionStart: electionTimestamp === undefined ? undefined : electionTimestamp + dayMs * 20,
      electionEnd: electionTimestamp === undefined ? undefined : electionTimestamp + dayMs * 28,
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
  const now = timestampEachSecond.value;
  return (
    row.electionStart !== undefined &&
    row.electionEnd !== undefined &&
    now >= row.electionStart &&
    now < row.electionEnd
  );
}

function isPastOrNow(timestamp?: number) {
  return timestamp !== undefined && timestamp <= timestampEachSecond.value;
}

function formatFutureDuration(timestamp: number) {
  const now = timestampEachSecond.value;
  if (timestamp <= now) {
    return '0s';
  }

  let duration = dayjs.duration({ milliseconds: timestamp - now });
  const days = Math.floor(duration.asDays());
  duration = duration.subtract(days, 'days');
  const hours = Math.floor(duration.asHours());
  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  duration = duration.subtract(hours, 'hours');
  const minutes = Math.floor(duration.asMinutes());
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  duration = duration.subtract(minutes, 'minutes');
  const seconds = Math.floor(duration.asSeconds());
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
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
          <template v-if="row.electionStart === undefined">—</template>
          <PrunButton
            v-else-if="isPastOrNow(row.electionStart)"
            inline
            primary
            @click="openBuffer(`ADM ${row.planetNaturalId}`)">
            VOTE
          </PrunButton>
          <template v-else>{{ formatFutureDuration(row.electionStart) }}</template>
        </td>
        <td>
          <template v-if="row.electionEnd === undefined">—</template>
          <template v-else-if="isPastOrNow(row.electionEnd)">Now</template>
          <template v-else>{{ formatFutureDuration(row.electionEnd) }}</template>
        </td>
        <td>
          <div :class="$style.buttons">
            <PrunButton inline dark @click="openBuffer(`ADM ${row.planetNaturalId}`)">
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
