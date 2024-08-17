import socketIOMiddleware from './socket-io-middleware';
import user, { BaseSiteEntry } from '@src/store/user';
import { dispatch } from '@src/prun-api/data/api-messages';

let companyContext: string | undefined;

export async function listenPrunApi() {
  socketIOMiddleware<PrunApi.Packet>((context, payload) => {
    try {
      if (context === companyContext || !companyContext || !context) {
        processEvent(payload);
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  });
}

function processEvent(packet: PrunApi.Packet) {
  if (__DEV__) {
    performance.mark(`${packet.messageType}-START`);
  }

  if (__DEV__ && packet.messageType !== 'ACTION_COMPLETED') {
    console.log(packet);
  }

  if (packet.messageType === 'ACTION_COMPLETED') {
    const message = packet.payload?.message;
    if (message) {
      const storeAction = {
        type: message.messageType,
        data: message.payload,
      };
      dispatch(storeAction);
      message['dispatched'] = true;
    }
  } else if (!packet['dispatched']) {
    const storeAction = {
      type: packet.messageType,
      data: packet.payload,
    };
    dispatch(storeAction);
  }

  switch (packet.messageType) {
    case 'ACTION_COMPLETED': {
      const message = packet.payload.message;
      if (message) {
        processEvent(message);
      }
      break;
    }
    case 'USER_DATA': {
      const context = packet.payload.contexts.find(x => x.type === 'COMPANY');
      companyContext = context?.id ?? companyContext;
      break;
    }
    case 'SITE_SITES': {
      user.sites = user.sites.filter(item => item.type !== 'BASE');

      for (const site of packet.payload.sites) {
        const siteData: BaseSiteEntry = {
          PlanetName: site.address.lines[1].entity.name,
          PlanetNaturalId: site.address.lines[1].entity.naturalId,
          siteId: site.siteId,
          buildings: [],
          type: 'BASE',
        };

        for (const building of site.platforms) {
          const buildingTicker = building.module.reactorTicker;

          const lastRepair = building.lastRepair?.timestamp ?? building.creationTime.timestamp;

          siteData.buildings.push({
            buildingTicker,
            lastRepair,
            condition: building.condition,
            reclaimableMaterials: building.reclaimableMaterials,
            repairMaterials: building.repairMaterials,
          });
        }

        user.sites.push(siteData);
      }
      break;
    }
  }

  if (__DEV__) {
    performance.mark(`${packet.messageType}-END`);
    performance.measure(
      packet.messageType,
      `${packet.messageType}-START`,
      `${packet.messageType}-END`,
    );
  }
}
