<script setup lang="ts">
import {
  agentChannelStore,
  channelIdentifier,
} from '@src/infrastructure/prun-api/data/agent-channel';
import {
  fetchAgentChannel,
  openAgentChannelWithDraft,
} from '@src/infrastructure/prun-ui/agent-channel-messaging';
import {
  agentReadyPackages,
  getPackageShip,
  isShipAtDestination,
  type PackageDestination,
} from '@src/features/XIT/ACT/agent-sync';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { flightsStore } from '@src/infrastructure/prun-api/data/flights';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { formatEta } from '@src/utils/format';
import { timestampEachMinute } from '@src/utils/dayjs';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import PrunButton from '@src/components/PrunButton.vue';
import PrunLink from '@src/components/PrunLink.vue';
import ActionBar from '@src/components/ActionBar.vue';

const loading = ref(false);

async function refresh() {
  loading.value = true;
  await fetchAgentChannel();
  loading.value = false;
}

const fetched = computed(() => agentChannelStore.fetched.value);
const inaccessible = computed(() => agentChannelStore.inaccessible.value);

function getEta(pkg: UserData.ActionPackageData, destinationNaturalId: string | undefined) {
  if (!destinationNaturalId) {
    return undefined;
  }
  const ship = getPackageShip(pkg);
  if (isShipAtDestination(ship, destinationNaturalId)) {
    return 'Landed';
  }
  const flight = flightsStore.getById(ship?.flightId);
  if (!flight || getEntityNaturalIdFromAddress(flight.destination) !== destinationNaturalId) {
    return undefined;
  }
  return formatEta(timestampEachMinute.value, flight.arrival.timestamp);
}

// Replace natural ids in legacy "Offload <naturalId>" names with the destination's display name.
function getDisplayName(
  pkg: UserData.ActionPackageData,
  destination: PackageDestination | undefined,
) {
  const name = pkg.global.name ?? '';
  return destination ? name.replaceAll(destination.naturalId, destination.name) : name;
}

const packages = computed(() =>
  agentReadyPackages.value.map(entry => ({
    ...entry,
    name: getDisplayName(entry.pkg, entry.destination),
    eta: getEta(entry.pkg, entry.destination?.naturalId),
  })),
);

function openPackage(messageId: string) {
  showBuffer(`XIT AGT ${messageId}`);
}
</script>

<template>
  <ActionBar>
    <PrunButton dark @click="showBuffer('XIT HELP AGT')">What is this?</PrunButton>
    <PrunButton primary :disabled="loading" @click="refresh">REFRESH</PrunButton>
  </ActionBar>
  <div v-if="inaccessible">
    The "{{ channelIdentifier }}" channel isn't set up yet. Open
    <PrunLink command="COM" inline>COM</PrunLink>, click "new group", add no other members, and name
    it "{{ channelIdentifier }}".
  </div>
  <LoadingSpinner v-else-if="loading" />
  <div v-else-if="!fetched">Click REFRESH to load the agent channel.</div>
  <table v-else>
    <thead>
      <tr>
        <th>Name</th>
        <th>Id</th>
        <th>Destination</th>
        <th>ETA</th>
        <th>Execute</th>
        <th>Dismiss</th>
      </tr>
    </thead>
    <tbody v-if="packages.length === 0">
      <tr>
        <td colspan="6">No ready action packages.</td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr v-for="entry in packages" :key="entry.messageId">
        <td>{{ entry.name }}</td>
        <td>{{ entry.id ?? '--' }}</td>
        <td>
          <PrunLink v-if="entry.destination" inline :command="`BS ${entry.destination.naturalId}`">
            {{ entry.destination.name }}
          </PrunLink>
          <template v-else>--</template>
        </td>
        <td>{{ entry.eta ?? '--' }}</td>
        <td>
          <PrunButton v-if="entry.ready" primary @click="openPackage(entry.messageId)">
            OPEN
          </PrunButton>
          <template v-else>waiting for ship to land</template>
        </td>
        <td>
          <PrunButton v-if="entry.id" dark inline @click="openAgentChannelWithDraft(entry.id)">
            dismiss
          </PrunButton>
          <template v-else>--</template>
        </td>
      </tr>
    </tbody>
  </table>
</template>
