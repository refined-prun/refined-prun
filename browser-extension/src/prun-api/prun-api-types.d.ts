declare module PrunApi {
  export interface Material {
    name: string;
    id: string;
    ticker: string;
    category: string;
    weight: number;
    volume: number;
    resource: boolean;
  }

  export interface MaterialAmount {
    material: Material;
    amount: number;
  }

  export interface MaterialAmountWithValue {
    value: CurrencyAmount;
    material: Material;
    amount: number;
  }

  export interface Store {
    id: string;
    addressableId: string;
    name: null | string;
    weightLoad: number;
    weightCapacity: number;
    volumeLoad: number;
    volumeCapacity: number;
    items: StoreItem[];
    fixed: boolean;
    tradeStore: boolean;
    rank: number;
    locked: boolean;
    type: string;
  }

  export interface StoreItem {
    quantity: MaterialAmountWithValue;
    id: string;
    type: string;
    weight: number;
    volume: number;
  }

  export interface Currency {
    numericCode: number;
    code: string;
    name: string;
    decimals: number;
  }

  export interface CurrencyAmount {
    currency: string;
    amount: number;
  }

  export interface Address {
    lines: AddressLine[];
  }

  export interface AddressLine {
    entity: AddressEntity;
    type: AddressLineType;
  }

  export interface AddressEntity {
    id: string;
    naturalId: string;
    name: string;
  }

  export enum AddressLineType {
    system = 'SYSTEM',
    station = 'STATION',
    planet = 'PLANET',
  }

  export interface DateTime {
    timestamp: number;
  }

  export interface TimeSpan {
    millis: number;
  }

  export interface Contract {
    id: string;
    localId: string;
    date: DateTime;
    party: ContractParty;
    partner: ContractPartner;
    status: ContractStatus;
    conditions: ContractCondition[];
    extensionDeadline: null;
    canExtend: boolean;
    canRequestTermination: boolean;
    dueDate: DateTime | null;
    name: string | null;
    preamble: null | string;
    terminationSent: boolean;
    terminationReceived: boolean;
    agentContract: boolean;
    relatedContracts: string[];
    contractType: null | string;
  }

  export interface ContractCondition {
    quantity?: MaterialAmount | null;
    address?: Address;
    blockId?: null;
    type: ContractConditionType;
    id: string;
    party: ContractParty;
    index: number;
    status: ContractConditionStatus;
    dependencies: string[];
    deadlineDuration: TimeSpan | null;
    deadline: DateTime | null;
    amount?: CurrencyAmount;
    pickedUp?: MaterialAmount;
    weight?: number;
    volume?: number;
    autoProvisionStoreId?: null | string;
    destination?: Address;
    shipmentItemId?: string;
    countryId?: string;
    reputationChange?: number;
    interest?: CurrencyAmount;
    repayment?: CurrencyAmount;
    total?: CurrencyAmount;
  }

  export enum ContractParty {
    Customer = 'CUSTOMER',
    Provider = 'PROVIDER',
  }

  export enum ContractConditionStatus {
    Fulfilled = 'FULFILLED',
    Pending = 'PENDING',
  }

  export enum ContractConditionType {
    BaseConstruction = 'BASE_CONSTRUCTION',
    ComexPurchasePickup = 'COMEX_PURCHASE_PICKUP',
    Delivery = 'DELIVERY',
    DeliveryShipment = 'DELIVERY_SHIPMENT',
    Exploration = 'EXPLORATION',
    FinishFlight = 'FINISH_FLIGHT',
    LoanInstallment = 'LOAN_INSTALLMENT',
    LoanPayout = 'LOAN_PAYOUT',
    Payment = 'PAYMENT',
    PickupShipment = 'PICKUP_SHIPMENT',
    PlaceOrder = 'PLACE_ORDER',
    ProductionOrderCompleted = 'PRODUCTION_ORDER_COMPLETED',
    ProductionRun = 'PRODUCTION_RUN',
    Provision = 'PROVISION',
    ProvisionShipment = 'PROVISION_SHIPMENT',
    Reputation = 'REPUTATION',
    StartFlight = 'START_FLIGHT',
  }

  export interface ContractPartner {
    id?: string;
    name: string;
    code?: null | string;
    _type: ContractPartnerType;
    _proxy_key: string;
    agentId?: string;
    countryId?: CountryID;
    countryCode?: string;
    type?: ContractPartnerTypeEnum;
  }

  export enum ContractPartnerType {
    Company = 'company',
    CountryAgent = 'country-agent',
  }

  export enum ContractPartnerTypeEnum {
    Exploration = 'EXPLORATION',
    Governance = 'GOVERNANCE',
    Logistics = 'LOGISTICS',
  }

  export enum ContractStatus {
    Cancelled = 'CANCELLED',
    Fulfilled = 'FULFILLED',
    PartiallyFulfilled = 'PARTIALLY_FULFILLED',
    Rejected = 'REJECTED',
    Terminated = 'TERMINATED',
  }

  export interface PrunPacket<T, K> {
    messageType: T;
    payload: K;
  }

  export type Packet =
    | ACTION_COMPLETED.Packet
    | USER_DATA.Packet
    | ACCOUNTING_CASH_BALANCES.Packet
    | COMEX_BROKER_DATA.Packet
    | COMEX_TRADER_ORDERS.Packet
    | COMPANY_DATA.Packet
    | CONTRACTS_CONTRACTS.Packet
    | CONTRACTS_CONTRACT.Packet
    | FOREX_TRADER_ORDERS.Packet
    | PRODUCTION_SITE_PRODUCTION_LINES.Packet
    | SHIP_SHIPS.Packet
    | SITE_SITES.Packet
    | STORAGE_CHANGE.Packet
    | STORAGE_STORAGES.Packet
    | SYSTEM_STARS_DATA.Packet
    | WAREHOUSE_STORAGES.Packet
    | WORKFORCE_WORKFORCES.Packet
    | WORLD_MATERIAL_CATEGORIES.Packet;

  declare module ACTION_COMPLETED {
    export type Packet = PrunPacket<'ACTION_COMPLETED', Payload>;

    export interface Payload {
      actionId: string;
      status: number;
      message: PrunApi.Packet | null;
    }
  }

  declare module USER_DATA {
    export type Packet = PrunPacket<'USER_DATA', Payload>;

    export interface Payload {
      id: string;
      username: string;
      subscriptionLevel: string;
      subscriptionExpiry: DateTime;
      highestTier: null;
      team: boolean;
      moderator: boolean;
      pioneer: boolean;
      perks: unknown[];
      created: DateTime;
      companyId: string;
      systemNamingRights: number;
      planetNamingRights: number;
      isPayingUser: boolean;
      isModeratorChat: boolean;
      mutedUsers: unknown[];
      blacklistedUsers: unknown[];
      isMuted: boolean;
      discardedNotifications: unknown[];
      contexts: Context[];
      preferredLocale: string;
    }

    export interface Context {
      id: string;
      type: string;
      creation: DateTime;
      actionRoles: string[];
    }
  }

  declare module ACCOUNTING_CASH_BALANCES {
    export type Packet = PrunPacket<'ACCOUNTING_CASH_BALANCES', Payload>;

    export interface Payload {
      ownCurrency: Currency;
      currencyAccounts: CurrencyAccount[];
    }

    export interface CurrencyAccount {
      category: string;
      type: number;
      number: number;
      bookBalance: CurrencyAmount;
      currencyBalance: CurrencyAmount;
    }
  }

  declare module COMEX_BROKER_DATA {
    export type Packet = PrunPacket<'COMEX_BROKER_DATA', Payload>;

    export interface Payload {
      id: string;
      ticker: string;
      exchange: Entity;
      address: Address;
      currency: Currency;
      material: Material;
      price: CurrencyAmount;
      priceTime: DateTime;
      high: CurrencyAmount;
      allTimeHigh: CurrencyAmount;
      low: CurrencyAmount;
      allTimeLow: CurrencyAmount;
      ask: PriceAmount | null;
      bid: PriceAmount | null;
      supply: number;
      demand: number;
      traded: number;
      volume: CurrencyAmount;
      priceAverage: CurrencyAmount;
      narrowPriceBand: PriceBand;
      widePriceBand: PriceBand;
      sellingOrders: Order[];
      buyingOrders: Order[];
    }

    export interface Entity {
      id: string;
      name: string;
      code: string;
    }

    export interface PriceAmount {
      price: CurrencyAmount;
      amount: number;
    }

    export interface Order {
      id: string;
      trader: Entity;
      amount: number;
      limit: CurrencyAmount;
    }

    export interface PriceBand {
      low: number;
      high: number;
    }
  }

  declare module COMEX_TRADER_ORDERS {
    export type Packet = PrunPacket<'COMEX_TRADER_ORDERS', Payload>;

    export interface Payload {
      orders: Order[];
    }

    export interface Order {
      id: string;
      exchange: Exchange;
      brokerId: string;
      type: OrderType;
      material: Material;
      amount: number;
      initialAmount: number;
      limit: CurrencyAmount;
      status: Status;
      created: DateTime;
      trades: Trade[];
    }

    export interface Exchange {
      id: string;
      name: string;
      code: string;
    }

    declare type Status = 'PLACED' | 'PARTIALLY_FILLED' | 'FILLED';

    export interface Trade {
      id: string;
      amount: number;
      price: CurrencyAmount;
      time: DateTime;
      partner: Exchange;
    }

    declare type OrderType = 'BUYING' | 'SELLING';
  }

  declare module COMPANY_DATA {
    export type Packet = PrunPacket<'COMPANY_DATA', Payload>;

    export interface Payload {
      id: string;
      name: string;
      code: string;
      countryId: string;
      startingProfile: string;
      startingLocation: Address;
      ratingReport: RatingReport;
      headquarters: Headquarters;
      representation: Representation;
    }

    export interface Headquarters {
      address: Address;
      level: number;
      basePermits: number;
      usedBasePermits: number;
      inventory: Inventory;
      additionalBasePermits: number;
      additionalProductionQueueSlots: number;
      nextRelocationTime: null;
      relocationLocked: boolean;
      efficiencyGains: EfficiencyGain[];
      efficiencyGainsNextLevel: EfficiencyGain[];
    }

    export interface EfficiencyGain {
      category: string;
      gain: number;
    }

    export interface Inventory {
      items: Item[];
    }

    export interface Item {
      material: Material;
      amount: number;
      limit: number;
    }

    export interface RatingReport {
      overallRating: string;
      contractCount: number;
      earliestContract: EarliestContract;
    }

    export interface EarliestContract {
      timestamp: number | null;
    }

    export interface Representation {
      currentLevel: number;
      costNextLevel: RepresentationLevel;
      contributedNextLevel: RepresentationLevel;
      leftNextLevel: RepresentationLevel;
      contributedTotal: RepresentationLevel;
      contributors: unknown[];
    }

    export interface RepresentationLevel {
      amount: number;
      currency: string;
    }
  }

  declare module CONTRACTS_CONTRACTS {
    export type Packet = PrunPacket<'CONTRACTS_CONTRACTS', Payload>;

    export interface Payload {
      contracts: Contract[];
    }
  }

  declare module CONTRACTS_CONTRACT {
    export type Packet = PrunPacket<'CONTRACTS_CONTRACT', Contract>;
  }

  declare module FOREX_TRADER_ORDERS {
    export type Packet = PrunPacket<'FOREX_TRADER_ORDERS', Payload>;

    export interface Payload {
      orders: Order[];
    }

    export interface Order {
      id: string;
      type: OrderType;
      initialAmount: CurrencyAmount;
      amount: CurrencyAmount;
      limit: Limit;
      created: DateTime;
      status: Status;
      trades: Trade[];
    }

    export interface Limit {
      base: Currency;
      quote: Currency;
      rate: number;
      decimals: number;
    }

    export enum Status {
      Placed = 'PLACED',
      PartiallyFilled = 'PARTIALLY_FILLED',
      Filled = 'FILLED',
    }

    export interface Trade {
      id: string;
      amount: CurrencyAmount;
      price: Limit;
      time: DateTime;
      partner: Partner;
    }

    export interface Partner {
      id: string;
      name: string;
      code: string;
    }

    export enum OrderType {
      Buying = 'BUYING',
      Selling = 'SELLING',
    }
  }

  declare module PRODUCTION_SITE_PRODUCTION_LINES {
    export type Packet = PrunPacket<'PRODUCTION_SITE_PRODUCTION_LINES', Payload>;

    export interface Payload {
      siteId: string;
      productionLines: ProductionLine[];
    }

    export interface ProductionLine {
      id: string;
      siteId: string;
      address: Address;
      type: string;
      capacity: number;
      slots: number;
      efficiency: number;
      condition: number;
      workforces: Workforce[];
      orders: Order[];
      productionTemplates: ProductionTemplate[];
      efficiencyFactors: EfficiencyFactor[];
    }

    export interface EfficiencyFactor {
      expertiseCategory?: string;
      type: string;
      effectivity: number;
      value: number;
    }

    export interface Order {
      id: string;
      productionLineId: string;
      inputs: MaterialAmountWithValue[];
      outputs: MaterialAmountWithValue[];
      created: DateTime;
      started: DateTime | null;
      completion: DateTime | null;
      duration: TimeSpan;
      lastUpdated: DateTime | null;
      completed: number;
      halted: boolean;
      productionFee: CurrencyAmount;
      productionFeeCollector: ProductionFeeCollector;
      recurring: boolean;
    }

    export interface ProductionFeeCollector {
      currency: Currency;
    }

    export interface ProductionTemplate {
      id: string;
      name: string;
      inputFactors: ProductionFactor[];
      outputFactors: ProductionFactor[];
      effortFactor: number;
      efficiency: number;
      duration: TimeSpan;
      productionFeeFactor: CurrencyAmount;
      productionFeeCollector: ProductionFeeCollector;
    }

    export interface ProductionFactor {
      material: Material;
      factor: number;
    }

    export interface Workforce {
      level: string;
      efficiency: number;
    }
  }

  declare module SHIP_SHIPS {
    export type Packet = PrunPacket<'SHIP_SHIPS', Payload>;

    export interface Payload {
      ships: Ship[];
    }

    export interface Ship {
      id: string;
      idShipStore: string;
      idStlFuelStore: string;
      idFtlFuelStore: string;
      registration: string;
      name: string;
      commissioningTime: DateTime;
      blueprintNaturalId: string;
      address: Address | null;
      flightId: string;
      acceleration: number;
      thrust: number;
      mass: number;
      operatingEmptyMass: number;
      volume: number;
      reactorPower: number;
      emitterPower: number;
      stlFuelStoreId: string;
      stlFuelFlowRate: number;
      ftlFuelStoreId: string;
      operatingTimeStl: TimeSpan;
      operatingTimeFtl: TimeSpan;
      condition: number;
      lastRepair: number | null;
      repairMaterials: MaterialAmount[];
      status: string;
    }
  }

  declare module SITE_SITES {
    export type Packet = PrunPacket<'SITE_SITES', Payload>;

    export interface Payload {
      sites: Site[];
    }

    export interface Site {
      siteId: string;
      address: Address;
      founded: DateTime;
      platforms: Platform[];
      buildOptions: BuildOptions;
      area: number;
      investedPermits: number;
      maximumPermits: number;
    }

    export interface BuildOptions {
      options: Option[];
    }

    export interface Option {
      id: string;
      name: string;
      area: number;
      ticker: string;
      expertiseCategory: ExpertiseCategory | null;
      needsFertileSoil: boolean;
      type: OptionType;
      workforceCapacities: WorkforceCapacity[];
      materials: Materials;
    }

    export enum ExpertiseCategory {
      Agriculture = 'AGRICULTURE',
      Chemistry = 'CHEMISTRY',
      Construction = 'CONSTRUCTION',
      Electronics = 'ELECTRONICS',
      FoodIndustries = 'FOOD_INDUSTRIES',
      FuelRefining = 'FUEL_REFINING',
      Manufacturing = 'MANUFACTURING',
      Metallurgy = 'METALLURGY',
      ResourceExtraction = 'RESOURCE_EXTRACTION',
    }

    export interface Materials {
      quantities: MaterialAmount[];
    }

    export enum OptionType {
      Core = 'CORE',
      Habitation = 'HABITATION',
      Production = 'PRODUCTION',
      Resources = 'RESOURCES',
      Storage = 'STORAGE',
    }

    export interface WorkforceCapacity {
      level: Level;
      capacity: number;
    }

    export enum Level {
      Engineer = 'ENGINEER',
      Pioneer = 'PIONEER',
      Scientist = 'SCIENTIST',
      Settler = 'SETTLER',
      Technician = 'TECHNICIAN',
    }

    export interface Platform {
      siteId: string;
      id: string;
      module: Module;
      area: number;
      creationTime: DateTime;
      reclaimableMaterials: MaterialAmount[];
      repairMaterials: MaterialAmount[];
      repairMaterials24: MaterialAmount[];
      repairMaterials48: MaterialAmount[];
      bookValue: CurrencyAmount;
      condition: number;
      lastRepair: DateTime | null;
    }

    export interface Module {
      id: string;
      platformId: string;
      reactorId: string;
      reactorName: string;
      reactorTicker: string;
      type: OptionType;
    }
  }

  declare module STORAGE_CHANGE {
    export type Packet = PrunPacket<'STORAGE_CHANGE', Payload>;

    export interface Payload {
      stores: Store[];
    }
  }

  declare module STORAGE_STORAGES {
    export type Packet = PrunPacket<'STORAGE_STORAGES', Payload>;

    export interface Payload {
      stores: Store[];
    }
  }

  declare module SYSTEM_STARS_DATA {
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

  declare module WAREHOUSE_STORAGES {
    export type Packet = PrunPacket<'WAREHOUSE_STORAGES', Payload>;

    export interface Payload {
      storages: Storage[];
    }

    export interface Storage {
      warehouseId: string;
      storeId: string;
      units: number;
      weightCapacity: number;
      volumeCapacity: number;
      nextPayment: DateTime;
      fee: CurrencyAmount;
      feeCollector: FeeCollector;
      status: string;
      address: Address;
    }

    export interface FeeCollector {
      currency?: Currency;
      id?: string;
      code?: string;
      name?: string;
    }
  }

  declare module WORKFORCE_WORKFORCES {
    export type Packet = PrunPacket<'WORKFORCE_WORKFORCES', Payload>;

    export interface Payload {
      address: Address;
      siteId: string;
      workforces: Workforce[];
    }

    export interface Workforce {
      level: string;
      population: number;
      reserve: number;
      capacity: number;
      required: number;
      satisfaction: number;
      needs: Need[];
    }

    export interface Need {
      category: NeedCategory;
      essential: boolean;
      material: Material;
      satisfaction: number;
      unitsPerInterval: number;
      unitsPer100: number;
    }

    export enum NeedCategory {
      Clothing = 'CLOTHING',
      Food = 'FOOD',
      Health = 'HEALTH',
      Tools = 'TOOLS',
      Water = 'WATER',
    }
  }

  declare module WORLD_MATERIAL_CATEGORIES {
    export type Packet = PrunPacket<'WORLD_MATERIAL_CATEGORIES', Payload>;

    export interface Payload {
      categories: MaterialCategory[];
    }

    export interface MaterialCategory {
      name: string;
      id: string;
      materials: Material[];
    }
  }
}
