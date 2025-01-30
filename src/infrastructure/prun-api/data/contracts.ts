import { createEntityStore } from '@src/infrastructure/prun-api/data/create-entity-store';
import { onApiMessage } from '@src/infrastructure/prun-api/data/api-messages';
import { createMapGetter } from '@src/infrastructure/prun-api/data/create-map-getter';
import {
  getEntityNameFromAddress,
  getLocationLineFromAddress,
} from '@src/infrastructure/prun-api/data/addresses';

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

function getByShipmentId(id?: string | undefined) {
  if (!id) {
    return undefined;
  }

  const all = state.all.value;
  if (all === undefined) {
    return undefined;
  }

  for (const contract of all) {
    const condition = contract.conditions.find(
      x => x.type === 'DELIVERY_SHIPMENT' && x.shipmentItemId?.startsWith(id),
    );
    if (condition) {
      return contract;
    }
  }

  return undefined;
}

function getDeliveryConditionByShipmentId(id?: string | undefined) {
  if (!id) {
    return undefined;
  }

  const all = state.all.value;
  if (all === undefined) {
    return undefined;
  }

  for (const contract of all) {
    for (const condition of contract.conditions) {
      if (
        condition.type === 'PROVISION_SHIPMENT' &&
        condition.blockId?.toLowerCase().startsWith(id.toLowerCase())
      ) {
        const delivery = contract.conditions.find(x => x.type === 'DELIVERY_SHIPMENT');
        if (delivery) {
          return delivery;
        }
      }
      if (
        condition.type === 'DELIVERY_SHIPMENT' &&
        condition.shipmentItemId?.toLowerCase().startsWith(id.toLowerCase())
      ) {
        return condition;
      }
    }
  }

  return undefined;
}

function getDestinationByShipmentId(id?: string | undefined) {
  const deliveryCondition = getDeliveryConditionByShipmentId(id);
  const destination = deliveryCondition?.destination;
  if (!destination) {
    return undefined;
  }

  const location = getLocationLineFromAddress(destination);
  if (location?.type === 'STATION') {
    return location.entity.naturalId;
  }

  return getEntityNameFromAddress(destination);
}

function getDeliveryConditionByLocalContractId(id?: string | undefined) {
  if (!id) {
    return undefined;
  }

  const all = state.all.value;
  if (all === undefined) {
    return undefined;
  }

  return all.find(x => x.localId === id)?.conditions.find(x => x.type === 'DELIVERY_SHIPMENT');
}

function getDestinationByLocalContractId(id?: string | undefined) {
  const deliveryCondition = getDeliveryConditionByLocalContractId(id);
  const destination = deliveryCondition?.destination;
  if (!destination) {
    return undefined;
  }

  const location = getLocationLineFromAddress(destination);
  if (location?.type === 'STATION') {
    return location.entity.naturalId;
  }

  return getEntityNameFromAddress(destination);
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
  getDestinationByLocalContractId,
};

export function isFactionContract(contract: PrunApi.Contract) {
  return contract.partner.countryCode !== undefined;
}
