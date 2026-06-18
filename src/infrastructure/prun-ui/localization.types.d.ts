export {};

declare global {
  interface PrunLocalization {
    AccountCategory: {
      // Template: Current Assets
      CURRENT_ASSETS: LiteralLocalizationLeaf;
      // Template: Equity
      EQUITY: LiteralLocalizationLeaf;
      // Template: Expenses
      EXPENSES: LiteralLocalizationLeaf;
      // Template: Fixed Assets
      FIXED_ASSETS: LiteralLocalizationLeaf;
      // Template: Liabilities
      LIABILITIES: LiteralLocalizationLeaf;
      // Template: Liquid Assets
      LIQUID_ASSETS: LiteralLocalizationLeaf;
      // Template: Revenue
      REVENUE: LiteralLocalizationLeaf;
    };
    AccountType: {
      // Template: Cash ({currencyCode})
      CASH: {
        getFormat: () => IntlMessageFormat;
        message: (options: { currencyCode: string }) => string;
      };
      // Template: Deposits ({currencyCode})
      CASH_ESCROW: {
        getFormat: () => IntlMessageFormat;
        message: (options: { currencyCode: string }) => string;
      };
      // Template: Company Headquarters Contributions
      COMPANY_HEADQUARTER_CONTRIBUTIONS: LiteralLocalizationLeaf;
      // Template: Contracts Write-off
      CONTRACT_WRITE_OFF: LiteralLocalizationLeaf;
      // Template: Currency Contribution Revenue
      CONTRIBUTION_REVENUE: LiteralLocalizationLeaf;
      // Template: Corporation Project Contributions
      CORPORATION_PROJECT_CONTRIBUTIONS: LiteralLocalizationLeaf;
      // Template: Debt
      DEBT: LiteralLocalizationLeaf;
      // Template: Dividend Income
      DIVIDEND_INCOME: LiteralLocalizationLeaf;
      // Template: General Expenses
      EXPENSE: LiteralLocalizationLeaf;
      // Template: Extraordinary Income
      EXTRAORDINARY_INCOME: LiteralLocalizationLeaf;
      // Template: Financial Write-off
      FINANCIAL_WRITE_OFF: LiteralLocalizationLeaf;
      // Template: Fixed Capital
      FIXED_CAPITAL: LiteralLocalizationLeaf;
      // Template: Currency Sales
      FOREX_EXPENSE: LiteralLocalizationLeaf;
      // Template: Currency Fluctuations
      FOREX_FLUCTUATION_EXPENSE: LiteralLocalizationLeaf;
      // Template: Currency Fluctuations
      FOREX_FLUCTUATION_REVENUE: LiteralLocalizationLeaf;
      // Template: Currency Sales
      FOREX_REVENUE: LiteralLocalizationLeaf;
      // Template: Fuel Consumption
      FUEL_CONSUMPTION: LiteralLocalizationLeaf;
      // Template: Gateway Fees
      GATEWAY_FEES: LiteralLocalizationLeaf;
      // Template: Gateway Fee Revenue
      GATEWAY_FEE_REVENUES: LiteralLocalizationLeaf;
      // Template: Government Program Fees
      GOVERNMENT_PROGRAM_FEE: LiteralLocalizationLeaf;
      // Template: Holdings
      HOLDINGS: LiteralLocalizationLeaf;
      // Template: Holdings Write-off
      HOLDINGS_WRITE_OFF: LiteralLocalizationLeaf;
      // Template: Interest Expenses
      INTEREST_EXPENSE: LiteralLocalizationLeaf;
      // Template: Interest Revenue
      INTEREST_INCOME: LiteralLocalizationLeaf;
      // Template: Inventory
      INVENTORY: LiteralLocalizationLeaf;
      // Template: Loans
      LOANS: LiteralLocalizationLeaf;
      // Template: Local Market Fee Revenue
      LOCAL_MARKET_FEE_REVENUE: LiteralLocalizationLeaf;
      // Template: Loss Carried Forward
      LOSS_CARRIED_FORWARD: LiteralLocalizationLeaf;
      // Template: Material Consumption
      MATERIAL_CONSUMPTION: LiteralLocalizationLeaf;
      // Template: Materials Delivered
      MATERIAL_DELIVERY: LiteralLocalizationLeaf;
      // Template: Materials in Escrow
      MATERIAL_ESCROW: LiteralLocalizationLeaf;
      // Template: Material Sales
      MATERIAL_SALE_REVENUE: LiteralLocalizationLeaf;
      // Template: Payables
      PAYABLES: LiteralLocalizationLeaf;
      // Template: Planetary Project Contributions
      PLANETARY_PROJECT_CONTRIBUTIONS: LiteralLocalizationLeaf;
      // Template: Base Sections
      PLATFORMS: LiteralLocalizationLeaf;
      // Template: Production Fees
      PRODUCTION_FEES: LiteralLocalizationLeaf;
      // Template: Production Fee Revenue
      PRODUCTION_FEE_REVENUE: LiteralLocalizationLeaf;
      // Template: Profit Carried Forward
      PROFIT_CARRIED_FORWARD: LiteralLocalizationLeaf;
      // Template: Receipt of Materials
      RECEIPT_OF_GOODS: LiteralLocalizationLeaf;
      // Template: Receivables
      RECEIVABLES: LiteralLocalizationLeaf;
      // Template: Receivable Materials
      RECEIVABLE_MATERIALS: LiteralLocalizationLeaf;
      // Template: APEX Representation Center Contributions
      REPRESENTATION_CENTER_CONTRIBUTIONS: LiteralLocalizationLeaf;
      // Template: General Revenue
      REVENUE: LiteralLocalizationLeaf;
      // Template: Ships
      SHIPS: LiteralLocalizationLeaf;
      // Template: Ship Maintenance
      SHIP_MAINTENANCE: LiteralLocalizationLeaf;
      // Template: Bases
      SITES: LiteralLocalizationLeaf;
      // Template: Depreciation of Buildings
      SITE_DEPRECIATION: LiteralLocalizationLeaf;
      // Template: Base Establishment Fees
      SITE_ESTABLISHMENT_TAXES: LiteralLocalizationLeaf;
      // Template: Base Establishment Fee Revenue
      SITE_ESTABLISHMENT_TAXES_REVENUE: LiteralLocalizationLeaf;
      // Template: Subscribed Capital
      SUBSCRIBED_CAPITAL: LiteralLocalizationLeaf;
      // Template: Transaction Fees
      TRANSACTION_FEES: LiteralLocalizationLeaf;
      // Template: Transport Expenses
      TRANSPORT_EXPENSES: LiteralLocalizationLeaf;
      // Template: Transport Revenue
      TRANSPORT_REVENUE: LiteralLocalizationLeaf;
      // Template: Warehouse Storage Fee Revenue
      WAREHOUSE_FEE_REVENUE: LiteralLocalizationLeaf;
      // Template: Warehouse Storage Fees
      WAREHOUSE_STORAGE_FEE: LiteralLocalizationLeaf;
      // Template: Worker Supplies
      WORKER_SUPPLIES: LiteralLocalizationLeaf;
    };
    ActionComponent: {
      action: {
        // Template: Confirm
        confirm: LiteralLocalizationLeaf;
      };
    };
    ActionFeedback: {
      // Template: Cancel
      cancel: LiteralLocalizationLeaf;
      // Template: Confirmation required
      confirmation: LiteralLocalizationLeaf;
      // Template: (click to dismiss)
      dismiss: LiteralLocalizationLeaf;
      // Template: in progress…
      inprogress: LiteralLocalizationLeaf;
      // Template: Action succeeded!
      success: LiteralLocalizationLeaf;
    };
    ActionStatus: {
      // Template: No local rule changes left in this term.
      ADMIN_CENTER_NO_RULE_CHANGES_LEFT: LiteralLocalizationLeaf;
      // Template: You don't have voting rights on this planet.
      ADMIN_CENTER_NO_VOTING_RIGHTS: LiteralLocalizationLeaf;
      // Template: The voting phase cannot be started, because it would end after the government's term ends.
      ADMIN_CENTER_VOTE_END_AFTER_TERM_END: LiteralLocalizationLeaf;
      // Template: Authentication failed.
      AUTHENTICATION_FAILED: LiteralLocalizationLeaf;
      // Template: To execute this action a PRO license is necessary.
      AUTHORIZATION_FAILED: LiteralLocalizationLeaf;
      // Template: Account does not exist.
      AUTH_LOGIN_ACCOUNT_NOT_FOUND: LiteralLocalizationLeaf;
      // Template: Login failed for unknown reason.
      AUTH_LOGIN_FAILED: LiteralLocalizationLeaf;
      // Template: Wrong password.
      AUTH_LOGIN_PASSWORD_INVALID: LiteralLocalizationLeaf;
      // Template: You do not have access permissions for this instance.
      AUTH_LOGIN_PERMISSION_DENIED: LiteralLocalizationLeaf;
      // Template: You have been blocked by the user.
      BLOCKLIST_BLOCKED: LiteralLocalizationLeaf;
      // Template: Channel already joined.
      CHAT_ALREADY_JOINED: LiteralLocalizationLeaf;
      // Template: No permission to post in this channel.
      CHAT_NOT_ALLOWED_ADD_MESSAGE: LiteralLocalizationLeaf;
      // Template: No permission to add users to this channel.
      CHAT_NOT_ALLOWED_ADD_USER: LiteralLocalizationLeaf;
      // Template: No read permission in this channel.
      CHAT_NOT_ALLOWED_READ_INFORMATION: LiteralLocalizationLeaf;
      // Template: No permission to read messages in this channel.
      CHAT_NOT_ALLOWED_READ_MESSAGES: LiteralLocalizationLeaf;
      // Template: No permission to see user list in this channel.
      CHAT_NOT_ALLOWED_READ_USERS: LiteralLocalizationLeaf;
      // Template: Not a member of this channel.
      CHAT_NOT_JOINED: LiteralLocalizationLeaf;
      // Template: Channel does not exist.
      CHAT_NO_SUCH_CHANNEL: LiteralLocalizationLeaf;
      // Template: You don't have the permission to post an order outside the broker's price band!
      COMEX_BROKER_LIMIT_OUTSIDE_PRICE_BAND: LiteralLocalizationLeaf;
      // Template: Order already exists.
      COMEX_BROKER_ORDER_EXISTS: LiteralLocalizationLeaf;
      // Template: Cannot place order that would match existing own order.
      COMEX_BROKER_ORDER_SPREAD_NEGATIVE: LiteralLocalizationLeaf;
      // Template: You have reached the maximum amount of unfilled orders for this broker.
      COMEX_BROKER_TOO_MANY_ORDERS: LiteralLocalizationLeaf;
      // Template: Invalid ticker.
      COMEX_TICKER_INVALID: LiteralLocalizationLeaf;
      // Template: Order not found.
      COMEX_TRADER_ORDER_ID_INVALID: LiteralLocalizationLeaf;
      // Template: Please provide a storage location.
      COMEX_TRADER_ORDER_STORE_REQUIRED: LiteralLocalizationLeaf;
      // Template: The limit of active contracts has been reached.
      CONTRACT_ACTIVE_CONTRACT_LIMIT_REACHED: LiteralLocalizationLeaf;
      // Template: Contract condition not found.
      CONTRACT_CONDITION_ID_INVALID: LiteralLocalizationLeaf;
      // Template: Condition currently cannot be fulfilled.
      CONTRACT_CONDITION_UNFULFILLABLE: LiteralLocalizationLeaf;
      // Template: Contract not found.
      CONTRACT_ID_INVALID: LiteralLocalizationLeaf;
      // Template: Invalid contract status.
      CONTRACT_STATUS_INVALID: LiteralLocalizationLeaf;
      // Template: You need a base on the planet to contribute.
      CONTRIBUTIONS_NO_SITE_ON_PLANET: LiteralLocalizationLeaf;
      // Template: Company has already been invited.
      CORPORATION_COMPANY_ALREADY_INVITED: LiteralLocalizationLeaf;
      // Template: Company is already member of a corporation.
      CORPORATION_COMPANY_ALREADY_SHAREHOLDER: LiteralLocalizationLeaf;
      // Template: This action requires Corporation Headquarters.
      CORPORATION_MANAGER_NO_HQ: LiteralLocalizationLeaf;
      // Template: The project limit has been exceeded.
      CORPORATION_MANAGER_PROJECT_LIMIT_EXCEEDED: LiteralLocalizationLeaf;
      // Template: Invited company is already member of a corporation.
      CORPORATION_SHAREHOLDER_CORPORATION_EXISTS: LiteralLocalizationLeaf;
      // Template: Company is already member of a corporation.
      CORPORATION_SHAREHOLDER_HOLDING_EXISTS: LiteralLocalizationLeaf;
      // Template: Company is not member of a corporation.
      CORPORATION_SHAREHOLDER_NO_CORPORATION: LiteralLocalizationLeaf;
      // Template: Country ID invalid.
      COUNTRY_ID_INVALID: LiteralLocalizationLeaf;
      // Template: This code is already taken.
      ENTITY_CODE_EXISTS: LiteralLocalizationLeaf;
      // Template: Entity ID validation failed.
      ENTITY_ID_VALIDATION_FAILED: LiteralLocalizationLeaf;
      // Template: This name is already taken.
      ENTITY_NAME_EXISTS: LiteralLocalizationLeaf;
      // Template: You have reached the maximum amount of unfilled orders for this broker.
      FOREX_BROKER_TOO_MANY_ORDERS: LiteralLocalizationLeaf;
      // Template: Invalid order id.
      FOREX_TRADER_ORDER_ID_INVALID: LiteralLocalizationLeaf;
      // Template: Illegal order limit.
      FOREX_TRADER_ORDER_LIMIT_ILLEGAL: LiteralLocalizationLeaf;
      // Template: Cannot place order that would match existing own order.
      FOREX_TRADER_ORDER_SPREAD_ILLEGAL: LiteralLocalizationLeaf;
      // Template: Illegal arguments.
      ILLEGAL_ARGUMENTS: LiteralLocalizationLeaf;
      // Template: Insufficient inventory.
      INVENTORY_INSUFFICIENT: LiteralLocalizationLeaf;
      // Template: You reached the ad acceptation limit, try again later.
      LOCAL_MARKET_ACCEPTION_RATE_LIMIT: LiteralLocalizationLeaf;
      // Template: This local market ad has expired.
      LOCAL_MARKET_AD_EXPIRED: LiteralLocalizationLeaf;
      // Template: You cannot accept this ad, because its creator has blocked you.
      LOCAL_MARKET_BLACKLIST_ACCEPTION: LiteralLocalizationLeaf;
      // Template: You need a base or warehouse unit on the planet to post an ad.
      LOCAL_MARKET_MISSING_SITE: LiteralLocalizationLeaf;
      // Template: Origin and destination cannot be the same location.
      LOCAL_MARKET_ORIGIN_DESTINATION_EQUAL: LiteralLocalizationLeaf;
      // Template: Either origin or destination has to be the location of the local market.
      LOCAL_MARKET_ORIGIN_DESTINATION_INVALID: LiteralLocalizationLeaf;
      // Template: You cannot accept your own ads.
      LOCAL_MARKET_OWN_AD_ACCEPTION: LiteralLocalizationLeaf;
      // Template: Invalid amount.
      MONEY_AMOUNT_INVALID: LiteralLocalizationLeaf;
      // Template: Currencies do not match.
      MONEY_CURRENCY_MISMATCH: LiteralLocalizationLeaf;
      // Template: Insufficient cash.
      MONEY_INSUFFICIENT: LiteralLocalizationLeaf;
      // Template: The chosen name is already taken.
      NAMING_NAME_TAKEN: LiteralLocalizationLeaf;
      // Template: Nothing found.
      NOT_FOUND: LiteralLocalizationLeaf;
      // Template: There is no free plot on the planet to build the project.
      PLANET_NO_FREE_PLOT: LiteralLocalizationLeaf;
      // Template: This type of site is not allowed on the planet.
      PLANET_SITE_TYPE_NOT_ALLOWED: LiteralLocalizationLeaf;
      // Template: Order not found.
      PRODUCTION_ORDER_ID_INVALID: LiteralLocalizationLeaf;
      // Template: Order has already been started.
      PRODUCTION_ORDER_STARTED: LiteralLocalizationLeaf;
      // Template: Invalid recipe.
      PRODUCTION_RECIPE_INVALID: LiteralLocalizationLeaf;
      // Template: No production slot available.
      PRODUCTION_SLOT_LIMIT_REACHED: LiteralLocalizationLeaf;
      // Template: Your company's rating is insufficient
      RATING_INSUFFICIENT: LiteralLocalizationLeaf;
      // Template: Routing failed.
      ROUTING_FAILED: LiteralLocalizationLeaf;
      // Template: This project was already started and cannot be deleted anymore.
      SHIPYARD_PROJECT_IN_PROGRESS: LiteralLocalizationLeaf;
      // Template: Materials have already been paid for this project. Remove them before deleting it.
      SHIPYARD_PROJECT_MATERIALS_PAID: LiteralLocalizationLeaf;
      // Template: No difference between the selected blueprints.
      SHIPYARD_SAME_BLUEPRINTS: LiteralLocalizationLeaf;
      // Template: The selected ship is already being upgraded.
      SHIPYARD_SHIP_ALREADY_UPGRADING: LiteralLocalizationLeaf;
      // Template: The selected ship's inventory or fuel tanks are not empty.
      SHIPYARD_SHIP_NOT_EMPTY: LiteralLocalizationLeaf;
      // Template: The selected ship's blueprint is different from the upgrade project's origin blueprint.
      SHIPYARD_WRONG_SHIP_BLUEPRINT: LiteralLocalizationLeaf;
      // Template: Repairing a ship requires a base or shipyard.
      SHIP_ILLEGAL_REPAIR_LOCATION: LiteralLocalizationLeaf;
      // Template: Route is invalid.
      SHIP_INVALID_ROUTE_ES_324: LiteralLocalizationLeaf;
      // Template: Ship is in transit.
      SHIP_IN_TRANSIT: LiteralLocalizationLeaf;
      // Template: Failure to launch, the ship is currently not operational.
      SHIP_NOT_OPERATIONAL: LiteralLocalizationLeaf;
      // Template: Flight not found.
      SHIP_NO_SUCH_FLIGHT: LiteralLocalizationLeaf;
      // Template: Ship not found.
      SHIP_NO_SUCH_SHIP: LiteralLocalizationLeaf;
      // Template: Failure to launch, there are currently too many ships now in flight. Upgrade to a PRO license for unlimited flight options.
      SHIP_TOO_MANY_FLIGHTS: LiteralLocalizationLeaf;
      // Template: You cannot demolish a base with an expanded area.
      SITE_DEMOLISH_EXPANDED_AREA_IMPOSSIBLE: LiteralLocalizationLeaf;
      // Template: You have to empty your base's storage first.
      SITE_DEMOLISH_FILLED_STORAGE_IMPOSSIBLE: LiteralLocalizationLeaf;
      // Template: You cannot demolish your HQ.
      SITE_DEMOLISH_HQ_IMPOSSIBLE: LiteralLocalizationLeaf;
      // Template: You have to demolish all other buildings first.
      SITE_DEMOLISH_WITH_BUILDINGS_IMPOSSIBLE: LiteralLocalizationLeaf;
      // Template: You already have a base on this planet.
      SITE_EXISTS: LiteralLocalizationLeaf;
      // Template: Module not found.
      SITE_MODULE_ID_INVALID: LiteralLocalizationLeaf;
      // Template: No free plots available.
      SITE_NO_FREE_PLOTS: LiteralLocalizationLeaf;
      // Template: Illegal build option.
      SITE_PLATFORM_BUILD_OPTION_ILLEGAL: LiteralLocalizationLeaf;
      // Template: Platform not found.
      SITE_PLATFORM_ID_INVALID: LiteralLocalizationLeaf;
      // Template: Platform already in use.
      SITE_PLATFORM_NOT_EMPTY: LiteralLocalizationLeaf;
      // Template: Reactor is currently in use.
      SITE_REACTOR_IN_USE: LiteralLocalizationLeaf;
      // Template: Too close to existing site.
      SITE_TOO_CLOSE: LiteralLocalizationLeaf;
      // Template: No base or warehouse storage found.
      STORAGE_NO_FIXED_STORE_FOUND: LiteralLocalizationLeaf;
      // Template: Storage location not found.
      STORAGE_STORE_NOT_FOUND: LiteralLocalizationLeaf;
      // Template: Material transfer impossible.
      STORAGE_TRANSFER_IMPOSSIBLE: LiteralLocalizationLeaf;
      // Template: Failed to receive transfer.
      STORAGE_TRANSFER_RECEIVE_FAILED: LiteralLocalizationLeaf;
      // Template: Insufficient capacity.
      STORE_CAPACITY_INSUFFICIENT: LiteralLocalizationLeaf;
      // Template: Insufficient materials.
      STORE_QUANTITY_INSUFFICIENT: LiteralLocalizationLeaf;
      // Template: Your APEX license does not allow the registration of single-letter company codes.
      USER_CREATE_COMPANY_1_LETTER_CODE_PERK_REQUIRED: LiteralLocalizationLeaf;
      // Template: Your APEX license does not allow the registration of 2-letter company codes.
      USER_CREATE_COMPANY_2_LETTER_CODE_PERK_REQUIRED: LiteralLocalizationLeaf;
      // Template: You already have a company.
      USER_CREATE_COMPANY_EXISTS: LiteralLocalizationLeaf;
      // Template: You are not eligible to gift PRO license time
      USER_LICENSE_GIVER_INELIGIBLE: LiteralLocalizationLeaf;
      // Template: You do not have enough PRO license time left to gift the selected amount
      USER_LICENSE_INSUFFICIENT_BALANCE: LiteralLocalizationLeaf;
      // Template: The selected license gift recipient is invalid
      USER_LICENSE_INVALID_TARGET: LiteralLocalizationLeaf;
      // Template: Gifting PRO license time is not supported.
      USER_LICENSE_UNSUPPORTED: LiteralLocalizationLeaf;
      // Template: You reached the maximum amount of allowed storage units for this warehouse.
      WAREHOUSE_MAXIMUM_UNITS_REACHED: LiteralLocalizationLeaf;
      // Template: The warehouse store needs to be empty before it can be cancelled.
      WAREHOUSE_NOT_EMPTY: LiteralLocalizationLeaf;
      // Template: The warehouse fee has not been fully paid yet.
      WAREHOUSE_NOT_PAID: LiteralLocalizationLeaf;
    };
    ActionsPanel: {
      table: {
        // Template: ID
        id: LiteralLocalizationLeaf;
        // Template: Action Type
        type: LiteralLocalizationLeaf;
      };
    };
    AdStatus: {
      // Template: accepted
      ACCEPTED: LiteralLocalizationLeaf;
      // Template: breached
      BREACHED: LiteralLocalizationLeaf;
      // Template: expired
      EXPIRED: LiteralLocalizationLeaf;
      // Template: fulfilled
      FULFILLED: LiteralLocalizationLeaf;
      // Template: open
      OPEN: LiteralLocalizationLeaf;
    };
    AddUser: {
      form: {
        // Template: add
        add: LiteralLocalizationLeaf;
        // Template: cancel
        cancel: LiteralLocalizationLeaf;
        // Template: Add user
        header: LiteralLocalizationLeaf;
        // Template: Username
        username: LiteralLocalizationLeaf;
      };
    };
    AddressConditionEditForm: {
      form: {
        // Template: Address
        address: LiteralLocalizationLeaf;
      };
    };
    AddressLabel: {
      // Template: {address} (orbit)
      withOrbit: {
        getFormat: () => IntlMessageFormat;
        message: (options: { address: string }) => string;
      };
      // Template: {address}
      withoutOrbit: {
        getFormat: () => IntlMessageFormat;
        message: (options: { address: string }) => string;
      };
    };
    AddressSelector: {
      input: {
        // Template: Enter location
        placeholder: LiteralLocalizationLeaf;
      };
      suggestions: {
        title: {
          // Template: Search results
          searchResults: LiteralLocalizationLeaf;
          // Template: Search results (20+)
          searchResults20: LiteralLocalizationLeaf;
        };
      };
    };
    AdminCenter: {
      // Template: Location
      address: LiteralLocalizationLeaf;
      context: {
        // Template: Admin Center
        admincenter: LiteralLocalizationLeaf;
        // Template: Government
        government: LiteralLocalizationLeaf;
        // Template: Local Rules
        localrules: LiteralLocalizationLeaf;
        // Template: Planet
        planet: LiteralLocalizationLeaf;
      };
      // Template: Currency
      currency: LiteralLocalizationLeaf;
      current: {
        // Template: End
        end: LiteralLocalizationLeaf;
        // Template: Governor
        governor: LiteralLocalizationLeaf;
        // Template: Members of Parliament
        membersOfParliament: LiteralLocalizationLeaf;
        // Template: Parliament size
        parliamentSize: {
          // Template: The more bases a planet has, the higher the number of parliament seats. Parliament seats will be distributed among candidates who received the most votes, with the top one becoming the governor. With the approval vote system every voter can vote for as many candidates as they approve of.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Start
        start: LiteralLocalizationLeaf;
        // Template: Term
        term: LiteralLocalizationLeaf;
      };
      currentTerm: {
        // Template: No active term yet.
        noterm: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No administration center found for input {input}.
        id: {
          getFormat: () => IntlMessageFormat;
          message: (options: { input: string }) => string;
        };
        // Template: This planet has no administration center.
        noadm: LiteralLocalizationLeaf;
        // Template: Error loading administration center.
        notFound: LiteralLocalizationLeaf;
      };
      previous: {
        // Template: Term end
        ended: LiteralLocalizationLeaf;
        governor: {
          // Template: Governor
          name: LiteralLocalizationLeaf;
        };
        // Template: Members of Parliament
        membersOfParliament: LiteralLocalizationLeaf;
        // Template: Term
        naturalId: LiteralLocalizationLeaf;
      };
      section: {
        // Template: Current term
        currentTerm: LiteralLocalizationLeaf;
        // Template: Previous terms
        previousTerms: LiteralLocalizationLeaf;
        // Template: Upcoming term
        upcomingTerm: LiteralLocalizationLeaf;
      };
      // Template: Administration center: {name}
      title: {
        // Template: Administration Center
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
      upcoming: {
        action: {
          // Template: run
          run: LiteralLocalizationLeaf;
          // Template: vote
          vote: LiteralLocalizationLeaf;
          // Template: withdraw
          withdraw: LiteralLocalizationLeaf;
          // Template: withdraw
          withdrawVote: LiteralLocalizationLeaf;
        };
        candidate: {
          // Template: Command
          command: LiteralLocalizationLeaf;
          // Template: Corporation
          corporation: LiteralLocalizationLeaf;
          // Template: Faction
          country: LiteralLocalizationLeaf;
          // Template: Candidate
          name: LiteralLocalizationLeaf;
        };
        // Template: Election end
        electionEnd: LiteralLocalizationLeaf;
        // Template: Election start
        electionStart: LiteralLocalizationLeaf;
        // Template: Parliament size
        parliamentSize: LiteralLocalizationLeaf;
      };
    };
    AdminCenterTermVotes: {
      candidate: {
        // Template: Corporation
        corporation: LiteralLocalizationLeaf;
        // Template: Faction
        country: LiteralLocalizationLeaf;
        // Template: Candidate
        name: LiteralLocalizationLeaf;
        // Template: Votes
        votes: LiteralLocalizationLeaf;
      };
    };
    AgentPreamble: {
      // Template: Faction Contract Offers{br}~~~~~~~~~~~~~~~~~~~~~~~{br}You received a series of contract offers from your faction. Feel free to accept one of them to boost your faction reputation. As soon as you accept one the others will get cancelled.{br}
      intro: {
        getFormat: () => IntlMessageFormat;
        message: (options: { br: string }) => string;
      };
      introductory: {
        // Template: On behalf of {country} I wish you and your company the best of success. We are eager to follow your endeavors from here on out.{br}At this point you should have gone through basic APEX training. I will now provide you with a set of tasks to make sure you are able to navigate your command interface at a sufficient level of proficiency. Should you pass, I will regularly forward you requests from faction ambassadors and representatives that may help you generate some additional funds.{br}First things first, to become a valuable asset to our faction you need to get your production running. Click the 'START BASE' button on your starting screen to found your first base, which will automatically be declared your company headquarters for now.{br}Once you are done, APEX will guide you to build a few recommended starting buildings. Then I will get back to you!
        baseConstruction: {
          getFormat: () => IntlMessageFormat;
          message: (options: { country: string; br: string }) => string;
        };
        // Template: Your expansion package is ready for collection. The {country} is confident in your ability to lead your company to success and to support its future endeavors.{br}{br}As a gesture of goodwill, once you have established your new base, you will be eligible to receive additional consumables for your workforce, as well as a founding bonus.{br}{br}Maintain your current performance, continue trading, and consider further expansion when appropriate. The faction will continue to provide contract offers on a regular basis. However, responsibility for developing your core business now rests solely with you.
        baseConstructionII: {
          getFormat: () => IntlMessageFormat;
          message: (options: { country: string; br: string }) => string;
        };
        // Template: Now that you are all set up in APEX, keep working towards scaling up your business.{br}One of the first steps you should look into is constructing additional buildings that either expand your existing production lines or add new ones.{br}Explore your base's construction menu and the commodities each building can produce. Keep in mind you will need to acquire the necessary input materials, either by producing them yourself or buying them from other companies on the market. And do not forget about expanding your workforce housing if necessary, as well as providing enough consumables.
        buildingConstruction: {
          getFormat: () => IntlMessageFormat;
          message: (options: { br: string }) => string;
        };
        // Template: The representatives of {country} have been observing your progress with satisfaction.{br}While you are likely already attending to this, they want to ensure that your workers’ needs are being met. Submit an invoice for a consumable purchase, and I will confirm your reliability to them.{br}The faction will reimburse the fuel required to collect the goods and return them to your base.
        buyConsumables: {
          getFormat: () => IntlMessageFormat;
          message: (options: { country: string; br: string }) => string;
        };
        // Template: channel
        channel: LiteralLocalizationLeaf;
        // Template: It is time to expand your operations. Consider carefully where you wish to establish an additional base.{br}The faction is currently assembling an expansion package. In the meantime, proceed to the think tank and develop an expansion plan. I will contact you once the package is ready.{br}The {map} is a useful tool for identifying a suitable location. You may also want to consult fellow CEOs via your planet’s {comPlanet} or the global help {comHelp}.{br}Note: Planets with extreme environmental conditions require specialized building materials, which must be supplied by you. Please refer to the APEX handbook for further details.
        findExpansionSpot: {
          // Template: map
          map: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: {
            br: string;
            map: string;
            comPlanet: string;
            comHelp: string;
          }) => string;
        };
        // Template: Alright, the last thing we will need to check is if your trading interface works properly.{br}Just ping me later by fulfilling this contract!{br}In the meantime, you may want to explore the APEX handbook and find out about politics, planetary projects, local markets or ship building. There are a lot of advanced features to be explored and plans to be made for the future of your career and your company!
        finishFlight: {
          getFormat: () => IntlMessageFormat;
          message: (options: { br: string }) => string;
        };
        // Template: Over the coming days, the faction would like you to demonstrate your value. As a first step, I will begin sending you contracts on a regular basis. You will typically be able to choose one of three. Select the options that best balance effort and reward within your daily routine.
        fulfillCountryContracts: LiteralLocalizationLeaf;
        // Template: Your company is performing well. The faction considers reinvesting your hard-earned profits into luxury consumables for your workforce to be a highly effective strategy. This will increase satisfaction and morale, leading to greater production efficiency.{br}Raise at least one {workforce} satisfaction level above 80%, and we can begin discussing major expansion efforts.
        increaseSatisfaction: {
          // Template: workforce
          workforce: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: { br: string; workforce: string }) => string;
        };
        // Template: Before investing more resources to scale your startup, the faction wants you to demonstrate your business savvy.{br}Keep trading on the commodity exchanges, or take on a few shipping contracts. Once you’ve proven your capability, they’ll get back to you.
        makeMoney: {
          getFormat: () => IntlMessageFormat;
          message: (options: { br: string }) => string;
        };
        // Template: Thank you for the reminder! We should test one final component before we can integrate your company into the regular faction task process. Go buy or sell any item at a commodity exchange and let me know when you are done!{br}Note that I will also grant your company account a first faction reputation point. These points are a measure of your faction services and will make officials consider granting you more substantial payments in the future.{br}In any case, you seem to be getting the hang of APEX pretty quickly! I will collect a few "real" tasks now that need to get done within the faction and will get back to you soon.
        placeOrder: {
          getFormat: () => IntlMessageFormat;
          message: (options: { br: string }) => string;
        };
        // Template: Good! Now, I need to check in on a few other startup companies, but I will get back to you with more tasks when your production run is done.{br}Just ping me later by fulfilling this contract!{br}In the meantime, feel free to chat with other APEX users (find your communication channels you have access to via the "COM" button on the left) or explore additional resources via the HELP command. You may also want to look into more involved commodities to produce in the future. Your production chains will not stay this basic forever!
        productionOrderCompleted: {
          getFormat: () => IntlMessageFormat;
          message: (options: { br: string }) => string;
        };
        // Template: You should have set up habitations for your pioneers and a few production facilities at this point. Now check if everything is working properly by starting your first production order!{br}Make sure you have enough consumables and input material in your base's inventory.
        productionRun: {
          getFormat: () => IntlMessageFormat;
          message: (options: { br: string }) => string;
        };
        // Template: Seems like everything is in order.{br}We are almost done here. Now send a ship on a mission to check whether communication works properly.{br}A good first destination might be the nearby commodity exchange station, where you could sell your first produced items and resupply with consumables.
        startFlight: {
          getFormat: () => IntlMessageFormat;
          message: (options: { br: string }) => string;
        };
      };
      // Template: {br}Mission description{br}~~~~~~~~~~~~~~~~~~~{br}
      mission: {
        // Template: {country} decided to incentivize contributions to public infrastructure at {address} for faction-strategic reasons. This includes contributions to building costs of public projects as well as their upkeep. {deadline}
        contribution: {
          // Template: This initiative will not last forever though.
          deadline: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: { country: string; address: string; deadline: string }) => string;
        };
        // Template: A {country} colonization ship is currently en route to visit several faction planets and bases and will soon come by your current headquarters location. The crew is building additional core modules right now to expand the faction's reach even further. If you can provide the required materials in time, the faction will show its gratitude.
        expansion: {
          getFormat: () => IntlMessageFormat;
          message: (options: { country: string }) => string;
        };
        // Template: {country} continues to build a universal data library. Send a ship to this planet and hand in any environment data your sensors pick up.
        exploration: {
          getFormat: () => IntlMessageFormat;
          message: (options: { country: string }) => string;
        };
        // Template: {country}'s faction strategy involves a focus on ships in a push to become known for the biggest and most impressive fleets across the universe. If you manage to expand your fleet soon, you will receive additional support. Please make sure the {country} badge is clearly visible on the hull.
        fleet: {
          getFormat: () => IntlMessageFormat;
          message: (options: { country: string }) => string;
        };
        // Template: A {country} transporter delivering food supplies to colonies in need is passing by your {planet} base soon. Make sure to provision the shipment in time so it can be picked up on the way.
        food: {
          getFormat: () => IntlMessageFormat;
          message: (options: { country: string; planet: string }) => string;
        };
        // Template: A big media outlet will soon broadcast their faction rankings. One of the rankings will be based on the conditions of randomly selected ships among the faction. Make sure your assets are in perfect condition.
        maintenance: LiteralLocalizationLeaf;
        // Template: A {country} transporter is passing by your {planet} base soon and has space for more commodities. Make sure to provision the shipment in time so it can be picked up on the way.
        materials: {
          getFormat: () => IntlMessageFormat;
          message: (options: { country: string; planet: string }) => string;
        };
        // Template: As you are well aware, {country} is always looking to expand its influence throughout the universe. If you can manage to get elected to govern a planet, this will go right along with these plans.
        power: {
          getFormat: () => IntlMessageFormat;
          message: (options: { country: string }) => string;
        };
        // Template: We need you to pick up and deliver a shipment of materials. {country} officials have already provisioned the container and will be taking it off your hands on site. {deadline}
        shipping: {
          // Template: This is urgent, so make sure to get started on this soon.
          deadline: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: { country: string; deadline: string }) => string;
        };
        // Template: At the moment, {country} is trying to establish a prosperous future for all its companies. Therefore, they support investments into administrative structures. This program will only be active for a limited time though.
        upgrade: {
          getFormat: () => IntlMessageFormat;
          message: (options: { country: string }) => string;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: { br: string }) => string;
      };
      // Template: (this contract)
      thisContract: LiteralLocalizationLeaf;
    };
    Alert: {
      // Template: The election on {planetName} is nearing its end.
      ADMIN_CENTER_ELECTION_REMINDER: {
        getFormat: () => IntlMessageFormat;
        message: (options: { planetName: string }) => string;
      };
      // Template: The election at {planetName} has started.
      ADMIN_CENTER_ELECTION_STARTED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { planetName: string }) => string;
      };
      // Template: A new government has been elected at {planetName}.
      ADMIN_CENTER_GOVERNOR_ELECTED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { planetName: string }) => string;
      };
      // Template: Motion {motionId} / '{motionName}' {motionStatus}.
      ADMIN_CENTER_MOTION_ENDED: {
        getFormat: () => IntlMessageFormat;
        message: (options: {
          motionId: string;
          motionName: string;
          motionStatus: string;
        }) => string;
      };
      // Template: A new motion '{motionName}' has passed at {address}.
      ADMIN_CENTER_MOTION_PASSED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { motionName: string; address: string }) => string;
      };
      // Template: The voting for motion {motionId} / '{motionName}' has started.
      ADMIN_CENTER_MOTION_VOTING_STARTED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { motionId: string; motionName: string }) => string;
      };
      // Template: The election at {planetName} has ended, but no government was elected.
      ADMIN_CENTER_NO_GOVERNOR_ELECTED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { planetName: string }) => string;
      };
      // Template: Your run for an office at {planetName} has been successful.
      ADMIN_CENTER_RUN_SUCCEEDED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { planetName: string }) => string;
      };
      // Template: The Chamber of Global Commerce at {planetName} started a new economic program: {programName}.
      COGC_PROGRAM_CHANGED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { planetName: string; programName: string }) => string;
      };
      // Template: The Chamber of Global Commerce at {planetName} went on strike since the required upkeep has not been contributed.
      COGC_STATUS_CHANGED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { planetName: string }) => string;
      };
      // Template: The Chamber of Global Commerce at {planetName} started a new upkeep phase.
      COGC_UPKEEP_STARTED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { planetName: string }) => string;
      };
      // Template: {commodity} order filled at {exchangeName}.
      COMEX_ORDER_FILLED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { commodity: string; exchangeName: string }) => string;
      };
      // Template: A contract for pickup of {commodity} has been created at {exchangeName}.
      COMEX_PICKUP_CONTRACT_CREATED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { commodity: string; exchangeName: string }) => string;
      };
      // Template: {trades, plural, one {A trade} other {{trades} trades}} took place for your {commodity} order at {exchangeName}.
      COMEX_TRADE: {
        getFormat: () => IntlMessageFormat;
        message: (options: { trades: string; commodity: string; exchangeName: string }) => string;
      };
      // Template: {partner} fulfilled a contract condition for contract {contract}: {conditionType}.
      CONTRACT_CONDITION_FULFILLED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { partner: string; contract: string; conditionType: string }) => string;
      };
      // Template: You have not yet picked up the materials from contract {contract}.
      CONTRACT_CONDITION_PICKUP_CONDITION_PENDING: {
        getFormat: () => IntlMessageFormat;
        message: (options: { contract: string }) => string;
      };
      // Template: The contract with {partner} has been breached.
      CONTRACT_CONTRACT_BREACHED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { partner: string }) => string;
      };
      // Template: The contract with {partner} has been cancelled.
      CONTRACT_CONTRACT_CANCELLED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { partner: string }) => string;
      };
      // Template: The contract '{contract}' with {partner} has been closed.
      CONTRACT_CONTRACT_CLOSED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { contract: string; partner: string }) => string;
      };
      // Template: The contract with {partner} has been extended.
      CONTRACT_CONTRACT_EXTENDED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { partner: string }) => string;
      };
      // Template: Received contract '{contract}' from {partner}.
      CONTRACT_CONTRACT_RECEIVED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { contract: string; partner: string }) => string;
      };
      // Template: {partner} has rejected your contract offer '{contract}'.
      CONTRACT_CONTRACT_REJECTED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { partner: string; contract: string }) => string;
      };
      // Template: Contract '{contract}' with partner {partner} has been terminated.
      CONTRACT_CONTRACT_TERMINATED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { contract: string; partner: string }) => string;
      };
      // Template: {partner} requested the termination of the contract '{contract}'.
      CONTRACT_CONTRACT_TERMINATION_REQUESTED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { partner: string; contract: string }) => string;
      };
      // Template: The contract with {partner} is about to be breached. {partner} must take action to allow or deny an extension.
      CONTRACT_DEADLINE_EXCEEDED_WITHOUT_CONTROL: {
        getFormat: () => IntlMessageFormat;
        message: (options: { partner: string }) => string;
      };
      // Template: The contract with {partner} is about to be breached. Your action is required to allow or deny an extension.
      CONTRACT_DEADLINE_EXCEEDED_WITH_CONTROL: {
        getFormat: () => IntlMessageFormat;
        message: (options: { partner: string }) => string;
      };
      // Template: {inviteeName} have accepted our invitation to become a shareholder of {corporationName}.
      CORPORATION_MANAGER_INVITE_ACCEPTED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { inviteeName: string; corporationName: string }) => string;
      };
      // Template: {inviteeName} have decided to reject our invitation to become a shareholder of {corporationName}.
      CORPORATION_MANAGER_INVITE_REJECTED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { inviteeName: string; corporationName: string }) => string;
      };
      // Template: {companyName} have decided to leave our corporation {corporationName}.
      CORPORATION_MANAGER_SHAREHOLDER_LEFT: {
        getFormat: () => IntlMessageFormat;
        message: (options: { companyName: string; corporationName: string }) => string;
      };
      // Template: The corporation project '{type}' at {address} has been finished.
      CORPORATION_PROJECT_FINISHED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { type: string; address: string }) => string;
      };
      // Template: You have received a dividend payout from your corporation {corporationName}.
      CORPORATION_SHAREHOLDER_DIVIDEND_RECEIVED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { corporationName: string }) => string;
      };
      // Template: You have received an invitation to become a shareholder of {corporationName}.
      CORPORATION_SHAREHOLDER_INVITE_RECEIVED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { corporationName: string }) => string;
      };
      // Template: {pair} order filled.
      FOREX_ORDER_FILLED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { pair: string }) => string;
      };
      // Template: {trades, plural, one {A trade} other {{trades} trades}} took place for your {pair} order.
      FOREX_TRADE: {
        getFormat: () => IntlMessageFormat;
        message: (options: { trades: string; pair: string }) => string;
      };
      // Template: Ship {ship} aborted the gateway jump at {address}: gateway link changed.
      GATEWAY_JUMP_ABORTED_LINK_CHANGED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { ship: string; address: string }) => string;
      };
      // Template: Ship {ship} aborted the gateway jump at {address}: gateway link not established.
      GATEWAY_JUMP_ABORTED_LINK_NOT_ESTABLISHED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { ship: string; address: string }) => string;
      };
      // Template: Ship {ship} aborted the gateway jump at {address}: missing gateway fee funds.
      GATEWAY_JUMP_ABORTED_MISSING_FUNDS: {
        getFormat: () => IntlMessageFormat;
        message: (options: { ship: string; address: string }) => string;
      };
      // Template: Ship {ship} aborted the gateway jump at {address}: gateway not operational.
      GATEWAY_JUMP_ABORTED_NOT_OPERATIONAL: {
        getFormat: () => IntlMessageFormat;
        message: (options: { ship: string; address: string }) => string;
      };
      // Template: Ship {ship} aborted the gateway jump at {address}: no jump capacity available.
      GATEWAY_JUMP_ABORTED_NO_CAPACITY: {
        getFormat: () => IntlMessageFormat;
        message: (options: { ship: string; address: string }) => string;
      };
      // Template: Ship {ship} aborted the gateway jump at {address}: no gateway fuel available.
      GATEWAY_JUMP_ABORTED_NO_FUEL: {
        getFormat: () => IntlMessageFormat;
        message: (options: { ship: string; address: string }) => string;
      };
      // Template: A link between gateway {gateway} and {otherGateway} has been established.
      GATEWAY_LINK_ESTABLISHED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { gateway: string; otherGateway: string }) => string;
      };
      // Template: Received link request for gateway {destinationGateway} from gateway {originGateway} @ {originAddress}.
      GATEWAY_LINK_REQUEST_RECEIVED: {
        getFormat: () => IntlMessageFormat;
        message: (options: {
          destinationGateway: string;
          originGateway: string;
          originAddress: string;
        }) => string;
      };
      // Template: The link between gateway {gateway} and {otherGateway} has been removed.
      GATEWAY_LINK_UNLINKED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { gateway: string; otherGateway: string }) => string;
      };
      // Template: The operational state of {type} infrastructure {address} changed to {state}.
      INFRASTRUCTURE_OPERATIONAL_STATE_CHANGED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { type: string; address: string; state: string }) => string;
      };
      // Template: The infrastructure project {type} at {address} has been finished.
      INFRASTRUCTURE_PROJECT_COMPLETED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { type: string; address: string }) => string;
      };
      // Template: The upgrade of {type} {infrastructure} has been completed.
      INFRASTRUCTURE_UPGRADE_COMPLETED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { type: string; infrastructure: string }) => string;
      };
      // Template: The {type} {infrastructure} at {address} started upkeep phase {naturalId}.
      INFRASTRUCTURE_UPKEEP_PHASE_STARTED: {
        getFormat: () => IntlMessageFormat;
        message: (options: {
          type: string;
          infrastructure: string;
          address: string;
          naturalId: string;
        }) => string;
      };
      // Template: Your ad at the {addressName} local market has been accepted by {partner}.
      LOCAL_MARKET_AD_ACCEPTED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { addressName: string; partner: string }) => string;
      };
      // Template: Your ad at the {addressName} local market has expired.
      LOCAL_MARKET_AD_EXPIRED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { addressName: string }) => string;
      };
      // Template: The planetary project '{project}' at {address} has been finished.
      PLANETARY_PROJECT_FINISHED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { project: string; address: string }) => string;
      };
      // Template: The population infrastructure project {type} at {address} has been upgraded to level {level}.
      POPULATION_PROJECT_UPGRADED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { type: string; address: string; level: string }) => string;
      };
      // Template: A new population report for {address} is available.
      POPULATION_REPORT_AVAILABLE: {
        getFormat: () => IntlMessageFormat;
        message: (options: { address: string }) => string;
      };
      // Template: {quantity, plural, one {One unit} other {{quantity} units}} of {material} have been produced at your base on {address}.
      PRODUCTION_ORDER_FINISHED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { quantity: string; material: string; address: string }) => string;
      };
      // Template: There is a new version of APEX. Click here to read the release notes.
      RELEASE_NOTES: LiteralLocalizationLeaf;
      // Template: Shipbuilding project at {address} completed.
      SHIPYARD_PROJECT_FINISHED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { address: string }) => string;
      };
      // Template: Ship {registration} arrived at its destination {destination}.
      SHIP_FLIGHT_ENDED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { registration: string; destination: string }) => string;
      };
      // Template: A new {category} expert arrived at your base on {address}.
      SITE_EXPERT_DROPPED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { category: string; address: string }) => string;
      };
      // Template: Tutorial task fulfilled. Click here to see your current progress!
      TUTORIAL_TASK_FINISHED: LiteralLocalizationLeaf;
      // Template: Did you know a PRO or BASIC license grants you access to advanced features of APEX? Click to learn more!
      USER_CONVERSION_REMINDER_LICENSE: LiteralLocalizationLeaf;
      // Template: Your APEX license is expiring soon. Please consider renewing it!
      USER_LICENSE_ABOUT_TO_EXPIRE: LiteralLocalizationLeaf;
      // Template: Your APEX license has expired. Please consider renewing it!
      USER_LICENSE_EXPIRED: LiteralLocalizationLeaf;
      // Template: You received {amount, plural, one {one day} other {{amount} days}} of PRO license time from {user}.
      USER_LICENSE_GIFT_RECEIVED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { amount: string; user: string }) => string;
      };
      // Template: Help out by posting a Steam review!
      USER_STEAM_REVIEW: LiteralLocalizationLeaf;
      // Template: Your warehouse storage unit at {address} has been locked due to insufficient funds for its weekly fee.
      WAREHOUSE_STORE_LOCKED_INSUFFICIENT_FUNDS: {
        getFormat: () => IntlMessageFormat;
        message: (options: { address: string }) => string;
      };
      // Template: Your warehouse storage unit at {address} has been unlocked.
      WAREHOUSE_STORE_UNLOCKED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { address: string }) => string;
      };
      // Template: Welcome licensee! Click here to get started with the APEX console!
      WELCOME: LiteralLocalizationLeaf;
      // Template: Consumable supplies at {address} are running low.
      WORKFORCE_LOW_SUPPLIES: {
        getFormat: () => IntlMessageFormat;
        message: (options: { address: string }) => string;
      };
      // Template: The workforce at {address} is out of supplies.
      WORKFORCE_OUT_OF_SUPPLIES: {
        getFormat: () => IntlMessageFormat;
        message: (options: { address: string }) => string;
      };
      // Template: The workforce at {address} is unsatisfied.
      WORKFORCE_UNSATISFIED: {
        getFormat: () => IntlMessageFormat;
        message: (options: { address: string }) => string;
      };
    };
    AlertType: {
      // Template: Election ending
      ADMIN_CENTER_ELECTION_REMINDER: LiteralLocalizationLeaf;
      // Template: Election started
      ADMIN_CENTER_ELECTION_STARTED: LiteralLocalizationLeaf;
      // Template: New governor elected
      ADMIN_CENTER_GOVERNOR_ELECTED: LiteralLocalizationLeaf;
      // Template: Motion ended
      ADMIN_CENTER_MOTION_ENDED: LiteralLocalizationLeaf;
      // Template: New motion
      ADMIN_CENTER_MOTION_PASSED: LiteralLocalizationLeaf;
      // Template: Motion voting started
      ADMIN_CENTER_MOTION_VOTING_STARTED: LiteralLocalizationLeaf;
      // Template: No governor elected
      ADMIN_CENTER_NO_GOVERNOR_ELECTED: LiteralLocalizationLeaf;
      // Template: Run for governor succeeded.
      ADMIN_CENTER_RUN_SUCCEEDED: LiteralLocalizationLeaf;
      // Template: CoGC program changed
      COGC_PROGRAM_CHANGED: LiteralLocalizationLeaf;
      // Template: CoGC status changed
      COGC_STATUS_CHANGED: LiteralLocalizationLeaf;
      // Template: CoGC upkeep phase started
      COGC_UPKEEP_STARTED: LiteralLocalizationLeaf;
      // Template: CX order filled
      COMEX_ORDER_FILLED: LiteralLocalizationLeaf;
      // Template: CX pickup contract created
      COMEX_PICKUP_CONTRACT_CREATED: LiteralLocalizationLeaf;
      // Template: CX trade
      COMEX_TRADE: LiteralLocalizationLeaf;
      // Template: Contract condition fulfilled.
      CONTRACT_CONDITION_FULFILLED: LiteralLocalizationLeaf;
      // Template: Pickup contract condition is pending.
      CONTRACT_CONDITION_PICKUP_CONDITION_PENDING: LiteralLocalizationLeaf;
      // Template: Contract breached
      CONTRACT_CONTRACT_BREACHED: LiteralLocalizationLeaf;
      // Template: Contract cancelled
      CONTRACT_CONTRACT_CANCELLED: LiteralLocalizationLeaf;
      // Template: Contract closed
      CONTRACT_CONTRACT_CLOSED: LiteralLocalizationLeaf;
      // Template: Contract extended
      CONTRACT_CONTRACT_EXTENDED: LiteralLocalizationLeaf;
      // Template: Contract received
      CONTRACT_CONTRACT_RECEIVED: LiteralLocalizationLeaf;
      // Template: Contract rejected
      CONTRACT_CONTRACT_REJECTED: LiteralLocalizationLeaf;
      // Template: Contract terminated
      CONTRACT_CONTRACT_TERMINATED: LiteralLocalizationLeaf;
      // Template: Contract termination requested
      CONTRACT_CONTRACT_TERMINATION_REQUESTED: LiteralLocalizationLeaf;
      // Template: Contract extension deadline exceeded
      CONTRACT_DEADLINE_EXCEEDED_WITHOUT_CONTROL: LiteralLocalizationLeaf;
      // Template: Contract extension deadline exceeded (action required)
      CONTRACT_DEADLINE_EXCEEDED_WITH_CONTROL: LiteralLocalizationLeaf;
      // Template: Acceptance of Corporation invite
      CORPORATION_MANAGER_INVITE_ACCEPTED: LiteralLocalizationLeaf;
      // Template: Rejection of Corporation invite
      CORPORATION_MANAGER_INVITE_REJECTED: LiteralLocalizationLeaf;
      // Template: Member left corporation
      CORPORATION_MANAGER_SHAREHOLDER_LEFT: LiteralLocalizationLeaf;
      // Template: Corporation project finished
      CORPORATION_PROJECT_FINISHED: LiteralLocalizationLeaf;
      // Template: Corporation dividend payout received
      CORPORATION_SHAREHOLDER_DIVIDEND_RECEIVED: LiteralLocalizationLeaf;
      // Template: Corporation invite received
      CORPORATION_SHAREHOLDER_INVITE_RECEIVED: LiteralLocalizationLeaf;
      // Template: FX order filled
      FOREX_ORDER_FILLED: LiteralLocalizationLeaf;
      // Template: FX trade
      FOREX_TRADE: LiteralLocalizationLeaf;
      // Template: Gateway jump aborted (link changed)
      GATEWAY_JUMP_ABORTED_LINK_CHANGED: LiteralLocalizationLeaf;
      // Template: Gateway jump aborted (link not established)
      GATEWAY_JUMP_ABORTED_LINK_NOT_ESTABLISHED: LiteralLocalizationLeaf;
      // Template: Gateway jump aborted (missing funds)
      GATEWAY_JUMP_ABORTED_MISSING_FUNDS: LiteralLocalizationLeaf;
      // Template: Gateway jump aborted (not operational)
      GATEWAY_JUMP_ABORTED_NOT_OPERATIONAL: LiteralLocalizationLeaf;
      // Template: Gateway jump aborted (no jump capacity)
      GATEWAY_JUMP_ABORTED_NO_CAPACITY: LiteralLocalizationLeaf;
      // Template: Gateway jump aborted (missing gateway fuel)
      GATEWAY_JUMP_ABORTED_NO_FUEL: LiteralLocalizationLeaf;
      // Template: Gateway linked
      GATEWAY_LINK_ESTABLISHED: LiteralLocalizationLeaf;
      // Template: Link request received
      GATEWAY_LINK_REQUEST_RECEIVED: LiteralLocalizationLeaf;
      // Template: Gateway unlinked
      GATEWAY_LINK_UNLINKED: LiteralLocalizationLeaf;
      // Template: Infrastructure operational state changed
      INFRASTRUCTURE_OPERATIONAL_STATE_CHANGED: LiteralLocalizationLeaf;
      // Template: Infrastructure project completed
      INFRASTRUCTURE_PROJECT_COMPLETED: LiteralLocalizationLeaf;
      // Template: Infrastructure upgrade completed
      INFRASTRUCTURE_UPGRADE_COMPLETED: LiteralLocalizationLeaf;
      // Template: Infrastructure upkeep phase started
      INFRASTRUCTURE_UPKEEP_PHASE_STARTED: LiteralLocalizationLeaf;
      // Template: Local market ad accepted
      LOCAL_MARKET_AD_ACCEPTED: LiteralLocalizationLeaf;
      // Template: Local market ad expired
      LOCAL_MARKET_AD_EXPIRED: LiteralLocalizationLeaf;
      // Template: Planetary project finished
      PLANETARY_PROJECT_FINISHED: LiteralLocalizationLeaf;
      // Template: Population infrastructure upgraded
      POPULATION_PROJECT_UPGRADED: LiteralLocalizationLeaf;
      // Template: Population report available
      POPULATION_REPORT_AVAILABLE: LiteralLocalizationLeaf;
      // Template: Production order completed
      PRODUCTION_ORDER_FINISHED: LiteralLocalizationLeaf;
      // Template: Release Notes
      RELEASE_NOTES: LiteralLocalizationLeaf;
      // Template: Shipbuilding project finished
      SHIPYARD_PROJECT_FINISHED: LiteralLocalizationLeaf;
      // Template: Ship arrived
      SHIP_FLIGHT_ENDED: LiteralLocalizationLeaf;
      // Template: New expert arrived
      SITE_EXPERT_DROPPED: LiteralLocalizationLeaf;
      // Template: Tutorial quest fulfilled
      TUTORIAL_TASK_FINISHED: LiteralLocalizationLeaf;
      // Template: License offer
      USER_CONVERSION_REMINDER_LICENSE: LiteralLocalizationLeaf;
      // Template: License expired
      USER_LICENSE_ABOUT_TO_EXPIRE: LiteralLocalizationLeaf;
      // Template: License about to expire
      USER_LICENSE_EXPIRED: LiteralLocalizationLeaf;
      // Template: License gift received
      USER_LICENSE_GIFT_RECEIVED: LiteralLocalizationLeaf;
      // Template: Review request
      USER_STEAM_REVIEW: LiteralLocalizationLeaf;
      // Template: Warehouse storage locked
      WAREHOUSE_STORE_LOCKED_INSUFFICIENT_FUNDS: LiteralLocalizationLeaf;
      // Template: Warehouse storage unlocked
      WAREHOUSE_STORE_UNLOCKED: LiteralLocalizationLeaf;
      // Template: Workforce low on supplies
      WORKFORCE_LOW_SUPPLIES: LiteralLocalizationLeaf;
      // Template: Workforce out of supplies
      WORKFORCE_OUT_OF_SUPPLIES: LiteralLocalizationLeaf;
      // Template: Workforce unsatisfied
      WORKFORCE_UNSATISFIED: LiteralLocalizationLeaf;
    };
    AlertsHeadItem: {
      // Template: NOTS {count}
      notifications: {
        // Template: Notifications
        tooltip: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { count: string }) => string;
      };
    };
    ApexMobile: {
      text: {
        // Template: Happy trading!
        trading: LiteralLocalizationLeaf;
        // Template: Welcome, licensee!
        welcome: LiteralLocalizationLeaf;
        // Template: You are currently using APEX on a mobile device and thus experiencing our experimental branch of APEX. Please note that this version is under development and does not yet support all the functionality (esp. maps) you are used to from the regular version of APEX.
        welcome2: LiteralLocalizationLeaf;
      };
    };
    ApexMobilePanel: {
      // Template: Welcome to APEX Mobile
      title: LiteralLocalizationLeaf;
    };
    AreaCost: {
      // Template: {cost} / {available} {error}
      cost: {
        getFormat: () => IntlMessageFormat;
        message: (options: { cost: string; available: string; error: string }) => string;
      };
      // Template: Not enough free area
      error: LiteralLocalizationLeaf;
    };
    Assets: {
      action: {
        // Template: store
        construct: LiteralLocalizationLeaf;
        // Template: view
        view: LiteralLocalizationLeaf;
      };
      header: {
        // Template: Constructed
        constructed: LiteralLocalizationLeaf;
        // Template: Own
        own: LiteralLocalizationLeaf;
        // Template: Under construction
        underConstruction: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Location
        address: LiteralLocalizationLeaf;
        // Template: Constructor
        _constructor: LiteralLocalizationLeaf;
        // Template: Created
        created: LiteralLocalizationLeaf;
        // Template: Established
        established: LiteralLocalizationLeaf;
        // Template: Owner
        owner: LiteralLocalizationLeaf;
        // Template: Progress
        progress: LiteralLocalizationLeaf;
        // Template: Type
        type: LiteralLocalizationLeaf;
      };
    };
    AssetsPanel: {
      // Template: Assets
      title: LiteralLocalizationLeaf;
    };
    AvailableSites: {
      // Template: {free} / {total}{ghost}
      plots: {
        getFormat: () => IntlMessageFormat;
        message: (options: { free: string; total: string; ghost: string }) => string;
      };
    };
    Badge: {
      description: {
        // Template: This rare badge is only granted to the most generous benefactors in the new worlds. The significance of their service to APEX cannot be overstated. Limited availability!
        cluster: LiteralLocalizationLeaf;
        // Template: This badge is granted to all licensees who have made a small monetary contribution to APEX and thus to humanity's second shot at a thriving civilization. Still available in unlimited quantities!
        comet: LiteralLocalizationLeaf;
        // Template: A particularly beautiful badge which identifies its holder as a member of APEX's top elite. Limited availability!
        galaxy: LiteralLocalizationLeaf;
        // Template: This badge identifies community moderators. Feel free to contact them if you have any questions or witnessed any suspicious behavior.
        moderator: LiteralLocalizationLeaf;
        // Template: This badge identifies avid believers in APEX and its vital role in the history and future of our species. Still available in unlimited quantities!
        moon: LiteralLocalizationLeaf;
        // Template: Holders of this badge have been among the very first to conquer the new worlds. This badge has only been granted 300 times and can no longer be obtained.
        pioneer: LiteralLocalizationLeaf;
        // Template: This badge is given only to true believers in APEX and its cause. Holding it grants the ability to choose a two-letter company code. Limited availability!
        planet: LiteralLocalizationLeaf;
        // Template: This prestigious badge decorates some of the most high-profile licensees. Their generous contributions keep all of our companies going day by day. Limited availability!
        star: LiteralLocalizationLeaf;
        // Template: A legendary badge which grants its abundantly generous wearer the ability to choose a 1-letter code for their company. Available exactly 21 times from now until all of the suns blow up.
        supercluster: LiteralLocalizationLeaf;
        // Template: This badge identifies members of the APEX development team. They act as moderators within APEX; please comply with their requests.
        team: LiteralLocalizationLeaf;
        // Template: Holders of this badge are part of the community translators team. They translate APEX into various languages.
        translator: LiteralLocalizationLeaf;
        // Template: The rarest and most prestigious of all badges. The names of their wearers will be found on statues and in history books throughout the new systems for centuries to come. Available exactly five times!
        universe: LiteralLocalizationLeaf;
      };
      name: {
        // Template: Supporter: Cluster
        cluster: LiteralLocalizationLeaf;
        // Template: Supporter: Comet
        comet: LiteralLocalizationLeaf;
        // Template: Supporter: Galaxy
        galaxy: LiteralLocalizationLeaf;
        // Template: Moderator
        moderator: LiteralLocalizationLeaf;
        // Template: Supporter: Moon
        moon: LiteralLocalizationLeaf;
        // Template: Pioneer
        pioneer: LiteralLocalizationLeaf;
        // Template: Supporter: Planet
        planet: LiteralLocalizationLeaf;
        // Template: Supporter: Star
        star: LiteralLocalizationLeaf;
        // Template: Supporter: Supercluster
        supercluster: LiteralLocalizationLeaf;
        // Template: Team
        team: LiteralLocalizationLeaf;
        // Template: Translator
        translator: LiteralLocalizationLeaf;
        // Template: Supporter: Universe
        universe: LiteralLocalizationLeaf;
      };
    };
    BadgesPanel: {
      // Template: Badges
      title: LiteralLocalizationLeaf;
    };
    BalanceStatementPanel: {
      // Template: Change
      change: LiteralLocalizationLeaf;
      // Template: Failed to generate balance statement.
      error: LiteralLocalizationLeaf;
      period: {
        // Template: Current Period
        current: LiteralLocalizationLeaf;
        // Template: Last Period
        last: LiteralLocalizationLeaf;
        // Template: Previous Period
        previous: LiteralLocalizationLeaf;
      };
      // Template: Balance Statement
      title: LiteralLocalizationLeaf;
      // Template: Total
      total: LiteralLocalizationLeaf;
    };
    Base_construction: {
      error: {
        // Template: Could not find location.
        planetId: LiteralLocalizationLeaf;
      };
    };
    BillOfMaterials: {
      // Template: in stock
      inStock: LiteralLocalizationLeaf;
      // Template: {amount} missing
      missing: {
        getFormat: () => IntlMessageFormat;
        message: (options: { amount: string }) => string;
      };
    };
    BlackListedUsers: {
      actions: {
        // Template: Unblock User
        deblacklist: LiteralLocalizationLeaf;
      };
    };
    BlacklistedUsers: {
      table: {
        // Template: Cmds
        commands: LiteralLocalizationLeaf;
        // Template: Blocked since
        time: LiteralLocalizationLeaf;
        // Template: Username
        user: LiteralLocalizationLeaf;
      };
      // Template: Local Market Blocklist
      title: LiteralLocalizationLeaf;
    };
    Blueprint: {
      action: {
        // Template: discard
        discard: LiteralLocalizationLeaf;
        // Template: save
        save: LiteralLocalizationLeaf;
      };
      banner: {
        // Template: This blueprint is locked because it was used to create a shipbuilding project. Therefore you cannot edit or delete it anymore.
        locked: LiteralLocalizationLeaf;
      };
      // Template: ~{buildTime}h
      buildTime: {
        getFormat: () => IntlMessageFormat;
        message: (options: { buildTime: string }) => string;
      };
      header: {
        // Template: Construction
        billofmaterial: LiteralLocalizationLeaf;
        // Template: Information
        information: LiteralLocalizationLeaf;
        // Template: Layout
        layout: LiteralLocalizationLeaf;
        // Template: Performance
        performance: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Estimated build time
        buildTime: LiteralLocalizationLeaf;
        // Template: Created
        created: LiteralLocalizationLeaf;
        // Template: Bill of material
        materials: LiteralLocalizationLeaf;
        // Template: Ship type
        shipType: LiteralLocalizationLeaf;
      };
    };
    BlueprintComponentType: {
      CARGO_BAY: {
        // Template: Cargo bay
        name: LiteralLocalizationLeaf;
        // Template: Determines the total weight and volume of commodities the ship can carry.
        tooltip: LiteralLocalizationLeaf;
      };
      COMMAND_BRIDGE: {
        // Template: Command Bridge
        name: LiteralLocalizationLeaf;
        // Template: Certain engines and reactors require an advanced command bridge to be controlled.
        tooltip: LiteralLocalizationLeaf;
      };
      CREW_QUARTERS: {
        // Template: Crew quarters
        name: LiteralLocalizationLeaf;
        // Template: Every ship needs a place for its crew to live, sleep and eat in.
        tooltip: LiteralLocalizationLeaf;
      };
      FTL_FIELD_CONTROLLER: {
        // Template: FTL Field Controller
        name: LiteralLocalizationLeaf;
        // Template: A required component if the ship is supposed to be able to perform FTL jumps.
        tooltip: LiteralLocalizationLeaf;
      };
      FTL_FIELD_EMITTER_LARGE: {
        // Template: Large FTL emitter
        name: LiteralLocalizationLeaf;
        // Template: To perform FTL jumps, the ship needs to create an FTL field around itself. The larger the ship, the more volume its emitters need to span. Charging the emitters takes up some reactor power.
        tooltip: LiteralLocalizationLeaf;
      };
      FTL_FIELD_EMITTER_MEDIUM: {
        // Template: Medium FTL emitter
        name: LiteralLocalizationLeaf;
        // Template: To perform FTL jumps, the ship needs to create an FTL field around itself. The larger the ship, the more volume its emitters need to span. Charging the emitters takes up some reactor power.
        tooltip: LiteralLocalizationLeaf;
      };
      FTL_FIELD_EMITTER_SMALL: {
        // Template: Small FTL emitter
        name: LiteralLocalizationLeaf;
        // Template: To perform FTL jumps, the ship needs to create an FTL field around itself. The larger the ship, the more volume its emitters need to span. Charging the emitters takes up some reactor power.
        tooltip: LiteralLocalizationLeaf;
      };
      FTL_FUEL_TANK: {
        // Template: FTL fuel tank
        name: LiteralLocalizationLeaf;
        // Template: Determines how much FTL fuel the ship will be able to hold.
        tooltip: LiteralLocalizationLeaf;
      };
      FTL_REACTOR: {
        // Template: FTL Reactor
        name: LiteralLocalizationLeaf;
        // Template: Affects the ship’s power, i.e. maximum speed gain from overcharging during FTL. More powerful reactors generally take longer to charge. Overcharging a reactor increases the damage taken during FTL flight.
        tooltip: LiteralLocalizationLeaf;
      };
      GRAVITY_SHIELD: {
        // Template: Stability System
        name: LiteralLocalizationLeaf;
        // Template: Prevents taking damage from landing on planets with unusually high or low gravity.
        tooltip: LiteralLocalizationLeaf;
      };
      HABITATION_MODULE: {
        // Template: Habitation Modules
        name: LiteralLocalizationLeaf;
        // Template: Colony ships require an additional habitation module to support their crew on long missions.
        tooltip: LiteralLocalizationLeaf;
      };
      HEAT_SHIELD: {
        // Template: Heat shielding
        name: LiteralLocalizationLeaf;
        // Template: Reduces the damage taken from entering a planet’s atmosphere.
        tooltip: LiteralLocalizationLeaf;
      };
      HIGH_G_SEATS: {
        // Template: High-G Seats
        name: LiteralLocalizationLeaf;
        // Template: Increases the maximum g-factor the ship can endure, thus increasing its maximum speed during STL flight.
        tooltip: LiteralLocalizationLeaf;
      };
      HULL_TYPE: {
        // Template: Hull plates
        name: LiteralLocalizationLeaf;
        // Template: Hull plates differ in how well they shield the ship from damage, the maximum g-factor they can support, as well as their weight.
        tooltip: LiteralLocalizationLeaf;
      };
      RADIATION_SHIELD: {
        // Template: Radiation Shielding
        name: LiteralLocalizationLeaf;
        // Template: Reduces the damage taken from STL flight close to high-radiation stars.
        tooltip: LiteralLocalizationLeaf;
      };
      REPAIR_DRONES: {
        // Template: Self-repair Drone Hub
        name: LiteralLocalizationLeaf;
        // Template: Reduces the damage taken from any source.
        tooltip: LiteralLocalizationLeaf;
      };
      STL_ENGINE: {
        // Template: STL Engine
        name: LiteralLocalizationLeaf;
        // Template: Affects the ship’s thrust, i.e. maximum acceleration during STL flight, and its rate of STL fuel consumption.
        tooltip: LiteralLocalizationLeaf;
      };
      STL_FUEL_TANK: {
        // Template: STL fuel tank
        name: LiteralLocalizationLeaf;
        // Template: Determines how much STL fuel the ship will be able to hold.
        tooltip: LiteralLocalizationLeaf;
      };
      STRUCTURE: {
        // Template: Structure
        name: LiteralLocalizationLeaf;
        // Template: The different ship parts are held together by structural components. The larger the ship, the more of those are required.
        tooltip: LiteralLocalizationLeaf;
      };
      VORTEX_FUEL_TANK: {
        // Template: Vortex fuel tank
        name: LiteralLocalizationLeaf;
        // Template: Determines how much Vortex fuel the ship will be able to hold.
        tooltip: LiteralLocalizationLeaf;
      };
      VORTEX_REACTOR: {
        // Template: Vortex reactor
        name: LiteralLocalizationLeaf;
        // Template: A special reactor for colony ships making use of certain aspects of gateway travel technology.
        tooltip: LiteralLocalizationLeaf;
      };
      WHIPPLE_SHIELD: {
        // Template: Whipple Shielding
        name: LiteralLocalizationLeaf;
        // Template: Reduces the damage taken from STL flight through meteoroid-dense systems.
        tooltip: LiteralLocalizationLeaf;
      };
    };
    BlueprintStatus: {
      // Template: IN PROGRESS
      IN_PROGRESS: LiteralLocalizationLeaf;
      // Template: LOCKED
      LOCKED: LiteralLocalizationLeaf;
      // Template: VALID
      VALID: LiteralLocalizationLeaf;
    };
    BlueprintTestFlight: {
      label: {
        // Template: Blueprint
        blueprint: LiteralLocalizationLeaf;
        // Template: Condition
        condition: LiteralLocalizationLeaf;
        // Template: Destination
        destination: LiteralLocalizationLeaf;
        // Template: FTL fuel
        ftlFuel: LiteralLocalizationLeaf;
        // Template: FTL preferences
        ftlPreferences: LiteralLocalizationLeaf;
        // Template: Fuel usage
        fuelUsage: LiteralLocalizationLeaf;
        // Template: Origin
        origin: LiteralLocalizationLeaf;
        // Template: Inventory
        payload: LiteralLocalizationLeaf;
        // Template: Reactor usage
        reactorUsage: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
        // Template: STL Fuel
        stlFuel: LiteralLocalizationLeaf;
      };
    };
    BlueprintTestFlightPanel: {
      error: {
        // Template: No blueprint found.
        blueprintId: LiteralLocalizationLeaf;
      };
      title: {
        // Template: Blueprint Test Flight
        loading: LiteralLocalizationLeaf;
      };
    };
    Blueprints: {
      actions: {
        // Template: copy
        copy: LiteralLocalizationLeaf;
        // Template: Create new
        create: LiteralLocalizationLeaf;
        // Template: delete
        _delete: LiteralLocalizationLeaf;
        // Template: test
        test: LiteralLocalizationLeaf;
        // Template: View
        view: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No blueprint found.
        blueprint: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Cmds
        commands: LiteralLocalizationLeaf;
        // Template: Created
        creationTime: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
      };
      title: {
        // Template: Blueprint
        blueprint: LiteralLocalizationLeaf;
        // Template: Blueprints
        blueprints: LiteralLocalizationLeaf;
      };
    };
    BookingType: {
      // Template: Deposit for commodity exchange order
      COMEX_DEPOSIT: LiteralLocalizationLeaf;
      // Template: Refund of commodity exchange order deposit
      COMEX_DEPOSIT_REFUND: LiteralLocalizationLeaf;
      // Template: Commodity order deletion fees
      COMEX_ORDER_DELETION_FEES: LiteralLocalizationLeaf;
      // Template: Refund of commodity order deletion fees
      COMEX_ORDER_DELETION_FEES_ROLLBACK: LiteralLocalizationLeaf;
      // Template: Contractual payment paid
      CONTRACT_PAYMENT_PAID: LiteralLocalizationLeaf;
      // Template: Contractual payment received
      CONTRACT_PAYMENT_RECEIVED: LiteralLocalizationLeaf;
      // Template: Corporation dividend received
      CORPORATION_DIVIDEND: LiteralLocalizationLeaf;
      // Template: Corporation founded
      CORPORATION_FORMATION: LiteralLocalizationLeaf;
      // Template: Purchase of corporation shares
      CORPORATION_INVESTMENT: LiteralLocalizationLeaf;
      // Template: Direct payment
      DIRECT_PAYMENT_PAID: LiteralLocalizationLeaf;
      // Template: Direct payment
      DIRECT_PAYMENT_RECEIVED: LiteralLocalizationLeaf;
      // Template: Deposit for foreign exchange order
      FOREX_DEPOSIT: LiteralLocalizationLeaf;
      // Template: Refund of foreign exchange order deposit
      FOREX_DEPOSIT_REFUND: LiteralLocalizationLeaf;
      // Template: Currencies purchased
      FOREX_PURCHASE: LiteralLocalizationLeaf;
      // Template: Currencies sold
      FOREX_SALE: LiteralLocalizationLeaf;
      // Template: Gateway fee
      GATEWAY_FEE: LiteralLocalizationLeaf;
      // Template: Gateway fee refund
      GATEWAY_FEE_REFUND: LiteralLocalizationLeaf;
      // Template: Revenue from gateway fees
      GATEWAY_FEE_REVENUES: LiteralLocalizationLeaf;
      // Template: Government program fees
      GOVERNMENT_PROGRAM_FEE: LiteralLocalizationLeaf;
      // Template: Refund of government program fees
      GOVERNMENT_PROGRAM_FEE_ROLLBACK: LiteralLocalizationLeaf;
      // Template: Starting capital
      INITIAL_FUNDS: LiteralLocalizationLeaf;
      // Template: Starting materials
      INITIAL_MATERIALS: LiteralLocalizationLeaf;
      // Template: Loan failure
      LOAN_FAILURE: LiteralLocalizationLeaf;
      // Template: Loan installment paid
      LOAN_INSTALLMENT_PAID: LiteralLocalizationLeaf;
      // Template: Loan installment received
      LOAN_INSTALLMENT_RECEIVED: LiteralLocalizationLeaf;
      // Template: Loan payout paid
      LOAN_PAYOUT_PAID: LiteralLocalizationLeaf;
      // Template: Loan payout received
      LOAN_PAYOUT_RECEIVED: LiteralLocalizationLeaf;
      // Template: Loan write off
      LOAN_WRITE_OFF: LiteralLocalizationLeaf;
      // Template: Local market fee
      LOCAL_MARKET_FEE: LiteralLocalizationLeaf;
      // Template: Revenue from local market fees
      LOCAL_MARKET_FEE_REVENUES: LiteralLocalizationLeaf;
      // Template: Consumed materials
      MATERIAL_CONSUMPTION: LiteralLocalizationLeaf;
      // Template: Materials purchased
      MATERIAL_PURCHASE: LiteralLocalizationLeaf;
      // Template: Received materials
      MATERIAL_RECEIVED: LiteralLocalizationLeaf;
      // Template: Materials sold
      MATERIAL_SALE: LiteralLocalizationLeaf;
      // Template: Section construction costs
      PLATFORM_BUILT: LiteralLocalizationLeaf;
      // Template: Section written off
      PLATFORM_REMOVED: LiteralLocalizationLeaf;
      // Template: Production fee
      PRODUCTION_FEE: LiteralLocalizationLeaf;
      // Template: Production fee refund
      PRODUCTION_FEE_REFUND: LiteralLocalizationLeaf;
      // Template: Revenue from production fees
      PRODUCTION_FEE_REVENUES: LiteralLocalizationLeaf;
      // Template: APEX Representation Center contribution
      REPRESENTATION_CENTER_CONTRIBUTION: LiteralLocalizationLeaf;
      // Template: Base establishment fee
      SITE_ESTABLISHMENT_FEE: LiteralLocalizationLeaf;
      // Template: Revenue from base establishment fees
      SITE_ESTABLISHMENT_FEE_REVENUES: LiteralLocalizationLeaf;
      // Template: Revenue from warehouse storage fees
      WAREHOUSE_FEE_REVENUES: LiteralLocalizationLeaf;
      // Template: Supplies consumed by workforce
      WORKER_SUPPLIES: LiteralLocalizationLeaf;
      // Template: Warehouse storage fee
      WORKFORCE_FEES: LiteralLocalizationLeaf;
    };
    BrokerFrame: {
      error: {
        // Template: Unknown ticker.
        unknownTicker: LiteralLocalizationLeaf;
      };
    };
    BrokerList: {
      // Template: Ask
      ask: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Bid
      bid: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Demand
        demand: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Change
      change: LiteralLocalizationLeaf;
      // Template: No materials in this category. Try a sub-category.
      empty: LiteralLocalizationLeaf;
      // Template: ∞
      infinity: LiteralLocalizationLeaf;
      link: {
        // Template: Chart
        chart: LiteralLocalizationLeaf;
        // Template: Info
        info: LiteralLocalizationLeaf;
        // Template: Orders
        orderBook: LiteralLocalizationLeaf;
        // Template: Trade
        placeOrder: LiteralLocalizationLeaf;
      };
      // Template: Commodity
      material: LiteralLocalizationLeaf;
      // Template: 0
      noPrice: LiteralLocalizationLeaf;
      // Template: Price
      price: LiteralLocalizationLeaf;
      // Template: Supply
      supply: LiteralLocalizationLeaf;
      // Template: Ticker
      ticker: LiteralLocalizationLeaf;
    };
    // Template: {absolute} ({relative})
    BrokerListLine: {
      getFormat: () => IntlMessageFormat;
      message: (options: { absolute: string; relative: string }) => string;
    };
    BtnBack: {
      action: {
        // Template: Back
        back: LiteralLocalizationLeaf;
      };
    };
    Buffer: {
      // Template: Buffer {id}
      title: {
        getFormat: () => IntlMessageFormat;
        message: (options: { id: string }) => string;
      };
    };
    BuildingInformation: {
      // Template: Area cost
      areaCost: LiteralLocalizationLeaf;
      // Template: Building costs
      buildingCosts: LiteralLocalizationLeaf;
      // Template: Expertise
      expertise: LiteralLocalizationLeaf;
      // Template: Products
      production: LiteralLocalizationLeaf;
      recipe: {
        // Template: No inputs
        inputless: LiteralLocalizationLeaf;
      };
      // Template: Workforces
      workforces: LiteralLocalizationLeaf;
    };
    BuildingPanel: {
      error: {
        // Template: No building found.
        building: LiteralLocalizationLeaf;
      };
      // Template: Building
      title: LiteralLocalizationLeaf;
      // Template: Building: {name}
      titleWithName: {
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    BuildingRepairAssistant: {
      // Template: Base
      base: LiteralLocalizationLeaf;
      // Template: Buildings to repair
      buildings: LiteralLocalizationLeaf;
      // Template: Repair
      button: LiteralLocalizationLeaf;
      condition: {
        // Template: Minimum condition
        minimum: LiteralLocalizationLeaf;
        // Template: Selected condition
        selected: LiteralLocalizationLeaf;
      };
      context: {
        // Template: Base
        base: LiteralLocalizationLeaf;
        // Template: Bases
        bases: LiteralLocalizationLeaf;
      };
      // Template: Bill of materials
      materials: LiteralLocalizationLeaf;
      // Template: Time offset
      timeoffset: {
        // Template: in 24h
        _24: LiteralLocalizationLeaf;
        // Template: in 48h
        _48: LiteralLocalizationLeaf;
        // Template: Allows to modify the moment of time, by a fixed offset, that is used to calculate the necessary repair materials.
        info: LiteralLocalizationLeaf;
        // Template: now
        now: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Building Repair Assistant
      title: LiteralLocalizationLeaf;
    };
    BuildingRepairAssistantPanel: {
      label: {
        minimum: {
          // Template: Buildings at or below this condition will be repaired.
          info: LiteralLocalizationLeaf;
        };
      };
    };
    Button: {
      // Template: This action requires a PRO license!
      title: LiteralLocalizationLeaf;
    };
    CalculatedDistance: {
      // Template: {jumps} jumps
      jumps: {
        getFormat: () => IntlMessageFormat;
        message: (options: { jumps: string }) => string;
      };
      // Template: on planet
      samePlanet: LiteralLocalizationLeaf;
      // Template: in system
      sameSystem: LiteralLocalizationLeaf;
    };
    Card: {
      action: {
        // Template: +
        open: LiteralLocalizationLeaf;
      };
    };
    CardSubheading: {
      // Template: {name} / {subheading}
      title: {
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string; subheading: string }) => string;
      };
    };
    CashBookings: {
      // Template: Amount
      amount: LiteralLocalizationLeaf;
      // Template: C
      credit: LiteralLocalizationLeaf;
      // Template: D
      debit: LiteralLocalizationLeaf;
      // Template: Description
      description: LiteralLocalizationLeaf;
      // Template: Booked
      time: LiteralLocalizationLeaf;
      // Template: {value} {postfix}
      value: {
        getFormat: () => IntlMessageFormat;
        message: (options: { value: string; postfix: string }) => string;
      };
    };
    CategoryName: {
      // Template: Work gear
      clothing: LiteralLocalizationLeaf;
      // Template: Food
      food: LiteralLocalizationLeaf;
      // Template: Health
      health: LiteralLocalizationLeaf;
      // Template: Tools
      tools: LiteralLocalizationLeaf;
      // Template: Drinks
      water: LiteralLocalizationLeaf;
    };
    Channel: {
      controls: {
        // Template: add user
        addUser: LiteralLocalizationLeaf;
        // Template: leave
        leave: LiteralLocalizationLeaf;
        mute: {
          // Template: mute
          label: LiteralLocalizationLeaf;
        };
        userList: {
          // Template: User List
          label: LiteralLocalizationLeaf;
        };
      };
    };
    ChannelCatalog: {
      controls: {
        // Template: open
        open: LiteralLocalizationLeaf;
      };
    };
    ChannelCatalogPanel: {
      context: {
        // Template: Communications
        communications: LiteralLocalizationLeaf;
      };
    };
    ChannelListPanel: {
      context: {
        // Template: Communication Filter
        mutedUsers: LiteralLocalizationLeaf;
        // Template: Public Channel Catalog
        publicCommunicationsCatalog: LiteralLocalizationLeaf;
      };
    };
    ChannelMembership: {
      // Template: Start Conversation
      create: {
        description: {
          // Template: Click the button below to create this group channel. You can add other users in the next step.
          group: LiteralLocalizationLeaf;
          // Template: Click the button below to start a conversation with this user. They will immediately be able to see in their COM panel that you are about to contact them.
          _private: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Join Conversation
      join: {
        // Template: Click below to join this public channel.
        description: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
    };
    ChannelMembershipList: {
      controls: {
        addGroup: {
          // Template: new group
          label: LiteralLocalizationLeaf;
        };
        addPrivate: {
          // Template: new private
          label: LiteralLocalizationLeaf;
        };
      };
    };
    ChannelMembershipListItem: {
      label: {
        // Template: GROUP: {userCount, plural, =0 {no other users} other {{users}}}
        group: {
          // Template: {u1} and {u2}
          _2: {
            getFormat: () => IntlMessageFormat;
            message: (options: { u1: string; u2: string }) => string;
          };
          // Template: {u1}, {u2} and {u3}
          _3: {
            getFormat: () => IntlMessageFormat;
            message: (options: { u1: string; u2: string; u3: string }) => string;
          };
          // Template: {u1}, {u2} and {additional} others
          more: {
            getFormat: () => IntlMessageFormat;
            message: (options: { u1: string; u2: string; additional: string }) => string;
          };
          // Template: GROUP: {name}
          named: {
            getFormat: () => IntlMessageFormat;
            message: (options: { name: string }) => string;
          };
          getFormat: () => IntlMessageFormat;
          message: (options: { userCount: number; users: string }) => string;
        };
        // Template: PRIVATE: {name}
        _private: {
          getFormat: () => IntlMessageFormat;
          message: (options: { name: string }) => string;
        };
        // Template: PUBLIC: {name}
        _public: {
          getFormat: () => IntlMessageFormat;
          message: (options: { name: string }) => string;
        };
      };
    };
    CoGC: {
      // Template: Constructed
      constructed: LiteralLocalizationLeaf;
      error: {
        // Template: Error loading chamber of global commerce.
        id: LiteralLocalizationLeaf;
      };
      programs: {
        // Template: programs / vote
        command: LiteralLocalizationLeaf;
        status: {
          // Template: current
          current: LiteralLocalizationLeaf;
          // Template: previous
          previous: LiteralLocalizationLeaf;
          // Template: upcoming
          upcoming: LiteralLocalizationLeaf;
        };
        table: {
          // Template: Command
          command: LiteralLocalizationLeaf;
          // Template: Program
          program: LiteralLocalizationLeaf;
          // Template: Schedule
          schedule: LiteralLocalizationLeaf;
          // Template: Status
          status: LiteralLocalizationLeaf;
        };
        time: {
          // Template: started {start}
          current: {
            getFormat: () => IntlMessageFormat;
            message: (options: { start: string }) => string;
          };
          // Template: ended {end}
          previous: {
            getFormat: () => IntlMessageFormat;
            message: (options: { end: string }) => string;
          };
          // Template: starts {start}
          upcoming: {
            getFormat: () => IntlMessageFormat;
            message: (options: { start: string }) => string;
          };
        };
      };
      section: {
        // Template: Programs
        programs: LiteralLocalizationLeaf;
        // Template: Upkeep
        upkeep: LiteralLocalizationLeaf;
      };
      // Template: Status
      status: LiteralLocalizationLeaf;
      upkeep: {
        // Template: Bill of material
        billOfMaterial: LiteralLocalizationLeaf;
        // Template: Stage of completion
        completion: LiteralLocalizationLeaf;
        // Template: contribute
        contribute: LiteralLocalizationLeaf;
        // Template: Contributed materials
        contributions: LiteralLocalizationLeaf;
        // Template: The CoGC needs a constant upkeep to run. It is due every 10 days and depends on the amount of company bases on the planet.
        description: LiteralLocalizationLeaf;
        // Template: Due date
        dueDate: {
          // Template: now
          now: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
    };
    CoGCPanel: {
      context: {
        // Template: CoGC
        cogc: LiteralLocalizationLeaf;
        // Template: CoGC PEX
        cogcpex: LiteralLocalizationLeaf;
        // Template: CoGC Upkeep
        cogcu: LiteralLocalizationLeaf;
        // Template: Planet
        planet: LiteralLocalizationLeaf;
      };
      error: {
        // Template: Unable to find planet
        planetId: LiteralLocalizationLeaf;
      };
      // Template: Chamber of Global Commerce @ {name}
      title: {
        // Template: CoGC: loading…
        loading: LiteralLocalizationLeaf;
        // Template: CoGC: not found…
        notFound: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    CoGCProgram: {
      // Template: Advertising Campaign: Agriculture
      ADVERTISING_AGRICULTURE: LiteralLocalizationLeaf;
      // Template: Boosts the planet-wide production output of all facilities in the agriculture sector by 25% for a week through a recruiting ad campaign titled BACK TO NATURE.
      ADVERTISING_AGRICULTURE_DESC: LiteralLocalizationLeaf;
      // Template: Agriculture
      ADVERTISING_AGRICULTURE_SHORT: LiteralLocalizationLeaf;
      // Template: Advertising Campaign: Chemistry
      ADVERTISING_CHEMISTRY: LiteralLocalizationLeaf;
      // Template: Boosts the planet-wide production output of all facilities in the chemistry sector by 25% for a week through a recruiting ad campaign titled SCIENCE IS SEXY.
      ADVERTISING_CHEMISTRY_DESC: LiteralLocalizationLeaf;
      // Template: Chemistry
      ADVERTISING_CHEMISTRY_SHORT: LiteralLocalizationLeaf;
      // Template: Advertising Campaign: Construction
      ADVERTISING_CONSTRUCTION: LiteralLocalizationLeaf;
      // Template: Boosts the planet-wide production output of all facilities in the construction sector by 25% for a week through a recruiting ad campaign titled WE ARE BUILDERS.
      ADVERTISING_CONSTRUCTION_DESC: LiteralLocalizationLeaf;
      // Template: Construction
      ADVERTISING_CONSTRUCTION_SHORT: LiteralLocalizationLeaf;
      // Template: Advertising Campaign: Electronics
      ADVERTISING_ELECTRONICS: LiteralLocalizationLeaf;
      // Template: Boosts the planet-wide production output of all facilities in the electronics sector by 25% for a week through a recruiting ad campaign titled TECHNOLOGY IS THE FUTURE.
      ADVERTISING_ELECTRONICS_DESC: LiteralLocalizationLeaf;
      // Template: Electronics
      ADVERTISING_ELECTRONICS_SHORT: LiteralLocalizationLeaf;
      // Template: Advertising Campaign: Food Industries
      ADVERTISING_FOOD_INDUSTRIES: LiteralLocalizationLeaf;
      // Template: Boosts the planet-wide production output of all facilities in the food industries sector by 25% for a week through a recruiting ad campaign titled VICTUALS ARE OUR BREAD AND BUTTER.
      ADVERTISING_FOOD_INDUSTRIES_DESC: LiteralLocalizationLeaf;
      // Template: Food Industries
      ADVERTISING_FOOD_INDUSTRIES_SHORT: LiteralLocalizationLeaf;
      // Template: Advertising Campaign: Fuel Refining
      ADVERTISING_FUEL_REFINING: LiteralLocalizationLeaf;
      // Template: Boosts the planet-wide production output of all facilities in the fuel refining sector by 25% for a week through a recruiting ad campaign titled POWERING THE FRONTIER.
      ADVERTISING_FUEL_REFINING_DESC: LiteralLocalizationLeaf;
      // Template: Fuel Refining
      ADVERTISING_FUEL_REFINING_SHORT: LiteralLocalizationLeaf;
      // Template: Advertising Campaign: Manufacturing
      ADVERTISING_MANUFACTURING: LiteralLocalizationLeaf;
      // Template: Boosts the planet-wide production output of all facilities in the manufacturing sector by 25% for a week through a recruiting ad campaign titled EFFICIENT PRODUCTION IS US.
      ADVERTISING_MANUFACTURING_DESC: LiteralLocalizationLeaf;
      // Template: Manufacturing
      ADVERTISING_MANUFACTURING_SHORT: LiteralLocalizationLeaf;
      // Template: Advertising Campaign: Metallurgy
      ADVERTISING_METALLURGY: LiteralLocalizationLeaf;
      // Template: Boosts the planet-wide production output of all facilities in the metallurgy sector by 25% for a week through a recruiting ad campaign titled MEN (AND WOMEN) OF STEEL.
      ADVERTISING_METALLURGY_DESC: LiteralLocalizationLeaf;
      // Template: Metallurgy
      ADVERTISING_METALLURGY_SHORT: LiteralLocalizationLeaf;
      // Template: Advertising Campaign: Resource Extraction
      ADVERTISING_RESOURCE_EXTRACTION: LiteralLocalizationLeaf;
      // Template: Boosts the planet-wide production output of all facilities in the resource extraction sector by 25% for a week through a recruiting ad campaign titled FROM THE GROUND UP.
      ADVERTISING_RESOURCE_EXTRACTION_DESC: LiteralLocalizationLeaf;
      // Template: Resource Extraction
      ADVERTISING_RESOURCE_EXTRACTION_SHORT: LiteralLocalizationLeaf;
      // Template: Education Events: Engineers
      WORKFORCE_ENGINEERS: LiteralLocalizationLeaf;
      // Template: Boosts the planet-wide production output of all engineers by 10% for a week through an event series named SPACE ENGINEERING FOR DUMMIES.
      WORKFORCE_ENGINEERS_DESC: LiteralLocalizationLeaf;
      // Template: Engineers
      WORKFORCE_ENGINEERS_SHORT: LiteralLocalizationLeaf;
      // Template: Education Events: Pioneers
      WORKFORCE_PIONEERS: LiteralLocalizationLeaf;
      // Template: Boosts the planet-wide production output of all Pioneers by 10% for a week through an event series named SAFETY FIRST IS OUR MOTTO.
      WORKFORCE_PIONEERS_DESC: LiteralLocalizationLeaf;
      // Template: Pioneers
      WORKFORCE_PIONEERS_SHORT: LiteralLocalizationLeaf;
      // Template: Education Events: Scientists
      WORKFORCE_SCIENTISTS: LiteralLocalizationLeaf;
      // Template: Boosts the planet-wide production output of all scientists by 10% for a week through an event series named HISTORY OF THE SCIENTIFIC METHOD.
      WORKFORCE_SCIENTISTS_DESC: LiteralLocalizationLeaf;
      // Template: Scientists
      WORKFORCE_SCIENTISTS_SHORT: LiteralLocalizationLeaf;
      // Template: Education Events: Settlers
      WORKFORCE_SETTLERS: LiteralLocalizationLeaf;
      // Template: Boosts the planet-wide production output of all Settlers by 10% for a week through an event series named BUILDERS OF THE FUTURE.
      WORKFORCE_SETTLERS_DESC: LiteralLocalizationLeaf;
      // Template: Settlers
      WORKFORCE_SETTLERS_SHORT: LiteralLocalizationLeaf;
      // Template: Education Events: Technicians
      WORKFORCE_TECHNICIANS: LiteralLocalizationLeaf;
      // Template: Boosts the planet-wide production output of all technicians by 10% for a week through an event series named RISKS AND BENEFITS OF NANOTECH.
      WORKFORCE_TECHNICIANS_DESC: LiteralLocalizationLeaf;
      // Template: Technicians
      WORKFORCE_TECHNICIANS_SHORT: LiteralLocalizationLeaf;
    };
    CoGCStatus: {
      // Template: ACTIVE
      ACTIVE: LiteralLocalizationLeaf;
      // Template: ON STRIKE
      ON_STRIKE: LiteralLocalizationLeaf;
      // Template: PLANNED
      PLANNED: LiteralLocalizationLeaf;
    };
    CoGCUpkeep: {
      // Template: Bill of material
      billOfMaterial: LiteralLocalizationLeaf;
      contribute: {
        // Template: You need a base on the planet to be able to contribute.
        error: LiteralLocalizationLeaf;
      };
      // Template: Due date
      dueDate: {
        // Template: now
        now: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      section: {
        // Template: Contribute
        contribute: LiteralLocalizationLeaf;
        // Template: Contributions
        contributions: LiteralLocalizationLeaf;
      };
      // Template: Status
      status: LiteralLocalizationLeaf;
    };
    CoGCUpkeepPanel: {
      error: {
        // Template: Unable to find planet
        planetId: LiteralLocalizationLeaf;
      };
      // Template: CoGC Upkeep @ {name}
      title: {
        // Template: CoGC: loading…
        loading: LiteralLocalizationLeaf;
        // Template: CoGC: not found…
        notFound: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    CoGCVoting: {
      table: {
        // Template: Commands
        commands: LiteralLocalizationLeaf;
        // Template: view details / vote
        details: LiteralLocalizationLeaf;
        // Template: Influence
        influence: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Rank
        rank: LiteralLocalizationLeaf;
      };
    };
    CoGCVotingDetails: {
      button: {
        // Template: Vote
        vote: LiteralLocalizationLeaf;
        // Template: Voted!
        voted: LiteralLocalizationLeaf;
      };
      error: {
        // Template: This Chamber of Global Commerce has not been finished yet.
        completion: LiteralLocalizationLeaf;
      };
      header: {
        // Template: CoGC Program: {name}
        name: {
          getFormat: () => IntlMessageFormat;
          message: (options: { name: string }) => string;
        };
      };
      label: {
        // Template: You need a base on the planet to be able to cast a vote.
        noBase: LiteralLocalizationLeaf;
        // Template: Voting ends {time}
        timeleft: {
          getFormat: () => IntlMessageFormat;
          message: (options: { time: string }) => string;
        };
      };
      section: {
        // Template: Voters
        Voters: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Influence
        influence: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Rank
        rank: LiteralLocalizationLeaf;
        // Template: Time
        time: LiteralLocalizationLeaf;
      };
    };
    CoGCVotingDetailsContainer: {
      error: {
        // Template: Unknown Chamber of Global Commerce program.
        program: LiteralLocalizationLeaf;
      };
    };
    CoGCVotingDetailsPanel: {
      error: {
        // Template: Unable to find planet
        planetId: LiteralLocalizationLeaf;
      };
      // Template: CoGC Program Details @ {name}
      title: {
        // Template: CoGC: loading…
        loading: LiteralLocalizationLeaf;
        // Template: CoGC: not found…
        notFound: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    CoGCVotingPanel: {
      error: {
        // Template: Unable to find planet
        planetId: LiteralLocalizationLeaf;
      };
      // Template: CoGC Program Execution Query @ {name}
      title: {
        // Template: CoGC: loading…
        loading: LiteralLocalizationLeaf;
        // Template: CoGC: not found…
        notFound: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    ComEx: {
      context: {
        exchange: {
          // Template: Exchange Info
          info: LiteralLocalizationLeaf;
        };
        // Template: List of Exchanges
        exchanges: LiteralLocalizationLeaf;
        material: {
          // Template: Material Info
          info: LiteralLocalizationLeaf;
        };
        orders: {
          // Template: Own Orders
          own: LiteralLocalizationLeaf;
          // Template: Place Order
          place: LiteralLocalizationLeaf;
        };
        price: {
          // Template: Price Chart
          chart: LiteralLocalizationLeaf;
          // Template: Price Info
          info: LiteralLocalizationLeaf;
          // Template: Order Book
          orders: LiteralLocalizationLeaf;
        };
      };
    };
    ComExInlineTickerQuote: {
      // Template: {name} {quote}{arrow}
      quote: {
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string; quote: string; arrow: string }) => string;
      };
    };
    ComExListPanel: {
      error: {
        // Template: Error loading commodity exchange data
        nodata: LiteralLocalizationLeaf;
      };
      // Template: Commodity Exchanges
      title: LiteralLocalizationLeaf;
    };
    ComExListTable: {
      // Template: MIC
      code: LiteralLocalizationLeaf;
      // Template: Location
      location: LiteralLocalizationLeaf;
      // Template: Name
      name: LiteralLocalizationLeaf;
      // Template: Operator
      operator: LiteralLocalizationLeaf;
    };
    ComExMaterialInfo: {
      // Template: Ask
      ask: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Bid
      bid: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      context: {
        // Template: List of Exchanges
        exchangeList: LiteralLocalizationLeaf;
        // Template: Material Info
        materialInfo: LiteralLocalizationLeaf;
        // Template: Own Orders
        orderList: LiteralLocalizationLeaf;
      };
      // Template: Distance
      distance: LiteralLocalizationLeaf;
      error: {
        // Template: Error loading data. Check material ticker!
        nodata: LiteralLocalizationLeaf;
      };
      // Template: CX
      exchange: {
        // Template: Location
        location: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      link: {
        // Template: Chart
        chart: LiteralLocalizationLeaf;
        // Template: Info
        info: LiteralLocalizationLeaf;
        // Template: Orders
        orderBook: LiteralLocalizationLeaf;
        // Template: Trade
        placeOrder: LiteralLocalizationLeaf;
      };
      // Template: Price
      price: {
        // Template: Change
        change: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Supply
      supply: {
        // Template: Demand
        demand: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: CX Material Info: {name}
      title: {
        // Template: CX Material Info
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
      // Template: 1d Units
      units: {
        // Template: 7d Units
        weekly: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
    };
    ComExMaterialInfoRow: {
      // Template: ∞
      infinity: LiteralLocalizationLeaf;
      // Template: 0
      noPrice: LiteralLocalizationLeaf;
      // Template: {absolute} ({relative})
      priceChange: {
        getFormat: () => IntlMessageFormat;
        message: (options: { absolute: string; relative: string }) => string;
      };
    };
    ComExOrderPanel: {
      data: {
        // Template: Remaining Amount
        amount: {
          // Template: Initial Amount
          initial: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Exchange
        exchange: LiteralLocalizationLeaf;
        // Template: Limit
        limit: LiteralLocalizationLeaf;
        // Template: Material
        material: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
        // Template: Ticker
        ticker: LiteralLocalizationLeaf;
        // Template: Type
        type: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No order found for input {input}.
        id: {
          getFormat: () => IntlMessageFormat;
          message: (options: { input: string }) => string;
        };
      };
      // Template: CX Order
      title: LiteralLocalizationLeaf;
      // Template: Trades
      trades: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: No trades took place so far.
        empty: LiteralLocalizationLeaf;
        // Template: Partner
        partner: LiteralLocalizationLeaf;
        // Template: Price
        price: LiteralLocalizationLeaf;
        // Template: Time
        time: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
    };
    ComExOrdersPanel: {
      _delete: {
        action: {
          // Template: You deleted too many unfilled or partially filled orders recently.
          confirmation: {
            // Template: You may still delete this order right now, but you will have to pay a fee depending on the order's remaining value: {fees}
            details: {
              getFormat: () => IntlMessageFormat;
              message: (options: { fees: string }) => string;
            };
            getFormat: () => IntlMessageFormat;
            message: (options: void) => string;
          };
          // Template: delete order
          submit: LiteralLocalizationLeaf;
        };
      };
      // Template: delete filled
      deleteFilled: LiteralLocalizationLeaf;
      // Template: Order deleted.
      deleted: LiteralLocalizationLeaf;
      filter: {
        // Template: clear material filters
        clearMaterialFilters: LiteralLocalizationLeaf;
        // Template: Exchanges:
        exchanges: LiteralLocalizationLeaf;
        // Template: hide filters
        hide: LiteralLocalizationLeaf;
        // Template: Materials:
        materials: LiteralLocalizationLeaf;
        // Template: show filters
        show: LiteralLocalizationLeaf;
        // Template: Order statuses:
        statuses: LiteralLocalizationLeaf;
        // Template: Order types:
        types: LiteralLocalizationLeaf;
      };
      // Template: Commodity Exchange Orders
      title: LiteralLocalizationLeaf;
    };
    ComExOrdersTable: {
      // Template: {amount} ({initial})
      amount: {
        getFormat: () => IntlMessageFormat;
        message: (options: { amount: string; initial: string }) => string;
      };
      // Template: delete
      _delete: LiteralLocalizationLeaf;
      // Template: No orders at the moment.
      noOrders: LiteralLocalizationLeaf;
      table: {
        // Template: Amount (initial)
        amount: LiteralLocalizationLeaf;
        // Template: Exchange
        exchange: LiteralLocalizationLeaf;
        // Template: Limit
        limit: LiteralLocalizationLeaf;
        // Template: Material
        material: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
        // Template: Ticker
        ticker: LiteralLocalizationLeaf;
        // Template: Type
        type: LiteralLocalizationLeaf;
      };
      // Template: view
      view: LiteralLocalizationLeaf;
    };
    ComExPanel: {
      data: {
        // Template: Category
        category: LiteralLocalizationLeaf;
        // Template: Market Identifier Code
        code: LiteralLocalizationLeaf;
        // Template: Trading Currency
        currency: LiteralLocalizationLeaf;
        // Template: Infrastructure
        infrastructure: LiteralLocalizationLeaf;
        // Template: Location
        location: LiteralLocalizationLeaf;
        // Template: Operator
        operator: LiteralLocalizationLeaf;
        // Template: Station
        station: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No commodity exchange for input {input}.
        id: {
          getFormat: () => IntlMessageFormat;
          message: (options: { input: string }) => string;
        };
      };
      title: {
        // Template: Commodity Exchange
        loading: LiteralLocalizationLeaf;
      };
    };
    ComExPlaceOrderBook: {
      // Template: ∞
      infinity: LiteralLocalizationLeaf;
      // Template: Offers
      offers: {
        // Template: No offers.
        empty: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Requests
      requests: {
        // Template: No requests.
        empty: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Spread: {spread}
      spread: {
        getFormat: () => IntlMessageFormat;
        message: (options: { spread: string }) => string;
      };
      table: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Price
        price: LiteralLocalizationLeaf;
        // Template: Trader
        trader: LiteralLocalizationLeaf;
      };
    };
    ComExPlaceOrderForm: {
      // Template: {bid} / {ask}
      bidask: {
        getFormat: () => IntlMessageFormat;
        message: (options: { bid: string; ask: string }) => string;
      };
      // Template: buy
      buy: LiteralLocalizationLeaf;
      // Template: {inventory} {button}
      inventory: {
        // Template: {amount, plural, one {# unit} other {# units}}
        amount: {
          // Template: set
          set: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: { amount: number }) => string;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: { inventory: string; button: string }) => string;
      };
      label: {
        // Template: Quantity
        amount: LiteralLocalizationLeaf;
        // Template: Bid / Ask
        bidask: LiteralLocalizationLeaf;
        // Template: Effective price
        effectivePrice: {
          // Template: CX prices are rounded to 3 significant figures. For prices above 10, the minimum increment is 0.1, for prices above 100, the minimum increment is 1, and so on.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Exchange
        exchange: LiteralLocalizationLeaf;
        // Template: Inventory
        inventory: LiteralLocalizationLeaf;
        // Template: Price Limit
        limit: LiteralLocalizationLeaf;
        // Template: Material
        material: LiteralLocalizationLeaf;
        // Template: Price average
        priceAverage: LiteralLocalizationLeaf;
        // Template: Price Band
        priceband: {
          // Template: The broker's price band depends on the average price of the latest trades. Orders with a price limit outside the price band will only be accepted from companies with a PRO rating and a minimum age of 45 days.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Storage Location
        storeId: LiteralLocalizationLeaf;
        // Template: Volume
        volume: LiteralLocalizationLeaf;
      };
      price: {
        // Template: set
        set: LiteralLocalizationLeaf;
      };
      // Template: {priceAverage} {command}
      priceAverage: {
        getFormat: () => IntlMessageFormat;
        message: (options: { priceAverage: string; command: string }) => string;
      };
      // Template: {low} / {high} {currency}
      priceband: {
        getFormat: () => IntlMessageFormat;
        message: (options: { low: string; high: string; currency: string }) => string;
      };
      // Template: sell
      sell: LiteralLocalizationLeaf;
      // Template: Shipment size
      shipmentSize: LiteralLocalizationLeaf;
    };
    ComExPlaceOrderPanel: {
      action: {
        // Template: place order
        place: {
          // Template: The price limit you selected is outside the broker's price band. Continue?
          confirmation: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
      // Template: Place order ({ticker})
      title: {
        getFormat: () => IntlMessageFormat;
        message: (options: { ticker: string }) => string;
      };
    };
    ComExPrice: {
      // Template: {absolute} ({relative})
      pricechange: {
        getFormat: () => IntlMessageFormat;
        message: (options: { absolute: string; relative: string }) => string;
      };
    };
    ComExPriceChartPanel: {
      // Template: Chart: {name} ({ticker})
      chartWithNameAndTicker: {
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string; ticker: string }) => string;
      };
      // Template: Chart: {ticker}
      chartWithTicker: {
        getFormat: () => IntlMessageFormat;
        message: (options: { ticker: string }) => string;
      };
    };
    ComExPricePanel: {
      // Template: 0
      noPrice: LiteralLocalizationLeaf;
      // Template: Price {ticker}
      title: {
        getFormat: () => IntlMessageFormat;
        message: (options: { ticker: string }) => string;
      };
      // Template: {material} ({ticker})
      titlebroker: {
        getFormat: () => IntlMessageFormat;
        message: (options: { material: string; ticker: string }) => string;
      };
    };
    ComExPurchasePickUpCondition: {
      // Template: Pick up {amount, number} / {total, number} {total, plural, one {unit} other {units}} of {material} at {address}
      content: {
        getFormat: () => IntlMessageFormat;
        message: (options: {
          amount: string | number;
          total: number;
          material: string;
          address: string;
        }) => string;
      };
    };
    Command: {
      // Template: List of all pending actions.
      ACTIONS: LiteralLocalizationLeaf;
      // Template: General information about a planetary administration center.
      ADM: {
        parameter: {
          // Template: Planet Identifier
          planetIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Information about a administration center term.
      ADMT: {
        parameter: {
          // Template: Planet Identifier
          planetIdInput: LiteralLocalizationLeaf;
          // Template: Term Identifier
          termId: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Entrypoint for the mobile version of APEX.
      APEXM: LiteralLocalizationLeaf;
      // Template: Shows information about and allows to upgrade the APEX representation center.
      ARC: LiteralLocalizationLeaf;
      // Template: An overview of all infrastructure assets both in construction and completed.
      ASTS: LiteralLocalizationLeaf;
      // Template: Construct a new building at one of your bases.
      BBC: {
        parameter: {
          // Template: Blueprint
          blueprintIdInput: LiteralLocalizationLeaf;
          // Template: Base
          siteIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Has a list of all buildings at one of your bases.
      BBL: {
        parameter: {
          // Template: Base
          siteIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: A list of all user badges.
      BDGS: LiteralLocalizationLeaf;
      // Template: Shows a list of all blueprints or details of a specific blueprint.
      BLU: {
        parameter: {
          // Template: Blueprint
          blueprintIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Repair multiple buildings at once.
      BRA: {
        parameter: {
          // Template: Base
          siteIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Display one or all of your bases.
      BS: {
        parameter: {
          // Template: Base
          siteIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Allows to construct a new base on a planet.
      BSC: {
        parameter: {
          // Template: Planet Identifier
          planetIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Blueprint test flight controls.
      BTF: LiteralLocalizationLeaf;
      // Template: Information about buildings.
      BUI: {
        parameter: {
          // Template: Building Ticker
          buildingTicker: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: List of available commands.
      CMDS: LiteralLocalizationLeaf;
      // Template: Company information.
      CO: {
        parameter: {
          // Template: Company Code or Company Id
          query: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: The Chamber of Global Commerce and its programs.
      COGC: {
        parameter: {
          // Template: Planet Identifier
          planetIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: The Chamber of Global Commerce program details.
      COGCPD: {
        parameter: {
          // Template: Planet Identifier
          planetIdInput: LiteralLocalizationLeaf;
          // Template: Program Name
          program: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: The Chamber of Global Commerce program execution query and voting.
      COGCPEX: {
        parameter: {
          // Template: Planet Identifier
          planetIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Upkeep of the Chamber of Global Commerce.
      COGCU: {
        parameter: {
          // Template: Planet Identifier
          planetIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Liquidate your company.
      COLIQ: LiteralLocalizationLeaf;
      // Template: Communications.
      COM: LiteralLocalizationLeaf;
      // Template: Catalog of public communication channels.
      COMC: LiteralLocalizationLeaf;
      // Template: List of muted users.
      COMF: LiteralLocalizationLeaf;
      // Template: A private group conversation.
      COMG: {
        parameter: {
          // Template: Channel Identifier
          channelIdentifier: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: A public communication channel.
      COMP: {
        parameter: {
          // Template: Channel Identifier
          channelIdentifier: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Direct communication channel to another user.
      COMU: {
        parameter: {
          // Template: Username
          channelIdentifier: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: List of currently connected users.
      CONS: LiteralLocalizationLeaf;
      // Template: Displays a contract.
      CONT: {
        parameter: {
          // Template: Contract
          contractId: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Displays the list of all or a specific contract draft.
      CONTD: {
        parameter: {
          // Template: Draft Identifier
          draftIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Displays all contracts.
      CONTS: LiteralLocalizationLeaf;
      // Template: Information about your primary corporation.
      CORP: LiteralLocalizationLeaf;
      // Template: Shows information about and allows to upgrade the corporation's APEX representation center.
      CORPARC: LiteralLocalizationLeaf;
      // Template: Information about your primary corporation's finances.
      CORPFIN: LiteralLocalizationLeaf;
      // Template: Pending invites of your corporation.
      CORPIVS: {
        parameter: {
          // Template: Company Code
          companyIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Starting a new project for your corporation.
      CORPNP: LiteralLocalizationLeaf;
      // Template: Detailed information about corporation projects.
      CORPP: {
        parameter: {
          // Template: Project Identifier
          partialProjectId: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Displays a list of all corporations or details of a single corporation.
      CORPS: {
        parameter: {
          // Template: Corporation Code
          corporationIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Create a new screen.
      CS: LiteralLocalizationLeaf;
      // Template: General information about a commodity exchange.
      CX: {
        parameter: {
          // Template: Market Identifier Code
          idInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: List of all commodity exchanges.
      CXL: LiteralLocalizationLeaf;
      // Template: Compare commodity information across all exchanges.
      CXM: {
        parameter: {
          // Template: Material Ticker
          materialTicker: LiteralLocalizationLeaf;
          // Template: Planet to determine distance from
          planetIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: View a commodity exchange order.
      CXO: {
        parameter: {
          // Template: Order Identifier
          query: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Order book for a given commodity exchange ticker.
      CXOB: {
        parameter: {
          // Template: Ticker
          ticker: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Manage your commodity exchange orders.
      CXOS: {
        parameter: {
          // Template: Pagesize
          pagesize: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Commodity price information.
      CXP: {
        parameter: {
          // Template: Ticker
          ticker: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Chart: Commodity price plotted over time.
      CXPC: {
        parameter: {
          // Template: Ticker
          ticker: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Commodity exchange order form.
      CXPO: {
        parameter: {
          // Template: Ticker
          ticker: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Display and manage the experts at a given base.
      EXP: {
        parameter: {
          // Template: Base
          siteIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Shows and opens a link that leads to an external site.
      EXTLNK: LiteralLocalizationLeaf;
      // Template: Faction information.
      FA: {
        parameter: {
          // Template: Faction Code
          query: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Basic financial overview and recent cash bookings.
      FIN: LiteralLocalizationLeaf;
      // Template: Balance statement showing your assets and liabilities.
      FINBS: LiteralLocalizationLeaf;
      // Template: Income statement showing profit and loss.
      FINIS: LiteralLocalizationLeaf;
      // Template: Balance statement showing liquid assets (e.g. cash).
      FINLA: LiteralLocalizationLeaf;
      // Template: Overview of the whole fleet or fleets at specific locations.
      FLT: LiteralLocalizationLeaf;
      // Template: Overview of the fleet at the given planet.
      FLTP: {
        parameter: {
          // Template: Planet Identifier
          partialPlanetId: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Overview of the fleet in the given system.
      FLTS: {
        parameter: {
          // Template: System Identifier
          partialSystemId: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      FTL: {
        parameter: {
          // Template: Address
          addressInput: LiteralLocalizationLeaf;
        };
      };
      // Template: A matrix of foreign exchange conversion rates.
      FX: LiteralLocalizationLeaf;
      // Template: Shows a foreign exchange order.
      FXO: {
        parameter: {
          // Template: Order Identifier
          query: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Order book for a given currency pair.
      FXOB: {
        parameter: {
          // Template: Ticker
          ticker: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: List of your foreign exchange orders.
      FXOS: LiteralLocalizationLeaf;
      // Template: Exchange rate information.
      FXP: {
        parameter: {
          // Template: Ticker
          ticker: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Chart: Exchange rate plotted over time.
      FXPC: {
        parameter: {
          // Template: Ticker
          ticker: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Place foreign exchange order.
      FXPO: {
        parameter: {
          // Template: Ticker
          ticker: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Allows to gift PRO license time to another user.
      GIFT: LiteralLocalizationLeaf;
      // Template: Shows information about the current and past governments.
      GOV: {
        parameter: {
          // Template: Planet Identifier
          planetIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Displays information about a FTL gateway.
      GTW: {
        parameter: {
          // Template: Address or specific gateway id.
          locationIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Allows to plan gateway projects.
      GTWI: LiteralLocalizationLeaf;
      // Template: Displays traffic information about a FTL gateway.
      GTWT: {
        parameter: {
          // Template: Gateway Identifier
          gatewayNaturalId: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Links to the Handbook with useful information on how to get started.
      HELP: LiteralLocalizationLeaf;
      // Template: Allows to upgrade and relocate your company headquarters.
      HQ: LiteralLocalizationLeaf;
      // Template: Displays information about a system's infrastructure.
      INF: {
        parameter: {
          // Template: Infrastructure Identifier
          infrastructureNaturalId: LiteralLocalizationLeaf;
          // Template: System Identifier
          systemIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Displays information about an infrastructure's upkeep.
      INFU: LiteralLocalizationLeaf;
      // Template: Display all inventories, those located at the specified address, or a specific inventory.
      INV: {
        parameter: {
          // Template: Inventory or Address
          storeIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Shows the company leaderboards.
      LEAD: LiteralLocalizationLeaf;
      // Template: Information about your APEX license/subscription status.
      LIC: LiteralLocalizationLeaf;
      // Template: General info about a local market and its list of ads.
      LM: {
        parameter: {
          // Template: Local Market Identifier
          localMarketIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Detailed view of a local market ad.
      LMA: {
        parameter: {
          // Template: Local Market Ad Identifier
          localMarketAdIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Local market blocklist.
      LMBL: LiteralLocalizationLeaf;
      // Template: List of your local market ads.
      LMOS: LiteralLocalizationLeaf;
      // Template: Form to create local market ads.
      LMP: {
        parameter: {
          // Template: Local Market Identifier
          localMarketIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Listing of local rules like production fees, etc.
      LR: {
        parameter: {
          // Template: Planet Identifier
          planetIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Information about commodities and materials.
      MAT: {
        parameter: {
          // Template: Material Ticker
          materialTicker: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Motion
      MOT: {
        parameter: {
          // Template: Administration Center Identifier
          planetIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Motions
      MOTS: {
        parameter: {
          // Template: Motion Identifier
          motionId: LiteralLocalizationLeaf;
          // Template: Motion Identifier
          motionIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Map: Star System
      MS: {
        parameter: {
          // Template: System Identifier
          systemIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Transfer a specific amount of a commodity between inventories.
      MTRA: {
        parameter: {
          // Template: Material Ticker
          materialTickerInput: LiteralLocalizationLeaf;
          // Template: Origin Store Identifier
          originStoreIdInput: LiteralLocalizationLeaf;
          // Template: Target Store Identifier
          targetStoreIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Map: Universe
      MU: {
        parameter: {
          // Template: Mode
          mode: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: In-game notification settings.
      NOTIG: LiteralLocalizationLeaf;
      // Template: Push notification settings.
      NOTPNS: LiteralLocalizationLeaf;
      // Template: List of notifications.
      NOTS: LiteralLocalizationLeaf;
      // Template: Allows to search for and display information about a planet.
      PLI: {
        parameter: {
          // Template: Planet Identifier
          planetIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Name a planet.
      PLNM: {
        parameter: {
          // Template: Planet Identifier
          naturalId: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Shows recent and past offices a user held.
      POL: {
        parameter: {
          // Template: Username
          query: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Shows recent population reports containing information like population size, growth, unemployment rate, ..
      POPI: {
        parameter: {
          // Template: Planet Identifier
          planetIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Shows details of a certain population infrastructure project and allows to contribute upkeep materials as well as building materials to upgrade the project.
      POPID: {
        parameter: {
          // Template: Infrastructure Type
          infrastructureType: LiteralLocalizationLeaf;
          // Template: Planet Identifier
          planetIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Shows recent population reports containing information like population size, growth, unemployment rate, ..
      POPR: {
        parameter: {
          // Template: Planet Identifier
          planetIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Detailed information about a planetary project.
      PP: {
        parameter: {
          // Template: Planet Identifier
          planetIdInput: LiteralLocalizationLeaf;
          // Template: Planetary Project
          planetaryProjectIdInput: LiteralLocalizationLeaf;
          // Template: Base
          siteIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Displays information about a planetary plot.
      PPI: LiteralLocalizationLeaf;
      // Template: List of all planetary projects of the given planet.
      PPS: {
        parameter: {
          // Template: Planet Identifier
          planetIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Display one or all of your production lines.
      PROD: LiteralLocalizationLeaf;
      // Template: Queue a new production order for a production line.
      PRODCO: {
        parameter: {
          // Template: Base
          productionLineIdInput: LiteralLocalizationLeaf;
          // Template: Plot
          siteIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Order queue of a production line.
      PRODQ: {
        parameter: {
          // Template: Production Line
          productionLineIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Has a list of recommended starter buildings for your selected starting package.
      RSB: LiteralLocalizationLeaf;
      // Template: Screen configuration
      SCRN: LiteralLocalizationLeaf;
      // Template: Ship flight controls.
      SFC: {
        parameter: {
          // Template: Ship Transponder
          partialShipId: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Ship detail information
      SHP: {
        parameter: {
          // Template: Ship Transponder
          partialShipId: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Ship fuel tanks.
      SHPF: {
        parameter: {
          // Template: Ship Transponder
          partialShipId: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Ship inventory.
      SHPI: {
        parameter: {
          // Template: Ship Transponder
          partialShipId: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: General information about planetary shipyards.
      SHY: {
        parameter: {
          // Template: Address
          locationIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: An overview of all shipyard projects and details for specific ones.
      SHYP: {
        parameter: {
          // Template: Shipyard Project Identifier
          projectIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Public ship information.
      SI: {
        parameter: {
          // Template: Ship Transponder
          partialShipId: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Steam review.
      STEAM: LiteralLocalizationLeaf;
      // Template: Displays a list of all space stations or public information of a single station.
      STNS: {
        parameter: {
          // Template: Station Identifier
          partialStationId: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Allows to search for and display information about a system.
      SYSI: {
        parameter: {
          // Template: System Identifier
          systemIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Name a system.
      SYSNM: {
        parameter: {
          // Template: System Identifier
          naturalId: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Display a list of recent transmissions.
      TRA: LiteralLocalizationLeaf;
      // Template: Allows unpacking of consumable bundles.
      UPCK: {
        parameter: {
          // Template: Store Identifier
          storeIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: User information.
      USR: {
        parameter: {
          // Template: Username
          query: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: General information about a warehouse.
      WAR: {
        parameter: {
          // Template: Warehouse Identifier
          warehouseIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Display the workforce at a given base.
      WF: {
        parameter: {
          // Template: Base
          siteIdInput: LiteralLocalizationLeaf;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Greenscreen
      XIT: LiteralLocalizationLeaf;
      // Template: YouTube video
      XYTV: LiteralLocalizationLeaf;
    };
    CommandInput: {
      // Template: CMD
      label: LiteralLocalizationLeaf;
    };
    CommandsPanel: {
      // Template: Command
      command: LiteralLocalizationLeaf;
      // Template: Description
      description: LiteralLocalizationLeaf;
      // Template: Mandatory parameters
      mandatoryParameters: LiteralLocalizationLeaf;
      // Template: Optional parameters
      optionalParameters: LiteralLocalizationLeaf;
      // Template: Commands
      title: LiteralLocalizationLeaf;
    };
    CommodityAd: {
      // Template: {action} {amount} {commodity} ({ticker}) @ {price} for {advice} within {adviceTime}
      text: {
        // Template: {advice, plural, one {# day} other {# days}}
        advice: {
          getFormat: () => IntlMessageFormat;
          message: (options: { advice: number }) => string;
        };
        // Template: collection
        collection: LiteralLocalizationLeaf;
        // Template: delivery
        delivery: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: {
          action: string;
          amount: string;
          commodity: string;
          ticker: string;
          price: string;
          advice: string;
          adviceTime: string;
        }) => string;
      };
    };
    CommodityShippingAd: {
      text: {
        // Template: {advice, plural, one {# day} other {# days}}
        collection: {
          getFormat: () => IntlMessageFormat;
          message: (options: { advice: number }) => string;
        };
        // Template: {action} {amount} {commodity} @ {price} from {origin} to {destination} for delivery within {adviceTime}
        perspectiveSender: {
          getFormat: () => IntlMessageFormat;
          message: (options: {
            action: string;
            amount: string;
            commodity: string;
            price: string;
            origin: string;
            destination: string;
            adviceTime: string;
          }) => string;
        };
        // Template: {action} {weight}t / {volume}m³ @ {price} from {origin} to {destination} for delivery within {adviceTime}
        perspectiveShipper: {
          getFormat: () => IntlMessageFormat;
          message: (options: {
            action: string;
            weight: string;
            volume: string;
            price: string;
            origin: string;
            destination: string;
            adviceTime: string;
          }) => string;
        };
      };
    };
    CompanyCreation: {
      SelectionCategory: {
        // Template: Faction
        COUNTRY: LiteralLocalizationLeaf;
        // Template: Location
        LOCATION: LiteralLocalizationLeaf;
        // Template: Profession
        PROFILE: LiteralLocalizationLeaf;
      };
    };
    CompanyHeadquarters: {
      // Template: {usedPermits} / {availablePermits}
      basepermits: {
        getFormat: () => IntlMessageFormat;
        message: (options: { usedPermits: string; availablePermits: string }) => string;
      };
      button: {
        // Template: Relocate
        relocate: LiteralLocalizationLeaf;
      };
      // Template: CMD
      command: LiteralLocalizationLeaf;
      context: {
        // Template: Company
        company: LiteralLocalizationLeaf;
      };
      // Template: Your company has no headquarters yet.
      empty: LiteralLocalizationLeaf;
      form: {
        // Template: Base permit increase
        additionalBasePermits: LiteralLocalizationLeaf;
        // Template: Queue slot increase
        additionalProductionQueueSlots: LiteralLocalizationLeaf;
        // Template: Address
        address: LiteralLocalizationLeaf;
        // Template: Base permits
        basepermits: LiteralLocalizationLeaf;
        // Template: Efficiency gains
        efficiencygains: LiteralLocalizationLeaf;
        // Template: {category} {gain}
        efficiencygainsdetails: {
          getFormat: () => IntlMessageFormat;
          message: (options: { category: string; gain: string }) => string;
        };
        // Template: Level
        level: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Relocations are locked and will become available in {relocation} again.
        nextRelocationTime: {
          getFormat: () => IntlMessageFormat;
          message: (options: { relocation: string }) => string;
        };
        // Template: Site
        site: LiteralLocalizationLeaf;
      };
      header: {
        // Template: Relocate
        relocate: LiteralLocalizationLeaf;
        // Template: Upgrade
        upgrade: LiteralLocalizationLeaf;
      };
      label: {
        additionalBasePermits: {
          // Template: Upgrading your HQ unlocks an additional base permit per level.
          info: LiteralLocalizationLeaf;
        };
        additionalProductionQueueSlots: {
          // Template: Upgrading your HQ can unlock additional production queue slots. Consult the handbook about the required levels.
          info: LiteralLocalizationLeaf;
        };
        basepermits: {
          // Template: The maximum number of bases you are allowed to own. Increase it by upgrading your HQ.
          info: LiteralLocalizationLeaf;
        };
        efficiencygains: {
          // Template: Depending on your HQ's location and base to base permits ratio you'll receive certain production efficiency gains.
          info: LiteralLocalizationLeaf;
        };
        level: {
          // Template: Upgrading your HQ unlocks additional base permits and extends your production queues. Non-PRO users can update up to level 5, beyond that a PRO subscription is necessary.
          info: LiteralLocalizationLeaf;
        };
        // Template: No base found to relocate to.
        relocateNotPossible: LiteralLocalizationLeaf;
      };
      title: {
        // Template: Headquarters
        noAddress: LiteralLocalizationLeaf;
        // Template: Headquarters @ {address}
        withAddress: {
          getFormat: () => IntlMessageFormat;
          message: (options: { address: string }) => string;
        };
      };
    };
    CompanyHeadquartersPanel: {
      action: {
        // Template: Do you want to relocate your company's headquarters to {name}? You will not be able to relocate again immediately.
        confirmation: {
          getFormat: () => IntlMessageFormat;
          message: (options: { name: string }) => string;
        };
        // Template: Relocate
        relocate: LiteralLocalizationLeaf;
      };
    };
    CompanyPanel: {
      context: {
        // Template: Headquarters
        headquarters: LiteralLocalizationLeaf;
      };
      data: {
        // Template: Bases
        bases: LiteralLocalizationLeaf;
        // Template: Code
        code: LiteralLocalizationLeaf;
        // Template: Corporation
        corporation: {
          // Template: invite
          invite: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Faction
        country: LiteralLocalizationLeaf;
        // Template: Founded
        founded: LiteralLocalizationLeaf;
        // Template: Rating
        rating: LiteralLocalizationLeaf;
        // Template: Registration
        registration: LiteralLocalizationLeaf;
        // Template: APEX representation center
        representation: {
          // Template: Level {level}
          level: {
            getFormat: () => IntlMessageFormat;
            message: (options: { level: string }) => string;
          };
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Reputation
        reputation: LiteralLocalizationLeaf;
        // Template: Managing Director
        user: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No company for input {input}.
        id: {
          getFormat: () => IntlMessageFormat;
          message: (options: { input: string }) => string;
        };
      };
      title: {
        // Template: Company
        loading: LiteralLocalizationLeaf;
        // Template: Company: {name}
        single: {
          getFormat: () => IntlMessageFormat;
          message: (options: { name: string }) => string;
        };
      };
    };
    CompanySetup: {
      // Template: Carbon Farmer
      CARBON_FARMER: LiteralLocalizationLeaf;
      // Template: Constructor
      CONSTRUCTOR: LiteralLocalizationLeaf;
      // Template: Fuel Engineer
      FUEL_ENGINEER: LiteralLocalizationLeaf;
      // Template: Manufacturer
      MANUFACTURER: LiteralLocalizationLeaf;
      // Template: Metallurgist
      METALLURGIST: LiteralLocalizationLeaf;
      // Template: Victualler
      VICTUALLER: LiteralLocalizationLeaf;
      // Template: APEX Company Creation Assistant
      header: LiteralLocalizationLeaf;
      profile: {
        // Template: Carbon Farmer
        CARBON_FARMER: {
          // Template: Carbon has become a vital resource across different industries, so much so that a whole job profile has evolved around it: the carbon farmer. Even though you will be planting crops like a victualler, you will not have much to do with the food industry. Instead, your plants will be harvested for their precious carbon, which is the basis for many essential production processes in the metal and other industries.
          description: LiteralLocalizationLeaf;
          // Template: Water
          resources: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Constructor
        CONSTRUCTOR: {
          // Template: Constructors know their way around building parts, from basic structural elements to complex engineering materials.
          description: LiteralLocalizationLeaf;
          // Template: Limestone, Iron Ore
          resources: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Fuel Engineer
        FUEL_ENGINEER: {
          // Template: The commodities you produce will be the foundation of faster-than-light and slower-than-light space travel. Both fuel types are based on a variety of gaseous and solid ingredients, so there is plenty of room for development and specialization in your trade.
          description: LiteralLocalizationLeaf;
          // Template: Galerite, Ammonia, Hydrogen
          resources: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Manufacturer
        MANUFACTURER: {
          // Template: As a manufacturer, you will be a versatile creature which does not depend too much on a single industry. Your company’s main purpose will be to supply your trade partners with goods such as basic clothing and building parts. Getting started as a manufacturer is quite complex logistically, as you will have to buy your input materials from a nearby commodity exchange.
          description: LiteralLocalizationLeaf;
          // Template: Limestone, Silicon Ore
          resources: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Metallurgist
        METALLURGIST: {
          // Template: If you don’t mind getting your (workers’) hands dirty, this might be the job for you. Operating at the base of several industry branches, metallurgists produce ores, smelt them down and supply their trade partners with refined metals that will ultimately go into the construction of buildings, ships, and other structures.
          description: LiteralLocalizationLeaf;
          // Template: Aluminium Ore, Iron Ore, Oxygen
          resources: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Victualler
        VICTUALLER: {
          // Template: Victuallers are the heart of the food industry. Their profession revolves around extracting water, producing ingredients and turning it all into edibles for their own and others’ workforces. Without victuallers, all other industries would soon come to a halt, which is why their trade will always be relevant across the universe.
          description: LiteralLocalizationLeaf;
          // Template: Water
          resources: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
      step: {
        action: {
          // Template: ACCEPT
          accept: LiteralLocalizationLeaf;
          // Template: BACK
          back: LiteralLocalizationLeaf;
          // Template: CREATE
          create: LiteralLocalizationLeaf;
          // Template: NEXT
          next: LiteralLocalizationLeaf;
        };
        company: {
          // Template: Company code
          code: {
            // Template: A 3- or 4-character abbreviation for your company. Owners of some APEX licenses can even use 2- or 1-character abbreviations. Cannot consist of numbers only.
            info: LiteralLocalizationLeaf;
            // Template: code
            placeholder: LiteralLocalizationLeaf;
            getFormat: () => IntlMessageFormat;
            message: (options: void) => string;
          };
          // Template: Your company represents your personal business interests in the APEX system. It is identified by a name and a short code.
          description1: LiteralLocalizationLeaf;
          // Template: Your company can later join a corporation to work towards a shared goal with other players.
          description2: LiteralLocalizationLeaf;
          error: {
            // Template: This company code is unavailable.
            unavailableCode: LiteralLocalizationLeaf;
            // Template: This company name is unavailable.
            unavailableName: LiteralLocalizationLeaf;
          };
          // Template: Name your company
          header: LiteralLocalizationLeaf;
          // Template: Company name
          name: {
            // Template: Your company's name will be visible to all APEX participants and cannot be changed. Choose wisely.
            info: LiteralLocalizationLeaf;
            // Template: name
            placeholder: LiteralLocalizationLeaf;
            getFormat: () => IntlMessageFormat;
            message: (options: void) => string;
          };
        };
        country: {
          // Template: Currency: {currency}
          currency: {
            getFormat: () => IntlMessageFormat;
            message: (options: { currency: string }) => string;
          };
          // Template: Choose a faction
          header: LiteralLocalizationLeaf;
        };
        disclaimer: {
          // Template: Early Access Disclaimer
          header: LiteralLocalizationLeaf;
          // Template: in development
          indevelopment: LiteralLocalizationLeaf;
          // Template: slow game
          slowgame: LiteralLocalizationLeaf;
          // Template: Please note that the game and its interface APEX is still {indevelopment}. Bugs will occur during the early access stage; please report them <a>in the forums</a> to get help. The universe will be reset multiple times before the full release, but we will make sure to give you a timely heads up.
          text1: {
            getFormat: () => IntlMessageFormat;
            message: (options: { indevelopment: string }) => string;
          };
          // Template: Please also note that Prosperous Universe is a {slowgame}, especially when starting out. Actions, like sending out ships or the production of materials, are being executed in real-time and will take real hours to complete. The game will get busier the more bases and ships you have. It is perfectly normal to play a couple of minutes and come back hours later. In the meantime, many players will plan their next steps and interact with the community.
          text2: {
            getFormat: () => IntlMessageFormat;
            message: (options: { slowgame: string }) => string;
          };
          // Template: By accepting this disclaimer, you also confirm that you will behave in accordance with the <a>Community Guidelines</a>. Violating them might result in limitation, suspension, or deletion of your account.
          text3: LiteralLocalizationLeaf;
        };
        location: {
          // Template: Your starting location determines where the ships of your starting fleet will be provisioned.
          description1: LiteralLocalizationLeaf;
          // Template: Important: You can fly to any planet in the universe but most of them will require high-level technology in order for you to colonize them. You will be able to colonize many more planets later.
          description2: LiteralLocalizationLeaf;
          // Template: Choose a starting planet
          header: LiteralLocalizationLeaf;
          // Template: Profession suitability
          professionSuitability: LiteralLocalizationLeaf;
        };
        profile: {
          // Template: Central resources:
          centralResources: LiteralLocalizationLeaf;
          // Template: Choose a profession
          header: LiteralLocalizationLeaf;
          // Template: Note: You can venture into any industry you like later on. What you select here merely determines your initial stock of goods.
          note: LiteralLocalizationLeaf;
          // Template: (Note that it will sometimes make more sense to buy the materials you need instead of producing them all by yourself.)
          resources: LiteralLocalizationLeaf;
        };
      };
    };
    CompanySiteContainer: {
      error: {
        // Template: Failed to load plot information.
        notFound: LiteralLocalizationLeaf;
      };
    };
    ComponentDescription: {
      type: {
        // Template: Accept a contribution of {money} from {contributor}.
        CONTRIBUTION: {
          getFormat: () => IntlMessageFormat;
          message: (options: { money: string; contributor: string }) => string;
        };
        // Template: Set local market fees to {base} and time factor to {timefactor}.
        FEE_LOCAL_MARKET: {
          getFormat: () => IntlMessageFormat;
          message: (options: { base: string; timefactor: string }) => string;
        };
        // Template: Set base establishment fee to {fee}.
        FEE_SITE_ESTABLISHMENT: {
          getFormat: () => IntlMessageFormat;
          message: (options: { fee: string }) => string;
        };
        // Template: Set warehouse rental fees to {amount} per unit.
        FEE_WAREHOUSE: {
          getFormat: () => IntlMessageFormat;
          message: (options: { amount: string }) => string;
        };
        // Template: Commission {contractor} to provide {periods, plural, one {one week} other {{periods} weeks}} of fuel for gateway {link} with a {slo}% service level objective, paying {amount}.
        GATEWAY_FUEL: {
          getFormat: () => IntlMessageFormat;
          message: (options: {
            contractor: string;
            periods: string;
            link: string;
            slo: string;
            amount: string;
          }) => string;
        };
        GATEWAY_LINK: {
          // Template: Establish link from gateway {originGateway} at {originAddress} to gateway {destinationGateway} at {destinationAddress}.
          link: {
            getFormat: () => IntlMessageFormat;
            message: (options: {
              originGateway: string;
              originAddress: string;
              destinationGateway: string;
              destinationAddress: string;
            }) => string;
          };
          // Template: Unlink gateway {originGateway}.
          unlink: {
            getFormat: () => IntlMessageFormat;
            message: (options: { originGateway: string }) => string;
          };
        };
        // Template: Set the usage fee for gateway {link} to {amount}.
        GATEWAY_PRICING: {
          getFormat: () => IntlMessageFormat;
          message: (options: { link: string; amount: string }) => string;
        };
        // Template: Commission {constructor} to construct a {type} infrastructure for {amount}.
        INFRASTRUCTURE_CONSTRUCTION: {
          getFormat: () => IntlMessageFormat;
          message: (options: { constructor: string; type: string; amount: string }) => string;
        };
        // Template: Rename {type} {naturalId} to {name}.
        INFRASTRUCTURE_NAME: {
          getFormat: () => IntlMessageFormat;
          message: (options: { type: string; naturalId: string; name: string }) => string;
        };
        // Template: Commission {constructor} to upgrade {type} {link} for {amount}.
        INFRASTRUCTURE_UPGRADE: {
          getFormat: () => IntlMessageFormat;
          message: (options: {
            constructor: string;
            type: string;
            link: string;
            amount: string;
          }) => string;
        };
        // Template: Commission {contractor} to provide {periods, plural, one {one week} other {{periods} weeks}} of upkeep for {type} {link} with a {slo}% service level objective, paying {amount}.
        INFRASTRUCTURE_UPKEEP: {
          getFormat: () => IntlMessageFormat;
          message: (options: {
            contractor: string;
            periods: string;
            type: string;
            link: string;
            slo: string;
            amount: string;
          }) => string;
        };
        // Template: Transfer {money} to {user}.
        PAYOUT: {
          getFormat: () => IntlMessageFormat;
          message: (options: { money: string; user: string }) => string;
        };
        // Template: Start workforce program '{program}' ({costs}).
        WORKFORCE_PROGRAM: {
          getFormat: () => IntlMessageFormat;
          message: (options: { program: string; costs: string }) => string;
        };
      };
    };
    ComponentOption: {
      // Template: {amount, number} {amount, plural, one {emitter} other {emitters} zero {emitters}}
      ftlEmitter: {
        getFormat: () => IntlMessageFormat;
        message: (options: { amount: number }) => string;
      };
      // Template: not required
      notrequired: LiteralLocalizationLeaf;
      // Template: required
      required: LiteralLocalizationLeaf;
      // Template: {amount} structural elements
      structure: {
        getFormat: () => IntlMessageFormat;
        message: (options: { amount: string }) => string;
      };
    };
    ComponentType: {
      // Template: Contribution
      CONTRIBUTION: LiteralLocalizationLeaf;
      // Template: Local Market fees
      FEE_LOCAL_MARKET: LiteralLocalizationLeaf;
      // Template: Production fees
      FEE_PRODUCTION: LiteralLocalizationLeaf;
      // Template: Base establishment fees
      FEE_SITE_ESTABLISHMENT: LiteralLocalizationLeaf;
      // Template: Warehouse fees
      FEE_WAREHOUSE: LiteralLocalizationLeaf;
      // Template: Gateway fuel
      GATEWAY_FUEL: LiteralLocalizationLeaf;
      // Template: Link gateway
      GATEWAY_LINK: LiteralLocalizationLeaf;
      // Template: Gateway pricing
      GATEWAY_PRICING: LiteralLocalizationLeaf;
      // Template: Unlink gateway
      GATEWAY_UNLINK: LiteralLocalizationLeaf;
      // Template: Construct infrastructure
      INFRASTRUCTURE_CONSTRUCTION: LiteralLocalizationLeaf;
      // Template: Infrastructure name
      INFRASTRUCTURE_NAME: LiteralLocalizationLeaf;
      // Template: Upgrade infrastructure
      INFRASTRUCTURE_UPGRADE: LiteralLocalizationLeaf;
      // Template: Infrastructure upkeep
      INFRASTRUCTURE_UPKEEP: LiteralLocalizationLeaf;
      // Template: Payout
      PAYOUT: LiteralLocalizationLeaf;
      // Template: Infrastructure levels
      POPULATION_INFRASTRUCTURE_LEVEL: LiteralLocalizationLeaf;
      // Template: Workforce program
      WORKFORCE_PROGRAM: LiteralLocalizationLeaf;
    };
    Condition: {
      // Template: buy commodities
      BUY_MATERIAL_FROM_CATEGORY: LiteralLocalizationLeaf;
      // Template: fulfill country contract
      FULFILL_COUNTRY_CONTRACT: LiteralLocalizationLeaf;
      // Template: increase satisfaction
      INCREASE_SATISFACTION: LiteralLocalizationLeaf;
      // Template: make money
      MAKE_MONEY: LiteralLocalizationLeaf;
      // Template: wait
      WAIT: LiteralLocalizationLeaf;
      // Template: #{index}
      dependency: {
        getFormat: () => IntlMessageFormat;
        message: (options: { index: string }) => string;
      };
    };
    ConditionEditForm: {
      action: {
        // Template: save
        save: LiteralLocalizationLeaf;
      };
    };
    ConditionText: {
      // Template: Set up a base
      baseConstruction: LiteralLocalizationLeaf;
      // Template: Construct a building
      buildingConstruction: LiteralLocalizationLeaf;
      // Template: Buy some {category} at the commodity exchange
      buyMaterialFromCategory: {
        getFormat: () => IntlMessageFormat;
        message: (options: { category: string }) => string;
      };
      // Template: Finish a ship construction project
      construction: LiteralLocalizationLeaf;
      // Template: Contribute building or upkeep materials to a infrastructure project @ {address}
      contribution: {
        getFormat: () => IntlMessageFormat;
        message: (options: { address: string }) => string;
      };
      // Template: Delivery of {amount, number} {amount, plural, one {unit} other {units}} of {material} to {address}
      delivery: {
        getFormat: () => IntlMessageFormat;
        message: (options: { amount: number; material: string; address: string }) => string;
      };
      // Template: Deliver shipment @ {address}
      deliveryShipment: {
        getFormat: () => IntlMessageFormat;
        message: (options: { address: string }) => string;
      };
      exploration: {
        // Template: Conduct planetary exploration survey @ {address}
        planet: {
          getFormat: () => IntlMessageFormat;
          message: (options: { address: string }) => string;
        };
        // Template: Conduct exploration survey @ {address} system
        system: {
          getFormat: () => IntlMessageFormat;
          message: (options: { address: string }) => string;
        };
      };
      // Template: Finish a flight
      finishFlight: LiteralLocalizationLeaf;
      // Template: Fulfill a faction contract
      fulfillCountryContract: LiteralLocalizationLeaf;
      // Template: Provide {infrastructure} with fuel in upkeep phase {phase} keeping the service level above {level}
      gatewayFuel: {
        getFormat: () => IntlMessageFormat;
        message: (options: { infrastructure: string; phase: string; level: string }) => string;
      };
      // Template: Increase a workforce satisfaction to at least {requiredSatisfaction}
      increaseSatisfaction: {
        getFormat: () => IntlMessageFormat;
        message: (options: { requiredSatisfaction: string }) => string;
      };
      // Template: Finish construction of infrastructure
      infrastructureConstructionFinish: LiteralLocalizationLeaf;
      // Template: Start construction of {type} infrastructure at {address}
      infrastructureConstructionStart: {
        getFormat: () => IntlMessageFormat;
        message: (options: { type: string; address: string }) => string;
      };
      // Template: Finish upgrade of infrastructure
      infrastructureUpgradeFinish: LiteralLocalizationLeaf;
      // Template: Start upgrade of {type} {link}
      infrastructureUpgradeStart: {
        getFormat: () => IntlMessageFormat;
        message: (options: { type: string; link: string }) => string;
      };
      // Template: Provide infrastructure upkeep for {type} {infrastructure} in upkeep phase {phase} keeping the service level above {level}
      infrastructureUpkeep: {
        getFormat: () => IntlMessageFormat;
        message: (options: {
          type: string;
          infrastructure: string;
          phase: string;
          level: string;
        }) => string;
      };
      // Template: Pay installment: {interest} interest, {repayment} repayment
      loanInstallment: {
        getFormat: () => IntlMessageFormat;
        message: (options: { interest: string; repayment: string }) => string;
      };
      // Template: Pay out loan: {amount}
      loanPayout: {
        getFormat: () => IntlMessageFormat;
        message: (options: { amount: string }) => string;
      };
      // Template: Repair one of your ships
      maintenance: LiteralLocalizationLeaf;
      // Template: Earn at least {threshold}
      makeMoney: {
        getFormat: () => IntlMessageFormat;
        message: (options: { threshold: string }) => string;
      };
      // Template: Payment of {amount}
      payment: {
        getFormat: () => IntlMessageFormat;
        message: (options: { amount: string }) => string;
      };
      // Template: Pick up {amount, number} {amount, plural, one {unit} other {units}} of {material} @ {address}
      pickup: {
        getFormat: () => IntlMessageFormat;
        message: (options: { amount: number; material: string; address: string }) => string;
      };
      // Template: Pickup shipment @ {address}
      pickupShipment: {
        getFormat: () => IntlMessageFormat;
        message: (options: { address: string }) => string;
      };
      // Template: Place a commodity exchange order
      placeOrder: LiteralLocalizationLeaf;
      // Template: Become an elected governor
      power: LiteralLocalizationLeaf;
      // Template: Complete a production order
      productionOrderCompleted: LiteralLocalizationLeaf;
      // Template: Start a production order
      productionRun: LiteralLocalizationLeaf;
      // Template: Provision {amount, number} {amount, plural, one {unit} other {units}} of {material} @ {address}
      provision: {
        // Template: (auto-provisioned)
        autoprovision: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { amount: number; material: string; address: string }) => string;
      };
      // Template: Provision shipment of {amount, number} {amount, plural, one {unit} other {units}} of {material} @ {address} {autoprovision}
      provisionShipment: {
        getFormat: () => IntlMessageFormat;
        message: (options: {
          amount: number;
          material: string;
          address: string;
          autoprovision: string;
        }) => string;
      };
      // Template: Grant {reputation} faction reputation points
      reputation: {
        getFormat: () => IntlMessageFormat;
        message: (options: { reputation: string }) => string;
      };
      // Template: Start a flight
      startFlight: LiteralLocalizationLeaf;
      // Template: Upgrade your headquarters
      upgrade: LiteralLocalizationLeaf;
      // Template: Wait {duration}
      wait: {
        getFormat: () => IntlMessageFormat;
        message: (options: { duration: string }) => string;
      };
      // Template: Start workforce program {type}
      workforceProgramStart: {
        getFormat: () => IntlMessageFormat;
        message: (options: { type: string }) => string;
      };
    };
    ConditionType: {
      // Template: building construction
      BUILDING_CONSTRUCTION: LiteralLocalizationLeaf;
      // Template: base construction
      CONDITION_BASE_CONSTRUCTION: LiteralLocalizationLeaf;
      // Template: commodity exchange purchase pickup
      CONDITION_COMEX_PURCHASE_PICKUP: LiteralLocalizationLeaf;
      // Template: ship construction
      CONDITION_CONSTRUCT_SHIP: LiteralLocalizationLeaf;
      // Template: contribution
      CONDITION_CONTRIBUTION: LiteralLocalizationLeaf;
      // Template: delivery
      CONDITION_DELIVERY: LiteralLocalizationLeaf;
      // Template: shipment delivery
      CONDITION_DELIVERY_SHIPMENT: LiteralLocalizationLeaf;
      // Template: exploration
      CONDITION_EXPLORATION: LiteralLocalizationLeaf;
      // Template: flight end
      CONDITION_FINISH_FLIGHT: LiteralLocalizationLeaf;
      // Template: gateway fuel
      CONDITION_GATEWAY_FUEL: LiteralLocalizationLeaf;
      // Template: headquarters upgrade
      CONDITION_HEADQUARTERS_UPGRADE: LiteralLocalizationLeaf;
      // Template: infrastructure construction start
      CONDITION_INFRASTRUCTURE_CONSTRUCTION_START: LiteralLocalizationLeaf;
      // Template: infrastructure upgrade start
      CONDITION_INFRASTRUCTURE_UPGRADE_START: LiteralLocalizationLeaf;
      // Template: infrastructure upkeep
      CONDITION_INFRASTRUCTURE_UPKEEP: LiteralLocalizationLeaf;
      // Template: loan installment
      CONDITION_LOAN_INSTALLMENT: LiteralLocalizationLeaf;
      // Template: loan payout
      CONDITION_LOAN_PAYOUT: LiteralLocalizationLeaf;
      // Template: payment
      CONDITION_PAYMENT: LiteralLocalizationLeaf;
      // Template: commodity pickup
      CONDITION_PICKUP: LiteralLocalizationLeaf;
      // Template: shipment pickup
      CONDITION_PICKUP_SHIPMENT: LiteralLocalizationLeaf;
      // Template: order placement
      CONDITION_PLACE_ORDER: LiteralLocalizationLeaf;
      // Template: election
      CONDITION_POWER: LiteralLocalizationLeaf;
      // Template: production order completion
      CONDITION_PRODUCTION_ORDER_COMPLETED: LiteralLocalizationLeaf;
      // Template: production finish
      CONDITION_PRODUCTION_RUN: LiteralLocalizationLeaf;
      // Template: commodity provisioning
      CONDITION_PROVISION: LiteralLocalizationLeaf;
      // Template: shipment provisioning
      CONDITION_PROVISION_SHIPMENT: LiteralLocalizationLeaf;
      // Template: ship repair
      CONDITION_REPAIR_SHIP: LiteralLocalizationLeaf;
      // Template: reputation
      CONDITION_REPUTATION: LiteralLocalizationLeaf;
      // Template: flight start
      CONDITION_START_FLIGHT: LiteralLocalizationLeaf;
      // Template: payment
      CONDITION_WORKFORCE_PROGRAM_PAYMENT: LiteralLocalizationLeaf;
      // Template: program start
      CONDITION_WORKFORCE_PROGRAM_START: LiteralLocalizationLeaf;
      // Template: infrastructure construction finish
      INFRASTRUCTURE_CONSTRUCTION_FINISH: LiteralLocalizationLeaf;
      // Template: infrastructure upgrade finish
      INFRASTRUCTURE_UPGRADE_FINISH: LiteralLocalizationLeaf;
    };
    Connecting: {
      client: {
        // Template: Establishing console connection…
        connecting: LiteralLocalizationLeaf;
        // Template: Console connection lost. Will attempt to re-connect…
        disconnected: LiteralLocalizationLeaf;
        // Template: Trying to re-connect…
        reconnecting: LiteralLocalizationLeaf;
      };
      server: {
        // Template: Connecting to APEX network…
        connecting: LiteralLocalizationLeaf;
        // Template: Failed to connect to APEX network. Please try again later.
        connectionFailure: LiteralLocalizationLeaf;
        // Template: Lost connection to APEX network. Please restart your console.
        disconnected: LiteralLocalizationLeaf;
      };
    };
    ConstructInfrastructureComponent: {
      label: {
        // Template: Address
        address: LiteralLocalizationLeaf;
        // Template: Constructor
        _constructor: LiteralLocalizationLeaf;
        // Template: Currency
        currency: LiteralLocalizationLeaf;
        // Template: Deadline
        deadline: LiteralLocalizationLeaf;
        // Template: Payment
        payment: LiteralLocalizationLeaf;
        // Template: Type
        type: LiteralLocalizationLeaf;
      };
    };
    ContextControls: {
      // Template: {command}{label}
      contextItem: {
        getFormat: () => IntlMessageFormat;
        message: (options: { command: string; label: string }) => string;
      };
      // Template: CTXS
      contexts: LiteralLocalizationLeaf;
      // Template: CTX: {context}
      title: {
        getFormat: () => IntlMessageFormat;
        message: (options: { context: string }) => string;
      };
    };
    ContextName: {
      company: {
        // Template: Company: {name}
        title: {
          getFormat: () => IntlMessageFormat;
          message: (options: { name: string }) => string;
        };
      };
      government: {
        // Template: Government @ {address}
        title: {
          getFormat: () => IntlMessageFormat;
          message: (options: { address: string }) => string;
        };
      };
    };
    Contract: {
      action: {
        // Template: accept
        close: LiteralLocalizationLeaf;
        // Template: reject
        reject: LiteralLocalizationLeaf;
        // Template: request termination
        requestTermination: {
          // Template: Contracts can be terminated if both parties send a termination request.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
      banner: {
        action: {
          // Template: breach
          breach: LiteralLocalizationLeaf;
          // Template: extend
          extend: LiteralLocalizationLeaf;
        };
      };
      // Template: Contract conditions
      conditions: LiteralLocalizationLeaf;
      // Template: Created
      date: LiteralLocalizationLeaf;
      fulfillCondition: {
        // Template: fulfill
        confirm: LiteralLocalizationLeaf;
        // Template: One of the contract parties has requested to terminate this contract. Do you really want to fulfill this condition?
        confirmation: LiteralLocalizationLeaf;
      };
      // Template: ID
      id: LiteralLocalizationLeaf;
      // Template: Name
      name: LiteralLocalizationLeaf;
      // Template: Partner
      partner: LiteralLocalizationLeaf;
      // Template: Preamble
      preamble: LiteralLocalizationLeaf;
      // Template: Status
      status: LiteralLocalizationLeaf;
      table: {
        // Template: Cmds
        command: LiteralLocalizationLeaf;
        // Template: Condition
        condition: LiteralLocalizationLeaf;
        // Template: Deadline
        deadline: {
          // Template: The duration of a deadline which is currently not active, will be shown in parenthesis.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Depends on
        dependencies: LiteralLocalizationLeaf;
        // Template: Index
        index: LiteralLocalizationLeaf;
        // Template: Party
        party: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
      };
      // Template: Termination request
      termination: {
        // Template: received
        received: LiteralLocalizationLeaf;
        // Template: sent
        sent: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
    };
    ContractCondition: {
      // Template: fulfilled
      FULFILLED: LiteralLocalizationLeaf;
      // Template: fulfillment attempted
      FULFILLMENT_ATTEMPTED: LiteralLocalizationLeaf;
      // Template: in progress
      IN_PROGRESS: LiteralLocalizationLeaf;
      // Template: partly fulfilled
      PARTLY_FULFILLED: LiteralLocalizationLeaf;
      // Template: pending
      PENDING: LiteralLocalizationLeaf;
      // Template: violated
      VIOLATED: LiteralLocalizationLeaf;
      // Template: ({duration})
      deadline: {
        getFormat: () => IntlMessageFormat;
        message: (options: { duration: string }) => string;
      };
      // Template: fulfill
      fulfill: LiteralLocalizationLeaf;
    };
    ContractDraft: {
      action: {
        // Template: save
        save: LiteralLocalizationLeaf;
        // Template: Select Template
        template: LiteralLocalizationLeaf;
      };
      condition: {
        // Template: {deadline, plural, one {# day} other {# days}}
        deadline: {
          getFormat: () => IntlMessageFormat;
          message: (options: { deadline: number }) => string;
        };
      };
      form: {
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Preamble
        preamble: {
          // Template: Contract preamble
          placeholder: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Repeating
        repeating: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
      };
      header: {
        // Template: Conditions
        conditions: LiteralLocalizationLeaf;
        // Template: Send contract draft
        send: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Template
        template: LiteralLocalizationLeaf;
      };
      table: {
        action: {
          // Template: condition
          condition: LiteralLocalizationLeaf;
          // Template: parameter
          parameter: LiteralLocalizationLeaf;
        };
        // Template: Cmds
        commands: LiteralLocalizationLeaf;
        // Template: Condition
        condition: LiteralLocalizationLeaf;
        // Template: Deadline
        deadline: LiteralLocalizationLeaf;
        // Template: Depends on
        dependency: LiteralLocalizationLeaf;
        // Template: Index
        index: LiteralLocalizationLeaf;
        // Template: Party
        party: LiteralLocalizationLeaf;
      };
    };
    ContractDraftSend: {
      action: {
        // Template: discard
        discard: LiteralLocalizationLeaf;
        // Template: save
        save: LiteralLocalizationLeaf;
        // Template: send
        send: LiteralLocalizationLeaf;
      };
      form: {
        // Template: Recipient
        recipient: LiteralLocalizationLeaf;
      };
    };
    ContractDrafts: {
      actions: {
        // Template: copy
        copy: LiteralLocalizationLeaf;
        // Template: Create new
        create: LiteralLocalizationLeaf;
        // Template: delete
        _delete: LiteralLocalizationLeaf;
        // Template: View
        view: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Cmds
        commands: LiteralLocalizationLeaf;
        // Template: Created
        creationTime: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
      };
    };
    ContractDraftsPanel: {
      action: {
        // Template: delete draft
        _delete: {
          // Template: The contract draft '{name}' will be deleted.
          confirmation: {
            getFormat: () => IntlMessageFormat;
            message: (options: { name: string }) => string;
          };
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: send draft
        send: {
          // Template: The contract draft '{name}' will be sent to '{user}'.
          confirmation: {
            getFormat: () => IntlMessageFormat;
            message: (options: { name: string; user: string }) => string;
          };
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
      error: {
        // Template: No draft found.
        draft: LiteralLocalizationLeaf;
      };
      title: {
        // Template: Contract Draft
        draft: LiteralLocalizationLeaf;
        // Template: Contract Drafts
        drafts: LiteralLocalizationLeaf;
      };
    };
    ContractPanel: {
      // Template: This contract will be breached in {countdown}. You can choose to either breach the contract immediately or grant an extension.
      extensionWithControl: {
        getFormat: () => IntlMessageFormat;
        message: (options: { countdown: string }) => string;
      };
      // Template: This contract will be breached in {countdown} unless your partner grants an extension.
      extensionWithoutControl: {
        getFormat: () => IntlMessageFormat;
        message: (options: { countdown: string }) => string;
      };
      // Template: Contract {id}
      title: {
        // Template: Contract loading
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { id: string }) => string;
      };
    };
    ContractStatus: {
      // Template: breached
      BREACHED: LiteralLocalizationLeaf;
      // Template: cancelled
      CANCELLED: LiteralLocalizationLeaf;
      // Template: closed
      CLOSED: LiteralLocalizationLeaf;
      // Template: deadline exceeded
      DEADLINE_EXCEEDED: LiteralLocalizationLeaf;
      // Template: draft
      DRAFT: LiteralLocalizationLeaf;
      // Template: fulfilled
      FULFILLED: LiteralLocalizationLeaf;
      // Template: open
      OPEN: LiteralLocalizationLeaf;
      // Template: partially fulfilled
      PARTIALLY_FULFILLED: LiteralLocalizationLeaf;
      // Template: rejected
      REJECTED: LiteralLocalizationLeaf;
      // Template: terminated
      TERMINATED: LiteralLocalizationLeaf;
    };
    Contracts: {
      context: {
        // Template: Contract Drafts
        contractDrafts: LiteralLocalizationLeaf;
        // Template: Contracts
        contracts: LiteralLocalizationLeaf;
      };
    };
    ContractsPanel: {
      filter: {
        // Template: all
        all: LiteralLocalizationLeaf;
        // Template: hide filters
        hide: LiteralLocalizationLeaf;
        // Template: none
        none: LiteralLocalizationLeaf;
        // Template: show filters
        show: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Cmds
        cmds: LiteralLocalizationLeaf;
        // Template: Created
        created: LiteralLocalizationLeaf;
        // Template: Due
        due: LiteralLocalizationLeaf;
        // Template: Contract
        id: LiteralLocalizationLeaf;
        // Template: Partner
        partner: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
        // Template: view
        view: LiteralLocalizationLeaf;
      };
      // Template: Contracts
      title: LiteralLocalizationLeaf;
    };
    Contribution: {
      button: {
        // Template: contribute
        contribute: LiteralLocalizationLeaf;
      };
      // Template: (every {interval, plural, one {day} other {{interval} days}})
      consumption: {
        getFormat: () => IntlMessageFormat;
        message: (options: { interval: string }) => string;
      };
      // Template: Inventory
      stores: LiteralLocalizationLeaf;
      table: {
        // Template: Contribution
        contribution: LiteralLocalizationLeaf;
        // Template: Inventory
        inventory: LiteralLocalizationLeaf;
        // Template: Last for
        lastFor: LiteralLocalizationLeaf;
        // Template: Next Consumption
        nextConsumption: LiteralLocalizationLeaf;
        // Template: Reserve
        reserve: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
      };
    };
    ContributionComponent: {
      label: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Contributor
        contributor: LiteralLocalizationLeaf;
        // Template: Currency
        currency: LiteralLocalizationLeaf;
      };
    };
    Contributions: {
      label: {
        // Template: There are no recent contributions
        noContributions: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Contributor
        contributor: LiteralLocalizationLeaf;
        // Template: Materials
        materials: LiteralLocalizationLeaf;
        // Template: Time
        time: LiteralLocalizationLeaf;
      };
    };
    CoporationContainer: {
      data: {
        // Template: APEX representation center
        representationCenter: {
          // Template: Level {level}
          level: {
            getFormat: () => IntlMessageFormat;
            message: (options: { level: string }) => string;
          };
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
    };
    Corporation: {
      infrastructure: {
        // Template: Cmd
        command: {
          // Template: contribute
          contribute: LiteralLocalizationLeaf;
          // Template: project
          project: LiteralLocalizationLeaf;
          // Template: view
          view: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: No infrastructure projects found.
        empty: LiteralLocalizationLeaf;
        // Template: Location
        location: LiteralLocalizationLeaf;
        // Template: Project
        project: LiteralLocalizationLeaf;
        // Template: Start project
        startproject: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
      };
    };
    CorporationContainer: {
      data: {
        // Template: Code
        code: LiteralLocalizationLeaf;
        // Template: Faction
        country: LiteralLocalizationLeaf;
        // Template: Founded
        founded: LiteralLocalizationLeaf;
        // Template: (unfinished)
        headquarter: LiteralLocalizationLeaf;
        // Template: Headquarters
        headquarters: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: {entity} ({share})
        shareholder: {
          getFormat: () => IntlMessageFormat;
          message: (options: { entity: string; share: string }) => string;
        };
        // Template: Shareholders
        shareholders: LiteralLocalizationLeaf;
        // Template: Total Shares
        shares: LiteralLocalizationLeaf;
      };
    };
    CorporationFinance: {
      balances: {
        // Template: Balance
        balance: LiteralLocalizationLeaf;
        // Template: Currency
        currency: LiteralLocalizationLeaf;
      };
      dividendPayouts: {
        // Template: Payout per share
        payoutpershare: LiteralLocalizationLeaf;
        // Template: Time
        time: LiteralLocalizationLeaf;
      };
      header: {
        // Template: Recent dividend payouts
        dividendpayouts: LiteralLocalizationLeaf;
        // Template: Liquid assets
        liquidassets: LiteralLocalizationLeaf;
      };
      info: {
        // Template: Currency
        currency: LiteralLocalizationLeaf;
        // Template: Next dividend payout
        nextDividendPayout: LiteralLocalizationLeaf;
        // Template: Shareholders
        shareholders: LiteralLocalizationLeaf;
        // Template: Shares
        shares: LiteralLocalizationLeaf;
      };
    };
    CorporationFinancePanel: {
      // Template: no primary holding
      noPrimaryHolding: LiteralLocalizationLeaf;
    };
    CorporationInviteContainer: {
      error: {
        // Template: Company not found
        notFound: LiteralLocalizationLeaf;
      };
      // Template: Invite Company
      invite: {
        // Template: If {company} is not already a member of another corporation, you can invite it to become one of yours.
        description: {
          getFormat: () => IntlMessageFormat;
          message: (options: { company: string }) => string;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      pendingInvite: {
        // Template: Capital Contribution
        contribution: LiteralLocalizationLeaf;
        // Template: Invite sent
        invited: LiteralLocalizationLeaf;
        // Template: Company
        invitee: LiteralLocalizationLeaf;
        // Template: Invited by
        invitor: LiteralLocalizationLeaf;
        // Template: Shares
        shares: LiteralLocalizationLeaf;
      };
      // Template: Corporation Invite: {name}
      title: {
        // Template: Corporation Invite
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    CorporationInvitesContainer: {
      table: {
        // Template: No pending invitations.
        empty: LiteralLocalizationLeaf;
        // Template: Company
        invitee: LiteralLocalizationLeaf;
        // Template: Invited by
        invitor: LiteralLocalizationLeaf;
        // Template: Invite sent
        sent: LiteralLocalizationLeaf;
        // Template: view
        view: LiteralLocalizationLeaf;
      };
      // Template: Corporation Invites
      title: LiteralLocalizationLeaf;
    };
    CorporationMembership: {
      formCorporation: {
        // Template: Form New Corporation
        title: LiteralLocalizationLeaf;
      };
      invites: {
        // Template: Invitations to join existing Corporations
        title: LiteralLocalizationLeaf;
      };
    };
    CorporationMembershipPanel: {
      action: {
        // Template: Are you sure you want to leave the corporation? You will need another invitation to join again!
        confirmation: LiteralLocalizationLeaf;
        // Template: Leave
        leave: LiteralLocalizationLeaf;
      };
      // Template: Your Corporation
      title: LiteralLocalizationLeaf;
    };
    CorporationNewProject: {
      action: {
        // Template: Project started!
        started: LiteralLocalizationLeaf;
      };
      command: {
        // Template: start
        start: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Bill of material
        billofmaterial: LiteralLocalizationLeaf;
        // Template: Description
        description: LiteralLocalizationLeaf;
        // Template: Limit
        limit: LiteralLocalizationLeaf;
        // Template: Location
        location: LiteralLocalizationLeaf;
        // Template: Project
        project: LiteralLocalizationLeaf;
        // Template: Site
        site: LiteralLocalizationLeaf;
      };
      // Template: {amount} / {cardinality}
      limit: {
        getFormat: () => IntlMessageFormat;
        message: (options: { amount: string; cardinality: string }) => string;
      };
    };
    CorporationNewProjectPanel: {
      // Template: You are not member in a corporation
      empty: LiteralLocalizationLeaf;
      // Template: New corporation project
      title: LiteralLocalizationLeaf;
    };
    CorporationProject: {
      // Template: Location
      address: LiteralLocalizationLeaf;
      // Template: Bill of material
      billOfMaterial: LiteralLocalizationLeaf;
      // Template: CMD
      command: {
        // Template: Cancel Project
        cancelProject: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Constructed
      constructionDate: LiteralLocalizationLeaf;
      contribute: {
        // Template: You need a base or a ship on the planet to be able to contribute.
        error: LiteralLocalizationLeaf;
      };
      description: {
        // Template: NO FUNCTIONALITY ATM - Prestige Building
        ftl_laboratory: LiteralLocalizationLeaf;
        // Template: Corporation Headquarters are the first project a newly founded corporation has to build in order to function properly. Headquarters have to be built on a planet outside faction space and will provide a 10% production boost for all members on that planet.
        hq: LiteralLocalizationLeaf;
        // Template: NO FUNCTIONALITY ATM - Prestige Building
        immortality_center: LiteralLocalizationLeaf;
        // Template: The APEX representation center allows corporations to donate some of their profits to the APEX foundation.{break}The foundation uses the money to supply new and upcoming CEOs with the necessary capital and ships to start their entrepreneurial journey.{break}Having a high representation level is widely recognized as a testimony of wealth and success.
        representation_center: {
          getFormat: () => IntlMessageFormat;
          message: (options: { break: string }) => string;
        };
        // Template: NO FUNCTIONALITY ATM - Prestige Building
        terraforming_center: LiteralLocalizationLeaf;
      };
      // Template: --
      empty: LiteralLocalizationLeaf;
      // Template: FTL Laboratory
      ftl_laboratory: LiteralLocalizationLeaf;
      // Template: Headquarters
      hq: LiteralLocalizationLeaf;
      // Template: Immortality Center
      immortality_center: LiteralLocalizationLeaf;
      // Template: Project:
      project: LiteralLocalizationLeaf;
      // Template: APEX Representation Center
      representation_center: LiteralLocalizationLeaf;
      section: {
        // Template: Contribute
        contribute: LiteralLocalizationLeaf;
        // Template: Contributions
        contributions: LiteralLocalizationLeaf;
      };
      // Template: Status
      status: {
        // Template: in construction
        inConstruction: LiteralLocalizationLeaf;
        // Template: operational
        operational: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Terraforming Center
      terraforming_center: LiteralLocalizationLeaf;
      ticker: {
        // Template: FTL
        ftl_laboratory: LiteralLocalizationLeaf;
        // Template: HQ
        hq: LiteralLocalizationLeaf;
        // Template: IMM
        immortality_center: LiteralLocalizationLeaf;
        // Template: CRC
        representation_center: LiteralLocalizationLeaf;
        // Template: TFC
        terraforming_center: LiteralLocalizationLeaf;
      };
    };
    CorporationProjectPanel: {
      action: {
        // Template: Cancel project
        cancel: {
          // Template: Are you sure you want to cancel this project? No materials can be reimbursed.
          confirmation: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
      error: {
        // Template: No project found.
        projectId: LiteralLocalizationLeaf;
      };
      // Template: You are not member in a corporation
      noCorporation: LiteralLocalizationLeaf;
      // Template: Corporation project: {type} @ {name}
      title: {
        // Template: Corporation project: loading…
        loading: LiteralLocalizationLeaf;
        // Template: Corporation project: not found…
        notFound: LiteralLocalizationLeaf;
        // Template: Corporation projects
        projects: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { type: string; name: string }) => string;
      };
    };
    CorporationRepresentationCenter: {
      error: {
        // Template: No APEX Representation Center found
        noRepresentation: LiteralLocalizationLeaf;
      };
      // Template: APEX Representation Center
      title: LiteralLocalizationLeaf;
    };
    Corporations: {
      action: {
        // Template: details
        detail: LiteralLocalizationLeaf;
      };
      list: {
        // Template: Code
        code: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
      };
    };
    CorporationsPanel: {
      error: {
        // Template: Corporation not found.
        corporationId: LiteralLocalizationLeaf;
      };
      title: {
        // Template: Corporations
        listing: LiteralLocalizationLeaf;
        // Template: Corporation: {name}
        single: {
          // Template: Corporation
          loading: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: { name: string }) => string;
        };
      };
    };
    CorporationsTile: {
      // Template: Failed to load corporations.
      error: LiteralLocalizationLeaf;
    };
    Country: {
      AI: {
        // Template: At the time the planet-killer was discovered, early colonization efforts on Mars had just started to bear fruit. Not quite self-sustaining yet, the young colony had to decide whether to focus on making Mars habitable, accepting the risk of unknown consequences caused by a total destruction of earth, or to divert resources to the exodus project. The population was divided over the topic and eventually, the Antares Initiative split off to pursue a cost-effective way to reach the new homeworlds. Their technology is very basic and makes use of whatever was available on Mars at the time. They were among the first to leave and did so with many small, autonomous ships. Due to their sub-standard propulsion systems they only arrived very late in the colonies.
        description: LiteralLocalizationLeaf;
        // Template: Antares Initiative
        name: LiteralLocalizationLeaf;
      };
      CI: {
        // Template: Castillo-Ito Mercantile is the result of a merger between the Ito Robotics Corporation, a world leader in robotics and automation technology, and the Castillo Group, an international holding company dealing in just about everything including minerals, energy, transport and financial products. The company’s net worth easily surpasses many European countries combined. They entered the exodus project early on and had a clear strategy in mind from the get-go. Carefully selecting promising planets in strategic locations, they assembled a fleet of reliable generation ships, all of which successfully made the trip to and landfall on planets in 4 neighboring systems. With access to many crucial resources, they plan on fueling their ambitions plans to become a major force in the new worlds.
        description: LiteralLocalizationLeaf;
        // Template: Castillo-Ito Mercantile
        name: LiteralLocalizationLeaf;
      };
      IC: {
        // Template: Before the exodus, South America had become the breadbasket of the world and the countries and corporations of the continent had their mind set on becoming the same in the new worlds. Coordinated by the Insitor Bank, a cooperative owned and controlled mostly by agricultural and bio-tech companies, they opted for a monolithic approach, building a single huge, completely self-sufficient generation ship with more greenhouse and livestock capacity than any other design pursued by other factions. To satisfy the enormous need for resources, they pushed their governments to nationalize most of the private mining companies. Their colonization target was a very fertile planet they christened Promitor.
        description: LiteralLocalizationLeaf;
        // Template: Insitor Cooperative
        name: LiteralLocalizationLeaf;
      };
      NC: {
        // Template: NCE started out as one of the first space-based mining corporations. A charter granted by a European monarchy allowed them to exploit the name-giving near-earth objects between Earth and the Asteroid Belt. When the news of the exodus project broke, they already had the necessary infrastructure in place to start construction of a large generation ship right away. For this purpose, they captured a small asteroid, hollowed it out and used the excavated minerals to manufacture most required systems in place. All of this happened in relative independence of Earth, but NCE still opted for participation in the APEX system to gain access to funds and components that were only available on Earth. After their arrival in a mineral-rich star system, they parked the generation ship on an orbit around one planet and quickly sent smaller ships to make landfall on a second one.
        description: LiteralLocalizationLeaf;
        // Template: NEO Charter Exploration
        name: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Faction agents
        agents: LiteralLocalizationLeaf;
        // Template: Background
        background: LiteralLocalizationLeaf;
        // Template: Code
        code: LiteralLocalizationLeaf;
        // Template: Contract offers
        contractOffers: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Receive contract offers
        receiveContractOffers: LiteralLocalizationLeaf;
      };
    };
    CountryAgent: {
      AI: {
        // Template: Antares Development Manager
        EXPANSION: LiteralLocalizationLeaf;
        // Template: Antares Chief Scientist
        EXPLORATION: LiteralLocalizationLeaf;
        // Template: Antares Chief Administration Officer
        GOVERNANCE: LiteralLocalizationLeaf;
        // Template: Antares Head of Excellence
        INFRASTRUCTURE: LiteralLocalizationLeaf;
        // Template: Antares Logistics Officer
        LOGISTICS: LiteralLocalizationLeaf;
      };
      CI: {
        // Template: Castillo-Ito Influence Executive
        EXPANSION: LiteralLocalizationLeaf;
        // Template: Castillo-Ito Exploration Officer
        EXPLORATION: LiteralLocalizationLeaf;
        // Template: Castillo-Ito Minister of Balance
        GOVERNANCE: LiteralLocalizationLeaf;
        // Template: Castillo-Ito Framework Manager
        INFRASTRUCTURE: LiteralLocalizationLeaf;
        // Template: Castillo-Ito Director of Coordination
        LOGISTICS: LiteralLocalizationLeaf;
      };
      IC: {
        // Template: Insitor Director of Advancement
        EXPANSION: LiteralLocalizationLeaf;
        // Template: Insitor Director of Space Analysis
        EXPLORATION: LiteralLocalizationLeaf;
        // Template: Insitor Head Diplomat
        GOVERNANCE: LiteralLocalizationLeaf;
        // Template: Insitor Infrastructure Officer
        INFRASTRUCTURE: LiteralLocalizationLeaf;
        // Template: Insitor Distribution Manager
        LOGISTICS: LiteralLocalizationLeaf;
      };
      NC: {
        // Template: NEO Charter Expanse Officer
        EXPANSION: LiteralLocalizationLeaf;
        // Template: NEO Charter Expedition Manager
        EXPLORATION: LiteralLocalizationLeaf;
        // Template: NEO Charter Empire Official
        GOVERNANCE: LiteralLocalizationLeaf;
        // Template: NEO Charter Director of Upkeep
        INFRASTRUCTURE: LiteralLocalizationLeaf;
        // Template: NEO Charter Strategy Executive
        LOGISTICS: LiteralLocalizationLeaf;
      };
    };
    CountryControls: {
      label: {
        // Template: Factions
        countries: LiteralLocalizationLeaf;
      };
    };
    CountryPanel: {
      error: {
        // Template: No faction for input ’{input}’.
        id: {
          getFormat: () => IntlMessageFormat;
          message: (options: { input: string }) => string;
        };
      };
      // Template: Faction
      title: {
        // Template: Faction {name}
        country: {
          getFormat: () => IntlMessageFormat;
          message: (options: { name: string }) => string;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
    };
    CreateGroupMembership: {
      form: {
        // Template: cancel
        cancel: LiteralLocalizationLeaf;
        // Template: create
        create: LiteralLocalizationLeaf;
        // Template: Create a Group Channel
        header: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
      };
    };
    CreateOneOnOneMembership: {
      form: {
        // Template: cancel
        cancel: LiteralLocalizationLeaf;
        // Template: start
        create: LiteralLocalizationLeaf;
        // Template: Start private Conversation
        header: LiteralLocalizationLeaf;
        // Template: Username
        name: LiteralLocalizationLeaf;
      };
    };
    CreateScreenForm: {
      button: {
        // Template: Create
        create: LiteralLocalizationLeaf;
      };
      form: {
        // Template: Description
        description: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
      };
    };
    Currency: {
      // Template: {name} ({code})
      nameAndCode: {
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string; code: string }) => string;
      };
    };
    Damage: {
      // Template: {damage}%
      value: {
        getFormat: () => IntlMessageFormat;
        message: (options: { damage: string }) => string;
      };
    };
    DeleteCompanyPanel: {
      // Template: Click here to confirm that you really wish to liquidate your current company.
      confirm: LiteralLocalizationLeaf;
      // Template: The next company liquidation is possible in {time}
      cooldown: {
        getFormat: () => IntlMessageFormat;
        message: (options: { time: string }) => string;
      };
      // Template: If you wish to start over, you can liquidate your company '{name}'.
      description: {
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
      // Template: You do not currently control a company.
      noCompany: LiteralLocalizationLeaf;
      // Template: NOTE: You have {contracts, plural, one {a pending contract} other {{contracts} pending contracts}}. Please consider resolving them first before you continue to liquidate your company.
      pendingContracts: {
        getFormat: () => IntlMessageFormat;
        message: (options: { contracts: string }) => string;
      };
      // Template: Liquidate
      submit: LiteralLocalizationLeaf;
      // Template: Company Liquidation
      title: LiteralLocalizationLeaf;
      // Template: WARNING: Once the deletion of a company has been started it can neither be stopped nor reverted!
      warning: LiteralLocalizationLeaf;
      // Template: WARNING: Selling or buying commodities at an unusual price prior to a company liquidation is illegal and may result in the revocation of your APEX license.
      warning2: LiteralLocalizationLeaf;
      // Template: WARNING: Subsequent liquidations will only be possible after a significant waiting time.
      warning3: LiteralLocalizationLeaf;
    };
    DeliveryConditionEditForm: {
      form: {
        // Template: Address
        address: LiteralLocalizationLeaf;
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Material
        material: LiteralLocalizationLeaf;
      };
    };
    Distance: {
      // Template: {distance} {unit}
      distance: {
        getFormat: () => IntlMessageFormat;
        message: (options: { distance: string; unit: string }) => string;
      };
    };
    DistanceUnit: {
      // Template: AU
      au: LiteralLocalizationLeaf;
      // Template: hops
      hops: LiteralLocalizationLeaf;
      // Template: km
      km: LiteralLocalizationLeaf;
      // Template: parsecs
      parsec: LiteralLocalizationLeaf;
    };
    Dock: {
      controls: {
        // Template: NEW BFR
        newBuffer: LiteralLocalizationLeaf;
      };
    };
    DraftConditionEditor: {
      // Template: Condition editor
      header: LiteralLocalizationLeaf;
    };
    DraftConditionParameterEditForm: {
      form: {
        // Template: Deadline
        amount: LiteralLocalizationLeaf;
      };
    };
    DraftPartyName: {
      // Template: Partner
      other: LiteralLocalizationLeaf;
      // Template: Self
      self: LiteralLocalizationLeaf;
    };
    // Template: Shipment #{id}
    DropDownBoxShipmentItem: {
      getFormat: () => IntlMessageFormat;
      message: (options: { id: string }) => string;
    };
    DropTargetView: {
      // Template: ALL
      ALL: LiteralLocalizationLeaf;
      // Template: AMT
      AMT: LiteralLocalizationLeaf;
      // Template: HLF
      HLF: LiteralLocalizationLeaf;
      // Template: MAX
      MAX: LiteralLocalizationLeaf;
      // Template: MAX VOL
      MAX_VOL: LiteralLocalizationLeaf;
      // Template: MAX WGT
      MAX_WGT: LiteralLocalizationLeaf;
    };
    EfficiencyFactor: {
      // Template: CoGC program
      COGC_PROGRAM: LiteralLocalizationLeaf;
      // Template: Company Headquarters
      COMPANY_HEADQUARTERS: LiteralLocalizationLeaf;
      // Template: Corporation Headquarters
      CORPORATION_HQ: LiteralLocalizationLeaf;
      // Template: Experts
      EXPERTS: LiteralLocalizationLeaf;
      // Template: Soil fertility
      FERTILITY: LiteralLocalizationLeaf;
      // Template: Production Line Condition
      PRODUCTION_LINE_CONDITION: LiteralLocalizationLeaf;
    };
    EndlessScrollControl: {
      label: {
        // Template: Click to load more
        loadmore: LiteralLocalizationLeaf;
      };
    };
    EntityLink: {
      // Template: Government of {entity}
      government: {
        getFormat: () => IntlMessageFormat;
        message: (options: { entity: string }) => string;
      };
    };
    EnvironmentTable: {
      row: {
        // Template: Gravity
        gravity: LiteralLocalizationLeaf;
        // Template: Pressure
        pressure: LiteralLocalizationLeaf;
        // Template: Temperature
        temperature: LiteralLocalizationLeaf;
      };
    };
    ErrorBoundary: {
      // Template: Component failed to render.
      error: LiteralLocalizationLeaf;
    };
    ExpertiseCategory: {
      // Template: Agriculture
      AGRICULTURE: LiteralLocalizationLeaf;
      // Template: Chemistry
      CHEMISTRY: LiteralLocalizationLeaf;
      // Template: Construction
      CONSTRUCTION: LiteralLocalizationLeaf;
      // Template: Electronics
      ELECTRONICS: LiteralLocalizationLeaf;
      // Template: Food Industries
      FOOD_INDUSTRIES: LiteralLocalizationLeaf;
      // Template: Fuel Refining
      FUEL_REFINING: LiteralLocalizationLeaf;
      // Template: Manufacturing
      MANUFACTURING: LiteralLocalizationLeaf;
      // Template: Metallurgy
      METALLURGY: LiteralLocalizationLeaf;
      // Template: Resource Extraction
      RESOURCE_EXTRACTION: LiteralLocalizationLeaf;
    };
    Experts: {
      action: {
        // Template: act
        activate: LiteralLocalizationLeaf;
        // Template: rmv
        deactivate: LiteralLocalizationLeaf;
      };
      // Template: {active} / {totalActiveCap}
      activeExperts: {
        getFormat: () => IntlMessageFormat;
        message: (options: { active: string; totalActiveCap: string }) => string;
      };
      // Template: {current} / {limit}
      currentAndLimit: {
        getFormat: () => IntlMessageFormat;
        message: (options: { current: string; limit: string }) => string;
      };
      label: {
        // Template: Active / Max Experts
        activeExperts: LiteralLocalizationLeaf;
        // Template: Total Experts
        totalExperts: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Active
        active: LiteralLocalizationLeaf;
        // Template: Available
        available: LiteralLocalizationLeaf;
        // Template: Category
        category: LiteralLocalizationLeaf;
        // Template: Controls
        controls: LiteralLocalizationLeaf;
        // Template: Efficiency Gain
        efficiency: LiteralLocalizationLeaf;
        // Template: Progress
        progress: LiteralLocalizationLeaf;
      };
    };
    ExpertsPanel: {
      error: {
        // Template: Base not found.
        siteId: LiteralLocalizationLeaf;
      };
      // Template: Experts @ {name} Base
      title: {
        // Template: Experts
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    ExternalURLPanel: {
      // Template: The link will open in a new tab.
      hint: LiteralLocalizationLeaf;
      // Template: This link leads to a URL outside of APEX. Please click the button below if you want to follow it anyway.
      info: LiteralLocalizationLeaf;
      // Template: Open Link
      link: LiteralLocalizationLeaf;
      // Template: External URL
      title: LiteralLocalizationLeaf;
    };
    Faction: {
      AI: {
        // Template: Martian Coin (AIC)
        currency: LiteralLocalizationLeaf;
        // Template: The Antares Initiative has two original colonies: Deimos, the Aluminium capital of the galaxy, and Phobos the manufacturing and electronics heart of the Initiative. They’ve recently started to colonize Harmonia as their future breadbasket.
        description: LiteralLocalizationLeaf;
      };
      CI: {
        // Template: Sol (CIS)
        currency: LiteralLocalizationLeaf;
        // Template: Castillo-Ito Mercantile has several more specialized colonies in its wider region often focusing on cooperation across planets. Umbra and Katoa, are known for their fuel and plastics, Proxion and Etherwind for their food, and Gibson for its construction.
        description: LiteralLocalizationLeaf;
      };
      EC: {
        // Template: Exodus Council Drawing Rights (ECD)
        currency: LiteralLocalizationLeaf;
        // Template: The Exodus Council has a single colony featuring a commodity exchange and profits from being close to the other factions.
        description: LiteralLocalizationLeaf;
      };
      IC: {
        // Template: Austral (ICA)
        currency: LiteralLocalizationLeaf;
        // Template: The Insitor Cooperative stems from its primary colony of Promitor, known as the garden of the galaxy due to its fertility. Recently, it has begun to explore its more barren backyard with the colonies of Avalon, Nova Honshu, and the further away, Boucher.
        description: LiteralLocalizationLeaf;
      };
      NC: {
        // Template: NCE Coupons (NCC)
        currency: LiteralLocalizationLeaf;
        // Template: NEO Charter Exploration has two original colonies in its main system Moria: Montem, and Vallis. Notable other colonies include Prism and a far-flung new farming colony of Verdant. The faction is known for its mineral and construction wealth.
        description: LiteralLocalizationLeaf;
      };
    };
    FeeLocalMarketComponent: {
      label: {
        // Template: Base fee
        base: LiteralLocalizationLeaf;
        // Template: Time factor
        time: LiteralLocalizationLeaf;
      };
    };
    FeeProductionContainer: {
      label: {
        // Template: Currency
        currency: LiteralLocalizationLeaf;
        // Template: Production Fees
        productionFees: LiteralLocalizationLeaf;
      };
    };
    FeeSiteEstablishmentComponent: {
      label: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
      };
    };
    FeeWarehouseComponent: {
      label: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
      };
    };
    FilterTag: {
      action: {
        // Template: x
        close: LiteralLocalizationLeaf;
      };
    };
    Finance: {
      context: {
        // Template: Balance Statement
        balanceStatement: LiteralLocalizationLeaf;
        // Template: Income Statement
        incomeStatement: LiteralLocalizationLeaf;
        // Template: Liquid Assets
        liquidAssets: LiteralLocalizationLeaf;
        // Template: Financial Overview
        overview: LiteralLocalizationLeaf;
      };
    };
    FinanceOverviewPanel: {
      header: {
        // Template: Recent Cash Transactions
        cashBookings: LiteralLocalizationLeaf;
        // Template: Key Figures
        indicators: LiteralLocalizationLeaf;
      };
      indicators: {
        assets: {
          // Template: Current Assets
          current: LiteralLocalizationLeaf;
          // Template: Fixed Assets
          fixed: LiteralLocalizationLeaf;
          // Template: Liquid Assets
          liquid: LiteralLocalizationLeaf;
        };
        // Template: Equity
        equity: LiteralLocalizationLeaf;
        // Template: Expenses
        expenses: LiteralLocalizationLeaf;
        // Template: Liabilities
        liabilities: LiteralLocalizationLeaf;
        // Template: Result
        result: LiteralLocalizationLeaf;
        // Template: Revenue
        revenue: LiteralLocalizationLeaf;
      };
      // Template: Financial Overview
      title: LiteralLocalizationLeaf;
    };
    Fleet: {
      context: {
        // Template: Planet Info
        planetInformation: LiteralLocalizationLeaf;
        // Template: Ship Flight Control
        shipFlightControl: LiteralLocalizationLeaf;
        // Template: System Map
        systemMap: LiteralLocalizationLeaf;
      };
    };
    FleetPanel: {
      error: {
        // Template: Planet not found.
        planetId: LiteralLocalizationLeaf;
        // Template: System not found.
        systemId: LiteralLocalizationLeaf;
      };
      // Template: Fleet
      fleet: LiteralLocalizationLeaf;
      // Template: Fleet @ {address}
      fleetAt: {
        getFormat: () => IntlMessageFormat;
        message: (options: { address: string }) => string;
      };
      table: {
        // Template: Cargo
        cargo: LiteralLocalizationLeaf;
        // Template: Command
        command: LiteralLocalizationLeaf;
        // Template: Destination
        destination: LiteralLocalizationLeaf;
        // Template: ETA
        eta: LiteralLocalizationLeaf;
        // Template: Fuel
        fuel: LiteralLocalizationLeaf;
        // Template: Location
        location: LiteralLocalizationLeaf;
        // Template: Transponder
        registration: LiteralLocalizationLeaf;
        // Template: Name
        ship: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
      };
      // Template: Fleet: {name}
      title: {
        // Template: Fleet
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    FlightControlContainer: {
      action: {
        // Template: abort flight
        abort: {
          // Template: Are you sure to abort this flight? The current flight segment will be finished in any case.
          description: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: start
        start: {
          // Template: The flight from {origin} to {destination} will take {duration}.
          content: {
            getFormat: () => IntlMessageFormat;
            message: (options: { origin: string; destination: string; duration: string }) => string;
          };
          // Template: Are you sure you want to start this flight? Flights can be aborted, but the current flight segment will always be finished.
          description: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
    };
    FlightControlPanel: {
      error: {
        // Template: No ship found.
        shipId: LiteralLocalizationLeaf;
      };
      title: {
        // Template: Ship Flight Control
        loading: LiteralLocalizationLeaf;
      };
    };
    FlightControlView: {
      // Template: {mass}t / {operatingEmptyMass}t
      mass: {
        getFormat: () => IntlMessageFormat;
        message: (options: { mass: string; operatingEmptyMass: string }) => string;
      };
    };
    FlightPlan: {
      // Template: Consumption
      consumption: LiteralLocalizationLeaf;
      // Template: Damage
      damage: LiteralLocalizationLeaf;
      // Template: Destination
      destination: LiteralLocalizationLeaf;
      // Template: Distance
      distance: LiteralLocalizationLeaf;
      // Template: Duration
      duration: LiteralLocalizationLeaf;
      // Template: #
      index: LiteralLocalizationLeaf;
      // Template: Type
      type: LiteralLocalizationLeaf;
    };
    ForEx: {
      context: {
        // Template: Chart
        chart: LiteralLocalizationLeaf;
        // Template: Liquid Assets
        liquidAssets: LiteralLocalizationLeaf;
        // Template: Rate Matrix
        matrix: LiteralLocalizationLeaf;
        // Template: Order Book
        orderBook: LiteralLocalizationLeaf;
        // Template: Own Orders
        orders: LiteralLocalizationLeaf;
        // Template: Place Order
        placeOrder: LiteralLocalizationLeaf;
        // Template: Exchange Rate
        price: LiteralLocalizationLeaf;
      };
    };
    ForExInlineTickerQuote: {
      // Template: {ticker} ({highlight}{arrow})
      line: {
        getFormat: () => IntlMessageFormat;
        message: (options: { ticker: string; highlight: string; arrow: string }) => string;
      };
    };
    ForExOrderBook: {
      error: {
        // Template: No broker found for ticker {ticker}.
        ticker: {
          getFormat: () => IntlMessageFormat;
          message: (options: { ticker: string }) => string;
        };
      };
      // Template: Offers
      offers: {
        // Template: No offers.
        none: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Requests
      requests: {
        // Template: No requests.
        none: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Spread: {spread}
      spread: {
        getFormat: () => IntlMessageFormat;
        message: (options: { spread: string }) => string;
      };
      table: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Price
        price: LiteralLocalizationLeaf;
        // Template: Trader
        trader: LiteralLocalizationLeaf;
      };
      // Template: Order book ({ticker})
      title: {
        getFormat: () => IntlMessageFormat;
        message: (options: { ticker: string }) => string;
      };
    };
    ForExOrderPanel: {
      data: {
        // Template: Remaining Amount
        amount: {
          // Template: Initial Amount
          initial: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Limit
        limit: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
        // Template: Currency Pair
        ticker: LiteralLocalizationLeaf;
        // Template: Type
        type: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No order found for input {input}.
        id: {
          getFormat: () => IntlMessageFormat;
          message: (options: { input: string }) => string;
        };
      };
      // Template: FX Order
      title: LiteralLocalizationLeaf;
      // Template: Trades
      trades: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: No trades took place so far.
        empty: LiteralLocalizationLeaf;
        // Template: Partner
        partner: LiteralLocalizationLeaf;
        // Template: Price
        price: LiteralLocalizationLeaf;
        // Template: Time
        time: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
    };
    ForExOrdersPanel: {
      // Template: Order deleted.
      deleted: LiteralLocalizationLeaf;
      // Template: Foreign Exchange Orders
      title: LiteralLocalizationLeaf;
    };
    ForExOrdersTable: {
      action: {
        // Template: delete
        _delete: LiteralLocalizationLeaf;
        // Template: view
        view: LiteralLocalizationLeaf;
      };
      // Template: {amount} ({initial})
      amount: {
        getFormat: () => IntlMessageFormat;
        message: (options: { amount: string; initial: string }) => string;
      };
      table: {
        // Template: Amount (initial)
        amount: LiteralLocalizationLeaf;
        // Template: Limit
        limit: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
        // Template: Currency Pair
        ticker: LiteralLocalizationLeaf;
        // Template: Type
        type: LiteralLocalizationLeaf;
      };
    };
    ForExPlaceOrderForm: {
      _: {
        // Template: Fee total
        labelfeeTotal: LiteralLocalizationLeaf;
      };
      // Template: buy
      buy: LiteralLocalizationLeaf;
      label: {
        // Template: Quantity
        amount: LiteralLocalizationLeaf;
        currency: {
          // Template: Base Currency
          base: LiteralLocalizationLeaf;
          // Template: Quote Currency
          quote: LiteralLocalizationLeaf;
        };
        // Template: Fee
        fee: {
          // Template: For each FX trade a fee has to be paid by the buyer and seller. That fee is deducted once the order is matched from the amount of currency you receive from the trade.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Lots
        lots: {
          // Template: Currency can only be bought or sold in multiples of a lot. A lot is 1000 units.
          info: LiteralLocalizationLeaf;
          // Template: Lot Size
          size: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Place order
        placeOrder: LiteralLocalizationLeaf;
        // Template: Current Price
        price: LiteralLocalizationLeaf;
        // Template: Net amount after fees
        total: LiteralLocalizationLeaf;
        // Template: Volume
        volume: {
          // Template: The volume is the amount of currency removed from your account once the order is posted.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
      limit: {
        // Template: Maximum price
        maximum: LiteralLocalizationLeaf;
        // Template: Minimum price
        minimum: LiteralLocalizationLeaf;
      };
      // Template: {rate} {action}
      price: {
        // Template: set
        set: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { rate: string; action: string }) => string;
      };
      // Template: sell
      sell: LiteralLocalizationLeaf;
    };
    ForExPlaceOrderPanel: {
      error: {
        // Template: No broker found for ticker {ticker}.
        ticker: {
          getFormat: () => IntlMessageFormat;
          message: (options: { ticker: string }) => string;
        };
      };
      tab: {
        // Template: BUYING {currency}
        buy: {
          getFormat: () => IntlMessageFormat;
          message: (options: { currency: string }) => string;
        };
        // Template: SELLING {currency}
        sell: {
          getFormat: () => IntlMessageFormat;
          message: (options: { currency: string }) => string;
        };
      };
      // Template: Place FX Order ({ticker})
      title: {
        getFormat: () => IntlMessageFormat;
        message: (options: { ticker: string }) => string;
      };
    };
    ForExPrice: {
      // Template: {absolute} ({relative})
      change: {
        getFormat: () => IntlMessageFormat;
        message: (options: { absolute: string; relative: string }) => string;
      };
      // Template: 1 {code} = {rate}
      rate: {
        getFormat: () => IntlMessageFormat;
        message: (options: { code: string; rate: string }) => string;
      };
    };
    ForExPriceChart: {
      error: {
        // Template: No broker found for ticker {ticker}.
        ticker: {
          getFormat: () => IntlMessageFormat;
          message: (options: { ticker: string }) => string;
        };
      };
      // Template: Chart: {ticker}
      title: {
        getFormat: () => IntlMessageFormat;
        message: (options: { ticker: string }) => string;
      };
    };
    ForExPricePanel: {
      error: {
        // Template: No broker found for ticker {ticker}.
        ticker: {
          getFormat: () => IntlMessageFormat;
          message: (options: { ticker: string }) => string;
        };
      };
      // Template: Exchange Rate {ticker}
      title: {
        getFormat: () => IntlMessageFormat;
        message: (options: { ticker: string }) => string;
      };
    };
    ForExPricePanelContent: {
      // Template: Ask
      ask: LiteralLocalizationLeaf;
      // Template: Bid
      bid: LiteralLocalizationLeaf;
      // Template: {baseName} ({baseCode}) traded in {quoteName} ({quoteCode})
      exchange: {
        getFormat: () => IntlMessageFormat;
        message: (options: {
          baseName: string;
          baseCode: string;
          quoteName: string;
          quoteCode: string;
        }) => string;
      };
      // Template: High
      high: LiteralLocalizationLeaf;
      // Template: Low
      low: LiteralLocalizationLeaf;
      // Template: Traded
      traded: LiteralLocalizationLeaf;
    };
    ForeignExchange: {
      currencies: {
        // Template: Base
        base: LiteralLocalizationLeaf;
        // Template: Quote
        quote: LiteralLocalizationLeaf;
      };
      // Template: Foreign Exchange
      title: LiteralLocalizationLeaf;
    };
    FormCorporationForm: {
      // Template: Starting Capital
      capital: LiteralLocalizationLeaf;
      // Template: Code
      code: LiteralLocalizationLeaf;
      // Template: Name
      name: LiteralLocalizationLeaf;
      // Template: Form Corporation
      submit: LiteralLocalizationLeaf;
    };
    Forms: {
      validation: {
        error: {
          float: {
            // Template: This is not a valid number.
            invalid: LiteralLocalizationLeaf;
          };
          integer: {
            // Template: This is not a valid integer.
            invalid: LiteralLocalizationLeaf;
          };
          // Template: This field is required.
          isRequired: LiteralLocalizationLeaf;
          // Template: Must be less than or equal {max}.
          max: {
            getFormat: () => IntlMessageFormat;
            message: (options: { max: string }) => string;
          };
          // Template: Must not be longer than {max} characters.
          maxLength: {
            getFormat: () => IntlMessageFormat;
            message: (options: { max: string }) => string;
          };
          // Template: Must be greater than or equal {min}.
          min: {
            getFormat: () => IntlMessageFormat;
            message: (options: { min: string }) => string;
          };
          // Template: Must be longer or equal than {min} characters.
          minLength: {
            getFormat: () => IntlMessageFormat;
            message: (options: { min: string }) => string;
          };
          // Template: Input invalid.
          pattern: LiteralLocalizationLeaf;
          string: {
            // Template: This is not a valid string.
            invalid: LiteralLocalizationLeaf;
          };
        };
      };
    };
    Frame: {
      // Template: Your session has expired.
      loginRequired: {
        // Template: Click here to log in again.
        dismiss: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: APEX alpha
      title: LiteralLocalizationLeaf;
      toggle: {
        // Template: BS
        bases: {
          // Template: Bases
          tooltip: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: BFRS
        buffers: LiteralLocalizationLeaf;
        // Template: CMDS
        commands: {
          // Template: Commands
          tooltip: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: CXL
        commodityexchanges: LiteralLocalizationLeaf;
        communication: {
          // Template: Communication
          tooltip: LiteralLocalizationLeaf;
        };
        // Template: COM
        communications: LiteralLocalizationLeaf;
        // Template: CONT
        contracts: {
          // Template: Contracts
          tooltip: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: CORP
        corporation: {
          // Template: Corporation
          tooltip: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        cx: {
          // Template: Commodity Exchanges
          tooltip: LiteralLocalizationLeaf;
        };
        // Template: FIN
        financials: {
          // Template: Financial overview
          tooltip: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: FLT
        fleet: {
          // Template: Fleet
          tooltip: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        footer: {
          // Template: Toggle footer
          tooltip: LiteralLocalizationLeaf;
        };
        header: {
          // Template: Toggle header
          tooltip: LiteralLocalizationLeaf;
        };
        inventories: {
          // Template: Inventories
          tooltip: LiteralLocalizationLeaf;
        };
        // Template: INV
        inventory: LiteralLocalizationLeaf;
        // Template: LEAD
        leaderboards: {
          // Template: Leaderboards
          tooltip: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: MAP
        map: LiteralLocalizationLeaf;
        // Template: PROD
        production: {
          // Template: Production Lines
          tooltip: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: SCRNS
        screens: LiteralLocalizationLeaf;
        // Template: SDBR
        sidebar: {
          // Template: Toggle sidebar
          tooltip: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        universemap: {
          // Template: Universe Map
          tooltip: LiteralLocalizationLeaf;
        };
      };
      // Template: Authentication failed.
      unauthenticated: LiteralLocalizationLeaf;
    };
    FuelConsumption: {
      // Template: {amount} {amount, plural, one {unit} other {units}} {label} {percentage}
      label: {
        getFormat: () => IntlMessageFormat;
        message: (options: { amount: number; label: string; percentage: string }) => string;
      };
      // Template: ({percentage}%)
      percentage: {
        getFormat: () => IntlMessageFormat;
        message: (options: { percentage: string }) => string;
      };
    };
    FuelUnits: {
      // Template: FTL fuel
      ftl: LiteralLocalizationLeaf;
      // Template: STL fuel
      stl: LiteralLocalizationLeaf;
      // Template: Vortex fuel
      vortex: LiteralLocalizationLeaf;
    };
    FullscreenCard: {
      EditMenu: {
        action: {
          // Template: Delete Card
          _delete: LiteralLocalizationLeaf;
          // Template: move to stack
          move: LiteralLocalizationLeaf;
        };
        // Template: Move/delete Card
        title: LiteralLocalizationLeaf;
      };
      action: {
        // Template: back
        back: LiteralLocalizationLeaf;
        // Template: CTX
        context: LiteralLocalizationLeaf;
        // Template: Next
        next: LiteralLocalizationLeaf;
        // Template: prev
        prev: LiteralLocalizationLeaf;
        // Template: Stack
        stack: LiteralLocalizationLeaf;
      };
      context: {
        // Template: Context
        title: LiteralLocalizationLeaf;
      };
    };
    Gateway: {
      action: {
        traffic: {
          // Template: Details
          details: LiteralLocalizationLeaf;
        };
        upkeep: {
          // Template: Details
          details: LiteralLocalizationLeaf;
        };
      };
      // Template: {count} / 5
      capacityUpgrades: {
        getFormat: () => IntlMessageFormat;
        message: (options: { count: string }) => string;
      };
      // Template: {count} / 3
      distanceUpgrades: {
        getFormat: () => IntlMessageFormat;
        message: (options: { count: string }) => string;
      };
      header: {
        // Template: Capacity
        capacity: LiteralLocalizationLeaf;
        // Template: Information
        general: LiteralLocalizationLeaf;
        // Template: Links
        link: LiteralLocalizationLeaf;
        // Template: Traffic
        traffic: LiteralLocalizationLeaf;
        // Template: Upgrade
        upgrade: LiteralLocalizationLeaf;
        // Template: Upkeep
        upkeep: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Capacity upgrades
        capacityUpgrades: LiteralLocalizationLeaf;
        // Template: Details
        details: LiteralLocalizationLeaf;
        // Template: Distance upgrades
        distanceUpgrades: LiteralLocalizationLeaf;
        // Template: Established
        established: LiteralLocalizationLeaf;
        // Template: Id
        id: LiteralLocalizationLeaf;
        // Template: Jumps per 24h
        jumpsPerDay: LiteralLocalizationLeaf;
        // Template: Link established
        linkestablished: LiteralLocalizationLeaf;
        // Template: Maximum link radius
        linkradiusmaximum: LiteralLocalizationLeaf;
        // Template: Link requests
        linkrequests: LiteralLocalizationLeaf;
        // Template: Link status
        linkstatus: LiteralLocalizationLeaf;
        // Template: Location
        location: LiteralLocalizationLeaf;
        // Template: Maximum ship volume
        maxShipVolume: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Operator
        operator: LiteralLocalizationLeaf;
        // Template: Outgoing link
        outgoinglink: LiteralLocalizationLeaf;
        // Template: Jumps in the last 24h
        recentJumps: LiteralLocalizationLeaf;
        // Template: Volume upgrades
        volumeUpgrades: LiteralLocalizationLeaf;
      };
      // Template: {radius} parsecs
      linkradius: {
        getFormat: () => IntlMessageFormat;
        message: (options: { radius: string }) => string;
      };
      // Template: {maxShipVolume}m³
      maxShipVolume: {
        getFormat: () => IntlMessageFormat;
        message: (options: { maxShipVolume: string }) => string;
      };
      _message: {
        // Template: This gateway is currently under construction. Current progress is {progress}.
        inConstruction: {
          getFormat: () => IntlMessageFormat;
          message: (options: { progress: string }) => string;
        };
      };
      // Template: {current} / {capacity}
      recentJumps: {
        getFormat: () => IntlMessageFormat;
        message: (options: { current: string; capacity: string }) => string;
      };
      upgrade: {
        // Template: Contractor
        constractor: LiteralLocalizationLeaf;
        // Template: No upgrade in progress
        noupgrade: LiteralLocalizationLeaf;
        parameter: {
          // Template: Capacity: {current} ➔ {target}
          capacity: {
            getFormat: () => IntlMessageFormat;
            message: (options: { current: string; target: string }) => string;
          };
          // Template: Distance: {current} ➔ {target}
          distance: {
            getFormat: () => IntlMessageFormat;
            message: (options: { current: string; target: string }) => string;
          };
          // Template: Volume: {current} ➔ {target}
          volume: {
            getFormat: () => IntlMessageFormat;
            message: (options: { current: string; target: string }) => string;
          };
        };
        // Template: Progress
        progress: LiteralLocalizationLeaf;
        // Template: Started
        started: LiteralLocalizationLeaf;
        // Template: Construction store
        store: {
          // Template: store
          action: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Upgrades
        upgrades: LiteralLocalizationLeaf;
      };
      // Template: {count} / 3
      volumeUpgrades: {
        getFormat: () => IntlMessageFormat;
        message: (options: { count: string }) => string;
      };
    };
    GatewayFuelComponent: {
      label: {
        // Template: Address
        address: LiteralLocalizationLeaf;
        // Template: Contractor
        contractor: LiteralLocalizationLeaf;
        // Template: Currency
        currency: LiteralLocalizationLeaf;
        // Template: Current upkeep phase
        currentUpkeepPhase: LiteralLocalizationLeaf;
        // Template: Gateway
        infrastructure: LiteralLocalizationLeaf;
        // Template: Start at upkeep phase
        initialPeriod: LiteralLocalizationLeaf;
        // Template: Payment per phase
        payment: LiteralLocalizationLeaf;
        // Template: Service level objective
        serviceLevel: LiteralLocalizationLeaf;
        // Template: Upkeep phase end
        upkeepPhaseEnd: LiteralLocalizationLeaf;
        // Template: Upkeep phases
        upkeepPhases: LiteralLocalizationLeaf;
      };
    };
    GatewayInformation: {
      costs: {
        // Template: Base
        base: LiteralLocalizationLeaf;
        // Template: Capacity upgrades
        capacity: LiteralLocalizationLeaf;
        // Template: Distance upgrades
        distance: LiteralLocalizationLeaf;
        // Template: Total
        total: LiteralLocalizationLeaf;
        // Template: Volume upgrades
        volume: LiteralLocalizationLeaf;
      };
      header: {
        // Template: Building costs
        buildingCosts: LiteralLocalizationLeaf;
        // Template: Parameters
        parameters: LiteralLocalizationLeaf;
        // Template: Gateway Specifications
        specs: LiteralLocalizationLeaf;
        // Template: Upkeep
        upkeep: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Upkeep
        upkeep: LiteralLocalizationLeaf;
      };
      specs: {
        // Template: Capacity upgrades
        capacityUpgrades: LiteralLocalizationLeaf;
        // Template: Range upgrades
        distanceUpgrades: LiteralLocalizationLeaf;
        // Template: Fuel storage capacity
        maxFuelStorage: LiteralLocalizationLeaf;
        // Template: Linking range
        maxLinkingRadius: LiteralLocalizationLeaf;
        // Template: Max. ship volume
        maxShipVolume: LiteralLocalizationLeaf;
        // Template: Uses per day
        maxUses: LiteralLocalizationLeaf;
        // Template: Volume upgrades
        volumeUpgrades: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Distance
        distance: LiteralLocalizationLeaf;
        // Template: System
        system: LiteralLocalizationLeaf;
      };
    };
    GatewayInformationForm: {
      action: {
        // Template: calculate
        calculate: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Location
        address: LiteralLocalizationLeaf;
        // Template: Current capacity upgrades
        currentCapacityUpgrades: LiteralLocalizationLeaf;
        // Template: Current range upgrades
        currentDistanceUpgrades: LiteralLocalizationLeaf;
        // Template: Current volume upgrades
        currentVolumeUpgrades: LiteralLocalizationLeaf;
        // Template: Established
        established: LiteralLocalizationLeaf;
        // Template: Planned capacity upgrades
        plannedCapacityUpgrades: LiteralLocalizationLeaf;
        // Template: Planned range upgrades
        plannedDistanceUpgrades: LiteralLocalizationLeaf;
        // Template: Planned volume upgrades
        plannedVolumeUpgrades: LiteralLocalizationLeaf;
        // Template: Total upgrades
        totalUpgrades: LiteralLocalizationLeaf;
      };
    };
    GatewayInformationPanel: {
      // Template: Gateway Information
      title: LiteralLocalizationLeaf;
    };
    GatewayLinkComponent: {
      label: {
        // Template: Destination address
        destinationAddress: LiteralLocalizationLeaf;
        // Template: Destination gateway
        destinationGateway: LiteralLocalizationLeaf;
        // Template: Destination gateway range
        destinationRange: LiteralLocalizationLeaf;
        // Template: Distance
        distance: LiteralLocalizationLeaf;
        // Template: Origin address
        originAddress: LiteralLocalizationLeaf;
        // Template: Origin gateway
        originGateway: LiteralLocalizationLeaf;
        // Template: Origin gateway range
        originRange: LiteralLocalizationLeaf;
      };
    };
    GatewayLinkRange: {
      // Template: insufficient
      insufficient: LiteralLocalizationLeaf;
      // Template: {distance} ({sufficient})
      range: {
        getFormat: () => IntlMessageFormat;
        message: (options: { distance: string; sufficient: string }) => string;
      };
      // Template: sufficient
      sufficient: LiteralLocalizationLeaf;
    };
    GatewayPanel: {
      context: {
        // Template: Gateway Information
        gatewayInformation: LiteralLocalizationLeaf;
      };
      error: {
        // Template: Could not find a gateway for the given input
        noGateway: LiteralLocalizationLeaf;
      };
      title: {
        // Template: Gateway
        gateway: LiteralLocalizationLeaf;
        // Template: Gateways
        gateways: LiteralLocalizationLeaf;
      };
    };
    GatewayParametersInput: {
      // Template: {sum} / 5
      parameterSum: {
        getFormat: () => IntlMessageFormat;
        message: (options: { sum: string }) => string;
      };
      select: {
        capacity: {
          // Template: Capacity
          label: LiteralLocalizationLeaf;
        };
        distance: {
          // Template: Range
          label: LiteralLocalizationLeaf;
        };
        volume: {
          // Template: Volume
          label: LiteralLocalizationLeaf;
        };
      };
      totalUpgrades: {
        // Template: Total upgrades
        label: LiteralLocalizationLeaf;
      };
    };
    GatewayPricingComponent: {
      label: {
        // Template: Address
        address: LiteralLocalizationLeaf;
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Currency
        currency: LiteralLocalizationLeaf;
        // Template: Gateway
        infrastructure: LiteralLocalizationLeaf;
        // Template: Usage fee
        usageFee: LiteralLocalizationLeaf;
      };
    };
    GatewayTraffic: {
      // Template: {current} / {total}
      fuelAvailable: {
        getFormat: () => IntlMessageFormat;
        message: (options: { current: string; total: string }) => string;
      };
      header: {
        // Template: Capacity
        capacity: LiteralLocalizationLeaf;
        // Template: Contractors
        contractors: LiteralLocalizationLeaf;
        // Template: Fuel
        fuel: LiteralLocalizationLeaf;
        // Template: Information
        general: LiteralLocalizationLeaf;
        // Template: Traffic
        traffic: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Average fuel availability
        fuelAvailability: {
          // Template: Shows the average availability of fuel for at least one jump over the course of the last ten upkeep phases.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Available fuel units
        fuelAvailable: LiteralLocalizationLeaf;
        // Template: Fuel per jump
        fuelPerJump: LiteralLocalizationLeaf;
      };
      usageFee: {
        // Template: Usage fee
        location: LiteralLocalizationLeaf;
      };
    };
    GatewayTrafficPanel: {
      context: {
        // Template: Gateway
        gateway: LiteralLocalizationLeaf;
      };
      title: {
        // Template: Gateway Traffic
        gateways: LiteralLocalizationLeaf;
      };
    };
    GatewayUnlinkComponent: {
      label: {
        // Template: Address
        address: LiteralLocalizationLeaf;
        // Template: Destination
        destination: LiteralLocalizationLeaf;
        // Template: Gateway
        gateway: LiteralLocalizationLeaf;
      };
    };
    Gateways: {
      table: {
        action: {
          // Template: view
          view: LiteralLocalizationLeaf;
        };
        // Template: Location
        address: LiteralLocalizationLeaf;
        // Template: Established
        established: LiteralLocalizationLeaf;
        // Template: Linked to
        link: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Operator
        operator: LiteralLocalizationLeaf;
      };
    };
    Government: {
      error: {
        // Template: No government has been established yet.
        noAdminCenter: LiteralLocalizationLeaf;
      };
      header: {
        // Template: Government
        government: LiteralLocalizationLeaf;
        // Template: Motions
        motions: LiteralLocalizationLeaf;
        // Template: Votes
        votes: LiteralLocalizationLeaf;
      };
      table: {
        motions: {
          // Template: Description
          description: LiteralLocalizationLeaf;
          // Template: Motion
          motionId: LiteralLocalizationLeaf;
          // Template: Status
          status: LiteralLocalizationLeaf;
        };
        votes: {
          // Template: Corporation
          corporation: LiteralLocalizationLeaf;
          // Template: Faction
          country: LiteralLocalizationLeaf;
          // Template: User
          user: LiteralLocalizationLeaf;
          // Template: Votes
          votes: LiteralLocalizationLeaf;
        };
      };
      term: {
        // Template: End
        end: LiteralLocalizationLeaf;
        // Template: Governor
        governor: LiteralLocalizationLeaf;
        // Template: Members of Parliament
        membersOfParliament: LiteralLocalizationLeaf;
        // Template: Parliament size
        parliament: LiteralLocalizationLeaf;
        // Template: Start
        start: LiteralLocalizationLeaf;
      };
      votes: {
        // Template: Total
        total: LiteralLocalizationLeaf;
        // Template: {votes} / {percentage}
        votes: {
          getFormat: () => IntlMessageFormat;
          message: (options: { votes: string; percentage: string }) => string;
        };
      };
    };
    GovernmentContainer: {
      error: {
        // Template: This Administration Center has not formed a government yet
        noTerm: LiteralLocalizationLeaf;
      };
      terms: {
        // Template: Current term
        current: LiteralLocalizationLeaf;
        // Template: Term #{naturalId} (current)
        termCurrent: {
          getFormat: () => IntlMessageFormat;
          message: (options: { naturalId: string }) => string;
        };
        // Template: Term #{naturalId}
        termPrevious: {
          getFormat: () => IntlMessageFormat;
          message: (options: { naturalId: string }) => string;
        };
      };
    };
    GovernmentPanel: {
      error: {
        // Template: No government found for input {input}.
        id: {
          getFormat: () => IntlMessageFormat;
          message: (options: { input: string }) => string;
        };
      };
      // Template: Government
      title: {
        // Template: Government: {planet}
        withPlanet: {
          getFormat: () => IntlMessageFormat;
          message: (options: { planet: string }) => string;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
    };
    GroupChannelMembershipPanel: {
      // Template: Group {name}
      title: LiteralLocalizationLeaf;
    };
    Head: {
      item: {
        // Template: Audio
        audio: LiteralLocalizationLeaf;
        // Template: {username} ☰
        menu: {
          getFormat: () => IntlMessageFormat;
          message: (options: { username: string }) => string;
        };
      };
    };
    HeaderDropdown: {
      action: {
        // Template: {icon} Audio
        audio: {
          getFormat: () => IntlMessageFormat;
          message: (options: { icon: string }) => string;
        };
        // Template: {icon} Help
        help: {
          getFormat: () => IntlMessageFormat;
          message: (options: { icon: string }) => string;
        };
        // Template: {icon} Login
        login: {
          // Template: login
          alt: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: { icon: string }) => string;
        };
        // Template: {icon} Logout
        logout: {
          // Template: logout
          alt: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: { icon: string }) => string;
        };
      };
    };
    Help: {
      // Template: disabled
      disabled: LiteralLocalizationLeaf;
      // Template: enabled
      enabled: LiteralLocalizationLeaf;
      settings: {
        // Template: Show command context help
        contexthelp: LiteralLocalizationLeaf;
        // Template: Show help task progress
        help: LiteralLocalizationLeaf;
      };
      text: {
        // Template: Happy trading!
        trading: LiteralLocalizationLeaf;
        // Template: Welcome, licensee!
        welcome: LiteralLocalizationLeaf;
        // Template: If you are new to APEX please check out the introductory tasks below. They will guide you through the basics of APEX and help you get started!
        welcome2: LiteralLocalizationLeaf;
      };
    };
    HelpHeadItem: {
      // Template: HELP: {progress}
      help: {
        getFormat: () => IntlMessageFormat;
        message: (options: { progress: string }) => string;
      };
      // Template: {fulfilled} / {total}
      helpProgress: {
        getFormat: () => IntlMessageFormat;
        message: (options: { fulfilled: string; total: string }) => string;
      };
      // Template: HELP: --
      loading: LiteralLocalizationLeaf;
    };
    HelpPanel: {
      // Template: Help
      title: LiteralLocalizationLeaf;
    };
    Hints: {
      comex: {
        // Template: The selected planetary system is far from the next commodity exchange. Starting close to a commodity exchange is generally considered easier.
        comexfaraway: LiteralLocalizationLeaf;
      };
      currency: {
        // Template: The closest commodity exchange uses a different currency than your faction. Trading is possible but a bit more complicated than with just a single currency.
        nomatch: LiteralLocalizationLeaf;
      };
      fertility: {
        // Template: As a carbon farmer you depend on planets with fertile soil to grow plants. The selected planet is infertile.
        carbonfarmer: LiteralLocalizationLeaf;
        // Template: As a victualler you depend on planets with fertile soil to grow plants. The selected planet is infertile.
        victualler: LiteralLocalizationLeaf;
      };
      plots: {
        // Template: The chosen planet has almost no free plots left to build a new base. It might run out of plots before your ships arrive. Consider starting somewhere else.
        low: LiteralLocalizationLeaf;
        // Template: The chosen planet has no plots left to build a new base. Please select another planet!
        none: LiteralLocalizationLeaf;
      };
    };
    Impersonation: {
      action: {
        // Template: Stop
        stop: LiteralLocalizationLeaf;
      };
      // Template: You are currently impersonating another user!
      text: LiteralLocalizationLeaf;
    };
    InGameNotificationConfigPanel: {
      table: {
        // Template: Notifications
        enabled: LiteralLocalizationLeaf;
        // Template: Alert
        type: LiteralLocalizationLeaf;
      };
      // Template: In-game Notification Settings
      title: LiteralLocalizationLeaf;
    };
    // Template: Failed to generate income statement.
    IncomeStatementPanel: {
      // Template: Change
      change: LiteralLocalizationLeaf;
      // Template: Expenses
      expenses: LiteralLocalizationLeaf;
      period: {
        // Template: Current Period
        current: LiteralLocalizationLeaf;
        // Template: Last Period
        last: LiteralLocalizationLeaf;
        // Template: Previous Period
        previous: LiteralLocalizationLeaf;
      };
      // Template: Result
      result: LiteralLocalizationLeaf;
      // Template: Revenues
      revenues: LiteralLocalizationLeaf;
      // Template: Income Statement
      title: LiteralLocalizationLeaf;
      // Template: Total
      total: LiteralLocalizationLeaf;
      getFormat: () => IntlMessageFormat;
      message: (options: void) => string;
    };
    IncrementalNumberInput: {
      action: {
        // Template: -
        dec: LiteralLocalizationLeaf;
        // Template: +
        inc: LiteralLocalizationLeaf;
      };
    };
    InfrastructureContractors: {
      table: {
        // Template: Contractors
        contractors: {
          // Template: {contractor} [{contract}]
          value: {
            getFormat: () => IntlMessageFormat;
            message: (options: { contractor: string; contract: string }) => string;
          };
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Phase
        phase: LiteralLocalizationLeaf;
      };
    };
    InfrastructureLink: {
      // Template: {gatewayAmount, plural, one {Gateway} other {{gatewayAmount} Gateways}}
      gateways: {
        getFormat: () => IntlMessageFormat;
        message: (options: { gatewayAmount: string }) => string;
      };
    };
    InfrastructureNameComponent: {
      label: {
        // Template: Infrastructure
        infrastructure: LiteralLocalizationLeaf;
        // Template: Location
        location: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
      };
    };
    InfrastructureOperationalState: {
      // Template: operational
      OPERATIONAL: LiteralLocalizationLeaf;
      // Template: under construction
      UNDER_CONSTRUCTION: LiteralLocalizationLeaf;
      // Template: upkeep missing
      UPKEEP_MISSING: LiteralLocalizationLeaf;
    };
    InfrastructurePanel: {
      context: {
        // Template: Fleet
        fleet: LiteralLocalizationLeaf;
        // Template: Inventory
        inventory: LiteralLocalizationLeaf;
        // Template: System Info
        systemInfo: LiteralLocalizationLeaf;
        // Template: System Map
        systemMap: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No system found.
        systemId: LiteralLocalizationLeaf;
      };
      // Template: Infrastructure: {name}
      title: {
        // Template: Infrastructure: loading…
        loading: LiteralLocalizationLeaf;
        // Template: Infrastructure: not found…
        notfound: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    InfrastructureType: {
      // Template: Gateway
      GATEWAY: LiteralLocalizationLeaf;
    };
    InfrastructureUpkeep: {
      header: {
        // Template: Contractors
        contractors: LiteralLocalizationLeaf;
        // Template: Infrastructure
        infrastructure: LiteralLocalizationLeaf;
        // Template: Upkeep
        upkeep: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Current upkeep phase
        currentUpkeepPhase: LiteralLocalizationLeaf;
        // Template: Infrastructure
        infrastructure: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Next upkeep
        next: LiteralLocalizationLeaf;
        // Template: Operational State
        status: LiteralLocalizationLeaf;
        // Template: Type
        type: LiteralLocalizationLeaf;
        // Template: Weekly upkeep
        upkeep: LiteralLocalizationLeaf;
        // Template: Uptime history
        uptime: LiteralLocalizationLeaf;
        // Template: Uptime average
        uptimeAverage: {
          // Template: Shows the average uptime of the infrastructure over the course of the last ten upkeep phases.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
    };
    InfrastructureUpkeepPanel: {
      error: {
        // Template: Could not find any infrastructure for the given input
        notfound: LiteralLocalizationLeaf;
      };
      // Template: Infrastructure upkeep
      title: LiteralLocalizationLeaf;
    };
    InputsOutputsView: {
      // Template: Input Materials
      inputs: LiteralLocalizationLeaf;
      material: {
        // Template: {amount, plural, one {1 unit} other {{amount} units}}
        amount: {
          getFormat: () => IntlMessageFormat;
          message: (options: { amount: string }) => string;
        };
        // Template: {amount} {amount, plural, one {unit} other {units}} in store
        available: {
          getFormat: () => IntlMessageFormat;
          message: (options: { amount: number }) => string;
        };
        // Template: {amount} {amount, plural, one {unit} other {units}} missing
        missing: {
          getFormat: () => IntlMessageFormat;
          message: (options: { amount: number }) => string;
        };
      };
      // Template: Output Materials
      outputs: LiteralLocalizationLeaf;
    };
    InvalidCardPanel: {
      // Template: The card you selected cannot be found.
      info: LiteralLocalizationLeaf;
      // Template: Invalid Card
      title: LiteralLocalizationLeaf;
    };
    InvalidCommandPanel: {
      // Template: The command you entered for this card is invalid. To remove the card, click the '+' button above and select the 'delete card' option.
      info: LiteralLocalizationLeaf;
      // Template: Invalid Command
      title: LiteralLocalizationLeaf;
    };
    InvalidStack: {
      action: {
        // Template: Back
        back: LiteralLocalizationLeaf;
        // Template: Stacks
        stacks: LiteralLocalizationLeaf;
      };
      // Template: The stack you selected cannot be found.
      info: LiteralLocalizationLeaf;
    };
    InventoriesPanel: {
      context: {
        // Template: Infrastructure
        infrastructure: LiteralLocalizationLeaf;
        // Template: Unpack
        unpack: LiteralLocalizationLeaf;
      };
      // Template: No inventory found!
      noInventoryFound: LiteralLocalizationLeaf;
      table: {
        // Template: Location
        address: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Owner
        owner: LiteralLocalizationLeaf;
        // Template: Type
        type: LiteralLocalizationLeaf;
        // Template: open
        view: LiteralLocalizationLeaf;
        // Template: Volume
        volume: LiteralLocalizationLeaf;
        // Template: Weight
        weight: LiteralLocalizationLeaf;
      };
      // Template: Inventories
      title: {
        // Template: inventory {type}
        inventory: {
          getFormat: () => IntlMessageFormat;
          message: (options: { type: string }) => string;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
    };
    Inventory: {
      // Template: {load} / {capacity}
      capacity: {
        getFormat: () => IntlMessageFormat;
        message: (options: { load: string; capacity: string }) => string;
      };
      // Template: {load} / {capacity}m³
      capacityVolume: {
        getFormat: () => IntlMessageFormat;
        message: (options: { load: string; capacity: string }) => string;
      };
      // Template: {load} / {capacity}t
      capacityWeight: {
        getFormat: () => IntlMessageFormat;
        message: (options: { load: string; capacity: string }) => string;
      };
    };
    LanguageSelector: {
      header: {
        // Template: Community Translations
        community: {
          // Template: These translations are provided by the community. They might not cover the whole game. Default fallback language is English.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Official Languages
        official: LiteralLocalizationLeaf;
      };
    };
    LastActivity: {
      active: {
        // Template: active right now
        now: LiteralLocalizationLeaf;
        // Template: last activity on {date}
        past: {
          getFormat: () => IntlMessageFormat;
          message: (options: { date: string }) => string;
        };
        // Template: active {timeAgo}
        recently: {
          getFormat: () => IntlMessageFormat;
          message: (options: { timeAgo: string }) => string;
        };
      };
      muted: {
        // Template: recently muted
        now: LiteralLocalizationLeaf;
        // Template: muted on {date}
        past: {
          getFormat: () => IntlMessageFormat;
          message: (options: { date: string }) => string;
        };
        // Template: muted {timeAgo}
        recently: {
          getFormat: () => IntlMessageFormat;
          message: (options: { timeAgo: string }) => string;
        };
      };
    };
    Leaderboard: {
      status: {
        // Template: loading..
        loading: LiteralLocalizationLeaf;
      };
    };
    LeaderboardController: {
      action: {
        // Template: own rank
        own: LiteralLocalizationLeaf;
        // Template: top ranks
        top: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Material
        material: LiteralLocalizationLeaf;
        // Template: Range
        range: LiteralLocalizationLeaf;
        // Template: Type
        type: LiteralLocalizationLeaf;
      };
    };
    Leaderboards: {
      table: {
        // Template: Company
        company: LiteralLocalizationLeaf;
        // Template: Corporation
        coporation: LiteralLocalizationLeaf;
        // Template: No leaderboard data available
        noData: LiteralLocalizationLeaf;
        // Template: Rank
        rank: LiteralLocalizationLeaf;
        // Template: Score
        score: LiteralLocalizationLeaf;
        // Template: User
        user: LiteralLocalizationLeaf;
      };
      // Template: Leaderboards
      title: LiteralLocalizationLeaf;
    };
    LicenseGifting: {
      header: {
        // Template: Gift PRO license
        gift: LiteralLocalizationLeaf;
        // Template: Received Gifts
        received: LiteralLocalizationLeaf;
        // Template: Sent Gifts
        sent: LiteralLocalizationLeaf;
      };
      label: {
        // Template: received
        received: LiteralLocalizationLeaf;
        // Template: sent
        sent: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Gift
        gift: LiteralLocalizationLeaf;
        // Template: Time
        time: LiteralLocalizationLeaf;
        // Template: Type
        type: LiteralLocalizationLeaf;
        // Template: User
        user: LiteralLocalizationLeaf;
      };
      value: {
        // Template: {days, plural, one {one day} other {{days} days}}
        gift: {
          getFormat: () => IntlMessageFormat;
          message: (options: { days: string }) => string;
        };
      };
    };
    LicenseGiftingForm: {
      action: {
        // Template: gift
        gift: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Days
        days: LiteralLocalizationLeaf;
        // Template: Info
        note: LiteralLocalizationLeaf;
        // Template: Recipient
        recipient: LiteralLocalizationLeaf;
      };
      // Template: Allows to gift another player a part of your PRO license time. The default fallback license for gifts is FREE.
      note: LiteralLocalizationLeaf;
    };
    LicenseGiftingPanel: {
      action: {
        // Template: Do you want to gift {user} {days} days of your PRO license time?
        confirmation: {
          getFormat: () => IntlMessageFormat;
          message: (options: { user: string; days: string }) => string;
        };
        // Template: Gift
        gift: LiteralLocalizationLeaf;
      };
      context: {
        // Template: License
        license: LiteralLocalizationLeaf;
      };
      // Template: License Gifting
      title: LiteralLocalizationLeaf;
    };
    LicenseHeadItem: {
      // Template: (expires in {countdown})
      expiry2d: {
        getFormat: () => IntlMessageFormat;
        message: (options: { countdown: string }) => string;
      };
      // Template: (expires in {countdown})
      expiry7d: {
        getFormat: () => IntlMessageFormat;
        message: (options: { countdown: string }) => string;
      };
      // Template: LIC: {level}
      level: {
        // Template: License Management
        tooltip: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { level: string }) => string;
      };
    };
    LicenseMobileHeader: {
      // Template: License - {level}
      level: {
        getFormat: () => IntlMessageFormat;
        message: (options: { level: string }) => string;
      };
    };
    LinkStatus: {
      // Template: ESTABLISHED
      ESTABLISHED: LiteralLocalizationLeaf;
      // Template: INCOMPLETE
      INCOMPLETE: LiteralLocalizationLeaf;
      // Template: UNLINKED
      UNLINKED: LiteralLocalizationLeaf;
    };
    LiquidAssetsPanel: {
      table: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Currency
        currency: LiteralLocalizationLeaf;
      };
      // Template: Liquid assets
      title: LiteralLocalizationLeaf;
    };
    ListItemView: {
      // Template: {units, plural, one {{units} unit} other {{units} units}}
      units: {
        getFormat: () => IntlMessageFormat;
        message: (options: { units: string }) => string;
      };
      // Template: {weight}t / {volume}m³
      weightVolume: {
        getFormat: () => IntlMessageFormat;
        message: (options: { weight: string; volume: string }) => string;
      };
    };
    Loading: {
      // Template: Loading…
      loading: LiteralLocalizationLeaf;
    };
    LoadingState: {
      // Template: Please stand by, initializing the APEX console
      standby: LiteralLocalizationLeaf;
      // Template: Welcome to APEX
      welcome: LiteralLocalizationLeaf;
    };
    LocalMarket: {
      adType: {
        // Template: BUYING
        buying: LiteralLocalizationLeaf;
        // Template: SELLING
        selling: LiteralLocalizationLeaf;
        // Template: SHIPPING
        shipping: LiteralLocalizationLeaf;
      };
      button: {
        // Template: Post ad
        post: LiteralLocalizationLeaf;
      };
      context: {
        // Template: Own ads
        ads: LiteralLocalizationLeaf;
        // Template: Blocklist
        blacklist: LiteralLocalizationLeaf;
        // Template: Local market
        market: LiteralLocalizationLeaf;
        // Template: Planet information
        planet: LiteralLocalizationLeaf;
        // Template: Post ad
        post: LiteralLocalizationLeaf;
      };
      error: {
        // Template: Unknown ad type
        adtype: LiteralLocalizationLeaf;
        // Template: Error loading local market.
        id: LiteralLocalizationLeaf;
        // Template: This planet has no local market.
        nomarket: LiteralLocalizationLeaf;
      };
      header: {
        // Template: Ads
        ads: LiteralLocalizationLeaf;
      };
      label: {
        market: {
          // Template: Location
          address: LiteralLocalizationLeaf;
          // Template: Fee currency
          currency: LiteralLocalizationLeaf;
          // Template: Fees
          fees: {
            // Template: Fees consist of a fixed base and a variable time value. The variable value depends on the visibility time of the ad.
            info: LiteralLocalizationLeaf;
            getFormat: () => IntlMessageFormat;
            message: (options: void) => string;
          };
          // Template: Operator
          operator: LiteralLocalizationLeaf;
        };
      };
      market: {
        // Template: {base} / {timeFactor}
        fees: {
          getFormat: () => IntlMessageFormat;
          message: (options: { base: string; timeFactor: string }) => string;
        };
      };
      // Template: {name} Local Market
      name: {
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
      // Template: Local market: {name}
      title: {
        // Template: Local Market
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    LocalMarketAd: {
      banner: {
        // Template: You accepted this ad.
        contract: LiteralLocalizationLeaf;
      };
      button: {
        // Template: show contract
        contract: LiteralLocalizationLeaf;
      };
      error: {
        // Template: Could not load accepted ads.
        ads: LiteralLocalizationLeaf;
        // Template: No ad found.
        id: LiteralLocalizationLeaf;
        // Template: This planet has no local market.
        nomarket: LiteralLocalizationLeaf;
      };
      form: {
        // Template: accept
        accept: LiteralLocalizationLeaf;
        // Template: Ad
        ad: LiteralLocalizationLeaf;
        // Template: {address} local market
        address: {
          getFormat: () => IntlMessageFormat;
          message: (options: { address: string }) => string;
        };
        // Template: Creator
        creator: LiteralLocalizationLeaf;
        // Template: expired
        expired: LiteralLocalizationLeaf;
        // Template: Expiry
        expiry: LiteralLocalizationLeaf;
        // Template: Location
        location: LiteralLocalizationLeaf;
        // Template: Required rating
        requiredRating: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
        // Template: Commodity
        ticker: LiteralLocalizationLeaf;
        // Template: Type
        type: LiteralLocalizationLeaf;
      };
      // Template: Local market: {name}
      title: {
        // Template: Local market ad
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    LocalMarketAds: {
      command: {
        // Template: delete
        _delete: LiteralLocalizationLeaf;
      };
      // Template: delete fulfilled
      deleteFulfilled: LiteralLocalizationLeaf;
      error: {
        // Template: invalid ad type
        invalidAdType: LiteralLocalizationLeaf;
      };
      header: {
        // Template: Accepted ads
        accepted: LiteralLocalizationLeaf;
        // Template: Own ads
        own: LiteralLocalizationLeaf;
      };
      table: {
        header: {
          // Template: Ad
          ad: LiteralLocalizationLeaf;
          // Template: Cmds
          commands: LiteralLocalizationLeaf;
          // Template: Contract
          contract: LiteralLocalizationLeaf;
          // Template: Market
          market: LiteralLocalizationLeaf;
          // Template: Partner
          partner: LiteralLocalizationLeaf;
          // Template: Status
          status: LiteralLocalizationLeaf;
        };
      };
      title: {
        // Template: Local market ads
        loading: LiteralLocalizationLeaf;
      };
    };
    LocalMarketAdsPanel: {
      action: {
        // Template: delete
        _delete: {
          // Template: Are you sure to delete this ad?
          description: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
    };
    LocalMarketPost: {
      error: {
        // Template: You need a base or warehouse unit on the planet to be able to post ads in this local market.
        nobase: LiteralLocalizationLeaf;
        // Template: This planet has no local market.
        nomarket: LiteralLocalizationLeaf;
      };
      form: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Auto-provision
        autoProvision: LiteralLocalizationLeaf;
        // Template: Collection time (days)
        collectiontime: LiteralLocalizationLeaf;
        // Template: Commodity
        commodity: LiteralLocalizationLeaf;
        // Template: Currency
        currency: LiteralLocalizationLeaf;
        // Template: Delivery time (days)
        deliverytime: LiteralLocalizationLeaf;
        // Template: Destination
        destination: LiteralLocalizationLeaf;
        // Template: Fees
        fees: LiteralLocalizationLeaf;
        // Template: Minimum rating
        minimumrating: LiteralLocalizationLeaf;
        // Template: Origin
        origin: LiteralLocalizationLeaf;
        // Template: Post buying ad
        postBuyingAd: LiteralLocalizationLeaf;
        // Template: Post selling ad
        postSellingAd: LiteralLocalizationLeaf;
        // Template: Post shipping ad
        postShippingAd: LiteralLocalizationLeaf;
        // Template: Total price
        price: LiteralLocalizationLeaf;
        // Template: Price per unit
        pricePerUnit: LiteralLocalizationLeaf;
        // Template: Type
        type: LiteralLocalizationLeaf;
        // Template: Ad duration (days)
        visibility: LiteralLocalizationLeaf;
      };
      info: {
        // Template: If an auto-provisioning inventory is selected the materials will be provisioned as soon as a contract is formed and thus they will be available for pick-up by the hauler immediately. Setting an auto-provisioning inventory is optional.
        provisioningStore: LiteralLocalizationLeaf;
      };
      // Template: Local market: {name}
      title: {
        // Template: Post ad
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    LocalMarketPostContainer: {
      error: {
        // Template: No local market found.
        localMarketId: LiteralLocalizationLeaf;
      };
    };
    LocalMarkets: {
      header: {
        // Template: Planets
        planets: LiteralLocalizationLeaf;
        // Template: Stations
        stations: LiteralLocalizationLeaf;
      };
      planet: {
        // Template: Infrastructure
        infrastructure: LiteralLocalizationLeaf;
        // Template: Location
        location: LiteralLocalizationLeaf;
      };
      station: {
        // Template: Infrastructure
        infrastructure: LiteralLocalizationLeaf;
        // Template: Location
        location: LiteralLocalizationLeaf;
      };
    };
    LocalRules: {
      establishment: {
        // Template: Fee
        fee: LiteralLocalizationLeaf;
      };
      governance: {
        // Template: Faction affinity
        affinity: LiteralLocalizationLeaf;
        // Template: Collector
        collector: LiteralLocalizationLeaf;
        // Template: Currency
        currency: LiteralLocalizationLeaf;
        // Template: Location
        location: LiteralLocalizationLeaf;
      };
      infrastructure: {
        // Template: Target
        active: LiteralLocalizationLeaf;
        // Template: Built
        built: LiteralLocalizationLeaf;
        // Template: Contribution (last period)
        contribution: LiteralLocalizationLeaf;
        // Template: Current
        current: LiteralLocalizationLeaf;
        // Template: Infrastructure
        name: LiteralLocalizationLeaf;
      };
      localmarket: {
        // Template: Base fee
        base: LiteralLocalizationLeaf;
        // Template: Time factor
        timeFactor: {
          // Template: The time factor determines how much higher the fees are for posting a longer-term local market ad.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
      population: {
        // Template: Workforce reserve pool
        reserve: {
          // Template: The workforce reserve is, per workforce tier, held back during the weekly distribution of workforces among requesting bases on a planet. It will instead be available to newly founded bases or production lines in-between two workforce distributions.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: 10%
        reserveDefault: LiteralLocalizationLeaf;
      };
      production: {
        // Template: ENG
        engineer: LiteralLocalizationLeaf;
        // Template: Industry
        industry: LiteralLocalizationLeaf;
        // Template: PIO
        pioneer: LiteralLocalizationLeaf;
        // Template: SCI
        scientist: LiteralLocalizationLeaf;
        // Template: SET
        settler: LiteralLocalizationLeaf;
        // Template: TEC
        technician: LiteralLocalizationLeaf;
      };
      section: {
        // Template: Base establishment fees
        establishmentfees: LiteralLocalizationLeaf;
        // Template: Infrastructure projects
        infrastructure: LiteralLocalizationLeaf;
        // Template: Local market fees
        localmarketfees: LiteralLocalizationLeaf;
        // Template: Need fulfillment (last period)
        needFulfillment: LiteralLocalizationLeaf;
        // Template: Workforce
        population: LiteralLocalizationLeaf;
        // Template: Production fees
        productionfees: {
          // Template: Production fees determine the amount of currency to be paid per 24 hours of full-time employment per worker of a certain tier. Fees are paid when a production order is started.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Warehouse fees
        warehousefees: LiteralLocalizationLeaf;
      };
      tab: {
        // Template: Fees
        fees: LiteralLocalizationLeaf;
        // Template: Population
        population: LiteralLocalizationLeaf;
        // Template: Programs
        programs: LiteralLocalizationLeaf;
      };
      warehouse: {
        // Template: Fee
        fee: LiteralLocalizationLeaf;
      };
    };
    LocalRulesFeeForm: {
      action: {
        // Template: set
        setProductionFee: LiteralLocalizationLeaf;
      };
    };
    LocalRulesPanel: {
      context: {
        // Template: Planet
        planet: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No local rules found for input {input}.
        id: {
          getFormat: () => IntlMessageFormat;
          message: (options: { input: string }) => string;
        };
      };
      // Template: Local Rules: {name}
      title: {
        // Template: Local Rules
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    LocalRulesPopulation: {
      label: {
        active: {
          // Template: The target level indicates at which level the planet's infrastructure should run on. Changes will take effect starting with the next population report.
          info: LiteralLocalizationLeaf;
        };
      };
    };
    LocalRulesPrograms: {
      error: {
        // Template: There needs to be an admin center in order to run government programs.
        noAdminCenter: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Category
        category: LiteralLocalizationLeaf;
        // Template: Costs
        costs: LiteralLocalizationLeaf;
        // Template: Description
        description: LiteralLocalizationLeaf;
        // Template: Ended
        ended: LiteralLocalizationLeaf;
        // Template: Ends in
        endsIn: LiteralLocalizationLeaf;
        // Template: #
        number: LiteralLocalizationLeaf;
        // Template: Program
        program: LiteralLocalizationLeaf;
        // Template: Starts in
        start: LiteralLocalizationLeaf;
      };
      section: {
        // Template: Active Program
        active: LiteralLocalizationLeaf;
        // Template: Past Programs
        past: LiteralLocalizationLeaf;
        // Template: Upcoming Program
        upcoming: LiteralLocalizationLeaf;
      };
    };
    Logo: {
      // Template: {logo} APEX
      title: {
        // Template: APEX
        alt: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { logo: string }) => string;
      };
    };
    Maintenance: {
      // Template: The APEX console is currently down for maintenance.
      text1: LiteralLocalizationLeaf;
      // Template: Thank you very much for your patience.
      text2: LiteralLocalizationLeaf;
      // Template: Maintenance
      title: LiteralLocalizationLeaf;
    };
    Material: {
      advancedBulkhead: {
        // Template: Compared to its little brother, the advanced bulkhead is slightly thicker and heavier, offering greater durability.
        description: LiteralLocalizationLeaf;
        // Template: Advanced Bulkhead
        name: LiteralLocalizationLeaf;
      };
      advancedDeckElements: {
        // Template: Thick and durable, these 3D-printed floor tiles can be found in certain buildings and high-end spacecraft.
        description: LiteralLocalizationLeaf;
        // Template: Advanced Deck Elements
        name: LiteralLocalizationLeaf;
      };
      advancedEngine: {
        // Template: An advanced-level STL engine with lots of thrust power and thus a relatively high fuel consumption.
        description: LiteralLocalizationLeaf;
        // Template: Advanced STL Engine
        name: LiteralLocalizationLeaf;
      };
      advancedFuelPump: {
        // Template: An advanced fuel pump used in high-thrust spacecraft engines.
        description: LiteralLocalizationLeaf;
        // Template: Advanced Fuel Pump
        name: LiteralLocalizationLeaf;
      };
      advancedFuelRod: {
        // Template: An advanced form of fuel rod that can be applied in fission reactors.
        description: LiteralLocalizationLeaf;
        // Template: Advanced Fuel Rod
        name: LiteralLocalizationLeaf;
      };
      advancedHeatShield: {
        // Template: Surrounding a ship with these tiles will significantly reduce the damage it takes from extreme heat.
        description: LiteralLocalizationLeaf;
        // Template: Advanced Thermal Protection Tile
        name: LiteralLocalizationLeaf;
      };
      advancedHighgSeats: {
        // Template: A set of special seats significantly increasing the maximum g-force values a ship's crew can endure.
        description: LiteralLocalizationLeaf;
        // Template: Advanced High-G Seats
        name: LiteralLocalizationLeaf;
      };
      advancedHullPlate: {
        // Template: An advanced spaceship hull plate. It will significantly reduce a ship's overall deterioration and allow it to endure very high maximum g-force values.
        description: LiteralLocalizationLeaf;
        // Template: Advanced Hull Plate
        name: LiteralLocalizationLeaf;
      };
      advancedNozzle: {
        // Template: An advanced nozzle used in medium-thrust spacecraft engines.
        description: LiteralLocalizationLeaf;
        // Template: Advanced Nozzle
        name: LiteralLocalizationLeaf;
      };
      advancedRadiationShielding: {
        // Template: These plates protect a ship from taking damage from typical medium-star radiation levels.
        description: LiteralLocalizationLeaf;
        // Template: Advanced Anti-rad Plate
        name: LiteralLocalizationLeaf;
      };
      advancedStructuralElements: {
        // Template: Laced with titanium, these are an even sturdier, yet much lighter version of reinforced structural elements.
        description: LiteralLocalizationLeaf;
        // Template: Advanced Structural Elements
        name: LiteralLocalizationLeaf;
      };
      advancedThermalProtectionMaterial: {
        // Template: A borosilicate-impregnated ceramic fabric used for thermal protection against extreme heat.
        description: LiteralLocalizationLeaf;
        // Template: Advanced Thermal Protection Material
        name: LiteralLocalizationLeaf;
      };
      advancedWhippleShielding: {
        // Template: Shielding plates that significantly reduce damage from flying through systems with a high meteoroid density.
        description: LiteralLocalizationLeaf;
        // Template: Advanced Whipple Shielding
        name: LiteralLocalizationLeaf;
      };
      advancedWindow: {
        // Template: Fitted with reinforced frames and nano-coated glass, these windows have very specific uses in buildings and electronics.
        description: LiteralLocalizationLeaf;
        // Template: Advanced Transparent Aperture
        name: LiteralLocalizationLeaf;
      };
      aerostatFoundation: {
        // Template: This modular, hollow platform can be filled with a lifting gas to build the buoyant foundations for structures in the upper atmosphere of gas giants.
        description: LiteralLocalizationLeaf;
        // Template: Aerostat Foundation
        name: LiteralLocalizationLeaf;
      };
      airScrubber: {
        // Template: Air processing equipment that removes pollutants that are detrimental to life.
        description: LiteralLocalizationLeaf;
        // Template: Air Scrubber
        name: LiteralLocalizationLeaf;
      };
      allPurposeFodder: {
        // Template: Fodder for animals of all kinds.
        description: LiteralLocalizationLeaf;
        // Template: All-Purpose Fodder
        name: LiteralLocalizationLeaf;
      };
      aluminium: {
        // Template: Aluminium and its alloys have been a staple of the aerospace industry since its early days, and they are still being used in virtually every structural part of modern spaceships.
        description: LiteralLocalizationLeaf;
        // Template: Aluminium
        name: LiteralLocalizationLeaf;
      };
      aluminiumIronAlloy: {
        // Template: An iron-based alloy commonly used as a budget replacement for titanium, so no miracles are to be expected.
        description: LiteralLocalizationLeaf;
        // Template: Ferrominium
        name: LiteralLocalizationLeaf;
      };
      aluminiumOre: {
        // Template: An ore that can be smelted down to pure aluminium, which in turn plays a vital role in ship construction.
        description: LiteralLocalizationLeaf;
        // Template: Aluminium Ore
        name: LiteralLocalizationLeaf;
      };
      aluminiumTitaniumAlloy: {
        // Template: Lightweight, flexible and durable, this namesake of Earth's titanium has become the de facto standard in space ship construction.
        description: LiteralLocalizationLeaf;
        // Template: Alpha-Stabilized Titanium
        name: LiteralLocalizationLeaf;
      };
      alurhenium: {
        // Template: An alloy that combines the flexibility of aluminium and the resistance of rhenium.
        description: LiteralLocalizationLeaf;
        // Template: Alurhenium
        name: LiteralLocalizationLeaf;
      };
      ammonia: {
        // Template: A staple of modern fuel production, Ammonia could be synthesized from Nitrogen and Hydrogen. However, collecting it directly from the atmosphere has proven more cost-efficient.
        description: LiteralLocalizationLeaf;
        // Template: Ammonia
        name: LiteralLocalizationLeaf;
      };
      antennaArray: {
        // Template: Uses a curved surface to direct signals to a focal point for collection.
        description: LiteralLocalizationLeaf;
        // Template: Antenna Array
        name: LiteralLocalizationLeaf;
      };
      antibacterialTreeFlowers: {
        // Template: Flowers of the plant Humulus Iupulus used in the brewing of beer and herbal medicine.
        description: LiteralLocalizationLeaf;
        // Template: Flowery Hops
        name: LiteralLocalizationLeaf;
      };
      argon: {
        // Template: A noble gas often used as inert atmosphere in smelting, metalworking and other applications.
        description: LiteralLocalizationLeaf;
        // Template: Argon
        name: LiteralLocalizationLeaf;
      };
      artificialSoil: {
        // Template: Proper soil, created in the lab.
        description: LiteralLocalizationLeaf;
        // Template: Artificial Soil
        name: LiteralLocalizationLeaf;
      };
      audioDistributionSystem: {
        // Template: Distributes audio signals within a pre-defined space.
        description: LiteralLocalizationLeaf;
        // Template: Audio Distribution System
        name: LiteralLocalizationLeaf;
      };
      audioTransmitter: {
        // Template: Transmits audio signals between two end points.
        description: LiteralLocalizationLeaf;
        // Template: Audio Transmitter
        name: LiteralLocalizationLeaf;
      };
      autoDoc: {
        // Template: Scans the patient's body for injuries and treats them via chemical injections.
        description: LiteralLocalizationLeaf;
        // Template: Auto-Doc
        name: LiteralLocalizationLeaf;
      };
      automatedCoolingSystem: {
        // Template: A system monitoring and controlling heat in an FTL reactor.
        description: LiteralLocalizationLeaf;
        // Template: Automated Cooling System
        name: LiteralLocalizationLeaf;
      };
      bacteria: {
        // Template: These microscopic organisms play a role in a number of processes such as fermentation and purification.
        description: LiteralLocalizationLeaf;
        // Template: Helpful Bacteria
        name: LiteralLocalizationLeaf;
      };
      bandages: {
        // Template: Used to dress superficial injuries.
        description: LiteralLocalizationLeaf;
        // Template: Bandages
        name: LiteralLocalizationLeaf;
      };
      basicAiFramework: {
        // Template: A collection of basic AI algorithms as a starting point for any even remotely intelligent machine.
        description: LiteralLocalizationLeaf;
        // Template: Basic AI Framework
        name: LiteralLocalizationLeaf;
      };
      basicBulkhead: {
        // Template: Divide ships and buildings into several rooms, increase their structural rigidity and seal off fires or breached sections in case of an accident.
        description: LiteralLocalizationLeaf;
        // Template: Basic Bulkhead
        name: LiteralLocalizationLeaf;
      };
      basicDeckElements: {
        // Template: Durable plastic floor plating for both buildings and spaceships, easily printable in various shapes and sizes.
        description: LiteralLocalizationLeaf;
        // Template: Basic Deck Elements
        name: LiteralLocalizationLeaf;
      };
      basicFuelPump: {
        // Template: A standard fuel pump used in low-thrust spacecraft engines.
        description: LiteralLocalizationLeaf;
        // Template: Basic Fuel Pump
        name: LiteralLocalizationLeaf;
      };
      basicFuelRod: {
        // Template: A tube to hold the fuel required to perform FTL jumps.
        description: LiteralLocalizationLeaf;
        // Template: Basic Fuel Rod
        name: LiteralLocalizationLeaf;
      };
      basicHeatShield: {
        // Template: Surrounding a spaceship with these tiles will reduce the damage it takes from extreme heat.
        description: LiteralLocalizationLeaf;
        // Template: Basic Thermal Protection Tile
        name: LiteralLocalizationLeaf;
      };
      basicHighgSeats: {
        // Template: A set of special seats increasing the maximum g-force values a ship's crew can endure.
        description: LiteralLocalizationLeaf;
        // Template: Basic High-G Seats
        name: LiteralLocalizationLeaf;
      };
      basicHullPlate: {
        // Template: A basic spaceship hull plate.
        description: LiteralLocalizationLeaf;
        // Template: Basic Hull Plate
        name: LiteralLocalizationLeaf;
      };
      basicNozzle: {
        // Template: A basic nozzle used in low-thrust spacecraft engines.
        description: LiteralLocalizationLeaf;
        // Template: Basic Nozzle
        name: LiteralLocalizationLeaf;
      };
      basicRadiationShielding: {
        // Template: These plates protect a ship from taking damage from typical small-star radiation levels.
        description: LiteralLocalizationLeaf;
        // Template: Basic Anti-rad Plate
        name: LiteralLocalizationLeaf;
      };
      basicStructuralElements: {
        // Template: General term for mid-sized structural ship and building components that are neither walls nor floors.
        description: LiteralLocalizationLeaf;
        // Template: Basic Structural Elements
        name: LiteralLocalizationLeaf;
      };
      basicThermalProtectionMaterial: {
        // Template: A beryllium-impregnated ceramic fabric used in heat shields of all kinds.
        description: LiteralLocalizationLeaf;
        // Template: Basic Thermal Protection Material
        name: LiteralLocalizationLeaf;
      };
      basicWhippleShielding: {
        // Template: Shielding plates that reduce damage from flying through systems with a high meteoroid density.
        description: LiteralLocalizationLeaf;
        // Template: Basic Whipple Shielding
        name: LiteralLocalizationLeaf;
      };
      basicWindow: {
        // Template: Consisting of a metal frame, multiple layers of transparent plastic, and an emergency shutter in case the window gets compromised in non-breathable atmospheres or space.
        description: LiteralLocalizationLeaf;
        // Template: Basic Transparent Aperture
        name: LiteralLocalizationLeaf;
      };
      beryl: {
        // Template: Beryllium Aluminum cyclosilicates. The most well known forms are emerald and aquamarine.
        description: LiteralLocalizationLeaf;
        // Template: Beryl Crystals
        name: LiteralLocalizationLeaf;
      };
      beryllium: {
        // Template: Its thermal conductivity and low density make it useful for space based structures and ships. Beryllium is somewhat rare as it is fused into heavier elements inside stars.
        description: LiteralLocalizationLeaf;
        // Template: Beryllium
        name: LiteralLocalizationLeaf;
      };
      bioreactiveMineral: {
        // Template: A set of highly versatile minerals that serve as a basis for different kinds of chemical reagents.
        description: LiteralLocalizationLeaf;
        // Template: Bioreactive Minerals
        name: LiteralLocalizationLeaf;
      };
      biosphereUnit: {
        // Template: A large-scale biosphere, often used to grow food and herbs for long-term space travel.
        description: LiteralLocalizationLeaf;
        // Template: Biosphere Unit
        name: LiteralLocalizationLeaf;
      };
      bleach: {
        // Template: Desaturation agent - or "bleach", as it is more commonly known - is used to eliminate the natural color, texture, and odor of raw textiles.
        description: LiteralLocalizationLeaf;
        // Template: Desaturation Agent
        name: LiteralLocalizationLeaf;
      };
      blueGoldConnectors: {
        // Template: Shielded connectors help reduce the risk of signal interference.
        description: LiteralLocalizationLeaf;
        // Template: Shielded Connectors
        name: LiteralLocalizationLeaf;
      };
      bodyScanner: {
        // Template: Scans human bodies, usually to detect injuries or contraband.
        description: LiteralLocalizationLeaf;
        // Template: Body Scanner
        name: LiteralLocalizationLeaf;
      };
      boronCrystals: {
        // Template: Known for its resistance to heat, boron is widely applied for thermal protection purposes.
        description: LiteralLocalizationLeaf;
        // Template: Boron Crystals
        name: LiteralLocalizationLeaf;
      };
      borosilicate: {
        // Template: A material highly resistant to thermal shock.
        description: LiteralLocalizationLeaf;
        // Template: Borosilicate
        name: LiteralLocalizationLeaf;
      };
      breathableLiquid: {
        // Template: This oxygen-rich solution prevents lungs from collapsing under high acceleration or in high-pressure environments.
        description: LiteralLocalizationLeaf;
        // Template: Breathable Liquid
        name: LiteralLocalizationLeaf;
      };
      caffeinatedBeans: {
        // Template: Coffee plants will rise up to 20 meters in height on low-gravity planets although they are generally tricky to grow, requiring heavy rain in just the right intervals.
        description: LiteralLocalizationLeaf;
        // Template: Caffeinated Beans
        name: LiteralLocalizationLeaf;
      };
      calcium: {
        // Template: Human bones have been subjected to a host of new challenges since the space age began, making a regular calcium intake all the more important.
        description: LiteralLocalizationLeaf;
        // Template: Calcium
        name: LiteralLocalizationLeaf;
      };
      caliche: {
        // Template: Caliche is a sedimentary rock mostly mined for its iodine, a stable halogen used in contemporary lighting technology.
        description: LiteralLocalizationLeaf;
        // Template: Caliche Rock
        name: LiteralLocalizationLeaf;
      };
      capacitor: {
        // Template: Capacitors are made up of two conductive plates that are close together but not in contact. When a voltage is applied to the two plates an electrical field is formed between them.
        description: LiteralLocalizationLeaf;
        // Template: Electric Field Capacitor
        name: LiteralLocalizationLeaf;
      };
      carbohydrateGrains: {
        // Template: A staple of human nutrition since the neolithic revolution, grains are still a versatile ingredient in the age of space exploration.
        description: LiteralLocalizationLeaf;
        // Template: High-Carb Grains
        name: LiteralLocalizationLeaf;
      };
      carbohydrateMaize: {
        // Template: An essential, highly nutritional ingredient, maize is grown on farms and in greenhouse domes across the universe. Some incinerate it for its Carbon, others just want to make popcorn.
        description: LiteralLocalizationLeaf;
        // Template: High-Carb Maize
        name: LiteralLocalizationLeaf;
      };
      carbon: {
        // Template: Basis of all life and some industries, Carbon is used in ore purification and a variety of other processes.
        description: LiteralLocalizationLeaf;
        // Template: Carbon
        name: LiteralLocalizationLeaf;
      };
      ceramicFabric: {
        // Template: Ceramic fabrics have proven very useful when it comes to coating spaceship hulls to protect them from extreme temperatures.
        description: LiteralLocalizationLeaf;
        // Template: Ceramic Fabric
        name: LiteralLocalizationLeaf;
      };
      ceramicTungstenFabric: {
        // Template: A tungsten-infused version of ceramic fabric for those who want to go the extra mile in terms of thermal protection.
        description: LiteralLocalizationLeaf;
        // Template: Ceramic-Tungsten Fabric
        name: LiteralLocalizationLeaf;
      };
      chemicalReagents: {
        // Template: Used to create a variety of drugs and other chemically created products.
        description: LiteralLocalizationLeaf;
        // Template: Chemical Reagents
        name: LiteralLocalizationLeaf;
      };
      chlorine: {
        // Template: A chemical with many stand-out properties, chlorine has various uses in the food, clothing, and construction industries.
        description: LiteralLocalizationLeaf;
        // Template: Chlorine
        name: LiteralLocalizationLeaf;
      };
      climateController: {
        // Template: A climate controller maintains environmental factors at a comfortable level in a ship or structure.
        description: LiteralLocalizationLeaf;
        // Template: Climate Controller
        name: LiteralLocalizationLeaf;
      };
      combustionChamber: {
        // Template: Due to the extreme temperatures reached in combustion chambers, they come with multiple layers of borosilicate coating by default.
        description: LiteralLocalizationLeaf;
        // Template: Combustion Chamber
        name: LiteralLocalizationLeaf;
      };
      commandBridge1: {
        // Template: A standard command bridge ready to be implemented into pretty much any spacecraft.
        description: LiteralLocalizationLeaf;
        // Template: Command Bridge MK1
        name: LiteralLocalizationLeaf;
      };
      commandBridge2: {
        // Template: An advanced command bridge applied in spaceships using more complex engines and reactors.
        description: LiteralLocalizationLeaf;
        // Template: Command Bridge MK2
        name: LiteralLocalizationLeaf;
      };
      commandBridgeShort: {
        // Template: A command bridge module specifically designed for STL-only intra-system space flight.
        description: LiteralLocalizationLeaf;
        // Template: Short-distance Command Bridge
        name: LiteralLocalizationLeaf;
      };
      communicationSystem: {
        // Template: Full communication system ready to be implemented as part of a bigger complex.
        description: LiteralLocalizationLeaf;
        // Template: Communication System
        name: LiteralLocalizationLeaf;
      };
      coolingFan: {
        // Template: A fan used to actively cool equipment by moving atmospheric gases over its surfaces.
        description: LiteralLocalizationLeaf;
        // Template: Active Cooling Device
        name: LiteralLocalizationLeaf;
      };
      copper: {
        // Template: Its high electrical and thermal conductivity as well as its resistance to deformation and corrosion make copper a versatile ingredient in various electronic components.
        description: LiteralLocalizationLeaf;
        // Template: Copper
        name: LiteralLocalizationLeaf;
      };
      copperAluminiumAlloy: {
        // Template: Among other things, this alloy of copper and aluminium has been found to considerably increase the efficiency of solar panels.
        description: LiteralLocalizationLeaf;
        // Template: Bronze
        name: LiteralLocalizationLeaf;
      };
      copperConnectors: {
        // Template: Cheap but effective copper based connectors.
        description: LiteralLocalizationLeaf;
        // Template: Budget Connectors
        name: LiteralLocalizationLeaf;
      };
      copperOre: {
        // Template: This ore can be smelted down to copper, a metal that is nowadays used mostly in electronic devices.
        description: LiteralLocalizationLeaf;
        // Template: Copper Ore
        name: LiteralLocalizationLeaf;
      };
      coreModuleKit: {
        // Template: Provides everything required to build one's first base!
        description: LiteralLocalizationLeaf;
        // Template: Core Module Kit
        name: LiteralLocalizationLeaf;
      };
      cottonProcessed: {
        // Template: A cloth made from cotton used in clothing as well as in medicine as a component of bandages.
        description: LiteralLocalizationLeaf;
        // Template: Cotton Fabric
        name: LiteralLocalizationLeaf;
      };
      cottonRaw: {
        // Template: Domed cotton fields are warm and moderately humid places, and provide the basis for all of tomorrow's fashion trends.
        description: LiteralLocalizationLeaf;
        // Template: Raw Cotton Fiber
        name: LiteralLocalizationLeaf;
      };
      crewQuarters: {
        // Template: A large ready-to-go unit for a full spaceship crew to live and sleep in.
        description: LiteralLocalizationLeaf;
        // Template: Crew Quarters (Large)
        name: LiteralLocalizationLeaf;
      };
      crewQuartersMed: {
        // Template: A medium-sized ready-to-go unit for a full spaceship crew to live and sleep in.
        description: LiteralLocalizationLeaf;
        // Template: Crew Quarters (Medium)
        name: LiteralLocalizationLeaf;
      };
      crewQuartersSmall: {
        // Template: A small ready-to-go unit for a full spaceship crew to live and sleep in.
        description: LiteralLocalizationLeaf;
        // Template: Crew Quarters (Small)
        name: LiteralLocalizationLeaf;
      };
      crewQuartersTiny: {
        // Template: The smallest possible crew quarters. Say goodbye to luxury!
        description: LiteralLocalizationLeaf;
        // Template: Crew Quarters (Tiny)
        name: LiteralLocalizationLeaf;
      };
      crowdControlDrone: {
        // Template: A security drone equipped to control riots and detect contraband.
        description: LiteralLocalizationLeaf;
        // Template: Crowd Control Drone
        name: LiteralLocalizationLeaf;
      };
      cryoUnit: {
        // Template: The cryogenic unit safely places biological specimens in, and takes them out, of cryogenic stasis.
        description: LiteralLocalizationLeaf;
        // Template: Cryogenic Unit
        name: LiteralLocalizationLeaf;
      };
      cryogenicFluid: {
        // Template: This transparent, jelly-like substance is used in cryogenic tanks, mostly on generation ships. It provides nutrients via skin contact and even mitigates the effects of high acceleration.
        description: LiteralLocalizationLeaf;
        // Template: Cryogenic Stabilizer
        name: LiteralLocalizationLeaf;
      };
      cryopreservationUnit: {
        // Template: A unit holding cryopreservation tanks for long-term space travel.
        description: LiteralLocalizationLeaf;
        // Template: Cryopreservation Unit
        name: LiteralLocalizationLeaf;
      };
      dataAnalyzer: {
        // Template: The data analyzer applies artificial intelligence techniques to data in order to extract insights.
        description: LiteralLocalizationLeaf;
        // Template: Data Analyzer
        name: LiteralLocalizationLeaf;
      };
      dataVisualizer: {
        // Template: The data visualizer creates, maps, graphs, charts and other visualizations to illustrate the insights gained from data analysis.
        description: LiteralLocalizationLeaf;
        // Template: Data Visualizer
        name: LiteralLocalizationLeaf;
      };
      decorativeElements: {
        // Template: A variety of oddly shaped elements designed to serve as decorations at appropriate venues.
        description: LiteralLocalizationLeaf;
        // Template: Decorative Elements
        name: LiteralLocalizationLeaf;
      };
      distributedDatabase: {
        // Template: A distributed data store. They are often used to maintain state between components of a distributed system.
        description: LiteralLocalizationLeaf;
        // Template: Distributed Database
        name: LiteralLocalizationLeaf;
      };
      drinkingWater: {
        // Template: Treated water that is safe for drinking, food preparation and other day to day human uses.
        description: LiteralLocalizationLeaf;
        // Template: Drinking Water
        name: LiteralLocalizationLeaf;
      };
      droneChassis: {
        // Template: The basic chassis for any kind of drone.
        description: LiteralLocalizationLeaf;
        // Template: Drone Chassis
        name: LiteralLocalizationLeaf;
      };
      droneFrame: {
        // Template: Every drone chassis needs a proper holding frame.
        description: LiteralLocalizationLeaf;
        // Template: Drone Frame
        name: LiteralLocalizationLeaf;
      };
      droneOperationsUnit: {
        // Template: Building unit set up for controlling and monitoring drone operations.
        description: LiteralLocalizationLeaf;
        // Template: Drone Operations Unit
        name: LiteralLocalizationLeaf;
      };
      einsteinium: {
        // Template: A radioactive element that did not exist naturally on Earth. The high radioactivity of some Einsteinium isotopes produces a visible glow.
        description: LiteralLocalizationLeaf;
        // Template: Einsteinium
        name: LiteralLocalizationLeaf;
      };
      engineerBundle: {
        // Template: Everything required to supply 100 engineers for 10 days.
        description: LiteralLocalizationLeaf;
        // Template: Engineer Consumable Bundle
        name: LiteralLocalizationLeaf;
      };
      engineerClothing: {
        // Template: Half clothing, half computer, this garment assists engineers in their everyday tasks.
        description: LiteralLocalizationLeaf;
        // Template: Smart Space Suit
        name: LiteralLocalizationLeaf;
      };
      engineerFood: {
        // Template: This spicier version of standard-issue rations enjoys great popularity among engineers, who seem to enjoy sweating even during lunch break.
        description: LiteralLocalizationLeaf;
        // Template: Flavoured Insta-Meal
        name: LiteralLocalizationLeaf;
      };
      engineerLuxuryDrink: {
        // Template: Sharing a bottle of gin has become one of the most prevalent ways to unwind after a long day's work. The added Einsteinium adds a certain hallucinatory quality that is hard to say no to.
        description: LiteralLocalizationLeaf;
        // Template: Einsteinium-Infused Gin
        name: LiteralLocalizationLeaf;
      };
      engineerLuxuryHealth: {
        // Template: This paste works wonders on sore joints. VitaGel used to be a trademarked name but was soon also used for all the copies that flooded the market.
        description: LiteralLocalizationLeaf;
        // Template: VitaGel
        name: LiteralLocalizationLeaf;
      };
      engineerTools: {
        // Template: A handheld analysis tool with the ability to perform diagnostics checks and help with repairs.
        description: LiteralLocalizationLeaf;
        // Template: Personal Data Assistant
        name: LiteralLocalizationLeaf;
      };
      enrichedEinsteinium: {
        // Template: Einsteinium enriched in a special chemical process for use in fission reactors.
        description: LiteralLocalizationLeaf;
        // Template: Enriched Einsteinium
        name: LiteralLocalizationLeaf;
      };
      enrichedTechnetium: {
        // Template: While not as radioactive as other materials, an enriched form of technetium proved very useful to, among other things, power radioisotope generators.
        description: LiteralLocalizationLeaf;
        // Template: Enriched Technetium
        name: LiteralLocalizationLeaf;
      };
      entertainmentDataCore: {
        // Template: Games, movies, shows, music, and everything that you dream of.
        description: LiteralLocalizationLeaf;
        // Template: Entertainment Data Core
        name: LiteralLocalizationLeaf;
      };
      entertainmentUnit: {
        // Template: A full unit of entertainment hardware and control devices.
        description: LiteralLocalizationLeaf;
        // Template: Entertainment Unit
        name: LiteralLocalizationLeaf;
      };
      epoxy: {
        // Template: A highly viscous synthetic resin which, when hardened, acts as an adhesive reinforcement in building and ship components.
        description: LiteralLocalizationLeaf;
        // Template: Epoxy Resin
        name: LiteralLocalizationLeaf;
      };
      fastenerKitMedium: {
        // Template: A medium set of standard fasteners.
        description: LiteralLocalizationLeaf;
        // Template: Medium Fastener Kit
        name: LiteralLocalizationLeaf;
      };
      fastenerKitSmall: {
        // Template: A small set of standard fasteners.
        description: LiteralLocalizationLeaf;
        // Template: Small Fastener Kit
        name: LiteralLocalizationLeaf;
      };
      fattyNuts: {
        // Template: Nuts provide important triglycerides, which are rich in energy. Make sure to always keep an eye on your blood fat and do not overindulge.
        description: LiteralLocalizationLeaf;
        // Template: Triglyceride Nuts
        name: LiteralLocalizationLeaf;
      };
      fattyVegetables: {
        // Template: Similar-looking to Earth's fruits, but creamier and almost fatty-tasting, Triglyceride Fruits provide fewer health benefits, but more energy than their ancestors.
        description: LiteralLocalizationLeaf;
        // Template: Triglyceride Fruits
        name: LiteralLocalizationLeaf;
      };
      fissionReactor: {
        // Template: Performs controlled nuclear fission in a chain reaction to generate large amounts of energy.
        description: LiteralLocalizationLeaf;
        // Template: Fission Reactor
        name: LiteralLocalizationLeaf;
      };
      floatingTank: {
        // Template: A person-sized tank to have a mind-expanding floating experience in.
        description: LiteralLocalizationLeaf;
        // Template: Floating Tank
        name: LiteralLocalizationLeaf;
      };
      flowControl: {
        // Template: This unit controls the flow of liquids in as a complex a way as its user desires.
        description: LiteralLocalizationLeaf;
        // Template: Flow Control Device
        name: LiteralLocalizationLeaf;
      };
      fluidPiping: {
        // Template: This fluid piping system makes use of helium in its mantle to facilitate the discovery of leakage.
        description: LiteralLocalizationLeaf;
        // Template: Fluid Piping
        name: LiteralLocalizationLeaf;
      };
      fluorine: {
        // Template: The lightest halogen element and extremely reactive. Fluorine has both medical and industrial applications.
        description: LiteralLocalizationLeaf;
        // Template: Fluorine
        name: LiteralLocalizationLeaf;
      };
      flux: {
        // Template: When added to an ore refining process, this chemical allows for a more efficient separation of metals from slag, resulting in higher outputs for the same input.
        description: LiteralLocalizationLeaf;
        // Template: Flux
        name: LiteralLocalizationLeaf;
      };
      ftlFieldController: {
        // Template: The FTL field controller enables FTL travel by using large amounts of energy to bend spacetime around a ship.
        description: LiteralLocalizationLeaf;
        // Template: FTL Field Controller
        name: LiteralLocalizationLeaf;
      };
      ftlFuel: {
        // Template: Used by the right drive, these small pellets emit an energy capable of warping spacetime and punching a tunnel for the ship to pass through.
        description: LiteralLocalizationLeaf;
        // Template: FTL Fuel
        name: LiteralLocalizationLeaf;
      };
      fuelSavingEngine: {
        // Template: Less powerful than a standard STL engine, but saves quite a bit of fuel at the same time.
        description: LiteralLocalizationLeaf;
        // Template: Fuel-saving STL Engine
        name: LiteralLocalizationLeaf;
      };
      fullBodyInteractionDevice: {
        // Template: Essentially a high-tech overall that allows its wearer to control all kinds of software via gestures and movement.
        description: LiteralLocalizationLeaf;
        // Template: Full-Body Interaction Device
        name: LiteralLocalizationLeaf;
      };
      galerite: {
        // Template: Although nowhere to be found in the Solar System, Galerite has brought upon a revolution in STL fuel technology shortly after its discovery in humanity's new home systems.
        description: LiteralLocalizationLeaf;
        // Template: Galerite Rock
        name: LiteralLocalizationLeaf;
      };
      gasContainer: {
        // Template: Due to its shape and material, this gas tank can hold substances far above atmospheric pressure.
        description: LiteralLocalizationLeaf;
        // Template: Cylindrical Gas Container
        name: LiteralLocalizationLeaf;
      };
      gasVent: {
        // Template: A controllable outlet for gases.
        description: LiteralLocalizationLeaf;
        // Template: Gas Vent
        name: LiteralLocalizationLeaf;
      };
      gatewaySegment: {
        // Template: Several gateway segments are used to form the well-known ring structure of a gateway.
        description: LiteralLocalizationLeaf;
        // Template: Gateway Segment
        name: LiteralLocalizationLeaf;
      };
      glassCombustionChamber: {
        // Template: As it turns out, reinforced glass can withstand quite a bit of heat.
        description: LiteralLocalizationLeaf;
        // Template: Glass Combustion Chamber
        name: LiteralLocalizationLeaf;
      };
      glassEngine: {
        // Template: It was quite the feat when they discovered how to make a glass-based engine. It's not very powerful, but an affordable alternative!
        description: LiteralLocalizationLeaf;
        // Template: Glass-based STL Engine
        name: LiteralLocalizationLeaf;
      };
      glassNozzle: {
        // Template: Requires extremely careful handling, but works surprisingly well.
        description: LiteralLocalizationLeaf;
        // Template: Glass Nozzle
        name: LiteralLocalizationLeaf;
      };
      gold: {
        // Template: Though it is still not an abundant resource, humanity has taken on a more pragmatic view of gold over the centuries, appreciating its conductivity more than its appearance.
        description: LiteralLocalizationLeaf;
        // Template: Gold
        name: LiteralLocalizationLeaf;
      };
      goldCopperAlloy: {
        // Template: This alloy combines the excellent conductivity of both gold and copper.
        description: LiteralLocalizationLeaf;
        // Template: Red Gold
        name: LiteralLocalizationLeaf;
      };
      goldIronAlloy: {
        // Template: An alloy of gold with Gallium or Indium.
        description: LiteralLocalizationLeaf;
        // Template: Blue Gold
        name: LiteralLocalizationLeaf;
      };
      goldOre: {
        // Template: Ever since the 20th century, hydraulic mining has been the prevalent method of recovering gold nuggets from open pits and mine shafts.
        description: LiteralLocalizationLeaf;
        // Template: Gold Ore
        name: LiteralLocalizationLeaf;
      };
      grapes: {
        // Template: Even though grapes have become rare in the space age, they will not die out as long as there is demand for decent wine in the universe.
        description: LiteralLocalizationLeaf;
        // Template: Wine-Quality Grapes
        name: LiteralLocalizationLeaf;
      };
      habitatUnit: {
        // Template: An artificial, yet natural living space.
        description: LiteralLocalizationLeaf;
        // Template: Habitat Unit
        name: LiteralLocalizationLeaf;
      };
      habitationModule: {
        // Template: A module supporting long-term habitation on a colony ship.
        description: LiteralLocalizationLeaf;
        // Template: Habitation Module
        name: LiteralLocalizationLeaf;
      };
      halite: {
        // Template: The natural form of rock salt, these crystals are both pretty to look at and taste good when ingested.
        description: LiteralLocalizationLeaf;
        // Template: Halite Crystals
        name: LiteralLocalizationLeaf;
      };
      handcraftWorkshopUnit: {
        // Template: Hand-made art has become quite rare. This is where it comes to life.
        description: LiteralLocalizationLeaf;
        // Template: Handcraft Workshop Unit
        name: LiteralLocalizationLeaf;
      };
      hardenedHullPlate: {
        // Template: A hardened spaceship hull plate. It will reduce a ship's overall deterioration and allow it to endure significantly higher maximum g-force values.
        description: LiteralLocalizationLeaf;
        // Template: Hardened Hull Plate
        name: LiteralLocalizationLeaf;
      };
      hardenedStructuralElements: {
        // Template: General term for metal components for ships and buildings, such as girders and beams.
        description: LiteralLocalizationLeaf;
        // Template: Hardened Structural Elements
        name: LiteralLocalizationLeaf;
      };
      heliotropeExtract: {
        // Template: In high-enough concentrations, substances extracted from heliotropes were found to have a sedating effect on the human body as a whole, thereby expanding the range of endurable g-force values.
        description: LiteralLocalizationLeaf;
        // Template: Heliotrope Extract
        name: LiteralLocalizationLeaf;
      };
      helium: {
        // Template: A protective gas in welding processes and still the most common solution to make your voice sound funny.
        description: LiteralLocalizationLeaf;
        // Template: Helium
        name: LiteralLocalizationLeaf;
      };
      helium3: {
        // Template: Most commonly found on surfaces exposed to cosmic rays, helium-3 is a key component of faster-than-light fuel.
        description: LiteralLocalizationLeaf;
        // Template: Helium-3 Isotope
        name: LiteralLocalizationLeaf;
      };
      herbs: {
        // Template: Spices are herbs low in nutritional value, but provide some health benefits. As a result, they are not a given in every ship's cafeteria, but some can be found in the med bay.
        description: LiteralLocalizationLeaf;
        // Template: Spicy Herbs
        name: LiteralLocalizationLeaf;
      };
      highLoadCargoBay: {
        // Template: Everything you need to build a high-load cargo bay. It can only hold materials relatively small in volume though.
        description: LiteralLocalizationLeaf;
        // Template: High-load Cargo Bay Kit
        name: LiteralLocalizationLeaf;
      };
      highPowerReactor: {
        // Template: A high-power FTL reactor that takes a relatively long time to fully charge up.
        description: LiteralLocalizationLeaf;
        // Template: High-power FTL Reactor
        name: LiteralLocalizationLeaf;
      };
      highVolumeCargoBay: {
        // Template: Everything you need to build a high-volume cargo bay. It can only hold relatively lightweight materials though.
        description: LiteralLocalizationLeaf;
        // Template: High-volume Cargo Bay Kit
        name: LiteralLocalizationLeaf;
      };
      holographicDisplay: {
        // Template: The holographic display creates a three dimensional image of an object that can be seen with the naked eye.
        description: LiteralLocalizationLeaf;
        // Template: Holographic Display
        name: LiteralLocalizationLeaf;
      };
      holographicGlasses: {
        // Template: High-tech glasses able to display all kinds of additional information and lifelike visuals.
        description: LiteralLocalizationLeaf;
        // Template: Holographic Glasses
        name: LiteralLocalizationLeaf;
      };
      hugeCargoBay: {
        // Template: Used to install the most massive of cargo bays for all your transportation needs.
        description: LiteralLocalizationLeaf;
        // Template: Huge Cargo Bay Kit
        name: LiteralLocalizationLeaf;
      };
      hydrocarbonPlants: {
        // Template: Hydrocarbon plants come in many shapes and sizes, but most of them nowadays are algae grown in massive basins for a large variety of purposes.
        description: LiteralLocalizationLeaf;
        // Template: Hydrocarbon Plants
        name: LiteralLocalizationLeaf;
      };
      hydrogen: {
        // Template: Number one on the periodic table, hydrogen is a vital ingredient in various chemical compounds including ship fuel.
        description: LiteralLocalizationLeaf;
        // Template: Hydrogen
        name: LiteralLocalizationLeaf;
      };
      hyperPowerReactor: {
        // Template: An extremely high-power FTL reactor. Its charge-up speed had to be reduced significantly to guarantee stable results.
        description: LiteralLocalizationLeaf;
        // Template: Hyper-power Reactor
        name: LiteralLocalizationLeaf;
      };
      hyperthrustEngine: {
        // Template: This STL engine reaches extremely high thrust powers, but also burns a lot of fuel in the process.
        description: LiteralLocalizationLeaf;
        // Template: Hyperthrust STL Engine
        name: LiteralLocalizationLeaf;
      };
      hyperthrustNozzle: {
        // Template: A special nozzle used in high-thrust spacecraft engines.
        description: LiteralLocalizationLeaf;
        // Template: Hyperthrust Nozzle
        name: LiteralLocalizationLeaf;
      };
      indigo: {
        // Template: When you absolutely, positively got to color it indigo.
        description: LiteralLocalizationLeaf;
        // Template: Indigo Colorant
        name: LiteralLocalizationLeaf;
      };
      informationDataCore: {
        // Template: A whole library in one small data core.
        description: LiteralLocalizationLeaf;
        // Template: Information Data Core
        name: LiteralLocalizationLeaf;
      };
      informationManagementSystem: {
        // Template: A system supporting its user in analyzing and interpreting large sets of data.
        description: LiteralLocalizationLeaf;
        // Template: Information Management System
        name: LiteralLocalizationLeaf;
      };
      insuFoam: {
        // Template: This construction foam is used to insulate buildings against the cold of planets with non-habitable mean temperatures below -25°C.
        description: LiteralLocalizationLeaf;
        // Template: InsuFoam
        name: LiteralLocalizationLeaf;
      };
      iodine: {
        // Template: This stable halogen is extracted from Caliche rock and used in certain lamps that cannot be replaced by LED technology.
        description: LiteralLocalizationLeaf;
        // Template: Iodine
        name: LiteralLocalizationLeaf;
      };
      iron: {
        // Template: One of the most abundant elements on rocky planets, iron is used in a variety of alloys as well as the construction of buildings and metal parts.
        description: LiteralLocalizationLeaf;
        // Template: Iron
        name: LiteralLocalizationLeaf;
      };
      ironOre: {
        // Template: Iron ore contains iron, one of the earliest metals to be smelted down by humanity, all the way back in 2000 BC.
        description: LiteralLocalizationLeaf;
        // Template: Iron Ore
        name: LiteralLocalizationLeaf;
      };
      ironTitaniumAlloy: {
        // Template: An iron titanium alloy that can be used to influence grain sizes in steel making.
        description: LiteralLocalizationLeaf;
        // Template: Ferro-Titanium
        name: LiteralLocalizationLeaf;
      };
      kevlar: {
        // Template: Often spun into ropes or fabric, these fibers are used as a composite material reinforcing anything from clothing to structural building elements.
        description: LiteralLocalizationLeaf;
        // Template: Para Aramid
        name: LiteralLocalizationLeaf;
      };
      krypton: {
        // Template: Originally mostly used for lighting and laser systems, the discovery of the gateway technology revealed that this noble gas proved useful in the stabilization of gateway singularity vortices.
        description: LiteralLocalizationLeaf;
        // Template: Krypton
        name: LiteralLocalizationLeaf;
      };
      kryptonium: {
        // Template: A compound of krypton and einsteinium originally created for the purpose of fueling singularity gateways as a newly discovered way of ship travel.
        description: LiteralLocalizationLeaf;
        // Template: Kryptonium
        name: LiteralLocalizationLeaf;
      };
      laboratoryUnit: {
        // Template: A ready-to-go lab that can be used as part of a larger building complex.
        description: LiteralLocalizationLeaf;
        // Template: Laboratory Unit
        name: LiteralLocalizationLeaf;
      };
      largeCapacitorBank: {
        // Template: Stores a large amount of energy.
        description: LiteralLocalizationLeaf;
        // Template: Large Capacitor Bank
        name: LiteralLocalizationLeaf;
      };
      largeCargoBay: {
        // Template: Everything you need to build a large cargo bay.
        description: LiteralLocalizationLeaf;
        // Template: Large Cargo Bay Kit
        name: LiteralLocalizationLeaf;
      };
      largeDeviceCover: {
        // Template: A 3D-printed, plastic-based cover for various large electronic devices.
        description: LiteralLocalizationLeaf;
        // Template: Durable Casing L
        name: LiteralLocalizationLeaf;
      };
      largeEmitter: {
        // Template: A large FTL emitter requiring a relatively high amount of power to create an FTL field spanning a large volume.
        description: LiteralLocalizationLeaf;
        // Template: Large FTL Emitter
        name: LiteralLocalizationLeaf;
      };
      largeFtlTank: {
        // Template: Everything you need to build a large FTL fuel tank.
        description: LiteralLocalizationLeaf;
        // Template: Large FTL Fuel Tank Kit
        name: LiteralLocalizationLeaf;
      };
      largePlasticsBoard: {
        // Template: …
        description: LiteralLocalizationLeaf;
        // Template: Polymer Sheet Type L
        name: LiteralLocalizationLeaf;
      };
      largeShipRepairDroneUnit: {
        // Template: A control unit for a large set of drones able to consistently repair any kind of damage a ship takes during space flight.
        description: LiteralLocalizationLeaf;
        // Template: Large Ship-Repair Drone Operations Unit
        name: LiteralLocalizationLeaf;
      };
      largeStlTank: {
        // Template: Everything you need to build a large STL fuel tank.
        description: LiteralLocalizationLeaf;
        // Template: Large STL Fuel Tank Kit
        name: LiteralLocalizationLeaf;
      };
      laserDiode: {
        // Template: Laser diodes directly convert electrical energy into light.
        description: LiteralLocalizationLeaf;
        // Template: Laser Diodes
        name: LiteralLocalizationLeaf;
      };
      lifeSupportSystem: {
        // Template: Life support systems monitor and control the atmosphere and other environmental conditions essential to life.
        description: LiteralLocalizationLeaf;
        // Template: Life Support System
        name: LiteralLocalizationLeaf;
      };
      lightweightBulkhead: {
        // Template: Slightly thinner, but considerably lighter wall elements offering little structural stability.
        description: LiteralLocalizationLeaf;
        // Template: Lightweight Bulkhead
        name: LiteralLocalizationLeaf;
      };
      lightweightDeckElements: {
        // Template: Thin but long-lived plastic floor elements available in all shapes and sizes.
        description: LiteralLocalizationLeaf;
        // Template: Lightweight Deck Elements
        name: LiteralLocalizationLeaf;
      };
      lightweightHullPlate: {
        // Template: A lightweight spaceship hull plate. It will help reduce a ship's mass, but is slightly more prone to deterioration.
        description: LiteralLocalizationLeaf;
        // Template: Lightweight Hull Plate
        name: LiteralLocalizationLeaf;
      };
      lightweightStructuralElements: {
        // Template: Various lightweight components used in ship and building construction. Can be upgraded to be more durable, but also heavier.
        description: LiteralLocalizationLeaf;
        // Template: Lightweight Structural Elements
        name: LiteralLocalizationLeaf;
      };
      lightweightWindow: {
        // Template: Primarily meant to be used on the inside of structures, these double-layered windows find a great variety of applications both on planets and ships.
        description: LiteralLocalizationLeaf;
        // Template: Lightweight Transparent Aperture
        name: LiteralLocalizationLeaf;
      };
      limestone: {
        // Template: This Calcium-rich mineral can be found both in the crust and on the surface of many rocky planets. Its uses include construction and nutrition.
        description: LiteralLocalizationLeaf;
        // Template: Limestone
        name: LiteralLocalizationLeaf;
      };
      liquidCrystals: {
        // Template: These crystals are used in the manufacturing of Liquid Crystal Displays, or LCDs for short.
        description: LiteralLocalizationLeaf;
        // Template: Liquid Crystals
        name: LiteralLocalizationLeaf;
      };
      liquidEinsteinium: {
        // Template: Einstenium processed into liquid form. Still radioactive. Still glowing.
        description: LiteralLocalizationLeaf;
        // Template: Liquid Einsteinium
        name: LiteralLocalizationLeaf;
      };
      lithium: {
        // Template: Commonly used for the production of batteries and pharmaceuticals.
        description: LiteralLocalizationLeaf;
        // Template: Lithium
        name: LiteralLocalizationLeaf;
      };
      lithiumOre: {
        // Template: Lithium ore is required to produce lithium.
        description: LiteralLocalizationLeaf;
        // Template: Lithium Ore
        name: LiteralLocalizationLeaf;
      };
      localDatabase: {
        // Template: A local data store.
        description: LiteralLocalizationLeaf;
        // Template: Local Database
        name: LiteralLocalizationLeaf;
      };
      logisticsSystem: {
        // Template: A system to help with inventory management, transactions and the likes.
        description: LiteralLocalizationLeaf;
        // Template: Logistics System
        name: LiteralLocalizationLeaf;
      };
      lowHeatFuelPump: {
        // Template: An affordable fuel pump. Should not be used as part of high-temperature engines.
        description: LiteralLocalizationLeaf;
        // Template: Low-heat Fuel Pump
        name: LiteralLocalizationLeaf;
      };
      machineLearningInterface: {
        // Template: The first step in creating a self-learning artificial intelligence.
        description: LiteralLocalizationLeaf;
        // Template: Machine Learning Interface
        name: LiteralLocalizationLeaf;
      };
      magnesite: {
        // Template: A magnesium-rich mineral.
        description: LiteralLocalizationLeaf;
        // Template: Magnesite
        name: LiteralLocalizationLeaf;
      };
      magnesium: {
        // Template: One of the most abundant elements in the universe. Magnesium has many applications including as a structural material, in aluminium alloys and for the purification of solvents.
        description: LiteralLocalizationLeaf;
        // Template: Magnesium
        name: LiteralLocalizationLeaf;
      };
      magneticFloor: {
        // Template: Magnetic ground cover allows you to establish a firm foundation in low gravity environments.
        description: LiteralLocalizationLeaf;
        // Template: Magnetic Ground Cover
        name: LiteralLocalizationLeaf;
      };
      magnetite: {
        // Template: A iron oxide and common iron ore. Magnetite is ferromagnetic and can be magnetized.
        description: LiteralLocalizationLeaf;
        // Template: Magnetite
        name: LiteralLocalizationLeaf;
      };
      mainFrameBlank: {
        // Template: The 'main frame' held the central processing and main memory of early computers. Today's mainframes are large centralized computing facilities often used for critical applications.
        description: LiteralLocalizationLeaf;
        // Template: Basic Mainframe
        name: LiteralLocalizationLeaf;
      };
      meat: {
        // Template: The days of industrial livestock farming have long gone by, and the term "meat" has since taken on another meaning merely pertaining to a meal's texture and taste.
        description: LiteralLocalizationLeaf;
        // Template: Meat Tissue Patties
        name: LiteralLocalizationLeaf;
      };
      medicalStretcher: {
        // Template: The most basic form of a mobile medical bed.
        description: LiteralLocalizationLeaf;
        // Template: Medical Stretcher
        name: LiteralLocalizationLeaf;
      };
      mediumCapacitorBank: {
        // Template: Stores a medium amount of energy.
        description: LiteralLocalizationLeaf;
        // Template: Medium Capacitor Bank
        name: LiteralLocalizationLeaf;
      };
      mediumCargoBay: {
        // Template: Everything you need to build a medium-sized cargo bay.
        description: LiteralLocalizationLeaf;
        // Template: Medium Cargo Bay Kit
        name: LiteralLocalizationLeaf;
      };
      mediumDeviceCover: {
        // Template: A 3D-printed, plastic-based cover for various medium electronic devices.
        description: LiteralLocalizationLeaf;
        // Template: Durable Casing M
        name: LiteralLocalizationLeaf;
      };
      mediumEmitter: {
        // Template: A medium-size FTL emitter requiring a moderate amount of power to create an FTL field spanning a mid-sized volume.
        description: LiteralLocalizationLeaf;
        // Template: Medium FTL Emitter
        name: LiteralLocalizationLeaf;
      };
      mediumFtlTank: {
        // Template: Everything you need to build a medium-sized FTL fuel tank.
        description: LiteralLocalizationLeaf;
        // Template: Medium FTL Fuel Tank Kit
        name: LiteralLocalizationLeaf;
      };
      mediumPlasticsBoard: {
        // Template: …
        description: LiteralLocalizationLeaf;
        // Template: Polymer Sheet Type M
        name: LiteralLocalizationLeaf;
      };
      mediumStlTank: {
        // Template: Everything you need to build a medium-size STL fuel tank.
        description: LiteralLocalizationLeaf;
        // Template: Medium STL Fuel Tank Kit
        name: LiteralLocalizationLeaf;
      };
      megaTubeCoating: {
        // Template: What makes a megatube? Carbon nanotubes with diameters so large they are measured in micrometers.
        description: LiteralLocalizationLeaf;
        // Template: MegaTube Coating
        name: LiteralLocalizationLeaf;
      };
      memoryBank: {
        // Template: Provides other electronic components with lightning-fast application memory.
        description: LiteralLocalizationLeaf;
        // Template: Memory Bank
        name: LiteralLocalizationLeaf;
      };
      metalHalideLamp: {
        // Template: These lamps have become a staple of hydroponics, allowing certain plants (especially algae) to grow without sunlight.
        description: LiteralLocalizationLeaf;
        // Template: Metal-Halide Lighting System
        name: LiteralLocalizationLeaf;
      };
      microHeadphones: {
        // Template: Very tiny speakers. Be careful not to lose them in your ears!
        description: LiteralLocalizationLeaf;
        // Template: Micro Headphones
        name: LiteralLocalizationLeaf;
      };
      microProcessor: {
        // Template: A central processing unit implemented on a single integrated circuit.
        description: LiteralLocalizationLeaf;
        // Template: Micro-Processor
        name: LiteralLocalizationLeaf;
      };
      mineralConstructionGranulate: {
        // Template: Melted down, molded and then cooled off, these tiny pellets provide the hardened foundation of all buildings on rocky planets.
        description: LiteralLocalizationLeaf;
        // Template: Mineral Construction Granulate
        name: LiteralLocalizationLeaf;
      };
      motherBoard: {
        // Template: The main printed circuit board for a general purpose computer.
        description: LiteralLocalizationLeaf;
        // Template: Motherboard
        name: LiteralLocalizationLeaf;
      };
      mushrooms: {
        // Template: The Agaricaceae rubicatii family of fungi is not just known for unusual cultivation methods, but also rapid growth.
        description: LiteralLocalizationLeaf;
        // Template: Protein-Rich Mushrooms
        name: LiteralLocalizationLeaf;
      };
      nanoCarbonSheeting: {
        // Template: A substrate is covered with carbon nanotubes then the nanotubes are covered by a layer of aerogel. The aerogel is pulled away taking the nanotubes with it to form a sheeting.
        description: LiteralLocalizationLeaf;
        // Template: Nano-Carbon Sheeting
        name: LiteralLocalizationLeaf;
      };
      nanoFiber: {
        // Template: Fibers with diameters in the nanometer size range. In this case silicon fibers with graphene coating.
        description: LiteralLocalizationLeaf;
        // Template: Nano Fiber
        name: LiteralLocalizationLeaf;
      };
      nanoGlass: {
        // Template: Glass with coatings of nanomaterials to give it hydrophobic, oleophobic and other properties.
        description: LiteralLocalizationLeaf;
        // Template: Nano-Coated Glass
        name: LiteralLocalizationLeaf;
      };
      nanoResin: {
        // Template: A nanoparticle enhanced resin for industrial applications.
        description: LiteralLocalizationLeaf;
        // Template: Nano-Enhanced Resin
        name: LiteralLocalizationLeaf;
      };
      navigation1: {
        // Template: A basic navigation module to control ships with simple engines.
        description: LiteralLocalizationLeaf;
        // Template: Navigation Module MK1
        name: LiteralLocalizationLeaf;
      };
      navigation2: {
        // Template: An advanced navigation module to control ships with complex engines.
        description: LiteralLocalizationLeaf;
        // Template: Navigation Module MK2
        name: LiteralLocalizationLeaf;
      };
      neon: {
        // Template: A colorless odorless noble gas. Neon produces a reddish orange glow when placed in an electric field.
        description: LiteralLocalizationLeaf;
        // Template: Neon
        name: LiteralLocalizationLeaf;
      };
      neonLightingSystem: {
        // Template: Neon lights remind us of a world less complicated. They're also fun!
        description: LiteralLocalizationLeaf;
        // Template: Neon Lighting System
        name: LiteralLocalizationLeaf;
      };
      networkingFramework: {
        // Template: Software for building networking applications.
        description: LiteralLocalizationLeaf;
        // Template: Networking Framework
        name: LiteralLocalizationLeaf;
      };
      neuralNetwork: {
        // Template: Allows for artificial learning on large sets of data by vaguely simulating how actual brain neurons work.
        description: LiteralLocalizationLeaf;
        // Template: Neural Network
        name: LiteralLocalizationLeaf;
      };
      nitrogen: {
        // Template: Traded as a gas or a liquid, Nitrogen forms a great variety of compounds and plays a role in food preservation.
        description: LiteralLocalizationLeaf;
        // Template: Nitrogen
        name: LiteralLocalizationLeaf;
      };
      nonVolatileMemory: {
        // Template: Computer memory that can retrieve information after being powered on and off.
        description: LiteralLocalizationLeaf;
        // Template: Non-Volatile Memory
        name: LiteralLocalizationLeaf;
      };
      nutrientSolution: {
        // Template: While nutrient solution should not be consumed on its own due to its high concentration, it is used in a great many recipes for both edible and inedible end products.
        description: LiteralLocalizationLeaf;
        // Template: Nutrient Solution
        name: LiteralLocalizationLeaf;
      };
      nylon: {
        // Template: A versatile, plastic-based fabric traditionally used in clothing and warfare, which now also plays a role in building construction.
        description: LiteralLocalizationLeaf;
        // Template: Nylon Fabric
        name: LiteralLocalizationLeaf;
      };
      officeSupplies: {
        // Template: No one knows exactly what they are, but yet they are constantly consumed for “work”.
        description: LiteralLocalizationLeaf;
        // Template: Office Supplies
        name: LiteralLocalizationLeaf;
      };
      olfactorySubstances: {
        // Template: Smells nice in here!
        description: LiteralLocalizationLeaf;
        // Template: Olfactory Substances
        name: LiteralLocalizationLeaf;
      };
      operatingSystem: {
        // Template: Software that provides common services and interfaces to a computer system's hardware resources for other applications.
        description: LiteralLocalizationLeaf;
        // Template: Operating System
        name: LiteralLocalizationLeaf;
      };
      oxygen: {
        // Template: From alloy production to our own lungs, oxygen is what keeps humanity going. Warning: Higher concentrations only breathable in low gravity environments.
        description: LiteralLocalizationLeaf;
        // Template: Oxygen
        name: LiteralLocalizationLeaf;
      };
      painkillers: {
        // Template: The most popular medical drug in the universe.
        description: LiteralLocalizationLeaf;
        // Template: Painkillers
        name: LiteralLocalizationLeaf;
      };
      pesticides: {
        // Template: Although toxic to small organisms, this pesticide is safe for human consumption in moderate doses.
        description: LiteralLocalizationLeaf;
        // Template: DDT Plant Agent
        name: LiteralLocalizationLeaf;
      };
      pineberries: {
        // Template: Looks like a white strawberry, tastes like pineapple, is highly nutritious!
        description: LiteralLocalizationLeaf;
        // Template: Pineberries
        name: LiteralLocalizationLeaf;
      };
      pioneerBundle: {
        // Template: Everything required to supply 100 pioneers for 10 days.
        description: LiteralLocalizationLeaf;
        // Template: Pioneer Consumable Bundle
        name: LiteralLocalizationLeaf;
      };
      pioneerClothing: {
        // Template: This full-body suit, usually worn as an extra layer on top of personal clothing, is certainly nothing fancy, but practical and durable.
        description: LiteralLocalizationLeaf;
        // Template: Basic Overalls
        name: LiteralLocalizationLeaf;
      };
      pioneerLuxuryClothing: {
        // Template: This garment may not look like much, but its added plastic pads prevent countless injuries across the universe day after day.
        description: LiteralLocalizationLeaf;
        // Template: Padded Work Overall
        name: LiteralLocalizationLeaf;
      };
      pioneerLuxuryDrink: {
        // Template: Some take their psychoactive drugs with soy milk, others prefer them pure.
        description: LiteralLocalizationLeaf;
        // Template: Caffeinated Infusion
        name: LiteralLocalizationLeaf;
      };
      polarityFieldGenerator: {
        // Template: Combines the specific functionalities of several reactor types to span large fields of barely stable polarity.
        description: LiteralLocalizationLeaf;
        // Template: Polarity Field Generator
        name: LiteralLocalizationLeaf;
      };
      polyEthylene: {
        // Template: The most commonly used plastic for the past few centuries, PE still plays a vital role in packaging, clothing, printed building parts, and electronics.
        description: LiteralLocalizationLeaf;
        // Template: Poly-Ethylene
        name: LiteralLocalizationLeaf;
      };
      polymerGranulate: {
        // Template: Whoever thinks they can be anything when they grow up hasn't seen polymer granulate, a supplier of plastic in virtually every industrial branch out there.
        description: LiteralLocalizationLeaf;
        // Template: Polymer Granulate
        name: LiteralLocalizationLeaf;
      };
      powerCell: {
        // Template: A high-energy mobile power source.
        description: LiteralLocalizationLeaf;
        // Template: Power Cell
        name: LiteralLocalizationLeaf;
      };
      premiumFertilizer: {
        // Template: Surprisingly effective at generating a seemingly natural flora.
        description: LiteralLocalizationLeaf;
        // Template: Premium Fertilizer
        name: LiteralLocalizationLeaf;
      };
      pressureShielding: {
        // Template: Shielding to protect crew and cargo from high pressure environments.
        description: LiteralLocalizationLeaf;
        // Template: Pressure Shielding
        name: LiteralLocalizationLeaf;
      };
      printedCircuitBoard: {
        // Template: A sheet of non-conductive substrate covered with a layer of conductor which electronic circuits are etched onto.
        description: LiteralLocalizationLeaf;
        // Template: Printed Circuit Board
        name: LiteralLocalizationLeaf;
      };
      proteinAlgae: {
        // Template: Humanity needed an efficient source of protein and came up with this strain of algae. What's more, it can even grow in space.
        description: LiteralLocalizationLeaf;
        // Template: Protein-Rich Algae
        name: LiteralLocalizationLeaf;
      };
      proteinBeans: {
        // Template: While still inefficient in hydroponics, beans are a staple of planet-side farming and essential provider of protein across the universe.
        description: LiteralLocalizationLeaf;
        // Template: Protein-Rich Beans
        name: LiteralLocalizationLeaf;
      };
      proteinPaste: {
        // Template: A goop of ground plants, this paste is an essential ingredient in modern "meat". Not at all enjoyable on its own.
        description: LiteralLocalizationLeaf;
        // Template: Protein Paste
        name: LiteralLocalizationLeaf;
      };
      quickChargeReactor: {
        // Template: A moderate-power reactor able to charge up very quickly.
        description: LiteralLocalizationLeaf;
        // Template: Quick-charge FTL Reactor
        name: LiteralLocalizationLeaf;
      };
      radiationShielding: {
        // Template: Shielding to protect crew and cargo from radiation environments.
        description: LiteralLocalizationLeaf;
        // Template: Radiation Shielding
        name: LiteralLocalizationLeaf;
      };
      radioDevice: {
        // Template: When your regular mobile phone just isn't enough!
        description: LiteralLocalizationLeaf;
        // Template: Radio Device
        name: LiteralLocalizationLeaf;
      };
      radioisotopeGenerator: {
        // Template: Converts the heat from radioactive decay into a medium amount of energy.
        description: LiteralLocalizationLeaf;
        // Template: Radioisotope Generator
        name: LiteralLocalizationLeaf;
      };
      rations: {
        // Template: As the most common menu item in the universe, this plant-based and often brick-shaped meal has high nutritional value to make up for the lack of flavor and spices.
        description: LiteralLocalizationLeaf;
        // Template: Basic Rations
        name: LiteralLocalizationLeaf;
      };
      reactorControlSystem: {
        // Template: Monitors a variety of performance factors of an FTL reactor and automatically makes adjustments where necessary.
        description: LiteralLocalizationLeaf;
        // Template: Reactor Control System
        name: LiteralLocalizationLeaf;
      };
      redGoldConnectors: {
        // Template: High throughput connectors for specialized applications.
        description: LiteralLocalizationLeaf;
        // Template: High-Capacity Connectors
        name: LiteralLocalizationLeaf;
      };
      reinforcedBulkhead: {
        // Template: A wall element offering greater durability due to the addition of titanium and hardened epoxy resin.
        description: LiteralLocalizationLeaf;
        // Template: Reinforced Bulkhead
        name: LiteralLocalizationLeaf;
      };
      reinforcedDeckElements: {
        // Template: Considerably heavier than the basic and advanced versions, these floor tiles are required in some large spacecraft and planetary structures.
        description: LiteralLocalizationLeaf;
        // Template: Reinforced Deck Elements
        name: LiteralLocalizationLeaf;
      };
      reinforcedHullPlate: {
        // Template: A reinforced spaceship hull plate. It will slightly reduce a ship's overall deterioration and allow it to endure higher maximum g-force values.
        description: LiteralLocalizationLeaf;
        // Template: Reinforced Hull Plate
        name: LiteralLocalizationLeaf;
      };
      reinforcedStructuralElements: {
        // Template: Laced with steel and resin, these components are used in buildings and spacecraft with increased requirements on structural integrity.
        description: LiteralLocalizationLeaf;
        // Template: Reinforced Structural Elements
        name: LiteralLocalizationLeaf;
      };
      reinforcedTranslucentMaterial: {
        // Template: This hybrid of old-fashioned glass and its plastic-based counterpart can be used for windows and screens alike.
        description: LiteralLocalizationLeaf;
        // Template: Reinforced Glass
        name: LiteralLocalizationLeaf;
      };
      reinforcedWindow: {
        // Template: Much thicker and sturdier due to the mixture of silicon- and plastic-based glass, these windows can be built to larger dimensions while still being able to withstand huge forces.
        description: LiteralLocalizationLeaf;
        // Template: Reinforced Transparent Aperture
        name: LiteralLocalizationLeaf;
      };
      rescueDrone: {
        // Template: A drone designed to locate and rescue living beings. Yes, it can actually carry a person.
        description: LiteralLocalizationLeaf;
        // Template: Rescue Drone
        name: LiteralLocalizationLeaf;
      };
      rhenium: {
        // Template: A rare and heat-resistant metal named after the old-Earth river Rhine.
        description: LiteralLocalizationLeaf;
        // Template: Rhenium
        name: LiteralLocalizationLeaf;
      };
      rheniumOre: {
        // Template: One of the rarest ores to be found throughout the known universe.
        description: LiteralLocalizationLeaf;
        // Template: Rhenium Ore
        name: LiteralLocalizationLeaf;
      };
      safetyUniform: {
        // Template: A carbon-infused overall.
        description: LiteralLocalizationLeaf;
        // Template: Safety Uniform
        name: LiteralLocalizationLeaf;
      };
      scientistBundle: {
        // Template: Everything required to supply 100 scientists for 10 days.
        description: LiteralLocalizationLeaf;
        // Template: Scientist Consumable Bundle
        name: LiteralLocalizationLeaf;
      };
      scientistClothing: {
        // Template: This coat comes with its own holographic display to assists its wearer throughout complex procedures, and even performs life-sustaining measures if an experiment goes awry.
        description: LiteralLocalizationLeaf;
        // Template: AI-Assisted Lab Coat
        name: LiteralLocalizationLeaf;
      };
      scientistFood: {
        // Template: Even high-quality foods nowadays do not vary much in ingredients, but at least they are presented in different shapes and sizes.
        description: LiteralLocalizationLeaf;
        // Template: Quality Meat Meal
        name: LiteralLocalizationLeaf;
      };
      scientistLuxuryDrink: {
        // Template: Ever since ancient Greece, great minds have relied on this liquid to think. In the space-age they even apply artificial intelligence to create this unique flavor.
        description: LiteralLocalizationLeaf;
        // Template: Smart Zinfandel
        name: LiteralLocalizationLeaf;
      };
      scientistLuxuryHealth: {
        // Template: Just a little something to perk you up.
        description: LiteralLocalizationLeaf;
        // Template: NeuroStimulants
        name: LiteralLocalizationLeaf;
      };
      scientistTools: {
        // Template: A versatile computer for various purposes, but mostly used in scientific contexts.
        description: LiteralLocalizationLeaf;
        // Template: Scientific Work Station
        name: LiteralLocalizationLeaf;
      };
      sealant: {
        // Template: Liquid polymer providing good adherence to many common materials and flexibility when cured. May not be suitable for use on some plastics.
        description: LiteralLocalizationLeaf;
        // Template: Poly-Sulfite Sealant
        name: LiteralLocalizationLeaf;
      };
      searchAlgorithm: {
        // Template: An algorithm for searching through data.
        description: LiteralLocalizationLeaf;
        // Template: Search Algorithm
        name: LiteralLocalizationLeaf;
      };
      sedativeSubstance: {
        // Template: A substance directly infused into the human body via special high-g seats. It helps endure particularly high g-force levels.
        description: LiteralLocalizationLeaf;
        // Template: Sedative Substance
        name: LiteralLocalizationLeaf;
      };
      sensor: {
        // Template: A device that measures physical properties such as a thermistor for temperature measurements or a charge coupled device for measuring light levels.
        description: LiteralLocalizationLeaf;
        // Template: Sensor
        name: LiteralLocalizationLeaf;
      };
      sensorArray: {
        // Template: A full suite of active and passive remote sensing systems.
        description: LiteralLocalizationLeaf;
        // Template: Sensor Array
        name: LiteralLocalizationLeaf;
      };
      settlerBundle: {
        // Template: Everything required to supply 100 settlers for 10 days.
        description: LiteralLocalizationLeaf;
        // Template: Settler Consumable Bundle
        name: LiteralLocalizationLeaf;
      };
      settlerClothing: {
        // Template: Equipping its wearer with superhuman strength, this suit has become a staple of physical work regardless of local gravity.
        description: LiteralLocalizationLeaf;
        // Template: Exoskeleton Work Suit
        name: LiteralLocalizationLeaf;
      };
      settlerLuxuryDrink: {
        // Template: While Kombucha is not a necessity for survival, it provides a considerable boost to health and morale.
        description: LiteralLocalizationLeaf;
        // Template: Kombucha
        name: LiteralLocalizationLeaf;
      };
      settlerLuxuryTools: {
        // Template: Tools that repair things. What's not to understand? Get back to work.
        description: LiteralLocalizationLeaf;
        // Template: Repair Kit
        name: LiteralLocalizationLeaf;
      };
      settlerTools: {
        // Template: These whirring, blinking, and noisy companions of modern settlers have come a long way since the first sharpened rock back on Earth.
        description: LiteralLocalizationLeaf;
        // Template: Power Tools
        name: LiteralLocalizationLeaf;
      };
      shipRepairDrone: {
        // Template: A drone set up to autonomously perform basic repair and maintenance tasks on all kinds of spaceships.
        description: LiteralLocalizationLeaf;
        // Template: Ship-Repair Drone
        name: LiteralLocalizationLeaf;
      };
      shockwaveDampeningModule: {
        // Template: Controls a set of stabilizing structures to ensure even large-scale shockwaves will not result in negative impacts.
        description: LiteralLocalizationLeaf;
        // Template: Shockwave-dampening Module
        name: LiteralLocalizationLeaf;
      };
      silicon: {
        // Template: A hard and brittle crystalline solid that is often used for its properties as a semiconductor. Most often found in various forms of silicon dioxide (silica) or silicate minerals.
        description: LiteralLocalizationLeaf;
        // Template: Silicon
        name: LiteralLocalizationLeaf;
      };
      siliconOre: {
        // Template: On the markets, the term "Silicon Ore" is used as a shorthand for different products yielding silicone when smelted down, such as quartzite or sand.
        description: LiteralLocalizationLeaf;
        // Template: Silicon Ore
        name: LiteralLocalizationLeaf;
      };
      silkProcessed: {
        // Template: One of the few remaining fibers with a natural origin, silk nowadays has some niche uses in the clothing industry.
        description: LiteralLocalizationLeaf;
        // Template: Silken Fabric
        name: LiteralLocalizationLeaf;
      };
      silkRaw: {
        // Template: The start of a long journey to sophisticated clothing such as AI-assisted lab coats.
        description: LiteralLocalizationLeaf;
        // Template: Raw Silk Strains
        name: LiteralLocalizationLeaf;
      };
      singularityStabilizer: {
        // Template: After the first experiments with making use of singularities, scientists quickly discovered the need for specialized stabilization modules. They do not like to talk about how they found out in too much detail though.
        description: LiteralLocalizationLeaf;
        // Template: Singularity Stabilizer
        name: LiteralLocalizationLeaf;
      };
      smallCapacitorBank: {
        // Template: Stores a small amount of energy.
        description: LiteralLocalizationLeaf;
        // Template: Small Capacitor Bank
        name: LiteralLocalizationLeaf;
      };
      smallCargoBay: {
        // Template: Everything you need to build a small cargo bay.
        description: LiteralLocalizationLeaf;
        // Template: Small Cargo Bay Kit
        name: LiteralLocalizationLeaf;
      };
      smallDeviceCover: {
        // Template: A 3D-printed, plastic-based cover for various small electronic devices.
        description: LiteralLocalizationLeaf;
        // Template: Durable Casing S
        name: LiteralLocalizationLeaf;
      };
      smallEmitter: {
        // Template: A small FTL emitter requiring relatively little power to create an FTL field spanning a small volume.
        description: LiteralLocalizationLeaf;
        // Template: Small FTL Emitter
        name: LiteralLocalizationLeaf;
      };
      smallFtlTank: {
        // Template: Everything you need to build a small FTL fuel tank.
        description: LiteralLocalizationLeaf;
        // Template: Small FTL Fuel Tank Kit
        name: LiteralLocalizationLeaf;
      };
      smallPlasticsBoard: {
        // Template: …
        description: LiteralLocalizationLeaf;
        // Template: Polymer Sheet Type S
        name: LiteralLocalizationLeaf;
      };
      smallShipRepairDroneUnit: {
        // Template: A control unit for a small set of drones able to consistently repair any kind of damage a ship takes during space flight.
        description: LiteralLocalizationLeaf;
        // Template: Small Ship-Repair Drone Operations Unit
        name: LiteralLocalizationLeaf;
      };
      smallStlTank: {
        // Template: Everything you need to build a small STL fuel tank.
        description: LiteralLocalizationLeaf;
        // Template: Small STL Fuel Tank Kit
        name: LiteralLocalizationLeaf;
      };
      sodium: {
        // Template: An essential element in human biology and industry.
        description: LiteralLocalizationLeaf;
        // Template: Sodium
        name: LiteralLocalizationLeaf;
      };
      sodiumBorohydride: {
        // Template: A versatile chemical agent that chemists rely upon to get the job done. Known to be extremely flammable if left unchecked, it’s best to store it in a safe location. Mass production of this compound originated on old Earth and was first achieved by chemists from Gladi Research Group, Lab 0-99.
        description: LiteralLocalizationLeaf;
        // Template: Sodium Borohydride
        name: LiteralLocalizationLeaf;
      };
      solarCell: {
        // Template: A single solar cell to turn sunlight into energy.
        description: LiteralLocalizationLeaf;
        // Template: Solar Cell
        name: LiteralLocalizationLeaf;
      };
      solarPanel: {
        // Template: High-efficiency solar panels have become the most prevalent means of energy extraction in space and on sunnier planets.
        description: LiteralLocalizationLeaf;
        // Template: Solar Panel
        name: LiteralLocalizationLeaf;
      };
      sortingAlgorithm: {
        // Template: An algorithm for sorting data.
        description: LiteralLocalizationLeaf;
        // Template: Sorting Algorithm
        name: LiteralLocalizationLeaf;
      };
      spaceTether: {
        // Template: A set of sturdy interwoven cords used to hold large space structures in place.
        description: LiteralLocalizationLeaf;
        // Template: Space Tether
        name: LiteralLocalizationLeaf;
      };
      specializedRadiationShielding: {
        // Template: These plates protect a ship from taking damage from typical large-star radiation levels.
        description: LiteralLocalizationLeaf;
        // Template: Specialized Anti-rad Plate
        name: LiteralLocalizationLeaf;
      };
      stabilitySupportSystem: {
        // Template: A system that helps pilot safely through extremely high- or low-gravity atmospheres.
        description: LiteralLocalizationLeaf;
        // Template: Stability Support System
        name: LiteralLocalizationLeaf;
      };
      standardEngine: {
        // Template: Standard STL engine with decent thrust and manageable fuel consumption.
        description: LiteralLocalizationLeaf;
        // Template: Standard STL Engine
        name: LiteralLocalizationLeaf;
      };
      standardReactor: {
        // Template: A standard FTL reactor.
        description: LiteralLocalizationLeaf;
        // Template: Standard FTL Reactor
        name: LiteralLocalizationLeaf;
      };
      steel: {
        // Template: An iron-based alloy with high tensile strength, steel is considered too heavy for most uses in space, but remains the ideal solution for many planetary construction components.
        description: LiteralLocalizationLeaf;
        // Template: Steel
        name: LiteralLocalizationLeaf;
      };
      stlFuel: {
        // Template: While this liquid still resembles fuel of past centuries in smell and viscosity, today's formula is required in much smaller amounts due to vastly more efficient drives.
        description: LiteralLocalizationLeaf;
        // Template: STL Fuel
        name: LiteralLocalizationLeaf;
      };
      structuralSpacecraftComponent: {
        // Template: Spacecrafts consists of many different parts held together by structural components.
        description: LiteralLocalizationLeaf;
        // Template: Structural Spacecraft Component
        name: LiteralLocalizationLeaf;
      };
      sulfur: {
        // Template: Elemental sulfur is bright yellow and solid at room temperature.
        description: LiteralLocalizationLeaf;
        // Template: Sulfur
        name: LiteralLocalizationLeaf;
      };
      sulfurCrystals: {
        // Template: Sulfur is typically found in sulfide and sulfate minerals in nature.
        description: LiteralLocalizationLeaf;
        // Template: Sulfur Crystals
        name: LiteralLocalizationLeaf;
      };
      surgeryUnit: {
        // Template: A building-ready medical unit to perform surgical procedures in.
        description: LiteralLocalizationLeaf;
        // Template: Surgery Unit
        name: LiteralLocalizationLeaf;
      };
      surgicalDrone: {
        // Template: A drone designed to support a surgeon at work. Once you get used to the buzzing, it's very helpful!
        description: LiteralLocalizationLeaf;
        // Template: Surgical Drone
        name: LiteralLocalizationLeaf;
      };
      surgicalEquipment: {
        // Template: All kinds of scalpels, clips and swabs.
        description: LiteralLocalizationLeaf;
        // Template: Surgical Equipment
        name: LiteralLocalizationLeaf;
      };
      surveillanceDrone: {
        // Template: A drone designed to observe, scan and report. Most people don't like them.
        description: LiteralLocalizationLeaf;
        // Template: Surveillance Drone
        name: LiteralLocalizationLeaf;
      };
      tantalite: {
        // Template: Rich in the element tantalum the mineral tantalite is similar to the mineral columbite and the two are commonly referred to as coltan. Tantalum is used in tantalum capacitors and coltan is also an important source of niobium.
        description: LiteralLocalizationLeaf;
        // Template: Tantalite Rock
        name: LiteralLocalizationLeaf;
      };
      tantalum: {
        // Template: A rare and high corrosion resistant metal.
        description: LiteralLocalizationLeaf;
        // Template: Tantalum
        name: LiteralLocalizationLeaf;
      };
      targetingComputer: {
        // Template: Measure twice, cut once.
        description: LiteralLocalizationLeaf;
        // Template: Targeting Computer
        name: LiteralLocalizationLeaf;
      };
      tclAcid: {
        // Template: Terephthaloyl chloride is one of the components necessary in the production of para aramid.
        description: LiteralLocalizationLeaf;
        // Template: TCL Acid
        name: LiteralLocalizationLeaf;
      };
      technetium: {
        // Template: All isotopes of Technetium are radioactive and it is typically found naturally only as a decay product of other elements such as Uranium and Thorium.
        description: LiteralLocalizationLeaf;
        // Template: Technetium
        name: LiteralLocalizationLeaf;
      };
      technetiumOxide: {
        // Template: A yellow volatile solid.
        description: LiteralLocalizationLeaf;
        // Template: Technetium Oxide
        name: LiteralLocalizationLeaf;
      };
      technetiumStabilizers: {
        // Template: The Technetium isotope Technetium-97 can be used as a stabilized form of Technetium is put into a fully ionized state.
        description: LiteralLocalizationLeaf;
        // Template: Stabilized Technetium
        name: LiteralLocalizationLeaf;
      };
      technicianBundle: {
        // Template: Everything required to supply 100 technicians for 10 days.
        description: LiteralLocalizationLeaf;
        // Template: Technician Consumable Bundle
        name: LiteralLocalizationLeaf;
      };
      technicianClothing: {
        // Template: With its near impervious fabric and the air tank installed on its back, this suit allows for work with hazardous materials and in hostile environments.
        description: LiteralLocalizationLeaf;
        // Template: HazMat Work Suit
        name: LiteralLocalizationLeaf;
      };
      technicianHealth: {
        // Template: Mostly intended to help with injuries, this kit contains a handheld scanner and self-expanding medical foam alongside the usual first aid equipment.
        description: LiteralLocalizationLeaf;
        // Template: Basic Medical Kit
        name: LiteralLocalizationLeaf;
      };
      technicianLuxuryDrink: {
        // Template: A light beer brewed from water, hop, and malt. Some claim that it can't hold a candle to its terrestrial ancestors.
        description: LiteralLocalizationLeaf;
        // Template: Stellar Pale Ale
        name: LiteralLocalizationLeaf;
      };
      technicianLuxuryHealth: {
        // Template: Aging was considered an irreversible process. In the future that no longer rings true.
        description: LiteralLocalizationLeaf;
        // Template: Stem Cell Treatment
        name: LiteralLocalizationLeaf;
      };
      technicianTools: {
        // Template: A powerful and essential tool able to run diagnostics and find faults in a great variety of machines.
        description: LiteralLocalizationLeaf;
        // Template: Multi-Purpose Scanner
        name: LiteralLocalizationLeaf;
      };
      technoKevlar: {
        // Template: Technetium-enhanced para-aramid fabric for specialized applications.
        description: LiteralLocalizationLeaf;
        // Template: Enhanced Para Aramid
        name: LiteralLocalizationLeaf;
      };
      tectosilisite: {
        // Template: Tectosilisite is a very silicon-rich regolith found on planets with a thin or no atmosphere at all. Its rather high He-3 contents make it interesting for fuel production.
        description: LiteralLocalizationLeaf;
        // Template: Tectosilisite
        name: LiteralLocalizationLeaf;
      };
      tensionReliefStructure: {
        // Template: Often used as the central element of space infrastructure to ensure it endures the strains of meteorite impacts and pressure changes.
        description: LiteralLocalizationLeaf;
        // Template: Tension Relief Structure
        name: LiteralLocalizationLeaf;
      };
      tensorProcessingUnit: {
        // Template: An electronic system specifically designed to quickly process tensors for neural networks and other applications.
        description: LiteralLocalizationLeaf;
        // Template: Tensor Processing Unit
        name: LiteralLocalizationLeaf;
      };
      testTubes: {
        // Template: A popular piece of laboratory equipment used to hold test samples.
        description: LiteralLocalizationLeaf;
        // Template: Test Tubes
        name: LiteralLocalizationLeaf;
      };
      thermalShielding: {
        // Template: These actively cooled, heat-deflecting modules must be distributed along the outer walls of buildings located on planets with an average temperature of more than 75° C.
        description: LiteralLocalizationLeaf;
        // Template: Thermal Shielding
        name: LiteralLocalizationLeaf;
      };
      thermoFluid: {
        // Template: This high-performance heat transfer fluid can be used from small scale applications like CPU coolers up to building-sized thermal shields.
        description: LiteralLocalizationLeaf;
        // Template: ThermoFluid
        name: LiteralLocalizationLeaf;
      };
      tinyCargoBay: {
        // Template: Everything you need to build a tiny cargo bay.
        description: LiteralLocalizationLeaf;
        // Template: Tiny Cargo Bay Kit
        name: LiteralLocalizationLeaf;
      };
      titanium: {
        // Template: Lightweight, strong, and resistant to corrosion, titanium and its alloys have become a staple (not only) of the aerospace industry.
        description: LiteralLocalizationLeaf;
        // Template: Titanium
        name: LiteralLocalizationLeaf;
      };
      titaniumOre: {
        // Template: Titanium oxide minerals rutile and ilmenite are the most common minerals in titanium ore bodies.
        description: LiteralLocalizationLeaf;
        // Template: Titanium Ore
        name: LiteralLocalizationLeaf;
      };
      torusSegment: {
        // Template: Part of a circular structure made to endure long-term existence in space.
        description: LiteralLocalizationLeaf;
        // Template: Torus Segment
        name: LiteralLocalizationLeaf;
      };
      touchDeviceBlank: {
        // Template: Data and computing power right in the palm of your hand.
        description: LiteralLocalizationLeaf;
        // Template: Handheld Personal Console
        name: LiteralLocalizationLeaf;
      };
      touchScreen: {
        // Template: An input device typically deployed on top of an electronic display. More commonly known as a touch screen.
        description: LiteralLocalizationLeaf;
        // Template: Capacitive Display
        name: LiteralLocalizationLeaf;
      };
      transistor: {
        // Template: A transistor amplifies or switches electrical signals and power. This is an advanced model.
        description: LiteralLocalizationLeaf;
        // Template: Advanced Transistor
        name: LiteralLocalizationLeaf;
      };
      translucentMaterial: {
        // Template: This traditional form of glass is rarely used on its own nowadays, but rather combined with new materials to withstand the stress and strain of the space age.
        description: LiteralLocalizationLeaf;
        // Template: Glass
        name: LiteralLocalizationLeaf;
      };
      traumaCareUnit: {
        // Template: Had an accident? This is where you'll be taken care of.
        description: LiteralLocalizationLeaf;
        // Template: Trauma Care Unit
        name: LiteralLocalizationLeaf;
      };
      truss: {
        // Template: A stable relationship between structural components is built on truss.
        description: LiteralLocalizationLeaf;
        // Template: Truss
        name: LiteralLocalizationLeaf;
      };
      tungstenAluminiumAlloy: {
        // Template: Able to endure extreme heat, this alloy is typically used for thermal protection purposes for spaceships or high-thrust engines.
        description: LiteralLocalizationLeaf;
        // Template: Alpha-Stabilized Tungsten
        name: LiteralLocalizationLeaf;
      };
      tungstenResource: {
        // Template: Tungsten can be recovered from scrap by using microorganisms to absorb it enabling recovery. This process sometimes occurs naturally when microorganisms come in contact with tungsten bearing minerals.
        description: LiteralLocalizationLeaf;
        // Template: Bacterial Tungsten Solution
        name: LiteralLocalizationLeaf;
      };
      twoDimensionalDisplay: {
        // Template: An output device that displays data.
        description: LiteralLocalizationLeaf;
        // Template: Information Display
        name: LiteralLocalizationLeaf;
      };
      universalToolset: {
        // Template: A collection of high-quality tools to fix everyday appliances or to hone your handcrafting skills.
        description: LiteralLocalizationLeaf;
        // Template: Universal Toolset
        name: LiteralLocalizationLeaf;
      };
      universeMap: {
        // Template: A map of the known universe and all its related data.
        description: LiteralLocalizationLeaf;
        // Template: Spatial Navigation Map
        name: LiteralLocalizationLeaf;
      };
      verySmallCargoBay: {
        // Template: Everything you need to build a very small cargo bay.
        description: LiteralLocalizationLeaf;
        // Template: Very Small Cargo Bay Kit
        name: LiteralLocalizationLeaf;
      };
      vitaEssence: {
        // Template: Healthy, tasty, nutritious.
        description: LiteralLocalizationLeaf;
        // Template: Vita Essence
        name: LiteralLocalizationLeaf;
      };
      vortexEngine: {
        // Template: A ship engine incorporating a vortex reactor to enable colony ship travel independently from established FTL connections.
        description: LiteralLocalizationLeaf;
        // Template: Vortex Engine
        name: LiteralLocalizationLeaf;
      };
      vortexFuelTank: {
        // Template: A giant tank able to hold enough vortex fuel on a colony ships to journey to a nearby sector and back.
        description: LiteralLocalizationLeaf;
        // Template: Vortex Fuel Tank
        name: LiteralLocalizationLeaf;
      };
      vortexReactor: {
        // Template: A special reactor for colony ships making use of certain aspects of gateway travel technology.
        description: LiteralLocalizationLeaf;
        // Template: Vortex Reactor
        name: LiteralLocalizationLeaf;
      };
      vortexStimulationFuel: {
        // Template: The addition of einsteinium proved to be the final puzzle piece in finding a way of taming the singularity vortex which was once believed to be uncontrollable.
        description: LiteralLocalizationLeaf;
        // Template: Vortex Fuel
        name: LiteralLocalizationLeaf;
      };
      waferMedium: {
        // Template: A medium sized disk of crystalline silicon used in the fabrication of electronics.
        description: LiteralLocalizationLeaf;
        // Template: Medium Wafer
        name: LiteralLocalizationLeaf;
      };
      waferSmall: {
        // Template: A small sized disk of crystalline silicon used in the fabrication of electronics.
        description: LiteralLocalizationLeaf;
        // Template: Small Wafer
        name: LiteralLocalizationLeaf;
      };
      water: {
        // Template: It should be no surprise that the liquid making up 60 % of our bodies is used in almost all processes concerning the production of nourishment across the universe.
        description: LiteralLocalizationLeaf;
        // Template: Water
        name: LiteralLocalizationLeaf;
      };
      waterFilter: {
        // Template: Water filtration equipment that actively monitors water conditions and applied remediation as needed.
        description: LiteralLocalizationLeaf;
        // Template: Active Water Filter
        name: LiteralLocalizationLeaf;
      };
      waterRecycler: {
        // Template: Equipment for the reclaiming usable clean water from biological wastes and industrial effluents.
        description: LiteralLocalizationLeaf;
        // Template: Water Reclaimer
        name: LiteralLocalizationLeaf;
      };
      weakArtificalIntelligence: {
        // Template: AI optimized for a specific task or application. Definitely not a general purpose AI that will learn at an alarming rate, become self aware and create problems for humanity.
        description: LiteralLocalizationLeaf;
        // Template: Weak Artificial Intelligence
        name: LiteralLocalizationLeaf;
      };
      windowManager: {
        // Template: …
        description: LiteralLocalizationLeaf;
        // Template: Window Manager
        name: LiteralLocalizationLeaf;
      };
      wolfram: {
        // Template: A rare metal with the highest melting point of all the known elements. Also known as Wolfram.
        description: LiteralLocalizationLeaf;
        // Template: Tungsten
        name: LiteralLocalizationLeaf;
      };
      wolfrhenium: {
        // Template: Turns out combining two metals with extremely high melting points results in a useful alloy, especially when it comes to building resilient space infrastructure.
        description: LiteralLocalizationLeaf;
        // Template: Wolfrhenium
        name: LiteralLocalizationLeaf;
      };
      workstationBlank: {
        // Template: A basic computer workstation.
        description: LiteralLocalizationLeaf;
        // Template: Basic Workstation
        name: LiteralLocalizationLeaf;
      };
      zircon: {
        // Template: The mineral Zircon can be processed into metallic zirconium.
        description: LiteralLocalizationLeaf;
        // Template: Zircon Crystals
        name: LiteralLocalizationLeaf;
      };
      zirconium: {
        // Template: Zirconium has many applications including in nuclear reactors as cladding for fuel rods and as corrosion resistant material in chemical processing equipment.
        description: LiteralLocalizationLeaf;
        // Template: Zirconium
        name: LiteralLocalizationLeaf;
      };
    };
    MaterialAssignment: {
      action: {
        // Template: assign
        assign: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Inventory
        storage: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Assignment
        assignment: LiteralLocalizationLeaf;
        // Template: Inventory
        inventory: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
      };
    };
    MaterialCategory: {
      // Template: Agricultural Products
      agriculturalproducts: LiteralLocalizationLeaf;
      // Template: Alloys
      alloys: LiteralLocalizationLeaf;
      // Template: Chemicals
      chemicals: LiteralLocalizationLeaf;
      // Template: Construction Materials
      constructionmaterials: LiteralLocalizationLeaf;
      // Template: Construction Parts
      constructionparts: LiteralLocalizationLeaf;
      // Template: Construction Prefabs
      constructionprefabs: LiteralLocalizationLeaf;
      // Template: Consumable Bundles
      consumablebundles: LiteralLocalizationLeaf;
      // Template: Consumables (basic)
      consumables_basic_: LiteralLocalizationLeaf;
      // Template: Consumables (luxury)
      consumables_luxury_: LiteralLocalizationLeaf;
      // Template: Drones
      drones: LiteralLocalizationLeaf;
      // Template: Electronic Devices
      electronicdevices: LiteralLocalizationLeaf;
      // Template: Electronic Parts
      electronicparts: LiteralLocalizationLeaf;
      // Template: Electronic Pieces
      electronicpieces: LiteralLocalizationLeaf;
      // Template: Electronic Systems
      electronicsystems: LiteralLocalizationLeaf;
      // Template: Elements
      elements: LiteralLocalizationLeaf;
      // Template: Energy Systems
      energysystems: LiteralLocalizationLeaf;
      // Template: Fuels
      fuels: LiteralLocalizationLeaf;
      // Template: Gases
      gases: LiteralLocalizationLeaf;
      // Template: Infrastructure
      infrastructure: LiteralLocalizationLeaf;
      // Template: Liquids
      liquids: LiteralLocalizationLeaf;
      // Template: Medical Equipment
      medicalequipment: LiteralLocalizationLeaf;
      // Template: Metals
      metals: LiteralLocalizationLeaf;
      // Template: Minerals
      minerals: LiteralLocalizationLeaf;
      // Template: Ores
      ores: LiteralLocalizationLeaf;
      // Template: Plastics
      plastics: LiteralLocalizationLeaf;
      // Template: Ship Engines
      shipengines: LiteralLocalizationLeaf;
      // Template: Ship Kits
      shipkits: LiteralLocalizationLeaf;
      // Template: Ship Parts
      shipparts: LiteralLocalizationLeaf;
      // Template: Ship Shields
      shipshields: LiteralLocalizationLeaf;
      // Template: Software Components
      softwarecomponents: LiteralLocalizationLeaf;
      // Template: Software Systems
      softwaresystems: LiteralLocalizationLeaf;
      // Template: Software Tools
      softwaretools: LiteralLocalizationLeaf;
      // Template: Textiles
      textiles: LiteralLocalizationLeaf;
      // Template: Unit Prefabs
      unitprefabs: LiteralLocalizationLeaf;
      // Template: Utility
      utility: LiteralLocalizationLeaf;
    };
    MaterialInformation: {
      // Template: Area cost
      areaCost: LiteralLocalizationLeaf;
      // Template: Building material
      buildingMaterial: LiteralLocalizationLeaf;
      // Template: Category
      category: LiteralLocalizationLeaf;
      // Template: CoGC upkeep
      cogcUsage: LiteralLocalizationLeaf;
      // Template: Infrastructure upkeep
      infrastructureUsage: LiteralLocalizationLeaf;
      label: {
        // Template: Volume
        volume: LiteralLocalizationLeaf;
        // Template: Weight
        weight: LiteralLocalizationLeaf;
      };
      // Template: Other usage
      otherUsage: LiteralLocalizationLeaf;
      // Template: Production
      production: LiteralLocalizationLeaf;
      // Template: Natural resource
      resource: {
        // Template: no
        no: LiteralLocalizationLeaf;
        // Template: yes
        yes: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Ticker
      ticker: LiteralLocalizationLeaf;
      // Template: {volume}m³
      volume: {
        getFormat: () => IntlMessageFormat;
        message: (options: { volume: string }) => string;
      };
      // Template: {weight}t
      weight: {
        getFormat: () => IntlMessageFormat;
        message: (options: { weight: string }) => string;
      };
      // Template: Workforce upkeep
      workforceUsage: LiteralLocalizationLeaf;
      // Template: Wrought product
      wroughtProduct: LiteralLocalizationLeaf;
    };
    MaterialPanel: {
      context: {
        // Template: CX Material Info
        comexMaterialInfo: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No material found.
        material: LiteralLocalizationLeaf;
      };
      // Template: Material
      title: LiteralLocalizationLeaf;
      // Template: Material: {name}
      titleWithName: {
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    MaterialSelector: {
      input: {
        // Template: commodity name
        placeholder: LiteralLocalizationLeaf;
      };
    };
    MaterialTransfer: {
      error: {
        // Template: No storages found.
        noStoragesFound: LiteralLocalizationLeaf;
      };
      header: {
        // Template: Transfer Details
        details: LiteralLocalizationLeaf;
        // Template: Transfer Result
        result: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Amount
        amountSlider: LiteralLocalizationLeaf;
        // Template: Material
        material: LiteralLocalizationLeaf;
        // Template: Source Storage
        storageFrom: LiteralLocalizationLeaf;
        // Template: Target Storage
        storageTo: LiteralLocalizationLeaf;
        // Template: Transfer
        transferResult: LiteralLocalizationLeaf;
      };
      // Template: Material Transfer
      title: LiteralLocalizationLeaf;
      // Template: transfer
      transferButton: LiteralLocalizationLeaf;
      transferResult: {
        // Template: {amount} {materialName} from {storeFrom} to {storeTo}
        description: {
          getFormat: () => IntlMessageFormat;
          message: (options: {
            amount: string;
            materialName: string;
            storeFrom: string;
            storeTo: string;
          }) => string;
        };
        // Template: Invalid transfer.
        transferInvalid: LiteralLocalizationLeaf;
      };
    };
    MenuHeadItem: {
      action: {
        // Template: logout
        logout: LiteralLocalizationLeaf;
      };
      section: {
        // Template: Settings
        settings: LiteralLocalizationLeaf;
      };
    };
    Message: {
      action: {
        // Template: delete
        _delete: LiteralLocalizationLeaf;
      };
    };
    MissionPlan: {
      // Template: Consumption
      consumption: LiteralLocalizationLeaf;
      // Template: Fees
      costs: LiteralLocalizationLeaf;
      // Template: Damage
      damage: {
        // Template: Ship damage depends on several factors such as environment conditions, radiation or meteoroid density along the route. Damage can be reduced by applying certain hull plates or shields in a ship's blueprint. Consider repairing your ships (via SHP) at some point or they will slow down significantly.
        info: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Destination
      destination: LiteralLocalizationLeaf;
      // Template: Distance
      distance: LiteralLocalizationLeaf;
      // Template: Duration
      duration: LiteralLocalizationLeaf;
      // Template: #
      index: LiteralLocalizationLeaf;
      // Template: Type
      type: LiteralLocalizationLeaf;
    };
    MissionSegmentType: {
      // Template: APP
      approach: {
        // Template: Approach: Ship closes in on a planet or station before landing on it.
        tooltip: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: CHRG
      charge: {
        // Template: Charge: FTL engine is charged up. Charge time and power depends on the used engine.
        tooltip: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: DCAY
      decay: {
        // Template: Decay: Ship waits for the gateway polarity field to decay sufficiently to continue its flight.
        tooltip: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: DEP
      departure: {
        // Template: Departure: Ship moves away from planet or station to be able to perform a safe FTL jump.
        tooltip: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: FLT
      float: {
        // Template: Float: Colony ships move between sectors independently from FTL lanes (even if none exist). This step takes a fixed amount of time and fuel.
        tooltip: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: JMP
      jump: {
        // Template: Jump: Ship jumps between two stars along an FTL lane.
        tooltip: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: GTW
      jumpgateway: {
        // Template: Gateway: Ship jumps through a gateway and exits at the connected counterpart.
        tooltip: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: LND
      landing: {
        // Template: Landing: Ship lands on a planetary surface or station.
        tooltip: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: LOCK
      lock: {
        // Template: Lock: Ship waits for the gateway polarity field to establish to then align with it.
        tooltip: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: TO
      takeoff: {
        // Template: Takeoff: Ship starts flight from a planetary surface or station.
        tooltip: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: TRA
      transit: {
        // Template: Transit: Ship performs a transit within the same system.
        tooltip: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
    };
    MobileMainState: {
      // Template: Could not find the selected resource
      notfound: LiteralLocalizationLeaf;
    };
    MobileMaterialTransferModal: {
      action: {
        // Template: transfer selected amount
        transfer: LiteralLocalizationLeaf;
      };
      // Template: units
      units: LiteralLocalizationLeaf;
    };
    MobileMaterialTransferModel: {
      // Template: Material Transfer
      title: LiteralLocalizationLeaf;
    };
    MobileStoreTransferOverlay: {
      // Template: Target Stores
      targetStores: LiteralLocalizationLeaf;
    };
    MobileTransferStoreAndItemSelectionModal: {
      button: {
        // Template: Continue
        _continue: LiteralLocalizationLeaf;
      };
      form: {
        // Template: Material
        material: LiteralLocalizationLeaf;
        // Template: Target store
        target: LiteralLocalizationLeaf;
      };
      heading: {
        // Template: Material Transfer
        materialTransfer: LiteralLocalizationLeaf;
      };
    };
    Model: {
      action: {
        // Template: {icon} Dismiss
        dismiss: {
          getFormat: () => IntlMessageFormat;
          message: (options: { icon: string }) => string;
        };
      };
    };
    Modifier: {
      // Template: Hold: {weight}t / {volume}m³
      cargoBay: {
        getFormat: () => IntlMessageFormat;
        message: (options: { weight: string; volume: string }) => string;
      };
      // Template: {sign}{factor}% damage reduction
      damageReduction: {
        getFormat: () => IntlMessageFormat;
        message: (options: { sign: string; factor: string }) => string;
      };
      // Template: Capacity: {units} units
      ftlFuelTank: {
        getFormat: () => IntlMessageFormat;
        message: (options: { units: string }) => string;
      };
      // Template: {power}GW, charge factor {charge}
      ftlReactor: {
        getFormat: () => IntlMessageFormat;
        message: (options: { power: string; charge: string }) => string;
      };
      // Template: +{delta} max g-factor
      maxGFactorIncrease: {
        getFormat: () => IntlMessageFormat;
        message: (options: { delta: string }) => string;
      };
      // Template: not protected
      notprotected: LiteralLocalizationLeaf;
      // Template: protected
      _protected: LiteralLocalizationLeaf;
      // Template: {units} fuel units / second
      stlEngine: {
        getFormat: () => IntlMessageFormat;
        message: (options: { units: string }) => string;
      };
      // Template: Capacity: {units} units
      stlFuelTank: {
        getFormat: () => IntlMessageFormat;
        message: (options: { units: string }) => string;
      };
      // Template: Capacity: {units} units
      vortexFuelTank: {
        getFormat: () => IntlMessageFormat;
        message: (options: { units: string }) => string;
      };
    };
    Money: {
      // Template: {amount} {currency}
      amount: {
        getFormat: () => IntlMessageFormat;
        message: (options: { amount: string; currency: string }) => string;
      };
      // Template: -- {forcedCurrencyCode}
      missingAmount: {
        getFormat: () => IntlMessageFormat;
        message: (options: { forcedCurrencyCode: string }) => string;
      };
    };
    Motion: {
      Commands: {
        command: {
          // Template: ABSTAIN
          abstain: LiteralLocalizationLeaf;
          // Template: NO
          no: LiteralLocalizationLeaf;
          // Template: YES
          yes: LiteralLocalizationLeaf;
        };
      };
      VoteSection: {
        table: {
          // Template: Cmds
          commands: LiteralLocalizationLeaf;
          // Template: Role
          role: LiteralLocalizationLeaf;
          // Template: Status
          status: LiteralLocalizationLeaf;
          // Template: Voter
          voter: LiteralLocalizationLeaf;
        };
      };
      VoteStatus: {
        // Template: ABSTAIN
        abstain: LiteralLocalizationLeaf;
        // Template: NO
        no: LiteralLocalizationLeaf;
        // Template: WAITING
        none: LiteralLocalizationLeaf;
        // Template: YES
        yes: LiteralLocalizationLeaf;
      };
      action: {
        // Template: Add Component
        addComponent: LiteralLocalizationLeaf;
        // Template: Delete Motion
        deleteMotion: LiteralLocalizationLeaf;
        // Template: save
        save: LiteralLocalizationLeaf;
        // Template: Start Voting
        startVoting: LiteralLocalizationLeaf;
      };
      form: {
        // Template: Created
        created: LiteralLocalizationLeaf;
        // Template: Creator
        creator: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Id
        naturalId: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
      };
      header: {
        // Template: Components
        components: LiteralLocalizationLeaf;
        // Template: Details
        details: LiteralLocalizationLeaf;
        // Template: Votes
        votes: LiteralLocalizationLeaf;
      };
      label: {
        // Template: This motion has not entered the voting phase yet.
        noVotesYet: LiteralLocalizationLeaf;
        // Template: Voting end
        votingend: LiteralLocalizationLeaf;
        // Template: Voting start
        votingstart: LiteralLocalizationLeaf;
      };
    };
    MotionComponent: {
      action: {
        // Template: cancel
        cancel: LiteralLocalizationLeaf;
        // Template: save
        save: LiteralLocalizationLeaf;
      };
    };
    MotionComponentName: {
      type: {
        // Template: Contribution
        CONTRIBUTION: LiteralLocalizationLeaf;
        // Template: Local Market fees
        FEE_LOCAL_MARKET: LiteralLocalizationLeaf;
        // Template: Production fees
        FEE_PRODUCTION: LiteralLocalizationLeaf;
        // Template: Base establishment fees
        FEE_SITE_ESTABLISHMENT: LiteralLocalizationLeaf;
        // Template: Warehouse fees
        FEE_WAREHOUSE: LiteralLocalizationLeaf;
        // Template: Fuel gateway
        GATEWAY_FUEL: LiteralLocalizationLeaf;
        // Template: Link gateway
        GATEWAY_LINK: LiteralLocalizationLeaf;
        // Template: Gateway pricing
        GATEWAY_PRICING: LiteralLocalizationLeaf;
        // Template: Unlink gateway
        GATEWAY_UNLINK: LiteralLocalizationLeaf;
        // Template: Infrastructure construction
        INFRASTRUCTURE_CONSTRUCTION: LiteralLocalizationLeaf;
        // Template: Infrastructure name
        INFRASTRUCTURE_NAME: LiteralLocalizationLeaf;
        // Template: Infrastructure upgrade
        INFRASTRUCTURE_UPGRADE: LiteralLocalizationLeaf;
        // Template: Infrastructure upkeep
        INFRASTRUCTURE_UPKEEP: LiteralLocalizationLeaf;
        // Template: Payout
        PAYOUT: LiteralLocalizationLeaf;
        // Template: Infrastructure levels
        POPULATION_INFRASTRUCTURE_LEVEL: LiteralLocalizationLeaf;
        // Template: Workforce program
        WORKFORCE_PROGRAM: LiteralLocalizationLeaf;
      };
    };
    MotionComponentsTable: {
      action: {
        // Template: delete
        _delete: LiteralLocalizationLeaf;
        // Template: edit
        edit: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Commands
        Cmds: LiteralLocalizationLeaf;
        // Template: Description
        description: LiteralLocalizationLeaf;
        // Template: Type
        type: LiteralLocalizationLeaf;
      };
    };
    MotionContainer: {
      error: {
        // Template: Could not find a motion for input '{motionId}'
        noMotion: {
          getFormat: () => IntlMessageFormat;
          message: (options: { motionId: string }) => string;
        };
      };
    };
    MotionPanel: {
      error: {
        // Template: No government found for input {input}.
        id: {
          getFormat: () => IntlMessageFormat;
          message: (options: { input: string }) => string;
        };
      };
      title: {
        // Template: Motion: {motionId}
        loading: {
          getFormat: () => IntlMessageFormat;
          message: (options: { motionId: string }) => string;
        };
      };
    };
    MotionStatus: {
      // Template: DRAFT
      draft: LiteralLocalizationLeaf;
      // Template: FAILED
      failed: LiteralLocalizationLeaf;
      // Template: PASSED
      passed: LiteralLocalizationLeaf;
      // Template: VOTING
      voting: LiteralLocalizationLeaf;
    };
    Motions: {
      action: {
        // Template: Create motion
        _new: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Status
        address: LiteralLocalizationLeaf;
        // Template: Created
        created: LiteralLocalizationLeaf;
        // Template: Creator
        creator: LiteralLocalizationLeaf;
        // Template: Motion
        id: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
      };
    };
    MotionsPanel: {
      action: {
        // Template: Delete
        deleteComponent: {
          // Template: Are you sure you want to delete this component?
          confirmation: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Delete
        deleteMotion: {
          // Template: Are you sure you want to delete this motion?
          confirmation: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
      // Template: Motions
      title: {
        // Template: Motion
        motion: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
    };
    MutedChatMessage: {
      // Template: Blocked message
      text: LiteralLocalizationLeaf;
    };
    MutedUsers: {
      actions: {
        // Template: Unmute User
        unmute: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Cmds
        commands: LiteralLocalizationLeaf;
        // Template: Muted since
        time: LiteralLocalizationLeaf;
        // Template: Username
        user: LiteralLocalizationLeaf;
      };
    };
    MutedUsersPanel: {
      context: {
        // Template: Communications
        communications: LiteralLocalizationLeaf;
      };
    };
    NamePlanetPanel: {
      action: {
        // Template: Are you sure you want to name this planet '{name}'? You cannot undo this!
        confirmation: {
          getFormat: () => IntlMessageFormat;
          message: (options: { name: string }) => string;
        };
        // Template: Name Planet
        name: LiteralLocalizationLeaf;
        // Template: Note that offensive names or names going against the general mood and setting of the game world are not permitted.
        notes: LiteralLocalizationLeaf;
      };
      error: {
        // Template: Planet not found.
        naturalId: LiteralLocalizationLeaf;
      };
      // Template: Planet has been named.
      success: LiteralLocalizationLeaf;
      // Template: Name Planet: {naturalId}
      title: {
        // Template: Name Planet: loading…
        loading: LiteralLocalizationLeaf;
        // Template: Name Planet: not found…
        notFound: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { naturalId: string }) => string;
      };
    };
    NameSystemPanel: {
      action: {
        // Template: Are you sure you want to name this system '{name}'? You cannot undo this!
        confirmation: {
          getFormat: () => IntlMessageFormat;
          message: (options: { name: string }) => string;
        };
        // Template: Name System
        name: LiteralLocalizationLeaf;
        // Template: Note that offensive names or names going against the general mood and setting of the game world are not permitted.
        notes: LiteralLocalizationLeaf;
      };
      error: {
        // Template: System not found.
        naturalId: LiteralLocalizationLeaf;
      };
      // Template: System has been named.
      success: LiteralLocalizationLeaf;
      // Template: Name System: {naturalId}
      title: {
        // Template: Name System: loading…
        loading: LiteralLocalizationLeaf;
        // Template: Name System: not found…
        notFound: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { naturalId: string }) => string;
      };
    };
    NamingForm: {
      label: {
        // Template: Note
        note: LiteralLocalizationLeaf;
      };
      // Template: Name
      name: LiteralLocalizationLeaf;
      // Template: Catalog ID
      naturalId: LiteralLocalizationLeaf;
      // Template: Please note that the selected name has to be a fit for the universe and lore. We will change names that don't fit.
      note: LiteralLocalizationLeaf;
      // Template: Assign name…
      submit: {
        // Template: n/a
        disabled: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
    };
    NavigationConstants: {
      // Template: calculating
      calculating: LiteralLocalizationLeaf;
      // Template: equal origin and destination
      equalOriginDestination: LiteralLocalizationLeaf;
      // Template: FTL reactor required
      ftlReactorRequired: LiteralLocalizationLeaf;
      // Template: invalid
      invalid: LiteralLocalizationLeaf;
      // Template: not enough FTL fuel ({ftlFuelNecessary} units necessary)
      missingFtlFuel: {
        getFormat: () => IntlMessageFormat;
        message: (options: { ftlFuelNecessary: string }) => string;
      };
      // Template: not enough STL fuel ({stlFuelNecessary} units necessary)
      missingStlFuel: {
        getFormat: () => IntlMessageFormat;
        message: (options: { stlFuelNecessary: string }) => string;
      };
      // Template: no path to destination
      noPath: LiteralLocalizationLeaf;
      // Template: navigation subsystem not ready
      notReady: LiteralLocalizationLeaf;
      // Template: valid
      ok: LiteralLocalizationLeaf;
      // Template: out of FTL range
      outOfFtlRange: LiteralLocalizationLeaf;
      // Template: out of STL range
      outOfStlRange: LiteralLocalizationLeaf;
    };
    NeedFulfillment: {
      // Template: {type} - {fulfillment}%
      content: {
        getFormat: () => IntlMessageFormat;
        message: (options: { type: string; fulfillment: string }) => string;
      };
    };
    NeedTypeLabel: {
      // Template: Comfort
      COMFORT: LiteralLocalizationLeaf;
      // Template: Culture
      CULTURE: LiteralLocalizationLeaf;
      // Template: Education
      EDUCATION: LiteralLocalizationLeaf;
      // Template: Health
      HEALTH: LiteralLocalizationLeaf;
      // Template: Life support
      LIFE_SUPPORT: LiteralLocalizationLeaf;
      // Template: Safety
      SAFETY: LiteralLocalizationLeaf;
    };
    NoData: {
      // Template: --
      label: LiteralLocalizationLeaf;
    };
    NoTestServerAccess: {
      // Template: Account Management
      accountManagement: LiteralLocalizationLeaf;
      // Template: This APEX console is only accessible to Licensees with the Test Server Access perk!
      text1: LiteralLocalizationLeaf;
      // Template: To gain access, please head over to {link} and purchase any of the available supporter tiers.
      text2: {
        getFormat: () => IntlMessageFormat;
        message: (options: { link: string }) => string;
      };
      // Template: Thank you very much for your understanding.
      text3: LiteralLocalizationLeaf;
      // Template: Test Server Access required
      title: LiteralLocalizationLeaf;
    };
    NonActiveContextNotifications: {
      action: {
        // Template: switch to context
        _switch: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Command
        command: LiteralLocalizationLeaf;
        // Template: Context
        context: LiteralLocalizationLeaf;
        // Template: #unread
        unread: LiteralLocalizationLeaf;
        // Template: #unseen
        unseen: LiteralLocalizationLeaf;
      };
    };
    NotificationConfigPanel: {
      enabled: {
        // Template: default
        _default: LiteralLocalizationLeaf;
        // Template: disabled
        disabled: LiteralLocalizationLeaf;
        // Template: enabled
        enabled: LiteralLocalizationLeaf;
      };
      frequency: {
        // Template: 12h
        _12: LiteralLocalizationLeaf;
        // Template: 15m
        _15m: LiteralLocalizationLeaf;
        // Template: 1h
        _1h: LiteralLocalizationLeaf;
        // Template: 1m
        _1m: LiteralLocalizationLeaf;
        // Template: 24h
        _24h: LiteralLocalizationLeaf;
        // Template: 4h
        _4h: LiteralLocalizationLeaf;
        // Template: 8h
        _8h: LiteralLocalizationLeaf;
        // Template: default
        _default: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Email Notifications
        enabled: LiteralLocalizationLeaf;
        // Template: Max. Frequency
        frequency: LiteralLocalizationLeaf;
        // Template: Alert
        type: {
          // Template: Default Settings
          _default: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
      // Template: Push Notification Settings
      title: LiteralLocalizationLeaf;
    };
    Notifications: {
      context: {
        // Template: Push Notification Settings
        config: LiteralLocalizationLeaf;
        // Template: In-game Notification Settings
        inGameConfig: LiteralLocalizationLeaf;
        // Template: Notifications
        notifications: LiteralLocalizationLeaf;
      };
    };
    NotificationsPanel: {
      link: {
        // Template: mark all as read
        markAllAsRead: LiteralLocalizationLeaf;
        // Template: mark all as seen
        markAllAsSeen: LiteralLocalizationLeaf;
      };
      section: {
        // Template: Notifications in other contexts
        otherContexts: LiteralLocalizationLeaf;
      };
      // Template: Notifications
      title: LiteralLocalizationLeaf;
    };
    OfficeList: {
      action: {
        // Template: ADM
        adm: LiteralLocalizationLeaf;
        // Template: GOV
        gov: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Location
        address: LiteralLocalizationLeaf;
        // Template: End
        end: LiteralLocalizationLeaf;
        // Template: Role
        role: LiteralLocalizationLeaf;
      };
    };
    OfficeType: {
      // Template: Governor
      GOVERNOR: LiteralLocalizationLeaf;
      // Template: Member of Parliament
      MEMBER_OF_PARLIAMENT: LiteralLocalizationLeaf;
    };
    Offices: {
      header: {
        // Template: Current offices
        current: LiteralLocalizationLeaf;
        // Template: Past offices
        past: LiteralLocalizationLeaf;
        // Template: Current runs
        runs: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Location
        address: LiteralLocalizationLeaf;
        // Template: Election ends
        end: LiteralLocalizationLeaf;
      };
    };
    OfficesPanel: {
      context: {
        // Template: User information
        user: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No user for input '{input}'.
        id: {
          getFormat: () => IntlMessageFormat;
          message: (options: { input: string }) => string;
        };
      };
      // Template: Offices {name}
      title: {
        // Template: Offices
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    OrderSlot: {
      // Template: {amount} {amount, plural, one {unit} other {units}}
      output: {
        getFormat: () => IntlMessageFormat;
        message: (options: { amount: number }) => string;
      };
    };
    OrderStatus: {
      // Template: no capacity
      capacity: LiteralLocalizationLeaf;
      // Template: funds missing
      funds: LiteralLocalizationLeaf;
      // Template: halted
      halted: LiteralLocalizationLeaf;
      // Template: input missing
      input: LiteralLocalizationLeaf;
      // Template: {completed, number, style: 'percent'} done
      progress: {
        getFormat: () => IntlMessageFormat;
        message: (options: { completed: string | number }) => string;
      };
      // Template: recurring
      recurring: LiteralLocalizationLeaf;
    };
    OrderStatusLabel: {
      // Template: created
      CREATED: LiteralLocalizationLeaf;
      // Template: deleted
      DELETED: LiteralLocalizationLeaf;
      // Template: filled
      FILLED: LiteralLocalizationLeaf;
      // Template: partially filled
      PARTIALLY_FILLED: LiteralLocalizationLeaf;
      // Template: placed
      PLACED: LiteralLocalizationLeaf;
    };
    OrderTypeLabel: {
      // Template: BUY
      BUYING: LiteralLocalizationLeaf;
      // Template: SELL
      SELLING: LiteralLocalizationLeaf;
    };
    Overlay: {
      // Template: get PRO
      action: LiteralLocalizationLeaf;
      // Template: Designing and building additional ships
      feature1: LiteralLocalizationLeaf;
      // Template: Posting and accepting local market ads
      feature2: LiteralLocalizationLeaf;
      // Template: Recurring, sortable production orders
      feature3: LiteralLocalizationLeaf;
      // Template: Custom contracts with other players
      feature4: LiteralLocalizationLeaf;
      // Template: A handy building repair assistant
      feature5: LiteralLocalizationLeaf;
      // Template: A PRO license is available from $8 a month and is automatically converted to a BASIC license once it runs out, retaining the ability for you to accept other players' local market ads and contract offers.
      footer: LiteralLocalizationLeaf;
      // Template: Thank you for playing Prosperous Universe!{linebreak}We hope you're enjoying your time in APEX!
      heading1: {
        getFormat: () => IntlMessageFormat;
        message: (options: { linebreak: string }) => string;
      };
      // Template: DID YOU KNOW?{linebreak}With a PRO license you have access to many more advanced features of APEX, such as:
      heading2: {
        getFormat: () => IntlMessageFormat;
        message: (options: { linebreak: string }) => string;
      };
    };
    PanelSelector: {
      input: {
        // Template: Enter content command
        placeholder: LiteralLocalizationLeaf;
      };
    };
    ParliamentRole: {
      role: {
        // Template: Governor
        governor: LiteralLocalizationLeaf;
        // Template: Member of Parliament
        memberOfParliament: LiteralLocalizationLeaf;
      };
    };
    PaymentConditionEditForm: {
      form: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Currency
        currency: LiteralLocalizationLeaf;
      };
    };
    PayoutComponent: {
      action: {
        // Template: cancel
        cancel: LiteralLocalizationLeaf;
        // Template: save
        save: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Currency
        currency: LiteralLocalizationLeaf;
        // Template: Recipient
        recipient: LiteralLocalizationLeaf;
      };
    };
    PendingContractsTable: {
      action: {
        // Template: view
        view: LiteralLocalizationLeaf;
      };
    };
    PendingInvitesContainer: {
      action: {
        // Template: accept
        accept: LiteralLocalizationLeaf;
        // Template: reject
        reject: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Capital Contribution
        contribution: LiteralLocalizationLeaf;
        // Template: Corporation
        corporation: LiteralLocalizationLeaf;
        // Template: No pending invitations at the moment.
        empty: LiteralLocalizationLeaf;
        // Template: Received
        received: LiteralLocalizationLeaf;
        // Template: Shares
        shares: LiteralLocalizationLeaf;
      };
    };
    Performance: {
      label: {
        // Template: Acceleration (max)
        accelerationMax: LiteralLocalizationLeaf;
        // Template: Cargo capacity
        cargoCapacity: LiteralLocalizationLeaf;
        // Template: FTL speed (max)
        ftlSpeedMax: LiteralLocalizationLeaf;
        // Template: G-factor (max)
        maxGFactor: LiteralLocalizationLeaf;
        // Template: Operating empty mass
        operatingEmptyMass: LiteralLocalizationLeaf;
        // Template: Volume
        volume: LiteralLocalizationLeaf;
      };
      value: {
        // Template: {value}m/s²
        accelerationMax: {
          getFormat: () => IntlMessageFormat;
          message: (options: { value: string }) => string;
        };
        // Template: {weight}t / {volume}m³
        cargoCapacity: {
          getFormat: () => IntlMessageFormat;
          message: (options: { weight: string; volume: string }) => string;
        };
        // Template: {value}parsec/h
        ftlSpeedMax: {
          getFormat: () => IntlMessageFormat;
          message: (options: { value: string }) => string;
        };
        // Template: {value}t
        operatingEmptyMass: {
          getFormat: () => IntlMessageFormat;
          message: (options: { value: string }) => string;
        };
        // Template: {value}m³
        volume: {
          getFormat: () => IntlMessageFormat;
          message: (options: { value: string }) => string;
        };
      };
    };
    PickupConditionEditorForm: {
      form: {
        // Template: Address
        address: LiteralLocalizationLeaf;
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Material
        material: LiteralLocalizationLeaf;
      };
    };
    PlanetInfoMapContainer: {
      // Template: Hint: Right click and drag to rotate
      help: LiteralLocalizationLeaf;
      ownSite: {
        // Template: Start Base
        start: LiteralLocalizationLeaf;
        // Template: View base
        view: LiteralLocalizationLeaf;
      };
    };
    PlanetInfoPanel: {
      context: {
        // Template: Fleet
        fleet: LiteralLocalizationLeaf;
        // Template: Inventory
        inventory: LiteralLocalizationLeaf;
        // Template: Local Rules
        localrules: LiteralLocalizationLeaf;
        // Template: Population report
        populationreport: LiteralLocalizationLeaf;
        // Template: Planetary Projects
        projects: LiteralLocalizationLeaf;
        // Template: System Information
        systemInformation: LiteralLocalizationLeaf;
        // Template: System Map
        systemMap: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No planet found.
        planetId: LiteralLocalizationLeaf;
      };
      label: {
        data: {
          // Template: Environment
          environment: LiteralLocalizationLeaf;
          // Template: Soil fertility
          fertility: LiteralLocalizationLeaf;
          // Template: Infrastructure
          infrastructure: LiteralLocalizationLeaf;
          // Template: Available plots
          plots: LiteralLocalizationLeaf;
          // Template: Planetary projects
          projects: LiteralLocalizationLeaf;
          // Template: Radius
          radius: LiteralLocalizationLeaf;
          // Template: Resources
          resources: LiteralLocalizationLeaf;
          // Template: Type
          type: LiteralLocalizationLeaf;
        };
        // Template: Faction affinity
        faction: LiteralLocalizationLeaf;
        // Template: Government
        government: {
          // Template: Government of {planet}
          content: {
            getFormat: () => IntlMessageFormat;
            message: (options: { planet: string }) => string;
          };
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Named by
        naming: LiteralLocalizationLeaf;
        // Template: Catalog ID
        naturalId: LiteralLocalizationLeaf;
        // Template: Planet
        planet: LiteralLocalizationLeaf;
        // Template: Workforce population
        population: LiteralLocalizationLeaf;
      };
      // Template: Planet Info: {name}
      title: {
        // Template: Planet Search
        list: LiteralLocalizationLeaf;
        // Template: Planet Info: loading…
        loading: LiteralLocalizationLeaf;
        // Template: Planet Info: not found…
        notfound: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    PlanetInformation: {
      // Template: plots available
      ghostPlots: LiteralLocalizationLeaf;
      info: {
        // Template: Fertility affects how efficient farms are at the production of agricultural commodities. Infertile planets cannot produce any agricultural products without advanced buildings.
        fertility: LiteralLocalizationLeaf;
        // Template: Some planets already have a certain infrastructure set up to improve production facilities. The Chamber of Global Commerce for example is run collaboratively by the inhabitants on a planet and can speed up production significantly.
        infrastructure: LiteralLocalizationLeaf;
        // Template: Planets are divided into areas called plots and each plot can hold a base. The amount of plots gives you an indication of how much competition from other entrepreneurs there is on this planet but also how many potential customers reside here.
        plots: LiteralLocalizationLeaf;
        // Template: A list of the natural resources of this planet. Everything else has to be bought on the commodity exchanges.
        resources: LiteralLocalizationLeaf;
      };
      label: {
        faction: {
          // Template: States to which faction's sphere of influence the planet belongs. Planets in faction space have to follow stricter rules than non-faction planets, for example fees will always be levied in the faction's currency.
          info: LiteralLocalizationLeaf;
        };
        // Template: Soil fertility
        fertility: {
          // Template: Fertility affects how efficient farms are at the production of agricultural commodities. Infertile planets cannot produce any agricultural products without advanced buildings.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        government: {
          // Template: Links to the current government of the planet.
          info: LiteralLocalizationLeaf;
        };
        // Template: Infrastructure
        infrastructure: LiteralLocalizationLeaf;
        naming: {
          // Template: Certain tiers of APEX PRO licenses include the right to name a planet.
          info: LiteralLocalizationLeaf;
        };
        // Template: Available plots
        plots: LiteralLocalizationLeaf;
        // Template: Resources
        resources: {
          // Template: The natural resources available on this planet. The bars indicate how efficiently a resource can be extracted.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Type
        type: {
          // Template: The environmental conditions determine whether a planet is habitable or not. Extreme conditions require special building materials.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        workforce: {
          // Template: The cumulative workforce population.
          info: LiteralLocalizationLeaf;
        };
      };
      // Template: {namer} {time}
      named: {
        getFormat: () => IntlMessageFormat;
        message: (options: { namer: string; time: string }) => string;
      };
      naming: {
        // Template: Name this planet
        name: LiteralLocalizationLeaf;
      };
      // Template: --
      noData: LiteralLocalizationLeaf;
      // Template: {free} / {plots}
      plots: {
        getFormat: () => IntlMessageFormat;
        message: (options: { free: string; plots: string }) => string;
      };
      type: {
        // Template: Planet
        planet: LiteralLocalizationLeaf;
        // Template: Station
        station: LiteralLocalizationLeaf;
      };
      // Template: -- {button}
      unnamed: {
        getFormat: () => IntlMessageFormat;
        message: (options: { button: string }) => string;
      };
    };
    PlanetType: {
      // Template: Gaseous
      noSurface: LiteralLocalizationLeaf;
      // Template: Rocky
      surface: LiteralLocalizationLeaf;
    };
    PlanetaryProjectEntry: {
      // Template: contribute
      contribute: LiteralLocalizationLeaf;
      // Template: details
      details: LiteralLocalizationLeaf;
    };
    PlanetaryProjectPanel: {
      button: {
        // Template: contribute
        contribution: LiteralLocalizationLeaf;
        open: {
          // Template: Planetary Administration Center
          adm: LiteralLocalizationLeaf;
          // Template: Chamber of Global Commerce
          cogc: LiteralLocalizationLeaf;
          // Template: Local Market
          locm: LiteralLocalizationLeaf;
          // Template: Infrastructure
          pop: LiteralLocalizationLeaf;
          // Template: Shipyard
          shy: LiteralLocalizationLeaf;
          // Template: Warehouse
          war: LiteralLocalizationLeaf;
        };
      };
      contribute: {
        // Template: You need a base on the planet to be able to contribute.
        error: LiteralLocalizationLeaf;
      };
      // Template: The Chamber of Global Commerce has not been finished yet. You can contribute towards its completion by contributing building materials.
      contribution: LiteralLocalizationLeaf;
      error: {
        // Template: No project found.
        planetId: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Bill of material
        billOfMaterial: LiteralLocalizationLeaf;
        // Template: Constructed
        constructionDate: LiteralLocalizationLeaf;
        // Template: Project
        project: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
      };
      // Template: Project:
      project: LiteralLocalizationLeaf;
      section: {
        // Template: Contribute
        contribute: LiteralLocalizationLeaf;
        // Template: Contributions
        contributions: LiteralLocalizationLeaf;
      };
      status: {
        // Template: in construction
        inConstruction: LiteralLocalizationLeaf;
        // Template: operational
        operational: LiteralLocalizationLeaf;
      };
      // Template: Planetary project @ {name}
      title: {
        // Template: Planetary project: loading…
        loading: LiteralLocalizationLeaf;
        // Template: Planetary project: not found…
        notFound: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    PlanetaryProjects: {
      // Template: Planetary Administration Center
      ADM: {
        // Template: The Administration Center allows to hold elections for a planetary government. The government can set taxes and fees like a production fee for example. Every one can run for office, but only site owners can vote for a candidate.
        description: LiteralLocalizationLeaf;
        // Template: ADM
        ticker: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Chamber of Global Commerce
      COGC: {
        // Template: Orchestrates the planet-wide execution of industrial support and advertisement programs.
        description: LiteralLocalizationLeaf;
        // Template: CoGC
        ticker: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Commodity Exchange
      CX: {
        // Template: A public, escrow based trading platform for all kinds of commodities.
        description: LiteralLocalizationLeaf;
        // Template: CX
        ticker: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Local Market
      LOCM: {
        // Template: A simple, unregulated, bulletin board style market place.
        description: LiteralLocalizationLeaf;
        // Template: LOCM
        ticker: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Population Infrastructure
      POP: {
        // Template: This planetary project is a collection of all infrastructure projects that are relevant for the local population.
        description: LiteralLocalizationLeaf;
        // Template: POP
        ticker: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Shipyard
      SHY: {
        // Template: A public shipyard to build ships of any type or size.
        description: LiteralLocalizationLeaf;
        // Template: SHY
        ticker: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Warehouse
      WAR: {
        // Template: An extendable warehouse facility where companies can rent storage units.
        description: LiteralLocalizationLeaf;
        // Template: WAR
        ticker: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
    };
    PlanetaryProjectsPanel: {
      context: {
        // Template: Planet
        planet: LiteralLocalizationLeaf;
        // Template: Planetary Projects
        projects: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No projects found.
        planetId: LiteralLocalizationLeaf;
      };
      // Template: Planetary projects @ {name}
      title: {
        // Template: Planetary projects: loading…
        loading: LiteralLocalizationLeaf;
        // Template: Planetary projects: not found…
        notFound: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    PlotSelectionMapContainer: {
      // Template: Select a plot on the surface or use a {random}!
      action: {
        getFormat: () => IntlMessageFormat;
        message: (options: { random: string }) => string;
      };
      button: {
        // Template: random plot
        random: LiteralLocalizationLeaf;
        // Template: Change selection
        select: LiteralLocalizationLeaf;
      };
    };
    Population: {
      report: {
        action: {
          // Template: next
          next: LiteralLocalizationLeaf;
          // Template: prev
          prev: LiteralLocalizationLeaf;
        };
        // Template: Change
        change: LiteralLocalizationLeaf;
        // Template: Comfort
        comfort: LiteralLocalizationLeaf;
        // Template: Culture
        culture: LiteralLocalizationLeaf;
        // Template: Report #{period} / {time}
        current: {
          getFormat: () => IntlMessageFormat;
          message: (options: { period: string; time: string }) => string;
        };
        // Template: Education
        education: LiteralLocalizationLeaf;
        // Template: Education (in/out)
        educationInOut: LiteralLocalizationLeaf;
        // Template: Engineers
        engineers: LiteralLocalizationLeaf;
        // Template: Happiness
        happiness: LiteralLocalizationLeaf;
        // Template: Health
        health: LiteralLocalizationLeaf;
        // Template: Life support
        lifeSupport: LiteralLocalizationLeaf;
        // Template:
        metric: LiteralLocalizationLeaf;
        // Template: Migration
        migration: LiteralLocalizationLeaf;
        // Template: Population
        nextPopulation: LiteralLocalizationLeaf;
        // Template: Open jobs
        openJobs: LiteralLocalizationLeaf;
        // Template: Pioneers
        pioneers: LiteralLocalizationLeaf;
        // Template: Safety
        safety: LiteralLocalizationLeaf;
        // Template: Scientists
        scientists: LiteralLocalizationLeaf;
        // Template: Settlers
        settler: LiteralLocalizationLeaf;
        // Template: {in} / {sign}{out}
        shift: {
          getFormat: () => IntlMessageFormat;
          message: (options: { in: string; sign: string; out: string }) => string;
        };
        // Template: Technicians
        technicians: LiteralLocalizationLeaf;
        // Template: Unemployment
        unemployment: LiteralLocalizationLeaf;
      };
      section: {
        // Template: Government program
        governmentProgram: LiteralLocalizationLeaf;
        // Template: Need fulfillment
        needFulfillment: LiteralLocalizationLeaf;
      };
    };
    PopulationChartContainer: {
      error: {
        // Template: Graph unavailable
        noData: LiteralLocalizationLeaf;
      };
    };
    PopulationInfrastructure: {
      buttons: {
        // Template: details
        details: LiteralLocalizationLeaf;
      };
      projects: {
        // Template: Built
        built: LiteralLocalizationLeaf;
        // Template: Cmds
        cmds: LiteralLocalizationLeaf;
        // Template: Current
        current: {
          // Template: The level currently in use per infrastructure can be controlled by the government to be lower than the maximum level built, for example to save on upkeep resources.
          description: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Upgrade
        progress: LiteralLocalizationLeaf;
        // Template: Upkeep
        upkeep: LiteralLocalizationLeaf;
      };
    };
    PopulationInfrastructureComponent: {
      label: {
        // Template: Infrastructure levels
        infrastructure: LiteralLocalizationLeaf;
      };
      setting: {
        // Template: max
        max: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Current
        active: LiteralLocalizationLeaf;
        // Template: Infrastructure
        infrastructure: LiteralLocalizationLeaf;
        // Template: Target
        target: LiteralLocalizationLeaf;
      };
    };
    PopulationInfrastructureContainer: {
      error: {
        // Template: No population infrastructure found.
        noreport: LiteralLocalizationLeaf;
      };
    };
    PopulationInfrastructurePanel: {
      context: {
        // Template: Local Rules
        localRules: LiteralLocalizationLeaf;
        // Template: Planet
        planet: LiteralLocalizationLeaf;
        // Template: Population report
        report: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No planet found.
        planetId: LiteralLocalizationLeaf;
      };
      // Template: Population Infrastructure @ {name}
      title: {
        // Template: PopulationReport: loading…
        loading: LiteralLocalizationLeaf;
        // Template: PopulationReport: not found…
        notfound: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    PopulationInfrastructureProject: {
      form: {
        // Template: Built
        built: LiteralLocalizationLeaf;
        // Template: Current
        current: LiteralLocalizationLeaf;
        // Template: Description
        description: LiteralLocalizationLeaf;
        // Template: The maximum level for this infrastructure project has been reached.
        maxupgrade: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Upgrade costs
        upgradeCosts: LiteralLocalizationLeaf;
        // Template: Upgrade status
        upgradeStatus: LiteralLocalizationLeaf;
      };
      section: {
        // Template: Recent contributions by contributor
        contributions: LiteralLocalizationLeaf;
        // Template: Upgrade
        upgrade: LiteralLocalizationLeaf;
        // Template: Upkeep
        upkeep: LiteralLocalizationLeaf;
      };
    };
    PopulationInfrastructureProjectContainer: {
      error: {
        // Template: Population infrastructure project not found.
        noproject: LiteralLocalizationLeaf;
      };
    };
    PopulationInfrastructureProjectPanel: {
      action: {
        // Template: contribute
        contribute: {
          // Template: Do you really want to invest commodities into planet infrastructure? This is typically handled by the planet's government or companies it partnered with.
          confirmation: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
      context: {
        // Template: Planet
        planet: LiteralLocalizationLeaf;
        // Template: Population infrastructure
        populationinfrastructure: LiteralLocalizationLeaf;
        // Template: Population report
        report: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No planet found.
        planetId: LiteralLocalizationLeaf;
      };
      // Template: Infrastructure {type} @ {name}
      title: {
        // Template: PopulationReport: loading…
        loading: LiteralLocalizationLeaf;
        // Template: PopulationReport: not found…
        notfound: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { type: string; name: string }) => string;
      };
    };
    PopulationNeedsTable: {
      // Template: Need fulfillment
      NEED_FULFILLMENT: LiteralLocalizationLeaf;
      // Template: The percentage of the fulfillment of basic population needs.
      NEED_FULFILLMENT_DESCRIPTION: LiteralLocalizationLeaf;
    };
    PopulationReportContainer: {
      error: {
        // Template: No population reports found.
        noreport: LiteralLocalizationLeaf;
      };
    };
    PopulationReportInfo: {
      // Template: The change in workforce compared to the last week (positive: growth, negative: decline).
      CHANGE: LiteralLocalizationLeaf;
      // Template: The number of workers that transitioned from a lower tier into the current tier and the ones that transitioned to a higher (can be increased via educational infrastructure).
      EDUCATION: LiteralLocalizationLeaf;
      // Template: Newly found populations benefit for several weeks from the 'Explorer's Grace' effect and are happier in general.
      EXPLORERS_GRACE: LiteralLocalizationLeaf;
      // Template: The current total happiness of each workforce tier. Happiness is increased by providing need-fulfilling infrastructure and open jobs. The population grows when happiness is over 70% and declines if below 50%
      HAPPINESS: LiteralLocalizationLeaf;
      // Template: The number of workers that migrated to the planet or left it (due to their tiers happiness).
      MIGRATION: LiteralLocalizationLeaf;
      // Template: The percentage of the fulfillment of basic population needs.
      NEED_FULFILLMENT: LiteralLocalizationLeaf;
      // Template: The amount of available jobs not filled by the current population.
      OPEN_JOBS: LiteralLocalizationLeaf;
      // Template: The amount of workers of each workforce tier currently inhabiting the planet.
      POPULATION: LiteralLocalizationLeaf;
      // Template: The rate of workers of each workforce tier that had no job.
      UNEMPLOYMENT: LiteralLocalizationLeaf;
    };
    PopulationReportPanel: {
      context: {
        // Template: Planet
        planet: LiteralLocalizationLeaf;
        // Template: Population infrastructure
        populationInfrastructure: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No planet found.
        planetId: LiteralLocalizationLeaf;
      };
      // Template: Population Report @ {name}
      title: {
        // Template: Population Report: loading…
        loading: LiteralLocalizationLeaf;
        // Template: Population Report: not found…
        notfound: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    PrivateChannelMembershipPanel: {
      // Template: Conversation {name}
      title: {
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    Production: {
      context: {
        // Template: Base
        base: LiteralLocalizationLeaf;
        // Template: Create Order
        createOrder: LiteralLocalizationLeaf;
        // Template: All Production Lines
        overview: LiteralLocalizationLeaf;
        // Template: Queue
        queue: LiteralLocalizationLeaf;
        // Template: Local Production Lines
        site: LiteralLocalizationLeaf;
      };
    };
    // Template: {category} / {workforce}
    ProductionFeeForm: {
      action: {
        // Template: edit
        edit: LiteralLocalizationLeaf;
      };
      getFormat: () => IntlMessageFormat;
      message: (options: { category: string; workforce: string }) => string;
    };
    ProductionFeeTable: {
      cell: {
        // Template: {value} ({sign}{change})
        valueWithChange: {
          getFormat: () => IntlMessageFormat;
          message: (options: { value: string; sign: string; change: string }) => string;
        };
      };
    };
    ProductionLine: {
      efficiencyFactors: {
        // Template: {name} Experts
        experts: {
          getFormat: () => IntlMessageFormat;
          message: (options: { name: string }) => string;
        };
      };
      error: {
        templates: {
          // Template: This production line is unable to produce anything at this location.
          empty: LiteralLocalizationLeaf;
        };
      };
      form: {
        // Template: Duration
        duration: LiteralLocalizationLeaf;
        efficiency: {
          // Template: Efficiency Factors
          factors: LiteralLocalizationLeaf;
          // Template: Overall Efficiency
          total: LiteralLocalizationLeaf;
        };
        // Template: Order Size
        factor: LiteralLocalizationLeaf;
        // Template: Location
        location: LiteralLocalizationLeaf;
        // Template: Note
        note: LiteralLocalizationLeaf;
        // Template: Product filter
        product: LiteralLocalizationLeaf;
        // Template: Production Line
        productionLine: LiteralLocalizationLeaf;
        // Template: Production Fee
        productionfee: LiteralLocalizationLeaf;
        // Template: Production template
        recipe: LiteralLocalizationLeaf;
        // Template: Recurring
        recurring: LiteralLocalizationLeaf;
        // Template: Since this is your first production order, the duration will be reduced to {reducedDuration}. Normally this order would take {duration} to complete. Use the time until your first production order finishes to look around and familiarize yourself with APEX.
        reducedDuration: {
          getFormat: () => IntlMessageFormat;
          message: (options: { reducedDuration: string; duration: string }) => string;
        };
        // Template: Queue Order
        submit: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Recurring order
        recurring: {
          // Template: A recurring order gets re-queued as soon as it starts. Requires a PRO license.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
      // Template: {fee} {linebreak} collected by {collector}
      productionfee: {
        getFormat: () => IntlMessageFormat;
        message: (options: { fee: string; linebreak: string; collector: string }) => string;
      };
    };
    ProductionLinePanel: {
      error: {
        // Template: Production line not found.
        productionLineId: LiteralLocalizationLeaf;
      };
      // Template: {line} @ {address}
      title: {
        // Template: Production Line
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { line: string; address: string }) => string;
      };
    };
    ProductionLines: {
      // Template: You have no production facilities at the moment.
      empty: LiteralLocalizationLeaf;
      link: {
        // Template: Order
        order: LiteralLocalizationLeaf;
        // Template: Queue
        queue: LiteralLocalizationLeaf;
      };
      // Template: {active} / {total}
      slots: {
        getFormat: () => IntlMessageFormat;
        message: (options: { active: string; total: string }) => string;
      };
      table: {
        header: {
          // Template: Efficiency
          efficiency: LiteralLocalizationLeaf;
          // Template: Planet
          planet: LiteralLocalizationLeaf;
          // Template: Slots
          slots: LiteralLocalizationLeaf;
        };
      };
    };
    ProductionPanel: {
      error: {
        // Template: Production location not found.
        siteId: LiteralLocalizationLeaf;
      };
      // Template: {name} Production Lines
      title: {
        // Template: Production
        loading: LiteralLocalizationLeaf;
        // Template: Production
        sites: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    ProductionQueue: {
      // Template: New Order
      createOrder: LiteralLocalizationLeaf;
      figures: {
        // Template: Active Orders
        capacity: {
          // Template: {active} / {capacity}
          amount: {
            getFormat: () => IntlMessageFormat;
            message: (options: { active: string; capacity: string }) => string;
          };
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Current Efficiency
        efficiency: LiteralLocalizationLeaf;
        // Template: Production Line Condition
        productionLineCondition: LiteralLocalizationLeaf;
        // Template: Queued Orders
        slots: {
          // Template: {queued} / {slots}
          amount: {
            getFormat: () => IntlMessageFormat;
            message: (options: { queued: string; slots: string }) => string;
          };
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
      // Template: {available} / {amount}
      materialAvailability: {
        getFormat: () => IntlMessageFormat;
        message: (options: { available: string; amount: string }) => string;
      };
      // Template: {amount} {name}
      materialquantity: {
        getFormat: () => IntlMessageFormat;
        message: (options: { amount: string; name: string }) => string;
      };
      orders: {
        // Template: Active
        active: LiteralLocalizationLeaf;
        // Template: Queued
        queued: LiteralLocalizationLeaf;
      };
      table: {
        // Template: cancel
        cancel: LiteralLocalizationLeaf;
        // Template: Completion / Duration
        completion: LiteralLocalizationLeaf;
        // Template: Fee
        fee: LiteralLocalizationLeaf;
        // Template: Input
        input: LiteralLocalizationLeaf;
        // Template: ▼
        moveDown: LiteralLocalizationLeaf;
        // Template: ▲
        moveUp: LiteralLocalizationLeaf;
        // Template: Output
        output: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
      };
    };
    ProductionQueuePanel: {
      action: {
        // Template: Cancel order
        cancel: LiteralLocalizationLeaf;
        // Template: Cancelling a running production order cannot be undone. Only the following materials and fees will be reclaimed/produced:
        confirmation: LiteralLocalizationLeaf;
        // Template: Reimbursed production fees:
        fees: LiteralLocalizationLeaf;
        // Template: Reimbursed input materials:
        inputmaterials: LiteralLocalizationLeaf;
        // Template: Produced materials:
        outputmaterials: LiteralLocalizationLeaf;
      };
      // Template: Production order cancelled.
      cancelled: LiteralLocalizationLeaf;
      error: {
        // Template: Production line not found.
        productionLineId: LiteralLocalizationLeaf;
      };
      // Template: {line} Queue @ {location}
      title: {
        // Template: Production Queue
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { line: string; location: string }) => string;
      };
    };
    Program: {
      // Template: Advanced Education I
      EDUCATION_1: {
        // Template: Multiply the rate of workers who level up a tier by 150% for one week via concentrated educational efforts.
        description: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Advanced Education II
      EDUCATION_2: {
        // Template: Multiply the rate of workers who level up a tier by 175% for one week via concentrated educational efforts.
        description: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Advanced Education III
      EDUCATION_3: {
        // Template: Multiply the rate of workers who level up a tier by 200% for one week via concentrated educational efforts.
        description: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Family Support I
      FAMILY_SUPPORT_1: {
        // Template: Increase the natural growth of Pioneers, Settlers and Technicians by 10% for one week by offering benefits for families.
        description: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Family Support II
      FAMILY_SUPPORT_2: {
        // Template: Increase the natural growth of Pioneers, Settlers and Technicians by 15% for one week by offering benefits for families.
        description: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Family Support III
      FAMILY_SUPPORT_3: {
        // Template: Increase the natural growth of Pioneers, Settlers and Technicians by 25% for one week by offering benefits for families.
        description: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Planetary Festivities I
      FESTIVITIES_1: {
        // Template: Increase the happiness of all workers by 5% for one week by hosting a variety of amusement festivities.
        description: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Planetary Festivities II
      FESTIVITIES_2: {
        // Template: Increase the happiness of all workers by 10% for one week by hosting a variety of amusement festivities.
        description: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Planetary Festivities III
      FESTIVITIES_3: {
        // Template: Increase the happiness of all workers by 20% for one week by hosting a variety of amusement festivities.
        description: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Engineer Immigration
      IMMIGRATION_ENGINEER: {
        // Template: Attract 50 new engineers to the planet via targeted immigration support efforts.
        description: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Pioneer Immigration
      IMMIGRATION_PIONEER: {
        // Template: Attract 500 new pioneers to the planet via targeted immigration support efforts.
        description: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Scientist Immigration
      IMMIGRATION_SCIENTIST: {
        // Template: Attract 25 new scientists to the planet via targeted immigration support efforts.
        description: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Settler Immigration
      IMMIGRATION_SETTLER: {
        // Template: Attract 200 new settlers to the planet via targeted immigration support efforts.
        description: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Technician Immigration
      IMMIGRATION_TECHNICIAN: {
        // Template: Attract 100 new technicians to the planet via targeted immigration support efforts.
        description: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
    };
    ProgressBar: {
      // Template: {value} / {maximum}
      value: {
        getFormat: () => IntlMessageFormat;
        message: (options: { value: string; maximum: string }) => string;
      };
    };
    ProjectStatus: {
      // Template: built
      BUILT: LiteralLocalizationLeaf;
      // Template: created
      CREATED: LiteralLocalizationLeaf;
      // Template: started
      STARTED: LiteralLocalizationLeaf;
    };
    Prompt: {
      placeholder: {
        // Template: You have been banned from this channel. The ban ends at {date} {time}.
        banned: {
          getFormat: () => IntlMessageFormat;
          message: (options: { date: string; time: string }) => string;
        };
        // Template: Enter a message…
        _default: LiteralLocalizationLeaf;
        // Template: You have been muted!
        muted: LiteralLocalizationLeaf;
      };
    };
    ProvisionCondition: {
      // Template: Provisioning of {amount, number} {amount, plural, one {unit} other {units}} of {material} @ {address}
      content: {
        getFormat: () => IntlMessageFormat;
        message: (options: { amount: number; material: string; address: string }) => string;
      };
    };
    ProvisionConditionEditForm: {
      form: {
        // Template: Address
        address: LiteralLocalizationLeaf;
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Material
        material: LiteralLocalizationLeaf;
      };
    };
    PublicChannelMembershipPanel: {
      title: {
        // Template: Public Channel {identifier}
        _default: LiteralLocalizationLeaf;
      };
    };
    // Template: APEX Representation Center
    REPRESENTATION_CENTER: LiteralLocalizationLeaf;
    RangeSelector: {
      label: {
        // Template: 180 days
        days_180: LiteralLocalizationLeaf;
        // Template: 30 days
        days_30: LiteralLocalizationLeaf;
        // Template: 7 days
        days_7: LiteralLocalizationLeaf;
        // Template: 90 days
        days_90: LiteralLocalizationLeaf;
      };
    };
    RatingInfo: {
      // Template: Based on {count} contracts over the last {days}.
      details: {
        getFormat: () => IntlMessageFormat;
        message: (options: { count: string; days: string }) => string;
      };
    };
    ReachableSystems: {
      table: {
        // Template: Cmds
        commands: LiteralLocalizationLeaf;
        // Template: Distance
        distance: LiteralLocalizationLeaf;
        // Template: System
        system: LiteralLocalizationLeaf;
      };
    };
    Reactor: {
      // Template: Produces advanced appliances, often used in space ships and space stations.
      advancedAppliancesFactory_description: LiteralLocalizationLeaf;
      // Template: Advanced Appliances Factory
      advancedAppliancesFactory_name: LiteralLocalizationLeaf;
      // Template: Refines intermediate rare materials into more usable forms.
      advancedMaterialLab_description: LiteralLocalizationLeaf;
      // Template: Advanced Material Lab
      advancedMaterialLab_name: LiteralLocalizationLeaf;
      // Template: Allows for the creation of high-performance metal alloys.
      advancedSmelter_description: LiteralLocalizationLeaf;
      // Template: High-Power Blast Furnace
      advancedSmelter_name: LiteralLocalizationLeaf;
      // Template: Produces large appliances, often used in space ships and space stations.
      appliancesFactory_description: LiteralLocalizationLeaf;
      // Template: Appliances Factory
      appliancesFactory_name: LiteralLocalizationLeaf;
      // Template: Produces a host of materials and end products needed to bootstrap a colony.
      basicMaterialsPlant_description: LiteralLocalizationLeaf;
      // Template: Basic Materials Plant
      basicMaterialsPlant_name: LiteralLocalizationLeaf;
      // Template: Produces various chemical compounds and immediate products.
      chemPlant_description: LiteralLocalizationLeaf;
      // Template: Chemical Plant
      chemPlant_name: LiteralLocalizationLeaf;
      // Template: Produces integrated circuits and basic computer parts.
      cleanRoom_description: LiteralLocalizationLeaf;
      // Template: Cleanroom
      cleanRoom_name: LiteralLocalizationLeaf;
      // Template: Manufactures textiles from different fibers, used in clothing and even ship construction.
      clothingFactory_description: LiteralLocalizationLeaf;
      // Template: Textile Manufacturing
      clothingFactory_name: LiteralLocalizationLeaf;
      // Template: Extracts gases from the atmosphere.
      collector_description: LiteralLocalizationLeaf;
      // Template: Collector
      collector_name: LiteralLocalizationLeaf;
      // Template: The basic module and life support necessary to start a new base on a planet.
      coreModule_description: LiteralLocalizationLeaf;
      // Template: Core Module
      coreModule_name: LiteralLocalizationLeaf;
      // Template: NO FUNCTIONALITY - Prestige Building
      corporationProjectFTLLaboratory_description: LiteralLocalizationLeaf;
      // Template: Corporation FTL Laboratory
      corporationProjectFTLLaboratory_name: LiteralLocalizationLeaf;
      // Template: The physical headquarter of any corporation, running basic administrative functions.
      corporationProjectHeadquarters_description: LiteralLocalizationLeaf;
      // Template: Corporation Headquarters
      corporationProjectHeadquarters_name: LiteralLocalizationLeaf;
      // Template: NO FUNCTIONALITY - Prestige Building
      corporationProjectImmortality_description: LiteralLocalizationLeaf;
      // Template: Corporate Immortality Center
      corporationProjectImmortality_name: LiteralLocalizationLeaf;
      // Template: The APEX representation center allows corporations to donate some of their profits to the APEX foundation. The foundation uses the money to supply new and upcoming CEOs with the necessary capital and ships to start their entrepreneurial journey. Having a high representation level is widely recognized as a testimony of wealth and success.
      corporationProjectRepresentationCenter_description: LiteralLocalizationLeaf;
      // Template: APEX Representation Center
      corporationProjectRepresentationCenter_name: LiteralLocalizationLeaf;
      // Template: NO FUNCTIONALITY - Prestige Building
      corporationProjectTerraforming_description: LiteralLocalizationLeaf;
      // Template: Corporate Terraformer
      corporationProjectTerraforming_name: LiteralLocalizationLeaf;
      // Template: The place where all things drones are put together.
      droneShop_description: LiteralLocalizationLeaf;
      // Template: Drone Shop
      droneShop_name: LiteralLocalizationLeaf;
      // Template: Specialized plant that turns Liquid Einsteinium into its more usable, stabilized form.
      einsteiniumEnrichmentPlant_description: LiteralLocalizationLeaf;
      // Template: Einsteinium Enrichment
      einsteiniumEnrichmentPlant_name: LiteralLocalizationLeaf;
      // Template: Manufactures a variety of small end-user-ready devices.
      electronicDeviceManufactory_description: LiteralLocalizationLeaf;
      // Template: Electronic Device Manufactory
      electronicDeviceManufactory_name: LiteralLocalizationLeaf;
      // Template: Uses basic computer parts to manufacture larger computers and control units.
      electronicsPlant_description: LiteralLocalizationLeaf;
      // Template: Electronics Plant
      electronicsPlant_name: LiteralLocalizationLeaf;
      // Template: Creates energy supply systems and devices of all kinds.
      energyComponentAssembly_description: LiteralLocalizationLeaf;
      // Template: Energy Component Assembly
      energyComponentAssembly_name: LiteralLocalizationLeaf;
      // Template: Extracts ores and minerals from the surface.
      extractor_description: LiteralLocalizationLeaf;
      // Template: Extractor
      extractor_name: LiteralLocalizationLeaf;
      // Template: Produces agricultural products like grains and soy. Needs fertile soil.
      farm_description: LiteralLocalizationLeaf;
      // Template: Farmstead
      farm_name: LiteralLocalizationLeaf;
      // Template: Creates those beverages that make life in space just a little bit more bearable.
      fermentationFacility_description: LiteralLocalizationLeaf;
      // Template: Fermenter
      fermentationFacility_name: LiteralLocalizationLeaf;
      // Template: Produces the often unnoticed small, metal pieces that make up the core of many installations.
      fineSmithy_description: LiteralLocalizationLeaf;
      // Template: Metalist Studio
      fineSmithy_name: LiteralLocalizationLeaf;
      // Template: Uses agricultural products to produce edible consumables.
      foodProcessor_description: LiteralLocalizationLeaf;
      // Template: Food Processor
      foodProcessor_name: LiteralLocalizationLeaf;
      // Template: Creates different glasses and other sturdy materials at very high temperatures.
      glassFurnace_description: LiteralLocalizationLeaf;
      // Template: Glass Furnace
      glassFurnace_name: LiteralLocalizationLeaf;
      // Template: Offers housing for 75 pioneers and 75 settlers.
      habitationBarracks_description: LiteralLocalizationLeaf;
      // Template: Barracks
      habitationBarracks_name: LiteralLocalizationLeaf;
      // Template: Offers housing for 75 settlers and 75 technicians.
      habitationCommune_description: LiteralLocalizationLeaf;
      // Template: Communal Abode
      habitationCommune_name: LiteralLocalizationLeaf;
      // Template: Offers housing for 100 engineers.
      habitationEngineer_description: LiteralLocalizationLeaf;
      // Template: Engineer Habitation
      habitationEngineer_name: LiteralLocalizationLeaf;
      // Template: Offers housing for 75 engineers and 75 scientists.
      habitationLuxury_description: LiteralLocalizationLeaf;
      // Template: Luxury Residence
      habitationLuxury_name: LiteralLocalizationLeaf;
      // Template: Offers housing for 75 technicians and 75 engineers.
      habitationManagers_description: LiteralLocalizationLeaf;
      // Template: Management Domicile
      habitationManagers_name: LiteralLocalizationLeaf;
      // Template: Offers housing for 100 pioneers.
      habitationPioneer_description: LiteralLocalizationLeaf;
      // Template: Pioneer Habitation
      habitationPioneer_name: LiteralLocalizationLeaf;
      // Template: Offers housing for 100 scientists.
      habitationScientist_description: LiteralLocalizationLeaf;
      // Template: Scientist Habitation
      habitationScientist_name: LiteralLocalizationLeaf;
      // Template: Offers housing for 100 settlers.
      habitationSettler_description: LiteralLocalizationLeaf;
      // Template: Settler Habitation
      habitationSettler_name: LiteralLocalizationLeaf;
      // Template: Offers housing for 100 technicians.
      habitationTechnician_description: LiteralLocalizationLeaf;
      // Template: Technician Habitation
      habitationTechnician_name: LiteralLocalizationLeaf;
      // Template: Creates a variety of ship hull plates and shields.
      hullWeldingPlant_description: LiteralLocalizationLeaf;
      // Template: Hull Welding Plant
      hullWeldingPlant_name: LiteralLocalizationLeaf;
      // Template: Produces agricultural products like hydrocarbon plants. Does not need fertile soil but lots of water.
      hydroponicsFarm_description: LiteralLocalizationLeaf;
      // Template: Hydroponics Farm
      hydroponicsFarm_name: LiteralLocalizationLeaf;
      // Template: Deals with the creation of artificial life and meat products.
      inVitroPlant_description: LiteralLocalizationLeaf;
      // Template: In-Vitro Plant
      inVitroPlant_name: LiteralLocalizationLeaf;
      // Template: Turns organically grown plants into life's most basic resource, Carbon.
      incinerator_description: LiteralLocalizationLeaf;
      // Template: Incinerator
      incinerator_name: LiteralLocalizationLeaf;
      // Template: Advanced laboratory that deals in more complex chemical reactions.
      laboratory_description: LiteralLocalizationLeaf;
      // Template: Laboratory
      laboratory_name: LiteralLocalizationLeaf;
      // Template: Assembles technical pieces into larger parts, ready to be used in many devices.
      mediumComponentsAssembly_description: LiteralLocalizationLeaf;
      // Template: Medium Components Assembly
      mediumComponentsAssembly_name: LiteralLocalizationLeaf;
      // Template: A specialized farm that produces high-maintenance fruits for high-end consumables.
      orchard_description: LiteralLocalizationLeaf;
      // Template: Orchard
      orchard_name: LiteralLocalizationLeaf;
      // Template: Turns out bundles of items are more efficient to move around in space than individual items!
      packagingCenter_description: LiteralLocalizationLeaf;
      // Template: Packaging Center
      packagingCenter_name: LiteralLocalizationLeaf;
      // Template: A versatile factory equipped to produce medication as well as curative support products.
      pharmaFactory_description: LiteralLocalizationLeaf;
      // Template: Pharma Factory
      pharmaFactory_name: LiteralLocalizationLeaf;
      // Template: The Administration Center allows to hold elections for a planetary governor. The governor can set taxes and fees like a production fee for example. Every site owner has the right to vote, but votes can also be acquired by completing tasks set up by the Exodus Council.
      planetaryProjectAdminCenter_description: LiteralLocalizationLeaf;
      // Template: Administration Center
      planetaryProjectAdminCenter_name: LiteralLocalizationLeaf;
      // Template: Allows for the communal implementation of industrial support programs.
      planetaryProjectCogc_description: LiteralLocalizationLeaf;
      // Template: Chamber of Global Commerce
      planetaryProjectCogc_name: LiteralLocalizationLeaf;
      // Template: Provides a large amount of comfort.
      planetaryProjectComfortBig_description: LiteralLocalizationLeaf;
      // Template: 4D Arcades
      planetaryProjectComfortBig_name: LiteralLocalizationLeaf;
      // Template: Provides a small amount of comfort and culture.
      planetaryProjectComfortCulture_description: LiteralLocalizationLeaf;
      // Template: Art Café
      planetaryProjectComfortCulture_name: LiteralLocalizationLeaf;
      // Template: Provides a small amount of comfort.
      planetaryProjectComfortSmall_description: LiteralLocalizationLeaf;
      // Template: Wildlife Park
      planetaryProjectComfortSmall_name: LiteralLocalizationLeaf;
      // Template: Provides a large amount of culture.
      planetaryProjectCultureBig_description: LiteralLocalizationLeaf;
      // Template: VR Theater
      planetaryProjectCultureBig_name: LiteralLocalizationLeaf;
      // Template: Provides a small amount of culture and education.
      planetaryProjectCultureEducation_description: LiteralLocalizationLeaf;
      // Template: Planetary Broadcasting Hub
      planetaryProjectCultureEducation_name: LiteralLocalizationLeaf;
      // Template: Provides a small amount of culture.
      planetaryProjectCultureSmall_description: LiteralLocalizationLeaf;
      // Template: Art Gallery
      planetaryProjectCultureSmall_name: LiteralLocalizationLeaf;
      // Template: Provides a large amount of education.
      planetaryProjectEducationBig_description: LiteralLocalizationLeaf;
      // Template: University
      planetaryProjectEducationBig_name: LiteralLocalizationLeaf;
      // Template: Provides a small amount of education.
      planetaryProjectEducationSmall_description: LiteralLocalizationLeaf;
      // Template: Library
      planetaryProjectEducationSmall_name: LiteralLocalizationLeaf;
      // Template: Provides a large amount of health.
      planetaryProjectHealthBig_description: LiteralLocalizationLeaf;
      // Template: Hospital
      planetaryProjectHealthBig_name: LiteralLocalizationLeaf;
      // Template: Provides a small amount of health and comfort.
      planetaryProjectHealthComfort_description: LiteralLocalizationLeaf;
      // Template: Wellness Center
      planetaryProjectHealthComfort_name: LiteralLocalizationLeaf;
      // Template: Provides a small amount of health.
      planetaryProjectHealthSmall_description: LiteralLocalizationLeaf;
      // Template: Infirmary
      planetaryProjectHealthSmall_name: LiteralLocalizationLeaf;
      // Template: A simple, unregulated, bulletin board style market place.
      planetaryProjectLocalMarket_description: LiteralLocalizationLeaf;
      // Template: Local Market
      planetaryProjectLocalMarket_name: LiteralLocalizationLeaf;
      // Template: This planetary project is a collection of all infrastructure projects that are relevant for the local population
      planetaryProjectPopulation_description: LiteralLocalizationLeaf;
      // Template: Population Infrastructure
      planetaryProjectPopulation_name: LiteralLocalizationLeaf;
      // Template: Provides a large amount of safety.
      planetaryProjectSafetyBig_description: LiteralLocalizationLeaf;
      // Template: Security Drone Post
      planetaryProjectSafetyBig_name: LiteralLocalizationLeaf;
      // Template: Provides a small amount of safety and health.
      planetaryProjectSafetyHealth_description: LiteralLocalizationLeaf;
      // Template: Emergency Center
      planetaryProjectSafetyHealth_name: LiteralLocalizationLeaf;
      // Template: Provides a small amount of safety.
      planetaryProjectSafetySmall_description: LiteralLocalizationLeaf;
      // Template: Safety Station
      planetaryProjectSafetySmall_name: LiteralLocalizationLeaf;
      // Template: Bring your blueprints and materials here to build new ships.
      planetaryProjectShipyard_description: LiteralLocalizationLeaf;
      // Template: Planetary Shipyard
      planetaryProjectShipyard_name: LiteralLocalizationLeaf;
      // Template: Offers storage space for rent without the need to own a local site.
      planetaryProjectWarehouse_description: LiteralLocalizationLeaf;
      // Template: Planetary Warehouse
      planetaryProjectWarehouse_name: LiteralLocalizationLeaf;
      // Template: Prints objects out of plastic pellets.
      plasticsPrinterFacility_description: LiteralLocalizationLeaf;
      // Template: 3D Printer
      plasticsPrinterFacility_name: LiteralLocalizationLeaf;
      // Template: Chemical plant that turns basic elements into flexible polymers, used in all stages of technology.
      polymerPlant_description: LiteralLocalizationLeaf;
      // Template: Polymer Plant
      polymerPlant_name: LiteralLocalizationLeaf;
      // Template: Produces basic prefabs necessary to construct buildings.
      prefabPlant1_description: LiteralLocalizationLeaf;
      // Template: Prefab Plant MK1
      prefabPlant1_name: LiteralLocalizationLeaf;
      // Template: Produces lightweight prefabs necessary to construct buildings.
      prefabPlant2_description: LiteralLocalizationLeaf;
      // Template: Prefab Plant MK2
      prefabPlant2_name: LiteralLocalizationLeaf;
      // Template: Produces reinforced prefabs necessary to construct buildings.
      prefabPlant3_description: LiteralLocalizationLeaf;
      // Template: Prefab Plant MK3
      prefabPlant3_name: LiteralLocalizationLeaf;
      // Template: Produces advanced prefabs necessary to construct buildings.
      prefabPlant4_description: LiteralLocalizationLeaf;
      // Template: Prefab Plant MK4
      prefabPlant4_name: LiteralLocalizationLeaf;
      // Template: Produces fuels used for space flight.
      refinery_description: LiteralLocalizationLeaf;
      // Template: Refinery
      refinery_name: LiteralLocalizationLeaf;
      // Template: Extracts liquid resources.
      rig_description: LiteralLocalizationLeaf;
      // Template: Rig
      rig_name: LiteralLocalizationLeaf;
      // Template: A factory where all kinds of standardized cargo bay and fuel tank kits are put together.
      shipKitFactory_description: LiteralLocalizationLeaf;
      // Template: Ship Kit Factory
      shipKitFactory_name: LiteralLocalizationLeaf;
      // Template: Assembles technical pieces into smaller parts, ready to be used in many devices.
      smallComponentsAssembly_description: LiteralLocalizationLeaf;
      // Template: Small Components Assembly
      smallComponentsAssembly_name: LiteralLocalizationLeaf;
      // Template: Produces metals from ores.
      smelter_description: LiteralLocalizationLeaf;
      // Template: Smelter
      smelter_name: LiteralLocalizationLeaf;
      // Template: Here basic software components are being developed for use in more complex tools and systems.
      softwareDevelopment_description: LiteralLocalizationLeaf;
      // Template: Software Development
      softwareDevelopment_name: LiteralLocalizationLeaf;
      // Template: Basic software components are combined into tools that can be applied in a variety of devices or used as parts of more complex systems.
      softwareEngineering_description: LiteralLocalizationLeaf;
      // Template: Software Engineering
      softwareEngineering_name: LiteralLocalizationLeaf;
      // Template: Architects form more advanced software applications from basic algorithms and tools for use in high-end devices.
      softwareLabs_description: LiteralLocalizationLeaf;
      // Template: Software Labs
      softwareLabs_name: LiteralLocalizationLeaf;
      // Template: A creation facility for all kinds of kits and standardized spaceship components.
      spacecraftPrefabPlant_description: LiteralLocalizationLeaf;
      // Template: Spacecraft Prefab Plant
      spacecraftPrefabPlant_name: LiteralLocalizationLeaf;
      // Template: Produces anything necessary to move a spaceship, i.e. all kinds of STL engines and FTL reactors.
      spacecraftPropulsionFactory_description: LiteralLocalizationLeaf;
      // Template: Spacecraft Propulsion Factory
      spacecraftPropulsionFactory_name: LiteralLocalizationLeaf;
      // Template: A large-scale storage facility that increases the capacity by 10000t / 10000m³.
      storageBig_description: LiteralLocalizationLeaf;
      // Template: Expansive Storage
      storageBig_name: LiteralLocalizationLeaf;
      // Template: Increases the storage capacity by 5000t / 5000m³.
      storageFacility_description: LiteralLocalizationLeaf;
      // Template: Storage Facility
      storageFacility_name: LiteralLocalizationLeaf;
      // Template: A small-scale storage facility that increases the capacity by 2500t / 2500m³.
      storageSmall_description: LiteralLocalizationLeaf;
      // Template: Auxiliary Storage
      storageSmall_name: LiteralLocalizationLeaf;
      // Template: A volume-specialized form of storage that increases the capacity by 2500t / 7500m³.
      storageVolume_description: LiteralLocalizationLeaf;
      // Template: Volume Storage
      storageVolume_name: LiteralLocalizationLeaf;
      // Template: A weight-specialized form of storage that increases the capacity by 7500t / 2500m³.
      storageWeight_description: LiteralLocalizationLeaf;
      // Template: Weight Storage
      storageWeight_name: LiteralLocalizationLeaf;
      // Template: Processes basic Technetium into a more stable configuration of the element.
      technetiumProcessing_description: LiteralLocalizationLeaf;
      // Template: Technetium Processing
      technetiumProcessing_name: LiteralLocalizationLeaf;
      // Template: Produces building units ready to be used as parts of bigger construction projects.
      unitPrefabPlant_description: LiteralLocalizationLeaf;
      // Template: Unit Prefab Plant
      unitPrefabPlant_name: LiteralLocalizationLeaf;
      // Template: Creates the most basic fabrics from fibers.
      weavingPlant_description: LiteralLocalizationLeaf;
      // Template: Weaving Plant
      weavingPlant_name: LiteralLocalizationLeaf;
      // Template: Creates a diverse set of metal products used in construction and device manufacturing.
      weldingPlant_description: LiteralLocalizationLeaf;
      // Template: Welding Plant
      weldingPlant_name: LiteralLocalizationLeaf;
    };
    Recommendation: {
      // Template: bad
      _1: LiteralLocalizationLeaf;
      // Template: not ideal
      _2: LiteralLocalizationLeaf;
      // Template: okay
      _3: LiteralLocalizationLeaf;
      // Template: good
      _4: LiteralLocalizationLeaf;
      // Template: great
      _5: LiteralLocalizationLeaf;
      // Template: {stars} ({label})
      stars: {
        getFormat: () => IntlMessageFormat;
        message: (options: { stars: string; label: string }) => string;
      };
      // Template: Profession suitability indicates how well the planet is suited for the profession you chose. Note that factors like competition is not factored in, so the highest value might not always the best choice.
      suitability: LiteralLocalizationLeaf;
    };
    RecommendedStarterBuildings: {
      buttons: {
        // Template: Construct
        construct: LiteralLocalizationLeaf;
      };
      // Template: You have chosen the {profession} profession. In general, APEX recommends to get started by building the following initial buildings.
      text: {
        getFormat: () => IntlMessageFormat;
        message: (options: { profession: string }) => string;
      };
      // Template: In some circumstances it might make sense to deviate from this recommendation. Make sure to double check the planetary conditions and resource availability.
      text2: LiteralLocalizationLeaf;
      // Template: In case of a mistake, there is a one hour grace period in which you can reclaim all the building materials when demolishing it.
      text3: LiteralLocalizationLeaf;
      // Template: Click construct to get started!
      text4: LiteralLocalizationLeaf;
    };
    RecommendedStarterBuildingsPanel: {
      // Template: Recommended starter buildings
      title: LiteralLocalizationLeaf;
    };
    RelativeTime: {
      // Template: in {time}
      future: {
        getFormat: () => IntlMessageFormat;
        message: (options: { time: string }) => string;
      };
      // Template: now
      now: LiteralLocalizationLeaf;
      // Template: {time} ago
      past: {
        getFormat: () => IntlMessageFormat;
        message: (options: { time: string }) => string;
      };
    };
    RepresentationCenter: {
      action: {
        // Template: contribute
        contribute: LiteralLocalizationLeaf;
        // Template: set
        set: LiteralLocalizationLeaf;
      };
      context: {
        // Template: Headquarters
        headquarters: LiteralLocalizationLeaf;
        // Template: Bases
        sites: LiteralLocalizationLeaf;
      };
      contributions: {
        // Template: Contribution
        contribution: LiteralLocalizationLeaf;
        // Template: Contributor
        contributor: LiteralLocalizationLeaf;
        // Template: Time
        time: LiteralLocalizationLeaf;
      };
      form: {
        // Template: Cost next level
        costNextLevel: LiteralLocalizationLeaf;
        // Template: Left for next level
        left: LiteralLocalizationLeaf;
        // Template: Level
        level: LiteralLocalizationLeaf;
        // Template: Progress
        progress: LiteralLocalizationLeaf;
        section: {
          // Template: Contributions
          contributions: LiteralLocalizationLeaf;
          // Template: Next Level
          next: LiteralLocalizationLeaf;
        };
        // Template: Total contributions
        totalContributions: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Contribution
        contribution: LiteralLocalizationLeaf;
        // Template: {left} {set}
        left: {
          getFormat: () => IntlMessageFormat;
          message: (options: { left: string; set: string }) => string;
        };
        // Template: Note that increasing your ARC level has no effect except making for a more and more impressive representation of your economic success.
        level: LiteralLocalizationLeaf;
        // Template: {contributed} / {cost}
        progress: {
          getFormat: () => IntlMessageFormat;
          message: (options: { contributed: string; cost: string }) => string;
        };
      };
      // Template: APEX Representation Center
      title: LiteralLocalizationLeaf;
    };
    ReputationTable: {
      // Template: {entity} - {reputation}
      entity: {
        getFormat: () => IntlMessageFormat;
        message: (options: { entity: string; reputation: string }) => string;
      };
    };
    ResourceType: {
      // Template: Atmospheric
      gaseous: LiteralLocalizationLeaf;
      // Template: Liquid
      liquid: LiteralLocalizationLeaf;
      // Template: Mineral
      mineral: LiteralLocalizationLeaf;
    };
    ResourcesTable: {
      tooltip: {
        // Template: The number indicates the daily yield of the resource, given a single resource building running at 100% efficiency.
        _yield: LiteralLocalizationLeaf;
      };
    };
    Restriction: {
      // Template: Access restricted
      headline: LiteralLocalizationLeaf;
      // Template: Access to this command is restricted. Click to learn how to get access.
      _message: LiteralLocalizationLeaf;
    };
    RestrictionBanner: {
      // Template: Some settings in this command are limited. Click to learn how to get full access.
      _message: LiteralLocalizationLeaf;
    };
    Role: {
      // Template: Borrower
      BORROWER: LiteralLocalizationLeaf;
      // Template: Lender
      LENDER: LiteralLocalizationLeaf;
    };
    RoutePreferencesSelect: {
      label: {
        // Template: Use gateways
        useGateways: LiteralLocalizationLeaf;
      };
      value: {
        // Template: least jumps
        leastJumps: LiteralLocalizationLeaf;
        // Template: shortest FTL route
        shortestFTL: LiteralLocalizationLeaf;
      };
    };
    ScreenControls: {
      action: {
        // Template: ADD
        add: LiteralLocalizationLeaf;
        // Template: cpy
        copy: LiteralLocalizationLeaf;
        // Template: del
        _delete: LiteralLocalizationLeaf;
        // Template: FULL
        fullscreen: LiteralLocalizationLeaf;
        // Template: undo delete
        undoDelete: LiteralLocalizationLeaf;
      };
      // Template: SCRN: {name}
      screenName: {
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
      // Template: SCRN
      title: LiteralLocalizationLeaf;
    };
    Screens: {
      action: {
        // Template: Rename
        rename: LiteralLocalizationLeaf;
      };
      actions: {
        // Template: Add
        addVariable: LiteralLocalizationLeaf;
        // Template: remove
        removeVariable: LiteralLocalizationLeaf;
      };
      header: {
        // Template: Add Screen Variable
        add: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Screen Variables
        variables: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Options (CSV)
        options: LiteralLocalizationLeaf;
        // Template: Screen
        screen: LiteralLocalizationLeaf;
        // Template: Name
        variableName: LiteralLocalizationLeaf;
        // Template: Type
        variableType: LiteralLocalizationLeaf;
      };
      table: {
        // Template: No screen variables defined
        empty: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Type
        type: LiteralLocalizationLeaf;
        // Template: Value
        value: LiteralLocalizationLeaf;
      };
    };
    ScreensPanel: {
      // Template: Screens
      title: LiteralLocalizationLeaf;
    };
    SectionList: {
      // Template: demolish
      demolish: LiteralLocalizationLeaf;
      // Template: Infrastructure
      infrastructure: LiteralLocalizationLeaf;
      // Template: Production
      production: LiteralLocalizationLeaf;
      // Template: repair
      repair: LiteralLocalizationLeaf;
      // Template: Resources
      resources: LiteralLocalizationLeaf;
      section: {
        // Template: Book value
        bookValue: LiteralLocalizationLeaf;
        // Template: Condition
        condition: LiteralLocalizationLeaf;
        // Template: Established
        established: LiteralLocalizationLeaf;
        // Template: Last repair
        lastRepair: LiteralLocalizationLeaf;
        // Template: Reclaimable materials
        reclaimableMaterials: LiteralLocalizationLeaf;
        // Template: Repair costs
        repairMaterials: {
          // Template: Repair materials have to be available in the base's own storage.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
    };
    SectionListPanel: {
      action: {
        // Template: Demolishing the {name} cannot be undone. Only the displayed materials will be reclaimed.
        confirmation: {
          getFormat: () => IntlMessageFormat;
          message: (options: { name: string }) => string;
        };
        // Template: Demolish
        demolish: LiteralLocalizationLeaf;
      };
      error: {
        // Template: Base not found.
        siteId: LiteralLocalizationLeaf;
      };
      // Template: Buildings: {name}
      title: {
        // Template: Buildings
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    SectionType: {
      // Template: Engineers
      ENGINEER: LiteralLocalizationLeaf;
      // Template: Infrastructure
      INFRASTRUCTURE: LiteralLocalizationLeaf;
      // Template: Pioneers
      PIONEER: LiteralLocalizationLeaf;
      // Template: Resources
      RESOURCES: LiteralLocalizationLeaf;
      // Template: Scientists
      SCIENTIST: LiteralLocalizationLeaf;
      // Template: Settlers
      SETTLER: LiteralLocalizationLeaf;
      // Template: Technicians
      TECHNICIAN: LiteralLocalizationLeaf;
    };
    SelectInput: {
      // Template: select one
      emptyLabel: LiteralLocalizationLeaf;
      // Template: select one
      nullLabel: LiteralLocalizationLeaf;
    };
    SelectionList: {
      section: {
        condition: {
          // Template: {condition}%
          value: {
            getFormat: () => IntlMessageFormat;
            message: (options: { condition: string }) => string;
          };
        };
      };
    };
    Sender: {
      // Template: [{link}]
      label: {
        getFormat: () => IntlMessageFormat;
        message: (options: { link: string }) => string;
      };
      // Template: {corp} {user}
      name: {
        getFormat: () => IntlMessageFormat;
        message: (options: { corp: string; user: string }) => string;
      };
    };
    ServerNotification: {
      action: {
        // Template: x
        close: LiteralLocalizationLeaf;
      };
      label: {
        // Template: See {link} for more information.
        info: {
          getFormat: () => IntlMessageFormat;
          message: (options: { link: string }) => string;
        };
        // Template: ({countdown})
        time: {
          getFormat: () => IntlMessageFormat;
          message: (options: { countdown: string }) => string;
        };
      };
    };
    Settings: {
      arrow: {
        // Template: ◀
        left: LiteralLocalizationLeaf;
        // Template: ▶
        right: LiteralLocalizationLeaf;
      };
    };
    ShareholderContext: {
      context: {
        // Template: Com Channel
        com: LiteralLocalizationLeaf;
        // Template: Corporation
        corporation: LiteralLocalizationLeaf;
        // Template: Finances
        finance: LiteralLocalizationLeaf;
        // Template: Pending Invites
        invites: LiteralLocalizationLeaf;
        project: {
          // Template: New project
          _new: LiteralLocalizationLeaf;
        };
        // Template: Projects
        projects: LiteralLocalizationLeaf;
      };
    };
    ShareholderCorporation: {
      header: {
        // Template: Infrastructure
        infrastructure: LiteralLocalizationLeaf;
        // Template: Shareholders
        shareholders: LiteralLocalizationLeaf;
      };
      info: {
        // Template: Currency
        currency: LiteralLocalizationLeaf;
        // Template: Faction
        faction: LiteralLocalizationLeaf;
        // Template: Founded
        founded: LiteralLocalizationLeaf;
        // Template: Headquarters
        headquarters: LiteralLocalizationLeaf;
        // Template: Shares
        shares: LiteralLocalizationLeaf;
      };
      primaryHolding: {
        // Template: Leave
        leave: LiteralLocalizationLeaf;
      };
      shareholder: {
        // Template: Company
        company: LiteralLocalizationLeaf;
        // Template: Joined
        joined: LiteralLocalizationLeaf;
        // Template: {x} %
        relativeShare: {
          getFormat: () => IntlMessageFormat;
          message: (options: { x: string }) => string;
        };
        // Template: Shares
        shares: LiteralLocalizationLeaf;
      };
    };
    ShareholderCorporationFinancePanel: {
      // Template: Corporation finances
      title: LiteralLocalizationLeaf;
    };
    Ship: {
      action: {
        // Template: repair
        repair: LiteralLocalizationLeaf;
      };
      header: {
        // Template: Status
        Status: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Blueprint
        blueprint: LiteralLocalizationLeaf;
        // Template: Cargo Hold
        cargohold: LiteralLocalizationLeaf;
        // Template: Commissioned
        commissioned: LiteralLocalizationLeaf;
        // Template: Condition
        condition: LiteralLocalizationLeaf;
        // Template: Fuel Tanks
        fueltanks: LiteralLocalizationLeaf;
        // Template: Operating empty mass
        operatingEmptyMass: LiteralLocalizationLeaf;
        // Template: FTL operating time
        operatingTimeFtl: LiteralLocalizationLeaf;
        // Template: STL operating time
        operatingTimeStl: LiteralLocalizationLeaf;
        // Template: Project History
        projectHistory: LiteralLocalizationLeaf;
        // Template: Repair costs
        repairCost: LiteralLocalizationLeaf;
        // Template: Type
        type: LiteralLocalizationLeaf;
        // Template: Volume
        volume: LiteralLocalizationLeaf;
      };
      // Template: {mass}t
      operatingEmptyMass: {
        getFormat: () => IntlMessageFormat;
        message: (options: { mass: string }) => string;
      };
      // Template: {blueprint} @ {shipyard}
      projecthistory: {
        getFormat: () => IntlMessageFormat;
        message: (options: { blueprint: string; shipyard: string }) => string;
      };
      // Template: {registration} / {name}
      registrationAndName: {
        getFormat: () => IntlMessageFormat;
        message: (options: { registration: string; name: string }) => string;
      };
      // Template: {volume}m³
      volume: {
        getFormat: () => IntlMessageFormat;
        message: (options: { volume: string }) => string;
      };
    };
    ShipFlightControl: {
      button: {
        // Template: abort
        abortFlight: LiteralLocalizationLeaf;
        // Template: start
        startFlight: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Location
        address: LiteralLocalizationLeaf;
        // Template: Condition
        condition: {
          // Template: Ships take attrition damage from space flight, meteoroids and extreme environmental conditions. Below a condition of 80% ships start getting slower. You can repair ships from their SHP command (just click their transponder code or name).
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Destination
        destination: LiteralLocalizationLeaf;
        // Template: Fuel
        fuel: LiteralLocalizationLeaf;
        // Template: Fuel usage
        fuelUsage: LiteralLocalizationLeaf;
        // Template: Inventory
        inventory: LiteralLocalizationLeaf;
        // Template: Surface landing
        landing: LiteralLocalizationLeaf;
        // Template: Mass / Empty mass
        mass: LiteralLocalizationLeaf;
        // Template: Note
        note: LiteralLocalizationLeaf;
        // Template: Origin
        origin: LiteralLocalizationLeaf;
        // Template: Reachable systems
        reachableSystems: LiteralLocalizationLeaf;
        // Template: Reactor usage
        reactorUsage: LiteralLocalizationLeaf;
        // Template: Route preferences
        routePreferences: LiteralLocalizationLeaf;
        // Template: Ship
        ship: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
        // Template: Landing
        surface: LiteralLocalizationLeaf;
        // Template: Destination
        target: LiteralLocalizationLeaf;
        // Template: Unload on arrival
        unload: {
          // Template: Setting this option will automatically unload your ship's cargo to a fixed storage location at the destination (ie base or warehouse store). This option requires a PRO license.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Unload on arrival
        unloading: LiteralLocalizationLeaf;
      };
      text: {
        // Template: Since this is your first flight the duration will be significantly reduced. Depending on the distance and fuel usage flights normally take many hours. Use the time until your first flight arrives to look around and familiarize yourself with APEX.
        reducedFlightTimes: LiteralLocalizationLeaf;
      };
    };
    ShipFuel: {
      fuel: {
        // Template: {current}/{max}
        ftl: {
          getFormat: () => IntlMessageFormat;
          message: (options: { current: string; max: string }) => string;
        };
        // Template: {current}/{max}
        stl: {
          getFormat: () => IntlMessageFormat;
          message: (options: { current: string; max: string }) => string;
        };
      };
    };
    ShipFuelInventory: {
      // Template: FTL fuel tank
      ftl: LiteralLocalizationLeaf;
      // Template: STL fuel tank
      stl: LiteralLocalizationLeaf;
    };
    ShipFuelInventoryPanel: {
      context: {
        // Template: Ship Flight Control
        shipFlightControl: LiteralLocalizationLeaf;
        // Template: Ship Info
        shipInformation: LiteralLocalizationLeaf;
        // Template: Ship Inventory
        shipInventory: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No ship found.
        shipId: LiteralLocalizationLeaf;
      };
      // Template: {name} ({reg})
      title: {
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string; reg: string }) => string;
      };
    };
    ShipInformationPanel: {
      // Template: Commissioned
      commissioned: LiteralLocalizationLeaf;
      error: {
        // Template: No ship found.
        shipId: LiteralLocalizationLeaf;
      };
      // Template: Manufacturer
      manufacturer: LiteralLocalizationLeaf;
      // Template: Operator
      operator: LiteralLocalizationLeaf;
      // Template: {name} ({reg})
      title: {
        // Template: Ship
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string; reg: string }) => string;
      };
    };
    ShipInventoryPanel: {
      context: {
        // Template: Ship Flight Control
        shipFlightControl: LiteralLocalizationLeaf;
        // Template: Ship Fuel
        shipFuel: LiteralLocalizationLeaf;
        // Template: Ship Info
        shipInformation: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No ship found.
        shipId: LiteralLocalizationLeaf;
      };
      // Template: {name} ({reg})
      title: {
        // Template: Ship
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string; reg: string }) => string;
      };
    };
    ShipPanel: {
      error: {
        // Template: No ship found.
        shipId: LiteralLocalizationLeaf;
      };
      // Template: {name} ({reg})
      title: {
        // Template: Ship
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string; reg: string }) => string;
      };
    };
    ShipStatus: {
      // Template: approaching
      approach: LiteralLocalizationLeaf;
      // Template: charging
      charge: LiteralLocalizationLeaf;
      // Template: waiting for decay
      decay: LiteralLocalizationLeaf;
      // Template: departing
      departure: LiteralLocalizationLeaf;
      // Template: floating
      float: LiteralLocalizationLeaf;
      // Template: jumping
      jump: LiteralLocalizationLeaf;
      // Template: jumping gateway
      jumpgateway: LiteralLocalizationLeaf;
      // Template: landing
      landing: LiteralLocalizationLeaf;
      // Template: waiting for lock
      lock: LiteralLocalizationLeaf;
      // Template: taking off
      takeoff: LiteralLocalizationLeaf;
      // Template: in transit
      transit: LiteralLocalizationLeaf;
    };
    ShipStore: {
      // Template: {weight}t/{volume}m³
      capacities: {
        getFormat: () => IntlMessageFormat;
        message: (options: { weight: string; volume: string }) => string;
      };
      // Template: {current}t/{max}t
      weight: {
        getFormat: () => IntlMessageFormat;
        message: (options: { current: string; max: string }) => string;
      };
    };
    ShipType: {
      // Template: Colony ship
      COLONY_SHIP: LiteralLocalizationLeaf;
      // Template: Freighter
      REGULAR: LiteralLocalizationLeaf;
    };
    ShipmentDeliveryCondition: {
      content: {
        // Template: Deliver shipment @ {address}
        own: {
          getFormat: () => IntlMessageFormat;
          message: (options: { address: string }) => string;
        };
      };
    };
    ShipmentPickUpCondition: {
      content: {
        // Template: Pick up shipment @ {address}
        other: {
          getFormat: () => IntlMessageFormat;
          message: (options: { address: string }) => string;
        };
        // Template: Pick up shipment ({weight}t / {volume}m³) @ {address}
        own: {
          getFormat: () => IntlMessageFormat;
          message: (options: { weight: string; volume: string; address: string }) => string;
        };
      };
    };
    ShipmentProvisionCondition: {
      content: {
        // Template: Provisioning of shipment @ {address} {autoprovision}
        other: {
          getFormat: () => IntlMessageFormat;
          message: (options: { address: string; autoprovision: string }) => string;
        };
        // Template: Provisioning of {amount, number} {amount, plural, one {unit} other {units}} of {material} @ {address} {autoprovision}
        own: {
          getFormat: () => IntlMessageFormat;
          message: (options: {
            amount: number;
            material: string;
            address: string;
            autoprovision: string;
          }) => string;
        };
      };
    };
    Ships: {
      action: {
        // Template: unload
        unload: LiteralLocalizationLeaf;
      };
    };
    Shipyard: {
      action: {
        // Template: Create project
        create: LiteralLocalizationLeaf;
      };
      context: {
        // Template: Blueprint Flight Simulator
        blueprintFlightSimulator: LiteralLocalizationLeaf;
        // Template: Blueprints
        blueprints: LiteralLocalizationLeaf;
        // Template: Planet
        planet: LiteralLocalizationLeaf;
        // Template: Shipyard Projects
        shipyard: LiteralLocalizationLeaf;
        // Template: Project
        shipyardProject: LiteralLocalizationLeaf;
        // Template: Shipyard Projects
        shipyardProjects: LiteralLocalizationLeaf;
      };
      error: {
        // Template: Error loading shipyard.
        id: LiteralLocalizationLeaf;
      };
      header: {
        // Template: Start a shipbuilding project
        project: LiteralLocalizationLeaf;
        // Template: Own shipbuilding projects
        projects: LiteralLocalizationLeaf;
        // Template: Start a ship upgrade project
        upgradeProject: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Projects
        activeProjects: LiteralLocalizationLeaf;
        // Template: Location
        address: LiteralLocalizationLeaf;
        // Template: Blueprint
        blueprint: LiteralLocalizationLeaf;
        // Template: Finished projects
        finishedProjects: LiteralLocalizationLeaf;
        // Template: Finished projects (month)
        finishedProjectsMonth: LiteralLocalizationLeaf;
        // Template: Finished projects (180d)
        finishedProjectsSemiannualy: LiteralLocalizationLeaf;
        // Template: Finished projects (week)
        finishedProjectsWeek: LiteralLocalizationLeaf;
        // Template: Projects in construction
        inConstruction: LiteralLocalizationLeaf;
        // Template: Operator
        operator: LiteralLocalizationLeaf;
        // Template: Origin Blueprint
        originBlueprint: LiteralLocalizationLeaf;
        // Template: Target Blueprint
        targetBlueprint: LiteralLocalizationLeaf;
      };
      projects: {
        actions: {
          // Template: delete
          _delete: LiteralLocalizationLeaf;
          // Template: View
          view: LiteralLocalizationLeaf;
        };
        header: {
          // Template: Blueprint
          blueprint: LiteralLocalizationLeaf;
          // Template: Cmds
          cmds: LiteralLocalizationLeaf;
          // Template: Created
          created: LiteralLocalizationLeaf;
          // Template: Status
          status: LiteralLocalizationLeaf;
        };
      };
      title: {
        // Template: Shipyards
        all: LiteralLocalizationLeaf;
      };
    };
    ShipyardPanel: {
      create: {
        action: {
          // Template: Creating a shipbuilding project will lock the corresponding blueprint permanently.
          confirmation: LiteralLocalizationLeaf;
          // Template: create project
          submit: LiteralLocalizationLeaf;
        };
      };
      createUpgrade: {
        action: {
          // Template: Creating a upgrade project will lock the target blueprint permanently.
          confirmation: LiteralLocalizationLeaf;
          // Template: create project
          submit: LiteralLocalizationLeaf;
        };
      };
      error: {
        // Template: Could not find shipyard at {input}
        notfound: {
          getFormat: () => IntlMessageFormat;
          message: (options: { input: string }) => string;
        };
      };
      // Template: Shipyard
      title: {
        // Template: Shipyards
        all: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
    };
    ShipyardProject: {
      action: {
        // Template: start
        start: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No shipyard project found!
        noProject: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Ship to upgrade
        ShipToUpgrade: LiteralLocalizationLeaf;
        // Template: Blueprint
        blueprint: LiteralLocalizationLeaf;
        // Template: Created
        created: LiteralLocalizationLeaf;
        // Template: Built
        end: LiteralLocalizationLeaf;
        // Template: Origin Blueprint
        originBlueprint: LiteralLocalizationLeaf;
        // Template: Ship
        ship: LiteralLocalizationLeaf;
        // Template: Shipyard
        shipyard: LiteralLocalizationLeaf;
        // Template: Started
        start: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
      };
      section: {
        // Template: Materials
        materials: LiteralLocalizationLeaf;
      };
      // Template: Shipyard Project: {name}
      title: {
        // Template: Shipyard projects
        loading: LiteralLocalizationLeaf;
        // Template: Shipyard project
        project: LiteralLocalizationLeaf;
        // Template: Shipyard projects
        projects: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    ShipyardProjects: {
      projects: {
        actions: {
          // Template: delete
          _delete: LiteralLocalizationLeaf;
          // Template: View
          view: LiteralLocalizationLeaf;
        };
        header: {
          // Template: Blueprint
          blueprint: LiteralLocalizationLeaf;
          // Template: Cmds
          cmds: LiteralLocalizationLeaf;
          // Template: Created
          created: LiteralLocalizationLeaf;
          // Template: Shipyard
          shipyard: LiteralLocalizationLeaf;
          // Template: Status
          status: LiteralLocalizationLeaf;
        };
      };
    };
    Shipyards: {
      button: {
        // Template: details
        details: LiteralLocalizationLeaf;
      };
      error: {
        // Template: Could not load data
        nodata: LiteralLocalizationLeaf;
      };
      table: {
        // Template: Location
        location: LiteralLocalizationLeaf;
        // Template: Operator
        operator: LiteralLocalizationLeaf;
      };
    };
    Sidebar: {
      header: {
        // Template: Cash Balances
        balances: LiteralLocalizationLeaf;
        // Template: Pending Contracts
        contracts: LiteralLocalizationLeaf;
        // Template: Rating
        rating: LiteralLocalizationLeaf;
      };
      title: {
        // Template: Government of {entity}
        government: {
          getFormat: () => IntlMessageFormat;
          message: (options: { entity: string }) => string;
        };
      };
    };
    Site: {
      buttons: {
        // Template: Construct
        construct: LiteralLocalizationLeaf;
        // Template: Experts
        experts: LiteralLocalizationLeaf;
        // Template: HQ
        headquarters: LiteralLocalizationLeaf;
        // Template: Inventory
        inventory: LiteralLocalizationLeaf;
        // Template: Production
        production: LiteralLocalizationLeaf;
        // Template: Buildings
        sections: LiteralLocalizationLeaf;
        // Template: Workforce
        workforces: LiteralLocalizationLeaf;
      };
      // Template: Overview
      overview: LiteralLocalizationLeaf;
      // Template: Workforce Overview
      workforces: LiteralLocalizationLeaf;
    };
    SiteBuildOption: {
      // Template: Area
      area: LiteralLocalizationLeaf;
      // Template: build
      build: LiteralLocalizationLeaf;
      // Template: Expertise
      expertise: LiteralLocalizationLeaf;
      // Template: Fertile soil
      fertile: {
        // Template: no
        no: LiteralLocalizationLeaf;
        // Template: yes
        yes: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Materials
      materials: LiteralLocalizationLeaf;
      // Template: Workforce
      workforce: {
        // Template: {capacity} ({reserve})
        capacity: {
          getFormat: () => IntlMessageFormat;
          message: (options: { capacity: string; reserve: string }) => string;
        };
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
    };
    SiteBuildOptionsContainer: {
      error: {
        // Template: Planet not found.
        planet: LiteralLocalizationLeaf;
      };
    };
    SiteBuildSectionPanel: {
      context: {
        // Template: Base
        base: LiteralLocalizationLeaf;
        // Template: Bases
        bases: LiteralLocalizationLeaf;
        // Template: Planet
        planet: LiteralLocalizationLeaf;
      };
      error: {
        // Template: Base not found.
        siteId: LiteralLocalizationLeaf;
      };
      // Template: Building Construction: {name}
      title: {
        // Template: Building Construction
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    SiteConstruction: {
      // Template: {used} / {total}
      basePermits: {
        getFormat: () => IntlMessageFormat;
        message: (options: { used: string; total: string }) => string;
      };
      // Template: Building a base on a planet requires the building materials for a core module, the heart of your base, as well as environment specific additions. These resources need to be brought to the planet with one of your ships. You can choose a location for your base by clicking on a free plot on the map below or click 'random plot' to select a random plot.
      description: LiteralLocalizationLeaf;
      label: {
        // Template: Base Permits
        basePermits: {
          // Template: The amount of base permits depends on the level of your company headquarters. If you run out of base permits consider upgrading your HQ.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Materials
        billOfMaterials: {
          // Template: The materials required to build a Core Module on this planet in order to start your base. Impacted by different environmental factors such as high or low temperature.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: build base
        build: LiteralLocalizationLeaf;
        buildOptions: {
          // Template: Choose between using a Core Module Kit or regular building materials for your base.
          info: LiteralLocalizationLeaf;
        };
        // Template: Description
        description: LiteralLocalizationLeaf;
        // Template: Base Establishment Fee
        establishmentFee: {
          // Template: Some planets require a base establishment fee to be paid to the local government in order to be able to settle on the planet.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Limit
        limit: {
          // Template: The amount of bases you have already built on this planet. The maximum is 1.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Location
        location: {
          // Template: The planet on which your base will be located. Choose wisely!
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Plot
        plotSelection: {
          // Template: With the correct ship transponder selected, left-click the plot where your base should be located. This is purely cosmetic at the moment and has no effect on your company. Right click and drag to rotate the planet.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Plots / available plots
        plots: {
          // Template: Bases (and some other structures) each require one free plot to be constructed. The numbers indicate the total plots and free plots on this planet. Grey plots are still open.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Build Options
        siteType: LiteralLocalizationLeaf;
        // Template: Storage Location
        store: {
          // Template: One of your ships needs to hold the building materials for your base in its cargo. Select its transponder code from the dropdown.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: view base
        view: LiteralLocalizationLeaf;
      };
      // Template: {current} / 1
      limit: {
        getFormat: () => IntlMessageFormat;
        message: (options: { current: string }) => string;
      };
      siteType: {
        // Template: Core Module Kit
        initial: LiteralLocalizationLeaf;
        // Template: Regular Building Materials
        regular: LiteralLocalizationLeaf;
      };
    };
    SiteConstructionPanel: {
      context: {
        // Template: Bases
        bases: LiteralLocalizationLeaf;
        // Template: Planet
        planet: LiteralLocalizationLeaf;
      };
      // Template: Base construction: {name}
      title: {
        // Template: Base construction: loading…
        loading: LiteralLocalizationLeaf;
        // Template: Base construction: unknown location
        unknownLocation: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    SitePanel: {
      context: {
        // Template: Bases
        bases: LiteralLocalizationLeaf;
        // Template: Building Repair Assistant
        buildingRepairAssistant: LiteralLocalizationLeaf;
        // Template: Headquarters
        headquarters: LiteralLocalizationLeaf;
        // Template: Inventories
        inventory: LiteralLocalizationLeaf;
        // Template: Planet
        planet: LiteralLocalizationLeaf;
        // Template: APEX Representation Center
        representationCenter: LiteralLocalizationLeaf;
      };
      // Template: Base: {name}
      title: {
        // Template: Bases
        sites: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    SiteProductionLines: {
      // Template: new order
      createOrder: LiteralLocalizationLeaf;
      // Template: You have no production facilities at this base yet.
      empty: LiteralLocalizationLeaf;
      // Template: queue
      queueDivider: LiteralLocalizationLeaf;
      // Template: Details
      view: LiteralLocalizationLeaf;
    };
    SitePublicInformation: {
      // Template: {area}%
      area: {
        getFormat: () => IntlMessageFormat;
        message: (options: { area: string }) => string;
      };
      label: {
        // Template: Developed area
        area: LiteralLocalizationLeaf;
        // Template: Founded
        founded: LiteralLocalizationLeaf;
        // Template: Primary industry
        industry: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Operator
        operator: LiteralLocalizationLeaf;
      };
    };
    SitePublicInformationPanel: {
      context: {
        // Template: Planet
        planet: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No plot found.
        siteId: LiteralLocalizationLeaf;
        // Template: Plot info not implemented for type {type}
        type: {
          getFormat: () => IntlMessageFormat;
          message: (options: { type: string }) => string;
        };
      };
      // Template: Plot @ {name}
      title: {
        // Template: Plot
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    SiteStats: {
      // Template: {developed} / {available} / {total}
      developedArea: {
        getFormat: () => IntlMessageFormat;
        message: (options: { developed: string; available: string; total: string }) => string;
      };
      label: {
        // Template: Area
        area: LiteralLocalizationLeaf;
        // Template: Developed / avail / total
        developedArea: LiteralLocalizationLeaf;
      };
    };
    SiteWorkforces: {
      // Template: {workforce} ({reserve})
      population: {
        getFormat: () => IntlMessageFormat;
        message: (options: { workforce: string; reserve: string }) => string;
      };
      table: {
        // Template: Capacity
        capacity: LiteralLocalizationLeaf;
        // Template: Current Workforce
        currentWorkforce: {
          // Template: The number of workers currently employed at the base. The number in brackets was recruited from the planet's "reserve pool". Once a week workers will be distributed between all requesting bases with a reserve being held back for mid-week acquisitions.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Level
        level: LiteralLocalizationLeaf;
        // Template: Required
        required: LiteralLocalizationLeaf;
        // Template: Satisfaction
        satisfaction: LiteralLocalizationLeaf;
      };
    };
    Sites: {
      action: {
        // Template: start base
        buildBase: LiteralLocalizationLeaf;
      };
      // Template: You have not established any planetary bases yet.
      empty: LiteralLocalizationLeaf;
      table: {
        // Template: add
        addPermit: LiteralLocalizationLeaf;
        // Template: Used Area
        area: {
          // Template: {developed} / {total}
          value: {
            getFormat: () => IntlMessageFormat;
            message: (options: { developed: string; total: string }) => string;
          };
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Change Permits
        changePermits: LiteralLocalizationLeaf;
        // Template: Permits
        permits: {
          // Template: Founding a new base requires a permit. However you can also assign permits to existing bases to increase the available building area. Level up your headquarters to gain additional permits.
          info: LiteralLocalizationLeaf;
          // Template: {invested} / {maximum}
          value: {
            getFormat: () => IntlMessageFormat;
            message: (options: { invested: string; maximum: string }) => string;
          };
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Planet
        planet: LiteralLocalizationLeaf;
        // Template: rmv
        removePermit: LiteralLocalizationLeaf;
        // Template: view base
        view: LiteralLocalizationLeaf;
      };
    };
    SortCriteria: {
      // Template: ABC
      ABC: LiteralLocalizationLeaf;
      // Template: AMT
      AMT: LiteralLocalizationLeaf;
      // Template: ASC
      ASC: LiteralLocalizationLeaf;
      // Template: CAT
      CAT: LiteralLocalizationLeaf;
      // Template: DESC
      DESC: LiteralLocalizationLeaf;
      // Template: TCK
      TCK: LiteralLocalizationLeaf;
      // Template: VOL
      VOL: LiteralLocalizationLeaf;
      // Template: WGT
      WGT: LiteralLocalizationLeaf;
    };
    Stack: {
      action: {
        // Template: Back
        back: LiteralLocalizationLeaf;
        // Template: Edit
        edit: LiteralLocalizationLeaf;
        // Template: Add New Card
        newCard: LiteralLocalizationLeaf;
        // Template: Stacks
        stacks: LiteralLocalizationLeaf;
        // Template: stop editing
        stopEditing: LiteralLocalizationLeaf;
      };
      // Template: This stack is empty. To add new cards to it, click 'add new card' below.
      empty: LiteralLocalizationLeaf;
      newcard: {
        action: {
          // Template: Cancel
          cancel: LiteralLocalizationLeaf;
          // Template: Create
          create: LiteralLocalizationLeaf;
        };
        // Template: Enter a command
        title: LiteralLocalizationLeaf;
      };
      title: {
        // Template: Add new card
        newCard: LiteralLocalizationLeaf;
      };
    };
    Stacks: {
      action: {
        // Template: Cancel
        cancel: LiteralLocalizationLeaf;
        // Template: Create
        create: LiteralLocalizationLeaf;
        // Template: Edit
        edit: LiteralLocalizationLeaf;
        // Template: Stop Editing
        stopEditing: LiteralLocalizationLeaf;
      };
      _delete: {
        // Template: Delete Stack
        confirm: LiteralLocalizationLeaf;
        // Template: All of the contained cards will be deleted. The operation cannot be undone!
        details: LiteralLocalizationLeaf;
        // Template: Are you sure you want to delete this stack?
        question: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Enter a stack name
        stackName: LiteralLocalizationLeaf;
      };
      // Template: {part}…
      name: {
        getFormat: () => IntlMessageFormat;
        message: (options: { part: string }) => string;
      };
      // Template: Add New Stack
      newStack: LiteralLocalizationLeaf;
      // Template: Create a stack
      title: LiteralLocalizationLeaf;
    };
    StarOverlay: {
      // Template: {population} - {workforce}
      populationDataLine: {
        getFormat: () => IntlMessageFormat;
        message: (options: { population: string; workforce: string }) => string;
      };
    };
    Station: {
      context: {
        // Template: System Map
        systemMap: LiteralLocalizationLeaf;
      };
    };
    StationInformationPanel: {
      // Template: Address
      address: LiteralLocalizationLeaf;
      // Template: Code
      code: LiteralLocalizationLeaf;
      // Template: Commissioned
      commissioned: LiteralLocalizationLeaf;
      error: {
        // Template: No station found.
        stationId: LiteralLocalizationLeaf;
      };
      // Template: Faction affinity
      faction: LiteralLocalizationLeaf;
      // Template: Governing entity
      governingEntity: LiteralLocalizationLeaf;
      // Template: Infrastructure
      infrastructure: LiteralLocalizationLeaf;
      // Template: Name
      name: LiteralLocalizationLeaf;
      // Template: {name}
      title: {
        // Template: Station
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    StationInfrastructure: {
      // Template: {name} Warehouse
      warehouse: {
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    Stations: {
      action: {
        // Template: details
        details: LiteralLocalizationLeaf;
      };
      list: {
        // Template: Address
        address: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Identifier
        naturalId: LiteralLocalizationLeaf;
      };
    };
    StationsTile: {
      // Template: Failed to load stations.
      error: LiteralLocalizationLeaf;
      // Template: Space Stations
      title: LiteralLocalizationLeaf;
    };
    SteamReviewPanel: {
      action: {
        // Template: steam client
        steamClient: LiteralLocalizationLeaf;
        // Template: steam website
        steamWebsite: LiteralLocalizationLeaf;
      };
      // Template: We need your help!
      heading: LiteralLocalizationLeaf;
      // Template: (opens the Steam client directly, might not work in all cases)
      steamClient: LiteralLocalizationLeaf;
      // Template: (opens the Steam website)
      steamWebsite: LiteralLocalizationLeaf;
      // Template: In order to bring in new players, we need your help! The Steam algorithm heavily favors games with a lot of positive reviews and shows these games to even more players. You can help by writing a short review about why you love Prosperous Universe.
      text1: LiteralLocalizationLeaf;
      // Template: Thank you so much!
      text2: LiteralLocalizationLeaf;
      // Template: Steam
      title: LiteralLocalizationLeaf;
    };
    StockChartContainer: {
      error: {
        // Template: No data.
        noData: LiteralLocalizationLeaf;
      };
    };
    StoreItem: {
      // Template: Blocked materials #{id}
      blocked_materials: {
        getFormat: () => IntlMessageFormat;
        message: (options: { id: string }) => string;
      };
      // Template: Shipment #{id}
      shipment: {
        getFormat: () => IntlMessageFormat;
        message: (options: { id: string }) => string;
      };
    };
    StoreItemIcon: {
      context: {
        // Template: U
        unpack: LiteralLocalizationLeaf;
      };
    };
    StoreLockOverlay: {
      // Template: Inventory is locked
      _message: LiteralLocalizationLeaf;
    };
    StoreName: {
      // Template: Base
      base: LiteralLocalizationLeaf;
      // Template: Construction site
      construction_store: LiteralLocalizationLeaf;
      // Template: Ship {name} FTL fuel store
      ftl_fuel_store: {
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
      // Template: Ship {name} cargo hold
      ship_store: {
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
      // Template: Ship {name} STL fuel store
      stl_fuel_store: {
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
      // Template: Upkeep
      upkeep_store: LiteralLocalizationLeaf;
      // Template: Ship {name} Vortex fuel store
      vortex_fuel_store: {
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
      // Template: Warehouse
      warehouse: LiteralLocalizationLeaf;
    };
    StoreTransfer: {
      context: {
        // Template: Inventories
        inventories: LiteralLocalizationLeaf;
      };
    };
    StoreTypeLabel: {
      // Template: Construction site
      CONSTRUCTION_STORE: LiteralLocalizationLeaf;
      // Template: CON
      CONSTRUCTION_STORE_SHORT: LiteralLocalizationLeaf;
      // Template: FTL fuel tank
      FTL_FUEL_STORE: LiteralLocalizationLeaf;
      // Template: FTL
      FTL_FUEL_STORE_SHORT: LiteralLocalizationLeaf;
      // Template: Cargo hold
      SHIP_STORE: LiteralLocalizationLeaf;
      // Template: SHP
      SHIP_STORE_SHORT: LiteralLocalizationLeaf;
      // Template: STL fuel tank
      STL_FUEL_STORE: LiteralLocalizationLeaf;
      // Template: STL
      STL_FUEL_STORE_SHORT: LiteralLocalizationLeaf;
      // Template: Base storage
      STORE: LiteralLocalizationLeaf;
      // Template: BS
      STORE_SHORT: LiteralLocalizationLeaf;
      // Template: Upkeep
      UPKEEP_STORE: LiteralLocalizationLeaf;
      // Template: UPK
      UPKEEP_STORE_SHORT: LiteralLocalizationLeaf;
      // Template: Vortex fuel store
      VORTEX_FUEL_STORE: LiteralLocalizationLeaf;
      // Template: VTX
      VORTEX_FUEL_STORE_SHORT: LiteralLocalizationLeaf;
      // Template: Warehouse unit
      WAREHOUSE_STORE: LiteralLocalizationLeaf;
      // Template: WAR
      WAREHOUSE_STORE_SHORT: LiteralLocalizationLeaf;
    };
    StoreView: {
      actions: {
        // Template: Start transfer
        startTransfer: LiteralLocalizationLeaf;
      };
      // Template: Volume
      volume: LiteralLocalizationLeaf;
      // Template: Weight
      weight: LiteralLocalizationLeaf;
    };
    SubscriptionLevel: {
      // Template: BASIC
      basic: LiteralLocalizationLeaf;
      // Template: PRO
      pro: LiteralLocalizationLeaf;
      // Template: FREE
      trial: LiteralLocalizationLeaf;
    };
    SystemInfoPanel: {
      context: {
        // Template: Fleet
        fleet: LiteralLocalizationLeaf;
        // Template: Infrastructure
        infrastructure: LiteralLocalizationLeaf;
        // Template: Inventory
        inventory: LiteralLocalizationLeaf;
        // Template: System Map
        systemMap: LiteralLocalizationLeaf;
      };
      error: {
        // Template: No system found.
        systemId: LiteralLocalizationLeaf;
      };
      // Template: Faction affinity
      faction: LiteralLocalizationLeaf;
      header: {
        // Template: Planets
        planets: LiteralLocalizationLeaf;
        // Template: Stations
        stations: LiteralLocalizationLeaf;
      };
      // Template: Micrometeoroid density
      meteoroidDensity: LiteralLocalizationLeaf;
      // Template: Name
      name: LiteralLocalizationLeaf;
      // Template: Named by
      naming: LiteralLocalizationLeaf;
      // Template: Catalog ID
      naturalId: LiteralLocalizationLeaf;
      planet: {
        // Template: CoGC Program
        cogc: LiteralLocalizationLeaf;
        // Template: Environment
        environment: LiteralLocalizationLeaf;
        // Template: Fertility
        fertility: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Population
        population: LiteralLocalizationLeaf;
        // Template: Resources
        resources: LiteralLocalizationLeaf;
        // Template: Type
        surface: LiteralLocalizationLeaf;
      };
      // Template: Star type
      starType: LiteralLocalizationLeaf;
      station: {
        // Template: Infrastructure
        infrastructure: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
      };
      // Template: System Info: {name}
      title: {
        // Template: System Search
        list: LiteralLocalizationLeaf;
        // Template: System Info: loading…
        loading: LiteralLocalizationLeaf;
        // Template: System Info: not found…
        notfound: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    SystemInformation: {
      info: {
        // Template: States to which faction's sphere of influence the system belongs. Planets in faction systems stricter rules than in non-faction systems, for example fees will always be levied in the faction's currency.
        faction: LiteralLocalizationLeaf;
        // Template: Certain tiers of APEX PRO licenses include the right to name a system.
        naming: LiteralLocalizationLeaf;
        // Template: The cumulative workforce population.
        workforce: LiteralLocalizationLeaf;
      };
      // Template: {namer} {time}
      named: {
        getFormat: () => IntlMessageFormat;
        message: (options: { namer: string; time: string }) => string;
      };
      naming: {
        // Template: Name this system
        name: LiteralLocalizationLeaf;
      };
      // Template: -- {button}
      unnamed: {
        getFormat: () => IntlMessageFormat;
        message: (options: { button: string }) => string;
      };
    };
    SystemMap: {
      setting: {
        comex: {
          // Template: Commodity Exchange
          label: LiteralLocalizationLeaf;
        };
        fleet: {
          // Template: Fleet
          label: LiteralLocalizationLeaf;
        };
        inventory: {
          // Template: Inventory
          label: LiteralLocalizationLeaf;
        };
        localMarket: {
          // Template: Local Market
          label: LiteralLocalizationLeaf;
        };
        shipyard: {
          // Template: Shipyard
          label: LiteralLocalizationLeaf;
        };
        site: {
          // Template: Base
          label: LiteralLocalizationLeaf;
        };
      };
    };
    SystemMapPanel: {
      context: {
        // Template: Fleet
        fleet: LiteralLocalizationLeaf;
        // Template: System information
        info: LiteralLocalizationLeaf;
      };
      error: {
        // Template: System Map: No system found.
        systemId: LiteralLocalizationLeaf;
      };
      // Template: System Map: {name}
      title: {
        // Template: System Map
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    TaskDescription: {
      // Template: Build your first base (for example on your starting planet)!
      BASIC_BASE_BUILDING: LiteralLocalizationLeaf;
      // Template: Choose your first buildings in your base’s construction menu!
      BASIC_BASE_CONSTRUCTION: LiteralLocalizationLeaf;
      // Template: Start your first production order!
      BASIC_BASE_PRODUCTION: LiteralLocalizationLeaf;
      // Template: Keep an eye on your population’s consumption! Their satisfaction and thus productivity goes down if they lack consumables.
      BASIC_BASE_WORKFORCE: LiteralLocalizationLeaf;
      // Template: Check prices at your faction's commodity exchange!
      BASIC_COMEX: LiteralLocalizationLeaf;
      // Template: Check out and join our Discord community, where we discuss everything related to APEX and more.
      BASIC_COMMUNITY_DISCORD: LiteralLocalizationLeaf;
      // Template: Check out our introductory materials below!
      BASIC_INTRO: LiteralLocalizationLeaf;
      // Template: Read the APEX Guidelines!
      BASIC_INTRO_GUIDELINES: LiteralLocalizationLeaf;
      // Template: Check out the APEX handbook!
      BASIC_INTRO_HANDBOOK: LiteralLocalizationLeaf;
      // Template: You chose the starting package '{startingProfile}'. To learn more about your building options, have a look at the corresponding chapter in the handbook.
      BASIC_INTRO_HANDBOOK_PACKAGE: {
        getFormat: () => IntlMessageFormat;
        message: (options: { startingProfile: string }) => string;
      };
      // Template: If you have any questions, try asking in the HELP channel first!
      BASIC_INTRO_HELP_CHANNEL: LiteralLocalizationLeaf;
      // Template: Watch our video transmissions where we explain how APEX works!
      BASIC_INTRO_VIDEO: LiteralLocalizationLeaf;
      // Template: Move building materials from your ships to your base’s inventory! Simply open both inventories simultaneously and use drag-and-drop!
      BASIC_INVENTORY_TRANSFER: LiteralLocalizationLeaf;
      // Template: Congratulations! You’re a certified APEX trader! Think about getting a PRO license to unlock access to additional features and perks! For example accepting shipping contracts at your local market can be great source of additional income!
      BASIC_LICENSE_PRO: LiteralLocalizationLeaf;
    };
    TaskName: {
      // Template: Base building
      BASIC_BASE_BUILDING: LiteralLocalizationLeaf;
      // Template: Building construction
      BASIC_BASE_CONSTRUCTION: LiteralLocalizationLeaf;
      // Template: Experts
      BASIC_BASE_EXPERT: LiteralLocalizationLeaf;
      // Template: Production orders
      BASIC_BASE_PRODUCTION: LiteralLocalizationLeaf;
      // Template: Workforce
      BASIC_BASE_WORKFORCE: LiteralLocalizationLeaf;
      // Template: Commodity exchange
      BASIC_COMEX: LiteralLocalizationLeaf;
      // Template: Discord community
      BASIC_COMMUNITY_DISCORD: LiteralLocalizationLeaf;
      // Template: Introduction
      BASIC_INTRO: LiteralLocalizationLeaf;
      // Template: Guidelines
      BASIC_INTRO_GUIDELINES: LiteralLocalizationLeaf;
      // Template: Handbook
      BASIC_INTRO_HANDBOOK: LiteralLocalizationLeaf;
      // Template: Building recommendations
      BASIC_INTRO_HANDBOOK_PACKAGE: LiteralLocalizationLeaf;
      // Template: Help channel
      BASIC_INTRO_HELP_CHANNEL: LiteralLocalizationLeaf;
      // Template: Video transmissions
      BASIC_INTRO_VIDEO: LiteralLocalizationLeaf;
      // Template: Inventory transfer
      BASIC_INVENTORY_TRANSFER: LiteralLocalizationLeaf;
      // Template: PRO license
      BASIC_LICENSE_PRO: LiteralLocalizationLeaf;
    };
    TemplateSelection: {
      action: {
        // Template: add commodity
        addCommodity: LiteralLocalizationLeaf;
        // Template: add shipment
        addShipment: LiteralLocalizationLeaf;
        // Template: cancel
        cancel: LiteralLocalizationLeaf;
        // Template: ▼
        moveDown: LiteralLocalizationLeaf;
        // Template: ▲
        moveUp: LiteralLocalizationLeaf;
        // Template: x
        remove: LiteralLocalizationLeaf;
        // Template: apply template
        template: LiteralLocalizationLeaf;
      };
      // Template: Template selection
      header: LiteralLocalizationLeaf;
      label: {
        // Template: Description
        description: LiteralLocalizationLeaf;
        // Template: Total interest
        totalInterest: LiteralLocalizationLeaf;
      };
    };
    TemplateSelectionBuy: {
      label: {
        // Template: Location
        address: LiteralLocalizationLeaf;
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Currency
        currency: LiteralLocalizationLeaf;
        // Template: Deadline
        deadline: LiteralLocalizationLeaf;
        // Template: Commodity
        material: LiteralLocalizationLeaf;
        // Template: Total
        price: LiteralLocalizationLeaf;
        // Template: Price per unit
        pricePerUnit: LiteralLocalizationLeaf;
      };
    };
    TemplateSelectionLoanAnnuity: {
      label: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Currency
        currency: LiteralLocalizationLeaf;
        // Template: Interest rate
        interestRate: LiteralLocalizationLeaf;
        // Template: Interval
        interval: {
          // Template: Specifies the time between installments in days
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Initial repayment rate
        repayment: LiteralLocalizationLeaf;
        // Template: Role
        role: LiteralLocalizationLeaf;
      };
    };
    TemplateSelectionLoanInterest: {
      label: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Currency
        currency: LiteralLocalizationLeaf;
        // Template: Duration
        duration: LiteralLocalizationLeaf;
        installments: {
          // Template: Defines how many installments the loan should have until the full repayment
          info: LiteralLocalizationLeaf;
        };
        // Template: Interest rate
        interestRate: LiteralLocalizationLeaf;
        // Template: Interval
        interval: {
          // Template: Specifies the time between installments in days
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Role
        role: LiteralLocalizationLeaf;
      };
    };
    TemplateSelectionLoanStable: {
      label: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Currency
        currency: LiteralLocalizationLeaf;
        // Template: Interest rate
        interestRate: LiteralLocalizationLeaf;
        // Template: Interval
        interval: {
          // Template: Specifies the time between installments in days
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Repayment rate
        repaymentRate: LiteralLocalizationLeaf;
        // Template: Role
        role: LiteralLocalizationLeaf;
      };
    };
    TemplateSelectionShip: {
      // Template: {weight}t / {volume}m³
      cargo: {
        getFormat: () => IntlMessageFormat;
        message: (options: { weight: string; volume: string }) => string;
      };
      label: {
        // Template: Amount
        amount: LiteralLocalizationLeaf;
        // Template: Auto-provision
        autoprovision: LiteralLocalizationLeaf;
        // Template: Cargo
        cargo: LiteralLocalizationLeaf;
        // Template: Currency
        currency: LiteralLocalizationLeaf;
        // Template: Deadline
        deadline: LiteralLocalizationLeaf;
        // Template: Destination
        destination: LiteralLocalizationLeaf;
        // Template: Commodity
        material: LiteralLocalizationLeaf;
        // Template: Origin
        origin: LiteralLocalizationLeaf;
        // Template: Price
        price: LiteralLocalizationLeaf;
      };
    };
    TemplateType: {
      // Template: Buy commodity
      BUY: LiteralLocalizationLeaf;
      // Template: A contract to buy commodities
      BUY_DESC: LiteralLocalizationLeaf;
      // Template: Annuity loan
      LOAN_ANNUITY: LiteralLocalizationLeaf;
      // Template: A loan contract with fixed installments
      LOAN_ANNUITY_DESC: LiteralLocalizationLeaf;
      // Template: Interest loan
      LOAN_INTEREST: LiteralLocalizationLeaf;
      // Template: A loan contract where the installments are only made up of interest. Full repayment occurs with the last installment.
      LOAN_INTEREST_DESC: LiteralLocalizationLeaf;
      // Template: Stable loan
      LOAN_STABLE: LiteralLocalizationLeaf;
      // Template: A loan contract with a stable repayment amount and decreasing interest
      LOAN_STABLE_DESC: LiteralLocalizationLeaf;
      // Template: Sell commodity
      SELL: LiteralLocalizationLeaf;
      // Template: A contract to sell commodities
      SELL_DESC: LiteralLocalizationLeaf;
      // Template: Ship commodity
      SHIP: LiteralLocalizationLeaf;
      // Template: A contract to ship commodities from one location to another
      SHIP_DESC: LiteralLocalizationLeaf;
    };
    TextAreaInput: {
      // Template: {length} / {maxLength}
      length: {
        getFormat: () => IntlMessageFormat;
        message: (options: { length: string; maxLength: string }) => string;
      };
    };
    Tile: {
      // Template: Illegal command
      illegalCommand: LiteralLocalizationLeaf;
    };
    Time: {
      // Template: {days, plural, one {# day} other {# days}}
      days: {
        getFormat: () => IntlMessageFormat;
        message: (options: { days: number }) => string;
      };
      // Template: {hours}h
      hours: {
        getFormat: () => IntlMessageFormat;
        message: (options: { hours: string }) => string;
      };
      // Template: {minutes}m
      minutes: {
        getFormat: () => IntlMessageFormat;
        message: (options: { minutes: string }) => string;
      };
      // Template: {seconds}s
      seconds: {
        getFormat: () => IntlMessageFormat;
        message: (options: { seconds: string }) => string;
      };
    };
    Tour: {
      BASE: {
        _1: {
          // Template: Congratulations, you just built your first base.
          _1: LiteralLocalizationLeaf;
          // Template: We added a new screen for you to manage your base and switched to it. It is called '04. Base' and you can find it in the <strong>SCRNS</strong> drop down menu.
          _2: LiteralLocalizationLeaf;
          // Template: Base screen
          title: LiteralLocalizationLeaf;
        };
        _2: {
          // Template: These are your ships' inventories.
          _1: LiteralLocalizationLeaf;
          // Template: You can transfer items to your base inventory (on the right) by dragging them over.
          _2: LiteralLocalizationLeaf;
          // Template: As a shortcut, you can also use the <strong>UNLOAD</strong> button to transfer everything at once.
          _3: LiteralLocalizationLeaf;
          // Template: Inventories
          title: LiteralLocalizationLeaf;
        };
        _3: {
          // Template: This tile holds an overview of your base’s workforce and gives you access to all the core management options.
          _1: LiteralLocalizationLeaf;
          // Template: One of the first things you should look into is building your initial production lines.
          _2: LiteralLocalizationLeaf;
          // Template: Base overview
          title: LiteralLocalizationLeaf;
        };
        _4: {
          // Template: This tile's command shows the recommended starting buildings for your selected profession.
          _1: LiteralLocalizationLeaf;
          // Template: You can click the individual buildings to get more information.
          _2: LiteralLocalizationLeaf;
          // Template: Click <strong>CONSTRUCT</strong> to get started!
          _3: LiteralLocalizationLeaf;
          // Template: Building construction
          title: LiteralLocalizationLeaf;
        };
        _5: {
          // Template: Initially you will have to build a couple pioneer habitation modules for your workforce. Your habitations determine how many active workers your base can hold.
          _1: LiteralLocalizationLeaf;
          // Template: Once you offer housing for your initial workforce, build the first resource extraction or production building based on the starting building recommendations.
          _2: LiteralLocalizationLeaf;
          // Template: Building construction
          title: LiteralLocalizationLeaf;
        };
        _6: {
          // Template: Once your production buildings are set up, they are displayed in this tile.
          _1: LiteralLocalizationLeaf;
          // Template: Here you can start your production and queue up future orders via<strong>NEW ORDER</strong>.
          _2: LiteralLocalizationLeaf;
          // Template: Production orders usually take many hours to complete. Your first order will be sped up significantly, so you can continue to get to know the APEX interface without having to interrupt your session.
          _3: LiteralLocalizationLeaf;
          // Template: Production lines
          title: LiteralLocalizationLeaf;
        };
        _7: {
          // Template: By the way, important notifications such as the receival of new contracts or finished production orders can be accessed via this button.
          _1: LiteralLocalizationLeaf;
          // Template: Notifications
          title: LiteralLocalizationLeaf;
        };
      };
      CONTRACT: {
        _1: {
          // Template: You just received your first faction contract. A new 'Contracts' screen was created automatically. Find it in the <strong>SCRNS</strong> dropdown.
          _1: LiteralLocalizationLeaf;
          // Template: Contract screen
          title: LiteralLocalizationLeaf;
        };
        _2: {
          // Template: All your contracts are collected in the <code>CONTS</code> command. You can also find an overview of contracts pending action in the sidebar to the right.
          _1: LiteralLocalizationLeaf;
          // Template: The first contract you received is one from your faction and includes the task of setting up your first base.
          _2: LiteralLocalizationLeaf;
          // Template: Contracts
          title: LiteralLocalizationLeaf;
        };
        _3: {
          // Template: These are the contract’s details. You can open the details of each contract via the “view” button in <code>CONTS</code>.
          _1: LiteralLocalizationLeaf;
          // Template: The <code>CONT</code> command on the right has a preamble explaining what the contract is about. At the bottom you will always find a contract’s conditions, i.e. what you and your contract partner have to do at which point in time.
          _2: LiteralLocalizationLeaf;
          // Template: Contract details
          title: LiteralLocalizationLeaf;
        };
        _4: {
          // Template: One more advanced feature you may want to keep in mind for the future: Via the <code>CONTD</code> command and its “create new” button you can draft your own contracts and send them to other players. Please note that sending out contracts requires a PRO license.
          _1: LiteralLocalizationLeaf;
          // Template: Contract drafts
          title: LiteralLocalizationLeaf;
        };
        _5: {
          // Template: For now though, go back to the “START” screen via the <strong>SCRNS</strong> dropdown and find the “start base” button to fulfill your contract. After setting up your base, you will receive the first part of your company startup bonus.
          _1: LiteralLocalizationLeaf;
          // Template: Setting up your base
          title: LiteralLocalizationLeaf;
        };
      };
      CX: {
        _1: {
          // Template: Congratulations, your ship finished its first journey.
          _1: LiteralLocalizationLeaf;
          // Template: We added a new screen for you to manage your trading activities and switched to it. It is called '06. Trading' and you can find it in the <strong>SCRNS</strong> drop down menu.
          _2: LiteralLocalizationLeaf;
          // Template: Trading screen
          title: LiteralLocalizationLeaf;
        };
        _2: {
          // Template: This is the <code>CX</code> command, the main interface of each commodity exchange. You can access all available commodities via the category dropdown.
          _1: LiteralLocalizationLeaf;
          // Template: Each commodity entry holds data on its current price, demand and supply. On the right of each row, you can get more information, charts and - most importantly - the commodity's order book ('Orders') and its trading command ('Trade').
          _2: LiteralLocalizationLeaf;
          // Template: Commodity exchange
          title: LiteralLocalizationLeaf;
        };
        _3: {
          // Template: This is the order book for basic rations. It shows the amount and prices of each offer (also known as asks) at the top in red. The requests (also known as bids) are below in green.
          _1: LiteralLocalizationLeaf;
          // Template: If you want a request to be filled immediately, put in a price not lower than the the lowest offer. If you want your offer to sell immediately, put in a price not higher than the highest request.
          _2: LiteralLocalizationLeaf;
          // Template: Order book
          title: LiteralLocalizationLeaf;
        };
        _4: {
          // Template: The information from the order book allows you to make informed decisions when placing orders via the <code>CXPO</code> command.
          _1: LiteralLocalizationLeaf;
          // Template: Just enter a quantity and a price, and then click 'sell' or 'buy' to create either an offer or a request.
          _2: LiteralLocalizationLeaf;
          // Template: Now, set up a request for <strong>RAT</strong>!
          _3: LiteralLocalizationLeaf;
          // Template: <strong>Note</strong>: Once your request is filled, it will be loaded into a ship present at the commodity exchange station automatically. You can also trade if you have no ship present though. In that case a pick-up contract will be created that allows you to collect your goods later on!
          _4: LiteralLocalizationLeaf;
          // Template: Order placement
          title: LiteralLocalizationLeaf;
        };
        _5: {
          // Template: All your commodity exchange offers and requests will be listed in <code>CXOS</code> for future reference. You can also track whether they have been (partially) filled already here.
          _1: LiteralLocalizationLeaf;
          // Template: Order list
          title: LiteralLocalizationLeaf;
        };
        _6: {
          // Template: Sometimes it can be worth checking prices not only at your nearby commodity exchange, but also on others. The <code>CXL</code> command has a list of all commodity exchanges.
          _1: LiteralLocalizationLeaf;
          // Template: List of commodity exchanges
          title: LiteralLocalizationLeaf;
        };
      };
      FLIGHT: {
        _1: {
          // Template: Congratulations, your first production order just completed.
          _1: LiteralLocalizationLeaf;
          // Template: We added a new screen for you to manage your ships and switched to it. It is called '05. Travel' and you can find it in the <strong>SCRNS</strong> drop down menu.
          _2: LiteralLocalizationLeaf;
          // Template: Travel screen
          title: LiteralLocalizationLeaf;
        };
        _2: {
          // Template: The fleet overview command <code>FLT</code> holds a list of all your ships.
          _1: LiteralLocalizationLeaf;
          // Template: Clicking the transponder code will open a new buffer with more information about your ship.
          _2: LiteralLocalizationLeaf;
          // Template: Clicking the entries in the cargo and fuel columns will open the respective inventories.
          _3: LiteralLocalizationLeaf;
          // Template: Fleet overview
          title: LiteralLocalizationLeaf;
        };
        _3: {
          // Template: This screen already has the ships' inventories added to it.
          _1: LiteralLocalizationLeaf;
          // Template: You can fill ship inventories by dragging over items from your base. For example, you could ship your recently produced products to the closest commodity exchange.
          _2: LiteralLocalizationLeaf;
          // Template: Manage your inventory
          title: LiteralLocalizationLeaf;
        };
        _4: {
          // Template: The closest commodity exchange is located on a space station. It also features a local market and warehouses.
          _1: LiteralLocalizationLeaf;
          // Template: Take note of the station's code ({code}), it can be used when entering a destination for our space flight.
          _2: {
            getFormat: () => IntlMessageFormat;
            message: (options: { code: string }) => string;
          };
          // Template: Commodity exchange
          title: LiteralLocalizationLeaf;
        };
        _5: {
          // Template: These are your ship's flight controls. You can open them anytime via the 'fly' button on the right side of your fleet overview command (<code>FLT</code>).
          _1: LiteralLocalizationLeaf;
          // Template: The flight controls allow you to send ships to other destinations, like planets and stations.
          _2: LiteralLocalizationLeaf;
          // Template: Flight controls
          title: LiteralLocalizationLeaf;
        };
        _6: {
          // Template: Now, try entering the station's code ({code}) into the destination field and select the station from the results.
          _1: {
            getFormat: () => IntlMessageFormat;
            message: (options: { code: string }) => string;
          };
          // Template: Once you entered a destination, the bottom of the flight controls command will show your ship's route. By the way, you can hover over each location in the list to highlight it on the universe map on the left.
          _2: LiteralLocalizationLeaf;
          // Template: It's important to save on fuel since you're in this for the long haul hopefully. So keep your fuel usage sliders low and click the <strong>START</strong> button only if you are certain that you are ready to start the flight!
          _3: LiteralLocalizationLeaf;
          // Template: Depending on your destination and fuel usage flights usually take <strong>many hours</strong>. Your first flight will be sped up significantly, so you can continue to get to know the APEX interface without having to interrupt your session.
          _4: LiteralLocalizationLeaf;
          // Template: Flight controls
          title: LiteralLocalizationLeaf;
        };
      };
      UI: {
        _1: {
          // Template: You're about to dive into a dynamic, universe-spanning economy where you will manage your own startup company.
          _1: LiteralLocalizationLeaf;
          // Template: No worries though, take a quick tour of the powerful <strong>APEX</strong> interface and you’ll be building, negotiating and trading in no time!
          _2: LiteralLocalizationLeaf;
          // Template: Welcome licensee!
          title: LiteralLocalizationLeaf;
        };
        _10: {
          // Template: Great! Here you can find a quick overview of your cash balance in the different currencies as well as a list of pending contracts with other players.
          _1: LiteralLocalizationLeaf;
          // Template: Sidebars
          title: LiteralLocalizationLeaf;
        };
        _11: {
          // Template: Finally, you can add whole new screens from the top action bar. You will also find a list of all your existing screens here.
          _1: LiteralLocalizationLeaf;
          // Template: Screens
          title: LiteralLocalizationLeaf;
        };
        _12: {
          // Template: Now you know how to navigate <strong>APEX</strong>
          _1: LiteralLocalizationLeaf;
          // Template: For your first steps, consider following the instructions in the <code>HELP</code> tile.
          _2: LiteralLocalizationLeaf;
          // Template: Many tiles also link directly to the handbook via the {image} icon in their top bar!
          _3: {
            getFormat: () => IntlMessageFormat;
            message: (options: { image: string }) => string;
          };
          // Template: Happy trading, licensee!
          _4: LiteralLocalizationLeaf;
          // Template: More resources
          title: LiteralLocalizationLeaf;
        };
        _2: {
          // Template: This is a <strong>tile</strong>. Specifically, this tile shows you information about the starting planet you chose. You can always hover over the {image} icon for more information!
          _1: {
            getFormat: () => IntlMessageFormat;
            message: (options: { image: string }) => string;
          };
          // Template: Multiple tiles make up a SCREEN. In APEX you can design your own screen layouts!
          _2: LiteralLocalizationLeaf;
          // Template: Tiles & Screens
          title: LiteralLocalizationLeaf;
        };
        _3: {
          // Template: You can change a tile's size by dragging the edges!
          _1: LiteralLocalizationLeaf;
          // Template: Tiles & Screens
          title: LiteralLocalizationLeaf;
        };
        _4: {
          // Template: Hovering over the {image} icon at the top of a tile will allow you to create new tiles by
          _1: {
            getFormat: () => IntlMessageFormat;
            message: (options: { image: string }) => string;
          };
          // Template: Dividing the tile horizontally
          _2: LiteralLocalizationLeaf;
          // Template: Dividing the tile vertically
          _3: LiteralLocalizationLeaf;
          // Template: You can also
          _4: LiteralLocalizationLeaf;
          // Template: Remove the tile from your current screen’s layout
          _5: LiteralLocalizationLeaf;
          // Template: Empty the tile and fill it with a new <strong>COMMAND</strong>
          _6: LiteralLocalizationLeaf;
          // Template: Tiles & Screens
          title: LiteralLocalizationLeaf;
        };
        _5: {
          // Template: Another way of accessing the content you’re looking for is by using <strong>BUFFERS</strong>.
          _1: LiteralLocalizationLeaf;
          // Template: Click the button below to create a new buffer!
          _2: LiteralLocalizationLeaf;
          // Template: Buffers
          title: LiteralLocalizationLeaf;
        };
        _6: {
          // Template: Content in <strong>APEX</strong> is accessed via commands.
          _1: LiteralLocalizationLeaf;
          // Template: For example: type <code>CXL</code> and hit enter to open an overview of all commodity exchanges.
          _2: LiteralLocalizationLeaf;
          // Template: Buffers
          title: LiteralLocalizationLeaf;
        };
        _7: {
          // Template: Buffers are <strong>temporary</strong>. They will disappear when you re-boot APEX.
          _1: LiteralLocalizationLeaf;
          // Template: To make them permanent, integrate them in your screen's layout!
          _2: LiteralLocalizationLeaf;
          // Template: To do this, grab the buffer’s content at the title bar and drag it to an empty tile to permanently add it to your screen.
          _3: LiteralLocalizationLeaf;
          // Template: You can also move the content of existing tiles in your screen in the same manner.
          _4: LiteralLocalizationLeaf;
          // Template: Buffers
          title: LiteralLocalizationLeaf;
        };
        _8: {
          // Template: The left sidebar in APEX comes with a preset selection of easily accessible commands.
          _1: LiteralLocalizationLeaf;
          // Template: Click them to instantly open the respective command in a new buffer!
          _2: LiteralLocalizationLeaf;
          // Template: Sidebars
          title: LiteralLocalizationLeaf;
        };
        _9: {
          // Template: Optionally, you can activate an additional sidebar on the right side of your screen.
          _1: LiteralLocalizationLeaf;
          // Template: Try it now by clicking <code>SDBR</code>!
          _2: LiteralLocalizationLeaf;
          // Template: Sidebars
          title: LiteralLocalizationLeaf;
        };
      };
      tooltip: {
        action: {
          // Template: finish
          finish: LiteralLocalizationLeaf;
          // Template: next
          next: LiteralLocalizationLeaf;
          // Template: back
          previous: LiteralLocalizationLeaf;
          // Template: skip
          skip: LiteralLocalizationLeaf;
        };
        // Template: {current} / {size}
        progress: {
          getFormat: () => IntlMessageFormat;
          message: (options: { current: string; size: string }) => string;
        };
      };
    };
    TrafficStats: {
      table: {
        // Template: current phase
        currentPhase: LiteralLocalizationLeaf;
        // Template: failed: inoperative
        failedInoperative: LiteralLocalizationLeaf;
        // Template: failed: missing fuel
        failedMissingFuel: LiteralLocalizationLeaf;
        // Template: failed: over capacity
        failedNoCapacity: LiteralLocalizationLeaf;
        // Template: average over 10 phases
        last10Phases: LiteralLocalizationLeaf;
        // Template: last phase
        lastPhase: LiteralLocalizationLeaf;
        // Template: successful
        successful: LiteralLocalizationLeaf;
      };
    };
    TransmissionsPanel: {
      table: {
        command: {
          // Template: view
          view: LiteralLocalizationLeaf;
        };
        // Template: Command
        commands: LiteralLocalizationLeaf;
        // Template: Transmission
        name: LiteralLocalizationLeaf;
        // Template: #
        number: LiteralLocalizationLeaf;
        // Template: (your profession)
        profession: LiteralLocalizationLeaf;
        t01: {
          // Template: Orientation to the galaxy
          name: LiteralLocalizationLeaf;
        };
        t02: {
          // Template: Your first base
          name: LiteralLocalizationLeaf;
        };
        t03_1: {
          // Template: Manufacturer Profession
          name: LiteralLocalizationLeaf;
        };
        t03_2: {
          // Template: Metallurgist Profession
          name: LiteralLocalizationLeaf;
        };
        t03_3: {
          // Template: Victualler Profession
          name: LiteralLocalizationLeaf;
        };
        t03_4: {
          // Template: Carbon Farmer Profession
          name: LiteralLocalizationLeaf;
        };
        t03_5: {
          // Template: Constructor Profession
          name: LiteralLocalizationLeaf;
        };
        t03_6: {
          // Template: Fuel Engineer Profession
          name: LiteralLocalizationLeaf;
        };
        t04: {
          // Template: Base upkeep and flight
          name: LiteralLocalizationLeaf;
        };
        t05: {
          // Template: The market guide
          name: LiteralLocalizationLeaf;
        };
        t06: {
          // Template: Licenses
          name: LiteralLocalizationLeaf;
        };
        t07: {
          // Template: Interface guide
          name: LiteralLocalizationLeaf;
        };
        t08: {
          // Template: Corporations and Contracts
          name: LiteralLocalizationLeaf;
        };
        t09: {
          // Template: Your Second Base
          name: LiteralLocalizationLeaf;
        };
        t10: {
          // Template: Space Empires
          name: LiteralLocalizationLeaf;
        };
      };
      // Template: Transmissions
      title: LiteralLocalizationLeaf;
    };
    Unavailable: {
      // Template: This command is not supported in the '{type}' context
      _message: {
        getFormat: () => IntlMessageFormat;
        message: (options: { type: string }) => string;
      };
    };
    UniverseMap: {
      legend: {
        heading: {
          // Template: Hint
          hint: LiteralLocalizationLeaf;
          // Template: Legend
          legend: LiteralLocalizationLeaf;
        };
        // Template: Click and hold the left mouse button to drag the map. Click and hold the right mouse button to rotate. Use the mousewheel to zoom.
        text1: LiteralLocalizationLeaf;
      };
      setting: {
        country: {
          // Template: Factions
          label: LiteralLocalizationLeaf;
        };
        filters: {
          // Template: Filters
          label: LiteralLocalizationLeaf;
        };
        highlights: {
          // Template: Highlights
          label: LiteralLocalizationLeaf;
        };
        // Template: Use mouse left to pan, mouse right to rotate, mouse wheel to zoom
        hint: {
          // Template: Hint
          label: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        population: {
          // Template: Population
          label: LiteralLocalizationLeaf;
        };
        resources: {
          // Template: Resources
          label: LiteralLocalizationLeaf;
        };
      };
    };
    UniverseMapPanel: {
      // Template: Universe Map
      title: LiteralLocalizationLeaf;
    };
    Unpack: {
      action: {
        // Template: all
        all: LiteralLocalizationLeaf;
        // Template: 1
        unpack1: LiteralLocalizationLeaf;
        // Template: 10
        unpack10: LiteralLocalizationLeaf;
        // Template: 5
        unpack5: LiteralLocalizationLeaf;
        // Template: Unpack all
        unpackAll: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Address
        address: LiteralLocalizationLeaf;
        // Template: Engineer bundles
        engineer: LiteralLocalizationLeaf;
        // Template: Pioneer bundles
        pioneer: LiteralLocalizationLeaf;
        // Template: Scientist bundles
        scientists: LiteralLocalizationLeaf;
        // Template: Settler bundles
        settler: LiteralLocalizationLeaf;
        // Template: Technician bundles
        technician: LiteralLocalizationLeaf;
        // Template: Store type
        type: LiteralLocalizationLeaf;
      };
    };
    UnpackPanel: {
      context: {
        // Template: Inventory
        inventory: LiteralLocalizationLeaf;
      };
      error: {
        // Template: Unknown store
        store: LiteralLocalizationLeaf;
      };
      // Template: Unpacking Bundles
      title: LiteralLocalizationLeaf;
    };
    UpgradeInfrastructureComponent: {
      error: {
        // Template: This infrastructure is currently being upgraded
        ongoingUpgrade: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Address
        address: LiteralLocalizationLeaf;
        // Template: Constructor
        _constructor: LiteralLocalizationLeaf;
        // Template: Currency
        currency: LiteralLocalizationLeaf;
        // Template: Deadline
        deadline: LiteralLocalizationLeaf;
        // Template: Infrastructure
        infrastructure: LiteralLocalizationLeaf;
        // Template: Parameters
        parameters: LiteralLocalizationLeaf;
        // Template: Payment
        payment: LiteralLocalizationLeaf;
        // Template: Status
        status: LiteralLocalizationLeaf;
      };
    };
    UpkeepInfrastructureComponent: {
      label: {
        // Template: Address
        address: LiteralLocalizationLeaf;
        // Template: Contractor
        contractor: LiteralLocalizationLeaf;
        // Template: Currency
        currency: LiteralLocalizationLeaf;
        // Template: Current upkeep phase
        currentUpkeepPhase: LiteralLocalizationLeaf;
        // Template: Infrastructure
        infrastructure: LiteralLocalizationLeaf;
        // Template: Start at upkeep phase
        initialPeriod: LiteralLocalizationLeaf;
        // Template: Payment per phase
        payment: LiteralLocalizationLeaf;
        // Template: Service level objective
        serviceLevel: LiteralLocalizationLeaf;
        // Template: Upkeep phase end
        upkeepPhaseEnd: LiteralLocalizationLeaf;
        // Template: Upkeep phases
        upkeepPhases: LiteralLocalizationLeaf;
      };
    };
    UserLicenseTile: {
      context: {
        // Template: License Time Gifting
        gifting: LiteralLocalizationLeaf;
      };
      // Template: License Details
      details: {
        // Template: Your PRO subscription expired and you now have a BASIC license. To get unlimited access to APEX you will have to acquire a PRO subscription again.
        BASIC: LiteralLocalizationLeaf;
        // Template: Your account is currently on a FREE license. Upgrade to PRO today to get unlimited access to all of APEX' features, including corporation management, foreign exchange trading and many more. A PRO license is also a prerequisite for a company rating which is required for access to restricted markets and private contracts.{linebreak}Once your PRO license expires you will fall back to a BASIC license, which will retain some functionality, such as accepting custom contracts from other licencees.
        FREE: {
          getFormat: () => IntlMessageFormat;
          message: (options: { linebreak: string }) => string;
        };
        // Template: You have an active PRO subscription which grants you unlimited access to all features of the APEX network.
        PRO: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Expiry
      expiry: LiteralLocalizationLeaf;
      // Template: Current License
      license: {
        // Template: gift PRO
        gift: LiteralLocalizationLeaf;
        // Template: manage license
        manage: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: APEX License Status
      title: LiteralLocalizationLeaf;
    };
    UserList: {
      // Template: Users (offline)
      headerOffline: LiteralLocalizationLeaf;
      // Template: Users (online)
      headerOnline: LiteralLocalizationLeaf;
    };
    UserOffices: {
      label: {
        // Template: Current offices
        current: LiteralLocalizationLeaf;
        // Template: Past offices
        past: LiteralLocalizationLeaf;
      };
      office: {
        // Template: {count}x {office} at {address}
        multiple: {
          getFormat: () => IntlMessageFormat;
          message: (options: { count: string; office: string; address: string }) => string;
        };
        // Template: {office} at {address}
        single: {
          getFormat: () => IntlMessageFormat;
          message: (options: { office: string; address: string }) => string;
        };
      };
    };
    UserPanel: {
      action: {
        // Template: Block User
        blacklist: {
          // Template: Are you sure you want to prevent this user from accepting your local market ads?
          confirmation: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Contact User
        contact: LiteralLocalizationLeaf;
        // Template: Unblock User
        deblacklist: LiteralLocalizationLeaf;
        // Template: Impersonate
        impersonate: LiteralLocalizationLeaf;
        // Template: Mute User
        mute: {
          // Template: Are you sure you want to globally mute this user?
          confirmation: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Unmute User
        unmute: LiteralLocalizationLeaf;
      };
      context: {
        // Template: User information
        offices: LiteralLocalizationLeaf;
      };
      data: {
        // Template: {count, plural, =0 {Currently inactive} one {Active one day per week} other {Active ~# days per week}}
        activeDaysPerWeek: {
          getFormat: () => IntlMessageFormat;
          message: (options: { count: number }) => string;
        };
        // Template: Activity
        activity: LiteralLocalizationLeaf;
        // Template: Badges
        badges: LiteralLocalizationLeaf;
        // Template: Company
        company: LiteralLocalizationLeaf;
        // Template: Registered
        created: LiteralLocalizationLeaf;
        // Template: PRO license gifts
        gifts: LiteralLocalizationLeaf;
        // Template: Name
        name: LiteralLocalizationLeaf;
        // Template: Connection Status
        online: {
          // Template: offline
          no: LiteralLocalizationLeaf;
          // Template: connected
          yes: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
      error: {
        // Template: No user for input '{input}'.
        id: {
          getFormat: () => IntlMessageFormat;
          message: (options: { input: string }) => string;
        };
      };
      title: {
        // Template: User
        loading: LiteralLocalizationLeaf;
      };
    };
    UserSelector: {
      input: {
        // Template: Enter user name
        placeholder: LiteralLocalizationLeaf;
      };
      suggestions: {
        title: {
          // Template: Search results
          searchResults: LiteralLocalizationLeaf;
          // Template: Search results (20+)
          searchResults20: LiteralLocalizationLeaf;
        };
      };
    };
    // Template: CONS {count}
    UsersOnlineCount: {
      getFormat: () => IntlMessageFormat;
      message: (options: { count: string }) => string;
    };
    UsersOnlinePanel: {
      // Template: Connected Users
      title: LiteralLocalizationLeaf;
      // Template: Username
      username: LiteralLocalizationLeaf;
    };
    Validation: {
      rule: {
        // Template: Must be a whole number.
        integer: LiteralLocalizationLeaf;
        // Template: Invalid name.
        matches: LiteralLocalizationLeaf;
        // Template: Must be less than or equal {max}.
        max: {
          getFormat: () => IntlMessageFormat;
          message: (options: { max: string }) => string;
        };
        // Template: Must be greater than or equal {min}.
        min: {
          getFormat: () => IntlMessageFormat;
          message: (options: { min: string }) => string;
        };
        // Template: Must be a number.
        number: LiteralLocalizationLeaf;
        // Template: This field is required.
        required: LiteralLocalizationLeaf;
      };
    };
    Warehouse: {
      action: {
        // Template: Cancel {units}
        cancel: {
          getFormat: () => IntlMessageFormat;
          message: (options: { units: string }) => string;
        };
        // Template: Rent {units}
        rent: {
          getFormat: () => IntlMessageFormat;
          message: (options: { units: string }) => string;
        };
      };
      // Template: {available} / {total}
      availableUnits: {
        // Template: unlimited
        unlimited: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { available: string; total: string }) => string;
      };
      // Template: {weight}t / {volume}m³
      capacity: {
        getFormat: () => IntlMessageFormat;
        message: (options: { weight: string; volume: string }) => string;
      };
      command: {
        // Template: open store
        openStore: LiteralLocalizationLeaf;
      };
      context: {
        // Template: Local Rules
        localrules: LiteralLocalizationLeaf;
        // Template: Planet
        planet: LiteralLocalizationLeaf;
        // Template: Warehouse
        warehouse: LiteralLocalizationLeaf;
      };
      error: {
        // Template: Could not find warehouse for input {input}.
        id: LiteralLocalizationLeaf;
        // Template: This planet has no warehouse.
        nowar: LiteralLocalizationLeaf;
      };
      // Template: {fee}{linebreak}collected by {collector}
      fee: {
        getFormat: () => IntlMessageFormat;
        message: (options: { fee: string; linebreak: string; collector: string }) => string;
      };
      header: {
        // Template: Contributions
        contributions: LiteralLocalizationLeaf;
        // Template: Expansion
        expansion: LiteralLocalizationLeaf;
        // Template: Warehouse storage
        storage: LiteralLocalizationLeaf;
      };
      label: {
        // Template: Location
        address: LiteralLocalizationLeaf;
        // Template: Units
        cancelUnits: LiteralLocalizationLeaf;
        // Template: Capacity
        capacity: LiteralLocalizationLeaf;
        // Template: Cmd
        command: LiteralLocalizationLeaf;
        // Template: Weekly rental fee
        fee: {
          // Template: If you cannot afford paying the rental fee, your warehouse store will be locked and inaccessible to you until the fee is paid.
          info: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: Fees
        feeCollector: LiteralLocalizationLeaf;
        // Template: Level
        level: LiteralLocalizationLeaf;
        // Template: Status
        locked: LiteralLocalizationLeaf;
        // Template: This warehouse has reached its maximum level and cannot be expanded further
        maxedOut: LiteralLocalizationLeaf;
        // Template: Operator
        operator: LiteralLocalizationLeaf;
        // Template: Next fee payment
        payment: LiteralLocalizationLeaf;
        // Template: Units
        rentUnits: LiteralLocalizationLeaf;
        // Template: Max. units per company
        rentableUnits: LiteralLocalizationLeaf;
        // Template: Unit size
        size: LiteralLocalizationLeaf;
        // Template: Store
        store: LiteralLocalizationLeaf;
        // Template: Available units
        units: LiteralLocalizationLeaf;
        // Template: Rented units
        unitsRented: LiteralLocalizationLeaf;
      };
      // Template: {address} Warehouse
      name: {
        getFormat: () => IntlMessageFormat;
        message: (options: { address: string }) => string;
      };
      size: {
        // Template: 500t / 500m³
        _default: LiteralLocalizationLeaf;
      };
      status: {
        // Template: locked
        locked: LiteralLocalizationLeaf;
        // Template: operational
        operational: LiteralLocalizationLeaf;
      };
      // Template: Warehouse: {name}
      title: {
        // Template: Warehouse
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
      // Template: {units} / {rentableUnits}
      unitsRented: {
        getFormat: () => IntlMessageFormat;
        message: (options: { units: string; rentableUnits: string }) => string;
      };
    };
    Window: {
      action: {
        // Template: x
        close: {
          // Template: Close buffer
          alt: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
        // Template: _
        minimize: {
          // Template: Minimize buffer
          alt: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: void) => string;
        };
      };
    };
    WithCompany: {
      // Template: Creating a company through the mobile APEX console is not supported at this time. Please use a desktop browser to set up your company. Thank you very much for your understanding.
      error: LiteralLocalizationLeaf;
    };
    Workforce: {
      // Template: Engineers
      ENGINEER: LiteralLocalizationLeaf;
      // Template: ENG
      ENGINEER_TICKER: LiteralLocalizationLeaf;
      // Template: Pioneers
      PIONEER: LiteralLocalizationLeaf;
      // Template: PIO
      PIONEER_TICKER: LiteralLocalizationLeaf;
      // Template: Scientists
      SCIENTIST: LiteralLocalizationLeaf;
      // Template: SCI
      SCIENTIST_TICKER: LiteralLocalizationLeaf;
      // Template: Settlers
      SETTLER: LiteralLocalizationLeaf;
      // Template: SET
      SETTLER_TICKER: LiteralLocalizationLeaf;
      // Template: Technicians
      TECHNICIAN: LiteralLocalizationLeaf;
      // Template: TEC
      TECHNICIAN_TICKER: LiteralLocalizationLeaf;
    };
    Workforces: {
      // Template: Category
      category: LiteralLocalizationLeaf;
      // Template: Days
      days: {
        // Template: The number of days your supplies will last given the current consumption rate.
        info: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Essential
      essential: {
        // Template: Efficiency losses from running out of essential consumables are higher than for non-essential ones. If a workforce runs out of all essential consumables, it will stop working altogether.
        info: LiteralLocalizationLeaf;
        // Template: yes
        yes: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Needs
      needs: LiteralLocalizationLeaf;
      // Template: Required
      required: LiteralLocalizationLeaf;
      // Template: Workforce Size / Capacity
      size: LiteralLocalizationLeaf;
      // Template: {size} / {capacity}
      sizeCapacity: {
        getFormat: () => IntlMessageFormat;
        message: (options: { size: string; capacity: string }) => string;
      };
      // Template: Total
      total: {
        // Template: The total units consumed per day across all workforce tiers.
        info: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: void) => string;
      };
      // Template: Total Satisfaction
      totalSatisfaction: LiteralLocalizationLeaf;
      // Template: {units, plural, one {{units} unit} other {{units} units}} / day / 100
      unitsPer100: {
        getFormat: () => IntlMessageFormat;
        message: (options: { units: string }) => string;
      };
      // Template: {units, plural, one {{units} unit} other {{units} units}} / day
      unitsPerInterval: {
        getFormat: () => IntlMessageFormat;
        message: (options: { units: string }) => string;
      };
    };
    WorkforcesPanel: {
      error: {
        // Template: Base not found.
        siteId: LiteralLocalizationLeaf;
      };
      // Template: Workforce @ {name} Base
      title: {
        // Template: Workforce
        loading: LiteralLocalizationLeaf;
        getFormat: () => IntlMessageFormat;
        message: (options: { name: string }) => string;
      };
    };
    cForExPricePanelContent: {
      // Template: Volume
      volume: LiteralLocalizationLeaf;
    };
    chat: {
      messageList: {
        button: {
          // Template: load more messages
          loadMore: LiteralLocalizationLeaf;
        };
        label: {
          // Template: {users} {count, plural, one {is typing..} other {are typing..}}
          typingUser: {
            getFormat: () => IntlMessageFormat;
            message: (options: { users: string; count: number }) => string;
          };
        };
      };
      messages: {
        // Template: {user} has been temporarily banned from this channel.
        banned: {
          getFormat: () => IntlMessageFormat;
          message: (options: { user: string }) => string;
        };
        // Template: {user} deleted this message
        deleted: {
          // Template: Message has been deleted. You exceeded your messaging limit.
          auto: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: { user: string }) => string;
        };
        // Template: {name} joined.
        joined: {
          getFormat: () => IntlMessageFormat;
          message: (options: { name: string }) => string;
        };
        // Template: {name} left.
        left: {
          getFormat: () => IntlMessageFormat;
          message: (options: { name: string }) => string;
        };
        // Template: new messages
        read_status: LiteralLocalizationLeaf;
        // Template: {user} renamed channel to {name}.
        renamed: {
          // Template: Channel renamed to {name}.
          auto: LiteralLocalizationLeaf;
          getFormat: () => IntlMessageFormat;
          message: (options: { user: string }) => string;
        };
      };
    };
    comex: {
      broker: {
        info: {
          // Template: Ask
          ask: {
            // Template: Ask Amount
            amount: LiteralLocalizationLeaf;
            getFormat: () => IntlMessageFormat;
            message: (options: void) => string;
          };
          // Template: Bid
          bid: {
            // Template: Bid Amount
            amount: LiteralLocalizationLeaf;
            getFormat: () => IntlMessageFormat;
            message: (options: void) => string;
          };
          // Template: High
          high: {
            // Template: All-time High
            allTime: LiteralLocalizationLeaf;
            getFormat: () => IntlMessageFormat;
            message: (options: void) => string;
          };
          // Template: Low
          low: {
            // Template: All-time Low
            allTime: LiteralLocalizationLeaf;
            getFormat: () => IntlMessageFormat;
            message: (options: void) => string;
          };
          // Template: Price Average
          priceAverage: LiteralLocalizationLeaf;
          // Template: Traded
          traded: LiteralLocalizationLeaf;
          // Template: Volume
          volume: LiteralLocalizationLeaf;
        };
      };
    };
    game: {
      loading: {
        // Template: Materials
        categories: LiteralLocalizationLeaf;
        // Template: Communication
        channels: LiteralLocalizationLeaf;
        // Template: Company data
        company: LiteralLocalizationLeaf;
        // Template: Contracts
        contracts: LiteralLocalizationLeaf;
        // Template: Corporation
        corporation: LiteralLocalizationLeaf;
        // Template: Factions
        countries: LiteralLocalizationLeaf;
        // Template: Sectors
        sectors: LiteralLocalizationLeaf;
        // Template: Fleet
        ships: LiteralLocalizationLeaf;
        // Template: Configuration
        simulation: LiteralLocalizationLeaf;
        // Template: Bases
        sites: LiteralLocalizationLeaf;
        // Template: Navigation
        stars: LiteralLocalizationLeaf;
        // Template: Inventory
        stores: LiteralLocalizationLeaf;
        // Template: APEX Subsystems
        uidata: LiteralLocalizationLeaf;
      };
    };
    ships: {
      action: {
        // Template: cargo
        cargo: LiteralLocalizationLeaf;
        // Template: fly
        fly_to: LiteralLocalizationLeaf;
        // Template: fuel
        fuel: LiteralLocalizationLeaf;
        // Template: unload
        unload: LiteralLocalizationLeaf;
        // Template: view
        view: LiteralLocalizationLeaf;
      };
      status: {
        // Template: stationary
        stationary: LiteralLocalizationLeaf;
      };
    };
  }
}
