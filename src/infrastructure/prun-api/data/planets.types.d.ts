declare namespace PrunApi {
  interface Planet {
    address: Address;
    adminCenterId: string;
    buildOptions: BuildOptions[];
    celestialBodies: unknown[];
    cogcId: string;
    country: Country;
    currency: Currency;
    data: PlanetData;
    governanceType: string;
    governingEntity: string;
    id: string;
    localRules: PlanetLocalRules;
    name: string;
    nameable: boolean;
    namer: string | null;
    namingData: DateTime | null;
    naturalId: string;
    planetId: string;
    populationId: string;
    projects: PlanetProject[];
    supportsGhostSites: boolean;
  }

  interface PlanetProject {
    entityId: string;
    type: string;
  }

  interface PlanetLocalRules {
    collector: PlanetCollector;
    currency: Currency;
    localMarketFee: PlanetMarketFee;
    productionFeeLimitFactors: number[];
    productionFees: PlanetProductionFees;
    siteEstablishmentFee: PlanetFee;
    warehouseFee: PlanetFee;
  }

  interface PlanetFee {
    fee: number;
  }

  interface PlanetProductionFees {
    fees: PlanetProductionFee[];
  }

  interface PlanetProductionFee {
    category: ExpertiseCategory;
    fee: Cost;
    workforceLevel: WorkforceLevel;
  }

  interface PlanetMarketFee {
    base: number;
    timeFactor: number;
  }

  interface PlanetCollector {
    currency: Currency;
  }

  interface PlanetData {
    fertility: number;
    gravity: number;
    magneticField: number;
    mass: number;
    massEarth: AddressOrbit;
    orbitIndex: number;
    plots: number;
    pressure: number;
    radiation: number;
    radius: number;
    resources: PlanetResource[];
    sunlight: number;
    surface: boolean;
    temperature: number;
  }

  interface PlanetResource {
    factor: number;
    materialId: string;
    type: ResourceType;
  }

  type ResourceType = 'GASEOUS' | 'LIQUID' | 'MINERAL';

  interface Country {
    code: CountryCode;
    id: string;
    name: CountryName;
  }

  type CountryCode = 'CI' | 'NC' | 'IC' | 'AI';
  type CountryName =
    | 'Castillo-Ito Mercantile'
    | 'NEO Charter Exploration'
    | 'Insitor Cooperative'
    | 'Antares Initiative';

  interface Currency {
    code: CurrencyCode;
    decimals: number;
    name: CurrencyName;
    numericCode: number;
  }

  type CurrencyCode = 'CIS' | 'NCC' | 'ICA' | 'AIC';
  type CurrencyName = 'Sol' | 'NCE Coupons' | 'Austral' | 'Martian Coin';

  interface BuildOptions {
    options: BuildOption[];
  }

  interface BuildOption {
    billOfMaterial: MaterialQuantities;
    costs: Cost;
    feeReceiver: string;
    siteType: string;
  }

  interface Cost {
    amount: number;
    currency: string;
  }
}
