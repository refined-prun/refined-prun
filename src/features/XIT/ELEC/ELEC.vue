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
import { useTileState } from '@src/features/XIT/ELEC/tile-state';
import RadioItem from '@src/components/forms/RadioItem.vue';

interface ElectionWindow {
  electionStart?: number;
  electionEnd?: number;
}

interface ElectionRow extends ElectionWindow {
  planet: string;
  planetNaturalId: string;
  type: 'GOV' | 'COGC';
}

const dayMs = dayjs.duration(1, 'day').asMilliseconds();
const voteCommand = { GOV: 'ADM', COGC: 'COGCPEX' } as const;

const gov = useTileState('gov');
const cogc = useTileState('cogc');

const rows = computed<ElectionRow[] | undefined>(() => {
  const sites = sitesStore.all.value;
  if (!sites) {
    return undefined;
  }

  const govStartedAt = getLatestAlertTimestampByPlanet('ADMIN_CENTER_ELECTION_STARTED');
  const govElectedAt = getLatestAlertTimestampByPlanet('ADMIN_CENTER_GOVERNOR_ELECTED');
  const govReminderAt = getLatestAlertTimestampByPlanet('ADMIN_CENTER_ELECTION_REMINDER');
  const cogcChangedAt = getLatestAlertTimestampByPlanet('COGC_PROGRAM_CHANGED');

  const merged: ElectionRow[] = [];
  for (const site of sites) {
    const naturalId = getEntityNaturalIdFromAddress(site.address);
    const name = getEntityNameFromAddress(site.address);
    if (!naturalId || !name) {
      continue;
    }
    const planet = { planet: `${name} (${naturalId})`, planetNaturalId: naturalId };
    const key = naturalId.toUpperCase();
    merged.push(
      {
        ...planet,
        type: 'GOV',
        ...govWindow(govStartedAt.get(key), govElectedAt.get(key), govReminderAt.get(key)),
      },
      {
        ...planet,
        type: 'COGC',
        ...cogcWindow(cogcChangedAt.get(key)),
      },
    );
  }

  return merged;
});

const filtered = computed(() => {
  if (!rows.value) {
    return undefined;
  }

  return rows.value.filter(
    x => (gov.value && x.type === 'GOV') || (cogc.value && x.type === 'COGC'),
  );
});

const sorted = computed(() => {
  if (!filtered.value) {
    return undefined;
  }

  return filtered.value.slice().sort(compareRows);
});

function govWindow(started?: number, elected?: number, reminder?: number): ElectionWindow {
  let latestAt = -Infinity;
  let result: ElectionWindow = {};
  if (elected !== undefined && elected > latestAt) {
    latestAt = elected;
    result = electionWindow(elected + dayMs * 20, 8);
  }
  if (started !== undefined && started > latestAt) {
    latestAt = started;
    result = electionWindow(started, 8);
  }
  if (reminder !== undefined && reminder > latestAt) {
    result = electionWindow(reminder, 1);
  }
  return result;
}

function cogcWindow(start?: number) {
  return start === undefined ? {} : electionWindow(start, 7);
}

function electionWindow(start: number, durationDays: number): ElectionWindow {
  return { electionStart: start, electionEnd: start + dayMs * durationDays };
}

function compareRows(a: ElectionRow, b: ElectionRow) {
  const groupDiff = getSortGroup(a) - getSortGroup(b);
  if (groupDiff !== 0) {
    return groupDiff;
  }
  if (
    a.electionStart !== undefined &&
    b.electionStart !== undefined &&
    a.electionStart !== b.electionStart
  ) {
    return a.electionStart - b.electionStart;
  }
  const planetDiff = a.planetNaturalId.localeCompare(b.planetNaturalId);
  return planetDiff !== 0 ? planetDiff : a.type.localeCompare(b.type);
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
  <template v-else>
    <div :class="C.ComExOrdersPanel.filter">
      <RadioItem v-model="gov" horizontal>GOV</RadioItem>
      <RadioItem v-model="cogc" horizontal>COGC</RadioItem>
    </div>
    <table>
      <thead>
        <tr>
          <th>Planet</th>
          <th>Type</th>
          <th>Voting</th>
          <th>Ends</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in sorted" :key="`${row.planetNaturalId}:${row.type}`">
          <td>
            <PrunLink inline :command="`PLI ${row.planetNaturalId}`">{{ row.planet }}</PrunLink>
          </td>
          <td>
            <PrunButton dark @click="showBuffer(`${row.type} ${row.planetNaturalId}`)">
              {{ row.type }}
            </PrunButton>
          </td>
          <td>
            <template v-if="row.electionStart === undefined">--</template>
            <PrunButton
              v-else-if="isPastOrNow(row.electionStart)"
              primary
              @click="showBuffer(`${voteCommand[row.type]} ${row.planetNaturalId}`)">
              VOTE
            </PrunButton>
            <template v-else>{{ formatFutureDuration(row.electionStart) }}</template>
          </td>
          <td>
            <template v-if="row.electionEnd === undefined">--</template>
            <template v-else-if="isPastOrNow(row.electionEnd)">Now</template>
            <template v-else>{{ formatFutureDuration(row.electionEnd) }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
</template>
