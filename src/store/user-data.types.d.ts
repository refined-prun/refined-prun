declare namespace UserData {
  type TimeFormat = 'DEFAULT' | '24H' | '12H';

  type CurrencyPreset = 'DEFAULT' | 'AIC' | 'CIS' | 'ICA' | 'NCC' | 'CUSTOM';
  type CurrencyPosition = 'BEFORE' | 'AFTER';
  type CurrencySpacing = 'HAS_SPACE' | 'NO_SPACE';

  type PricingMethod = 'ASK' | 'BID' | 'AVG' | 'VWAP7D' | 'VWAP30D' | 'DEFAULT' | string;

  type Exchange = 'AI1' | 'CI1' | 'CI2' | 'IC1' | 'NC1' | 'NC2';

  interface PriceOverride {
    buy?: number;
    sell?: number;
  }

  interface StoreSortingData {
    modes: SortingMode[];
    active?: string;
    cat?: boolean;
    reverse?: boolean;
  }

  interface SortingMode {
    label: string;
    categories: SortingModeCategory[];
    burn: boolean;
    zero: boolean;
  }

  interface SortingModeCategory {
    name: string;
    materials: string[];
  }

  type TileState = Record<string, unknown>;

  interface Note {
    id: string;
    name: string;
    text: string;
  }

  interface SystemMessages {
    chat: string;
    hideJoined: boolean;
    hideDeleted: boolean;
  }

  interface ActionPackageData {
    groups: MaterialGroupData[];
    actions: ActionData[];
    global: {
      name: string;
    };
  }

  type MaterialGroupType = 'Manual' | 'Resupply' | 'Repair' | 'Paste';

  interface MaterialGroupData {
    type: MaterialGroupType;
    name?: string;
    days?: number | string;
    advanceDays?: number | string;
    planet?: string;
    useBaseInv?: boolean;
    materials?: Record<string, number>;
    exclusions?: string[];
    consumablesOnly?: boolean;
    materialFilter?: 'All' | 'Workforce' | 'Production';
  }

  type ActionType = 'CX Buy' | 'MTRA' | 'Refuel' | 'CONT Ship' | 'CONT Trade' | 'GovBurn Data';

  interface ActionData {
    type: ActionType;

    name?: string;
    group?: string;
    skippable?: boolean;

    allowUnfilled?: boolean;
    buyPartial?: boolean;
    exchange?: string;
    useCXInv?: boolean;
    priceLimits?: Record<string, number>;

    buyMissingFuel?: boolean;

    // GovBurn Data: planet natural ID or name.
    planet?: string;

    origin?: string;
    dest?: string;

    // MTRA specific.
    postToAgent?: boolean;
    noSfc?: boolean;
    sfcDestination?: string;
    printOffloadJson?: boolean;
    offloadGroups?: string[];
    agentGroups?: string[];
    finishOnly?: boolean;
    // Group names whose offload packages need a braPlanet repair reminder.
    repairGroups?: string[];
    // Open BRA for this planet after transfers.
    braPlanet?: string;

    // CONT Ship specific.
    currency?: string;
    contractNote?: string;
    paymentPerTon?: number;
    daysToFulfill?: number;
    contOrigin?: string;
    contDest?: string;
    autoProvision?: boolean;

    // CONT Trade specific.
    contTradeType?: 'BUYING' | 'SELLING';
    contLocation?: string;
  }

  interface StockPresetData {
    name: string;
    planets: StockPlanetData[];
  }

  interface StockPlanetData {
    // Planet natural id or name, resolved via sitesStore.find.
    planet: string;
    items: StockItemData[];
  }

  interface StockItemData {
    ticker: string;
    max: number;
    // Include this planet's warehouse in the "current" amount.
    warehouse?: boolean;
  }

  interface TaskList {
    id: string;
    name: string;
    tasks: Task[];
  }

  interface Task {
    id: string;
    type: TaskType;
    completed?: boolean;
    text?: string;
    dueDate?: number;
    recurring?: number;
    planet?: string;
    days?: number;
    buildingAge?: number;
    subtasks?: Task[];
  }

  type TaskType = 'Text' | 'Resupply' | 'Repair';

  interface CommandList {
    id: string;
    name: string;
    commands: Command[];
  }

  interface Command {
    id: string;
    label: string;
    command: string;
  }

  type ExchangeChartType = 'SMOOTH' | 'ALIGNED' | 'RAW';

  interface TabFolder {
    id: string;
    name: string;
    screenIds: string[];
  }

  interface GovBurnPlanet {
    naturalId: string;
    name: string;
    capturedAt: number;
    buildings: GovBurnBuilding[];
    cogc?: GovBurnCogc;
  }

  interface GovBurnBuilding {
    ticker: string;
    type: string;
    projectId: string;
    level: number;
    upkeeps?: GovBurnUpkeep[];
    upkeepsCapturedAt?: number;
    // Upkeep ticker -> last contribution timestamps (ms epoch).
    contribHistory?: Record<string, GovBurnContrib>;
  }

  interface GovBurnContrib {
    // Last contribution by the player's own company.
    own?: number;
    // Last contribution by anyone (including own).
    any?: number;
  }

  interface GovBurnUpkeep {
    ticker: string;
    stored: number;
    amount: number;
    duration: number;
    nextTick: number;
  }

  interface GovBurnCogc {
    dueDate: number;
    // Current-cycle bill with contributed amounts; paid when every currentAmount >= amount.
    materials: GovBurnCogcMaterial[];
  }

  interface GovBurnCogcMaterial {
    ticker: string;
    amount: number;
    currentAmount: number;
  }

  // Building ticker -> required count of supplied upkeep materials.
  // -1 (or missing): unconfigured - treat as 0 days (red).
  // 0: deliberately unsupplied - infinity days (green).
  // 1..upkeepCount: number of upkeep materials the player keeps supplied.
  type GovBurnPlanetConfig = Record<string, number>;

  // Building ticker -> chosen upkeep material tickers, in slot order.
  // Persists GOVBURNACT's slot picks; may be shorter than the configured
  // count when some slots are still unresolved.
  type GovBurnPlanetSlots = Record<string, string[]>;
}
