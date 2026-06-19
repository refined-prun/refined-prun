export {};

type LL = LiteralLocalizationLeaf;
type PL<T> = ParametrizedLocalizationLeaf<T>;

declare global {
  interface PrunLocalization extends LocalizationTree {
    AccountCategory: {
      CURRENT_ASSETS: LL;
      EQUITY: LL;
      EXPENSES: LL;
      FIXED_ASSETS: LL;
      LIABILITIES: LL;
      LIQUID_ASSETS: LL;
      REVENUE: LL;
    };
    AccountType: {
      CASH: PL<{ currencyCode: string }>;
      CASH_ESCROW: PL<{ currencyCode: string }>;
      COMPANY_HEADQUARTER_CONTRIBUTIONS: LL;
      CONTRACT_WRITE_OFF: LL;
      CONTRIBUTION_REVENUE: LL;
      CORPORATION_PROJECT_CONTRIBUTIONS: LL;
      DEBT: LL;
      DIVIDEND_INCOME: LL;
      EXPENSE: LL;
      EXTRAORDINARY_INCOME: LL;
      FINANCIAL_WRITE_OFF: LL;
      FIXED_CAPITAL: LL;
      FOREX_EXPENSE: LL;
      FOREX_FLUCTUATION_EXPENSE: LL;
      FOREX_FLUCTUATION_REVENUE: LL;
      FOREX_REVENUE: LL;
      FUEL_CONSUMPTION: LL;
      GATEWAY_FEES: LL;
      GATEWAY_FEE_REVENUES: LL;
      GOVERNMENT_PROGRAM_FEE: LL;
      HOLDINGS: LL;
      HOLDINGS_WRITE_OFF: LL;
      INTEREST_EXPENSE: LL;
      INTEREST_INCOME: LL;
      INVENTORY: LL;
      LOANS: LL;
      LOCAL_MARKET_FEE_REVENUE: LL;
      LOSS_CARRIED_FORWARD: LL;
      MATERIAL_CONSUMPTION: LL;
      MATERIAL_DELIVERY: LL;
      MATERIAL_ESCROW: LL;
      MATERIAL_SALE_REVENUE: LL;
      PAYABLES: LL;
      PLANETARY_PROJECT_CONTRIBUTIONS: LL;
      PLATFORMS: LL;
      PRODUCTION_FEES: LL;
      PRODUCTION_FEE_REVENUE: LL;
      PROFIT_CARRIED_FORWARD: LL;
      RECEIPT_OF_GOODS: LL;
      RECEIVABLES: LL;
      RECEIVABLE_MATERIALS: LL;
      REPRESENTATION_CENTER_CONTRIBUTIONS: LL;
      REVENUE: LL;
      SHIPS: LL;
      SHIP_MAINTENANCE: LL;
      SITES: LL;
      SITE_DEPRECIATION: LL;
      SITE_ESTABLISHMENT_TAXES: LL;
      SITE_ESTABLISHMENT_TAXES_REVENUE: LL;
      SUBSCRIBED_CAPITAL: LL;
      TRANSACTION_FEES: LL;
      TRANSPORT_EXPENSES: LL;
      TRANSPORT_REVENUE: LL;
      WAREHOUSE_FEE_REVENUE: LL;
      WAREHOUSE_STORAGE_FEE: LL;
      WORKER_SUPPLIES: LL;
    };
    ActionComponent: {
      action: {
        confirm: LL;
      };
    };
    ActionFeedback: {
      cancel: LL;
      confirmation: LL;
      dismiss: LL;
      inprogress: LL;
      success: LL;
    };
    ActionStatus: {
      ADMIN_CENTER_NO_RULE_CHANGES_LEFT: LL;
      ADMIN_CENTER_NO_VOTING_RIGHTS: LL;
      ADMIN_CENTER_VOTE_END_AFTER_TERM_END: LL;
      AUTHENTICATION_FAILED: LL;
      AUTHORIZATION_FAILED: LL;
      AUTH_LOGIN_ACCOUNT_NOT_FOUND: LL;
      AUTH_LOGIN_FAILED: LL;
      AUTH_LOGIN_PASSWORD_INVALID: LL;
      AUTH_LOGIN_PERMISSION_DENIED: LL;
      BLOCKLIST_BLOCKED: LL;
      CHAT_ALREADY_JOINED: LL;
      CHAT_NOT_ALLOWED_ADD_MESSAGE: LL;
      CHAT_NOT_ALLOWED_ADD_USER: LL;
      CHAT_NOT_ALLOWED_READ_INFORMATION: LL;
      CHAT_NOT_ALLOWED_READ_MESSAGES: LL;
      CHAT_NOT_ALLOWED_READ_USERS: LL;
      CHAT_NOT_JOINED: LL;
      CHAT_NO_SUCH_CHANNEL: LL;
      COMEX_BROKER_LIMIT_OUTSIDE_PRICE_BAND: LL;
      COMEX_BROKER_ORDER_EXISTS: LL;
      COMEX_BROKER_ORDER_SPREAD_NEGATIVE: LL;
      COMEX_BROKER_TOO_MANY_ORDERS: LL;
      COMEX_TICKER_INVALID: LL;
      COMEX_TRADER_ORDER_ID_INVALID: LL;
      COMEX_TRADER_ORDER_STORE_REQUIRED: LL;
      CONTRACT_ACTIVE_CONTRACT_LIMIT_REACHED: LL;
      CONTRACT_CONDITION_ID_INVALID: LL;
      CONTRACT_CONDITION_UNFULFILLABLE: LL;
      CONTRACT_ID_INVALID: LL;
      CONTRACT_STATUS_INVALID: LL;
      CONTRIBUTIONS_NO_SITE_ON_PLANET: LL;
      CORPORATION_COMPANY_ALREADY_INVITED: LL;
      CORPORATION_COMPANY_ALREADY_SHAREHOLDER: LL;
      CORPORATION_MANAGER_NO_HQ: LL;
      CORPORATION_MANAGER_PROJECT_LIMIT_EXCEEDED: LL;
      CORPORATION_SHAREHOLDER_CORPORATION_EXISTS: LL;
      CORPORATION_SHAREHOLDER_HOLDING_EXISTS: LL;
      CORPORATION_SHAREHOLDER_NO_CORPORATION: LL;
      COUNTRY_ID_INVALID: LL;
      ENTITY_CODE_EXISTS: LL;
      ENTITY_ID_VALIDATION_FAILED: LL;
      ENTITY_NAME_EXISTS: LL;
      FOREX_BROKER_TOO_MANY_ORDERS: LL;
      FOREX_TRADER_ORDER_ID_INVALID: LL;
      FOREX_TRADER_ORDER_LIMIT_ILLEGAL: LL;
      FOREX_TRADER_ORDER_SPREAD_ILLEGAL: LL;
      ILLEGAL_ARGUMENTS: LL;
      INVENTORY_INSUFFICIENT: LL;
      LOCAL_MARKET_ACCEPTION_RATE_LIMIT: LL;
      LOCAL_MARKET_AD_EXPIRED: LL;
      LOCAL_MARKET_BLACKLIST_ACCEPTION: LL;
      LOCAL_MARKET_MISSING_SITE: LL;
      LOCAL_MARKET_ORIGIN_DESTINATION_EQUAL: LL;
      LOCAL_MARKET_ORIGIN_DESTINATION_INVALID: LL;
      LOCAL_MARKET_OWN_AD_ACCEPTION: LL;
      MONEY_AMOUNT_INVALID: LL;
      MONEY_CURRENCY_MISMATCH: LL;
      MONEY_INSUFFICIENT: LL;
      NAMING_NAME_TAKEN: LL;
      NOT_FOUND: LL;
      PLANET_NO_FREE_PLOT: LL;
      PLANET_SITE_TYPE_NOT_ALLOWED: LL;
      PRODUCTION_ORDER_ID_INVALID: LL;
      PRODUCTION_ORDER_STARTED: LL;
      PRODUCTION_RECIPE_INVALID: LL;
      PRODUCTION_SLOT_LIMIT_REACHED: LL;
      RATING_INSUFFICIENT: LL;
      ROUTING_FAILED: LL;
      SHIPYARD_PROJECT_IN_PROGRESS: LL;
      SHIPYARD_PROJECT_MATERIALS_PAID: LL;
      SHIPYARD_SAME_BLUEPRINTS: LL;
      SHIPYARD_SHIP_ALREADY_UPGRADING: LL;
      SHIPYARD_SHIP_NOT_EMPTY: LL;
      SHIPYARD_WRONG_SHIP_BLUEPRINT: LL;
      SHIP_ILLEGAL_REPAIR_LOCATION: LL;
      SHIP_INVALID_ROUTE_ES_324: LL;
      SHIP_IN_TRANSIT: LL;
      SHIP_NOT_OPERATIONAL: LL;
      SHIP_NO_SUCH_FLIGHT: LL;
      SHIP_NO_SUCH_SHIP: LL;
      SHIP_TOO_MANY_FLIGHTS: LL;
      SITE_DEMOLISH_EXPANDED_AREA_IMPOSSIBLE: LL;
      SITE_DEMOLISH_FILLED_STORAGE_IMPOSSIBLE: LL;
      SITE_DEMOLISH_HQ_IMPOSSIBLE: LL;
      SITE_DEMOLISH_WITH_BUILDINGS_IMPOSSIBLE: LL;
      SITE_EXISTS: LL;
      SITE_MODULE_ID_INVALID: LL;
      SITE_NO_FREE_PLOTS: LL;
      SITE_PLATFORM_BUILD_OPTION_ILLEGAL: LL;
      SITE_PLATFORM_ID_INVALID: LL;
      SITE_PLATFORM_NOT_EMPTY: LL;
      SITE_REACTOR_IN_USE: LL;
      SITE_TOO_CLOSE: LL;
      STORAGE_NO_FIXED_STORE_FOUND: LL;
      STORAGE_STORE_NOT_FOUND: LL;
      STORAGE_TRANSFER_IMPOSSIBLE: LL;
      STORAGE_TRANSFER_RECEIVE_FAILED: LL;
      STORE_CAPACITY_INSUFFICIENT: LL;
      STORE_QUANTITY_INSUFFICIENT: LL;
      USER_CREATE_COMPANY_1_LETTER_CODE_PERK_REQUIRED: LL;
      USER_CREATE_COMPANY_2_LETTER_CODE_PERK_REQUIRED: LL;
      USER_CREATE_COMPANY_EXISTS: LL;
      USER_LICENSE_GIVER_INELIGIBLE: LL;
      USER_LICENSE_INSUFFICIENT_BALANCE: LL;
      USER_LICENSE_INVALID_TARGET: LL;
      USER_LICENSE_UNSUPPORTED: LL;
      WAREHOUSE_MAXIMUM_UNITS_REACHED: LL;
      WAREHOUSE_NOT_EMPTY: LL;
      WAREHOUSE_NOT_PAID: LL;
    };
    ActionsPanel: {
      table: {
        id: LL;
        type: LL;
      };
    };
    AdStatus: {
      ACCEPTED: LL;
      BREACHED: LL;
      EXPIRED: LL;
      FULFILLED: LL;
      OPEN: LL;
    };
    AddUser: {
      form: {
        add: LL;
        cancel: LL;
        header: LL;
        username: LL;
      };
    };
    AddressConditionEditForm: {
      form: {
        address: LL;
      };
    };
    AddressLabel: {
      withOrbit: PL<{ address: string }>;
      withoutOrbit: PL<{ address: string }>;
    };
    AddressSelector: {
      input: {
        placeholder: LL;
      };
      suggestions: {
        title: {
          searchResults: LL;
          searchResults20: LL;
        };
      };
    };
    AdminCenter: {
      address: LL;
      context: {
        admincenter: LL;
        government: LL;
        localrules: LL;
        planet: LL;
      };
      currency: LL;
      current: {
        end: LL;
        governor: LL;
        membersOfParliament: LL;
        parliamentSize: LL & {
          info: LL;
        };
        start: LL;
        term: LL;
      };
      currentTerm: {
        noterm: LL;
      };
      error: {
        id: PL<{ input: string }>;
        noadm: LL;
        notFound: LL;
      };
      previous: {
        ended: LL;
        governor: {
          name: LL;
        };
        membersOfParliament: LL;
        naturalId: LL;
      };
      section: {
        currentTerm: LL;
        previousTerms: LL;
        upcomingTerm: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
      };
      upcoming: {
        action: {
          run: LL;
          vote: LL;
          withdraw: LL;
          withdrawVote: LL;
        };
        candidate: {
          command: LL;
          corporation: LL;
          country: LL;
          name: LL;
        };
        electionEnd: LL;
        electionStart: LL;
        parliamentSize: LL;
      };
    };
    AdminCenterTermVotes: {
      candidate: {
        corporation: LL;
        country: LL;
        name: LL;
        votes: LL;
      };
    };
    AgentPreamble: {
      intro: PL<{ br: string }>;
      introductory: {
        baseConstruction: PL<{ country: string; br: string }>;
        baseConstructionII: PL<{ country: string; br: string }>;
        buildingConstruction: PL<{ br: string }>;
        buyConsumables: PL<{ country: string; br: string }>;
        channel: LL;
        findExpansionSpot: PL<{ br: string; map: string; comPlanet: string; comHelp: string }> & {
          map: LL;
        };
        finishFlight: PL<{ br: string }>;
        fulfillCountryContracts: LL;
        increaseSatisfaction: PL<{ br: string; workforce: string }> & {
          workforce: LL;
        };
        makeMoney: PL<{ br: string }>;
        placeOrder: PL<{ br: string }>;
        productionOrderCompleted: PL<{ br: string }>;
        productionRun: PL<{ br: string }>;
        startFlight: PL<{ br: string }>;
      };
      mission: PL<{ br: string }> & {
        contribution: PL<{ country: string; address: string; deadline: string }> & {
          deadline: LL;
        };
        expansion: PL<{ country: string }>;
        exploration: PL<{ country: string }>;
        fleet: PL<{ country: string }>;
        food: PL<{ country: string; planet: string }>;
        maintenance: LL;
        materials: PL<{ country: string; planet: string }>;
        power: PL<{ country: string }>;
        shipping: PL<{ country: string; deadline: string }> & {
          deadline: LL;
        };
        upgrade: PL<{ country: string }>;
      };
      thisContract: LL;
    };
    Alert: {
      ADMIN_CENTER_ELECTION_REMINDER: PL<{ planetName: string }>;
      ADMIN_CENTER_ELECTION_STARTED: PL<{ planetName: string }>;
      ADMIN_CENTER_GOVERNOR_ELECTED: PL<{ planetName: string }>;
      ADMIN_CENTER_MOTION_ENDED: PL<{ motionId: string; motionName: string; motionStatus: string }>;
      ADMIN_CENTER_MOTION_PASSED: PL<{ motionName: string; address: string }>;
      ADMIN_CENTER_MOTION_VOTING_STARTED: PL<{ motionId: string; motionName: string }>;
      ADMIN_CENTER_NO_GOVERNOR_ELECTED: PL<{ planetName: string }>;
      ADMIN_CENTER_RUN_SUCCEEDED: PL<{ planetName: string }>;
      COGC_PROGRAM_CHANGED: PL<{ planetName: string; programName: string }>;
      COGC_STATUS_CHANGED: PL<{ planetName: string }>;
      COGC_UPKEEP_STARTED: PL<{ planetName: string }>;
      COMEX_ORDER_FILLED: PL<{ commodity: string; exchangeName: string }>;
      COMEX_PICKUP_CONTRACT_CREATED: PL<{ commodity: string; exchangeName: string }>;
      COMEX_TRADE: PL<{ trades: string; commodity: string; exchangeName: string }>;
      CONTRACT_CONDITION_FULFILLED: PL<{
        partner: string;
        contract: string;
        conditionType: string;
      }>;
      CONTRACT_CONDITION_PICKUP_CONDITION_PENDING: PL<{ contract: string }>;
      CONTRACT_CONTRACT_BREACHED: PL<{ partner: string }>;
      CONTRACT_CONTRACT_CANCELLED: PL<{ partner: string }>;
      CONTRACT_CONTRACT_CLOSED: PL<{ contract: string; partner: string }>;
      CONTRACT_CONTRACT_EXTENDED: PL<{ partner: string }>;
      CONTRACT_CONTRACT_RECEIVED: PL<{ contract: string; partner: string }>;
      CONTRACT_CONTRACT_REJECTED: PL<{ partner: string; contract: string }>;
      CONTRACT_CONTRACT_TERMINATED: PL<{ contract: string; partner: string }>;
      CONTRACT_CONTRACT_TERMINATION_REQUESTED: PL<{ partner: string; contract: string }>;
      CONTRACT_DEADLINE_EXCEEDED_WITHOUT_CONTROL: PL<{ partner: string }>;
      CONTRACT_DEADLINE_EXCEEDED_WITH_CONTROL: PL<{ partner: string }>;
      CORPORATION_MANAGER_INVITE_ACCEPTED: PL<{ inviteeName: string; corporationName: string }>;
      CORPORATION_MANAGER_INVITE_REJECTED: PL<{ inviteeName: string; corporationName: string }>;
      CORPORATION_MANAGER_SHAREHOLDER_LEFT: PL<{ companyName: string; corporationName: string }>;
      CORPORATION_PROJECT_FINISHED: PL<{ type: string; address: string }>;
      CORPORATION_SHAREHOLDER_DIVIDEND_RECEIVED: PL<{ corporationName: string }>;
      CORPORATION_SHAREHOLDER_INVITE_RECEIVED: PL<{ corporationName: string }>;
      FOREX_ORDER_FILLED: PL<{ pair: string }>;
      FOREX_TRADE: PL<{ trades: string; pair: string }>;
      GATEWAY_JUMP_ABORTED_LINK_CHANGED: PL<{ ship: string; address: string }>;
      GATEWAY_JUMP_ABORTED_LINK_NOT_ESTABLISHED: PL<{ ship: string; address: string }>;
      GATEWAY_JUMP_ABORTED_MISSING_FUNDS: PL<{ ship: string; address: string }>;
      GATEWAY_JUMP_ABORTED_NOT_OPERATIONAL: PL<{ ship: string; address: string }>;
      GATEWAY_JUMP_ABORTED_NO_CAPACITY: PL<{ ship: string; address: string }>;
      GATEWAY_JUMP_ABORTED_NO_FUEL: PL<{ ship: string; address: string }>;
      GATEWAY_LINK_ESTABLISHED: PL<{ gateway: string; otherGateway: string }>;
      GATEWAY_LINK_REQUEST_RECEIVED: PL<{
        destinationGateway: string;
        originGateway: string;
        originAddress: string;
      }>;
      GATEWAY_LINK_UNLINKED: PL<{ gateway: string; otherGateway: string }>;
      INFRASTRUCTURE_OPERATIONAL_STATE_CHANGED: PL<{
        type: string;
        address: string;
        state: string;
      }>;
      INFRASTRUCTURE_PROJECT_COMPLETED: PL<{ type: string; address: string }>;
      INFRASTRUCTURE_UPGRADE_COMPLETED: PL<{ type: string; infrastructure: string }>;
      INFRASTRUCTURE_UPKEEP_PHASE_STARTED: PL<{
        type: string;
        infrastructure: string;
        address: string;
        naturalId: string;
      }>;
      LOCAL_MARKET_AD_ACCEPTED: PL<{ addressName: string; partner: string }>;
      LOCAL_MARKET_AD_EXPIRED: PL<{ addressName: string }>;
      PLANETARY_PROJECT_FINISHED: PL<{ project: string; address: string }>;
      POPULATION_PROJECT_UPGRADED: PL<{ type: string; address: string; level: string }>;
      POPULATION_REPORT_AVAILABLE: PL<{ address: string }>;
      PRODUCTION_ORDER_FINISHED: PL<{ quantity: string; material: string; address: string }>;
      RELEASE_NOTES: LL;
      SHIPYARD_PROJECT_FINISHED: PL<{ address: string }>;
      SHIP_FLIGHT_ENDED: PL<{ registration: string; destination: string }>;
      SITE_EXPERT_DROPPED: PL<{ category: string; address: string }>;
      TUTORIAL_TASK_FINISHED: LL;
      USER_CONVERSION_REMINDER_LICENSE: LL;
      USER_LICENSE_ABOUT_TO_EXPIRE: LL;
      USER_LICENSE_EXPIRED: LL;
      USER_LICENSE_GIFT_RECEIVED: PL<{ amount: string; user: string }>;
      USER_STEAM_REVIEW: LL;
      WAREHOUSE_STORE_LOCKED_INSUFFICIENT_FUNDS: PL<{ address: string }>;
      WAREHOUSE_STORE_UNLOCKED: PL<{ address: string }>;
      WELCOME: LL;
      WORKFORCE_LOW_SUPPLIES: PL<{ address: string }>;
      WORKFORCE_OUT_OF_SUPPLIES: PL<{ address: string }>;
      WORKFORCE_UNSATISFIED: PL<{ address: string }>;
    };
    AlertType: {
      ADMIN_CENTER_ELECTION_REMINDER: LL;
      ADMIN_CENTER_ELECTION_STARTED: LL;
      ADMIN_CENTER_GOVERNOR_ELECTED: LL;
      ADMIN_CENTER_MOTION_ENDED: LL;
      ADMIN_CENTER_MOTION_PASSED: LL;
      ADMIN_CENTER_MOTION_VOTING_STARTED: LL;
      ADMIN_CENTER_NO_GOVERNOR_ELECTED: LL;
      ADMIN_CENTER_RUN_SUCCEEDED: LL;
      COGC_PROGRAM_CHANGED: LL;
      COGC_STATUS_CHANGED: LL;
      COGC_UPKEEP_STARTED: LL;
      COMEX_ORDER_FILLED: LL;
      COMEX_PICKUP_CONTRACT_CREATED: LL;
      COMEX_TRADE: LL;
      CONTRACT_CONDITION_FULFILLED: LL;
      CONTRACT_CONDITION_PICKUP_CONDITION_PENDING: LL;
      CONTRACT_CONTRACT_BREACHED: LL;
      CONTRACT_CONTRACT_CANCELLED: LL;
      CONTRACT_CONTRACT_CLOSED: LL;
      CONTRACT_CONTRACT_EXTENDED: LL;
      CONTRACT_CONTRACT_RECEIVED: LL;
      CONTRACT_CONTRACT_REJECTED: LL;
      CONTRACT_CONTRACT_TERMINATED: LL;
      CONTRACT_CONTRACT_TERMINATION_REQUESTED: LL;
      CONTRACT_DEADLINE_EXCEEDED_WITHOUT_CONTROL: LL;
      CONTRACT_DEADLINE_EXCEEDED_WITH_CONTROL: LL;
      CORPORATION_MANAGER_INVITE_ACCEPTED: LL;
      CORPORATION_MANAGER_INVITE_REJECTED: LL;
      CORPORATION_MANAGER_SHAREHOLDER_LEFT: LL;
      CORPORATION_PROJECT_FINISHED: LL;
      CORPORATION_SHAREHOLDER_DIVIDEND_RECEIVED: LL;
      CORPORATION_SHAREHOLDER_INVITE_RECEIVED: LL;
      FOREX_ORDER_FILLED: LL;
      FOREX_TRADE: LL;
      GATEWAY_JUMP_ABORTED_LINK_CHANGED: LL;
      GATEWAY_JUMP_ABORTED_LINK_NOT_ESTABLISHED: LL;
      GATEWAY_JUMP_ABORTED_MISSING_FUNDS: LL;
      GATEWAY_JUMP_ABORTED_NOT_OPERATIONAL: LL;
      GATEWAY_JUMP_ABORTED_NO_CAPACITY: LL;
      GATEWAY_JUMP_ABORTED_NO_FUEL: LL;
      GATEWAY_LINK_ESTABLISHED: LL;
      GATEWAY_LINK_REQUEST_RECEIVED: LL;
      GATEWAY_LINK_UNLINKED: LL;
      INFRASTRUCTURE_OPERATIONAL_STATE_CHANGED: LL;
      INFRASTRUCTURE_PROJECT_COMPLETED: LL;
      INFRASTRUCTURE_UPGRADE_COMPLETED: LL;
      INFRASTRUCTURE_UPKEEP_PHASE_STARTED: LL;
      LOCAL_MARKET_AD_ACCEPTED: LL;
      LOCAL_MARKET_AD_EXPIRED: LL;
      PLANETARY_PROJECT_FINISHED: LL;
      POPULATION_PROJECT_UPGRADED: LL;
      POPULATION_REPORT_AVAILABLE: LL;
      PRODUCTION_ORDER_FINISHED: LL;
      RELEASE_NOTES: LL;
      SHIPYARD_PROJECT_FINISHED: LL;
      SHIP_FLIGHT_ENDED: LL;
      SITE_EXPERT_DROPPED: LL;
      TUTORIAL_TASK_FINISHED: LL;
      USER_CONVERSION_REMINDER_LICENSE: LL;
      USER_LICENSE_ABOUT_TO_EXPIRE: LL;
      USER_LICENSE_EXPIRED: LL;
      USER_LICENSE_GIFT_RECEIVED: LL;
      USER_STEAM_REVIEW: LL;
      WAREHOUSE_STORE_LOCKED_INSUFFICIENT_FUNDS: LL;
      WAREHOUSE_STORE_UNLOCKED: LL;
      WORKFORCE_LOW_SUPPLIES: LL;
      WORKFORCE_OUT_OF_SUPPLIES: LL;
      WORKFORCE_UNSATISFIED: LL;
    };
    AlertsHeadItem: {
      notifications: PL<{ count: string }> & {
        tooltip: LL;
      };
    };
    ApexMobile: {
      text: {
        trading: LL;
        welcome: LL;
        welcome2: LL;
      };
    };
    ApexMobilePanel: {
      title: LL;
    };
    AreaCost: {
      cost: PL<{ cost: string; available: string; error: string }>;
      error: LL;
    };
    Assets: {
      action: {
        construct: LL;
        view: LL;
      };
      header: {
        constructed: LL;
        own: LL;
        underConstruction: LL;
      };
      table: {
        address: LL;
        constructor: LL;
        created: LL;
        established: LL;
        owner: LL;
        progress: LL;
        type: LL;
      };
    };
    AssetsPanel: {
      title: LL;
    };
    AvailableSites: {
      plots: PL<{ free: string; total: string; ghost: string }>;
    };
    Badge: {
      description: {
        cluster: LL;
        comet: LL;
        galaxy: LL;
        moderator: LL;
        moon: LL;
        pioneer: LL;
        planet: LL;
        star: LL;
        supercluster: LL;
        team: LL;
        translator: LL;
        universe: LL;
      };
      name: {
        cluster: LL;
        comet: LL;
        galaxy: LL;
        moderator: LL;
        moon: LL;
        pioneer: LL;
        planet: LL;
        star: LL;
        supercluster: LL;
        team: LL;
        translator: LL;
        universe: LL;
      };
    };
    BadgesPanel: {
      title: LL;
    };
    BalanceStatementPanel: {
      change: LL;
      error: LL;
      period: {
        current: LL;
        last: LL;
        previous: LL;
      };
      title: LL;
      total: LL;
    };
    Base_construction: {
      error: {
        planetId: LL;
      };
    };
    BillOfMaterials: {
      inStock: LL;
      missing: PL<{ amount: string }>;
    };
    BlackListedUsers: {
      actions: {
        deblacklist: LL;
      };
    };
    BlacklistedUsers: {
      table: {
        commands: LL;
        time: LL;
        user: LL;
      };
      title: LL;
    };
    Blueprint: {
      action: {
        discard: LL;
        save: LL;
      };
      banner: {
        locked: LL;
      };
      buildTime: PL<{ buildTime: string }>;
      header: {
        billofmaterial: LL;
        information: LL;
        layout: LL;
        performance: LL;
      };
      label: {
        buildTime: LL;
        created: LL;
        materials: LL;
        shipType: LL;
      };
    };
    BlueprintComponentType: {
      CARGO_BAY: {
        name: LL;
        tooltip: LL;
      };
      COMMAND_BRIDGE: {
        name: LL;
        tooltip: LL;
      };
      CREW_QUARTERS: {
        name: LL;
        tooltip: LL;
      };
      FTL_FIELD_CONTROLLER: {
        name: LL;
        tooltip: LL;
      };
      FTL_FIELD_EMITTER_LARGE: {
        name: LL;
        tooltip: LL;
      };
      FTL_FIELD_EMITTER_MEDIUM: {
        name: LL;
        tooltip: LL;
      };
      FTL_FIELD_EMITTER_SMALL: {
        name: LL;
        tooltip: LL;
      };
      FTL_FUEL_TANK: {
        name: LL;
        tooltip: LL;
      };
      FTL_REACTOR: {
        name: LL;
        tooltip: LL;
      };
      GRAVITY_SHIELD: {
        name: LL;
        tooltip: LL;
      };
      HABITATION_MODULE: {
        name: LL;
        tooltip: LL;
      };
      HEAT_SHIELD: {
        name: LL;
        tooltip: LL;
      };
      HIGH_G_SEATS: {
        name: LL;
        tooltip: LL;
      };
      HULL_TYPE: {
        name: LL;
        tooltip: LL;
      };
      RADIATION_SHIELD: {
        name: LL;
        tooltip: LL;
      };
      REPAIR_DRONES: {
        name: LL;
        tooltip: LL;
      };
      STL_ENGINE: {
        name: LL;
        tooltip: LL;
      };
      STL_FUEL_TANK: {
        name: LL;
        tooltip: LL;
      };
      STRUCTURE: {
        name: LL;
        tooltip: LL;
      };
      VORTEX_FUEL_TANK: {
        name: LL;
        tooltip: LL;
      };
      VORTEX_REACTOR: {
        name: LL;
        tooltip: LL;
      };
      WHIPPLE_SHIELD: {
        name: LL;
        tooltip: LL;
      };
    };
    BlueprintStatus: {
      IN_PROGRESS: LL;
      LOCKED: LL;
      VALID: LL;
    };
    BlueprintTestFlight: {
      label: {
        blueprint: LL;
        condition: LL;
        destination: LL;
        ftlFuel: LL;
        ftlPreferences: LL;
        fuelUsage: LL;
        origin: LL;
        payload: LL;
        reactorUsage: LL;
        status: LL;
        stlFuel: LL;
      };
    };
    BlueprintTestFlightPanel: {
      error: {
        blueprintId: LL;
      };
      title: {
        loading: LL;
      };
    };
    Blueprints: {
      actions: {
        copy: LL;
        create: LL;
        _delete: LL;
        test: LL;
        view: LL;
      };
      error: {
        blueprint: LL;
      };
      table: {
        commands: LL;
        creationTime: LL;
        name: LL;
        status: LL;
      };
      title: {
        blueprint: LL;
        blueprints: LL;
      };
    };
    BookingType: {
      COMEX_DEPOSIT: LL;
      COMEX_DEPOSIT_REFUND: LL;
      COMEX_ORDER_DELETION_FEES: LL;
      COMEX_ORDER_DELETION_FEES_ROLLBACK: LL;
      CONTRACT_PAYMENT_PAID: LL;
      CONTRACT_PAYMENT_RECEIVED: LL;
      CORPORATION_DIVIDEND: LL;
      CORPORATION_FORMATION: LL;
      CORPORATION_INVESTMENT: LL;
      DIRECT_PAYMENT_PAID: LL;
      DIRECT_PAYMENT_RECEIVED: LL;
      FOREX_DEPOSIT: LL;
      FOREX_DEPOSIT_REFUND: LL;
      FOREX_PURCHASE: LL;
      FOREX_SALE: LL;
      GATEWAY_FEE: LL;
      GATEWAY_FEE_REFUND: LL;
      GATEWAY_FEE_REVENUES: LL;
      GOVERNMENT_PROGRAM_FEE: LL;
      GOVERNMENT_PROGRAM_FEE_ROLLBACK: LL;
      INITIAL_FUNDS: LL;
      INITIAL_MATERIALS: LL;
      LOAN_FAILURE: LL;
      LOAN_INSTALLMENT_PAID: LL;
      LOAN_INSTALLMENT_RECEIVED: LL;
      LOAN_PAYOUT_PAID: LL;
      LOAN_PAYOUT_RECEIVED: LL;
      LOAN_WRITE_OFF: LL;
      LOCAL_MARKET_FEE: LL;
      LOCAL_MARKET_FEE_REVENUES: LL;
      MATERIAL_CONSUMPTION: LL;
      MATERIAL_PURCHASE: LL;
      MATERIAL_RECEIVED: LL;
      MATERIAL_SALE: LL;
      PLATFORM_BUILT: LL;
      PLATFORM_REMOVED: LL;
      PRODUCTION_FEE: LL;
      PRODUCTION_FEE_REFUND: LL;
      PRODUCTION_FEE_REVENUES: LL;
      REPRESENTATION_CENTER_CONTRIBUTION: LL;
      SITE_ESTABLISHMENT_FEE: LL;
      SITE_ESTABLISHMENT_FEE_REVENUES: LL;
      WAREHOUSE_FEE_REVENUES: LL;
      WORKER_SUPPLIES: LL;
      WORKFORCE_FEES: LL;
    };
    BrokerFrame: {
      error: {
        unknownTicker: LL;
      };
    };
    BrokerList: {
      ask: LL & {
        amount: LL;
      };
      bid: LL & {
        amount: LL;
        demand: LL;
      };
      change: LL;
      empty: LL;
      infinity: LL;
      link: {
        chart: LL;
        info: LL;
        orderBook: LL;
        placeOrder: LL;
      };
      material: LL;
      noPrice: LL;
      price: LL;
      supply: LL;
      ticker: LL;
    };
    BrokerListLine: PL<{ absolute: string; relative: string }>;
    BtnBack: {
      action: {
        back: LL;
      };
    };
    Buffer: {
      title: PL<{ id: string }>;
    };
    BuildingInformation: {
      areaCost: LL;
      buildingCosts: LL;
      expertise: LL;
      production: LL;
      recipe: {
        inputless: LL;
      };
      workforces: LL;
    };
    BuildingPanel: {
      error: {
        building: LL;
      };
      title: LL;
      titleWithName: PL<{ name: string }>;
    };
    BuildingRepairAssistant: {
      base: LL;
      buildings: LL;
      button: LL;
      condition: {
        minimum: LL;
        selected: LL;
      };
      context: {
        base: LL;
        bases: LL;
      };
      materials: LL;
      timeoffset: LL & {
        _24: LL;
        _48: LL;
        info: LL;
        now: LL;
      };
      title: LL;
    };
    BuildingRepairAssistantPanel: {
      label: {
        minimum: {
          info: LL;
        };
      };
    };
    Button: {
      title: LL;
    };
    CalculatedDistance: {
      jumps: PL<{ jumps: string }>;
      samePlanet: LL;
      sameSystem: LL;
    };
    Card: {
      action: {
        open: LL;
      };
    };
    CardSubheading: {
      title: PL<{ name: string; subheading: string }>;
    };
    CashBookings: {
      amount: LL;
      credit: LL;
      debit: LL;
      description: LL;
      time: LL;
      value: PL<{ value: string; postfix: string }>;
    };
    CategoryName: {
      clothing: LL;
      food: LL;
      health: LL;
      tools: LL;
      water: LL;
    };
    Channel: {
      controls: {
        addUser: LL;
        leave: LL;
        mute: {
          label: LL;
        };
        userList: {
          label: LL;
        };
      };
    };
    ChannelCatalog: {
      controls: {
        open: LL;
      };
    };
    ChannelCatalogPanel: {
      context: {
        communications: LL;
      };
    };
    ChannelListPanel: {
      context: {
        mutedUsers: LL;
        publicCommunicationsCatalog: LL;
      };
    };
    ChannelMembership: {
      create: LL & {
        description: {
          group: LL;
          _private: LL;
        };
      };
      join: LL & {
        description: LL;
      };
    };
    ChannelMembershipList: {
      controls: {
        addGroup: {
          label: LL;
        };
        addPrivate: {
          label: LL;
        };
      };
    };
    ChannelMembershipListItem: {
      label: {
        group: PL<{ userCount: number; users: string }> & {
          _2: PL<{ u1: string; u2: string }>;
          _3: PL<{ u1: string; u2: string; u3: string }>;
          more: PL<{ u1: string; u2: string; additional: string }>;
          named: PL<{ name: string }>;
        };
        _private: PL<{ name: string }>;
        _public: PL<{ name: string }>;
      };
    };
    CoGC: {
      constructed: LL;
      error: {
        id: LL;
      };
      programs: {
        command: LL;
        status: {
          current: LL;
          previous: LL;
          upcoming: LL;
        };
        table: {
          command: LL;
          program: LL;
          schedule: LL;
          status: LL;
        };
        time: {
          current: PL<{ start: string }>;
          previous: PL<{ end: string }>;
          upcoming: PL<{ start: string }>;
        };
      };
      section: {
        programs: LL;
        upkeep: LL;
      };
      status: LL;
      upkeep: {
        billOfMaterial: LL;
        completion: LL;
        contribute: LL;
        contributions: LL;
        description: LL;
        dueDate: LL & {
          now: LL;
        };
      };
    };
    CoGCPanel: {
      context: {
        cogc: LL;
        cogcpex: LL;
        cogcu: LL;
        planet: LL;
      };
      error: {
        planetId: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
        notFound: LL;
      };
    };
    CoGCProgram: {
      ADVERTISING_AGRICULTURE: LL;
      ADVERTISING_AGRICULTURE_DESC: LL;
      ADVERTISING_AGRICULTURE_SHORT: LL;
      ADVERTISING_CHEMISTRY: LL;
      ADVERTISING_CHEMISTRY_DESC: LL;
      ADVERTISING_CHEMISTRY_SHORT: LL;
      ADVERTISING_CONSTRUCTION: LL;
      ADVERTISING_CONSTRUCTION_DESC: LL;
      ADVERTISING_CONSTRUCTION_SHORT: LL;
      ADVERTISING_ELECTRONICS: LL;
      ADVERTISING_ELECTRONICS_DESC: LL;
      ADVERTISING_ELECTRONICS_SHORT: LL;
      ADVERTISING_FOOD_INDUSTRIES: LL;
      ADVERTISING_FOOD_INDUSTRIES_DESC: LL;
      ADVERTISING_FOOD_INDUSTRIES_SHORT: LL;
      ADVERTISING_FUEL_REFINING: LL;
      ADVERTISING_FUEL_REFINING_DESC: LL;
      ADVERTISING_FUEL_REFINING_SHORT: LL;
      ADVERTISING_MANUFACTURING: LL;
      ADVERTISING_MANUFACTURING_DESC: LL;
      ADVERTISING_MANUFACTURING_SHORT: LL;
      ADVERTISING_METALLURGY: LL;
      ADVERTISING_METALLURGY_DESC: LL;
      ADVERTISING_METALLURGY_SHORT: LL;
      ADVERTISING_RESOURCE_EXTRACTION: LL;
      ADVERTISING_RESOURCE_EXTRACTION_DESC: LL;
      ADVERTISING_RESOURCE_EXTRACTION_SHORT: LL;
      WORKFORCE_ENGINEERS: LL;
      WORKFORCE_ENGINEERS_DESC: LL;
      WORKFORCE_ENGINEERS_SHORT: LL;
      WORKFORCE_PIONEERS: LL;
      WORKFORCE_PIONEERS_DESC: LL;
      WORKFORCE_PIONEERS_SHORT: LL;
      WORKFORCE_SCIENTISTS: LL;
      WORKFORCE_SCIENTISTS_DESC: LL;
      WORKFORCE_SCIENTISTS_SHORT: LL;
      WORKFORCE_SETTLERS: LL;
      WORKFORCE_SETTLERS_DESC: LL;
      WORKFORCE_SETTLERS_SHORT: LL;
      WORKFORCE_TECHNICIANS: LL;
      WORKFORCE_TECHNICIANS_DESC: LL;
      WORKFORCE_TECHNICIANS_SHORT: LL;
    };
    CoGCStatus: {
      ACTIVE: LL;
      ON_STRIKE: LL;
      PLANNED: LL;
    };
    CoGCUpkeep: {
      billOfMaterial: LL;
      contribute: {
        error: LL;
      };
      dueDate: LL & {
        now: LL;
      };
      section: {
        contribute: LL;
        contributions: LL;
      };
      status: LL;
    };
    CoGCUpkeepPanel: {
      error: {
        planetId: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
        notFound: LL;
      };
    };
    CoGCVoting: {
      table: {
        commands: LL;
        details: LL;
        influence: LL;
        name: LL;
        rank: LL;
      };
    };
    CoGCVotingDetails: {
      button: {
        vote: LL;
        voted: LL;
      };
      error: {
        completion: LL;
      };
      header: {
        name: PL<{ name: string }>;
      };
      label: {
        noBase: LL;
        timeleft: PL<{ time: string }>;
      };
      section: {
        Voters: LL;
      };
      table: {
        influence: LL;
        name: LL;
        rank: LL;
        time: LL;
      };
    };
    CoGCVotingDetailsContainer: {
      error: {
        program: LL;
      };
    };
    CoGCVotingDetailsPanel: {
      error: {
        planetId: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
        notFound: LL;
      };
    };
    CoGCVotingPanel: {
      error: {
        planetId: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
        notFound: LL;
      };
    };
    ComEx: {
      context: {
        exchange: {
          info: LL;
        };
        exchanges: LL;
        material: {
          info: LL;
        };
        orders: {
          own: LL;
          place: LL;
        };
        price: {
          chart: LL;
          info: LL;
          orders: LL;
        };
      };
    };
    ComExInlineTickerQuote: {
      quote: PL<{ name: string; quote: string; arrow: string }>;
    };
    ComExListPanel: {
      error: {
        nodata: LL;
      };
      title: LL;
    };
    ComExListTable: {
      code: LL;
      location: LL;
      name: LL;
      operator: LL;
    };
    ComExMaterialInfo: {
      ask: LL & {
        amount: LL;
      };
      bid: LL & {
        amount: LL;
      };
      context: {
        exchangeList: LL;
        materialInfo: LL;
        orderList: LL;
      };
      distance: LL;
      error: {
        nodata: LL;
      };
      exchange: LL & {
        location: LL;
      };
      link: {
        chart: LL;
        info: LL;
        orderBook: LL;
        placeOrder: LL;
      };
      price: LL & {
        change: LL;
      };
      supply: LL & {
        demand: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
      };
      units: LL & {
        weekly: LL;
      };
    };
    ComExMaterialInfoRow: {
      infinity: LL;
      noPrice: LL;
      priceChange: PL<{ absolute: string; relative: string }>;
    };
    ComExOrderPanel: {
      data: {
        amount: LL & {
          initial: LL;
        };
        exchange: LL;
        limit: LL;
        material: LL;
        status: LL;
        ticker: LL;
        type: LL;
      };
      error: {
        id: PL<{ input: string }>;
      };
      title: LL;
      trades: LL & {
        amount: LL;
        empty: LL;
        partner: LL;
        price: LL;
        time: LL;
      };
    };
    ComExOrdersPanel: {
      _delete: {
        action: {
          confirmation: LL & {
            details: PL<{ fees: string }>;
          };
          submit: LL;
        };
      };
      deleteFilled: LL;
      deleted: LL;
      filter: {
        clearMaterialFilters: LL;
        exchanges: LL;
        hide: LL;
        materials: LL;
        show: LL;
        statuses: LL;
        types: LL;
      };
      title: LL;
    };
    ComExOrdersTable: {
      amount: PL<{ amount: string; initial: string }>;
      _delete: LL;
      noOrders: LL;
      table: {
        amount: LL;
        exchange: LL;
        limit: LL;
        material: LL;
        status: LL;
        ticker: LL;
        type: LL;
      };
      view: LL;
    };
    ComExPanel: {
      data: {
        category: LL;
        code: LL;
        currency: LL;
        infrastructure: LL;
        location: LL;
        operator: LL;
        station: LL;
      };
      error: {
        id: PL<{ input: string }>;
      };
      title: {
        loading: LL;
      };
    };
    ComExPlaceOrderBook: {
      infinity: LL;
      offers: LL & {
        empty: LL;
      };
      requests: LL & {
        empty: LL;
      };
      spread: PL<{ spread: string }>;
      table: {
        amount: LL;
        price: LL;
        trader: LL;
      };
    };
    ComExPlaceOrderForm: {
      bidask: PL<{ bid: string; ask: string }>;
      buy: LL;
      inventory: PL<{ inventory: string; button: string }> & {
        amount: PL<{ amount: number }> & {
          set: LL;
        };
      };
      label: {
        amount: LL;
        bidask: LL;
        effectivePrice: LL & {
          info: LL;
        };
        exchange: LL;
        inventory: LL;
        limit: LL;
        material: LL;
        priceAverage: LL;
        priceband: LL & {
          info: LL;
        };
        storeId: LL;
        volume: LL;
      };
      price: {
        set: LL;
      };
      priceAverage: PL<{ priceAverage: string; command: string }>;
      priceband: PL<{ low: string; high: string; currency: string }>;
      sell: LL;
      shipmentSize: LL;
    };
    ComExPlaceOrderPanel: {
      action: {
        place: LL & {
          confirmation: LL;
        };
      };
      title: PL<{ ticker: string }>;
    };
    ComExPrice: {
      pricechange: PL<{ absolute: string; relative: string }>;
    };
    ComExPriceChartPanel: {
      chartWithNameAndTicker: PL<{ name: string; ticker: string }>;
      chartWithTicker: PL<{ ticker: string }>;
    };
    ComExPricePanel: {
      noPrice: LL;
      title: PL<{ ticker: string }>;
      titlebroker: PL<{ material: string; ticker: string }>;
    };
    ComExPurchasePickUpCondition: {
      content: PL<{ amount: string | number; total: number; material: string; address: string }>;
    };
    Command: {
      ACTIONS: LL;
      ADM: LL & {
        parameter: {
          planetIdInput: LL;
        };
      };
      ADMT: LL & {
        parameter: {
          planetIdInput: LL;
          termId: LL;
        };
      };
      APEXM: LL;
      ARC: LL;
      ASTS: LL;
      BBC: LL & {
        parameter: {
          blueprintIdInput: LL;
          siteIdInput: LL;
        };
      };
      BBL: LL & {
        parameter: {
          siteIdInput: LL;
        };
      };
      BDGS: LL;
      BLU: LL & {
        parameter: {
          blueprintIdInput: LL;
        };
      };
      BRA: LL & {
        parameter: {
          siteIdInput: LL;
        };
      };
      BS: LL & {
        parameter: {
          siteIdInput: LL;
        };
      };
      BSC: LL & {
        parameter: {
          planetIdInput: LL;
        };
      };
      BTF: LL;
      BUI: LL & {
        parameter: {
          buildingTicker: LL;
        };
      };
      CMDS: LL;
      CO: LL & {
        parameter: {
          query: LL;
        };
      };
      COGC: LL & {
        parameter: {
          planetIdInput: LL;
        };
      };
      COGCPD: LL & {
        parameter: {
          planetIdInput: LL;
          program: LL;
        };
      };
      COGCPEX: LL & {
        parameter: {
          planetIdInput: LL;
        };
      };
      COGCU: LL & {
        parameter: {
          planetIdInput: LL;
        };
      };
      COLIQ: LL;
      COM: LL;
      COMC: LL;
      COMF: LL;
      COMG: LL & {
        parameter: {
          channelIdentifier: LL;
        };
      };
      COMP: LL & {
        parameter: {
          channelIdentifier: LL;
        };
      };
      COMU: LL & {
        parameter: {
          channelIdentifier: LL;
        };
      };
      CONS: LL;
      CONT: LL & {
        parameter: {
          contractId: LL;
        };
      };
      CONTD: LL & {
        parameter: {
          draftIdInput: LL;
        };
      };
      CONTS: LL;
      CORP: LL;
      CORPARC: LL;
      CORPFIN: LL;
      CORPIVS: LL & {
        parameter: {
          companyIdInput: LL;
        };
      };
      CORPNP: LL;
      CORPP: LL & {
        parameter: {
          partialProjectId: LL;
        };
      };
      CORPS: LL & {
        parameter: {
          corporationIdInput: LL;
        };
      };
      CS: LL;
      CX: LL & {
        parameter: {
          idInput: LL;
        };
      };
      CXL: LL;
      CXM: LL & {
        parameter: {
          materialTicker: LL;
          planetIdInput: LL;
        };
      };
      CXO: LL & {
        parameter: {
          query: LL;
        };
      };
      CXOB: LL & {
        parameter: {
          ticker: LL;
        };
      };
      CXOS: LL & {
        parameter: {
          pagesize: LL;
        };
      };
      CXP: LL & {
        parameter: {
          ticker: LL;
        };
      };
      CXPC: LL & {
        parameter: {
          ticker: LL;
        };
      };
      CXPO: LL & {
        parameter: {
          ticker: LL;
        };
      };
      EXP: LL & {
        parameter: {
          siteIdInput: LL;
        };
      };
      EXTLNK: LL;
      FA: LL & {
        parameter: {
          query: LL;
        };
      };
      FIN: LL;
      FINBS: LL;
      FINIS: LL;
      FINLA: LL;
      FLT: LL;
      FLTP: LL & {
        parameter: {
          partialPlanetId: LL;
        };
      };
      FLTS: LL & {
        parameter: {
          partialSystemId: LL;
        };
      };
      FTL: {
        parameter: {
          addressInput: LL;
        };
      };
      FX: LL;
      FXO: LL & {
        parameter: {
          query: LL;
        };
      };
      FXOB: LL & {
        parameter: {
          ticker: LL;
        };
      };
      FXOS: LL;
      FXP: LL & {
        parameter: {
          ticker: LL;
        };
      };
      FXPC: LL & {
        parameter: {
          ticker: LL;
        };
      };
      FXPO: LL & {
        parameter: {
          ticker: LL;
        };
      };
      GIFT: LL;
      GOV: LL & {
        parameter: {
          planetIdInput: LL;
        };
      };
      GTW: LL & {
        parameter: {
          locationIdInput: LL;
        };
      };
      GTWI: LL;
      GTWT: LL & {
        parameter: {
          gatewayNaturalId: LL;
        };
      };
      HELP: LL;
      HQ: LL;
      INF: LL & {
        parameter: {
          infrastructureNaturalId: LL;
          systemIdInput: LL;
        };
      };
      INFU: LL;
      INV: LL & {
        parameter: {
          storeIdInput: LL;
        };
      };
      LEAD: LL;
      LIC: LL;
      LM: LL & {
        parameter: {
          localMarketIdInput: LL;
        };
      };
      LMA: LL & {
        parameter: {
          localMarketAdIdInput: LL;
        };
      };
      LMBL: LL;
      LMOS: LL;
      LMP: LL & {
        parameter: {
          localMarketIdInput: LL;
        };
      };
      LR: LL & {
        parameter: {
          planetIdInput: LL;
        };
      };
      MAT: LL & {
        parameter: {
          materialTicker: LL;
        };
      };
      MOT: LL & {
        parameter: {
          planetIdInput: LL;
        };
      };
      MOTS: LL & {
        parameter: {
          motionId: LL;
          motionIdInput: LL;
        };
      };
      MS: LL & {
        parameter: {
          systemIdInput: LL;
        };
      };
      MTRA: LL & {
        parameter: {
          materialTickerInput: LL;
          originStoreIdInput: LL;
          targetStoreIdInput: LL;
        };
      };
      MU: LL & {
        parameter: {
          mode: LL;
        };
      };
      NOTIG: LL;
      NOTPNS: LL;
      NOTS: LL;
      PLI: LL & {
        parameter: {
          planetIdInput: LL;
        };
      };
      PLNM: LL & {
        parameter: {
          naturalId: LL;
        };
      };
      POL: LL & {
        parameter: {
          query: LL;
        };
      };
      POPI: LL & {
        parameter: {
          planetIdInput: LL;
        };
      };
      POPID: LL & {
        parameter: {
          infrastructureType: LL;
          planetIdInput: LL;
        };
      };
      POPR: LL & {
        parameter: {
          planetIdInput: LL;
        };
      };
      PP: LL & {
        parameter: {
          planetIdInput: LL;
          planetaryProjectIdInput: LL;
          siteIdInput: LL;
        };
      };
      PPI: LL;
      PPS: LL & {
        parameter: {
          planetIdInput: LL;
        };
      };
      PROD: LL;
      PRODCO: LL & {
        parameter: {
          productionLineIdInput: LL;
          siteIdInput: LL;
        };
      };
      PRODQ: LL & {
        parameter: {
          productionLineIdInput: LL;
        };
      };
      RSB: LL;
      SCRN: LL;
      SFC: LL & {
        parameter: {
          partialShipId: LL;
        };
      };
      SHP: LL & {
        parameter: {
          partialShipId: LL;
        };
      };
      SHPF: LL & {
        parameter: {
          partialShipId: LL;
        };
      };
      SHPI: LL & {
        parameter: {
          partialShipId: LL;
        };
      };
      SHY: LL & {
        parameter: {
          locationIdInput: LL;
        };
      };
      SHYP: LL & {
        parameter: {
          projectIdInput: LL;
        };
      };
      SI: LL & {
        parameter: {
          partialShipId: LL;
        };
      };
      STEAM: LL;
      STNS: LL & {
        parameter: {
          partialStationId: LL;
        };
      };
      SYSI: LL & {
        parameter: {
          systemIdInput: LL;
        };
      };
      SYSNM: LL & {
        parameter: {
          naturalId: LL;
        };
      };
      TRA: LL;
      UPCK: LL & {
        parameter: {
          storeIdInput: LL;
        };
      };
      USR: LL & {
        parameter: {
          query: LL;
        };
      };
      WAR: LL & {
        parameter: {
          warehouseIdInput: LL;
        };
      };
      WF: LL & {
        parameter: {
          siteIdInput: LL;
        };
      };
      XIT: LL;
      XYTV: LL;
    };
    CommandInput: {
      label: LL;
    };
    CommandsPanel: {
      command: LL;
      description: LL;
      mandatoryParameters: LL;
      optionalParameters: LL;
      title: LL;
    };
    CommodityAd: {
      text: PL<{
        action: string;
        amount: string;
        commodity: string;
        ticker: string;
        price: string;
        advice: string;
        adviceTime: string;
      }> & {
        advice: PL<{ advice: number }>;
        collection: LL;
        delivery: LL;
      };
    };
    CommodityShippingAd: {
      text: {
        collection: PL<{ advice: number }>;
        perspectiveSender: PL<{
          action: string;
          amount: string;
          commodity: string;
          price: string;
          origin: string;
          destination: string;
          adviceTime: string;
        }>;
        perspectiveShipper: PL<{
          action: string;
          weight: string;
          volume: string;
          price: string;
          origin: string;
          destination: string;
          adviceTime: string;
        }>;
      };
    };
    CompanyCreation: {
      SelectionCategory: {
        COUNTRY: LL;
        LOCATION: LL;
        PROFILE: LL;
      };
    };
    CompanyHeadquarters: {
      basepermits: PL<{ usedPermits: string; availablePermits: string }>;
      button: {
        relocate: LL;
      };
      command: LL;
      context: {
        company: LL;
      };
      empty: LL;
      form: {
        additionalBasePermits: LL;
        additionalProductionQueueSlots: LL;
        address: LL;
        basepermits: LL;
        efficiencygains: LL;
        efficiencygainsdetails: PL<{ category: string; gain: string }>;
        level: LL;
        name: LL;
        nextRelocationTime: PL<{ relocation: string }>;
        site: LL;
      };
      header: {
        relocate: LL;
        upgrade: LL;
      };
      label: {
        additionalBasePermits: {
          info: LL;
        };
        additionalProductionQueueSlots: {
          info: LL;
        };
        basepermits: {
          info: LL;
        };
        efficiencygains: {
          info: LL;
        };
        level: {
          info: LL;
        };
        relocateNotPossible: LL;
      };
      title: {
        noAddress: LL;
        withAddress: PL<{ address: string }>;
      };
    };
    CompanyHeadquartersPanel: {
      action: {
        confirmation: PL<{ name: string }>;
        relocate: LL;
      };
    };
    CompanyPanel: {
      context: {
        headquarters: LL;
      };
      data: {
        bases: LL;
        code: LL;
        corporation: LL & {
          invite: LL;
        };
        country: LL;
        founded: LL;
        rating: LL;
        registration: LL;
        representation: LL & {
          level: PL<{ level: string }>;
        };
        reputation: LL;
        user: LL;
      };
      error: {
        id: PL<{ input: string }>;
      };
      title: {
        loading: LL;
        single: PL<{ name: string }>;
      };
    };
    CompanySetup: {
      CARBON_FARMER: LL;
      CONSTRUCTOR: LL;
      FUEL_ENGINEER: LL;
      MANUFACTURER: LL;
      METALLURGIST: LL;
      VICTUALLER: LL;
      header: LL;
      profile: {
        CARBON_FARMER: LL & {
          description: LL;
          resources: LL;
        };
        CONSTRUCTOR: LL & {
          description: LL;
          resources: LL;
        };
        FUEL_ENGINEER: LL & {
          description: LL;
          resources: LL;
        };
        MANUFACTURER: LL & {
          description: LL;
          resources: LL;
        };
        METALLURGIST: LL & {
          description: LL;
          resources: LL;
        };
        VICTUALLER: LL & {
          description: LL;
          resources: LL;
        };
      };
      step: {
        action: {
          accept: LL;
          back: LL;
          create: LL;
          next: LL;
        };
        company: {
          code: LL & {
            info: LL;
            placeholder: LL;
          };
          description1: LL;
          description2: LL;
          error: {
            unavailableCode: LL;
            unavailableName: LL;
          };
          header: LL;
          name: LL & {
            info: LL;
            placeholder: LL;
          };
        };
        country: {
          currency: PL<{ currency: string }>;
          header: LL;
        };
        disclaimer: {
          header: LL;
          indevelopment: LL;
          slowgame: LL;
          text1: PL<{ indevelopment: string }>;
          text2: PL<{ slowgame: string }>;
          text3: LL;
        };
        location: {
          description1: LL;
          description2: LL;
          header: LL;
          professionSuitability: LL;
        };
        profile: {
          centralResources: LL;
          header: LL;
          note: LL;
          resources: LL;
        };
      };
    };
    CompanySiteContainer: {
      error: {
        notFound: LL;
      };
    };
    ComponentDescription: {
      type: {
        CONTRIBUTION: PL<{ money: string; contributor: string }>;
        FEE_LOCAL_MARKET: PL<{ base: string; timefactor: string }>;
        FEE_SITE_ESTABLISHMENT: PL<{ fee: string }>;
        FEE_WAREHOUSE: PL<{ amount: string }>;
        GATEWAY_FUEL: PL<{
          contractor: string;
          periods: string;
          link: string;
          slo: string;
          amount: string;
        }>;
        GATEWAY_LINK: {
          link: PL<{
            originGateway: string;
            originAddress: string;
            destinationGateway: string;
            destinationAddress: string;
          }>;
          unlink: PL<{ originGateway: string }>;
        };
        GATEWAY_PRICING: PL<{ link: string; amount: string }>;
        INFRASTRUCTURE_CONSTRUCTION: PL<{ constructor: string; type: string; amount: string }>;
        INFRASTRUCTURE_NAME: PL<{ type: string; naturalId: string; name: string }>;
        INFRASTRUCTURE_UPGRADE: PL<{
          constructor: string;
          type: string;
          link: string;
          amount: string;
        }>;
        INFRASTRUCTURE_UPKEEP: PL<{
          contractor: string;
          periods: string;
          type: string;
          link: string;
          slo: string;
          amount: string;
        }>;
        PAYOUT: PL<{ money: string; user: string }>;
        WORKFORCE_PROGRAM: PL<{ program: string; costs: string }>;
      };
    };
    ComponentOption: {
      ftlEmitter: PL<{ amount: number }>;
      notrequired: LL;
      required: LL;
      structure: PL<{ amount: string }>;
    };
    ComponentType: {
      CONTRIBUTION: LL;
      FEE_LOCAL_MARKET: LL;
      FEE_PRODUCTION: LL;
      FEE_SITE_ESTABLISHMENT: LL;
      FEE_WAREHOUSE: LL;
      GATEWAY_FUEL: LL;
      GATEWAY_LINK: LL;
      GATEWAY_PRICING: LL;
      GATEWAY_UNLINK: LL;
      INFRASTRUCTURE_CONSTRUCTION: LL;
      INFRASTRUCTURE_NAME: LL;
      INFRASTRUCTURE_UPGRADE: LL;
      INFRASTRUCTURE_UPKEEP: LL;
      PAYOUT: LL;
      POPULATION_INFRASTRUCTURE_LEVEL: LL;
      WORKFORCE_PROGRAM: LL;
    };
    Condition: {
      BUY_MATERIAL_FROM_CATEGORY: LL;
      FULFILL_COUNTRY_CONTRACT: LL;
      INCREASE_SATISFACTION: LL;
      MAKE_MONEY: LL;
      WAIT: LL;
      dependency: PL<{ index: string }>;
    };
    ConditionEditForm: {
      action: {
        save: LL;
      };
    };
    ConditionText: {
      baseConstruction: LL;
      buildingConstruction: LL;
      buyMaterialFromCategory: PL<{ category: string }>;
      construction: LL;
      contribution: PL<{ address: string }>;
      delivery: PL<{ amount: number; material: string; address: string }>;
      deliveryShipment: PL<{ address: string }>;
      exploration: {
        planet: PL<{ address: string }>;
        system: PL<{ address: string }>;
      };
      finishFlight: LL;
      fulfillCountryContract: LL;
      gatewayFuel: PL<{ infrastructure: string; phase: string; level: string }>;
      increaseSatisfaction: PL<{ requiredSatisfaction: string }>;
      infrastructureConstructionFinish: LL;
      infrastructureConstructionStart: PL<{ type: string; address: string }>;
      infrastructureUpgradeFinish: LL;
      infrastructureUpgradeStart: PL<{ type: string; link: string }>;
      infrastructureUpkeep: PL<{
        type: string;
        infrastructure: string;
        phase: string;
        level: string;
      }>;
      loanInstallment: PL<{ interest: string; repayment: string }>;
      loanPayout: PL<{ amount: string }>;
      maintenance: LL;
      makeMoney: PL<{ threshold: string }>;
      payment: PL<{ amount: string }>;
      pickup: PL<{ amount: number; material: string; address: string }>;
      pickupShipment: PL<{ address: string }>;
      placeOrder: LL;
      power: LL;
      productionOrderCompleted: LL;
      productionRun: LL;
      provision: PL<{ amount: number; material: string; address: string }> & {
        autoprovision: LL;
      };
      provisionShipment: PL<{
        amount: number;
        material: string;
        address: string;
        autoprovision: string;
      }>;
      reputation: PL<{ reputation: string }>;
      startFlight: LL;
      upgrade: LL;
      wait: PL<{ duration: string }>;
      workforceProgramStart: PL<{ type: string }>;
    };
    ConditionType: {
      BUILDING_CONSTRUCTION: LL;
      CONDITION_BASE_CONSTRUCTION: LL;
      CONDITION_COMEX_PURCHASE_PICKUP: LL;
      CONDITION_CONSTRUCT_SHIP: LL;
      CONDITION_CONTRIBUTION: LL;
      CONDITION_DELIVERY: LL;
      CONDITION_DELIVERY_SHIPMENT: LL;
      CONDITION_EXPLORATION: LL;
      CONDITION_FINISH_FLIGHT: LL;
      CONDITION_GATEWAY_FUEL: LL;
      CONDITION_HEADQUARTERS_UPGRADE: LL;
      CONDITION_INFRASTRUCTURE_CONSTRUCTION_START: LL;
      CONDITION_INFRASTRUCTURE_UPGRADE_START: LL;
      CONDITION_INFRASTRUCTURE_UPKEEP: LL;
      CONDITION_LOAN_INSTALLMENT: LL;
      CONDITION_LOAN_PAYOUT: LL;
      CONDITION_PAYMENT: LL;
      CONDITION_PICKUP: LL;
      CONDITION_PICKUP_SHIPMENT: LL;
      CONDITION_PLACE_ORDER: LL;
      CONDITION_POWER: LL;
      CONDITION_PRODUCTION_ORDER_COMPLETED: LL;
      CONDITION_PRODUCTION_RUN: LL;
      CONDITION_PROVISION: LL;
      CONDITION_PROVISION_SHIPMENT: LL;
      CONDITION_REPAIR_SHIP: LL;
      CONDITION_REPUTATION: LL;
      CONDITION_START_FLIGHT: LL;
      CONDITION_WORKFORCE_PROGRAM_PAYMENT: LL;
      CONDITION_WORKFORCE_PROGRAM_START: LL;
      INFRASTRUCTURE_CONSTRUCTION_FINISH: LL;
      INFRASTRUCTURE_UPGRADE_FINISH: LL;
    };
    Connecting: {
      client: {
        connecting: LL;
        disconnected: LL;
        reconnecting: LL;
      };
      server: {
        connecting: LL;
        connectionFailure: LL;
        disconnected: LL;
      };
    };
    ConstructInfrastructureComponent: {
      label: {
        address: LL;
        constructor: LL;
        currency: LL;
        deadline: LL;
        payment: LL;
        type: LL;
      };
    };
    ContextControls: {
      contextItem: PL<{ command: string; label: string }>;
      contexts: LL;
      title: PL<{ context: string }>;
    };
    ContextName: {
      company: {
        title: PL<{ name: string }>;
      };
      government: {
        title: PL<{ address: string }>;
      };
    };
    Contract: {
      action: {
        close: LL;
        reject: LL;
        requestTermination: LL & {
          info: LL;
        };
      };
      banner: {
        action: {
          breach: LL;
          extend: LL;
        };
      };
      conditions: LL;
      date: LL;
      fulfillCondition: {
        confirm: LL;
        confirmation: LL;
      };
      id: LL;
      name: LL;
      partner: LL;
      preamble: LL;
      status: LL;
      table: {
        command: LL;
        condition: LL;
        deadline: LL & {
          info: LL;
        };
        dependencies: LL;
        index: LL;
        party: LL;
        status: LL;
      };
      termination: LL & {
        received: LL;
        sent: LL;
      };
    };
    ContractCondition: {
      FULFILLED: LL;
      FULFILLMENT_ATTEMPTED: LL;
      IN_PROGRESS: LL;
      PARTLY_FULFILLED: LL;
      PENDING: LL;
      VIOLATED: LL;
      deadline: PL<{ duration: string }>;
      fulfill: LL;
    };
    ContractDraft: {
      action: {
        save: LL;
        template: LL;
      };
      condition: {
        deadline: PL<{ deadline: number }>;
      };
      form: {
        name: LL;
        preamble: LL & {
          placeholder: LL;
        };
        repeating: LL;
        status: LL;
      };
      header: {
        conditions: LL;
        send: LL;
      };
      label: {
        template: LL;
      };
      table: {
        action: {
          condition: LL;
          parameter: LL;
        };
        commands: LL;
        condition: LL;
        deadline: LL;
        dependency: LL;
        index: LL;
        party: LL;
      };
    };
    ContractDraftSend: {
      action: {
        discard: LL;
        save: LL;
        send: LL;
      };
      form: {
        recipient: LL;
      };
    };
    ContractDrafts: {
      actions: {
        copy: LL;
        create: LL;
        _delete: LL;
        view: LL;
      };
      table: {
        commands: LL;
        creationTime: LL;
        name: LL;
        status: LL;
      };
    };
    ContractDraftsPanel: {
      action: {
        _delete: LL & {
          confirmation: PL<{ name: string }>;
        };
        send: LL & {
          confirmation: PL<{ name: string; user: string }>;
        };
      };
      error: {
        draft: LL;
      };
      title: {
        draft: LL;
        drafts: LL;
      };
    };
    ContractPanel: {
      extensionWithControl: PL<{ countdown: string }>;
      extensionWithoutControl: PL<{ countdown: string }>;
      title: PL<{ id: string }> & {
        loading: LL;
      };
    };
    ContractStatus: {
      BREACHED: LL;
      CANCELLED: LL;
      CLOSED: LL;
      DEADLINE_EXCEEDED: LL;
      DRAFT: LL;
      FULFILLED: LL;
      OPEN: LL;
      PARTIALLY_FULFILLED: LL;
      REJECTED: LL;
      TERMINATED: LL;
    };
    Contracts: {
      context: {
        contractDrafts: LL;
        contracts: LL;
      };
    };
    ContractsPanel: {
      filter: {
        all: LL;
        hide: LL;
        none: LL;
        show: LL;
      };
      table: {
        cmds: LL;
        created: LL;
        due: LL;
        id: LL;
        partner: LL;
        status: LL;
        view: LL;
      };
      title: LL;
    };
    Contribution: {
      button: {
        contribute: LL;
      };
      consumption: PL<{ interval: string }>;
      stores: LL;
      table: {
        contribution: LL;
        inventory: LL;
        lastFor: LL;
        nextConsumption: LL;
        reserve: LL;
        status: LL;
      };
    };
    ContributionComponent: {
      label: {
        amount: LL;
        contributor: LL;
        currency: LL;
      };
    };
    Contributions: {
      label: {
        noContributions: LL;
      };
      table: {
        contributor: LL;
        materials: LL;
        time: LL;
      };
    };
    CoporationContainer: {
      data: {
        representationCenter: LL & {
          level: PL<{ level: string }>;
        };
      };
    };
    Corporation: {
      infrastructure: {
        command: LL & {
          contribute: LL;
          project: LL;
          view: LL;
        };
        empty: LL;
        location: LL;
        project: LL;
        startproject: LL;
        status: LL;
      };
    };
    CorporationContainer: {
      data: {
        code: LL;
        country: LL;
        founded: LL;
        headquarter: LL;
        headquarters: LL;
        name: LL;
        shareholder: PL<{ entity: string; share: string }>;
        shareholders: LL;
        shares: LL;
      };
    };
    CorporationFinance: {
      balances: {
        balance: LL;
        currency: LL;
      };
      dividendPayouts: {
        payoutpershare: LL;
        time: LL;
      };
      header: {
        dividendpayouts: LL;
        liquidassets: LL;
      };
      info: {
        currency: LL;
        nextDividendPayout: LL;
        shareholders: LL;
        shares: LL;
      };
    };
    CorporationFinancePanel: {
      noPrimaryHolding: LL;
    };
    CorporationInviteContainer: {
      error: {
        notFound: LL;
      };
      invite: LL & {
        description: PL<{ company: string }>;
      };
      pendingInvite: {
        contribution: LL;
        invited: LL;
        invitee: LL;
        invitor: LL;
        shares: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
      };
    };
    CorporationInvitesContainer: {
      table: {
        empty: LL;
        invitee: LL;
        invitor: LL;
        sent: LL;
        view: LL;
      };
      title: LL;
    };
    CorporationMembership: {
      formCorporation: {
        title: LL;
      };
      invites: {
        title: LL;
      };
    };
    CorporationMembershipPanel: {
      action: {
        confirmation: LL;
        leave: LL;
      };
      title: LL;
    };
    CorporationNewProject: {
      action: {
        started: LL;
      };
      command: {
        start: LL;
      };
      label: {
        billofmaterial: LL;
        description: LL;
        limit: LL;
        location: LL;
        project: LL;
        site: LL;
      };
      limit: PL<{ amount: string; cardinality: string }>;
    };
    CorporationNewProjectPanel: {
      empty: LL;
      title: LL;
    };
    CorporationProject: {
      address: LL;
      billOfMaterial: LL;
      command: LL & {
        cancelProject: LL;
      };
      constructionDate: LL;
      contribute: {
        error: LL;
      };
      description: {
        ftl_laboratory: LL;
        hq: LL;
        immortality_center: LL;
        representation_center: PL<{ break: string }>;
        terraforming_center: LL;
      };
      empty: LL;
      ftl_laboratory: LL;
      hq: LL;
      immortality_center: LL;
      project: LL;
      representation_center: LL;
      section: {
        contribute: LL;
        contributions: LL;
      };
      status: LL & {
        inConstruction: LL;
        operational: LL;
      };
      terraforming_center: LL;
      ticker: {
        ftl_laboratory: LL;
        hq: LL;
        immortality_center: LL;
        representation_center: LL;
        terraforming_center: LL;
      };
    };
    CorporationProjectPanel: {
      action: {
        cancel: LL & {
          confirmation: LL;
        };
      };
      error: {
        projectId: LL;
      };
      noCorporation: LL;
      title: PL<{ type: string; name: string }> & {
        loading: LL;
        notFound: LL;
        projects: LL;
      };
    };
    CorporationRepresentationCenter: {
      error: {
        noRepresentation: LL;
      };
      title: LL;
    };
    Corporations: {
      action: {
        detail: LL;
      };
      list: {
        code: LL;
        name: LL;
      };
    };
    CorporationsPanel: {
      error: {
        corporationId: LL;
      };
      title: {
        listing: LL;
        single: PL<{ name: string }> & {
          loading: LL;
        };
      };
    };
    CorporationsTile: {
      error: LL;
    };
    Country: {
      AI: {
        description: LL;
        name: LL;
      };
      CI: {
        description: LL;
        name: LL;
      };
      IC: {
        description: LL;
        name: LL;
      };
      NC: {
        description: LL;
        name: LL;
      };
      label: {
        agents: LL;
        background: LL;
        code: LL;
        contractOffers: LL;
        name: LL;
        receiveContractOffers: LL;
      };
    };
    CountryAgent: {
      AI: {
        EXPANSION: LL;
        EXPLORATION: LL;
        GOVERNANCE: LL;
        INFRASTRUCTURE: LL;
        LOGISTICS: LL;
      };
      CI: {
        EXPANSION: LL;
        EXPLORATION: LL;
        GOVERNANCE: LL;
        INFRASTRUCTURE: LL;
        LOGISTICS: LL;
      };
      IC: {
        EXPANSION: LL;
        EXPLORATION: LL;
        GOVERNANCE: LL;
        INFRASTRUCTURE: LL;
        LOGISTICS: LL;
      };
      NC: {
        EXPANSION: LL;
        EXPLORATION: LL;
        GOVERNANCE: LL;
        INFRASTRUCTURE: LL;
        LOGISTICS: LL;
      };
    };
    CountryControls: {
      label: {
        countries: LL;
      };
    };
    CountryPanel: {
      error: {
        id: PL<{ input: string }>;
      };
      title: LL & {
        country: PL<{ name: string }>;
      };
    };
    CreateGroupMembership: {
      form: {
        cancel: LL;
        create: LL;
        header: LL;
        name: LL;
      };
    };
    CreateOneOnOneMembership: {
      form: {
        cancel: LL;
        create: LL;
        header: LL;
        name: LL;
      };
    };
    CreateScreenForm: {
      button: {
        create: LL;
      };
      form: {
        description: LL;
        name: LL;
      };
    };
    Currency: {
      nameAndCode: PL<{ name: string; code: string }>;
    };
    Damage: {
      value: PL<{ damage: string }>;
    };
    DeleteCompanyPanel: {
      confirm: LL;
      cooldown: PL<{ time: string }>;
      description: PL<{ name: string }>;
      noCompany: LL;
      pendingContracts: PL<{ contracts: string }>;
      submit: LL;
      title: LL;
      warning: LL;
      warning2: LL;
      warning3: LL;
    };
    DeliveryConditionEditForm: {
      form: {
        address: LL;
        amount: LL;
        material: LL;
      };
    };
    Distance: {
      distance: PL<{ distance: string; unit: string }>;
    };
    DistanceUnit: {
      au: LL;
      hops: LL;
      km: LL;
      parsec: LL;
    };
    Dock: {
      controls: {
        newBuffer: LL;
      };
    };
    DraftConditionEditor: {
      header: LL;
    };
    DraftConditionParameterEditForm: {
      form: {
        amount: LL;
      };
    };
    DraftPartyName: {
      other: LL;
      self: LL;
    };
    DropDownBoxShipmentItem: PL<{ id: string }>;
    DropTargetView: {
      ALL: LL;
      AMT: LL;
      HLF: LL;
      MAX: LL;
      MAX_VOL: LL;
      MAX_WGT: LL;
    };
    EfficiencyFactor: {
      COGC_PROGRAM: LL;
      COMPANY_HEADQUARTERS: LL;
      CORPORATION_HQ: LL;
      EXPERTS: LL;
      FERTILITY: LL;
      PRODUCTION_LINE_CONDITION: LL;
    };
    EndlessScrollControl: {
      label: {
        loadmore: LL;
      };
    };
    EntityLink: {
      government: PL<{ entity: string }>;
    };
    EnvironmentTable: {
      row: {
        gravity: LL;
        pressure: LL;
        temperature: LL;
      };
    };
    ErrorBoundary: {
      error: LL;
    };
    ExpertiseCategory: {
      AGRICULTURE: LL;
      CHEMISTRY: LL;
      CONSTRUCTION: LL;
      ELECTRONICS: LL;
      FOOD_INDUSTRIES: LL;
      FUEL_REFINING: LL;
      MANUFACTURING: LL;
      METALLURGY: LL;
      RESOURCE_EXTRACTION: LL;
    };
    Experts: {
      action: {
        activate: LL;
        deactivate: LL;
      };
      activeExperts: PL<{ active: string; totalActiveCap: string }>;
      currentAndLimit: PL<{ current: string; limit: string }>;
      label: {
        activeExperts: LL;
        totalExperts: LL;
      };
      table: {
        active: LL;
        available: LL;
        category: LL;
        controls: LL;
        efficiency: LL;
        progress: LL;
      };
    };
    ExpertsPanel: {
      error: {
        siteId: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
      };
    };
    ExternalURLPanel: {
      hint: LL;
      info: LL;
      link: LL;
      title: LL;
    };
    Faction: {
      AI: {
        currency: LL;
        description: LL;
      };
      CI: {
        currency: LL;
        description: LL;
      };
      EC: {
        currency: LL;
        description: LL;
      };
      IC: {
        currency: LL;
        description: LL;
      };
      NC: {
        currency: LL;
        description: LL;
      };
    };
    FeeLocalMarketComponent: {
      label: {
        base: LL;
        time: LL;
      };
    };
    FeeProductionContainer: {
      label: {
        currency: LL;
        productionFees: LL;
      };
    };
    FeeSiteEstablishmentComponent: {
      label: {
        amount: LL;
      };
    };
    FeeWarehouseComponent: {
      label: {
        amount: LL;
      };
    };
    FilterTag: {
      action: {
        close: LL;
      };
    };
    Finance: {
      context: {
        balanceStatement: LL;
        incomeStatement: LL;
        liquidAssets: LL;
        overview: LL;
      };
    };
    FinanceOverviewPanel: {
      header: {
        cashBookings: LL;
        indicators: LL;
      };
      indicators: {
        assets: {
          current: LL;
          fixed: LL;
          liquid: LL;
        };
        equity: LL;
        expenses: LL;
        liabilities: LL;
        result: LL;
        revenue: LL;
      };
      title: LL;
    };
    Fleet: {
      context: {
        planetInformation: LL;
        shipFlightControl: LL;
        systemMap: LL;
      };
    };
    FleetPanel: {
      error: {
        planetId: LL;
        systemId: LL;
      };
      fleet: LL;
      fleetAt: PL<{ address: string }>;
      table: {
        cargo: LL;
        command: LL;
        destination: LL;
        eta: LL;
        fuel: LL;
        location: LL;
        registration: LL;
        ship: LL;
        status: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
      };
    };
    FlightControlContainer: {
      action: {
        abort: LL & {
          description: LL;
        };
        start: LL & {
          content: PL<{ origin: string; destination: string; duration: string }>;
          description: LL;
        };
      };
    };
    FlightControlPanel: {
      error: {
        shipId: LL;
      };
      title: {
        loading: LL;
      };
    };
    FlightControlView: {
      mass: PL<{ mass: string; operatingEmptyMass: string }>;
    };
    FlightPlan: {
      consumption: LL;
      damage: LL;
      destination: LL;
      distance: LL;
      duration: LL;
      index: LL;
      type: LL;
    };
    ForEx: {
      context: {
        chart: LL;
        liquidAssets: LL;
        matrix: LL;
        orderBook: LL;
        orders: LL;
        placeOrder: LL;
        price: LL;
      };
    };
    ForExInlineTickerQuote: {
      line: PL<{ ticker: string; highlight: string; arrow: string }>;
    };
    ForExOrderBook: {
      error: {
        ticker: PL<{ ticker: string }>;
      };
      offers: LL & {
        none: LL;
      };
      requests: LL & {
        none: LL;
      };
      spread: PL<{ spread: string }>;
      table: {
        amount: LL;
        price: LL;
        trader: LL;
      };
      title: PL<{ ticker: string }>;
    };
    ForExOrderPanel: {
      data: {
        amount: LL & {
          initial: LL;
        };
        limit: LL;
        status: LL;
        ticker: LL;
        type: LL;
      };
      error: {
        id: PL<{ input: string }>;
      };
      title: LL;
      trades: LL & {
        amount: LL;
        empty: LL;
        partner: LL;
        price: LL;
        time: LL;
      };
    };
    ForExOrdersPanel: {
      deleted: LL;
      title: LL;
    };
    ForExOrdersTable: {
      action: {
        _delete: LL;
        view: LL;
      };
      amount: PL<{ amount: string; initial: string }>;
      table: {
        amount: LL;
        limit: LL;
        status: LL;
        ticker: LL;
        type: LL;
      };
    };
    ForExPlaceOrderForm: {
      _: {
        labelfeeTotal: LL;
      };
      buy: LL;
      label: {
        amount: LL;
        currency: {
          base: LL;
          quote: LL;
        };
        fee: LL & {
          info: LL;
        };
        lots: LL & {
          info: LL;
          size: LL;
        };
        placeOrder: LL;
        price: LL;
        total: LL;
        volume: LL & {
          info: LL;
        };
      };
      limit: {
        maximum: LL;
        minimum: LL;
      };
      price: PL<{ rate: string; action: string }> & {
        set: LL;
      };
      sell: LL;
    };
    ForExPlaceOrderPanel: {
      error: {
        ticker: PL<{ ticker: string }>;
      };
      tab: {
        buy: PL<{ currency: string }>;
        sell: PL<{ currency: string }>;
      };
      title: PL<{ ticker: string }>;
    };
    ForExPrice: {
      change: PL<{ absolute: string; relative: string }>;
      rate: PL<{ code: string; rate: string }>;
    };
    ForExPriceChart: {
      error: {
        ticker: PL<{ ticker: string }>;
      };
      title: PL<{ ticker: string }>;
    };
    ForExPricePanel: {
      error: {
        ticker: PL<{ ticker: string }>;
      };
      title: PL<{ ticker: string }>;
    };
    ForExPricePanelContent: {
      ask: LL;
      bid: LL;
      exchange: PL<{ baseName: string; baseCode: string; quoteName: string; quoteCode: string }>;
      high: LL;
      low: LL;
      traded: LL;
    };
    ForeignExchange: {
      currencies: {
        base: LL;
        quote: LL;
      };
      title: LL;
    };
    FormCorporationForm: {
      capital: LL;
      code: LL;
      name: LL;
      submit: LL;
    };
    Forms: {
      validation: {
        error: {
          _float: {
            invalid: LL;
          };
          integer: {
            invalid: LL;
          };
          isRequired: LL;
          max: PL<{ max: string }>;
          maxLength: PL<{ max: string }>;
          min: PL<{ min: string }>;
          minLength: PL<{ min: string }>;
          pattern: LL;
          string: {
            invalid: LL;
          };
        };
      };
    };
    Frame: {
      loginRequired: LL & {
        dismiss: LL;
      };
      title: LL;
      toggle: {
        bases: LL & {
          tooltip: LL;
        };
        buffers: LL;
        commands: LL & {
          tooltip: LL;
        };
        commodityexchanges: LL;
        communication: {
          tooltip: LL;
        };
        communications: LL;
        contracts: LL & {
          tooltip: LL;
        };
        corporation: LL & {
          tooltip: LL;
        };
        cx: {
          tooltip: LL;
        };
        financials: LL & {
          tooltip: LL;
        };
        fleet: LL & {
          tooltip: LL;
        };
        footer: {
          tooltip: LL;
        };
        header: {
          tooltip: LL;
        };
        inventories: {
          tooltip: LL;
        };
        inventory: LL;
        leaderboards: LL & {
          tooltip: LL;
        };
        map: LL;
        production: LL & {
          tooltip: LL;
        };
        screens: LL;
        sidebar: LL & {
          tooltip: LL;
        };
        universemap: {
          tooltip: LL;
        };
      };
      unauthenticated: LL;
    };
    FuelConsumption: {
      label: PL<{ amount: number; label: string; percentage: string }>;
      percentage: PL<{ percentage: string }>;
    };
    FuelUnits: {
      ftl: LL;
      stl: LL;
      vortex: LL;
    };
    FullscreenCard: {
      EditMenu: {
        action: {
          _delete: LL;
          move: LL;
        };
        title: LL;
      };
      action: {
        back: LL;
        context: LL;
        next: LL;
        prev: LL;
        stack: LL;
      };
      context: {
        title: LL;
      };
    };
    Gateway: {
      action: {
        traffic: {
          details: LL;
        };
        upkeep: {
          details: LL;
        };
      };
      capacityUpgrades: PL<{ count: string }>;
      distanceUpgrades: PL<{ count: string }>;
      header: {
        capacity: LL;
        general: LL;
        link: LL;
        traffic: LL;
        upgrade: LL;
        upkeep: LL;
      };
      label: {
        capacityUpgrades: LL;
        details: LL;
        distanceUpgrades: LL;
        established: LL;
        id: LL;
        jumpsPerDay: LL;
        linkestablished: LL;
        linkradiusmaximum: LL;
        linkrequests: LL;
        linkstatus: LL;
        location: LL;
        maxShipVolume: LL;
        name: LL;
        operator: LL;
        outgoinglink: LL;
        recentJumps: LL;
        volumeUpgrades: LL;
      };
      linkradius: PL<{ radius: string }>;
      maxShipVolume: PL<{ maxShipVolume: string }>;
      message: {
        inConstruction: PL<{ progress: string }>;
      };
      recentJumps: PL<{ current: string; capacity: string }>;
      upgrade: {
        constractor: LL;
        noupgrade: LL;
        parameter: {
          capacity: PL<{ current: string; target: string }>;
          distance: PL<{ current: string; target: string }>;
          volume: PL<{ current: string; target: string }>;
        };
        progress: LL;
        started: LL;
        store: LL & {
          action: LL;
        };
        upgrades: LL;
      };
      volumeUpgrades: PL<{ count: string }>;
    };
    GatewayFuelComponent: {
      label: {
        address: LL;
        contractor: LL;
        currency: LL;
        currentUpkeepPhase: LL;
        infrastructure: LL;
        initialPeriod: LL;
        payment: LL;
        serviceLevel: LL;
        upkeepPhaseEnd: LL;
        upkeepPhases: LL;
      };
    };
    GatewayInformation: {
      costs: {
        base: LL;
        capacity: LL;
        distance: LL;
        total: LL;
        volume: LL;
      };
      header: {
        buildingCosts: LL;
        parameters: LL;
        specs: LL;
        upkeep: LL;
      };
      label: {
        upkeep: LL;
      };
      specs: {
        capacityUpgrades: LL;
        distanceUpgrades: LL;
        maxFuelStorage: LL;
        maxLinkingRadius: LL;
        maxShipVolume: LL;
        maxUses: LL;
        volumeUpgrades: LL;
      };
      table: {
        distance: LL;
        system: LL;
      };
    };
    GatewayInformationForm: {
      action: {
        calculate: LL;
      };
      label: {
        address: LL;
        currentCapacityUpgrades: LL;
        currentDistanceUpgrades: LL;
        currentVolumeUpgrades: LL;
        established: LL;
        plannedCapacityUpgrades: LL;
        plannedDistanceUpgrades: LL;
        plannedVolumeUpgrades: LL;
        totalUpgrades: LL;
      };
    };
    GatewayInformationPanel: {
      title: LL;
    };
    GatewayLinkComponent: {
      label: {
        destinationAddress: LL;
        destinationGateway: LL;
        destinationRange: LL;
        distance: LL;
        originAddress: LL;
        originGateway: LL;
        originRange: LL;
      };
    };
    GatewayLinkRange: {
      insufficient: LL;
      range: PL<{ distance: string; sufficient: string }>;
      sufficient: LL;
    };
    GatewayPanel: {
      context: {
        gatewayInformation: LL;
      };
      error: {
        noGateway: LL;
      };
      title: {
        gateway: LL;
        gateways: LL;
      };
    };
    GatewayParametersInput: {
      parameterSum: PL<{ sum: string }>;
      select: {
        capacity: {
          label: LL;
        };
        distance: {
          label: LL;
        };
        volume: {
          label: LL;
        };
      };
      totalUpgrades: {
        label: LL;
      };
    };
    GatewayPricingComponent: {
      label: {
        address: LL;
        amount: LL;
        currency: LL;
        infrastructure: LL;
        usageFee: LL;
      };
    };
    GatewayTraffic: {
      fuelAvailable: PL<{ current: string; total: string }>;
      header: {
        capacity: LL;
        contractors: LL;
        fuel: LL;
        general: LL;
        traffic: LL;
      };
      label: {
        fuelAvailability: LL & {
          info: LL;
        };
        fuelAvailable: LL;
        fuelPerJump: LL;
      };
      usageFee: {
        location: LL;
      };
    };
    GatewayTrafficPanel: {
      context: {
        gateway: LL;
      };
      title: {
        gateways: LL;
      };
    };
    GatewayUnlinkComponent: {
      label: {
        address: LL;
        destination: LL;
        gateway: LL;
      };
    };
    Gateways: {
      table: {
        action: {
          view: LL;
        };
        address: LL;
        established: LL;
        link: LL;
        name: LL;
        operator: LL;
      };
    };
    Government: {
      error: {
        noAdminCenter: LL;
      };
      header: {
        government: LL;
        motions: LL;
        votes: LL;
      };
      table: {
        motions: {
          description: LL;
          motionId: LL;
          status: LL;
        };
        votes: {
          corporation: LL;
          country: LL;
          user: LL;
          votes: LL;
        };
      };
      term: {
        end: LL;
        governor: LL;
        membersOfParliament: LL;
        parliament: LL;
        start: LL;
      };
      votes: {
        total: LL;
        votes: PL<{ votes: string; percentage: string }>;
      };
    };
    GovernmentContainer: {
      error: {
        noTerm: LL;
      };
      terms: {
        current: LL;
        termCurrent: PL<{ naturalId: string }>;
        termPrevious: PL<{ naturalId: string }>;
      };
    };
    GovernmentPanel: {
      error: {
        id: PL<{ input: string }>;
      };
      title: LL & {
        withPlanet: PL<{ planet: string }>;
      };
    };
    GroupChannelMembershipPanel: {
      title: LL;
    };
    Head: {
      item: {
        audio: LL;
        menu: PL<{ username: string }>;
      };
    };
    HeaderDropdown: {
      action: {
        audio: PL<{ icon: string }>;
        help: PL<{ icon: string }>;
        login: PL<{ icon: string }> & {
          alt: LL;
        };
        logout: PL<{ icon: string }> & {
          alt: LL;
        };
      };
    };
    Help: {
      disabled: LL;
      enabled: LL;
      settings: {
        contexthelp: LL;
        help: LL;
      };
      text: {
        trading: LL;
        welcome: LL;
        welcome2: LL;
      };
    };
    HelpHeadItem: {
      help: PL<{ progress: string }>;
      helpProgress: PL<{ fulfilled: string; total: string }>;
      loading: LL;
    };
    HelpPanel: {
      title: LL;
    };
    Hints: {
      comex: {
        comexfaraway: LL;
      };
      currency: {
        nomatch: LL;
      };
      fertility: {
        carbonfarmer: LL;
        victualler: LL;
      };
      plots: {
        low: LL;
        none: LL;
      };
    };
    Impersonation: {
      action: {
        stop: LL;
      };
      text: LL;
    };
    InGameNotificationConfigPanel: {
      table: {
        enabled: LL;
        type: LL;
      };
      title: LL;
    };
    IncomeStatementPanel: LL & {
      change: LL;
      expenses: LL;
      period: {
        current: LL;
        last: LL;
        previous: LL;
      };
      result: LL;
      revenues: LL;
      title: LL;
      total: LL;
    };
    IncrementalNumberInput: {
      action: {
        dec: LL;
        inc: LL;
      };
    };
    InfrastructureContractors: {
      table: {
        contractors: LL & {
          value: PL<{ contractor: string; contract: string }>;
        };
        phase: LL;
      };
    };
    InfrastructureLink: {
      gateways: PL<{ gatewayAmount: string }>;
    };
    InfrastructureNameComponent: {
      label: {
        infrastructure: LL;
        location: LL;
        name: LL;
      };
    };
    InfrastructureOperationalState: {
      OPERATIONAL: LL;
      UNDER_CONSTRUCTION: LL;
      UPKEEP_MISSING: LL;
    };
    InfrastructurePanel: {
      context: {
        fleet: LL;
        inventory: LL;
        systemInfo: LL;
        systemMap: LL;
      };
      error: {
        systemId: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
        notfound: LL;
      };
    };
    InfrastructureType: {
      GATEWAY: LL;
    };
    InfrastructureUpkeep: {
      header: {
        contractors: LL;
        infrastructure: LL;
        upkeep: LL;
      };
      label: {
        currentUpkeepPhase: LL;
        infrastructure: LL;
        name: LL;
        next: LL;
        status: LL;
        type: LL;
        upkeep: LL;
        uptime: LL;
        uptimeAverage: LL & {
          info: LL;
        };
      };
    };
    InfrastructureUpkeepPanel: {
      error: {
        notfound: LL;
      };
      title: LL;
    };
    InputsOutputsView: {
      inputs: LL;
      material: {
        amount: PL<{ amount: string }>;
        available: PL<{ amount: number }>;
        missing: PL<{ amount: number }>;
      };
      outputs: LL;
    };
    InvalidCardPanel: {
      info: LL;
      title: LL;
    };
    InvalidCommandPanel: {
      info: LL;
      title: LL;
    };
    InvalidStack: {
      action: {
        back: LL;
        stacks: LL;
      };
      info: LL;
    };
    InventoriesPanel: {
      context: {
        infrastructure: LL;
        unpack: LL;
      };
      noInventoryFound: LL;
      table: {
        address: LL;
        name: LL;
        owner: LL;
        type: LL;
        view: LL;
        volume: LL;
        weight: LL;
      };
      title: LL & {
        inventory: PL<{ type: string }>;
      };
    };
    Inventory: {
      capacity: PL<{ load: string; capacity: string }>;
      capacityVolume: PL<{ load: string; capacity: string }>;
      capacityWeight: PL<{ load: string; capacity: string }>;
    };
    LanguageSelector: {
      header: {
        community: LL & {
          info: LL;
        };
        official: LL;
      };
    };
    LastActivity: {
      active: {
        now: LL;
        past: PL<{ date: string }>;
        recently: PL<{ timeAgo: string }>;
      };
      muted: {
        now: LL;
        past: PL<{ date: string }>;
        recently: PL<{ timeAgo: string }>;
      };
    };
    Leaderboard: {
      status: {
        loading: LL;
      };
    };
    LeaderboardController: {
      action: {
        own: LL;
        top: LL;
      };
      label: {
        material: LL;
        range: LL;
        type: LL;
      };
    };
    Leaderboards: {
      table: {
        company: LL;
        coporation: LL;
        noData: LL;
        rank: LL;
        score: LL;
        user: LL;
      };
      title: LL;
    };
    LicenseGifting: {
      header: {
        gift: LL;
        received: LL;
        sent: LL;
      };
      label: {
        received: LL;
        sent: LL;
      };
      table: {
        gift: LL;
        time: LL;
        type: LL;
        user: LL;
      };
      value: {
        gift: PL<{ days: string }>;
      };
    };
    LicenseGiftingForm: {
      action: {
        gift: LL;
      };
      label: {
        days: LL;
        note: LL;
        recipient: LL;
      };
      note: LL;
    };
    LicenseGiftingPanel: {
      action: {
        confirmation: PL<{ user: string; days: string }>;
        gift: LL;
      };
      context: {
        license: LL;
      };
      title: LL;
    };
    LicenseHeadItem: {
      expiry2d: PL<{ countdown: string }>;
      expiry7d: PL<{ countdown: string }>;
      level: PL<{ level: string }> & {
        tooltip: LL;
      };
    };
    LicenseMobileHeader: {
      level: PL<{ level: string }>;
    };
    LinkStatus: {
      ESTABLISHED: LL;
      INCOMPLETE: LL;
      UNLINKED: LL;
    };
    LiquidAssetsPanel: {
      table: {
        amount: LL;
        currency: LL;
      };
      title: LL;
    };
    ListItemView: {
      units: PL<{ units: string }>;
      weightVolume: PL<{ weight: string; volume: string }>;
    };
    Loading: {
      loading: LL;
    };
    LoadingState: {
      standby: LL;
      welcome: LL;
    };
    LocalMarket: {
      adType: {
        buying: LL;
        selling: LL;
        shipping: LL;
      };
      button: {
        post: LL;
      };
      context: {
        ads: LL;
        blacklist: LL;
        market: LL;
        planet: LL;
        post: LL;
      };
      error: {
        adtype: LL;
        id: LL;
        nomarket: LL;
      };
      header: {
        ads: LL;
      };
      label: {
        market: {
          address: LL;
          currency: LL;
          fees: LL & {
            info: LL;
          };
          operator: LL;
        };
      };
      market: {
        fees: PL<{ base: string; timeFactor: string }>;
      };
      name: PL<{ name: string }>;
      title: PL<{ name: string }> & {
        loading: LL;
      };
    };
    LocalMarketAd: {
      banner: {
        contract: LL;
      };
      button: {
        contract: LL;
      };
      error: {
        ads: LL;
        id: LL;
        nomarket: LL;
      };
      form: {
        accept: LL;
        ad: LL;
        address: PL<{ address: string }>;
        creator: LL;
        expired: LL;
        expiry: LL;
        location: LL;
        requiredRating: LL;
        status: LL;
        ticker: LL;
        type: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
      };
    };
    LocalMarketAds: {
      command: {
        _delete: LL;
      };
      deleteFulfilled: LL;
      error: {
        invalidAdType: LL;
      };
      header: {
        accepted: LL;
        own: LL;
      };
      table: {
        header: {
          ad: LL;
          commands: LL;
          contract: LL;
          market: LL;
          partner: LL;
          status: LL;
        };
      };
      title: {
        loading: LL;
      };
    };
    LocalMarketAdsPanel: {
      action: {
        _delete: LL & {
          description: LL;
        };
      };
    };
    LocalMarketPost: {
      error: {
        nobase: LL;
        nomarket: LL;
      };
      form: {
        amount: LL;
        autoProvision: LL;
        collectiontime: LL;
        commodity: LL;
        currency: LL;
        deliverytime: LL;
        destination: LL;
        fees: LL;
        minimumrating: LL;
        origin: LL;
        postBuyingAd: LL;
        postSellingAd: LL;
        postShippingAd: LL;
        price: LL;
        pricePerUnit: LL;
        type: LL;
        visibility: LL;
      };
      info: {
        provisioningStore: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
      };
    };
    LocalMarketPostContainer: {
      error: {
        localMarketId: LL;
      };
    };
    LocalMarkets: {
      header: {
        planets: LL;
        stations: LL;
      };
      planet: {
        infrastructure: LL;
        location: LL;
      };
      station: {
        infrastructure: LL;
        location: LL;
      };
    };
    LocalRules: {
      establishment: {
        fee: LL;
      };
      governance: {
        affinity: LL;
        collector: LL;
        currency: LL;
        location: LL;
      };
      infrastructure: {
        active: LL;
        built: LL;
        contribution: LL;
        current: LL;
        name: LL;
      };
      localmarket: {
        base: LL;
        timeFactor: LL & {
          info: LL;
        };
      };
      population: {
        reserve: LL & {
          info: LL;
        };
        reserveDefault: LL;
      };
      production: {
        engineer: LL;
        industry: LL;
        pioneer: LL;
        scientist: LL;
        settler: LL;
        technician: LL;
      };
      section: {
        establishmentfees: LL;
        infrastructure: LL;
        localmarketfees: LL;
        needFulfillment: LL;
        population: LL;
        productionfees: LL & {
          info: LL;
        };
        warehousefees: LL;
      };
      tab: {
        fees: LL;
        population: LL;
        programs: LL;
      };
      warehouse: {
        fee: LL;
      };
    };
    LocalRulesFeeForm: {
      action: {
        setProductionFee: LL;
      };
    };
    LocalRulesPanel: {
      context: {
        planet: LL;
      };
      error: {
        id: PL<{ input: string }>;
      };
      title: PL<{ name: string }> & {
        loading: LL;
      };
    };
    LocalRulesPopulation: {
      label: {
        active: {
          info: LL;
        };
      };
    };
    LocalRulesPrograms: {
      error: {
        noAdminCenter: LL;
      };
      label: {
        category: LL;
        costs: LL;
        description: LL;
        ended: LL;
        endsIn: LL;
        number: LL;
        program: LL;
        start: LL;
      };
      section: {
        active: LL;
        past: LL;
        upcoming: LL;
      };
    };
    Logo: {
      title: PL<{ logo: string }> & {
        alt: LL;
      };
    };
    Maintenance: {
      text1: LL;
      text2: LL;
      title: LL;
    };
    Material: {
      advancedBulkhead: {
        description: LL;
        name: LL;
      };
      advancedDeckElements: {
        description: LL;
        name: LL;
      };
      advancedEngine: {
        description: LL;
        name: LL;
      };
      advancedFuelPump: {
        description: LL;
        name: LL;
      };
      advancedFuelRod: {
        description: LL;
        name: LL;
      };
      advancedHeatShield: {
        description: LL;
        name: LL;
      };
      advancedHighgSeats: {
        description: LL;
        name: LL;
      };
      advancedHullPlate: {
        description: LL;
        name: LL;
      };
      advancedNozzle: {
        description: LL;
        name: LL;
      };
      advancedRadiationShielding: {
        description: LL;
        name: LL;
      };
      advancedStructuralElements: {
        description: LL;
        name: LL;
      };
      advancedThermalProtectionMaterial: {
        description: LL;
        name: LL;
      };
      advancedWhippleShielding: {
        description: LL;
        name: LL;
      };
      advancedWindow: {
        description: LL;
        name: LL;
      };
      aerostatFoundation: {
        description: LL;
        name: LL;
      };
      airScrubber: {
        description: LL;
        name: LL;
      };
      allPurposeFodder: {
        description: LL;
        name: LL;
      };
      aluminium: {
        description: LL;
        name: LL;
      };
      aluminiumIronAlloy: {
        description: LL;
        name: LL;
      };
      aluminiumOre: {
        description: LL;
        name: LL;
      };
      aluminiumTitaniumAlloy: {
        description: LL;
        name: LL;
      };
      alurhenium: {
        description: LL;
        name: LL;
      };
      ammonia: {
        description: LL;
        name: LL;
      };
      antennaArray: {
        description: LL;
        name: LL;
      };
      antibacterialTreeFlowers: {
        description: LL;
        name: LL;
      };
      argon: {
        description: LL;
        name: LL;
      };
      artificialSoil: {
        description: LL;
        name: LL;
      };
      audioDistributionSystem: {
        description: LL;
        name: LL;
      };
      audioTransmitter: {
        description: LL;
        name: LL;
      };
      autoDoc: {
        description: LL;
        name: LL;
      };
      automatedCoolingSystem: {
        description: LL;
        name: LL;
      };
      bacteria: {
        description: LL;
        name: LL;
      };
      bandages: {
        description: LL;
        name: LL;
      };
      basicAiFramework: {
        description: LL;
        name: LL;
      };
      basicBulkhead: {
        description: LL;
        name: LL;
      };
      basicDeckElements: {
        description: LL;
        name: LL;
      };
      basicFuelPump: {
        description: LL;
        name: LL;
      };
      basicFuelRod: {
        description: LL;
        name: LL;
      };
      basicHeatShield: {
        description: LL;
        name: LL;
      };
      basicHighgSeats: {
        description: LL;
        name: LL;
      };
      basicHullPlate: {
        description: LL;
        name: LL;
      };
      basicNozzle: {
        description: LL;
        name: LL;
      };
      basicRadiationShielding: {
        description: LL;
        name: LL;
      };
      basicStructuralElements: {
        description: LL;
        name: LL;
      };
      basicThermalProtectionMaterial: {
        description: LL;
        name: LL;
      };
      basicWhippleShielding: {
        description: LL;
        name: LL;
      };
      basicWindow: {
        description: LL;
        name: LL;
      };
      beryl: {
        description: LL;
        name: LL;
      };
      beryllium: {
        description: LL;
        name: LL;
      };
      bioreactiveMineral: {
        description: LL;
        name: LL;
      };
      biosphereUnit: {
        description: LL;
        name: LL;
      };
      bleach: {
        description: LL;
        name: LL;
      };
      blueGoldConnectors: {
        description: LL;
        name: LL;
      };
      bodyScanner: {
        description: LL;
        name: LL;
      };
      boronCrystals: {
        description: LL;
        name: LL;
      };
      borosilicate: {
        description: LL;
        name: LL;
      };
      breathableLiquid: {
        description: LL;
        name: LL;
      };
      caffeinatedBeans: {
        description: LL;
        name: LL;
      };
      calcium: {
        description: LL;
        name: LL;
      };
      caliche: {
        description: LL;
        name: LL;
      };
      capacitor: {
        description: LL;
        name: LL;
      };
      carbohydrateGrains: {
        description: LL;
        name: LL;
      };
      carbohydrateMaize: {
        description: LL;
        name: LL;
      };
      carbon: {
        description: LL;
        name: LL;
      };
      ceramicFabric: {
        description: LL;
        name: LL;
      };
      ceramicTungstenFabric: {
        description: LL;
        name: LL;
      };
      chemicalReagents: {
        description: LL;
        name: LL;
      };
      chlorine: {
        description: LL;
        name: LL;
      };
      climateController: {
        description: LL;
        name: LL;
      };
      combustionChamber: {
        description: LL;
        name: LL;
      };
      commandBridge1: {
        description: LL;
        name: LL;
      };
      commandBridge2: {
        description: LL;
        name: LL;
      };
      commandBridgeShort: {
        description: LL;
        name: LL;
      };
      communicationSystem: {
        description: LL;
        name: LL;
      };
      coolingFan: {
        description: LL;
        name: LL;
      };
      copper: {
        description: LL;
        name: LL;
      };
      copperAluminiumAlloy: {
        description: LL;
        name: LL;
      };
      copperConnectors: {
        description: LL;
        name: LL;
      };
      copperOre: {
        description: LL;
        name: LL;
      };
      coreModuleKit: {
        description: LL;
        name: LL;
      };
      cottonProcessed: {
        description: LL;
        name: LL;
      };
      cottonRaw: {
        description: LL;
        name: LL;
      };
      crewQuarters: {
        description: LL;
        name: LL;
      };
      crewQuartersMed: {
        description: LL;
        name: LL;
      };
      crewQuartersSmall: {
        description: LL;
        name: LL;
      };
      crewQuartersTiny: {
        description: LL;
        name: LL;
      };
      crowdControlDrone: {
        description: LL;
        name: LL;
      };
      cryoUnit: {
        description: LL;
        name: LL;
      };
      cryogenicFluid: {
        description: LL;
        name: LL;
      };
      cryopreservationUnit: {
        description: LL;
        name: LL;
      };
      dataAnalyzer: {
        description: LL;
        name: LL;
      };
      dataVisualizer: {
        description: LL;
        name: LL;
      };
      decorativeElements: {
        description: LL;
        name: LL;
      };
      distributedDatabase: {
        description: LL;
        name: LL;
      };
      drinkingWater: {
        description: LL;
        name: LL;
      };
      droneChassis: {
        description: LL;
        name: LL;
      };
      droneFrame: {
        description: LL;
        name: LL;
      };
      droneOperationsUnit: {
        description: LL;
        name: LL;
      };
      einsteinium: {
        description: LL;
        name: LL;
      };
      engineerBundle: {
        description: LL;
        name: LL;
      };
      engineerClothing: {
        description: LL;
        name: LL;
      };
      engineerFood: {
        description: LL;
        name: LL;
      };
      engineerLuxuryDrink: {
        description: LL;
        name: LL;
      };
      engineerLuxuryHealth: {
        description: LL;
        name: LL;
      };
      engineerTools: {
        description: LL;
        name: LL;
      };
      enrichedEinsteinium: {
        description: LL;
        name: LL;
      };
      enrichedTechnetium: {
        description: LL;
        name: LL;
      };
      entertainmentDataCore: {
        description: LL;
        name: LL;
      };
      entertainmentUnit: {
        description: LL;
        name: LL;
      };
      epoxy: {
        description: LL;
        name: LL;
      };
      fastenerKitMedium: {
        description: LL;
        name: LL;
      };
      fastenerKitSmall: {
        description: LL;
        name: LL;
      };
      fattyNuts: {
        description: LL;
        name: LL;
      };
      fattyVegetables: {
        description: LL;
        name: LL;
      };
      fissionReactor: {
        description: LL;
        name: LL;
      };
      floatingTank: {
        description: LL;
        name: LL;
      };
      flowControl: {
        description: LL;
        name: LL;
      };
      fluidPiping: {
        description: LL;
        name: LL;
      };
      fluorine: {
        description: LL;
        name: LL;
      };
      flux: {
        description: LL;
        name: LL;
      };
      ftlFieldController: {
        description: LL;
        name: LL;
      };
      ftlFuel: {
        description: LL;
        name: LL;
      };
      fuelSavingEngine: {
        description: LL;
        name: LL;
      };
      fullBodyInteractionDevice: {
        description: LL;
        name: LL;
      };
      galerite: {
        description: LL;
        name: LL;
      };
      gasContainer: {
        description: LL;
        name: LL;
      };
      gasVent: {
        description: LL;
        name: LL;
      };
      gatewaySegment: {
        description: LL;
        name: LL;
      };
      glassCombustionChamber: {
        description: LL;
        name: LL;
      };
      glassEngine: {
        description: LL;
        name: LL;
      };
      glassNozzle: {
        description: LL;
        name: LL;
      };
      gold: {
        description: LL;
        name: LL;
      };
      goldCopperAlloy: {
        description: LL;
        name: LL;
      };
      goldIronAlloy: {
        description: LL;
        name: LL;
      };
      goldOre: {
        description: LL;
        name: LL;
      };
      grapes: {
        description: LL;
        name: LL;
      };
      habitatUnit: {
        description: LL;
        name: LL;
      };
      habitationModule: {
        description: LL;
        name: LL;
      };
      halite: {
        description: LL;
        name: LL;
      };
      handcraftWorkshopUnit: {
        description: LL;
        name: LL;
      };
      hardenedHullPlate: {
        description: LL;
        name: LL;
      };
      hardenedStructuralElements: {
        description: LL;
        name: LL;
      };
      heliotropeExtract: {
        description: LL;
        name: LL;
      };
      helium: {
        description: LL;
        name: LL;
      };
      helium3: {
        description: LL;
        name: LL;
      };
      herbs: {
        description: LL;
        name: LL;
      };
      highLoadCargoBay: {
        description: LL;
        name: LL;
      };
      highPowerReactor: {
        description: LL;
        name: LL;
      };
      highVolumeCargoBay: {
        description: LL;
        name: LL;
      };
      holographicDisplay: {
        description: LL;
        name: LL;
      };
      holographicGlasses: {
        description: LL;
        name: LL;
      };
      hugeCargoBay: {
        description: LL;
        name: LL;
      };
      hydrocarbonPlants: {
        description: LL;
        name: LL;
      };
      hydrogen: {
        description: LL;
        name: LL;
      };
      hyperPowerReactor: {
        description: LL;
        name: LL;
      };
      hyperthrustEngine: {
        description: LL;
        name: LL;
      };
      hyperthrustNozzle: {
        description: LL;
        name: LL;
      };
      indigo: {
        description: LL;
        name: LL;
      };
      informationDataCore: {
        description: LL;
        name: LL;
      };
      informationManagementSystem: {
        description: LL;
        name: LL;
      };
      insuFoam: {
        description: LL;
        name: LL;
      };
      iodine: {
        description: LL;
        name: LL;
      };
      iron: {
        description: LL;
        name: LL;
      };
      ironOre: {
        description: LL;
        name: LL;
      };
      ironTitaniumAlloy: {
        description: LL;
        name: LL;
      };
      kevlar: {
        description: LL;
        name: LL;
      };
      krypton: {
        description: LL;
        name: LL;
      };
      kryptonium: {
        description: LL;
        name: LL;
      };
      laboratoryUnit: {
        description: LL;
        name: LL;
      };
      largeCapacitorBank: {
        description: LL;
        name: LL;
      };
      largeCargoBay: {
        description: LL;
        name: LL;
      };
      largeDeviceCover: {
        description: LL;
        name: LL;
      };
      largeEmitter: {
        description: LL;
        name: LL;
      };
      largeFtlTank: {
        description: LL;
        name: LL;
      };
      largePlasticsBoard: {
        description: LL;
        name: LL;
      };
      largeShipRepairDroneUnit: {
        description: LL;
        name: LL;
      };
      largeStlTank: {
        description: LL;
        name: LL;
      };
      laserDiode: {
        description: LL;
        name: LL;
      };
      lifeSupportSystem: {
        description: LL;
        name: LL;
      };
      lightweightBulkhead: {
        description: LL;
        name: LL;
      };
      lightweightDeckElements: {
        description: LL;
        name: LL;
      };
      lightweightHullPlate: {
        description: LL;
        name: LL;
      };
      lightweightStructuralElements: {
        description: LL;
        name: LL;
      };
      lightweightWindow: {
        description: LL;
        name: LL;
      };
      limestone: {
        description: LL;
        name: LL;
      };
      liquidCrystals: {
        description: LL;
        name: LL;
      };
      liquidEinsteinium: {
        description: LL;
        name: LL;
      };
      lithium: {
        description: LL;
        name: LL;
      };
      lithiumOre: {
        description: LL;
        name: LL;
      };
      localDatabase: {
        description: LL;
        name: LL;
      };
      logisticsSystem: {
        description: LL;
        name: LL;
      };
      lowHeatFuelPump: {
        description: LL;
        name: LL;
      };
      machineLearningInterface: {
        description: LL;
        name: LL;
      };
      magnesite: {
        description: LL;
        name: LL;
      };
      magnesium: {
        description: LL;
        name: LL;
      };
      magneticFloor: {
        description: LL;
        name: LL;
      };
      magnetite: {
        description: LL;
        name: LL;
      };
      mainFrameBlank: {
        description: LL;
        name: LL;
      };
      meat: {
        description: LL;
        name: LL;
      };
      medicalStretcher: {
        description: LL;
        name: LL;
      };
      mediumCapacitorBank: {
        description: LL;
        name: LL;
      };
      mediumCargoBay: {
        description: LL;
        name: LL;
      };
      mediumDeviceCover: {
        description: LL;
        name: LL;
      };
      mediumEmitter: {
        description: LL;
        name: LL;
      };
      mediumFtlTank: {
        description: LL;
        name: LL;
      };
      mediumPlasticsBoard: {
        description: LL;
        name: LL;
      };
      mediumStlTank: {
        description: LL;
        name: LL;
      };
      megaTubeCoating: {
        description: LL;
        name: LL;
      };
      memoryBank: {
        description: LL;
        name: LL;
      };
      metalHalideLamp: {
        description: LL;
        name: LL;
      };
      microHeadphones: {
        description: LL;
        name: LL;
      };
      microProcessor: {
        description: LL;
        name: LL;
      };
      mineralConstructionGranulate: {
        description: LL;
        name: LL;
      };
      motherBoard: {
        description: LL;
        name: LL;
      };
      mushrooms: {
        description: LL;
        name: LL;
      };
      nanoCarbonSheeting: {
        description: LL;
        name: LL;
      };
      nanoFiber: {
        description: LL;
        name: LL;
      };
      nanoGlass: {
        description: LL;
        name: LL;
      };
      nanoResin: {
        description: LL;
        name: LL;
      };
      navigation1: {
        description: LL;
        name: LL;
      };
      navigation2: {
        description: LL;
        name: LL;
      };
      neon: {
        description: LL;
        name: LL;
      };
      neonLightingSystem: {
        description: LL;
        name: LL;
      };
      networkingFramework: {
        description: LL;
        name: LL;
      };
      neuralNetwork: {
        description: LL;
        name: LL;
      };
      nitrogen: {
        description: LL;
        name: LL;
      };
      nonVolatileMemory: {
        description: LL;
        name: LL;
      };
      nutrientSolution: {
        description: LL;
        name: LL;
      };
      nylon: {
        description: LL;
        name: LL;
      };
      officeSupplies: {
        description: LL;
        name: LL;
      };
      olfactorySubstances: {
        description: LL;
        name: LL;
      };
      operatingSystem: {
        description: LL;
        name: LL;
      };
      oxygen: {
        description: LL;
        name: LL;
      };
      painkillers: {
        description: LL;
        name: LL;
      };
      pesticides: {
        description: LL;
        name: LL;
      };
      pineberries: {
        description: LL;
        name: LL;
      };
      pioneerBundle: {
        description: LL;
        name: LL;
      };
      pioneerClothing: {
        description: LL;
        name: LL;
      };
      pioneerLuxuryClothing: {
        description: LL;
        name: LL;
      };
      pioneerLuxuryDrink: {
        description: LL;
        name: LL;
      };
      polarityFieldGenerator: {
        description: LL;
        name: LL;
      };
      polyEthylene: {
        description: LL;
        name: LL;
      };
      polymerGranulate: {
        description: LL;
        name: LL;
      };
      powerCell: {
        description: LL;
        name: LL;
      };
      premiumFertilizer: {
        description: LL;
        name: LL;
      };
      pressureShielding: {
        description: LL;
        name: LL;
      };
      printedCircuitBoard: {
        description: LL;
        name: LL;
      };
      proteinAlgae: {
        description: LL;
        name: LL;
      };
      proteinBeans: {
        description: LL;
        name: LL;
      };
      proteinPaste: {
        description: LL;
        name: LL;
      };
      quickChargeReactor: {
        description: LL;
        name: LL;
      };
      radiationShielding: {
        description: LL;
        name: LL;
      };
      radioDevice: {
        description: LL;
        name: LL;
      };
      radioisotopeGenerator: {
        description: LL;
        name: LL;
      };
      rations: {
        description: LL;
        name: LL;
      };
      reactorControlSystem: {
        description: LL;
        name: LL;
      };
      redGoldConnectors: {
        description: LL;
        name: LL;
      };
      reinforcedBulkhead: {
        description: LL;
        name: LL;
      };
      reinforcedDeckElements: {
        description: LL;
        name: LL;
      };
      reinforcedHullPlate: {
        description: LL;
        name: LL;
      };
      reinforcedStructuralElements: {
        description: LL;
        name: LL;
      };
      reinforcedTranslucentMaterial: {
        description: LL;
        name: LL;
      };
      reinforcedWindow: {
        description: LL;
        name: LL;
      };
      rescueDrone: {
        description: LL;
        name: LL;
      };
      rhenium: {
        description: LL;
        name: LL;
      };
      rheniumOre: {
        description: LL;
        name: LL;
      };
      safetyUniform: {
        description: LL;
        name: LL;
      };
      scientistBundle: {
        description: LL;
        name: LL;
      };
      scientistClothing: {
        description: LL;
        name: LL;
      };
      scientistFood: {
        description: LL;
        name: LL;
      };
      scientistLuxuryDrink: {
        description: LL;
        name: LL;
      };
      scientistLuxuryHealth: {
        description: LL;
        name: LL;
      };
      scientistTools: {
        description: LL;
        name: LL;
      };
      sealant: {
        description: LL;
        name: LL;
      };
      searchAlgorithm: {
        description: LL;
        name: LL;
      };
      sedativeSubstance: {
        description: LL;
        name: LL;
      };
      sensor: {
        description: LL;
        name: LL;
      };
      sensorArray: {
        description: LL;
        name: LL;
      };
      settlerBundle: {
        description: LL;
        name: LL;
      };
      settlerClothing: {
        description: LL;
        name: LL;
      };
      settlerLuxuryDrink: {
        description: LL;
        name: LL;
      };
      settlerLuxuryTools: {
        description: LL;
        name: LL;
      };
      settlerTools: {
        description: LL;
        name: LL;
      };
      shipRepairDrone: {
        description: LL;
        name: LL;
      };
      shockwaveDampeningModule: {
        description: LL;
        name: LL;
      };
      silicon: {
        description: LL;
        name: LL;
      };
      siliconOre: {
        description: LL;
        name: LL;
      };
      silkProcessed: {
        description: LL;
        name: LL;
      };
      silkRaw: {
        description: LL;
        name: LL;
      };
      singularityStabilizer: {
        description: LL;
        name: LL;
      };
      smallCapacitorBank: {
        description: LL;
        name: LL;
      };
      smallCargoBay: {
        description: LL;
        name: LL;
      };
      smallDeviceCover: {
        description: LL;
        name: LL;
      };
      smallEmitter: {
        description: LL;
        name: LL;
      };
      smallFtlTank: {
        description: LL;
        name: LL;
      };
      smallPlasticsBoard: {
        description: LL;
        name: LL;
      };
      smallShipRepairDroneUnit: {
        description: LL;
        name: LL;
      };
      smallStlTank: {
        description: LL;
        name: LL;
      };
      sodium: {
        description: LL;
        name: LL;
      };
      sodiumBorohydride: {
        description: LL;
        name: LL;
      };
      solarCell: {
        description: LL;
        name: LL;
      };
      solarPanel: {
        description: LL;
        name: LL;
      };
      sortingAlgorithm: {
        description: LL;
        name: LL;
      };
      spaceTether: {
        description: LL;
        name: LL;
      };
      specializedRadiationShielding: {
        description: LL;
        name: LL;
      };
      stabilitySupportSystem: {
        description: LL;
        name: LL;
      };
      standardEngine: {
        description: LL;
        name: LL;
      };
      standardReactor: {
        description: LL;
        name: LL;
      };
      steel: {
        description: LL;
        name: LL;
      };
      stlFuel: {
        description: LL;
        name: LL;
      };
      structuralSpacecraftComponent: {
        description: LL;
        name: LL;
      };
      sulfur: {
        description: LL;
        name: LL;
      };
      sulfurCrystals: {
        description: LL;
        name: LL;
      };
      surgeryUnit: {
        description: LL;
        name: LL;
      };
      surgicalDrone: {
        description: LL;
        name: LL;
      };
      surgicalEquipment: {
        description: LL;
        name: LL;
      };
      surveillanceDrone: {
        description: LL;
        name: LL;
      };
      tantalite: {
        description: LL;
        name: LL;
      };
      tantalum: {
        description: LL;
        name: LL;
      };
      targetingComputer: {
        description: LL;
        name: LL;
      };
      tclAcid: {
        description: LL;
        name: LL;
      };
      technetium: {
        description: LL;
        name: LL;
      };
      technetiumOxide: {
        description: LL;
        name: LL;
      };
      technetiumStabilizers: {
        description: LL;
        name: LL;
      };
      technicianBundle: {
        description: LL;
        name: LL;
      };
      technicianClothing: {
        description: LL;
        name: LL;
      };
      technicianHealth: {
        description: LL;
        name: LL;
      };
      technicianLuxuryDrink: {
        description: LL;
        name: LL;
      };
      technicianLuxuryHealth: {
        description: LL;
        name: LL;
      };
      technicianTools: {
        description: LL;
        name: LL;
      };
      technoKevlar: {
        description: LL;
        name: LL;
      };
      tectosilisite: {
        description: LL;
        name: LL;
      };
      tensionReliefStructure: {
        description: LL;
        name: LL;
      };
      tensorProcessingUnit: {
        description: LL;
        name: LL;
      };
      testTubes: {
        description: LL;
        name: LL;
      };
      thermalShielding: {
        description: LL;
        name: LL;
      };
      thermoFluid: {
        description: LL;
        name: LL;
      };
      tinyCargoBay: {
        description: LL;
        name: LL;
      };
      titanium: {
        description: LL;
        name: LL;
      };
      titaniumOre: {
        description: LL;
        name: LL;
      };
      torusSegment: {
        description: LL;
        name: LL;
      };
      touchDeviceBlank: {
        description: LL;
        name: LL;
      };
      touchScreen: {
        description: LL;
        name: LL;
      };
      transistor: {
        description: LL;
        name: LL;
      };
      translucentMaterial: {
        description: LL;
        name: LL;
      };
      traumaCareUnit: {
        description: LL;
        name: LL;
      };
      truss: {
        description: LL;
        name: LL;
      };
      tungstenAluminiumAlloy: {
        description: LL;
        name: LL;
      };
      tungstenResource: {
        description: LL;
        name: LL;
      };
      twoDimensionalDisplay: {
        description: LL;
        name: LL;
      };
      universalToolset: {
        description: LL;
        name: LL;
      };
      universeMap: {
        description: LL;
        name: LL;
      };
      verySmallCargoBay: {
        description: LL;
        name: LL;
      };
      vitaEssence: {
        description: LL;
        name: LL;
      };
      vortexEngine: {
        description: LL;
        name: LL;
      };
      vortexFuelTank: {
        description: LL;
        name: LL;
      };
      vortexReactor: {
        description: LL;
        name: LL;
      };
      vortexStimulationFuel: {
        description: LL;
        name: LL;
      };
      waferMedium: {
        description: LL;
        name: LL;
      };
      waferSmall: {
        description: LL;
        name: LL;
      };
      water: {
        description: LL;
        name: LL;
      };
      waterFilter: {
        description: LL;
        name: LL;
      };
      waterRecycler: {
        description: LL;
        name: LL;
      };
      weakArtificalIntelligence: {
        description: LL;
        name: LL;
      };
      windowManager: {
        description: LL;
        name: LL;
      };
      wolfram: {
        description: LL;
        name: LL;
      };
      wolfrhenium: {
        description: LL;
        name: LL;
      };
      workstationBlank: {
        description: LL;
        name: LL;
      };
      zircon: {
        description: LL;
        name: LL;
      };
      zirconium: {
        description: LL;
        name: LL;
      };
    };
    MaterialAssignment: {
      action: {
        assign: LL;
      };
      label: {
        storage: LL;
      };
      table: {
        assignment: LL;
        inventory: LL;
        status: LL;
      };
    };
    MaterialCategory: {
      agriculturalproducts: LL;
      alloys: LL;
      chemicals: LL;
      constructionmaterials: LL;
      constructionparts: LL;
      constructionprefabs: LL;
      consumablebundles: LL;
      consumables_basic_: LL;
      consumables_luxury_: LL;
      drones: LL;
      electronicdevices: LL;
      electronicparts: LL;
      electronicpieces: LL;
      electronicsystems: LL;
      elements: LL;
      energysystems: LL;
      fuels: LL;
      gases: LL;
      infrastructure: LL;
      liquids: LL;
      medicalequipment: LL;
      metals: LL;
      minerals: LL;
      ores: LL;
      plastics: LL;
      shipengines: LL;
      shipkits: LL;
      shipparts: LL;
      shipshields: LL;
      softwarecomponents: LL;
      softwaresystems: LL;
      softwaretools: LL;
      textiles: LL;
      unitprefabs: LL;
      utility: LL;
    };
    MaterialInformation: {
      areaCost: LL;
      buildingMaterial: LL;
      category: LL;
      cogcUsage: LL;
      infrastructureUsage: LL;
      label: {
        volume: LL;
        weight: LL;
      };
      otherUsage: LL;
      production: LL;
      resource: LL & {
        no: LL;
        yes: LL;
      };
      ticker: LL;
      volume: PL<{ volume: string }>;
      weight: PL<{ weight: string }>;
      workforceUsage: LL;
      wroughtProduct: LL;
    };
    MaterialPanel: {
      context: {
        comexMaterialInfo: LL;
      };
      error: {
        material: LL;
      };
      title: LL;
      titleWithName: PL<{ name: string }>;
    };
    MaterialSelector: {
      input: {
        placeholder: LL;
      };
    };
    MaterialTransfer: {
      error: {
        noStoragesFound: LL;
      };
      header: {
        details: LL;
        result: LL;
      };
      label: {
        amount: LL;
        amountSlider: LL;
        material: LL;
        storageFrom: LL;
        storageTo: LL;
        transferResult: LL;
      };
      title: LL;
      transferButton: LL;
      transferResult: {
        description: PL<{
          amount: string;
          materialName: string;
          storeFrom: string;
          storeTo: string;
        }>;
        transferInvalid: LL;
      };
    };
    MenuHeadItem: {
      action: {
        logout: LL;
      };
      section: {
        settings: LL;
      };
    };
    Message: {
      action: {
        _delete: LL;
      };
    };
    MissionPlan: {
      consumption: LL;
      costs: LL;
      damage: LL & {
        info: LL;
      };
      destination: LL;
      distance: LL;
      duration: LL;
      index: LL;
      type: LL;
    };
    MissionSegmentType: {
      approach: LL & {
        tooltip: LL;
      };
      charge: LL & {
        tooltip: LL;
      };
      decay: LL & {
        tooltip: LL;
      };
      departure: LL & {
        tooltip: LL;
      };
      _float: LL & {
        tooltip: LL;
      };
      jump: LL & {
        tooltip: LL;
      };
      jumpgateway: LL & {
        tooltip: LL;
      };
      landing: LL & {
        tooltip: LL;
      };
      lock: LL & {
        tooltip: LL;
      };
      takeoff: LL & {
        tooltip: LL;
      };
      transit: LL & {
        tooltip: LL;
      };
    };
    MobileMainState: {
      notfound: LL;
    };
    MobileMaterialTransferModal: {
      action: {
        transfer: LL;
      };
      units: LL;
    };
    MobileMaterialTransferModel: {
      title: LL;
    };
    MobileStoreTransferOverlay: {
      targetStores: LL;
    };
    MobileTransferStoreAndItemSelectionModal: {
      button: {
        _continue: LL;
      };
      form: {
        material: LL;
        target: LL;
      };
      heading: {
        materialTransfer: LL;
      };
    };
    Model: {
      action: {
        dismiss: PL<{ icon: string }>;
      };
    };
    Modifier: {
      cargoBay: PL<{ weight: string; volume: string }>;
      damageReduction: PL<{ sign: string; factor: string }>;
      ftlFuelTank: PL<{ units: string }>;
      ftlReactor: PL<{ power: string; charge: string }>;
      maxGFactorIncrease: PL<{ delta: string }>;
      notprotected: LL;
      _protected: LL;
      stlEngine: PL<{ units: string }>;
      stlFuelTank: PL<{ units: string }>;
      vortexFuelTank: PL<{ units: string }>;
    };
    Money: {
      amount: PL<{ amount: string; currency: string }>;
      missingAmount: PL<{ forcedCurrencyCode: string }>;
    };
    Motion: {
      Commands: {
        command: {
          abstain: LL;
          no: LL;
          yes: LL;
        };
      };
      VoteSection: {
        table: {
          commands: LL;
          role: LL;
          status: LL;
          voter: LL;
        };
      };
      VoteStatus: {
        abstain: LL;
        no: LL;
        none: LL;
        yes: LL;
      };
      action: {
        addComponent: LL;
        deleteMotion: LL;
        save: LL;
        startVoting: LL;
      };
      form: {
        created: LL;
        creator: LL;
        name: LL;
        naturalId: LL;
        status: LL;
      };
      header: {
        components: LL;
        details: LL;
        votes: LL;
      };
      label: {
        noVotesYet: LL;
        votingend: LL;
        votingstart: LL;
      };
    };
    MotionComponent: {
      action: {
        cancel: LL;
        save: LL;
      };
    };
    MotionComponentName: {
      type: {
        CONTRIBUTION: LL;
        FEE_LOCAL_MARKET: LL;
        FEE_PRODUCTION: LL;
        FEE_SITE_ESTABLISHMENT: LL;
        FEE_WAREHOUSE: LL;
        GATEWAY_FUEL: LL;
        GATEWAY_LINK: LL;
        GATEWAY_PRICING: LL;
        GATEWAY_UNLINK: LL;
        INFRASTRUCTURE_CONSTRUCTION: LL;
        INFRASTRUCTURE_NAME: LL;
        INFRASTRUCTURE_UPGRADE: LL;
        INFRASTRUCTURE_UPKEEP: LL;
        PAYOUT: LL;
        POPULATION_INFRASTRUCTURE_LEVEL: LL;
        WORKFORCE_PROGRAM: LL;
      };
    };
    MotionComponentsTable: {
      action: {
        _delete: LL;
        edit: LL;
      };
      table: {
        Cmds: LL;
        description: LL;
        type: LL;
      };
    };
    MotionContainer: {
      error: {
        noMotion: PL<{ motionId: string }>;
      };
    };
    MotionPanel: {
      error: {
        id: PL<{ input: string }>;
      };
      title: {
        loading: PL<{ motionId: string }>;
      };
    };
    MotionStatus: {
      draft: LL;
      failed: LL;
      passed: LL;
      voting: LL;
    };
    Motions: {
      action: {
        _new: LL;
      };
      table: {
        address: LL;
        created: LL;
        creator: LL;
        id: LL;
        name: LL;
      };
    };
    MotionsPanel: {
      action: {
        deleteComponent: LL & {
          confirmation: LL;
        };
        deleteMotion: LL & {
          confirmation: LL;
        };
      };
      title: LL & {
        motion: LL;
      };
    };
    MutedChatMessage: {
      text: LL;
    };
    MutedUsers: {
      actions: {
        unmute: LL;
      };
      table: {
        commands: LL;
        time: LL;
        user: LL;
      };
    };
    MutedUsersPanel: {
      context: {
        communications: LL;
      };
    };
    NamePlanetPanel: {
      action: {
        confirmation: PL<{ name: string }>;
        name: LL;
        notes: LL;
      };
      error: {
        naturalId: LL;
      };
      success: LL;
      title: PL<{ naturalId: string }> & {
        loading: LL;
        notFound: LL;
      };
    };
    NameSystemPanel: {
      action: {
        confirmation: PL<{ name: string }>;
        name: LL;
        notes: LL;
      };
      error: {
        naturalId: LL;
      };
      success: LL;
      title: PL<{ naturalId: string }> & {
        loading: LL;
        notFound: LL;
      };
    };
    NamingForm: {
      label: {
        note: LL;
      };
      name: LL;
      naturalId: LL;
      note: LL;
      submit: LL & {
        disabled: LL;
      };
    };
    NavigationConstants: {
      calculating: LL;
      equalOriginDestination: LL;
      ftlReactorRequired: LL;
      invalid: LL;
      missingFtlFuel: PL<{ ftlFuelNecessary: string }>;
      missingStlFuel: PL<{ stlFuelNecessary: string }>;
      noPath: LL;
      notReady: LL;
      ok: LL;
      outOfFtlRange: LL;
      outOfStlRange: LL;
    };
    NeedFulfillment: {
      content: PL<{ type: string; fulfillment: string }>;
    };
    NeedTypeLabel: {
      COMFORT: LL;
      CULTURE: LL;
      EDUCATION: LL;
      HEALTH: LL;
      LIFE_SUPPORT: LL;
      SAFETY: LL;
    };
    NoData: {
      label: LL;
    };
    NoTestServerAccess: {
      accountManagement: LL;
      text1: LL;
      text2: PL<{ link: string }>;
      text3: LL;
      title: LL;
    };
    NonActiveContextNotifications: {
      action: {
        _switch: LL;
      };
      table: {
        command: LL;
        context: LL;
        unread: LL;
        unseen: LL;
      };
    };
    NotificationConfigPanel: {
      enabled: {
        _default: LL;
        disabled: LL;
        enabled: LL;
      };
      frequency: {
        _12: LL;
        _15m: LL;
        _1h: LL;
        _1m: LL;
        _24h: LL;
        _4h: LL;
        _8h: LL;
        _default: LL;
      };
      table: {
        enabled: LL;
        frequency: LL;
        type: LL & {
          _default: LL;
        };
      };
      title: LL;
    };
    Notifications: {
      context: {
        config: LL;
        inGameConfig: LL;
        notifications: LL;
      };
    };
    NotificationsPanel: {
      link: {
        markAllAsRead: LL;
        markAllAsSeen: LL;
      };
      section: {
        otherContexts: LL;
      };
      title: LL;
    };
    OfficeList: {
      action: {
        adm: LL;
        gov: LL;
      };
      table: {
        address: LL;
        end: LL;
        role: LL;
      };
    };
    OfficeType: {
      GOVERNOR: LL;
      MEMBER_OF_PARLIAMENT: LL;
    };
    Offices: {
      header: {
        current: LL;
        past: LL;
        runs: LL;
      };
      table: {
        address: LL;
        end: LL;
      };
    };
    OfficesPanel: {
      context: {
        user: LL;
      };
      error: {
        id: PL<{ input: string }>;
      };
      title: PL<{ name: string }> & {
        loading: LL;
      };
    };
    OrderSlot: {
      output: PL<{ amount: number }>;
    };
    OrderStatus: {
      capacity: LL;
      funds: LL;
      halted: LL;
      input: LL;
      progress: PL<{ completed: string | number }>;
      recurring: LL;
    };
    OrderStatusLabel: {
      CREATED: LL;
      DELETED: LL;
      FILLED: LL;
      PARTIALLY_FILLED: LL;
      PLACED: LL;
    };
    OrderTypeLabel: {
      BUYING: LL;
      SELLING: LL;
    };
    Overlay: {
      action: LL;
      feature1: LL;
      feature2: LL;
      feature3: LL;
      feature4: LL;
      feature5: LL;
      footer: LL;
      heading1: PL<{ linebreak: string }>;
      heading2: PL<{ linebreak: string }>;
    };
    PanelSelector: {
      input: {
        placeholder: LL;
      };
    };
    ParliamentRole: {
      role: {
        governor: LL;
        memberOfParliament: LL;
      };
    };
    PaymentConditionEditForm: {
      form: {
        amount: LL;
        currency: LL;
      };
    };
    PayoutComponent: {
      action: {
        cancel: LL;
        save: LL;
      };
      label: {
        amount: LL;
        currency: LL;
        recipient: LL;
      };
    };
    PendingContractsTable: {
      action: {
        view: LL;
      };
    };
    PendingInvitesContainer: {
      action: {
        accept: LL;
        reject: LL;
      };
      table: {
        contribution: LL;
        corporation: LL;
        empty: LL;
        received: LL;
        shares: LL;
      };
    };
    Performance: {
      label: {
        accelerationMax: LL;
        cargoCapacity: LL;
        ftlSpeedMax: LL;
        maxGFactor: LL;
        operatingEmptyMass: LL;
        volume: LL;
      };
      value: {
        accelerationMax: PL<{ value: string }>;
        cargoCapacity: PL<{ weight: string; volume: string }>;
        ftlSpeedMax: PL<{ value: string }>;
        operatingEmptyMass: PL<{ value: string }>;
        volume: PL<{ value: string }>;
      };
    };
    PickupConditionEditorForm: {
      form: {
        address: LL;
        amount: LL;
        material: LL;
      };
    };
    PlanetInfoMapContainer: {
      help: LL;
      ownSite: {
        start: LL;
        view: LL;
      };
    };
    PlanetInfoPanel: {
      context: {
        fleet: LL;
        inventory: LL;
        localrules: LL;
        populationreport: LL;
        projects: LL;
        systemInformation: LL;
        systemMap: LL;
      };
      error: {
        planetId: LL;
      };
      label: {
        data: {
          environment: LL;
          fertility: LL;
          infrastructure: LL;
          plots: LL;
          projects: LL;
          radius: LL;
          resources: LL;
          type: LL;
        };
        faction: LL;
        government: LL & {
          content: PL<{ planet: string }>;
        };
        name: LL;
        naming: LL;
        naturalId: LL;
        planet: LL;
        population: LL;
      };
      title: PL<{ name: string }> & {
        list: LL;
        loading: LL;
        notfound: LL;
      };
    };
    PlanetInformation: {
      ghostPlots: LL;
      info: {
        fertility: LL;
        infrastructure: LL;
        plots: LL;
        resources: LL;
      };
      label: {
        faction: {
          info: LL;
        };
        fertility: LL & {
          info: LL;
        };
        government: {
          info: LL;
        };
        infrastructure: LL;
        naming: {
          info: LL;
        };
        plots: LL;
        resources: LL & {
          info: LL;
        };
        type: LL & {
          info: LL;
        };
        workforce: {
          info: LL;
        };
      };
      named: PL<{ namer: string; time: string }>;
      naming: {
        name: LL;
      };
      noData: LL;
      plots: PL<{ free: string; plots: string }>;
      type: {
        planet: LL;
        station: LL;
      };
      unnamed: PL<{ button: string }>;
    };
    PlanetType: {
      noSurface: LL;
      surface: LL;
    };
    PlanetaryProjectEntry: {
      contribute: LL;
      details: LL;
    };
    PlanetaryProjectPanel: {
      button: {
        contribution: LL;
        open: {
          adm: LL;
          cogc: LL;
          locm: LL;
          pop: LL;
          shy: LL;
          war: LL;
        };
      };
      contribute: {
        error: LL;
      };
      contribution: LL;
      error: {
        planetId: LL;
      };
      label: {
        billOfMaterial: LL;
        constructionDate: LL;
        project: LL;
        status: LL;
      };
      project: LL;
      section: {
        contribute: LL;
        contributions: LL;
      };
      status: {
        inConstruction: LL;
        operational: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
        notFound: LL;
      };
    };
    PlanetaryProjects: {
      ADM: LL & {
        description: LL;
        ticker: LL;
      };
      COGC: LL & {
        description: LL;
        ticker: LL;
      };
      CX: LL & {
        description: LL;
        ticker: LL;
      };
      LOCM: LL & {
        description: LL;
        ticker: LL;
      };
      POP: LL & {
        description: LL;
        ticker: LL;
      };
      SHY: LL & {
        description: LL;
        ticker: LL;
      };
      WAR: LL & {
        description: LL;
        ticker: LL;
      };
    };
    PlanetaryProjectsPanel: {
      context: {
        planet: LL;
        projects: LL;
      };
      error: {
        planetId: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
        notFound: LL;
      };
    };
    PlotSelectionMapContainer: {
      action: PL<{ random: string }>;
      button: {
        random: LL;
        select: LL;
      };
    };
    Population: {
      report: {
        action: {
          next: LL;
          prev: LL;
        };
        change: LL;
        comfort: LL;
        culture: LL;
        current: PL<{ period: string; time: string }>;
        education: LL;
        educationInOut: LL;
        engineers: LL;
        happiness: LL;
        health: LL;
        lifeSupport: LL;
        metric: LL;
        migration: LL;
        nextPopulation: LL;
        openJobs: LL;
        pioneers: LL;
        safety: LL;
        scientists: LL;
        settler: LL;
        shift: PL<{ in: string; sign: string; out: string }>;
        technicians: LL;
        unemployment: LL;
      };
      section: {
        governmentProgram: LL;
        needFulfillment: LL;
      };
    };
    PopulationChartContainer: {
      error: {
        noData: LL;
      };
    };
    PopulationInfrastructure: {
      buttons: {
        details: LL;
      };
      projects: {
        built: LL;
        cmds: LL;
        current: LL & {
          description: LL;
        };
        name: LL;
        progress: LL;
        upkeep: LL;
      };
    };
    PopulationInfrastructureComponent: {
      label: {
        infrastructure: LL;
      };
      setting: {
        max: LL;
      };
      table: {
        active: LL;
        infrastructure: LL;
        target: LL;
      };
    };
    PopulationInfrastructureContainer: {
      error: {
        noreport: LL;
      };
    };
    PopulationInfrastructurePanel: {
      context: {
        localRules: LL;
        planet: LL;
        report: LL;
      };
      error: {
        planetId: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
        notfound: LL;
      };
    };
    PopulationInfrastructureProject: {
      form: {
        built: LL;
        current: LL;
        description: LL;
        maxupgrade: LL;
        name: LL;
        upgradeCosts: LL;
        upgradeStatus: LL;
      };
      section: {
        contributions: LL;
        upgrade: LL;
        upkeep: LL;
      };
    };
    PopulationInfrastructureProjectContainer: {
      error: {
        noproject: LL;
      };
    };
    PopulationInfrastructureProjectPanel: {
      action: {
        contribute: LL & {
          confirmation: LL;
        };
      };
      context: {
        planet: LL;
        populationinfrastructure: LL;
        report: LL;
      };
      error: {
        planetId: LL;
      };
      title: PL<{ type: string; name: string }> & {
        loading: LL;
        notfound: LL;
      };
    };
    PopulationNeedsTable: {
      NEED_FULFILLMENT: LL;
      NEED_FULFILLMENT_DESCRIPTION: LL;
    };
    PopulationReportContainer: {
      error: {
        noreport: LL;
      };
    };
    PopulationReportInfo: {
      CHANGE: LL;
      EDUCATION: LL;
      EXPLORERS_GRACE: LL;
      HAPPINESS: LL;
      MIGRATION: LL;
      NEED_FULFILLMENT: LL;
      OPEN_JOBS: LL;
      POPULATION: LL;
      UNEMPLOYMENT: LL;
    };
    PopulationReportPanel: {
      context: {
        planet: LL;
        populationInfrastructure: LL;
      };
      error: {
        planetId: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
        notfound: LL;
      };
    };
    PrivateChannelMembershipPanel: {
      title: PL<{ name: string }>;
    };
    Production: {
      context: {
        base: LL;
        createOrder: LL;
        overview: LL;
        queue: LL;
        site: LL;
      };
    };
    ProductionFeeForm: PL<{ category: string; workforce: string }> & {
      action: {
        edit: LL;
      };
    };
    ProductionFeeTable: {
      cell: {
        valueWithChange: PL<{ value: string; sign: string; change: string }>;
      };
    };
    ProductionLine: {
      efficiencyFactors: {
        experts: PL<{ name: string }>;
      };
      error: {
        templates: {
          empty: LL;
        };
      };
      form: {
        duration: LL;
        efficiency: {
          factors: LL;
          total: LL;
        };
        factor: LL;
        location: LL;
        note: LL;
        product: LL;
        productionLine: LL;
        productionfee: LL;
        recipe: LL;
        recurring: LL;
        reducedDuration: PL<{ reducedDuration: string; duration: string }>;
        submit: LL;
      };
      label: {
        recurring: LL & {
          info: LL;
        };
      };
      productionfee: PL<{ fee: string; linebreak: string; collector: string }>;
    };
    ProductionLinePanel: {
      error: {
        productionLineId: LL;
      };
      title: PL<{ line: string; address: string }> & {
        loading: LL;
      };
    };
    ProductionLines: {
      empty: LL;
      link: {
        order: LL;
        queue: LL;
      };
      slots: PL<{ active: string; total: string }>;
      table: {
        header: {
          efficiency: LL;
          planet: LL;
          slots: LL;
        };
      };
    };
    ProductionPanel: {
      error: {
        siteId: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
        sites: LL;
      };
    };
    ProductionQueue: {
      createOrder: LL;
      figures: {
        capacity: LL & {
          amount: PL<{ active: string; capacity: string }>;
        };
        efficiency: LL;
        productionLineCondition: LL;
        slots: LL & {
          amount: PL<{ queued: string; slots: string }>;
        };
      };
      materialAvailability: PL<{ available: string; amount: string }>;
      materialquantity: PL<{ amount: string; name: string }>;
      orders: {
        active: LL;
        queued: LL;
      };
      table: {
        cancel: LL;
        completion: LL;
        fee: LL;
        input: LL;
        moveDown: LL;
        moveUp: LL;
        output: LL;
        status: LL;
      };
    };
    ProductionQueuePanel: {
      action: {
        cancel: LL;
        confirmation: LL;
        fees: LL;
        inputmaterials: LL;
        outputmaterials: LL;
      };
      cancelled: LL;
      error: {
        productionLineId: LL;
      };
      title: PL<{ line: string; location: string }> & {
        loading: LL;
      };
    };
    Program: {
      EDUCATION_1: LL & {
        description: LL;
      };
      EDUCATION_2: LL & {
        description: LL;
      };
      EDUCATION_3: LL & {
        description: LL;
      };
      FAMILY_SUPPORT_1: LL & {
        description: LL;
      };
      FAMILY_SUPPORT_2: LL & {
        description: LL;
      };
      FAMILY_SUPPORT_3: LL & {
        description: LL;
      };
      FESTIVITIES_1: LL & {
        description: LL;
      };
      FESTIVITIES_2: LL & {
        description: LL;
      };
      FESTIVITIES_3: LL & {
        description: LL;
      };
      IMMIGRATION_ENGINEER: LL & {
        description: LL;
      };
      IMMIGRATION_PIONEER: LL & {
        description: LL;
      };
      IMMIGRATION_SCIENTIST: LL & {
        description: LL;
      };
      IMMIGRATION_SETTLER: LL & {
        description: LL;
      };
      IMMIGRATION_TECHNICIAN: LL & {
        description: LL;
      };
    };
    ProgressBar: {
      value: PL<{ value: string; maximum: string }>;
    };
    ProjectStatus: {
      BUILT: LL;
      CREATED: LL;
      STARTED: LL;
    };
    Prompt: {
      placeholder: {
        banned: PL<{ date: string; time: string }>;
        _default: LL;
        muted: LL;
      };
    };
    ProvisionCondition: {
      content: PL<{ amount: number; material: string; address: string }>;
    };
    ProvisionConditionEditForm: {
      form: {
        address: LL;
        amount: LL;
        material: LL;
      };
    };
    PublicChannelMembershipPanel: {
      title: {
        _default: LL;
      };
    };
    REPRESENTATION_CENTER: LL;
    RangeSelector: {
      label: {
        days_180: LL;
        days_30: LL;
        days_7: LL;
        days_90: LL;
      };
    };
    RatingInfo: {
      details: PL<{ count: string; days: string }>;
    };
    ReachableSystems: {
      table: {
        commands: LL;
        distance: LL;
        system: LL;
      };
    };
    Reactor: {
      advancedAppliancesFactory_description: LL;
      advancedAppliancesFactory_name: LL;
      advancedMaterialLab_description: LL;
      advancedMaterialLab_name: LL;
      advancedSmelter_description: LL;
      advancedSmelter_name: LL;
      appliancesFactory_description: LL;
      appliancesFactory_name: LL;
      basicMaterialsPlant_description: LL;
      basicMaterialsPlant_name: LL;
      chemPlant_description: LL;
      chemPlant_name: LL;
      cleanRoom_description: LL;
      cleanRoom_name: LL;
      clothingFactory_description: LL;
      clothingFactory_name: LL;
      collector_description: LL;
      collector_name: LL;
      coreModule_description: LL;
      coreModule_name: LL;
      corporationProjectFTLLaboratory_description: LL;
      corporationProjectFTLLaboratory_name: LL;
      corporationProjectHeadquarters_description: LL;
      corporationProjectHeadquarters_name: LL;
      corporationProjectImmortality_description: LL;
      corporationProjectImmortality_name: LL;
      corporationProjectRepresentationCenter_description: LL;
      corporationProjectRepresentationCenter_name: LL;
      corporationProjectTerraforming_description: LL;
      corporationProjectTerraforming_name: LL;
      droneShop_description: LL;
      droneShop_name: LL;
      einsteiniumEnrichmentPlant_description: LL;
      einsteiniumEnrichmentPlant_name: LL;
      electronicDeviceManufactory_description: LL;
      electronicDeviceManufactory_name: LL;
      electronicsPlant_description: LL;
      electronicsPlant_name: LL;
      energyComponentAssembly_description: LL;
      energyComponentAssembly_name: LL;
      extractor_description: LL;
      extractor_name: LL;
      farm_description: LL;
      farm_name: LL;
      fermentationFacility_description: LL;
      fermentationFacility_name: LL;
      fineSmithy_description: LL;
      fineSmithy_name: LL;
      foodProcessor_description: LL;
      foodProcessor_name: LL;
      glassFurnace_description: LL;
      glassFurnace_name: LL;
      habitationBarracks_description: LL;
      habitationBarracks_name: LL;
      habitationCommune_description: LL;
      habitationCommune_name: LL;
      habitationEngineer_description: LL;
      habitationEngineer_name: LL;
      habitationLuxury_description: LL;
      habitationLuxury_name: LL;
      habitationManagers_description: LL;
      habitationManagers_name: LL;
      habitationPioneer_description: LL;
      habitationPioneer_name: LL;
      habitationScientist_description: LL;
      habitationScientist_name: LL;
      habitationSettler_description: LL;
      habitationSettler_name: LL;
      habitationTechnician_description: LL;
      habitationTechnician_name: LL;
      hullWeldingPlant_description: LL;
      hullWeldingPlant_name: LL;
      hydroponicsFarm_description: LL;
      hydroponicsFarm_name: LL;
      inVitroPlant_description: LL;
      inVitroPlant_name: LL;
      incinerator_description: LL;
      incinerator_name: LL;
      laboratory_description: LL;
      laboratory_name: LL;
      mediumComponentsAssembly_description: LL;
      mediumComponentsAssembly_name: LL;
      orchard_description: LL;
      orchard_name: LL;
      packagingCenter_description: LL;
      packagingCenter_name: LL;
      pharmaFactory_description: LL;
      pharmaFactory_name: LL;
      planetaryProjectAdminCenter_description: LL;
      planetaryProjectAdminCenter_name: LL;
      planetaryProjectCogc_description: LL;
      planetaryProjectCogc_name: LL;
      planetaryProjectComfortBig_description: LL;
      planetaryProjectComfortBig_name: LL;
      planetaryProjectComfortCulture_description: LL;
      planetaryProjectComfortCulture_name: LL;
      planetaryProjectComfortSmall_description: LL;
      planetaryProjectComfortSmall_name: LL;
      planetaryProjectCultureBig_description: LL;
      planetaryProjectCultureBig_name: LL;
      planetaryProjectCultureEducation_description: LL;
      planetaryProjectCultureEducation_name: LL;
      planetaryProjectCultureSmall_description: LL;
      planetaryProjectCultureSmall_name: LL;
      planetaryProjectEducationBig_description: LL;
      planetaryProjectEducationBig_name: LL;
      planetaryProjectEducationSmall_description: LL;
      planetaryProjectEducationSmall_name: LL;
      planetaryProjectHealthBig_description: LL;
      planetaryProjectHealthBig_name: LL;
      planetaryProjectHealthComfort_description: LL;
      planetaryProjectHealthComfort_name: LL;
      planetaryProjectHealthSmall_description: LL;
      planetaryProjectHealthSmall_name: LL;
      planetaryProjectLocalMarket_description: LL;
      planetaryProjectLocalMarket_name: LL;
      planetaryProjectPopulation_description: LL;
      planetaryProjectPopulation_name: LL;
      planetaryProjectSafetyBig_description: LL;
      planetaryProjectSafetyBig_name: LL;
      planetaryProjectSafetyHealth_description: LL;
      planetaryProjectSafetyHealth_name: LL;
      planetaryProjectSafetySmall_description: LL;
      planetaryProjectSafetySmall_name: LL;
      planetaryProjectShipyard_description: LL;
      planetaryProjectShipyard_name: LL;
      planetaryProjectWarehouse_description: LL;
      planetaryProjectWarehouse_name: LL;
      plasticsPrinterFacility_description: LL;
      plasticsPrinterFacility_name: LL;
      polymerPlant_description: LL;
      polymerPlant_name: LL;
      prefabPlant1_description: LL;
      prefabPlant1_name: LL;
      prefabPlant2_description: LL;
      prefabPlant2_name: LL;
      prefabPlant3_description: LL;
      prefabPlant3_name: LL;
      prefabPlant4_description: LL;
      prefabPlant4_name: LL;
      refinery_description: LL;
      refinery_name: LL;
      rig_description: LL;
      rig_name: LL;
      shipKitFactory_description: LL;
      shipKitFactory_name: LL;
      smallComponentsAssembly_description: LL;
      smallComponentsAssembly_name: LL;
      smelter_description: LL;
      smelter_name: LL;
      softwareDevelopment_description: LL;
      softwareDevelopment_name: LL;
      softwareEngineering_description: LL;
      softwareEngineering_name: LL;
      softwareLabs_description: LL;
      softwareLabs_name: LL;
      spacecraftPrefabPlant_description: LL;
      spacecraftPrefabPlant_name: LL;
      spacecraftPropulsionFactory_description: LL;
      spacecraftPropulsionFactory_name: LL;
      storageBig_description: LL;
      storageBig_name: LL;
      storageFacility_description: LL;
      storageFacility_name: LL;
      storageSmall_description: LL;
      storageSmall_name: LL;
      storageVolume_description: LL;
      storageVolume_name: LL;
      storageWeight_description: LL;
      storageWeight_name: LL;
      technetiumProcessing_description: LL;
      technetiumProcessing_name: LL;
      unitPrefabPlant_description: LL;
      unitPrefabPlant_name: LL;
      weavingPlant_description: LL;
      weavingPlant_name: LL;
      weldingPlant_description: LL;
      weldingPlant_name: LL;
    };
    Recommendation: {
      _1: LL;
      _2: LL;
      _3: LL;
      _4: LL;
      _5: LL;
      stars: PL<{ stars: string; label: string }>;
      suitability: LL;
    };
    RecommendedStarterBuildings: {
      buttons: {
        construct: LL;
      };
      text: PL<{ profession: string }>;
      text2: LL;
      text3: LL;
      text4: LL;
    };
    RecommendedStarterBuildingsPanel: {
      title: LL;
    };
    RelativeTime: {
      future: PL<{ time: string }>;
      now: LL;
      past: PL<{ time: string }>;
    };
    RepresentationCenter: {
      action: {
        contribute: LL;
        set: LL;
      };
      context: {
        headquarters: LL;
        sites: LL;
      };
      contributions: {
        contribution: LL;
        contributor: LL;
        time: LL;
      };
      form: {
        costNextLevel: LL;
        left: LL;
        level: LL;
        progress: LL;
        section: {
          contributions: LL;
          next: LL;
        };
        totalContributions: LL;
      };
      label: {
        contribution: LL;
        left: PL<{ left: string; set: string }>;
        level: LL;
        progress: PL<{ contributed: string; cost: string }>;
      };
      title: LL;
    };
    ReputationTable: {
      entity: PL<{ entity: string; reputation: string }>;
    };
    ResourceType: {
      gaseous: LL;
      liquid: LL;
      mineral: LL;
    };
    ResourcesTable: {
      tooltip: {
        _yield: LL;
      };
    };
    Restriction: {
      headline: LL;
      message: LL;
    };
    RestrictionBanner: {
      message: LL;
    };
    Role: {
      BORROWER: LL;
      LENDER: LL;
    };
    RoutePreferencesSelect: {
      label: {
        useGateways: LL;
      };
      value: {
        leastJumps: LL;
        shortestFTL: LL;
      };
    };
    ScreenControls: {
      action: {
        add: LL;
        copy: LL;
        _delete: LL;
        fullscreen: LL;
        undoDelete: LL;
      };
      screenName: PL<{ name: string }>;
      title: LL;
    };
    Screens: {
      action: {
        rename: LL;
      };
      actions: {
        addVariable: LL;
        removeVariable: LL;
      };
      header: {
        add: LL;
        name: LL;
        variables: LL;
      };
      label: {
        name: LL;
        options: LL;
        screen: LL;
        variableName: LL;
        variableType: LL;
      };
      table: {
        empty: LL;
        name: LL;
        type: LL;
        value: LL;
      };
    };
    ScreensPanel: {
      title: LL;
    };
    SectionList: {
      demolish: LL;
      infrastructure: LL;
      production: LL;
      repair: LL;
      resources: LL;
      section: {
        bookValue: LL;
        condition: LL;
        established: LL;
        lastRepair: LL;
        reclaimableMaterials: LL;
        repairMaterials: LL & {
          info: LL;
        };
      };
    };
    SectionListPanel: {
      action: {
        confirmation: PL<{ name: string }>;
        demolish: LL;
      };
      error: {
        siteId: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
      };
    };
    SectionType: {
      ENGINEER: LL;
      INFRASTRUCTURE: LL;
      PIONEER: LL;
      RESOURCES: LL;
      SCIENTIST: LL;
      SETTLER: LL;
      TECHNICIAN: LL;
    };
    SelectInput: {
      emptyLabel: LL;
      nullLabel: LL;
    };
    SelectionList: {
      section: {
        condition: {
          value: PL<{ condition: string }>;
        };
      };
    };
    Sender: {
      label: PL<{ link: string }>;
      name: PL<{ corp: string; user: string }>;
    };
    ServerNotification: {
      action: {
        close: LL;
      };
      label: {
        info: PL<{ link: string }>;
        time: PL<{ countdown: string }>;
      };
    };
    Settings: {
      arrow: {
        left: LL;
        right: LL;
      };
    };
    ShareholderContext: {
      context: {
        com: LL;
        corporation: LL;
        finance: LL;
        invites: LL;
        project: {
          _new: LL;
        };
        projects: LL;
      };
    };
    ShareholderCorporation: {
      header: {
        infrastructure: LL;
        shareholders: LL;
      };
      info: {
        currency: LL;
        faction: LL;
        founded: LL;
        headquarters: LL;
        shares: LL;
      };
      primaryHolding: {
        leave: LL;
      };
      shareholder: {
        company: LL;
        joined: LL;
        relativeShare: PL<{ x: string }>;
        shares: LL;
      };
    };
    ShareholderCorporationFinancePanel: {
      title: LL;
    };
    Ship: {
      action: {
        repair: LL;
      };
      header: {
        Status: LL;
      };
      label: {
        blueprint: LL;
        cargohold: LL;
        commissioned: LL;
        condition: LL;
        fueltanks: LL;
        operatingEmptyMass: LL;
        operatingTimeFtl: LL;
        operatingTimeStl: LL;
        projectHistory: LL;
        repairCost: LL;
        type: LL;
        volume: LL;
      };
      operatingEmptyMass: PL<{ mass: string }>;
      projecthistory: PL<{ blueprint: string; shipyard: string }>;
      registrationAndName: PL<{ registration: string; name: string }>;
      volume: PL<{ volume: string }>;
    };
    ShipFlightControl: {
      button: {
        abortFlight: LL;
        startFlight: LL;
      };
      label: {
        address: LL;
        condition: LL & {
          info: LL;
        };
        destination: LL;
        fuel: LL;
        fuelUsage: LL;
        inventory: LL;
        landing: LL;
        mass: LL;
        note: LL;
        origin: LL;
        reachableSystems: LL;
        reactorUsage: LL;
        routePreferences: LL;
        ship: LL;
        status: LL;
        surface: LL;
        target: LL;
        unload: LL & {
          info: LL;
        };
        unloading: LL;
      };
      text: {
        reducedFlightTimes: LL;
      };
    };
    ShipFuel: {
      fuel: {
        ftl: PL<{ current: string; max: string }>;
        stl: PL<{ current: string; max: string }>;
      };
    };
    ShipFuelInventory: {
      ftl: LL;
      stl: LL;
    };
    ShipFuelInventoryPanel: {
      context: {
        shipFlightControl: LL;
        shipInformation: LL;
        shipInventory: LL;
      };
      error: {
        shipId: LL;
      };
      title: PL<{ name: string; reg: string }>;
    };
    ShipInformationPanel: {
      commissioned: LL;
      error: {
        shipId: LL;
      };
      manufacturer: LL;
      operator: LL;
      title: PL<{ name: string; reg: string }> & {
        loading: LL;
      };
    };
    ShipInventoryPanel: {
      context: {
        shipFlightControl: LL;
        shipFuel: LL;
        shipInformation: LL;
      };
      error: {
        shipId: LL;
      };
      title: PL<{ name: string; reg: string }> & {
        loading: LL;
      };
    };
    ShipPanel: {
      error: {
        shipId: LL;
      };
      title: PL<{ name: string; reg: string }> & {
        loading: LL;
      };
    };
    ShipStatus: {
      approach: LL;
      charge: LL;
      decay: LL;
      departure: LL;
      _float: LL;
      jump: LL;
      jumpgateway: LL;
      landing: LL;
      lock: LL;
      takeoff: LL;
      transit: LL;
    };
    ShipStore: {
      capacities: PL<{ weight: string; volume: string }>;
      weight: PL<{ current: string; max: string }>;
    };
    ShipType: {
      COLONY_SHIP: LL;
      REGULAR: LL;
    };
    ShipmentDeliveryCondition: {
      content: {
        own: PL<{ address: string }>;
      };
    };
    ShipmentPickUpCondition: {
      content: {
        other: PL<{ address: string }>;
        own: PL<{ weight: string; volume: string; address: string }>;
      };
    };
    ShipmentProvisionCondition: {
      content: {
        other: PL<{ address: string; autoprovision: string }>;
        own: PL<{ amount: number; material: string; address: string; autoprovision: string }>;
      };
    };
    Ships: {
      action: {
        unload: LL;
      };
    };
    Shipyard: {
      action: {
        create: LL;
      };
      context: {
        blueprintFlightSimulator: LL;
        blueprints: LL;
        planet: LL;
        shipyard: LL;
        shipyardProject: LL;
        shipyardProjects: LL;
      };
      error: {
        id: LL;
      };
      header: {
        project: LL;
        projects: LL;
        upgradeProject: LL;
      };
      label: {
        activeProjects: LL;
        address: LL;
        blueprint: LL;
        finishedProjects: LL;
        finishedProjectsMonth: LL;
        finishedProjectsSemiannualy: LL;
        finishedProjectsWeek: LL;
        inConstruction: LL;
        operator: LL;
        originBlueprint: LL;
        targetBlueprint: LL;
      };
      projects: {
        actions: {
          _delete: LL;
          view: LL;
        };
        header: {
          blueprint: LL;
          cmds: LL;
          created: LL;
          status: LL;
        };
      };
      title: {
        all: LL;
      };
    };
    ShipyardPanel: {
      create: {
        action: {
          confirmation: LL;
          submit: LL;
        };
      };
      createUpgrade: {
        action: {
          confirmation: LL;
          submit: LL;
        };
      };
      error: {
        notfound: PL<{ input: string }>;
      };
      title: LL & {
        all: LL;
      };
    };
    ShipyardProject: {
      action: {
        start: LL;
      };
      error: {
        noProject: LL;
      };
      label: {
        ShipToUpgrade: LL;
        blueprint: LL;
        created: LL;
        end: LL;
        originBlueprint: LL;
        ship: LL;
        shipyard: LL;
        start: LL;
        status: LL;
      };
      section: {
        materials: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
        project: LL;
        projects: LL;
      };
    };
    ShipyardProjects: {
      projects: {
        actions: {
          _delete: LL;
          view: LL;
        };
        header: {
          blueprint: LL;
          cmds: LL;
          created: LL;
          shipyard: LL;
          status: LL;
        };
      };
    };
    Shipyards: {
      button: {
        details: LL;
      };
      error: {
        nodata: LL;
      };
      table: {
        location: LL;
        operator: LL;
      };
    };
    Sidebar: {
      header: {
        balances: LL;
        contracts: LL;
        rating: LL;
      };
      title: {
        government: PL<{ entity: string }>;
      };
    };
    Site: {
      buttons: {
        construct: LL;
        experts: LL;
        headquarters: LL;
        inventory: LL;
        production: LL;
        sections: LL;
        workforces: LL;
      };
      overview: LL;
      workforces: LL;
    };
    SiteBuildOption: {
      area: LL;
      build: LL;
      expertise: LL;
      fertile: LL & {
        no: LL;
        yes: LL;
      };
      materials: LL;
      workforce: LL & {
        capacity: PL<{ capacity: string; reserve: string }>;
      };
    };
    SiteBuildOptionsContainer: {
      error: {
        planet: LL;
      };
    };
    SiteBuildSectionPanel: {
      context: {
        base: LL;
        bases: LL;
        planet: LL;
      };
      error: {
        siteId: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
      };
    };
    SiteConstruction: {
      basePermits: PL<{ used: string; total: string }>;
      description: LL;
      label: {
        basePermits: LL & {
          info: LL;
        };
        billOfMaterials: LL & {
          info: LL;
        };
        build: LL;
        buildOptions: {
          info: LL;
        };
        description: LL;
        establishmentFee: LL & {
          info: LL;
        };
        limit: LL & {
          info: LL;
        };
        location: LL & {
          info: LL;
        };
        plotSelection: LL & {
          info: LL;
        };
        plots: LL & {
          info: LL;
        };
        siteType: LL;
        store: LL & {
          info: LL;
        };
        view: LL;
      };
      limit: PL<{ current: string }>;
      siteType: {
        initial: LL;
        regular: LL;
      };
    };
    SiteConstructionPanel: {
      context: {
        bases: LL;
        planet: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
        unknownLocation: LL;
      };
    };
    SitePanel: {
      context: {
        bases: LL;
        buildingRepairAssistant: LL;
        headquarters: LL;
        inventory: LL;
        planet: LL;
        representationCenter: LL;
      };
      title: PL<{ name: string }> & {
        sites: LL;
      };
    };
    SiteProductionLines: {
      createOrder: LL;
      empty: LL;
      queueDivider: LL;
      view: LL;
    };
    SitePublicInformation: {
      area: PL<{ area: string }>;
      label: {
        area: LL;
        founded: LL;
        industry: LL;
        name: LL;
        operator: LL;
      };
    };
    SitePublicInformationPanel: {
      context: {
        planet: LL;
      };
      error: {
        siteId: LL;
        type: PL<{ type: string }>;
      };
      title: PL<{ name: string }> & {
        loading: LL;
      };
    };
    SiteStats: {
      developedArea: PL<{ developed: string; available: string; total: string }>;
      label: {
        area: LL;
        developedArea: LL;
      };
    };
    SiteWorkforces: {
      population: PL<{ workforce: string; reserve: string }>;
      table: {
        capacity: LL;
        currentWorkforce: LL & {
          info: LL;
        };
        level: LL;
        required: LL;
        satisfaction: LL;
      };
    };
    Sites: {
      action: {
        buildBase: LL;
      };
      empty: LL;
      table: {
        addPermit: LL;
        area: LL & {
          value: PL<{ developed: string; total: string }>;
        };
        changePermits: LL;
        permits: LL & {
          info: LL;
          value: PL<{ invested: string; maximum: string }>;
        };
        planet: LL;
        removePermit: LL;
        view: LL;
      };
    };
    SortCriteria: {
      ABC: LL;
      AMT: LL;
      ASC: LL;
      CAT: LL;
      DESC: LL;
      TCK: LL;
      VOL: LL;
      WGT: LL;
    };
    Stack: {
      action: {
        back: LL;
        edit: LL;
        newCard: LL;
        stacks: LL;
        stopEditing: LL;
      };
      empty: LL;
      newcard: {
        action: {
          cancel: LL;
          create: LL;
        };
        title: LL;
      };
      title: {
        newCard: LL;
      };
    };
    Stacks: {
      action: {
        cancel: LL;
        create: LL;
        edit: LL;
        stopEditing: LL;
      };
      _delete: {
        confirm: LL;
        details: LL;
        question: LL;
      };
      label: {
        stackName: LL;
      };
      name: PL<{ part: string }>;
      newStack: LL;
      title: LL;
    };
    StarOverlay: {
      populationDataLine: PL<{ population: string; workforce: string }>;
    };
    Station: {
      context: {
        systemMap: LL;
      };
    };
    StationInformationPanel: {
      address: LL;
      code: LL;
      commissioned: LL;
      error: {
        stationId: LL;
      };
      faction: LL;
      governingEntity: LL;
      infrastructure: LL;
      name: LL;
      title: PL<{ name: string }> & {
        loading: LL;
      };
    };
    StationInfrastructure: {
      warehouse: PL<{ name: string }>;
    };
    Stations: {
      action: {
        details: LL;
      };
      list: {
        address: LL;
        name: LL;
        naturalId: LL;
      };
    };
    StationsTile: {
      error: LL;
      title: LL;
    };
    SteamReviewPanel: {
      action: {
        steamClient: LL;
        steamWebsite: LL;
      };
      heading: LL;
      steamClient: LL;
      steamWebsite: LL;
      text1: LL;
      text2: LL;
      title: LL;
    };
    StockChartContainer: {
      error: {
        noData: LL;
      };
    };
    StoreItem: {
      blocked_materials: PL<{ id: string }>;
      shipment: PL<{ id: string }>;
    };
    StoreItemIcon: {
      context: {
        unpack: LL;
      };
    };
    StoreLockOverlay: {
      message: LL;
    };
    StoreName: {
      base: LL;
      construction_store: LL;
      ftl_fuel_store: PL<{ name: string }>;
      ship_store: PL<{ name: string }>;
      stl_fuel_store: PL<{ name: string }>;
      upkeep_store: LL;
      vortex_fuel_store: PL<{ name: string }>;
      warehouse: LL;
    };
    StoreTransfer: {
      context: {
        inventories: LL;
      };
    };
    StoreTypeLabel: {
      CONSTRUCTION_STORE: LL;
      CONSTRUCTION_STORE_SHORT: LL;
      FTL_FUEL_STORE: LL;
      FTL_FUEL_STORE_SHORT: LL;
      SHIP_STORE: LL;
      SHIP_STORE_SHORT: LL;
      STL_FUEL_STORE: LL;
      STL_FUEL_STORE_SHORT: LL;
      STORE: LL;
      STORE_SHORT: LL;
      UPKEEP_STORE: LL;
      UPKEEP_STORE_SHORT: LL;
      VORTEX_FUEL_STORE: LL;
      VORTEX_FUEL_STORE_SHORT: LL;
      WAREHOUSE_STORE: LL;
      WAREHOUSE_STORE_SHORT: LL;
    };
    StoreView: {
      actions: {
        startTransfer: LL;
      };
      volume: LL;
      weight: LL;
    };
    SubscriptionLevel: {
      basic: LL;
      pro: LL;
      trial: LL;
    };
    SystemInfoPanel: {
      context: {
        fleet: LL;
        infrastructure: LL;
        inventory: LL;
        systemMap: LL;
      };
      error: {
        systemId: LL;
      };
      faction: LL;
      header: {
        planets: LL;
        stations: LL;
      };
      meteoroidDensity: LL;
      name: LL;
      naming: LL;
      naturalId: LL;
      planet: {
        cogc: LL;
        environment: LL;
        fertility: LL;
        name: LL;
        population: LL;
        resources: LL;
        surface: LL;
      };
      starType: LL;
      station: {
        infrastructure: LL;
        name: LL;
      };
      title: PL<{ name: string }> & {
        list: LL;
        loading: LL;
        notfound: LL;
      };
    };
    SystemInformation: {
      info: {
        faction: LL;
        naming: LL;
        workforce: LL;
      };
      named: PL<{ namer: string; time: string }>;
      naming: {
        name: LL;
      };
      unnamed: PL<{ button: string }>;
    };
    SystemMap: {
      setting: {
        comex: {
          label: LL;
        };
        fleet: {
          label: LL;
        };
        inventory: {
          label: LL;
        };
        localMarket: {
          label: LL;
        };
        shipyard: {
          label: LL;
        };
        site: {
          label: LL;
        };
      };
    };
    SystemMapPanel: {
      context: {
        fleet: LL;
        info: LL;
      };
      error: {
        systemId: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
      };
    };
    TaskDescription: {
      BASIC_BASE_BUILDING: LL;
      BASIC_BASE_CONSTRUCTION: LL;
      BASIC_BASE_PRODUCTION: LL;
      BASIC_BASE_WORKFORCE: LL;
      BASIC_COMEX: LL;
      BASIC_COMMUNITY_DISCORD: LL;
      BASIC_INTRO: LL;
      BASIC_INTRO_GUIDELINES: LL;
      BASIC_INTRO_HANDBOOK: LL;
      BASIC_INTRO_HANDBOOK_PACKAGE: PL<{ startingProfile: string }>;
      BASIC_INTRO_HELP_CHANNEL: LL;
      BASIC_INTRO_VIDEO: LL;
      BASIC_INVENTORY_TRANSFER: LL;
      BASIC_LICENSE_PRO: LL;
    };
    TaskName: {
      BASIC_BASE_BUILDING: LL;
      BASIC_BASE_CONSTRUCTION: LL;
      BASIC_BASE_EXPERT: LL;
      BASIC_BASE_PRODUCTION: LL;
      BASIC_BASE_WORKFORCE: LL;
      BASIC_COMEX: LL;
      BASIC_COMMUNITY_DISCORD: LL;
      BASIC_INTRO: LL;
      BASIC_INTRO_GUIDELINES: LL;
      BASIC_INTRO_HANDBOOK: LL;
      BASIC_INTRO_HANDBOOK_PACKAGE: LL;
      BASIC_INTRO_HELP_CHANNEL: LL;
      BASIC_INTRO_VIDEO: LL;
      BASIC_INVENTORY_TRANSFER: LL;
      BASIC_LICENSE_PRO: LL;
    };
    TemplateSelection: {
      action: {
        addCommodity: LL;
        addShipment: LL;
        cancel: LL;
        moveDown: LL;
        moveUp: LL;
        remove: LL;
        template: LL;
      };
      header: LL;
      label: {
        description: LL;
        totalInterest: LL;
      };
    };
    TemplateSelectionBuy: {
      label: {
        address: LL;
        amount: LL;
        currency: LL;
        deadline: LL;
        material: LL;
        price: LL;
        pricePerUnit: LL;
      };
    };
    TemplateSelectionLoanAnnuity: {
      label: {
        amount: LL;
        currency: LL;
        interestRate: LL;
        interval: LL & {
          info: LL;
        };
        repayment: LL;
        role: LL;
      };
    };
    TemplateSelectionLoanInterest: {
      label: {
        amount: LL;
        currency: LL;
        duration: LL;
        installments: {
          info: LL;
        };
        interestRate: LL;
        interval: LL & {
          info: LL;
        };
        role: LL;
      };
    };
    TemplateSelectionLoanStable: {
      label: {
        amount: LL;
        currency: LL;
        interestRate: LL;
        interval: LL & {
          info: LL;
        };
        repaymentRate: LL;
        role: LL;
      };
    };
    TemplateSelectionShip: {
      cargo: PL<{ weight: string; volume: string }>;
      label: {
        amount: LL;
        autoprovision: LL;
        cargo: LL;
        currency: LL;
        deadline: LL;
        destination: LL;
        material: LL;
        origin: LL;
        price: LL;
      };
    };
    TemplateType: {
      BUY: LL;
      BUY_DESC: LL;
      LOAN_ANNUITY: LL;
      LOAN_ANNUITY_DESC: LL;
      LOAN_INTEREST: LL;
      LOAN_INTEREST_DESC: LL;
      LOAN_STABLE: LL;
      LOAN_STABLE_DESC: LL;
      SELL: LL;
      SELL_DESC: LL;
      SHIP: LL;
      SHIP_DESC: LL;
    };
    TextAreaInput: {
      length: PL<{ length: string; maxLength: string }>;
    };
    Tile: {
      illegalCommand: LL;
    };
    Time: {
      days: PL<{ days: number }>;
      hours: PL<{ hours: string }>;
      minutes: PL<{ minutes: string }>;
      seconds: PL<{ seconds: string }>;
    };
    Tour: {
      BASE: {
        _1: {
          _1: LL;
          _2: LL;
          title: LL;
        };
        _2: {
          _1: LL;
          _2: LL;
          _3: LL;
          title: LL;
        };
        _3: {
          _1: LL;
          _2: LL;
          title: LL;
        };
        _4: {
          _1: LL;
          _2: LL;
          _3: LL;
          title: LL;
        };
        _5: {
          _1: LL;
          _2: LL;
          title: LL;
        };
        _6: {
          _1: LL;
          _2: LL;
          _3: LL;
          title: LL;
        };
        _7: {
          _1: LL;
          title: LL;
        };
      };
      CONTRACT: {
        _1: {
          _1: LL;
          title: LL;
        };
        _2: {
          _1: LL;
          _2: LL;
          title: LL;
        };
        _3: {
          _1: LL;
          _2: LL;
          title: LL;
        };
        _4: {
          _1: LL;
          title: LL;
        };
        _5: {
          _1: LL;
          title: LL;
        };
      };
      CX: {
        _1: {
          _1: LL;
          _2: LL;
          title: LL;
        };
        _2: {
          _1: LL;
          _2: LL;
          title: LL;
        };
        _3: {
          _1: LL;
          _2: LL;
          title: LL;
        };
        _4: {
          _1: LL;
          _2: LL;
          _3: LL;
          _4: LL;
          title: LL;
        };
        _5: {
          _1: LL;
          title: LL;
        };
        _6: {
          _1: LL;
          title: LL;
        };
      };
      FLIGHT: {
        _1: {
          _1: LL;
          _2: LL;
          title: LL;
        };
        _2: {
          _1: LL;
          _2: LL;
          _3: LL;
          title: LL;
        };
        _3: {
          _1: LL;
          _2: LL;
          title: LL;
        };
        _4: {
          _1: LL;
          _2: PL<{ code: string }>;
          title: LL;
        };
        _5: {
          _1: LL;
          _2: LL;
          title: LL;
        };
        _6: {
          _1: PL<{ code: string }>;
          _2: LL;
          _3: LL;
          _4: LL;
          title: LL;
        };
      };
      UI: {
        _1: {
          _1: LL;
          _2: LL;
          title: LL;
        };
        _10: {
          _1: LL;
          title: LL;
        };
        _11: {
          _1: LL;
          title: LL;
        };
        _12: {
          _1: LL;
          _2: LL;
          _3: PL<{ image: string }>;
          _4: LL;
          title: LL;
        };
        _2: {
          _1: PL<{ image: string }>;
          _2: LL;
          title: LL;
        };
        _3: {
          _1: LL;
          title: LL;
        };
        _4: {
          _1: PL<{ image: string }>;
          _2: LL;
          _3: LL;
          _4: LL;
          _5: LL;
          _6: LL;
          title: LL;
        };
        _5: {
          _1: LL;
          _2: LL;
          title: LL;
        };
        _6: {
          _1: LL;
          _2: LL;
          title: LL;
        };
        _7: {
          _1: LL;
          _2: LL;
          _3: LL;
          _4: LL;
          title: LL;
        };
        _8: {
          _1: LL;
          _2: LL;
          title: LL;
        };
        _9: {
          _1: LL;
          _2: LL;
          title: LL;
        };
      };
      tooltip: {
        action: {
          finish: LL;
          next: LL;
          previous: LL;
          skip: LL;
        };
        progress: PL<{ current: string; size: string }>;
      };
    };
    TrafficStats: {
      table: {
        currentPhase: LL;
        failedInoperative: LL;
        failedMissingFuel: LL;
        failedNoCapacity: LL;
        last10Phases: LL;
        lastPhase: LL;
        successful: LL;
      };
    };
    TransmissionsPanel: {
      table: {
        command: {
          view: LL;
        };
        commands: LL;
        name: LL;
        number: LL;
        profession: LL;
        t01: {
          name: LL;
        };
        t02: {
          name: LL;
        };
        t03_1: {
          name: LL;
        };
        t03_2: {
          name: LL;
        };
        t03_3: {
          name: LL;
        };
        t03_4: {
          name: LL;
        };
        t03_5: {
          name: LL;
        };
        t03_6: {
          name: LL;
        };
        t04: {
          name: LL;
        };
        t05: {
          name: LL;
        };
        t06: {
          name: LL;
        };
        t07: {
          name: LL;
        };
        t08: {
          name: LL;
        };
        t09: {
          name: LL;
        };
        t10: {
          name: LL;
        };
      };
      title: LL;
    };
    Unavailable: {
      message: PL<{ type: string }>;
    };
    UniverseMap: {
      legend: {
        heading: {
          hint: LL;
          legend: LL;
        };
        text1: LL;
      };
      setting: {
        country: {
          label: LL;
        };
        filters: {
          label: LL;
        };
        highlights: {
          label: LL;
        };
        hint: LL & {
          label: LL;
        };
        population: {
          label: LL;
        };
        resources: {
          label: LL;
        };
      };
    };
    UniverseMapPanel: {
      title: LL;
    };
    Unpack: {
      action: {
        all: LL;
        unpack1: LL;
        unpack10: LL;
        unpack5: LL;
        unpackAll: LL;
      };
      label: {
        address: LL;
        engineer: LL;
        pioneer: LL;
        scientists: LL;
        settler: LL;
        technician: LL;
        type: LL;
      };
    };
    UnpackPanel: {
      context: {
        inventory: LL;
      };
      error: {
        store: LL;
      };
      title: LL;
    };
    UpgradeInfrastructureComponent: {
      error: {
        ongoingUpgrade: LL;
      };
      label: {
        address: LL;
        constructor: LL;
        currency: LL;
        deadline: LL;
        infrastructure: LL;
        parameters: LL;
        payment: LL;
        status: LL;
      };
    };
    UpkeepInfrastructureComponent: {
      label: {
        address: LL;
        contractor: LL;
        currency: LL;
        currentUpkeepPhase: LL;
        infrastructure: LL;
        initialPeriod: LL;
        payment: LL;
        serviceLevel: LL;
        upkeepPhaseEnd: LL;
        upkeepPhases: LL;
      };
    };
    UserLicenseTile: {
      context: {
        gifting: LL;
      };
      details: LL & {
        BASIC: LL;
        FREE: PL<{ linebreak: string }>;
        PRO: LL;
      };
      expiry: LL;
      license: LL & {
        gift: LL;
        manage: LL;
      };
      title: LL;
    };
    UserList: {
      headerOffline: LL;
      headerOnline: LL;
    };
    UserOffices: {
      label: {
        current: LL;
        past: LL;
      };
      office: {
        multiple: PL<{ count: string; office: string; address: string }>;
        single: PL<{ office: string; address: string }>;
      };
    };
    UserPanel: {
      action: {
        blacklist: LL & {
          confirmation: LL;
        };
        contact: LL;
        deblacklist: LL;
        impersonate: LL;
        mute: LL & {
          confirmation: LL;
        };
        unmute: LL;
      };
      context: {
        offices: LL;
      };
      data: {
        activeDaysPerWeek: PL<{ count: number }>;
        activity: LL;
        badges: LL;
        company: LL;
        created: LL;
        gifts: LL;
        name: LL;
        online: LL & {
          no: LL;
          yes: LL;
        };
      };
      error: {
        id: PL<{ input: string }>;
      };
      title: {
        loading: LL;
      };
    };
    UserSelector: {
      input: {
        placeholder: LL;
      };
      suggestions: {
        title: {
          searchResults: LL;
          searchResults20: LL;
        };
      };
    };
    UsersOnlineCount: PL<{ count: string }>;
    UsersOnlinePanel: {
      title: LL;
      username: LL;
    };
    Validation: {
      rule: {
        integer: LL;
        matches: LL;
        max: PL<{ max: string }>;
        min: PL<{ min: string }>;
        number: LL;
        required: LL;
      };
    };
    Warehouse: {
      action: {
        cancel: PL<{ units: string }>;
        rent: PL<{ units: string }>;
      };
      availableUnits: PL<{ available: string; total: string }> & {
        unlimited: LL;
      };
      capacity: PL<{ weight: string; volume: string }>;
      command: {
        openStore: LL;
      };
      context: {
        localrules: LL;
        planet: LL;
        warehouse: LL;
      };
      error: {
        id: LL;
        nowar: LL;
      };
      fee: PL<{ fee: string; linebreak: string; collector: string }>;
      header: {
        contributions: LL;
        expansion: LL;
        storage: LL;
      };
      label: {
        address: LL;
        cancelUnits: LL;
        capacity: LL;
        command: LL;
        fee: LL & {
          info: LL;
        };
        feeCollector: LL;
        level: LL;
        locked: LL;
        maxedOut: LL;
        operator: LL;
        payment: LL;
        rentUnits: LL;
        rentableUnits: LL;
        size: LL;
        store: LL;
        units: LL;
        unitsRented: LL;
      };
      name: PL<{ address: string }>;
      size: {
        _default: LL;
      };
      status: {
        locked: LL;
        operational: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
      };
      unitsRented: PL<{ units: string; rentableUnits: string }>;
    };
    Window: {
      action: {
        close: LL & {
          alt: LL;
        };
        minimize: LL & {
          alt: LL;
        };
      };
    };
    WithCompany: {
      error: LL;
    };
    Workforce: {
      ENGINEER: LL;
      ENGINEER_TICKER: LL;
      PIONEER: LL;
      PIONEER_TICKER: LL;
      SCIENTIST: LL;
      SCIENTIST_TICKER: LL;
      SETTLER: LL;
      SETTLER_TICKER: LL;
      TECHNICIAN: LL;
      TECHNICIAN_TICKER: LL;
    };
    Workforces: {
      category: LL;
      days: LL & {
        info: LL;
      };
      essential: LL & {
        info: LL;
        yes: LL;
      };
      needs: LL;
      required: LL;
      size: LL;
      sizeCapacity: PL<{ size: string; capacity: string }>;
      total: LL & {
        info: LL;
      };
      totalSatisfaction: LL;
      unitsPer100: PL<{ units: string }>;
      unitsPerInterval: PL<{ units: string }>;
    };
    WorkforcesPanel: {
      error: {
        siteId: LL;
      };
      title: PL<{ name: string }> & {
        loading: LL;
      };
    };
    cForExPricePanelContent: {
      volume: LL;
    };
    chat: {
      messageList: {
        button: {
          loadMore: LL;
        };
        label: {
          typingUser: PL<{ users: string; count: number }>;
        };
      };
      messages: {
        banned: PL<{ user: string }>;
        deleted: PL<{ user: string }> & {
          auto: LL;
        };
        joined: PL<{ name: string }>;
        left: PL<{ name: string }>;
        read_status: LL;
        renamed: PL<{ user: string }> & {
          auto: LL;
        };
      };
    };
    comex: {
      broker: {
        info: {
          ask: LL & {
            amount: LL;
          };
          bid: LL & {
            amount: LL;
          };
          high: LL & {
            allTime: LL;
          };
          low: LL & {
            allTime: LL;
          };
          priceAverage: LL;
          traded: LL;
          volume: LL;
        };
      };
    };
    game: {
      loading: {
        categories: LL;
        channels: LL;
        company: LL;
        contracts: LL;
        corporation: LL;
        countries: LL;
        sectors: LL;
        ships: LL;
        simulation: LL;
        sites: LL;
        stars: LL;
        stores: LL;
        uidata: LL;
      };
    };
    ships: {
      action: {
        cargo: LL;
        fly_to: LL;
        fuel: LL;
        unload: LL;
        view: LL;
      };
      status: {
        stationary: LL;
      };
    };
  }
}
