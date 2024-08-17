declare namespace PrunApi {
  export interface Currency {
    numericCode: number;
    code: string;
    name: string;
    decimals: number;
  }

  export interface ExchangeEntity {
    id: string;
    name: string;
    code: string;
  }

  export interface PrunPacket<T, K> {
    messageType: T;
    payload: K;
  }

  export type Packet = ACTION_COMPLETED.Packet | SYSTEM_STARS_DATA.Packet;

  declare namespace ACTION_COMPLETED {
    export type Packet = PrunPacket<'ACTION_COMPLETED', Payload>;

    export interface Payload {
      actionId: string;
      status: number;
      message: PrunApi.Packet | null;
    }
  }

  declare namespace SYSTEM_STARS_DATA {
    export type Packet = PrunPacket<'SYSTEM_STARS_DATA', Payload>;

    export interface Payload {
      stars: Star[];
    }

    export interface Star {
      systemId: string;
      address: Address;
      name: string;
      type: StarType;
      position: Position;
      sectorId: string;
      subSectorId: string;
      connections: string[];
    }

    export interface Position {
      x: number;
      y: number;
      z: number;
    }

    export type StarType = 'A' | 'B' | 'F' | 'G' | 'K' | 'M' | 'O';
  }
}
