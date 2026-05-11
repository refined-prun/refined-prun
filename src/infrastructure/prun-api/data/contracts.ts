import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';
import { PrefixStore } from '@src/utils/prefix-store';

const store = createEntityStore<PrunApi.Contract>();
const state = store.state;

onApiMessage({
  CONTRACTS_CONTRACTS(data: { contracts: PrunApi.Contract[] }) {
    store.setAll(data.contracts);
    store.setFetched();
  },
  CONTRACTS_CONTRACT(data: PrunApi.Contract) {
    store.setOne(data);
  },
});

const getByLocalId = createMapGetter(state.all, x => x.localId);

const byShipmentId = computed(() => {
  const all = state.all.value;
  if (all === undefined) {
    return undefined;
  }

  const store = new PrefixStore<PrunApi.Contract>();
  for (const contract of all) {
    for (const condition of contract.conditions) {
      if (condition.type === 'DELIVERY_SHIPMENT' && condition.shipmentItemId) {
        store.setOne(condition.shipmentItemId.toLowerCase(), contract);
      }
      if (condition.type === 'PROVISION_SHIPMENT' && condition.blockId) {
        store.setOne(condition.blockId.toLowerCase(), contract);
      }
    }
  }
  return store;
});

function getByShipmentId(id?: string | null) {
  return byShipmentId.value?.findOne(id?.toLowerCase());
}

function getDestinationByShipmentId(id?: string | null) {
  return getDeliveryConditionByShipmentId(id)?.destination;
}

function getDeliveryConditionByShipmentId(id?: string | null) {
  if (!id) {
    return undefined;
  }

  id = id.toLowerCase();
  const contract = getByShipmentId(id);
  if (!contract) {
    return undefined;
  }

  for (const condition of contract.conditions) {
    if (
      condition.type === 'DELIVERY_SHIPMENT' &&
      condition.shipmentItemId?.toLowerCase().startsWith(id)
    ) {
      return condition;
    }

    if (
      condition.type === 'PROVISION_SHIPMENT' &&
      condition.blockId?.toLowerCase().startsWith(id)
    ) {
      const pickupCondition = contract.conditions.find(
        x => x.type === 'PICKUP_SHIPMENT' && x.dependencies.includes(condition.id),
      );
      if (!pickupCondition) {
        return undefined;
      }

      return contract.conditions.find(
        x => x.type === 'DELIVERY_SHIPMENT' && x.dependencies.includes(pickupCondition.id),
      );
    }
  }

  return undefined;
}

export const active = computed(() =>
  state.all.value?.filter(
    x =>
      x.status === 'CLOSED' ||
      x.status === 'PARTIALLY_FULFILLED' ||
      x.status === 'DEADLINE_EXCEEDED',
  ),
);

export const contractsStore = {
  ...state,
  active,
  getByLocalId,
  getByShipmentId,
  getDestinationByShipmentId,
};

export function isFactionContract(contract: PrunApi.Contract) {
  return contract.partner.countryCode !== undefined;
}
