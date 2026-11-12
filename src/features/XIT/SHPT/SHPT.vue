<script setup lang="ts">
import RadioItem from '@src/components/forms/RadioItem.vue';
import PrunButton from '@src/components/PrunButton.vue';
import PrunLink from '@src/components/PrunLink.vue';
import LoadingSpinner from '@src/components/LoadingSpinner.vue';
import { shipsStore } from '@src/infrastructure/prun-api/data/ships';
import { getEntityNaturalIdFromAddress } from '@src/infrastructure/prun-api/data/addresses';
import { showBuffer } from '@src/infrastructure/prun-ui/buffers';
import { getPlanetName } from '@src/core/planet-name';
import { getShipFreeSpace } from '@src/core/shipping/shipping-ads';
import { canAcceptContracts, getShipTrips, ShipTrip } from '@src/core/shipping/trips';
import { useTileState } from '@src/features/XIT/SHPT/tile-state';
import { fixed0, fixed01 } from '@src/utils/format';
import { getShipContractsCommand } from '@src/features/XIT/ACT/actions/ship-contracts/command';

const returnTrip = useTileState('returnTrip');

const ships = computed(() =>
  shipsStore.all.value
    ?.filter(x => !x.flightId)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(ship => ({
      ship,
      location: getEntityNaturalIdFromAddress(ship.address),
      space: getShipFreeSpace(ship),
      trips: getShipTrips(ship, returnTrip.value),
    })),
);

function load(ship: PrunApi.Ship, trip: ShipTrip) {
  const keys = trip.outbound.items.map(x => x.key);
  void showBuffer(getShipContractsCommand(ship.registration, trip.destination, keys));
}
</script>

<template>
  <LoadingSpinner v-if="ships === undefined" />
  <template v-else>
    <div :class="C.ComExOrdersPanel.filter">
      <RadioItem v-model="returnTrip" horizontal>with return trip</RadioItem>
    </div>
    <table>
      <thead>
        <tr>
          <th>Destination</th>
          <th>Ads</th>
          <th>t</th>
          <th>m³</th>
          <th>Payout</th>
          <th />
        </tr>
      </thead>
      <tbody v-for="{ ship, location, space, trips } in ships" :key="ship.id">
        <tr>
          <td colspan="6" :class="$style.ship">
            <PrunLink inline :command="`SHP ${ship.registration}`">{{ ship.name }}</PrunLink>
            <template v-if="location && space">
              · {{ getPlanetName(location) }} · free {{ fixed0(space.weight) }}t /
              {{ fixed0(space.volume) }}m³
            </template>
          </td>
        </tr>
        <tr v-if="trips?.length === 0">
          <td colspan="6" :class="$style.empty">No shipping ads for reachable destinations</td>
        </tr>
        <tr v-for="trip in trips ?? []" :key="trip.destination">
          <td>
            <PrunLink inline :command="`LM ${trip.destination}`">
              {{ getPlanetName(trip.destination) }}
            </PrunLink>
            <template v-if="trip.inbound && trip.inbound.items.length > 0"> ⇄</template>
          </td>
          <td>
            {{ fixed0(trip.outbound.items.length) }}
            <template v-if="trip.inbound"> + {{ fixed0(trip.inbound.items.length) }}</template>
          </td>
          <td>{{ fixed01(trip.outbound.weight) }}</td>
          <td>{{ fixed01(trip.outbound.volume) }}</td>
          <td>{{ fixed0(trip.value) }}</td>
          <td>
            <PrunButton
              v-if="canAcceptContracts() && trip.outbound.items.length > 0"
              primary
              inline
              @click="load(ship, trip)">
              LOAD
            </PrunButton>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
</template>

<style module>
.ship {
  font-weight: bold;
}

.empty {
  color: #999;
}
</style>
