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
import { elecFakeRows } from './ELEC.test-fixtures';
import dayjs from 'dayjs';

interface ElectionRow {
  planet: string;
  planetNaturalId: string;
  type: 'GOV' | 'COGC';
  electionStart?: number;
  electionEnd?: number;
}

const dayMs = 24 * 60 * 60 * 1000;

const rows = computed<ElectionRow[] | undefined>(() => {
  const sites = sitesStore.all.value;
  if (!sites) {
    return undefined;
  }

  const govElectionTimestampByPlanet = getLatestAlertTimestampByPlanet(
    'ADMIN_CENTER_GOVERNOR_ELECTED',
  );
  const cogcElectionTimestampByPlanet = getLatestAlertTimestampByPlanet('COGC_PROGRAM_CHANGED');

  const map = new Map<string, { planet: string; planetNaturalId: string }>();
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

    map.set(key, { planet: `${planetName} (${planetNaturalId})`, planetNaturalId });
  }

  const merged: ElectionRow[] = [];
  for (const planet of map.values()) {
    const planetKey = planet.planetNaturalId.toUpperCase();
    const govElectionTimestamp = govElectionTimestampByPlanet.get(planetKey);
    const cogcElectionTimestamp = cogcElectionTimestampByPlanet.get(planetKey);

    merged.push({
      ...planet,
      type: 'GOV',
      electionStart:
        govElectionTimestamp === undefined ? undefined : govElectionTimestamp + dayMs * 20,
      electionEnd:
        govElectionTimestamp === undefined ? undefined : govElectionTimestamp + dayMs * 28,
    });

    merged.push({
      ...planet,
      type: 'COGC',
      electionStart: cogcElectionTimestamp,
      electionEnd:
        cogcElectionTimestamp === undefined ? undefined : cogcElectionTimestamp + dayMs * 7,
    });
  }

  // Uncomment to include test date in the table
  // merged.push(...elecFakeRows(timestampEachSecond.value));

  return merged.sort(compareRows);
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

  const planetDiff = a.planetNaturalId.localeCompare(b.planetNaturalId);
  if (planetDiff !== 0) {
    return planetDiff;
  }
  return a.type.localeCompare(b.type);
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

function getTypeCommand(row: ElectionRow) {
  return row.type === 'GOV' ? `GOV ${row.planetNaturalId}` : `COGC ${row.planetNaturalId}`;
}

function getVoteCommand(row: ElectionRow) {
  return row.type === 'GOV' ? `ADM ${row.planetNaturalId}` : `COGCPEX ${row.planetNaturalId}`;
}

function getLatestAlertTimestampByPlanet(type: PrunApi.AlertType) {
  const timestamps = new Map<string, number>();
  for (const alert of alertsStore.all.value ?? []) {
    if (alert.type !== type) {
      continue;
    }
    const naturalId = getPlanetNaturalIdFromAlert(alert)?.toUpperCase();
    if (!naturalId) {
      continue;
    }
    const timestamp = alert.time.timestamp;
    const existing = timestamps.get(naturalId);
    if (existing === undefined || timestamp > existing) {
      timestamps.set(naturalId, timestamp);
    }
  }
  return timestamps;
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
</script>

<template>
  <LoadingSpinner v-if="rows === undefined" />
  <table v-else>
    <thead>
      <tr>
        <th>Planet</th>
        <th>Type</th>
        <th>Voting</th>
        <th>Ends</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="`${row.planetNaturalId}:${row.type}`">
        <td>
          <PrunLink inline :command="`PLI ${row.planetNaturalId}`">{{ row.planet }}</PrunLink>
        </td>
        <td>
          <PrunButton dark @click="openBuffer(getTypeCommand(row))">
            {{ row.type }}
          </PrunButton>
        </td>
        <td>
          <template v-if="row.electionStart === undefined">—</template>
          <PrunButton
            v-else-if="isPastOrNow(row.electionStart)"
            primary
            @click="openBuffer(getVoteCommand(row))">
            VOTE
          </PrunButton>
          <template v-else>{{ formatFutureDuration(row.electionStart) }}</template>
        </td>
        <td>
          <template v-if="row.electionEnd === undefined">—</template>
          <template v-else-if="isPastOrNow(row.electionEnd)">Now</template>
          <template v-else>{{ formatFutureDuration(row.electionEnd) }}</template>
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
