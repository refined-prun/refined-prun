declare namespace FioApi {
  interface PlanetShort {
    PlanetNaturalId: string;
    PlanetName: string;
  }

  type AllPlanetsShort = PlanetShort[];
}

declare namespace FioApi {
  interface ShippingAd {
    ContractNaturalId: number;
    PlanetId: string;
    PlanetNaturalId: string;
    PlanetName: string;
    OriginPlanetId: string;
    OriginPlanetNaturalId: string;
    OriginPlanetName: string;
    DestinationPlanetId: string;
    DestinationPlanetNaturalId: string;
    DestinationPlanetName: string;
    CargoWeight: number;
    CargoVolume: number;
    CreatorCompanyId: string;
    CreatorCompanyCode: string;
    CreatorCompanyName: string;
    PayoutPrice: number;
    PayoutCurrency: string;
    JumpDistance: number;
    DeliveryTime: number;
    CreationTimeEpochMs: number;
    ExpiryTimeEpochMs: number;
    MinimumRating: string;
  }

  interface Gateway {
    GatewayId: string;
    LocationNaturalId: string;
    OperationalState: string;
    LinkStatus: string;
    OutgoingLink: string | null;
    MaxShipVolume: number;
  }
}
