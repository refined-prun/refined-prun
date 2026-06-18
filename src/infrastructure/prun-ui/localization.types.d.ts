export {};

declare global {
  interface PrunLocalization {
    AccountCategory: {
      // Template: Current Assets
      CURRENT_ASSETS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Equity
      EQUITY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Expenses
      EXPENSES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Fixed Assets
      FIXED_ASSETS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Liabilities
      LIABILITIES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Liquid Assets
      LIQUID_ASSETS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Revenue
      REVENUE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    AccountType: {
      // Template: Cash ({currencyCode})
      CASH: ((options: { currencyCode: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Deposits ({currencyCode})
      CASH_ESCROW: ((options: { currencyCode: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Company Headquarters Contributions
      COMPANY_HEADQUARTER_CONTRIBUTIONS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contracts Write-off
      CONTRACT_WRITE_OFF: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Currency Contribution Revenue
      CONTRIBUTION_REVENUE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Corporation Project Contributions
      CORPORATION_PROJECT_CONTRIBUTIONS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Debt
      DEBT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Dividend Income
      DIVIDEND_INCOME: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: General Expenses
      EXPENSE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Extraordinary Income
      EXTRAORDINARY_INCOME: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Financial Write-off
      FINANCIAL_WRITE_OFF: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Fixed Capital
      FIXED_CAPITAL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Currency Sales
      FOREX_EXPENSE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Currency Fluctuations
      FOREX_FLUCTUATION_EXPENSE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Currency Fluctuations
      FOREX_FLUCTUATION_REVENUE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Currency Sales
      FOREX_REVENUE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Fuel Consumption
      FUEL_CONSUMPTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Gateway Fees
      GATEWAY_FEES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Gateway Fee Revenue
      GATEWAY_FEE_REVENUES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Government Program Fees
      GOVERNMENT_PROGRAM_FEE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Holdings
      HOLDINGS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Holdings Write-off
      HOLDINGS_WRITE_OFF: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Interest Expenses
      INTEREST_EXPENSE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Interest Revenue
      INTEREST_INCOME: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Inventory
      INVENTORY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Loans
      LOANS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Local Market Fee Revenue
      LOCAL_MARKET_FEE_REVENUE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Loss Carried Forward
      LOSS_CARRIED_FORWARD: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Material Consumption
      MATERIAL_CONSUMPTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Materials Delivered
      MATERIAL_DELIVERY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Materials in Escrow
      MATERIAL_ESCROW: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Material Sales
      MATERIAL_SALE_REVENUE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Payables
      PAYABLES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Planetary Project Contributions
      PLANETARY_PROJECT_CONTRIBUTIONS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Base Sections
      PLATFORMS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Production Fees
      PRODUCTION_FEES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Production Fee Revenue
      PRODUCTION_FEE_REVENUE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Profit Carried Forward
      PROFIT_CARRIED_FORWARD: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Receipt of Materials
      RECEIPT_OF_GOODS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Receivables
      RECEIVABLES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Receivable Materials
      RECEIVABLE_MATERIALS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: APEX Representation Center Contributions
      REPRESENTATION_CENTER_CONTRIBUTIONS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: General Revenue
      REVENUE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ships
      SHIPS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship Maintenance
      SHIP_MAINTENANCE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Bases
      SITES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Depreciation of Buildings
      SITE_DEPRECIATION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Base Establishment Fees
      SITE_ESTABLISHMENT_TAXES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Base Establishment Fee Revenue
      SITE_ESTABLISHMENT_TAXES_REVENUE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Subscribed Capital
      SUBSCRIBED_CAPITAL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Transaction Fees
      TRANSACTION_FEES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Transport Expenses
      TRANSPORT_EXPENSES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Transport Revenue
      TRANSPORT_REVENUE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Warehouse Storage Fee Revenue
      WAREHOUSE_FEE_REVENUE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Warehouse Storage Fees
      WAREHOUSE_STORAGE_FEE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Worker Supplies
      WORKER_SUPPLIES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ActionComponent: {
      action: {
        // Template: Confirm
        confirm: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ActionFeedback: {
      // Template: Cancel
      cancel: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Confirmation required
      confirmation: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: (click to dismiss)
      dismiss: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: in progress…
      inprogress: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Action succeeded!
      success: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ActionStatus: {
      // Template: No local rule changes left in this term.
      ADMIN_CENTER_NO_RULE_CHANGES_LEFT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You don't have voting rights on this planet.
      ADMIN_CENTER_NO_VOTING_RIGHTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The voting phase cannot be started, because it would end after the government's term ends.
      ADMIN_CENTER_VOTE_END_AFTER_TERM_END: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Authentication failed.
      AUTHENTICATION_FAILED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: To execute this action a PRO license is necessary.
      AUTHORIZATION_FAILED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Account does not exist.
      AUTH_LOGIN_ACCOUNT_NOT_FOUND: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Login failed for unknown reason.
      AUTH_LOGIN_FAILED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Wrong password.
      AUTH_LOGIN_PASSWORD_INVALID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You do not have access permissions for this instance.
      AUTH_LOGIN_PERMISSION_DENIED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You have been blocked by the user.
      BLOCKLIST_BLOCKED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Channel already joined.
      CHAT_ALREADY_JOINED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: No permission to post in this channel.
      CHAT_NOT_ALLOWED_ADD_MESSAGE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: No permission to add users to this channel.
      CHAT_NOT_ALLOWED_ADD_USER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: No read permission in this channel.
      CHAT_NOT_ALLOWED_READ_INFORMATION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: No permission to read messages in this channel.
      CHAT_NOT_ALLOWED_READ_MESSAGES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: No permission to see user list in this channel.
      CHAT_NOT_ALLOWED_READ_USERS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Not a member of this channel.
      CHAT_NOT_JOINED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Channel does not exist.
      CHAT_NO_SUCH_CHANNEL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You don't have the permission to post an order outside the broker's price band!
      COMEX_BROKER_LIMIT_OUTSIDE_PRICE_BAND: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Order already exists.
      COMEX_BROKER_ORDER_EXISTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Cannot place order that would match existing own order.
      COMEX_BROKER_ORDER_SPREAD_NEGATIVE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You have reached the maximum amount of unfilled orders for this broker.
      COMEX_BROKER_TOO_MANY_ORDERS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Invalid ticker.
      COMEX_TICKER_INVALID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Order not found.
      COMEX_TRADER_ORDER_ID_INVALID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Please provide a storage location.
      COMEX_TRADER_ORDER_STORE_REQUIRED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The limit of active contracts has been reached.
      CONTRACT_ACTIVE_CONTRACT_LIMIT_REACHED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contract condition not found.
      CONTRACT_CONDITION_ID_INVALID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Condition currently cannot be fulfilled.
      CONTRACT_CONDITION_UNFULFILLABLE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contract not found.
      CONTRACT_ID_INVALID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Invalid contract status.
      CONTRACT_STATUS_INVALID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You need a base on the planet to contribute.
      CONTRIBUTIONS_NO_SITE_ON_PLANET: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Company has already been invited.
      CORPORATION_COMPANY_ALREADY_INVITED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Company is already member of a corporation.
      CORPORATION_COMPANY_ALREADY_SHAREHOLDER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: This action requires Corporation Headquarters.
      CORPORATION_MANAGER_NO_HQ: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The project limit has been exceeded.
      CORPORATION_MANAGER_PROJECT_LIMIT_EXCEEDED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Invited company is already member of a corporation.
      CORPORATION_SHAREHOLDER_CORPORATION_EXISTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Company is already member of a corporation.
      CORPORATION_SHAREHOLDER_HOLDING_EXISTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Company is not member of a corporation.
      CORPORATION_SHAREHOLDER_NO_CORPORATION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Country ID invalid.
      COUNTRY_ID_INVALID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: This code is already taken.
      ENTITY_CODE_EXISTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Entity ID validation failed.
      ENTITY_ID_VALIDATION_FAILED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: This name is already taken.
      ENTITY_NAME_EXISTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You have reached the maximum amount of unfilled orders for this broker.
      FOREX_BROKER_TOO_MANY_ORDERS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Invalid order id.
      FOREX_TRADER_ORDER_ID_INVALID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Illegal order limit.
      FOREX_TRADER_ORDER_LIMIT_ILLEGAL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Cannot place order that would match existing own order.
      FOREX_TRADER_ORDER_SPREAD_ILLEGAL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Illegal arguments.
      ILLEGAL_ARGUMENTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Insufficient inventory.
      INVENTORY_INSUFFICIENT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You reached the ad acceptation limit, try again later.
      LOCAL_MARKET_ACCEPTION_RATE_LIMIT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: This local market ad has expired.
      LOCAL_MARKET_AD_EXPIRED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You cannot accept this ad, because its creator has blocked you.
      LOCAL_MARKET_BLACKLIST_ACCEPTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You need a base or warehouse unit on the planet to post an ad.
      LOCAL_MARKET_MISSING_SITE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Origin and destination cannot be the same location.
      LOCAL_MARKET_ORIGIN_DESTINATION_EQUAL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Either origin or destination has to be the location of the local market.
      LOCAL_MARKET_ORIGIN_DESTINATION_INVALID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You cannot accept your own ads.
      LOCAL_MARKET_OWN_AD_ACCEPTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Invalid amount.
      MONEY_AMOUNT_INVALID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Currencies do not match.
      MONEY_CURRENCY_MISMATCH: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Insufficient cash.
      MONEY_INSUFFICIENT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The chosen name is already taken.
      NAMING_NAME_TAKEN: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Nothing found.
      NOT_FOUND: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: There is no free plot on the planet to build the project.
      PLANET_NO_FREE_PLOT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: This type of site is not allowed on the planet.
      PLANET_SITE_TYPE_NOT_ALLOWED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Order not found.
      PRODUCTION_ORDER_ID_INVALID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Order has already been started.
      PRODUCTION_ORDER_STARTED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Invalid recipe.
      PRODUCTION_RECIPE_INVALID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: No production slot available.
      PRODUCTION_SLOT_LIMIT_REACHED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Your company's rating is insufficient
      RATING_INSUFFICIENT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Routing failed.
      ROUTING_FAILED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: This project was already started and cannot be deleted anymore.
      SHIPYARD_PROJECT_IN_PROGRESS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Materials have already been paid for this project. Remove them before deleting it.
      SHIPYARD_PROJECT_MATERIALS_PAID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: No difference between the selected blueprints.
      SHIPYARD_SAME_BLUEPRINTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The selected ship is already being upgraded.
      SHIPYARD_SHIP_ALREADY_UPGRADING: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The selected ship's inventory or fuel tanks are not empty.
      SHIPYARD_SHIP_NOT_EMPTY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The selected ship's blueprint is different from the upgrade project's origin blueprint.
      SHIPYARD_WRONG_SHIP_BLUEPRINT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Repairing a ship requires a base or shipyard.
      SHIP_ILLEGAL_REPAIR_LOCATION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Route is invalid.
      SHIP_INVALID_ROUTE_ES_324: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship is in transit.
      SHIP_IN_TRANSIT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Failure to launch, the ship is currently not operational.
      SHIP_NOT_OPERATIONAL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Flight not found.
      SHIP_NO_SUCH_FLIGHT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship not found.
      SHIP_NO_SUCH_SHIP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Failure to launch, there are currently too many ships now in flight. Upgrade to a PRO license for unlimited flight options.
      SHIP_TOO_MANY_FLIGHTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You cannot demolish a base with an expanded area.
      SITE_DEMOLISH_EXPANDED_AREA_IMPOSSIBLE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You have to empty your base's storage first.
      SITE_DEMOLISH_FILLED_STORAGE_IMPOSSIBLE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You cannot demolish your HQ.
      SITE_DEMOLISH_HQ_IMPOSSIBLE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You have to demolish all other buildings first.
      SITE_DEMOLISH_WITH_BUILDINGS_IMPOSSIBLE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You already have a base on this planet.
      SITE_EXISTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Module not found.
      SITE_MODULE_ID_INVALID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: No free plots available.
      SITE_NO_FREE_PLOTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Illegal build option.
      SITE_PLATFORM_BUILD_OPTION_ILLEGAL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Platform not found.
      SITE_PLATFORM_ID_INVALID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Platform already in use.
      SITE_PLATFORM_NOT_EMPTY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Reactor is currently in use.
      SITE_REACTOR_IN_USE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Too close to existing site.
      SITE_TOO_CLOSE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: No base or warehouse storage found.
      STORAGE_NO_FIXED_STORE_FOUND: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Storage location not found.
      STORAGE_STORE_NOT_FOUND: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Material transfer impossible.
      STORAGE_TRANSFER_IMPOSSIBLE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Failed to receive transfer.
      STORAGE_TRANSFER_RECEIVE_FAILED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Insufficient capacity.
      STORE_CAPACITY_INSUFFICIENT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Insufficient materials.
      STORE_QUANTITY_INSUFFICIENT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Your APEX license does not allow the registration of single-letter company codes.
      USER_CREATE_COMPANY_1_LETTER_CODE_PERK_REQUIRED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Your APEX license does not allow the registration of 2-letter company codes.
      USER_CREATE_COMPANY_2_LETTER_CODE_PERK_REQUIRED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You already have a company.
      USER_CREATE_COMPANY_EXISTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You are not eligible to gift PRO license time
      USER_LICENSE_GIVER_INELIGIBLE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You do not have enough PRO license time left to gift the selected amount
      USER_LICENSE_INSUFFICIENT_BALANCE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The selected license gift recipient is invalid
      USER_LICENSE_INVALID_TARGET: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Gifting PRO license time is not supported.
      USER_LICENSE_UNSUPPORTED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You reached the maximum amount of allowed storage units for this warehouse.
      WAREHOUSE_MAXIMUM_UNITS_REACHED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The warehouse store needs to be empty before it can be cancelled.
      WAREHOUSE_NOT_EMPTY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The warehouse fee has not been fully paid yet.
      WAREHOUSE_NOT_PAID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ActionsPanel: {
      table: {
        // Template: ID
        id: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Action Type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    AdStatus: {
      // Template: accepted
      ACCEPTED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: breached
      BREACHED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: expired
      EXPIRED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: fulfilled
      FULFILLED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: open
      OPEN: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    AddUser: {
      form: {
        // Template: add
        add: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: cancel
        cancel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Add user
        header: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Username
        username: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    AddressConditionEditForm: {
      form: {
        // Template: Address
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    AddressLabel: {
      // Template: {address} (orbit)
      withOrbit: ((options: { address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {address}
      withoutOrbit: ((options: { address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    AddressSelector: {
      input: {
        // Template: Enter location
        placeholder: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      suggestions: {
        title: {
          // Template: Search results
          searchResults: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Search results (20+)
          searchResults20: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    AdminCenter: {
      // Template: Location
      address: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      context: {
        // Template: Admin Center
        admincenter: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Government
        government: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Local Rules
        localrules: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planet
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Currency
      currency: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      current: {
        // Template: End
        end: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Governor
        governor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Members of Parliament
        membersOfParliament: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Parliament size
        parliamentSize: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The more bases a planet has, the higher the number of parliament seats. Parliament seats will be distributed among candidates who received the most votes, with the top one becoming the governor. With the approval vote system every voter can vote for as many candidates as they approve of.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Start
        start: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Term
        term: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      currentTerm: {
        // Template: No active term yet.
        noterm: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No administration center found for input {input}.
        id: ((options: { input: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: This planet has no administration center.
        noadm: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Error loading administration center.
        notFound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      previous: {
        // Template: Term end
        ended: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        governor: {
          // Template: Governor
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Members of Parliament
        membersOfParliament: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Term
        naturalId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      section: {
        // Template: Current term
        currentTerm: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Previous terms
        previousTerms: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upcoming term
        upcomingTerm: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Administration center: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Administration Center
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      upcoming: {
        action: {
          // Template: run
          run: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: vote
          vote: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: withdraw
          withdraw: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: withdraw
          withdrawVote: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        candidate: {
          // Template: Command
          command: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Corporation
          corporation: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Faction
          country: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Candidate
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Election end
        electionEnd: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Election start
        electionStart: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Parliament size
        parliamentSize: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    AdminCenterTermVotes: {
      candidate: {
        // Template: Corporation
        corporation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Faction
        country: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Candidate
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Votes
        votes: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    AgentPreamble: {
      // Template: Faction Contract Offers{br}~~~~~~~~~~~~~~~~~~~~~~~{br}You received a series of contract offers from your faction. Feel free to accept one of them to boost your faction reputation. As soon as you accept one the others will get cancelled.{br}
      intro: ((options: { br: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      introductory: {
        // Template: On behalf of {country} I wish you and your company the best of success. We are eager to follow your endeavors from here on out.{br}At this point you should have gone through basic APEX training. I will now provide you with a set of tasks to make sure you are able to navigate your command interface at a sufficient level of proficiency. Should you pass, I will regularly forward you requests from faction ambassadors and representatives that may help you generate some additional funds.{br}First things first, to become a valuable asset to our faction you need to get your production running. Click the 'START BASE' button on your starting screen to found your first base, which will automatically be declared your company headquarters for now.{br}Once you are done, APEX will guide you to build a few recommended starting buildings. Then I will get back to you!
        baseConstruction: ((options: { country: string; br: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Your expansion package is ready for collection. The {country} is confident in your ability to lead your company to success and to support its future endeavors.{br}{br}As a gesture of goodwill, once you have established your new base, you will be eligible to receive additional consumables for your workforce, as well as a founding bonus.{br}{br}Maintain your current performance, continue trading, and consider further expansion when appropriate. The faction will continue to provide contract offers on a regular basis. However, responsibility for developing your core business now rests solely with you.
        baseConstructionII: ((options: { country: string; br: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Now that you are all set up in APEX, keep working towards scaling up your business.{br}One of the first steps you should look into is constructing additional buildings that either expand your existing production lines or add new ones.{br}Explore your base's construction menu and the commodities each building can produce. Keep in mind you will need to acquire the necessary input materials, either by producing them yourself or buying them from other companies on the market. And do not forget about expanding your workforce housing if necessary, as well as providing enough consumables.
        buildingConstruction: ((options: { br: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: The representatives of {country} have been observing your progress with satisfaction.{br}While you are likely already attending to this, they want to ensure that your workers’ needs are being met. Submit an invoice for a consumable purchase, and I will confirm your reliability to them.{br}The faction will reimburse the fuel required to collect the goods and return them to your base.
        buyConsumables: ((options: { country: string; br: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: channel
        channel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: It is time to expand your operations. Consider carefully where you wish to establish an additional base.{br}The faction is currently assembling an expansion package. In the meantime, proceed to the think tank and develop an expansion plan. I will contact you once the package is ready.{br}The {map} is a useful tool for identifying a suitable location. You may also want to consult fellow CEOs via your planet’s {comPlanet} or the global help {comHelp}.{br}Note: Planets with extreme environmental conditions require specialized building materials, which must be supplied by you. Please refer to the APEX handbook for further details.
        findExpansionSpot: ((options: {
          br: string;
          map: string;
          comPlanet: string;
          comHelp: string;
        }) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: map
          map: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Alright, the last thing we will need to check is if your trading interface works properly.{br}Just ping me later by fulfilling this contract!{br}In the meantime, you may want to explore the APEX handbook and find out about politics, planetary projects, local markets or ship building. There are a lot of advanced features to be explored and plans to be made for the future of your career and your company!
        finishFlight: ((options: { br: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Over the coming days, the faction would like you to demonstrate your value. As a first step, I will begin sending you contracts on a regular basis. You will typically be able to choose one of three. Select the options that best balance effort and reward within your daily routine.
        fulfillCountryContracts: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Your company is performing well. The faction considers reinvesting your hard-earned profits into luxury consumables for your workforce to be a highly effective strategy. This will increase satisfaction and morale, leading to greater production efficiency.{br}Raise at least one {workforce} satisfaction level above 80%, and we can begin discussing major expansion efforts.
        increaseSatisfaction: ((options: { br: string; workforce: string }) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: workforce
          workforce: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Before investing more resources to scale your startup, the faction wants you to demonstrate your business savvy.{br}Keep trading on the commodity exchanges, or take on a few shipping contracts. Once you’ve proven your capability, they’ll get back to you.
        makeMoney: ((options: { br: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Thank you for the reminder! We should test one final component before we can integrate your company into the regular faction task process. Go buy or sell any item at a commodity exchange and let me know when you are done!{br}Note that I will also grant your company account a first faction reputation point. These points are a measure of your faction services and will make officials consider granting you more substantial payments in the future.{br}In any case, you seem to be getting the hang of APEX pretty quickly! I will collect a few "real" tasks now that need to get done within the faction and will get back to you soon.
        placeOrder: ((options: { br: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Good! Now, I need to check in on a few other startup companies, but I will get back to you with more tasks when your production run is done.{br}Just ping me later by fulfilling this contract!{br}In the meantime, feel free to chat with other APEX users (find your communication channels you have access to via the "COM" button on the left) or explore additional resources via the HELP command. You may also want to look into more involved commodities to produce in the future. Your production chains will not stay this basic forever!
        productionOrderCompleted: ((options: { br: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: You should have set up habitations for your pioneers and a few production facilities at this point. Now check if everything is working properly by starting your first production order!{br}Make sure you have enough consumables and input material in your base's inventory.
        productionRun: ((options: { br: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Seems like everything is in order.{br}We are almost done here. Now send a ship on a mission to check whether communication works properly.{br}A good first destination might be the nearby commodity exchange station, where you could sell your first produced items and resupply with consumables.
        startFlight: ((options: { br: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {br}Mission description{br}~~~~~~~~~~~~~~~~~~~{br}
      mission: ((options: { br: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: {country} decided to incentivize contributions to public infrastructure at {address} for faction-strategic reasons. This includes contributions to building costs of public projects as well as their upkeep. {deadline}
        contribution: ((options: {
          country: string;
          address: string;
          deadline: string;
        }) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: This initiative will not last forever though.
          deadline: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: A {country} colonization ship is currently en route to visit several faction planets and bases and will soon come by your current headquarters location. The crew is building additional core modules right now to expand the faction's reach even further. If you can provide the required materials in time, the faction will show its gratitude.
        expansion: ((options: { country: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {country} continues to build a universal data library. Send a ship to this planet and hand in any environment data your sensors pick up.
        exploration: ((options: { country: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {country}'s faction strategy involves a focus on ships in a push to become known for the biggest and most impressive fleets across the universe. If you manage to expand your fleet soon, you will receive additional support. Please make sure the {country} badge is clearly visible on the hull.
        fleet: ((options: { country: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: A {country} transporter delivering food supplies to colonies in need is passing by your {planet} base soon. Make sure to provision the shipment in time so it can be picked up on the way.
        food: ((options: { country: string; planet: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: A big media outlet will soon broadcast their faction rankings. One of the rankings will be based on the conditions of randomly selected ships among the faction. Make sure your assets are in perfect condition.
        maintenance: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: A {country} transporter is passing by your {planet} base soon and has space for more commodities. Make sure to provision the shipment in time so it can be picked up on the way.
        materials: ((options: { country: string; planet: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: As you are well aware, {country} is always looking to expand its influence throughout the universe. If you can manage to get elected to govern a planet, this will go right along with these plans.
        power: ((options: { country: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: We need you to pick up and deliver a shipment of materials. {country} officials have already provisioned the container and will be taking it off your hands on site. {deadline}
        shipping: ((options: { country: string; deadline: string }) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: This is urgent, so make sure to get started on this soon.
          deadline: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: At the moment, {country} is trying to establish a prosperous future for all its companies. Therefore, they support investments into administrative structures. This program will only be active for a limited time though.
        upgrade: ((options: { country: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: (this contract)
      thisContract: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Alert: {
      // Template: The election on {planetName} is nearing its end.
      ADMIN_CENTER_ELECTION_REMINDER: ((options: { planetName: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The election at {planetName} has started.
      ADMIN_CENTER_ELECTION_STARTED: ((options: { planetName: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A new government has been elected at {planetName}.
      ADMIN_CENTER_GOVERNOR_ELECTED: ((options: { planetName: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Motion {motionId} / '{motionName}' {motionStatus}.
      ADMIN_CENTER_MOTION_ENDED: ((options: {
        motionId: string;
        motionName: string;
        motionStatus: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A new motion '{motionName}' has passed at {address}.
      ADMIN_CENTER_MOTION_PASSED: ((options: { motionName: string; address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The voting for motion {motionId} / '{motionName}' has started.
      ADMIN_CENTER_MOTION_VOTING_STARTED: ((options: {
        motionId: string;
        motionName: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The election at {planetName} has ended, but no government was elected.
      ADMIN_CENTER_NO_GOVERNOR_ELECTED: ((options: { planetName: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Your run for an office at {planetName} has been successful.
      ADMIN_CENTER_RUN_SUCCEEDED: ((options: { planetName: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The Chamber of Global Commerce at {planetName} started a new economic program: {programName}.
      COGC_PROGRAM_CHANGED: ((options: { planetName: string; programName: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The Chamber of Global Commerce at {planetName} went on strike since the required upkeep has not been contributed.
      COGC_STATUS_CHANGED: ((options: { planetName: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The Chamber of Global Commerce at {planetName} started a new upkeep phase.
      COGC_UPKEEP_STARTED: ((options: { planetName: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {commodity} order filled at {exchangeName}.
      COMEX_ORDER_FILLED: ((options: { commodity: string; exchangeName: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A contract for pickup of {commodity} has been created at {exchangeName}.
      COMEX_PICKUP_CONTRACT_CREATED: ((options: {
        commodity: string;
        exchangeName: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {trades, plural, one {A trade} other {{trades} trades}} took place for your {commodity} order at {exchangeName}.
      COMEX_TRADE: ((options: {
        trades: string;
        commodity: string;
        exchangeName: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {partner} fulfilled a contract condition for contract {contract}: {conditionType}.
      CONTRACT_CONDITION_FULFILLED: ((options: {
        partner: string;
        contract: string;
        conditionType: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You have not yet picked up the materials from contract {contract}.
      CONTRACT_CONDITION_PICKUP_CONDITION_PENDING: ((options: { contract: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The contract with {partner} has been breached.
      CONTRACT_CONTRACT_BREACHED: ((options: { partner: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The contract with {partner} has been cancelled.
      CONTRACT_CONTRACT_CANCELLED: ((options: { partner: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The contract '{contract}' with {partner} has been closed.
      CONTRACT_CONTRACT_CLOSED: ((options: { contract: string; partner: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The contract with {partner} has been extended.
      CONTRACT_CONTRACT_EXTENDED: ((options: { partner: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Received contract '{contract}' from {partner}.
      CONTRACT_CONTRACT_RECEIVED: ((options: { contract: string; partner: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {partner} has rejected your contract offer '{contract}'.
      CONTRACT_CONTRACT_REJECTED: ((options: { partner: string; contract: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contract '{contract}' with partner {partner} has been terminated.
      CONTRACT_CONTRACT_TERMINATED: ((options: { contract: string; partner: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {partner} requested the termination of the contract '{contract}'.
      CONTRACT_CONTRACT_TERMINATION_REQUESTED: ((options: {
        partner: string;
        contract: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The contract with {partner} is about to be breached. {partner} must take action to allow or deny an extension.
      CONTRACT_DEADLINE_EXCEEDED_WITHOUT_CONTROL: ((options: { partner: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The contract with {partner} is about to be breached. Your action is required to allow or deny an extension.
      CONTRACT_DEADLINE_EXCEEDED_WITH_CONTROL: ((options: { partner: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {inviteeName} have accepted our invitation to become a shareholder of {corporationName}.
      CORPORATION_MANAGER_INVITE_ACCEPTED: ((options: {
        inviteeName: string;
        corporationName: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {inviteeName} have decided to reject our invitation to become a shareholder of {corporationName}.
      CORPORATION_MANAGER_INVITE_REJECTED: ((options: {
        inviteeName: string;
        corporationName: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {companyName} have decided to leave our corporation {corporationName}.
      CORPORATION_MANAGER_SHAREHOLDER_LEFT: ((options: {
        companyName: string;
        corporationName: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The corporation project '{type}' at {address} has been finished.
      CORPORATION_PROJECT_FINISHED: ((options: { type: string; address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You have received a dividend payout from your corporation {corporationName}.
      CORPORATION_SHAREHOLDER_DIVIDEND_RECEIVED: ((options: {
        corporationName: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You have received an invitation to become a shareholder of {corporationName}.
      CORPORATION_SHAREHOLDER_INVITE_RECEIVED: ((options: {
        corporationName: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {pair} order filled.
      FOREX_ORDER_FILLED: ((options: { pair: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {trades, plural, one {A trade} other {{trades} trades}} took place for your {pair} order.
      FOREX_TRADE: ((options: { trades: string; pair: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship {ship} aborted the gateway jump at {address}: gateway link changed.
      GATEWAY_JUMP_ABORTED_LINK_CHANGED: ((options: {
        ship: string;
        address: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship {ship} aborted the gateway jump at {address}: gateway link not established.
      GATEWAY_JUMP_ABORTED_LINK_NOT_ESTABLISHED: ((options: {
        ship: string;
        address: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship {ship} aborted the gateway jump at {address}: missing gateway fee funds.
      GATEWAY_JUMP_ABORTED_MISSING_FUNDS: ((options: {
        ship: string;
        address: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship {ship} aborted the gateway jump at {address}: gateway not operational.
      GATEWAY_JUMP_ABORTED_NOT_OPERATIONAL: ((options: {
        ship: string;
        address: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship {ship} aborted the gateway jump at {address}: no jump capacity available.
      GATEWAY_JUMP_ABORTED_NO_CAPACITY: ((options: { ship: string; address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship {ship} aborted the gateway jump at {address}: no gateway fuel available.
      GATEWAY_JUMP_ABORTED_NO_FUEL: ((options: { ship: string; address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A link between gateway {gateway} and {otherGateway} has been established.
      GATEWAY_LINK_ESTABLISHED: ((options: { gateway: string; otherGateway: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Received link request for gateway {destinationGateway} from gateway {originGateway} @ {originAddress}.
      GATEWAY_LINK_REQUEST_RECEIVED: ((options: {
        destinationGateway: string;
        originGateway: string;
        originAddress: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The link between gateway {gateway} and {otherGateway} has been removed.
      GATEWAY_LINK_UNLINKED: ((options: { gateway: string; otherGateway: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The operational state of {type} infrastructure {address} changed to {state}.
      INFRASTRUCTURE_OPERATIONAL_STATE_CHANGED: ((options: {
        type: string;
        address: string;
        state: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The infrastructure project {type} at {address} has been finished.
      INFRASTRUCTURE_PROJECT_COMPLETED: ((options: { type: string; address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The upgrade of {type} {infrastructure} has been completed.
      INFRASTRUCTURE_UPGRADE_COMPLETED: ((options: {
        type: string;
        infrastructure: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The {type} {infrastructure} at {address} started upkeep phase {naturalId}.
      INFRASTRUCTURE_UPKEEP_PHASE_STARTED: ((options: {
        type: string;
        infrastructure: string;
        address: string;
        naturalId: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Your ad at the {addressName} local market has been accepted by {partner}.
      LOCAL_MARKET_AD_ACCEPTED: ((options: { addressName: string; partner: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Your ad at the {addressName} local market has expired.
      LOCAL_MARKET_AD_EXPIRED: ((options: { addressName: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The planetary project '{project}' at {address} has been finished.
      PLANETARY_PROJECT_FINISHED: ((options: { project: string; address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The population infrastructure project {type} at {address} has been upgraded to level {level}.
      POPULATION_PROJECT_UPGRADED: ((options: {
        type: string;
        address: string;
        level: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A new population report for {address} is available.
      POPULATION_REPORT_AVAILABLE: ((options: { address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {quantity, plural, one {One unit} other {{quantity} units}} of {material} have been produced at your base on {address}.
      PRODUCTION_ORDER_FINISHED: ((options: {
        quantity: string;
        material: string;
        address: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: There is a new version of APEX. Click here to read the release notes.
      RELEASE_NOTES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Shipbuilding project at {address} completed.
      SHIPYARD_PROJECT_FINISHED: ((options: { address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship {registration} arrived at its destination {destination}.
      SHIP_FLIGHT_ENDED: ((options: { registration: string; destination: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A new {category} expert arrived at your base on {address}.
      SITE_EXPERT_DROPPED: ((options: { category: string; address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Tutorial task fulfilled. Click here to see your current progress!
      TUTORIAL_TASK_FINISHED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Did you know a PRO or BASIC license grants you access to advanced features of APEX? Click to learn more!
      USER_CONVERSION_REMINDER_LICENSE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Your APEX license is expiring soon. Please consider renewing it!
      USER_LICENSE_ABOUT_TO_EXPIRE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Your APEX license has expired. Please consider renewing it!
      USER_LICENSE_EXPIRED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You received {amount, plural, one {one day} other {{amount} days}} of PRO license time from {user}.
      USER_LICENSE_GIFT_RECEIVED: ((options: { amount: string; user: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Help out by posting a Steam review!
      USER_STEAM_REVIEW: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Your warehouse storage unit at {address} has been locked due to insufficient funds for its weekly fee.
      WAREHOUSE_STORE_LOCKED_INSUFFICIENT_FUNDS: ((options: { address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Your warehouse storage unit at {address} has been unlocked.
      WAREHOUSE_STORE_UNLOCKED: ((options: { address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Welcome licensee! Click here to get started with the APEX console!
      WELCOME: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Consumable supplies at {address} are running low.
      WORKFORCE_LOW_SUPPLIES: ((options: { address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The workforce at {address} is out of supplies.
      WORKFORCE_OUT_OF_SUPPLIES: ((options: { address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The workforce at {address} is unsatisfied.
      WORKFORCE_UNSATISFIED: ((options: { address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    AlertType: {
      // Template: Election ending
      ADMIN_CENTER_ELECTION_REMINDER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Election started
      ADMIN_CENTER_ELECTION_STARTED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: New governor elected
      ADMIN_CENTER_GOVERNOR_ELECTED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Motion ended
      ADMIN_CENTER_MOTION_ENDED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: New motion
      ADMIN_CENTER_MOTION_PASSED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Motion voting started
      ADMIN_CENTER_MOTION_VOTING_STARTED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: No governor elected
      ADMIN_CENTER_NO_GOVERNOR_ELECTED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Run for governor succeeded.
      ADMIN_CENTER_RUN_SUCCEEDED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: CoGC program changed
      COGC_PROGRAM_CHANGED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: CoGC status changed
      COGC_STATUS_CHANGED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: CoGC upkeep phase started
      COGC_UPKEEP_STARTED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: CX order filled
      COMEX_ORDER_FILLED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: CX pickup contract created
      COMEX_PICKUP_CONTRACT_CREATED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: CX trade
      COMEX_TRADE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contract condition fulfilled.
      CONTRACT_CONDITION_FULFILLED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Pickup contract condition is pending.
      CONTRACT_CONDITION_PICKUP_CONDITION_PENDING: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contract breached
      CONTRACT_CONTRACT_BREACHED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contract cancelled
      CONTRACT_CONTRACT_CANCELLED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contract closed
      CONTRACT_CONTRACT_CLOSED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contract extended
      CONTRACT_CONTRACT_EXTENDED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contract received
      CONTRACT_CONTRACT_RECEIVED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contract rejected
      CONTRACT_CONTRACT_REJECTED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contract terminated
      CONTRACT_CONTRACT_TERMINATED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contract termination requested
      CONTRACT_CONTRACT_TERMINATION_REQUESTED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contract extension deadline exceeded
      CONTRACT_DEADLINE_EXCEEDED_WITHOUT_CONTROL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contract extension deadline exceeded (action required)
      CONTRACT_DEADLINE_EXCEEDED_WITH_CONTROL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Acceptance of Corporation invite
      CORPORATION_MANAGER_INVITE_ACCEPTED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Rejection of Corporation invite
      CORPORATION_MANAGER_INVITE_REJECTED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Member left corporation
      CORPORATION_MANAGER_SHAREHOLDER_LEFT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Corporation project finished
      CORPORATION_PROJECT_FINISHED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Corporation dividend payout received
      CORPORATION_SHAREHOLDER_DIVIDEND_RECEIVED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Corporation invite received
      CORPORATION_SHAREHOLDER_INVITE_RECEIVED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: FX order filled
      FOREX_ORDER_FILLED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: FX trade
      FOREX_TRADE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Gateway jump aborted (link changed)
      GATEWAY_JUMP_ABORTED_LINK_CHANGED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Gateway jump aborted (link not established)
      GATEWAY_JUMP_ABORTED_LINK_NOT_ESTABLISHED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Gateway jump aborted (missing funds)
      GATEWAY_JUMP_ABORTED_MISSING_FUNDS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Gateway jump aborted (not operational)
      GATEWAY_JUMP_ABORTED_NOT_OPERATIONAL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Gateway jump aborted (no jump capacity)
      GATEWAY_JUMP_ABORTED_NO_CAPACITY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Gateway jump aborted (missing gateway fuel)
      GATEWAY_JUMP_ABORTED_NO_FUEL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Gateway linked
      GATEWAY_LINK_ESTABLISHED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Link request received
      GATEWAY_LINK_REQUEST_RECEIVED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Gateway unlinked
      GATEWAY_LINK_UNLINKED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Infrastructure operational state changed
      INFRASTRUCTURE_OPERATIONAL_STATE_CHANGED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Infrastructure project completed
      INFRASTRUCTURE_PROJECT_COMPLETED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Infrastructure upgrade completed
      INFRASTRUCTURE_UPGRADE_COMPLETED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Infrastructure upkeep phase started
      INFRASTRUCTURE_UPKEEP_PHASE_STARTED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Local market ad accepted
      LOCAL_MARKET_AD_ACCEPTED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Local market ad expired
      LOCAL_MARKET_AD_EXPIRED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Planetary project finished
      PLANETARY_PROJECT_FINISHED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Population infrastructure upgraded
      POPULATION_PROJECT_UPGRADED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Population report available
      POPULATION_REPORT_AVAILABLE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Production order completed
      PRODUCTION_ORDER_FINISHED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Release Notes
      RELEASE_NOTES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Shipbuilding project finished
      SHIPYARD_PROJECT_FINISHED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship arrived
      SHIP_FLIGHT_ENDED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: New expert arrived
      SITE_EXPERT_DROPPED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Tutorial quest fulfilled
      TUTORIAL_TASK_FINISHED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: License offer
      USER_CONVERSION_REMINDER_LICENSE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: License expired
      USER_LICENSE_ABOUT_TO_EXPIRE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: License about to expire
      USER_LICENSE_EXPIRED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: License gift received
      USER_LICENSE_GIFT_RECEIVED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Review request
      USER_STEAM_REVIEW: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Warehouse storage locked
      WAREHOUSE_STORE_LOCKED_INSUFFICIENT_FUNDS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Warehouse storage unlocked
      WAREHOUSE_STORE_UNLOCKED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Workforce low on supplies
      WORKFORCE_LOW_SUPPLIES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Workforce out of supplies
      WORKFORCE_OUT_OF_SUPPLIES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Workforce unsatisfied
      WORKFORCE_UNSATISFIED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    AlertsHeadItem: {
      // Template: NOTS {count}
      notifications: ((options: { count: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Notifications
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ApexMobile: {
      text: {
        // Template: Happy trading!
        trading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Welcome, licensee!
        welcome: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: You are currently using APEX on a mobile device and thus experiencing our experimental branch of APEX. Please note that this version is under development and does not yet support all the functionality (esp. maps) you are used to from the regular version of APEX.
        welcome2: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ApexMobilePanel: {
      // Template: Welcome to APEX Mobile
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    AreaCost: {
      // Template: {cost} / {available} {error}
      cost: ((options: { cost: string; available: string; error: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Not enough free area
      error: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Assets: {
      action: {
        // Template: store
        construct: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: view
        view: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      header: {
        // Template: Constructed
        constructed: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Own
        own: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Under construction
        underConstruction: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Location
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Constructor
        _constructor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Created
        created: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Established
        established: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Owner
        owner: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Progress
        progress: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    AssetsPanel: {
      // Template: Assets
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    AvailableSites: {
      // Template: {free} / {total}{ghost}
      plots: ((options: { free: string; total: string; ghost: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Badge: {
      description: {
        // Template: This rare badge is only granted to the most generous benefactors in the new worlds. The significance of their service to APEX cannot be overstated. Limited availability!
        cluster: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: This badge is granted to all licensees who have made a small monetary contribution to APEX and thus to humanity's second shot at a thriving civilization. Still available in unlimited quantities!
        comet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: A particularly beautiful badge which identifies its holder as a member of APEX's top elite. Limited availability!
        galaxy: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: This badge identifies community moderators. Feel free to contact them if you have any questions or witnessed any suspicious behavior.
        moderator: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: This badge identifies avid believers in APEX and its vital role in the history and future of our species. Still available in unlimited quantities!
        moon: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Holders of this badge have been among the very first to conquer the new worlds. This badge has only been granted 300 times and can no longer be obtained.
        pioneer: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: This badge is given only to true believers in APEX and its cause. Holding it grants the ability to choose a two-letter company code. Limited availability!
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: This prestigious badge decorates some of the most high-profile licensees. Their generous contributions keep all of our companies going day by day. Limited availability!
        star: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: A legendary badge which grants its abundantly generous wearer the ability to choose a 1-letter code for their company. Available exactly 21 times from now until all of the suns blow up.
        supercluster: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: This badge identifies members of the APEX development team. They act as moderators within APEX; please comply with their requests.
        team: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Holders of this badge are part of the community translators team. They translate APEX into various languages.
        translator: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: The rarest and most prestigious of all badges. The names of their wearers will be found on statues and in history books throughout the new systems for centuries to come. Available exactly five times!
        universe: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      name: {
        // Template: Supporter: Cluster
        cluster: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Supporter: Comet
        comet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Supporter: Galaxy
        galaxy: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Moderator
        moderator: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Supporter: Moon
        moon: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Pioneer
        pioneer: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Supporter: Planet
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Supporter: Star
        star: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Supporter: Supercluster
        supercluster: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Team
        team: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Translator
        translator: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Supporter: Universe
        universe: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    BadgesPanel: {
      // Template: Badges
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    BalanceStatementPanel: {
      // Template: Change
      change: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Failed to generate balance statement.
      error: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      period: {
        // Template: Current Period
        current: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Last Period
        last: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Previous Period
        previous: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Balance Statement
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Total
      total: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Base_construction: {
      error: {
        // Template: Could not find location.
        planetId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    BillOfMaterials: {
      // Template: in stock
      inStock: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {amount} missing
      missing: ((options: { amount: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    BlackListedUsers: {
      actions: {
        // Template: Unblock User
        deblacklist: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    BlacklistedUsers: {
      table: {
        // Template: Cmds
        commands: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Blocked since
        time: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Username
        user: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Local Market Blocklist
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Blueprint: {
      action: {
        // Template: discard
        discard: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: save
        save: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      banner: {
        // Template: This blueprint is locked because it was used to create a shipbuilding project. Therefore you cannot edit or delete it anymore.
        locked: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: ~{buildTime}h
      buildTime: ((options: { buildTime: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      header: {
        // Template: Construction
        billofmaterial: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Information
        information: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Layout
        layout: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Performance
        performance: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Estimated build time
        buildTime: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Created
        created: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Bill of material
        materials: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ship type
        shipType: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    BlueprintComponentType: {
      CARGO_BAY: {
        // Template: Cargo bay
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Determines the total weight and volume of commodities the ship can carry.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      COMMAND_BRIDGE: {
        // Template: Command Bridge
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Certain engines and reactors require an advanced command bridge to be controlled.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      CREW_QUARTERS: {
        // Template: Crew quarters
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Every ship needs a place for its crew to live, sleep and eat in.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      FTL_FIELD_CONTROLLER: {
        // Template: FTL Field Controller
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: A required component if the ship is supposed to be able to perform FTL jumps.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      FTL_FIELD_EMITTER_LARGE: {
        // Template: Large FTL emitter
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: To perform FTL jumps, the ship needs to create an FTL field around itself. The larger the ship, the more volume its emitters need to span. Charging the emitters takes up some reactor power.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      FTL_FIELD_EMITTER_MEDIUM: {
        // Template: Medium FTL emitter
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: To perform FTL jumps, the ship needs to create an FTL field around itself. The larger the ship, the more volume its emitters need to span. Charging the emitters takes up some reactor power.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      FTL_FIELD_EMITTER_SMALL: {
        // Template: Small FTL emitter
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: To perform FTL jumps, the ship needs to create an FTL field around itself. The larger the ship, the more volume its emitters need to span. Charging the emitters takes up some reactor power.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      FTL_FUEL_TANK: {
        // Template: FTL fuel tank
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Determines how much FTL fuel the ship will be able to hold.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      FTL_REACTOR: {
        // Template: FTL Reactor
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Affects the ship’s power, i.e. maximum speed gain from overcharging during FTL. More powerful reactors generally take longer to charge. Overcharging a reactor increases the damage taken during FTL flight.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      GRAVITY_SHIELD: {
        // Template: Stability System
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Prevents taking damage from landing on planets with unusually high or low gravity.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      HABITATION_MODULE: {
        // Template: Habitation Modules
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Colony ships require an additional habitation module to support their crew on long missions.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      HEAT_SHIELD: {
        // Template: Heat shielding
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reduces the damage taken from entering a planet’s atmosphere.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      HIGH_G_SEATS: {
        // Template: High-G Seats
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Increases the maximum g-factor the ship can endure, thus increasing its maximum speed during STL flight.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      HULL_TYPE: {
        // Template: Hull plates
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Hull plates differ in how well they shield the ship from damage, the maximum g-factor they can support, as well as their weight.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      RADIATION_SHIELD: {
        // Template: Radiation Shielding
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reduces the damage taken from STL flight close to high-radiation stars.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      REPAIR_DRONES: {
        // Template: Self-repair Drone Hub
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reduces the damage taken from any source.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      STL_ENGINE: {
        // Template: STL Engine
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Affects the ship’s thrust, i.e. maximum acceleration during STL flight, and its rate of STL fuel consumption.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      STL_FUEL_TANK: {
        // Template: STL fuel tank
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Determines how much STL fuel the ship will be able to hold.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      STRUCTURE: {
        // Template: Structure
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: The different ship parts are held together by structural components. The larger the ship, the more of those are required.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      VORTEX_FUEL_TANK: {
        // Template: Vortex fuel tank
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Determines how much Vortex fuel the ship will be able to hold.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      VORTEX_REACTOR: {
        // Template: Vortex reactor
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: A special reactor for colony ships making use of certain aspects of gateway travel technology.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      WHIPPLE_SHIELD: {
        // Template: Whipple Shielding
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reduces the damage taken from STL flight through meteoroid-dense systems.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    BlueprintStatus: {
      // Template: IN PROGRESS
      IN_PROGRESS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: LOCKED
      LOCKED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: VALID
      VALID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    BlueprintTestFlight: {
      label: {
        // Template: Blueprint
        blueprint: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Condition
        condition: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Destination
        destination: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: FTL fuel
        ftlFuel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: FTL preferences
        ftlPreferences: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Fuel usage
        fuelUsage: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Origin
        origin: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Inventory
        payload: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reactor usage
        reactorUsage: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: STL Fuel
        stlFuel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    BlueprintTestFlightPanel: {
      error: {
        // Template: No blueprint found.
        blueprintId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      title: {
        // Template: Blueprint Test Flight
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Blueprints: {
      actions: {
        // Template: copy
        copy: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Create new
        create: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: delete
        _delete: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: test
        test: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: View
        view: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No blueprint found.
        blueprint: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Cmds
        commands: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Created
        creationTime: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      title: {
        // Template: Blueprint
        blueprint: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Blueprints
        blueprints: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    BookingType: {
      // Template: Deposit for commodity exchange order
      COMEX_DEPOSIT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Refund of commodity exchange order deposit
      COMEX_DEPOSIT_REFUND: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Commodity order deletion fees
      COMEX_ORDER_DELETION_FEES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Refund of commodity order deletion fees
      COMEX_ORDER_DELETION_FEES_ROLLBACK: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contractual payment paid
      CONTRACT_PAYMENT_PAID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contractual payment received
      CONTRACT_PAYMENT_RECEIVED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Corporation dividend received
      CORPORATION_DIVIDEND: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Corporation founded
      CORPORATION_FORMATION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Purchase of corporation shares
      CORPORATION_INVESTMENT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Direct payment
      DIRECT_PAYMENT_PAID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Direct payment
      DIRECT_PAYMENT_RECEIVED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Deposit for foreign exchange order
      FOREX_DEPOSIT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Refund of foreign exchange order deposit
      FOREX_DEPOSIT_REFUND: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Currencies purchased
      FOREX_PURCHASE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Currencies sold
      FOREX_SALE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Gateway fee
      GATEWAY_FEE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Gateway fee refund
      GATEWAY_FEE_REFUND: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Revenue from gateway fees
      GATEWAY_FEE_REVENUES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Government program fees
      GOVERNMENT_PROGRAM_FEE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Refund of government program fees
      GOVERNMENT_PROGRAM_FEE_ROLLBACK: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Starting capital
      INITIAL_FUNDS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Starting materials
      INITIAL_MATERIALS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Loan failure
      LOAN_FAILURE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Loan installment paid
      LOAN_INSTALLMENT_PAID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Loan installment received
      LOAN_INSTALLMENT_RECEIVED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Loan payout paid
      LOAN_PAYOUT_PAID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Loan payout received
      LOAN_PAYOUT_RECEIVED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Loan write off
      LOAN_WRITE_OFF: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Local market fee
      LOCAL_MARKET_FEE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Revenue from local market fees
      LOCAL_MARKET_FEE_REVENUES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Consumed materials
      MATERIAL_CONSUMPTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Materials purchased
      MATERIAL_PURCHASE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Received materials
      MATERIAL_RECEIVED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Materials sold
      MATERIAL_SALE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Section construction costs
      PLATFORM_BUILT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Section written off
      PLATFORM_REMOVED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Production fee
      PRODUCTION_FEE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Production fee refund
      PRODUCTION_FEE_REFUND: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Revenue from production fees
      PRODUCTION_FEE_REVENUES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: APEX Representation Center contribution
      REPRESENTATION_CENTER_CONTRIBUTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Base establishment fee
      SITE_ESTABLISHMENT_FEE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Revenue from base establishment fees
      SITE_ESTABLISHMENT_FEE_REVENUES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Revenue from warehouse storage fees
      WAREHOUSE_FEE_REVENUES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Supplies consumed by workforce
      WORKER_SUPPLIES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Warehouse storage fee
      WORKFORCE_FEES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    BrokerFrame: {
      error: {
        // Template: Unknown ticker.
        unknownTicker: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    BrokerList: {
      // Template: Ask
      ask: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Bid
      bid: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Demand
        demand: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Change
      change: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: No materials in this category. Try a sub-category.
      empty: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: ∞
      infinity: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      link: {
        // Template: Chart
        chart: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Info
        info: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Orders
        orderBook: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Trade
        placeOrder: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Commodity
      material: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: 0
      noPrice: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Price
      price: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Supply
      supply: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ticker
      ticker: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    // Template: {absolute} ({relative})
    BrokerListLine: ((options: { absolute: string; relative: string }) => string) & {
      getFormat: () => IntlMessageFormat;
    };
    BtnBack: {
      action: {
        // Template: Back
        back: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Buffer: {
      // Template: Buffer {id}
      title: ((options: { id: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    BuildingInformation: {
      // Template: Area cost
      areaCost: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Building costs
      buildingCosts: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Expertise
      expertise: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Products
      production: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      recipe: {
        // Template: No inputs
        inputless: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Workforces
      workforces: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    BuildingPanel: {
      error: {
        // Template: No building found.
        building: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Building
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Building: {name}
      titleWithName: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    BuildingRepairAssistant: {
      // Template: Base
      base: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Buildings to repair
      buildings: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Repair
      button: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      condition: {
        // Template: Minimum condition
        minimum: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Selected condition
        selected: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      context: {
        // Template: Base
        base: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Bases
        bases: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Bill of materials
      materials: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Time offset
      timeoffset: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: in 24h
        _24: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: in 48h
        _48: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Allows to modify the moment of time, by a fixed offset, that is used to calculate the necessary repair materials.
        info: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: now
        now: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Building Repair Assistant
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    BuildingRepairAssistantPanel: {
      label: {
        minimum: {
          // Template: Buildings at or below this condition will be repaired.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    Button: {
      // Template: This action requires a PRO license!
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    CalculatedDistance: {
      // Template: {jumps} jumps
      jumps: ((options: { jumps: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: on planet
      samePlanet: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: in system
      sameSystem: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Card: {
      action: {
        // Template: +
        open: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CardSubheading: {
      // Template: {name} / {subheading}
      title: ((options: { name: string; subheading: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    CashBookings: {
      // Template: Amount
      amount: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: C
      credit: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: D
      debit: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Description
      description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Booked
      time: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {value} {postfix}
      value: ((options: { value: string; postfix: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    CategoryName: {
      // Template: Work gear
      clothing: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Food
      food: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Health
      health: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Tools
      tools: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Drinks
      water: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Channel: {
      controls: {
        // Template: add user
        addUser: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: leave
        leave: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        mute: {
          // Template: mute
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        userList: {
          // Template: User List
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    ChannelCatalog: {
      controls: {
        // Template: open
        open: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ChannelCatalogPanel: {
      context: {
        // Template: Communications
        communications: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ChannelListPanel: {
      context: {
        // Template: Communication Filter
        mutedUsers: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Public Channel Catalog
        publicCommunicationsCatalog: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ChannelMembership: {
      // Template: Start Conversation
      create: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        description: {
          // Template: Click the button below to create this group channel. You can add other users in the next step.
          group: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Click the button below to start a conversation with this user. They will immediately be able to see in their COM panel that you are about to contact them.
          _private: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Join Conversation
      join: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Click below to join this public channel.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ChannelMembershipList: {
      controls: {
        addGroup: {
          // Template: new group
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        addPrivate: {
          // Template: new private
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    ChannelMembershipListItem: {
      label: {
        // Template: GROUP: {userCount, plural, =0 {no other users} other {{users}}}
        group: ((options: { userCount: number; users: string }) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: {u1} and {u2}
          _2: ((options: { u1: string; u2: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: {u1}, {u2} and {u3}
          _3: ((options: { u1: string; u2: string; u3: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: {u1}, {u2} and {additional} others
          more: ((options: { u1: string; u2: string; additional: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: GROUP: {name}
          named: ((options: { name: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: PRIVATE: {name}
        _private: ((options: { name: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: PUBLIC: {name}
        _public: ((options: { name: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CoGC: {
      // Template: Constructed
      constructed: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      error: {
        // Template: Error loading chamber of global commerce.
        id: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      programs: {
        // Template: programs / vote
        command: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        status: {
          // Template: current
          current: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: previous
          previous: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: upcoming
          upcoming: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        table: {
          // Template: Command
          command: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Program
          program: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Schedule
          schedule: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Status
          status: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        time: {
          // Template: started {start}
          current: ((options: { start: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: ended {end}
          previous: ((options: { end: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: starts {start}
          upcoming: ((options: { start: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      section: {
        // Template: Programs
        programs: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upkeep
        upkeep: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Status
      status: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      upkeep: {
        // Template: Bill of material
        billOfMaterial: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Stage of completion
        completion: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: contribute
        contribute: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Contributed materials
        contributions: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: The CoGC needs a constant upkeep to run. It is due every 10 days and depends on the amount of company bases on the planet.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Due date
        dueDate: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: now
          now: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    CoGCPanel: {
      context: {
        // Template: CoGC
        cogc: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: CoGC PEX
        cogcpex: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: CoGC Upkeep
        cogcu: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planet
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: Unable to find planet
        planetId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Chamber of Global Commerce @ {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: CoGC: loading…
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: CoGC: not found…
        notFound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CoGCProgram: {
      // Template: Advertising Campaign: Agriculture
      ADVERTISING_AGRICULTURE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Boosts the planet-wide production output of all facilities in the agriculture sector by 25% for a week through a recruiting ad campaign titled BACK TO NATURE.
      ADVERTISING_AGRICULTURE_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Agriculture
      ADVERTISING_AGRICULTURE_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Advertising Campaign: Chemistry
      ADVERTISING_CHEMISTRY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Boosts the planet-wide production output of all facilities in the chemistry sector by 25% for a week through a recruiting ad campaign titled SCIENCE IS SEXY.
      ADVERTISING_CHEMISTRY_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Chemistry
      ADVERTISING_CHEMISTRY_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Advertising Campaign: Construction
      ADVERTISING_CONSTRUCTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Boosts the planet-wide production output of all facilities in the construction sector by 25% for a week through a recruiting ad campaign titled WE ARE BUILDERS.
      ADVERTISING_CONSTRUCTION_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Construction
      ADVERTISING_CONSTRUCTION_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Advertising Campaign: Electronics
      ADVERTISING_ELECTRONICS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Boosts the planet-wide production output of all facilities in the electronics sector by 25% for a week through a recruiting ad campaign titled TECHNOLOGY IS THE FUTURE.
      ADVERTISING_ELECTRONICS_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Electronics
      ADVERTISING_ELECTRONICS_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Advertising Campaign: Food Industries
      ADVERTISING_FOOD_INDUSTRIES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Boosts the planet-wide production output of all facilities in the food industries sector by 25% for a week through a recruiting ad campaign titled VICTUALS ARE OUR BREAD AND BUTTER.
      ADVERTISING_FOOD_INDUSTRIES_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Food Industries
      ADVERTISING_FOOD_INDUSTRIES_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Advertising Campaign: Fuel Refining
      ADVERTISING_FUEL_REFINING: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Boosts the planet-wide production output of all facilities in the fuel refining sector by 25% for a week through a recruiting ad campaign titled POWERING THE FRONTIER.
      ADVERTISING_FUEL_REFINING_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Fuel Refining
      ADVERTISING_FUEL_REFINING_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Advertising Campaign: Manufacturing
      ADVERTISING_MANUFACTURING: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Boosts the planet-wide production output of all facilities in the manufacturing sector by 25% for a week through a recruiting ad campaign titled EFFICIENT PRODUCTION IS US.
      ADVERTISING_MANUFACTURING_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Manufacturing
      ADVERTISING_MANUFACTURING_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Advertising Campaign: Metallurgy
      ADVERTISING_METALLURGY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Boosts the planet-wide production output of all facilities in the metallurgy sector by 25% for a week through a recruiting ad campaign titled MEN (AND WOMEN) OF STEEL.
      ADVERTISING_METALLURGY_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Metallurgy
      ADVERTISING_METALLURGY_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Advertising Campaign: Resource Extraction
      ADVERTISING_RESOURCE_EXTRACTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Boosts the planet-wide production output of all facilities in the resource extraction sector by 25% for a week through a recruiting ad campaign titled FROM THE GROUND UP.
      ADVERTISING_RESOURCE_EXTRACTION_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Resource Extraction
      ADVERTISING_RESOURCE_EXTRACTION_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Education Events: Engineers
      WORKFORCE_ENGINEERS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Boosts the planet-wide production output of all engineers by 10% for a week through an event series named SPACE ENGINEERING FOR DUMMIES.
      WORKFORCE_ENGINEERS_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Engineers
      WORKFORCE_ENGINEERS_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Education Events: Pioneers
      WORKFORCE_PIONEERS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Boosts the planet-wide production output of all Pioneers by 10% for a week through an event series named SAFETY FIRST IS OUR MOTTO.
      WORKFORCE_PIONEERS_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Pioneers
      WORKFORCE_PIONEERS_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Education Events: Scientists
      WORKFORCE_SCIENTISTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Boosts the planet-wide production output of all scientists by 10% for a week through an event series named HISTORY OF THE SCIENTIFIC METHOD.
      WORKFORCE_SCIENTISTS_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Scientists
      WORKFORCE_SCIENTISTS_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Education Events: Settlers
      WORKFORCE_SETTLERS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Boosts the planet-wide production output of all Settlers by 10% for a week through an event series named BUILDERS OF THE FUTURE.
      WORKFORCE_SETTLERS_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Settlers
      WORKFORCE_SETTLERS_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Education Events: Technicians
      WORKFORCE_TECHNICIANS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Boosts the planet-wide production output of all technicians by 10% for a week through an event series named RISKS AND BENEFITS OF NANOTECH.
      WORKFORCE_TECHNICIANS_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Technicians
      WORKFORCE_TECHNICIANS_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    CoGCStatus: {
      // Template: ACTIVE
      ACTIVE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: ON STRIKE
      ON_STRIKE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: PLANNED
      PLANNED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    CoGCUpkeep: {
      // Template: Bill of material
      billOfMaterial: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      contribute: {
        // Template: You need a base on the planet to be able to contribute.
        error: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Due date
      dueDate: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: now
        now: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      section: {
        // Template: Contribute
        contribute: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Contributions
        contributions: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Status
      status: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    CoGCUpkeepPanel: {
      error: {
        // Template: Unable to find planet
        planetId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: CoGC Upkeep @ {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: CoGC: loading…
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: CoGC: not found…
        notFound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CoGCVoting: {
      table: {
        // Template: Commands
        commands: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: view details / vote
        details: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Influence
        influence: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Rank
        rank: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CoGCVotingDetails: {
      button: {
        // Template: Vote
        vote: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Voted!
        voted: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: This Chamber of Global Commerce has not been finished yet.
        completion: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      header: {
        // Template: CoGC Program: {name}
        name: ((options: { name: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: You need a base on the planet to be able to cast a vote.
        noBase: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Voting ends {time}
        timeleft: ((options: { time: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      section: {
        // Template: Voters
        Voters: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Influence
        influence: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Rank
        rank: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Time
        time: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CoGCVotingDetailsContainer: {
      error: {
        // Template: Unknown Chamber of Global Commerce program.
        program: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CoGCVotingDetailsPanel: {
      error: {
        // Template: Unable to find planet
        planetId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: CoGC Program Details @ {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: CoGC: loading…
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: CoGC: not found…
        notFound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CoGCVotingPanel: {
      error: {
        // Template: Unable to find planet
        planetId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: CoGC Program Execution Query @ {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: CoGC: loading…
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: CoGC: not found…
        notFound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ComEx: {
      context: {
        exchange: {
          // Template: Exchange Info
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: List of Exchanges
        exchanges: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        material: {
          // Template: Material Info
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        orders: {
          // Template: Own Orders
          own: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Place Order
          place: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        price: {
          // Template: Price Chart
          chart: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Price Info
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Order Book
          orders: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    ComExInlineTickerQuote: {
      // Template: {name} {quote}{arrow}
      quote: ((options: { name: string; quote: string; arrow: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ComExListPanel: {
      error: {
        // Template: Error loading commodity exchange data
        nodata: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Commodity Exchanges
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ComExListTable: {
      // Template: MIC
      code: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Location
      location: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Name
      name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Operator
      operator: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ComExMaterialInfo: {
      // Template: Ask
      ask: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Bid
      bid: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      context: {
        // Template: List of Exchanges
        exchangeList: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Material Info
        materialInfo: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Own Orders
        orderList: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Distance
      distance: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      error: {
        // Template: Error loading data. Check material ticker!
        nodata: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: CX
      exchange: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Location
        location: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      link: {
        // Template: Chart
        chart: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Info
        info: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Orders
        orderBook: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Trade
        placeOrder: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Price
      price: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Change
        change: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Supply
      supply: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Demand
        demand: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: CX Material Info: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: CX Material Info
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: 1d Units
      units: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: 7d Units
        weekly: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ComExMaterialInfoRow: {
      // Template: ∞
      infinity: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: 0
      noPrice: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {absolute} ({relative})
      priceChange: ((options: { absolute: string; relative: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ComExOrderPanel: {
      data: {
        // Template: Remaining Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Initial Amount
          initial: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Exchange
        exchange: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Limit
        limit: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Material
        material: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ticker
        ticker: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No order found for input {input}.
        id: ((options: { input: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: CX Order
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Trades
      trades: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: No trades took place so far.
        empty: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Partner
        partner: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Price
        price: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Time
        time: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ComExOrdersPanel: {
      _delete: {
        action: {
          // Template: You deleted too many unfilled or partially filled orders recently.
          confirmation: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
            // Template: You may still delete this order right now, but you will have to pay a fee depending on the order's remaining value: {fees}
            details: ((options: { fees: string }) => string) & {
              getFormat: () => IntlMessageFormat;
            };
          };
          // Template: delete order
          submit: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: delete filled
      deleteFilled: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Order deleted.
      deleted: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      filter: {
        // Template: clear material filters
        clearMaterialFilters: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Exchanges:
        exchanges: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: hide filters
        hide: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Materials:
        materials: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: show filters
        show: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Order statuses:
        statuses: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Order types:
        types: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Commodity Exchange Orders
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ComExOrdersTable: {
      // Template: {amount} ({initial})
      amount: ((options: { amount: string; initial: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: delete
      _delete: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: No orders at the moment.
      noOrders: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      table: {
        // Template: Amount (initial)
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Exchange
        exchange: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Limit
        limit: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Material
        material: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ticker
        ticker: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: view
      view: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ComExPanel: {
      data: {
        // Template: Category
        category: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Market Identifier Code
        code: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Trading Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Infrastructure
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Location
        location: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Operator
        operator: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Station
        station: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No commodity exchange for input {input}.
        id: ((options: { input: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      title: {
        // Template: Commodity Exchange
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ComExPlaceOrderBook: {
      // Template: ∞
      infinity: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Offers
      offers: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: No offers.
        empty: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Requests
      requests: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: No requests.
        empty: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Spread: {spread}
      spread: ((options: { spread: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      table: {
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Price
        price: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Trader
        trader: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ComExPlaceOrderForm: {
      // Template: {bid} / {ask}
      bidask: ((options: { bid: string; ask: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: buy
      buy: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {inventory} {button}
      inventory: ((options: { inventory: string; button: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: {amount, plural, one {# unit} other {# units}}
        amount: ((options: { amount: number }) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: set
          set: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      label: {
        // Template: Quantity
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Bid / Ask
        bidask: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Effective price
        effectivePrice: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: CX prices are rounded to 3 significant figures. For prices above 10, the minimum increment is 0.1, for prices above 100, the minimum increment is 1, and so on.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Exchange
        exchange: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Inventory
        inventory: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Price Limit
        limit: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Material
        material: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Price average
        priceAverage: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Price Band
        priceband: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The broker's price band depends on the average price of the latest trades. Orders with a price limit outside the price band will only be accepted from companies with a PRO rating and a minimum age of 45 days.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Storage Location
        storeId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Volume
        volume: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      price: {
        // Template: set
        set: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {priceAverage} {command}
      priceAverage: ((options: { priceAverage: string; command: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {low} / {high} {currency}
      priceband: ((options: { low: string; high: string; currency: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: sell
      sell: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Shipment size
      shipmentSize: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ComExPlaceOrderPanel: {
      action: {
        // Template: place order
        place: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The price limit you selected is outside the broker's price band. Continue?
          confirmation: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Place order ({ticker})
      title: ((options: { ticker: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ComExPrice: {
      // Template: {absolute} ({relative})
      pricechange: ((options: { absolute: string; relative: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ComExPriceChartPanel: {
      // Template: Chart: {name} ({ticker})
      chartWithNameAndTicker: ((options: { name: string; ticker: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Chart: {ticker}
      chartWithTicker: ((options: { ticker: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ComExPricePanel: {
      // Template: 0
      noPrice: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Price {ticker}
      title: ((options: { ticker: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {material} ({ticker})
      titlebroker: ((options: { material: string; ticker: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ComExPurchasePickUpCondition: {
      // Template: Pick up {amount, number} / {total, number} {total, plural, one {unit} other {units}} of {material} at {address}
      content: ((options: {
        amount: string | number;
        total: number;
        material: string;
        address: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Command: {
      // Template: List of all pending actions.
      ACTIONS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: General information about a planetary administration center.
      ADM: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Planet Identifier
          planetIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Information about a administration center term.
      ADMT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Planet Identifier
          planetIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Term Identifier
          termId: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Entrypoint for the mobile version of APEX.
      APEXM: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Shows information about and allows to upgrade the APEX representation center.
      ARC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: An overview of all infrastructure assets both in construction and completed.
      ASTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Construct a new building at one of your bases.
      BBC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Blueprint
          blueprintIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Base
          siteIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Has a list of all buildings at one of your bases.
      BBL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Base
          siteIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: A list of all user badges.
      BDGS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Shows a list of all blueprints or details of a specific blueprint.
      BLU: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Blueprint
          blueprintIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Repair multiple buildings at once.
      BRA: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Base
          siteIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Display one or all of your bases.
      BS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Base
          siteIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Allows to construct a new base on a planet.
      BSC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Planet Identifier
          planetIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Blueprint test flight controls.
      BTF: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Information about buildings.
      BUI: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Building Ticker
          buildingTicker: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: List of available commands.
      CMDS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Company information.
      CO: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Company Code or Company Id
          query: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: The Chamber of Global Commerce and its programs.
      COGC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Planet Identifier
          planetIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: The Chamber of Global Commerce program details.
      COGCPD: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Planet Identifier
          planetIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Program Name
          program: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: The Chamber of Global Commerce program execution query and voting.
      COGCPEX: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Planet Identifier
          planetIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Upkeep of the Chamber of Global Commerce.
      COGCU: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Planet Identifier
          planetIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Liquidate your company.
      COLIQ: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Communications.
      COM: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Catalog of public communication channels.
      COMC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: List of muted users.
      COMF: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A private group conversation.
      COMG: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Channel Identifier
          channelIdentifier: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: A public communication channel.
      COMP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Channel Identifier
          channelIdentifier: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Direct communication channel to another user.
      COMU: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Username
          channelIdentifier: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: List of currently connected users.
      CONS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Displays a contract.
      CONT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Contract
          contractId: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Displays the list of all or a specific contract draft.
      CONTD: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Draft Identifier
          draftIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Displays all contracts.
      CONTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Information about your primary corporation.
      CORP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Shows information about and allows to upgrade the corporation's APEX representation center.
      CORPARC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Information about your primary corporation's finances.
      CORPFIN: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Pending invites of your corporation.
      CORPIVS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Company Code
          companyIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Starting a new project for your corporation.
      CORPNP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Detailed information about corporation projects.
      CORPP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Project Identifier
          partialProjectId: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Displays a list of all corporations or details of a single corporation.
      CORPS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Corporation Code
          corporationIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Create a new screen.
      CS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: General information about a commodity exchange.
      CX: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Market Identifier Code
          idInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: List of all commodity exchanges.
      CXL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Compare commodity information across all exchanges.
      CXM: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Material Ticker
          materialTicker: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Planet to determine distance from
          planetIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: View a commodity exchange order.
      CXO: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Order Identifier
          query: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Order book for a given commodity exchange ticker.
      CXOB: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Ticker
          ticker: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Manage your commodity exchange orders.
      CXOS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Pagesize
          pagesize: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Commodity price information.
      CXP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Ticker
          ticker: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Chart: Commodity price plotted over time.
      CXPC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Ticker
          ticker: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Commodity exchange order form.
      CXPO: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Ticker
          ticker: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Display and manage the experts at a given base.
      EXP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Base
          siteIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Shows and opens a link that leads to an external site.
      EXTLNK: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Faction information.
      FA: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Faction Code
          query: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Basic financial overview and recent cash bookings.
      FIN: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Balance statement showing your assets and liabilities.
      FINBS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Income statement showing profit and loss.
      FINIS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Balance statement showing liquid assets (e.g. cash).
      FINLA: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Overview of the whole fleet or fleets at specific locations.
      FLT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Overview of the fleet at the given planet.
      FLTP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Planet Identifier
          partialPlanetId: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Overview of the fleet in the given system.
      FLTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: System Identifier
          partialSystemId: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      FTL: {
        parameter: {
          // Template: Address
          addressInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: A matrix of foreign exchange conversion rates.
      FX: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Shows a foreign exchange order.
      FXO: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Order Identifier
          query: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Order book for a given currency pair.
      FXOB: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Ticker
          ticker: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: List of your foreign exchange orders.
      FXOS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Exchange rate information.
      FXP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Ticker
          ticker: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Chart: Exchange rate plotted over time.
      FXPC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Ticker
          ticker: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Place foreign exchange order.
      FXPO: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Ticker
          ticker: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Allows to gift PRO license time to another user.
      GIFT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Shows information about the current and past governments.
      GOV: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Planet Identifier
          planetIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Displays information about a FTL gateway.
      GTW: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Address or specific gateway id.
          locationIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Allows to plan gateway projects.
      GTWI: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Displays traffic information about a FTL gateway.
      GTWT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Gateway Identifier
          gatewayNaturalId: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Links to the Handbook with useful information on how to get started.
      HELP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Allows to upgrade and relocate your company headquarters.
      HQ: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Displays information about a system's infrastructure.
      INF: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Infrastructure Identifier
          infrastructureNaturalId: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: System Identifier
          systemIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Displays information about an infrastructure's upkeep.
      INFU: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Display all inventories, those located at the specified address, or a specific inventory.
      INV: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Inventory or Address
          storeIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Shows the company leaderboards.
      LEAD: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Information about your APEX license/subscription status.
      LIC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: General info about a local market and its list of ads.
      LM: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Local Market Identifier
          localMarketIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Detailed view of a local market ad.
      LMA: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Local Market Ad Identifier
          localMarketAdIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Local market blocklist.
      LMBL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: List of your local market ads.
      LMOS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Form to create local market ads.
      LMP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Local Market Identifier
          localMarketIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Listing of local rules like production fees, etc.
      LR: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Planet Identifier
          planetIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Information about commodities and materials.
      MAT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Material Ticker
          materialTicker: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Motion
      MOT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Administration Center Identifier
          planetIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Motions
      MOTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Motion Identifier
          motionId: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Motion Identifier
          motionIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Map: Star System
      MS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: System Identifier
          systemIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Transfer a specific amount of a commodity between inventories.
      MTRA: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Material Ticker
          materialTickerInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Origin Store Identifier
          originStoreIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Target Store Identifier
          targetStoreIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Map: Universe
      MU: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Mode
          mode: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: In-game notification settings.
      NOTIG: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Push notification settings.
      NOTPNS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: List of notifications.
      NOTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Allows to search for and display information about a planet.
      PLI: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Planet Identifier
          planetIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Name a planet.
      PLNM: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Planet Identifier
          naturalId: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Shows recent and past offices a user held.
      POL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Username
          query: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Shows recent population reports containing information like population size, growth, unemployment rate, ..
      POPI: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Planet Identifier
          planetIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Shows details of a certain population infrastructure project and allows to contribute upkeep materials as well as building materials to upgrade the project.
      POPID: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Infrastructure Type
          infrastructureType: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Planet Identifier
          planetIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Shows recent population reports containing information like population size, growth, unemployment rate, ..
      POPR: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Planet Identifier
          planetIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Detailed information about a planetary project.
      PP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Planet Identifier
          planetIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Planetary Project
          planetaryProjectIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Base
          siteIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Displays information about a planetary plot.
      PPI: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: List of all planetary projects of the given planet.
      PPS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Planet Identifier
          planetIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Display one or all of your production lines.
      PROD: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Queue a new production order for a production line.
      PRODCO: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Base
          productionLineIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Plot
          siteIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Order queue of a production line.
      PRODQ: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Production Line
          productionLineIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Has a list of recommended starter buildings for your selected starting package.
      RSB: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Screen configuration
      SCRN: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship flight controls.
      SFC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Ship Transponder
          partialShipId: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Ship detail information
      SHP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Ship Transponder
          partialShipId: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Ship fuel tanks.
      SHPF: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Ship Transponder
          partialShipId: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Ship inventory.
      SHPI: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Ship Transponder
          partialShipId: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: General information about planetary shipyards.
      SHY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Address
          locationIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: An overview of all shipyard projects and details for specific ones.
      SHYP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Shipyard Project Identifier
          projectIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Public ship information.
      SI: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Ship Transponder
          partialShipId: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Steam review.
      STEAM: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Displays a list of all space stations or public information of a single station.
      STNS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Station Identifier
          partialStationId: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Allows to search for and display information about a system.
      SYSI: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: System Identifier
          systemIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Name a system.
      SYSNM: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: System Identifier
          naturalId: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Display a list of recent transmissions.
      TRA: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Allows unpacking of consumable bundles.
      UPCK: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Store Identifier
          storeIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: User information.
      USR: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Username
          query: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: General information about a warehouse.
      WAR: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Warehouse Identifier
          warehouseIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Display the workforce at a given base.
      WF: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        parameter: {
          // Template: Base
          siteIdInput: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Greenscreen
      XIT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: YouTube video
      XYTV: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    CommandInput: {
      // Template: CMD
      label: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    CommandsPanel: {
      // Template: Command
      command: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Description
      description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Mandatory parameters
      mandatoryParameters: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Optional parameters
      optionalParameters: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Commands
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    CommodityAd: {
      // Template: {action} {amount} {commodity} ({ticker}) @ {price} for {advice} within {adviceTime}
      text: ((options: {
        action: string;
        amount: string;
        commodity: string;
        ticker: string;
        price: string;
        advice: string;
        adviceTime: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: {advice, plural, one {# day} other {# days}}
        advice: ((options: { advice: number }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: collection
        collection: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: delivery
        delivery: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CommodityShippingAd: {
      text: {
        // Template: {advice, plural, one {# day} other {# days}}
        collection: ((options: { advice: number }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {action} {amount} {commodity} @ {price} from {origin} to {destination} for delivery within {adviceTime}
        perspectiveSender: ((options: {
          action: string;
          amount: string;
          commodity: string;
          price: string;
          origin: string;
          destination: string;
          adviceTime: string;
        }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {action} {weight}t / {volume}m³ @ {price} from {origin} to {destination} for delivery within {adviceTime}
        perspectiveShipper: ((options: {
          action: string;
          weight: string;
          volume: string;
          price: string;
          origin: string;
          destination: string;
          adviceTime: string;
        }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CompanyCreation: {
      SelectionCategory: {
        // Template: Faction
        COUNTRY: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Location
        LOCATION: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Profession
        PROFILE: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CompanyHeadquarters: {
      // Template: {usedPermits} / {availablePermits}
      basepermits: ((options: { usedPermits: string; availablePermits: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      button: {
        // Template: Relocate
        relocate: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: CMD
      command: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      context: {
        // Template: Company
        company: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Your company has no headquarters yet.
      empty: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      form: {
        // Template: Base permit increase
        additionalBasePermits: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Queue slot increase
        additionalProductionQueueSlots: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Address
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Base permits
        basepermits: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Efficiency gains
        efficiencygains: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {category} {gain}
        efficiencygainsdetails: ((options: { category: string; gain: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Level
        level: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Relocations are locked and will become available in {relocation} again.
        nextRelocationTime: ((options: { relocation: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Site
        site: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      header: {
        // Template: Relocate
        relocate: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upgrade
        upgrade: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        additionalBasePermits: {
          // Template: Upgrading your HQ unlocks an additional base permit per level.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        additionalProductionQueueSlots: {
          // Template: Upgrading your HQ can unlock additional production queue slots. Consult the handbook about the required levels.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        basepermits: {
          // Template: The maximum number of bases you are allowed to own. Increase it by upgrading your HQ.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        efficiencygains: {
          // Template: Depending on your HQ's location and base to base permits ratio you'll receive certain production efficiency gains.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        level: {
          // Template: Upgrading your HQ unlocks additional base permits and extends your production queues. Non-PRO users can update up to level 5, beyond that a PRO subscription is necessary.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: No base found to relocate to.
        relocateNotPossible: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      title: {
        // Template: Headquarters
        noAddress: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Headquarters @ {address}
        withAddress: ((options: { address: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CompanyHeadquartersPanel: {
      action: {
        // Template: Do you want to relocate your company's headquarters to {name}? You will not be able to relocate again immediately.
        confirmation: ((options: { name: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Relocate
        relocate: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CompanyPanel: {
      context: {
        // Template: Headquarters
        headquarters: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      data: {
        // Template: Bases
        bases: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Code
        code: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Corporation
        corporation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: invite
          invite: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Faction
        country: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Founded
        founded: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Rating
        rating: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Registration
        registration: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: APEX representation center
        representation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Level {level}
          level: ((options: { level: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Reputation
        reputation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Managing Director
        user: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No company for input {input}.
        id: ((options: { input: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      title: {
        // Template: Company
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Company: {name}
        single: ((options: { name: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CompanySetup: {
      // Template: Carbon Farmer
      CARBON_FARMER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Constructor
      CONSTRUCTOR: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Fuel Engineer
      FUEL_ENGINEER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Manufacturer
      MANUFACTURER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Metallurgist
      METALLURGIST: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Victualler
      VICTUALLER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: APEX Company Creation Assistant
      header: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      profile: {
        // Template: Carbon Farmer
        CARBON_FARMER: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Carbon has become a vital resource across different industries, so much so that a whole job profile has evolved around it: the carbon farmer. Even though you will be planting crops like a victualler, you will not have much to do with the food industry. Instead, your plants will be harvested for their precious carbon, which is the basis for many essential production processes in the metal and other industries.
          description: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Water
          resources: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Constructor
        CONSTRUCTOR: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Constructors know their way around building parts, from basic structural elements to complex engineering materials.
          description: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Limestone, Iron Ore
          resources: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Fuel Engineer
        FUEL_ENGINEER: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The commodities you produce will be the foundation of faster-than-light and slower-than-light space travel. Both fuel types are based on a variety of gaseous and solid ingredients, so there is plenty of room for development and specialization in your trade.
          description: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Galerite, Ammonia, Hydrogen
          resources: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Manufacturer
        MANUFACTURER: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: As a manufacturer, you will be a versatile creature which does not depend too much on a single industry. Your company’s main purpose will be to supply your trade partners with goods such as basic clothing and building parts. Getting started as a manufacturer is quite complex logistically, as you will have to buy your input materials from a nearby commodity exchange.
          description: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Limestone, Silicon Ore
          resources: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Metallurgist
        METALLURGIST: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: If you don’t mind getting your (workers’) hands dirty, this might be the job for you. Operating at the base of several industry branches, metallurgists produce ores, smelt them down and supply their trade partners with refined metals that will ultimately go into the construction of buildings, ships, and other structures.
          description: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Aluminium Ore, Iron Ore, Oxygen
          resources: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Victualler
        VICTUALLER: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Victuallers are the heart of the food industry. Their profession revolves around extracting water, producing ingredients and turning it all into edibles for their own and others’ workforces. Without victuallers, all other industries would soon come to a halt, which is why their trade will always be relevant across the universe.
          description: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Water
          resources: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      step: {
        action: {
          // Template: ACCEPT
          accept: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: BACK
          back: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: CREATE
          create: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: NEXT
          next: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        company: {
          // Template: Company code
          code: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
            // Template: A 3- or 4-character abbreviation for your company. Owners of some APEX licenses can even use 2- or 1-character abbreviations. Cannot consist of numbers only.
            info: ((options: void) => string) & {
              getFormat: () => IntlMessageFormat;
            };
            // Template: code
            placeholder: ((options: void) => string) & {
              getFormat: () => IntlMessageFormat;
            };
          };
          // Template: Your company represents your personal business interests in the APEX system. It is identified by a name and a short code.
          description1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Your company can later join a corporation to work towards a shared goal with other players.
          description2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          error: {
            // Template: This company code is unavailable.
            unavailableCode: ((options: void) => string) & {
              getFormat: () => IntlMessageFormat;
            };
            // Template: This company name is unavailable.
            unavailableName: ((options: void) => string) & {
              getFormat: () => IntlMessageFormat;
            };
          };
          // Template: Name your company
          header: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Company name
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
            // Template: Your company's name will be visible to all APEX participants and cannot be changed. Choose wisely.
            info: ((options: void) => string) & {
              getFormat: () => IntlMessageFormat;
            };
            // Template: name
            placeholder: ((options: void) => string) & {
              getFormat: () => IntlMessageFormat;
            };
          };
        };
        country: {
          // Template: Currency: {currency}
          currency: ((options: { currency: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Choose a faction
          header: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        disclaimer: {
          // Template: Early Access Disclaimer
          header: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: in development
          indevelopment: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: slow game
          slowgame: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Please note that the game and its interface APEX is still {indevelopment}. Bugs will occur during the early access stage; please report them <a>in the forums</a> to get help. The universe will be reset multiple times before the full release, but we will make sure to give you a timely heads up.
          text1: ((options: { indevelopment: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Please also note that Prosperous Universe is a {slowgame}, especially when starting out. Actions, like sending out ships or the production of materials, are being executed in real-time and will take real hours to complete. The game will get busier the more bases and ships you have. It is perfectly normal to play a couple of minutes and come back hours later. In the meantime, many players will plan their next steps and interact with the community.
          text2: ((options: { slowgame: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: By accepting this disclaimer, you also confirm that you will behave in accordance with the <a>Community Guidelines</a>. Violating them might result in limitation, suspension, or deletion of your account.
          text3: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        location: {
          // Template: Your starting location determines where the ships of your starting fleet will be provisioned.
          description1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Important: You can fly to any planet in the universe but most of them will require high-level technology in order for you to colonize them. You will be able to colonize many more planets later.
          description2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Choose a starting planet
          header: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Profession suitability
          professionSuitability: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        profile: {
          // Template: Central resources:
          centralResources: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Choose a profession
          header: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Note: You can venture into any industry you like later on. What you select here merely determines your initial stock of goods.
          note: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: (Note that it will sometimes make more sense to buy the materials you need instead of producing them all by yourself.)
          resources: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    CompanySiteContainer: {
      error: {
        // Template: Failed to load plot information.
        notFound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ComponentDescription: {
      type: {
        // Template: Accept a contribution of {money} from {contributor}.
        CONTRIBUTION: ((options: { money: string; contributor: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Set local market fees to {base} and time factor to {timefactor}.
        FEE_LOCAL_MARKET: ((options: { base: string; timefactor: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Set base establishment fee to {fee}.
        FEE_SITE_ESTABLISHMENT: ((options: { fee: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Set warehouse rental fees to {amount} per unit.
        FEE_WAREHOUSE: ((options: { amount: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Commission {contractor} to provide {periods, plural, one {one week} other {{periods} weeks}} of fuel for gateway {link} with a {slo}% service level objective, paying {amount}.
        GATEWAY_FUEL: ((options: {
          contractor: string;
          periods: string;
          link: string;
          slo: string;
          amount: string;
        }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        GATEWAY_LINK: {
          // Template: Establish link from gateway {originGateway} at {originAddress} to gateway {destinationGateway} at {destinationAddress}.
          link: ((options: {
            originGateway: string;
            originAddress: string;
            destinationGateway: string;
            destinationAddress: string;
          }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Unlink gateway {originGateway}.
          unlink: ((options: { originGateway: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Set the usage fee for gateway {link} to {amount}.
        GATEWAY_PRICING: ((options: { link: string; amount: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Commission {constructor} to construct a {type} infrastructure for {amount}.
        INFRASTRUCTURE_CONSTRUCTION: ((options: {
          constructor: string;
          type: string;
          amount: string;
        }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Rename {type} {naturalId} to {name}.
        INFRASTRUCTURE_NAME: ((options: {
          type: string;
          naturalId: string;
          name: string;
        }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Commission {constructor} to upgrade {type} {link} for {amount}.
        INFRASTRUCTURE_UPGRADE: ((options: {
          constructor: string;
          type: string;
          link: string;
          amount: string;
        }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Commission {contractor} to provide {periods, plural, one {one week} other {{periods} weeks}} of upkeep for {type} {link} with a {slo}% service level objective, paying {amount}.
        INFRASTRUCTURE_UPKEEP: ((options: {
          contractor: string;
          periods: string;
          type: string;
          link: string;
          slo: string;
          amount: string;
        }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Transfer {money} to {user}.
        PAYOUT: ((options: { money: string; user: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Start workforce program '{program}' ({costs}).
        WORKFORCE_PROGRAM: ((options: { program: string; costs: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ComponentOption: {
      // Template: {amount, number} {amount, plural, one {emitter} other {emitters} zero {emitters}}
      ftlEmitter: ((options: { amount: number }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: not required
      notrequired: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: required
      required: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {amount} structural elements
      structure: ((options: { amount: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ComponentType: {
      // Template: Contribution
      CONTRIBUTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Local Market fees
      FEE_LOCAL_MARKET: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Production fees
      FEE_PRODUCTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Base establishment fees
      FEE_SITE_ESTABLISHMENT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Warehouse fees
      FEE_WAREHOUSE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Gateway fuel
      GATEWAY_FUEL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Link gateway
      GATEWAY_LINK: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Gateway pricing
      GATEWAY_PRICING: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Unlink gateway
      GATEWAY_UNLINK: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Construct infrastructure
      INFRASTRUCTURE_CONSTRUCTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Infrastructure name
      INFRASTRUCTURE_NAME: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Upgrade infrastructure
      INFRASTRUCTURE_UPGRADE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Infrastructure upkeep
      INFRASTRUCTURE_UPKEEP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Payout
      PAYOUT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Infrastructure levels
      POPULATION_INFRASTRUCTURE_LEVEL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Workforce program
      WORKFORCE_PROGRAM: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Condition: {
      // Template: buy commodities
      BUY_MATERIAL_FROM_CATEGORY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: fulfill country contract
      FULFILL_COUNTRY_CONTRACT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: increase satisfaction
      INCREASE_SATISFACTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: make money
      MAKE_MONEY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: wait
      WAIT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: #{index}
      dependency: ((options: { index: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ConditionEditForm: {
      action: {
        // Template: save
        save: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ConditionText: {
      // Template: Set up a base
      baseConstruction: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Construct a building
      buildingConstruction: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Buy some {category} at the commodity exchange
      buyMaterialFromCategory: ((options: { category: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Finish a ship construction project
      construction: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contribute building or upkeep materials to a infrastructure project @ {address}
      contribution: ((options: { address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Delivery of {amount, number} {amount, plural, one {unit} other {units}} of {material} to {address}
      delivery: ((options: { amount: number; material: string; address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Deliver shipment @ {address}
      deliveryShipment: ((options: { address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      exploration: {
        // Template: Conduct planetary exploration survey @ {address}
        planet: ((options: { address: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Conduct exploration survey @ {address} system
        system: ((options: { address: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Finish a flight
      finishFlight: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Fulfill a faction contract
      fulfillCountryContract: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Provide {infrastructure} with fuel in upkeep phase {phase} keeping the service level above {level}
      gatewayFuel: ((options: {
        infrastructure: string;
        phase: string;
        level: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Increase a workforce satisfaction to at least {requiredSatisfaction}
      increaseSatisfaction: ((options: { requiredSatisfaction: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Finish construction of infrastructure
      infrastructureConstructionFinish: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Start construction of {type} infrastructure at {address}
      infrastructureConstructionStart: ((options: { type: string; address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Finish upgrade of infrastructure
      infrastructureUpgradeFinish: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Start upgrade of {type} {link}
      infrastructureUpgradeStart: ((options: { type: string; link: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Provide infrastructure upkeep for {type} {infrastructure} in upkeep phase {phase} keeping the service level above {level}
      infrastructureUpkeep: ((options: {
        type: string;
        infrastructure: string;
        phase: string;
        level: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Pay installment: {interest} interest, {repayment} repayment
      loanInstallment: ((options: { interest: string; repayment: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Pay out loan: {amount}
      loanPayout: ((options: { amount: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Repair one of your ships
      maintenance: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Earn at least {threshold}
      makeMoney: ((options: { threshold: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Payment of {amount}
      payment: ((options: { amount: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Pick up {amount, number} {amount, plural, one {unit} other {units}} of {material} @ {address}
      pickup: ((options: { amount: number; material: string; address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Pickup shipment @ {address}
      pickupShipment: ((options: { address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Place a commodity exchange order
      placeOrder: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Become an elected governor
      power: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Complete a production order
      productionOrderCompleted: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Start a production order
      productionRun: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Provision {amount, number} {amount, plural, one {unit} other {units}} of {material} @ {address}
      provision: ((options: { amount: number; material: string; address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: (auto-provisioned)
        autoprovision: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Provision shipment of {amount, number} {amount, plural, one {unit} other {units}} of {material} @ {address} {autoprovision}
      provisionShipment: ((options: {
        amount: number;
        material: string;
        address: string;
        autoprovision: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Grant {reputation} faction reputation points
      reputation: ((options: { reputation: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Start a flight
      startFlight: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Upgrade your headquarters
      upgrade: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Wait {duration}
      wait: ((options: { duration: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Start workforce program {type}
      workforceProgramStart: ((options: { type: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ConditionType: {
      // Template: building construction
      BUILDING_CONSTRUCTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: base construction
      CONDITION_BASE_CONSTRUCTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: commodity exchange purchase pickup
      CONDITION_COMEX_PURCHASE_PICKUP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: ship construction
      CONDITION_CONSTRUCT_SHIP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: contribution
      CONDITION_CONTRIBUTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: delivery
      CONDITION_DELIVERY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: shipment delivery
      CONDITION_DELIVERY_SHIPMENT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: exploration
      CONDITION_EXPLORATION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: flight end
      CONDITION_FINISH_FLIGHT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: gateway fuel
      CONDITION_GATEWAY_FUEL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: headquarters upgrade
      CONDITION_HEADQUARTERS_UPGRADE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: infrastructure construction start
      CONDITION_INFRASTRUCTURE_CONSTRUCTION_START: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: infrastructure upgrade start
      CONDITION_INFRASTRUCTURE_UPGRADE_START: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: infrastructure upkeep
      CONDITION_INFRASTRUCTURE_UPKEEP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: loan installment
      CONDITION_LOAN_INSTALLMENT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: loan payout
      CONDITION_LOAN_PAYOUT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: payment
      CONDITION_PAYMENT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: commodity pickup
      CONDITION_PICKUP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: shipment pickup
      CONDITION_PICKUP_SHIPMENT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: order placement
      CONDITION_PLACE_ORDER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: election
      CONDITION_POWER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: production order completion
      CONDITION_PRODUCTION_ORDER_COMPLETED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: production finish
      CONDITION_PRODUCTION_RUN: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: commodity provisioning
      CONDITION_PROVISION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: shipment provisioning
      CONDITION_PROVISION_SHIPMENT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: ship repair
      CONDITION_REPAIR_SHIP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: reputation
      CONDITION_REPUTATION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: flight start
      CONDITION_START_FLIGHT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: payment
      CONDITION_WORKFORCE_PROGRAM_PAYMENT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: program start
      CONDITION_WORKFORCE_PROGRAM_START: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: infrastructure construction finish
      INFRASTRUCTURE_CONSTRUCTION_FINISH: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: infrastructure upgrade finish
      INFRASTRUCTURE_UPGRADE_FINISH: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Connecting: {
      client: {
        // Template: Establishing console connection…
        connecting: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Console connection lost. Will attempt to re-connect…
        disconnected: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Trying to re-connect…
        reconnecting: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      server: {
        // Template: Connecting to APEX network…
        connecting: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Failed to connect to APEX network. Please try again later.
        connectionFailure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Lost connection to APEX network. Please restart your console.
        disconnected: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ConstructInfrastructureComponent: {
      label: {
        // Template: Address
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Constructor
        _constructor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Deadline
        deadline: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Payment
        payment: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ContextControls: {
      // Template: {command}{label}
      contextItem: ((options: { command: string; label: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: CTXS
      contexts: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: CTX: {context}
      title: ((options: { context: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ContextName: {
      company: {
        // Template: Company: {name}
        title: ((options: { name: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      government: {
        // Template: Government @ {address}
        title: ((options: { address: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Contract: {
      action: {
        // Template: accept
        close: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: reject
        reject: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: request termination
        requestTermination: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Contracts can be terminated if both parties send a termination request.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      banner: {
        action: {
          // Template: breach
          breach: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: extend
          extend: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Contract conditions
      conditions: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Created
      date: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      fulfillCondition: {
        // Template: fulfill
        confirm: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: One of the contract parties has requested to terminate this contract. Do you really want to fulfill this condition?
        confirmation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: ID
      id: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Name
      name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Partner
      partner: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Preamble
      preamble: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Status
      status: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      table: {
        // Template: Cmds
        command: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Condition
        condition: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Deadline
        deadline: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The duration of a deadline which is currently not active, will be shown in parenthesis.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Depends on
        dependencies: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Index
        index: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Party
        party: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Termination request
      termination: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: received
        received: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: sent
        sent: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ContractCondition: {
      // Template: fulfilled
      FULFILLED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: fulfillment attempted
      FULFILLMENT_ATTEMPTED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: in progress
      IN_PROGRESS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: partly fulfilled
      PARTLY_FULFILLED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: pending
      PENDING: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: violated
      VIOLATED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: ({duration})
      deadline: ((options: { duration: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: fulfill
      fulfill: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ContractDraft: {
      action: {
        // Template: save
        save: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Select Template
        template: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      condition: {
        // Template: {deadline, plural, one {# day} other {# days}}
        deadline: ((options: { deadline: number }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      form: {
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Preamble
        preamble: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Contract preamble
          placeholder: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Repeating
        repeating: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      header: {
        // Template: Conditions
        conditions: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Send contract draft
        send: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Template
        template: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        action: {
          // Template: condition
          condition: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: parameter
          parameter: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Cmds
        commands: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Condition
        condition: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Deadline
        deadline: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Depends on
        dependency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Index
        index: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Party
        party: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ContractDraftSend: {
      action: {
        // Template: discard
        discard: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: save
        save: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: send
        send: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      form: {
        // Template: Recipient
        recipient: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ContractDrafts: {
      actions: {
        // Template: copy
        copy: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Create new
        create: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: delete
        _delete: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: View
        view: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Cmds
        commands: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Created
        creationTime: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ContractDraftsPanel: {
      action: {
        // Template: delete draft
        _delete: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The contract draft '{name}' will be deleted.
          confirmation: ((options: { name: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: send draft
        send: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The contract draft '{name}' will be sent to '{user}'.
          confirmation: ((options: { name: string; user: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      error: {
        // Template: No draft found.
        draft: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      title: {
        // Template: Contract Draft
        draft: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Contract Drafts
        drafts: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ContractPanel: {
      // Template: This contract will be breached in {countdown}. You can choose to either breach the contract immediately or grant an extension.
      extensionWithControl: ((options: { countdown: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: This contract will be breached in {countdown} unless your partner grants an extension.
      extensionWithoutControl: ((options: { countdown: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Contract {id}
      title: ((options: { id: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Contract loading
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ContractStatus: {
      // Template: breached
      BREACHED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: cancelled
      CANCELLED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: closed
      CLOSED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: deadline exceeded
      DEADLINE_EXCEEDED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: draft
      DRAFT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: fulfilled
      FULFILLED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: open
      OPEN: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: partially fulfilled
      PARTIALLY_FULFILLED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: rejected
      REJECTED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: terminated
      TERMINATED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Contracts: {
      context: {
        // Template: Contract Drafts
        contractDrafts: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Contracts
        contracts: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ContractsPanel: {
      filter: {
        // Template: all
        all: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: hide filters
        hide: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: none
        none: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: show filters
        show: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Cmds
        cmds: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Created
        created: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Due
        due: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Contract
        id: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Partner
        partner: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: view
        view: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Contracts
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Contribution: {
      button: {
        // Template: contribute
        contribute: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: (every {interval, plural, one {day} other {{interval} days}})
      consumption: ((options: { interval: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Inventory
      stores: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      table: {
        // Template: Contribution
        contribution: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Inventory
        inventory: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Last for
        lastFor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Next Consumption
        nextConsumption: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reserve
        reserve: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ContributionComponent: {
      label: {
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Contributor
        contributor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Contributions: {
      label: {
        // Template: There are no recent contributions
        noContributions: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Contributor
        contributor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Materials
        materials: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Time
        time: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CoporationContainer: {
      data: {
        // Template: APEX representation center
        representationCenter: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Level {level}
          level: ((options: { level: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    Corporation: {
      infrastructure: {
        // Template: Cmd
        command: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: contribute
          contribute: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: project
          project: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: view
          view: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: No infrastructure projects found.
        empty: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Location
        location: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Project
        project: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Start project
        startproject: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CorporationContainer: {
      data: {
        // Template: Code
        code: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Faction
        country: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Founded
        founded: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: (unfinished)
        headquarter: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Headquarters
        headquarters: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {entity} ({share})
        shareholder: ((options: { entity: string; share: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Shareholders
        shareholders: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Total Shares
        shares: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CorporationFinance: {
      balances: {
        // Template: Balance
        balance: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      dividendPayouts: {
        // Template: Payout per share
        payoutpershare: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Time
        time: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      header: {
        // Template: Recent dividend payouts
        dividendpayouts: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Liquid assets
        liquidassets: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      info: {
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Next dividend payout
        nextDividendPayout: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Shareholders
        shareholders: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Shares
        shares: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CorporationFinancePanel: {
      // Template: no primary holding
      noPrimaryHolding: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    CorporationInviteContainer: {
      error: {
        // Template: Company not found
        notFound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Invite Company
      invite: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: If {company} is not already a member of another corporation, you can invite it to become one of yours.
        description: ((options: { company: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      pendingInvite: {
        // Template: Capital Contribution
        contribution: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Invite sent
        invited: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Company
        invitee: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Invited by
        invitor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Shares
        shares: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Corporation Invite: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Corporation Invite
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CorporationInvitesContainer: {
      table: {
        // Template: No pending invitations.
        empty: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Company
        invitee: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Invited by
        invitor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Invite sent
        sent: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: view
        view: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Corporation Invites
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    CorporationMembership: {
      formCorporation: {
        // Template: Form New Corporation
        title: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      invites: {
        // Template: Invitations to join existing Corporations
        title: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CorporationMembershipPanel: {
      action: {
        // Template: Are you sure you want to leave the corporation? You will need another invitation to join again!
        confirmation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Leave
        leave: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Your Corporation
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    CorporationNewProject: {
      action: {
        // Template: Project started!
        started: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      command: {
        // Template: start
        start: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Bill of material
        billofmaterial: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Description
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Limit
        limit: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Location
        location: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Project
        project: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Site
        site: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {amount} / {cardinality}
      limit: ((options: { amount: string; cardinality: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    CorporationNewProjectPanel: {
      // Template: You are not member in a corporation
      empty: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: New corporation project
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    CorporationProject: {
      // Template: Location
      address: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Bill of material
      billOfMaterial: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: CMD
      command: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Cancel Project
        cancelProject: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Constructed
      constructionDate: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      contribute: {
        // Template: You need a base or a ship on the planet to be able to contribute.
        error: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      description: {
        // Template: NO FUNCTIONALITY ATM - Prestige Building
        ftl_laboratory: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Corporation Headquarters are the first project a newly founded corporation has to build in order to function properly. Headquarters have to be built on a planet outside faction space and will provide a 10% production boost for all members on that planet.
        hq: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: NO FUNCTIONALITY ATM - Prestige Building
        immortality_center: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: The APEX representation center allows corporations to donate some of their profits to the APEX foundation.{break}The foundation uses the money to supply new and upcoming CEOs with the necessary capital and ships to start their entrepreneurial journey.{break}Having a high representation level is widely recognized as a testimony of wealth and success.
        representation_center: ((options: { break: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: NO FUNCTIONALITY ATM - Prestige Building
        terraforming_center: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: --
      empty: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: FTL Laboratory
      ftl_laboratory: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Headquarters
      hq: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Immortality Center
      immortality_center: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Project:
      project: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: APEX Representation Center
      representation_center: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      section: {
        // Template: Contribute
        contribute: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Contributions
        contributions: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Status
      status: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: in construction
        inConstruction: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: operational
        operational: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Terraforming Center
      terraforming_center: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      ticker: {
        // Template: FTL
        ftl_laboratory: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: HQ
        hq: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: IMM
        immortality_center: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: CRC
        representation_center: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: TFC
        terraforming_center: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CorporationProjectPanel: {
      action: {
        // Template: Cancel project
        cancel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Are you sure you want to cancel this project? No materials can be reimbursed.
          confirmation: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      error: {
        // Template: No project found.
        projectId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: You are not member in a corporation
      noCorporation: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Corporation project: {type} @ {name}
      title: ((options: { type: string; name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Corporation project: loading…
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Corporation project: not found…
        notFound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Corporation projects
        projects: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CorporationRepresentationCenter: {
      error: {
        // Template: No APEX Representation Center found
        noRepresentation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: APEX Representation Center
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Corporations: {
      action: {
        // Template: details
        detail: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      list: {
        // Template: Code
        code: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CorporationsPanel: {
      error: {
        // Template: Corporation not found.
        corporationId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      title: {
        // Template: Corporations
        listing: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Corporation: {name}
        single: ((options: { name: string }) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Corporation
          loading: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    CorporationsTile: {
      // Template: Failed to load corporations.
      error: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Country: {
      AI: {
        // Template: At the time the planet-killer was discovered, early colonization efforts on Mars had just started to bear fruit. Not quite self-sustaining yet, the young colony had to decide whether to focus on making Mars habitable, accepting the risk of unknown consequences caused by a total destruction of earth, or to divert resources to the exodus project. The population was divided over the topic and eventually, the Antares Initiative split off to pursue a cost-effective way to reach the new homeworlds. Their technology is very basic and makes use of whatever was available on Mars at the time. They were among the first to leave and did so with many small, autonomous ships. Due to their sub-standard propulsion systems they only arrived very late in the colonies.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Antares Initiative
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      CI: {
        // Template: Castillo-Ito Mercantile is the result of a merger between the Ito Robotics Corporation, a world leader in robotics and automation technology, and the Castillo Group, an international holding company dealing in just about everything including minerals, energy, transport and financial products. The company’s net worth easily surpasses many European countries combined. They entered the exodus project early on and had a clear strategy in mind from the get-go. Carefully selecting promising planets in strategic locations, they assembled a fleet of reliable generation ships, all of which successfully made the trip to and landfall on planets in 4 neighboring systems. With access to many crucial resources, they plan on fueling their ambitions plans to become a major force in the new worlds.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Castillo-Ito Mercantile
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      IC: {
        // Template: Before the exodus, South America had become the breadbasket of the world and the countries and corporations of the continent had their mind set on becoming the same in the new worlds. Coordinated by the Insitor Bank, a cooperative owned and controlled mostly by agricultural and bio-tech companies, they opted for a monolithic approach, building a single huge, completely self-sufficient generation ship with more greenhouse and livestock capacity than any other design pursued by other factions. To satisfy the enormous need for resources, they pushed their governments to nationalize most of the private mining companies. Their colonization target was a very fertile planet they christened Promitor.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Insitor Cooperative
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      NC: {
        // Template: NCE started out as one of the first space-based mining corporations. A charter granted by a European monarchy allowed them to exploit the name-giving near-earth objects between Earth and the Asteroid Belt. When the news of the exodus project broke, they already had the necessary infrastructure in place to start construction of a large generation ship right away. For this purpose, they captured a small asteroid, hollowed it out and used the excavated minerals to manufacture most required systems in place. All of this happened in relative independence of Earth, but NCE still opted for participation in the APEX system to gain access to funds and components that were only available on Earth. After their arrival in a mineral-rich star system, they parked the generation ship on an orbit around one planet and quickly sent smaller ships to make landfall on a second one.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: NEO Charter Exploration
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Faction agents
        agents: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Background
        background: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Code
        code: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Contract offers
        contractOffers: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Receive contract offers
        receiveContractOffers: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CountryAgent: {
      AI: {
        // Template: Antares Development Manager
        EXPANSION: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Antares Chief Scientist
        EXPLORATION: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Antares Chief Administration Officer
        GOVERNANCE: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Antares Head of Excellence
        INFRASTRUCTURE: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Antares Logistics Officer
        LOGISTICS: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      CI: {
        // Template: Castillo-Ito Influence Executive
        EXPANSION: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Castillo-Ito Exploration Officer
        EXPLORATION: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Castillo-Ito Minister of Balance
        GOVERNANCE: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Castillo-Ito Framework Manager
        INFRASTRUCTURE: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Castillo-Ito Director of Coordination
        LOGISTICS: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      IC: {
        // Template: Insitor Director of Advancement
        EXPANSION: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Insitor Director of Space Analysis
        EXPLORATION: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Insitor Head Diplomat
        GOVERNANCE: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Insitor Infrastructure Officer
        INFRASTRUCTURE: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Insitor Distribution Manager
        LOGISTICS: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      NC: {
        // Template: NEO Charter Expanse Officer
        EXPANSION: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: NEO Charter Expedition Manager
        EXPLORATION: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: NEO Charter Empire Official
        GOVERNANCE: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: NEO Charter Director of Upkeep
        INFRASTRUCTURE: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: NEO Charter Strategy Executive
        LOGISTICS: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CountryControls: {
      label: {
        // Template: Factions
        countries: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CountryPanel: {
      error: {
        // Template: No faction for input ’{input}’.
        id: ((options: { input: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Faction
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Faction {name}
        country: ((options: { name: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CreateGroupMembership: {
      form: {
        // Template: cancel
        cancel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: create
        create: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Create a Group Channel
        header: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CreateOneOnOneMembership: {
      form: {
        // Template: cancel
        cancel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: start
        create: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Start private Conversation
        header: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Username
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    CreateScreenForm: {
      button: {
        // Template: Create
        create: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      form: {
        // Template: Description
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Currency: {
      // Template: {name} ({code})
      nameAndCode: ((options: { name: string; code: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Damage: {
      // Template: {damage}%
      value: ((options: { damage: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    DeleteCompanyPanel: {
      // Template: Click here to confirm that you really wish to liquidate your current company.
      confirm: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The next company liquidation is possible in {time}
      cooldown: ((options: { time: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: If you wish to start over, you can liquidate your company '{name}'.
      description: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You do not currently control a company.
      noCompany: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: NOTE: You have {contracts, plural, one {a pending contract} other {{contracts} pending contracts}}. Please consider resolving them first before you continue to liquidate your company.
      pendingContracts: ((options: { contracts: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Liquidate
      submit: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Company Liquidation
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: WARNING: Once the deletion of a company has been started it can neither be stopped nor reverted!
      warning: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: WARNING: Selling or buying commodities at an unusual price prior to a company liquidation is illegal and may result in the revocation of your APEX license.
      warning2: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: WARNING: Subsequent liquidations will only be possible after a significant waiting time.
      warning3: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    DeliveryConditionEditForm: {
      form: {
        // Template: Address
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Material
        material: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Distance: {
      // Template: {distance} {unit}
      distance: ((options: { distance: string; unit: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    DistanceUnit: {
      // Template: AU
      au: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: hops
      hops: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: km
      km: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: parsecs
      parsec: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Dock: {
      controls: {
        // Template: NEW BFR
        newBuffer: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    DraftConditionEditor: {
      // Template: Condition editor
      header: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    DraftConditionParameterEditForm: {
      form: {
        // Template: Deadline
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    DraftPartyName: {
      // Template: Partner
      other: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Self
      self: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    // Template: Shipment #{id}
    DropDownBoxShipmentItem: ((options: { id: string }) => string) & {
      getFormat: () => IntlMessageFormat;
    };
    DropTargetView: {
      // Template: ALL
      ALL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: AMT
      AMT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: HLF
      HLF: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: MAX
      MAX: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: MAX VOL
      MAX_VOL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: MAX WGT
      MAX_WGT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    EfficiencyFactor: {
      // Template: CoGC program
      COGC_PROGRAM: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Company Headquarters
      COMPANY_HEADQUARTERS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Corporation Headquarters
      CORPORATION_HQ: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Experts
      EXPERTS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Soil fertility
      FERTILITY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Production Line Condition
      PRODUCTION_LINE_CONDITION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    EndlessScrollControl: {
      label: {
        // Template: Click to load more
        loadmore: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    EntityLink: {
      // Template: Government of {entity}
      government: ((options: { entity: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    EnvironmentTable: {
      row: {
        // Template: Gravity
        gravity: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Pressure
        pressure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Temperature
        temperature: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ErrorBoundary: {
      // Template: Component failed to render.
      error: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ExpertiseCategory: {
      // Template: Agriculture
      AGRICULTURE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Chemistry
      CHEMISTRY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Construction
      CONSTRUCTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Electronics
      ELECTRONICS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Food Industries
      FOOD_INDUSTRIES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Fuel Refining
      FUEL_REFINING: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Manufacturing
      MANUFACTURING: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Metallurgy
      METALLURGY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Resource Extraction
      RESOURCE_EXTRACTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Experts: {
      action: {
        // Template: act
        activate: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: rmv
        deactivate: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {active} / {totalActiveCap}
      activeExperts: ((options: { active: string; totalActiveCap: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {current} / {limit}
      currentAndLimit: ((options: { current: string; limit: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      label: {
        // Template: Active / Max Experts
        activeExperts: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Total Experts
        totalExperts: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Active
        active: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Available
        available: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Category
        category: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Controls
        controls: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Efficiency Gain
        efficiency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Progress
        progress: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ExpertsPanel: {
      error: {
        // Template: Base not found.
        siteId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Experts @ {name} Base
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Experts
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ExternalURLPanel: {
      // Template: The link will open in a new tab.
      hint: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: This link leads to a URL outside of APEX. Please click the button below if you want to follow it anyway.
      info: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Open Link
      link: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: External URL
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Faction: {
      AI: {
        // Template: Martian Coin (AIC)
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: The Antares Initiative has two original colonies: Deimos, the Aluminium capital of the galaxy, and Phobos the manufacturing and electronics heart of the Initiative. They’ve recently started to colonize Harmonia as their future breadbasket.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      CI: {
        // Template: Sol (CIS)
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Castillo-Ito Mercantile has several more specialized colonies in its wider region often focusing on cooperation across planets. Umbra and Katoa, are known for their fuel and plastics, Proxion and Etherwind for their food, and Gibson for its construction.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      EC: {
        // Template: Exodus Council Drawing Rights (ECD)
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: The Exodus Council has a single colony featuring a commodity exchange and profits from being close to the other factions.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      IC: {
        // Template: Austral (ICA)
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: The Insitor Cooperative stems from its primary colony of Promitor, known as the garden of the galaxy due to its fertility. Recently, it has begun to explore its more barren backyard with the colonies of Avalon, Nova Honshu, and the further away, Boucher.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      NC: {
        // Template: NCE Coupons (NCC)
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: NEO Charter Exploration has two original colonies in its main system Moria: Montem, and Vallis. Notable other colonies include Prism and a far-flung new farming colony of Verdant. The faction is known for its mineral and construction wealth.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    FeeLocalMarketComponent: {
      label: {
        // Template: Base fee
        base: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Time factor
        time: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    FeeProductionContainer: {
      label: {
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Production Fees
        productionFees: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    FeeSiteEstablishmentComponent: {
      label: {
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    FeeWarehouseComponent: {
      label: {
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    FilterTag: {
      action: {
        // Template: x
        close: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Finance: {
      context: {
        // Template: Balance Statement
        balanceStatement: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Income Statement
        incomeStatement: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Liquid Assets
        liquidAssets: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Financial Overview
        overview: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    FinanceOverviewPanel: {
      header: {
        // Template: Recent Cash Transactions
        cashBookings: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Key Figures
        indicators: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      indicators: {
        assets: {
          // Template: Current Assets
          current: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Fixed Assets
          fixed: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Liquid Assets
          liquid: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Equity
        equity: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Expenses
        expenses: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Liabilities
        liabilities: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Result
        result: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Revenue
        revenue: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Financial Overview
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Fleet: {
      context: {
        // Template: Planet Info
        planetInformation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ship Flight Control
        shipFlightControl: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: System Map
        systemMap: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    FleetPanel: {
      error: {
        // Template: Planet not found.
        planetId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: System not found.
        systemId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Fleet
      fleet: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Fleet @ {address}
      fleetAt: ((options: { address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      table: {
        // Template: Cargo
        cargo: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Command
        command: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Destination
        destination: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: ETA
        eta: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Fuel
        fuel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Location
        location: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Transponder
        registration: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        ship: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Fleet: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Fleet
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    FlightControlContainer: {
      action: {
        // Template: abort flight
        abort: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Are you sure to abort this flight? The current flight segment will be finished in any case.
          description: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: start
        start: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The flight from {origin} to {destination} will take {duration}.
          content: ((options: {
            origin: string;
            destination: string;
            duration: string;
          }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Are you sure you want to start this flight? Flights can be aborted, but the current flight segment will always be finished.
          description: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    FlightControlPanel: {
      error: {
        // Template: No ship found.
        shipId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      title: {
        // Template: Ship Flight Control
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    FlightControlView: {
      // Template: {mass}t / {operatingEmptyMass}t
      mass: ((options: { mass: string; operatingEmptyMass: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    FlightPlan: {
      // Template: Consumption
      consumption: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Damage
      damage: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Destination
      destination: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Distance
      distance: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Duration
      duration: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: #
      index: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Type
      type: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ForEx: {
      context: {
        // Template: Chart
        chart: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Liquid Assets
        liquidAssets: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Rate Matrix
        matrix: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Order Book
        orderBook: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Own Orders
        orders: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Place Order
        placeOrder: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Exchange Rate
        price: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ForExInlineTickerQuote: {
      // Template: {ticker} ({highlight}{arrow})
      line: ((options: { ticker: string; highlight: string; arrow: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ForExOrderBook: {
      error: {
        // Template: No broker found for ticker {ticker}.
        ticker: ((options: { ticker: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Offers
      offers: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: No offers.
        none: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Requests
      requests: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: No requests.
        none: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Spread: {spread}
      spread: ((options: { spread: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      table: {
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Price
        price: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Trader
        trader: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Order book ({ticker})
      title: ((options: { ticker: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ForExOrderPanel: {
      data: {
        // Template: Remaining Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Initial Amount
          initial: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Limit
        limit: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency Pair
        ticker: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No order found for input {input}.
        id: ((options: { input: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: FX Order
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Trades
      trades: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: No trades took place so far.
        empty: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Partner
        partner: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Price
        price: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Time
        time: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ForExOrdersPanel: {
      // Template: Order deleted.
      deleted: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Foreign Exchange Orders
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ForExOrdersTable: {
      action: {
        // Template: delete
        _delete: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: view
        view: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {amount} ({initial})
      amount: ((options: { amount: string; initial: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      table: {
        // Template: Amount (initial)
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Limit
        limit: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency Pair
        ticker: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ForExPlaceOrderForm: {
      _: {
        // Template: Fee total
        labelfeeTotal: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: buy
      buy: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      label: {
        // Template: Quantity
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        currency: {
          // Template: Base Currency
          base: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Quote Currency
          quote: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Fee
        fee: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: For each FX trade a fee has to be paid by the buyer and seller. That fee is deducted once the order is matched from the amount of currency you receive from the trade.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Lots
        lots: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Currency can only be bought or sold in multiples of a lot. A lot is 1000 units.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Lot Size
          size: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Place order
        placeOrder: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Current Price
        price: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Net amount after fees
        total: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Volume
        volume: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The volume is the amount of currency removed from your account once the order is posted.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      limit: {
        // Template: Maximum price
        maximum: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Minimum price
        minimum: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {rate} {action}
      price: ((options: { rate: string; action: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: set
        set: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: sell
      sell: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ForExPlaceOrderPanel: {
      error: {
        // Template: No broker found for ticker {ticker}.
        ticker: ((options: { ticker: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      tab: {
        // Template: BUYING {currency}
        buy: ((options: { currency: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: SELLING {currency}
        sell: ((options: { currency: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Place FX Order ({ticker})
      title: ((options: { ticker: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ForExPrice: {
      // Template: {absolute} ({relative})
      change: ((options: { absolute: string; relative: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: 1 {code} = {rate}
      rate: ((options: { code: string; rate: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ForExPriceChart: {
      error: {
        // Template: No broker found for ticker {ticker}.
        ticker: ((options: { ticker: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Chart: {ticker}
      title: ((options: { ticker: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ForExPricePanel: {
      error: {
        // Template: No broker found for ticker {ticker}.
        ticker: ((options: { ticker: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Exchange Rate {ticker}
      title: ((options: { ticker: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ForExPricePanelContent: {
      // Template: Ask
      ask: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Bid
      bid: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {baseName} ({baseCode}) traded in {quoteName} ({quoteCode})
      exchange: ((options: {
        baseName: string;
        baseCode: string;
        quoteName: string;
        quoteCode: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: High
      high: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Low
      low: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Traded
      traded: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ForeignExchange: {
      currencies: {
        // Template: Base
        base: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Quote
        quote: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Foreign Exchange
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    FormCorporationForm: {
      // Template: Starting Capital
      capital: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Code
      code: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Name
      name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Form Corporation
      submit: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Forms: {
      validation: {
        error: {
          float: {
            // Template: This is not a valid number.
            invalid: ((options: void) => string) & {
              getFormat: () => IntlMessageFormat;
            };
          };
          integer: {
            // Template: This is not a valid integer.
            invalid: ((options: void) => string) & {
              getFormat: () => IntlMessageFormat;
            };
          };
          // Template: This field is required.
          isRequired: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Must be less than or equal {max}.
          max: ((options: { max: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Must not be longer than {max} characters.
          maxLength: ((options: { max: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Must be greater than or equal {min}.
          min: ((options: { min: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Must be longer or equal than {min} characters.
          minLength: ((options: { min: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Input invalid.
          pattern: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          string: {
            // Template: This is not a valid string.
            invalid: ((options: void) => string) & {
              getFormat: () => IntlMessageFormat;
            };
          };
        };
      };
    };
    Frame: {
      // Template: Your session has expired.
      loginRequired: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Click here to log in again.
        dismiss: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: APEX alpha
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      toggle: {
        // Template: BS
        bases: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Bases
          tooltip: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: BFRS
        buffers: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: CMDS
        commands: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Commands
          tooltip: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: CXL
        commodityexchanges: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        communication: {
          // Template: Communication
          tooltip: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: COM
        communications: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: CONT
        contracts: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Contracts
          tooltip: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: CORP
        corporation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Corporation
          tooltip: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        cx: {
          // Template: Commodity Exchanges
          tooltip: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: FIN
        financials: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Financial overview
          tooltip: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: FLT
        fleet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Fleet
          tooltip: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        footer: {
          // Template: Toggle footer
          tooltip: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        header: {
          // Template: Toggle header
          tooltip: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        inventories: {
          // Template: Inventories
          tooltip: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: INV
        inventory: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: LEAD
        leaderboards: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Leaderboards
          tooltip: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: MAP
        map: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: PROD
        production: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Production Lines
          tooltip: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: SCRNS
        screens: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: SDBR
        sidebar: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Toggle sidebar
          tooltip: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        universemap: {
          // Template: Universe Map
          tooltip: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Authentication failed.
      unauthenticated: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    FuelConsumption: {
      // Template: {amount} {amount, plural, one {unit} other {units}} {label} {percentage}
      label: ((options: { amount: number; label: string; percentage: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: ({percentage}%)
      percentage: ((options: { percentage: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    FuelUnits: {
      // Template: FTL fuel
      ftl: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: STL fuel
      stl: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Vortex fuel
      vortex: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    FullscreenCard: {
      EditMenu: {
        action: {
          // Template: Delete Card
          _delete: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: move to stack
          move: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Move/delete Card
        title: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      action: {
        // Template: back
        back: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: CTX
        context: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Next
        next: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: prev
        prev: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Stack
        stack: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      context: {
        // Template: Context
        title: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Gateway: {
      action: {
        traffic: {
          // Template: Details
          details: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        upkeep: {
          // Template: Details
          details: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: {count} / 5
      capacityUpgrades: ((options: { count: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {count} / 3
      distanceUpgrades: ((options: { count: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      header: {
        // Template: Capacity
        capacity: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Information
        general: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Links
        link: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Traffic
        traffic: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upgrade
        upgrade: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upkeep
        upkeep: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Capacity upgrades
        capacityUpgrades: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Details
        details: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Distance upgrades
        distanceUpgrades: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Established
        established: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Id
        id: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Jumps per 24h
        jumpsPerDay: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Link established
        linkestablished: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Maximum link radius
        linkradiusmaximum: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Link requests
        linkrequests: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Link status
        linkstatus: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Location
        location: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Maximum ship volume
        maxShipVolume: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Operator
        operator: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Outgoing link
        outgoinglink: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Jumps in the last 24h
        recentJumps: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Volume upgrades
        volumeUpgrades: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {radius} parsecs
      linkradius: ((options: { radius: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {maxShipVolume}m³
      maxShipVolume: ((options: { maxShipVolume: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      message: {
        // Template: This gateway is currently under construction. Current progress is {progress}.
        inConstruction: ((options: { progress: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {current} / {capacity}
      recentJumps: ((options: { current: string; capacity: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      upgrade: {
        // Template: Contractor
        constractor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: No upgrade in progress
        noupgrade: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        parameter: {
          // Template: Capacity: {current} ➔ {target}
          capacity: ((options: { current: string; target: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Distance: {current} ➔ {target}
          distance: ((options: { current: string; target: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Volume: {current} ➔ {target}
          volume: ((options: { current: string; target: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Progress
        progress: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Started
        started: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Construction store
        store: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: store
          action: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Upgrades
        upgrades: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {count} / 3
      volumeUpgrades: ((options: { count: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    GatewayFuelComponent: {
      label: {
        // Template: Address
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Contractor
        contractor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Current upkeep phase
        currentUpkeepPhase: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Gateway
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Start at upkeep phase
        initialPeriod: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Payment per phase
        payment: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Service level objective
        serviceLevel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upkeep phase end
        upkeepPhaseEnd: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upkeep phases
        upkeepPhases: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    GatewayInformation: {
      costs: {
        // Template: Base
        base: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Capacity upgrades
        capacity: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Distance upgrades
        distance: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Total
        total: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Volume upgrades
        volume: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      header: {
        // Template: Building costs
        buildingCosts: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Parameters
        parameters: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Gateway Specifications
        specs: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upkeep
        upkeep: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Upkeep
        upkeep: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      specs: {
        // Template: Capacity upgrades
        capacityUpgrades: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Range upgrades
        distanceUpgrades: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Fuel storage capacity
        maxFuelStorage: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Linking range
        maxLinkingRadius: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Max. ship volume
        maxShipVolume: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Uses per day
        maxUses: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Volume upgrades
        volumeUpgrades: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Distance
        distance: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: System
        system: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    GatewayInformationForm: {
      action: {
        // Template: calculate
        calculate: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Location
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Current capacity upgrades
        currentCapacityUpgrades: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Current range upgrades
        currentDistanceUpgrades: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Current volume upgrades
        currentVolumeUpgrades: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Established
        established: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planned capacity upgrades
        plannedCapacityUpgrades: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planned range upgrades
        plannedDistanceUpgrades: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planned volume upgrades
        plannedVolumeUpgrades: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Total upgrades
        totalUpgrades: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    GatewayInformationPanel: {
      // Template: Gateway Information
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    GatewayLinkComponent: {
      label: {
        // Template: Destination address
        destinationAddress: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Destination gateway
        destinationGateway: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Destination gateway range
        destinationRange: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Distance
        distance: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Origin address
        originAddress: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Origin gateway
        originGateway: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Origin gateway range
        originRange: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    GatewayLinkRange: {
      // Template: insufficient
      insufficient: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {distance} ({sufficient})
      range: ((options: { distance: string; sufficient: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: sufficient
      sufficient: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    GatewayPanel: {
      context: {
        // Template: Gateway Information
        gatewayInformation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: Could not find a gateway for the given input
        noGateway: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      title: {
        // Template: Gateway
        gateway: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Gateways
        gateways: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    GatewayParametersInput: {
      // Template: {sum} / 5
      parameterSum: ((options: { sum: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      select: {
        capacity: {
          // Template: Capacity
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        distance: {
          // Template: Range
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        volume: {
          // Template: Volume
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      totalUpgrades: {
        // Template: Total upgrades
        label: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    GatewayPricingComponent: {
      label: {
        // Template: Address
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Gateway
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Usage fee
        usageFee: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    GatewayTraffic: {
      // Template: {current} / {total}
      fuelAvailable: ((options: { current: string; total: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      header: {
        // Template: Capacity
        capacity: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Contractors
        contractors: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Fuel
        fuel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Information
        general: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Traffic
        traffic: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Average fuel availability
        fuelAvailability: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Shows the average availability of fuel for at least one jump over the course of the last ten upkeep phases.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Available fuel units
        fuelAvailable: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Fuel per jump
        fuelPerJump: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      usageFee: {
        // Template: Usage fee
        location: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    GatewayTrafficPanel: {
      context: {
        // Template: Gateway
        gateway: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      title: {
        // Template: Gateway Traffic
        gateways: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    GatewayUnlinkComponent: {
      label: {
        // Template: Address
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Destination
        destination: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Gateway
        gateway: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Gateways: {
      table: {
        action: {
          // Template: view
          view: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Location
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Established
        established: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Linked to
        link: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Operator
        operator: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Government: {
      error: {
        // Template: No government has been established yet.
        noAdminCenter: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      header: {
        // Template: Government
        government: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Motions
        motions: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Votes
        votes: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        motions: {
          // Template: Description
          description: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Motion
          motionId: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Status
          status: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        votes: {
          // Template: Corporation
          corporation: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Faction
          country: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: User
          user: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Votes
          votes: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      term: {
        // Template: End
        end: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Governor
        governor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Members of Parliament
        membersOfParliament: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Parliament size
        parliament: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Start
        start: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      votes: {
        // Template: Total
        total: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {votes} / {percentage}
        votes: ((options: { votes: string; percentage: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    GovernmentContainer: {
      error: {
        // Template: This Administration Center has not formed a government yet
        noTerm: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      terms: {
        // Template: Current term
        current: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Term #{naturalId} (current)
        termCurrent: ((options: { naturalId: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Term #{naturalId}
        termPrevious: ((options: { naturalId: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    GovernmentPanel: {
      error: {
        // Template: No government found for input {input}.
        id: ((options: { input: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Government
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Government: {planet}
        withPlanet: ((options: { planet: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    GroupChannelMembershipPanel: {
      // Template: Group {name}
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Head: {
      item: {
        // Template: Audio
        audio: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {username} ☰
        menu: ((options: { username: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    HeaderDropdown: {
      action: {
        // Template: {icon} Audio
        audio: ((options: { icon: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {icon} Help
        help: ((options: { icon: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {icon} Login
        login: ((options: { icon: string }) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: login
          alt: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: {icon} Logout
        logout: ((options: { icon: string }) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: logout
          alt: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    Help: {
      // Template: disabled
      disabled: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: enabled
      enabled: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      settings: {
        // Template: Show command context help
        contexthelp: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Show help task progress
        help: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      text: {
        // Template: Happy trading!
        trading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Welcome, licensee!
        welcome: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: If you are new to APEX please check out the introductory tasks below. They will guide you through the basics of APEX and help you get started!
        welcome2: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    HelpHeadItem: {
      // Template: HELP: {progress}
      help: ((options: { progress: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {fulfilled} / {total}
      helpProgress: ((options: { fulfilled: string; total: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: HELP: --
      loading: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    HelpPanel: {
      // Template: Help
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Hints: {
      comex: {
        // Template: The selected planetary system is far from the next commodity exchange. Starting close to a commodity exchange is generally considered easier.
        comexfaraway: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      currency: {
        // Template: The closest commodity exchange uses a different currency than your faction. Trading is possible but a bit more complicated than with just a single currency.
        nomatch: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      fertility: {
        // Template: As a carbon farmer you depend on planets with fertile soil to grow plants. The selected planet is infertile.
        carbonfarmer: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: As a victualler you depend on planets with fertile soil to grow plants. The selected planet is infertile.
        victualler: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      plots: {
        // Template: The chosen planet has almost no free plots left to build a new base. It might run out of plots before your ships arrive. Consider starting somewhere else.
        low: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: The chosen planet has no plots left to build a new base. Please select another planet!
        none: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Impersonation: {
      action: {
        // Template: Stop
        stop: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: You are currently impersonating another user!
      text: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    InGameNotificationConfigPanel: {
      table: {
        // Template: Notifications
        enabled: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Alert
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: In-game Notification Settings
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    // Template: Failed to generate income statement.
    IncomeStatementPanel: ((options: void) => string) & {
      getFormat: () => IntlMessageFormat;
      // Template: Change
      change: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Expenses
      expenses: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      period: {
        // Template: Current Period
        current: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Last Period
        last: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Previous Period
        previous: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Result
      result: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Revenues
      revenues: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Income Statement
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Total
      total: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    IncrementalNumberInput: {
      action: {
        // Template: -
        dec: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: +
        inc: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    InfrastructureContractors: {
      table: {
        // Template: Contractors
        contractors: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: {contractor} [{contract}]
          value: ((options: { contractor: string; contract: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Phase
        phase: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    InfrastructureLink: {
      // Template: {gatewayAmount, plural, one {Gateway} other {{gatewayAmount} Gateways}}
      gateways: ((options: { gatewayAmount: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    InfrastructureNameComponent: {
      label: {
        // Template: Infrastructure
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Location
        location: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    InfrastructureOperationalState: {
      // Template: operational
      OPERATIONAL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: under construction
      UNDER_CONSTRUCTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: upkeep missing
      UPKEEP_MISSING: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    InfrastructurePanel: {
      context: {
        // Template: Fleet
        fleet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Inventory
        inventory: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: System Info
        systemInfo: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: System Map
        systemMap: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No system found.
        systemId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Infrastructure: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Infrastructure: loading…
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Infrastructure: not found…
        notfound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    InfrastructureType: {
      // Template: Gateway
      GATEWAY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    InfrastructureUpkeep: {
      header: {
        // Template: Contractors
        contractors: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Infrastructure
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upkeep
        upkeep: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Current upkeep phase
        currentUpkeepPhase: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Infrastructure
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Next upkeep
        next: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Operational State
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Weekly upkeep
        upkeep: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Uptime history
        uptime: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Uptime average
        uptimeAverage: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Shows the average uptime of the infrastructure over the course of the last ten upkeep phases.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    InfrastructureUpkeepPanel: {
      error: {
        // Template: Could not find any infrastructure for the given input
        notfound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Infrastructure upkeep
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    InputsOutputsView: {
      // Template: Input Materials
      inputs: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      material: {
        // Template: {amount, plural, one {1 unit} other {{amount} units}}
        amount: ((options: { amount: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {amount} {amount, plural, one {unit} other {units}} in store
        available: ((options: { amount: number }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {amount} {amount, plural, one {unit} other {units}} missing
        missing: ((options: { amount: number }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Output Materials
      outputs: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    InvalidCardPanel: {
      // Template: The card you selected cannot be found.
      info: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Invalid Card
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    InvalidCommandPanel: {
      // Template: The command you entered for this card is invalid. To remove the card, click the '+' button above and select the 'delete card' option.
      info: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Invalid Command
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    InvalidStack: {
      action: {
        // Template: Back
        back: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Stacks
        stacks: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: The stack you selected cannot be found.
      info: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    InventoriesPanel: {
      context: {
        // Template: Infrastructure
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Unpack
        unpack: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: No inventory found!
      noInventoryFound: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      table: {
        // Template: Location
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Owner
        owner: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: open
        view: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Volume
        volume: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Weight
        weight: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Inventories
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: inventory {type}
        inventory: ((options: { type: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Inventory: {
      // Template: {load} / {capacity}
      capacity: ((options: { load: string; capacity: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {load} / {capacity}m³
      capacityVolume: ((options: { load: string; capacity: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {load} / {capacity}t
      capacityWeight: ((options: { load: string; capacity: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    LanguageSelector: {
      header: {
        // Template: Community Translations
        community: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: These translations are provided by the community. They might not cover the whole game. Default fallback language is English.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Official Languages
        official: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    LastActivity: {
      active: {
        // Template: active right now
        now: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: last activity on {date}
        past: ((options: { date: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: active {timeAgo}
        recently: ((options: { timeAgo: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      muted: {
        // Template: recently muted
        now: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: muted on {date}
        past: ((options: { date: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: muted {timeAgo}
        recently: ((options: { timeAgo: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Leaderboard: {
      status: {
        // Template: loading..
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    LeaderboardController: {
      action: {
        // Template: own rank
        own: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: top ranks
        top: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Material
        material: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Range
        range: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Leaderboards: {
      table: {
        // Template: Company
        company: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Corporation
        coporation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: No leaderboard data available
        noData: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Rank
        rank: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Score
        score: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: User
        user: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Leaderboards
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    LicenseGifting: {
      header: {
        // Template: Gift PRO license
        gift: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Received Gifts
        received: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Sent Gifts
        sent: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: received
        received: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: sent
        sent: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Gift
        gift: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Time
        time: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: User
        user: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      value: {
        // Template: {days, plural, one {one day} other {{days} days}}
        gift: ((options: { days: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    LicenseGiftingForm: {
      action: {
        // Template: gift
        gift: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Days
        days: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Info
        note: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Recipient
        recipient: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Allows to gift another player a part of your PRO license time. The default fallback license for gifts is FREE.
      note: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    LicenseGiftingPanel: {
      action: {
        // Template: Do you want to gift {user} {days} days of your PRO license time?
        confirmation: ((options: { user: string; days: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Gift
        gift: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      context: {
        // Template: License
        license: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: License Gifting
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    LicenseHeadItem: {
      // Template: (expires in {countdown})
      expiry2d: ((options: { countdown: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: (expires in {countdown})
      expiry7d: ((options: { countdown: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: LIC: {level}
      level: ((options: { level: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: License Management
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    LicenseMobileHeader: {
      // Template: License - {level}
      level: ((options: { level: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    LinkStatus: {
      // Template: ESTABLISHED
      ESTABLISHED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: INCOMPLETE
      INCOMPLETE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: UNLINKED
      UNLINKED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    LiquidAssetsPanel: {
      table: {
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Liquid assets
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ListItemView: {
      // Template: {units, plural, one {{units} unit} other {{units} units}}
      units: ((options: { units: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {weight}t / {volume}m³
      weightVolume: ((options: { weight: string; volume: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Loading: {
      // Template: Loading…
      loading: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    LoadingState: {
      // Template: Please stand by, initializing the APEX console
      standby: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Welcome to APEX
      welcome: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    LocalMarket: {
      adType: {
        // Template: BUYING
        buying: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: SELLING
        selling: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: SHIPPING
        shipping: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      button: {
        // Template: Post ad
        post: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      context: {
        // Template: Own ads
        ads: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Blocklist
        blacklist: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Local market
        market: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planet information
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Post ad
        post: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: Unknown ad type
        adtype: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Error loading local market.
        id: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: This planet has no local market.
        nomarket: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      header: {
        // Template: Ads
        ads: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        market: {
          // Template: Location
          address: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Fee currency
          currency: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Fees
          fees: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
            // Template: Fees consist of a fixed base and a variable time value. The variable value depends on the visibility time of the ad.
            info: ((options: void) => string) & {
              getFormat: () => IntlMessageFormat;
            };
          };
          // Template: Operator
          operator: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      market: {
        // Template: {base} / {timeFactor}
        fees: ((options: { base: string; timeFactor: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {name} Local Market
      name: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Local market: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Local Market
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    LocalMarketAd: {
      banner: {
        // Template: You accepted this ad.
        contract: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      button: {
        // Template: show contract
        contract: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: Could not load accepted ads.
        ads: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: No ad found.
        id: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: This planet has no local market.
        nomarket: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      form: {
        // Template: accept
        accept: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ad
        ad: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {address} local market
        address: ((options: { address: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Creator
        creator: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: expired
        expired: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Expiry
        expiry: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Location
        location: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Required rating
        requiredRating: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Commodity
        ticker: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Local market: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Local market ad
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    LocalMarketAds: {
      command: {
        // Template: delete
        _delete: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: delete fulfilled
      deleteFulfilled: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      error: {
        // Template: invalid ad type
        invalidAdType: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      header: {
        // Template: Accepted ads
        accepted: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Own ads
        own: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        header: {
          // Template: Ad
          ad: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Cmds
          commands: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Contract
          contract: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Market
          market: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Partner
          partner: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Status
          status: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      title: {
        // Template: Local market ads
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    LocalMarketAdsPanel: {
      action: {
        // Template: delete
        _delete: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Are you sure to delete this ad?
          description: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    LocalMarketPost: {
      error: {
        // Template: You need a base or warehouse unit on the planet to be able to post ads in this local market.
        nobase: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: This planet has no local market.
        nomarket: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      form: {
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Auto-provision
        autoProvision: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Collection time (days)
        collectiontime: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Commodity
        commodity: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Delivery time (days)
        deliverytime: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Destination
        destination: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Fees
        fees: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Minimum rating
        minimumrating: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Origin
        origin: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Post buying ad
        postBuyingAd: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Post selling ad
        postSellingAd: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Post shipping ad
        postShippingAd: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Total price
        price: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Price per unit
        pricePerUnit: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ad duration (days)
        visibility: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      info: {
        // Template: If an auto-provisioning inventory is selected the materials will be provisioned as soon as a contract is formed and thus they will be available for pick-up by the hauler immediately. Setting an auto-provisioning inventory is optional.
        provisioningStore: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Local market: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Post ad
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    LocalMarketPostContainer: {
      error: {
        // Template: No local market found.
        localMarketId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    LocalMarkets: {
      header: {
        // Template: Planets
        planets: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Stations
        stations: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      planet: {
        // Template: Infrastructure
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Location
        location: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      station: {
        // Template: Infrastructure
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Location
        location: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    LocalRules: {
      establishment: {
        // Template: Fee
        fee: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      governance: {
        // Template: Faction affinity
        affinity: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Collector
        collector: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Location
        location: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      infrastructure: {
        // Template: Target
        active: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Built
        built: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Contribution (last period)
        contribution: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Current
        current: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Infrastructure
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      localmarket: {
        // Template: Base fee
        base: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Time factor
        timeFactor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The time factor determines how much higher the fees are for posting a longer-term local market ad.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      population: {
        // Template: Workforce reserve pool
        reserve: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The workforce reserve is, per workforce tier, held back during the weekly distribution of workforces among requesting bases on a planet. It will instead be available to newly founded bases or production lines in-between two workforce distributions.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: 10%
        reserveDefault: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      production: {
        // Template: ENG
        engineer: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Industry
        industry: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: PIO
        pioneer: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: SCI
        scientist: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: SET
        settler: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: TEC
        technician: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      section: {
        // Template: Base establishment fees
        establishmentfees: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Infrastructure projects
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Local market fees
        localmarketfees: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Need fulfillment (last period)
        needFulfillment: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Workforce
        population: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Production fees
        productionfees: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Production fees determine the amount of currency to be paid per 24 hours of full-time employment per worker of a certain tier. Fees are paid when a production order is started.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Warehouse fees
        warehousefees: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      tab: {
        // Template: Fees
        fees: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Population
        population: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Programs
        programs: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      warehouse: {
        // Template: Fee
        fee: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    LocalRulesFeeForm: {
      action: {
        // Template: set
        setProductionFee: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    LocalRulesPanel: {
      context: {
        // Template: Planet
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No local rules found for input {input}.
        id: ((options: { input: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Local Rules: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Local Rules
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    LocalRulesPopulation: {
      label: {
        active: {
          // Template: The target level indicates at which level the planet's infrastructure should run on. Changes will take effect starting with the next population report.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    LocalRulesPrograms: {
      error: {
        // Template: There needs to be an admin center in order to run government programs.
        noAdminCenter: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Category
        category: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Costs
        costs: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Description
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ended
        ended: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ends in
        endsIn: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: #
        number: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Program
        program: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Starts in
        start: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      section: {
        // Template: Active Program
        active: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Past Programs
        past: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upcoming Program
        upcoming: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Logo: {
      // Template: {logo} APEX
      title: ((options: { logo: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: APEX
        alt: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Maintenance: {
      // Template: The APEX console is currently down for maintenance.
      text1: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Thank you very much for your patience.
      text2: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Maintenance
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Material: {
      advancedBulkhead: {
        // Template: Compared to its little brother, the advanced bulkhead is slightly thicker and heavier, offering greater durability.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Advanced Bulkhead
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      advancedDeckElements: {
        // Template: Thick and durable, these 3D-printed floor tiles can be found in certain buildings and high-end spacecraft.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Advanced Deck Elements
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      advancedEngine: {
        // Template: An advanced-level STL engine with lots of thrust power and thus a relatively high fuel consumption.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Advanced STL Engine
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      advancedFuelPump: {
        // Template: An advanced fuel pump used in high-thrust spacecraft engines.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Advanced Fuel Pump
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      advancedFuelRod: {
        // Template: An advanced form of fuel rod that can be applied in fission reactors.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Advanced Fuel Rod
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      advancedHeatShield: {
        // Template: Surrounding a ship with these tiles will significantly reduce the damage it takes from extreme heat.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Advanced Thermal Protection Tile
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      advancedHighgSeats: {
        // Template: A set of special seats significantly increasing the maximum g-force values a ship's crew can endure.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Advanced High-G Seats
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      advancedHullPlate: {
        // Template: An advanced spaceship hull plate. It will significantly reduce a ship's overall deterioration and allow it to endure very high maximum g-force values.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Advanced Hull Plate
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      advancedNozzle: {
        // Template: An advanced nozzle used in medium-thrust spacecraft engines.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Advanced Nozzle
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      advancedRadiationShielding: {
        // Template: These plates protect a ship from taking damage from typical medium-star radiation levels.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Advanced Anti-rad Plate
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      advancedStructuralElements: {
        // Template: Laced with titanium, these are an even sturdier, yet much lighter version of reinforced structural elements.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Advanced Structural Elements
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      advancedThermalProtectionMaterial: {
        // Template: A borosilicate-impregnated ceramic fabric used for thermal protection against extreme heat.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Advanced Thermal Protection Material
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      advancedWhippleShielding: {
        // Template: Shielding plates that significantly reduce damage from flying through systems with a high meteoroid density.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Advanced Whipple Shielding
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      advancedWindow: {
        // Template: Fitted with reinforced frames and nano-coated glass, these windows have very specific uses in buildings and electronics.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Advanced Transparent Aperture
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      aerostatFoundation: {
        // Template: This modular, hollow platform can be filled with a lifting gas to build the buoyant foundations for structures in the upper atmosphere of gas giants.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Aerostat Foundation
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      airScrubber: {
        // Template: Air processing equipment that removes pollutants that are detrimental to life.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Air Scrubber
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      allPurposeFodder: {
        // Template: Fodder for animals of all kinds.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: All-Purpose Fodder
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      aluminium: {
        // Template: Aluminium and its alloys have been a staple of the aerospace industry since its early days, and they are still being used in virtually every structural part of modern spaceships.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Aluminium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      aluminiumIronAlloy: {
        // Template: An iron-based alloy commonly used as a budget replacement for titanium, so no miracles are to be expected.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ferrominium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      aluminiumOre: {
        // Template: An ore that can be smelted down to pure aluminium, which in turn plays a vital role in ship construction.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Aluminium Ore
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      aluminiumTitaniumAlloy: {
        // Template: Lightweight, flexible and durable, this namesake of Earth's titanium has become the de facto standard in space ship construction.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Alpha-Stabilized Titanium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      alurhenium: {
        // Template: An alloy that combines the flexibility of aluminium and the resistance of rhenium.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Alurhenium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      ammonia: {
        // Template: A staple of modern fuel production, Ammonia could be synthesized from Nitrogen and Hydrogen. However, collecting it directly from the atmosphere has proven more cost-efficient.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ammonia
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      antennaArray: {
        // Template: Uses a curved surface to direct signals to a focal point for collection.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Antenna Array
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      antibacterialTreeFlowers: {
        // Template: Flowers of the plant Humulus Iupulus used in the brewing of beer and herbal medicine.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Flowery Hops
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      argon: {
        // Template: A noble gas often used as inert atmosphere in smelting, metalworking and other applications.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Argon
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      artificialSoil: {
        // Template: Proper soil, created in the lab.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Artificial Soil
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      audioDistributionSystem: {
        // Template: Distributes audio signals within a pre-defined space.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Audio Distribution System
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      audioTransmitter: {
        // Template: Transmits audio signals between two end points.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Audio Transmitter
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      autoDoc: {
        // Template: Scans the patient's body for injuries and treats them via chemical injections.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Auto-Doc
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      automatedCoolingSystem: {
        // Template: A system monitoring and controlling heat in an FTL reactor.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Automated Cooling System
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      bacteria: {
        // Template: These microscopic organisms play a role in a number of processes such as fermentation and purification.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Helpful Bacteria
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      bandages: {
        // Template: Used to dress superficial injuries.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Bandages
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      basicAiFramework: {
        // Template: A collection of basic AI algorithms as a starting point for any even remotely intelligent machine.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic AI Framework
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      basicBulkhead: {
        // Template: Divide ships and buildings into several rooms, increase their structural rigidity and seal off fires or breached sections in case of an accident.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic Bulkhead
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      basicDeckElements: {
        // Template: Durable plastic floor plating for both buildings and spaceships, easily printable in various shapes and sizes.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic Deck Elements
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      basicFuelPump: {
        // Template: A standard fuel pump used in low-thrust spacecraft engines.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic Fuel Pump
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      basicFuelRod: {
        // Template: A tube to hold the fuel required to perform FTL jumps.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic Fuel Rod
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      basicHeatShield: {
        // Template: Surrounding a spaceship with these tiles will reduce the damage it takes from extreme heat.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic Thermal Protection Tile
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      basicHighgSeats: {
        // Template: A set of special seats increasing the maximum g-force values a ship's crew can endure.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic High-G Seats
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      basicHullPlate: {
        // Template: A basic spaceship hull plate.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic Hull Plate
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      basicNozzle: {
        // Template: A basic nozzle used in low-thrust spacecraft engines.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic Nozzle
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      basicRadiationShielding: {
        // Template: These plates protect a ship from taking damage from typical small-star radiation levels.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic Anti-rad Plate
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      basicStructuralElements: {
        // Template: General term for mid-sized structural ship and building components that are neither walls nor floors.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic Structural Elements
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      basicThermalProtectionMaterial: {
        // Template: A beryllium-impregnated ceramic fabric used in heat shields of all kinds.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic Thermal Protection Material
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      basicWhippleShielding: {
        // Template: Shielding plates that reduce damage from flying through systems with a high meteoroid density.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic Whipple Shielding
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      basicWindow: {
        // Template: Consisting of a metal frame, multiple layers of transparent plastic, and an emergency shutter in case the window gets compromised in non-breathable atmospheres or space.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic Transparent Aperture
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      beryl: {
        // Template: Beryllium Aluminum cyclosilicates. The most well known forms are emerald and aquamarine.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Beryl Crystals
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      beryllium: {
        // Template: Its thermal conductivity and low density make it useful for space based structures and ships. Beryllium is somewhat rare as it is fused into heavier elements inside stars.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Beryllium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      bioreactiveMineral: {
        // Template: A set of highly versatile minerals that serve as a basis for different kinds of chemical reagents.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Bioreactive Minerals
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      biosphereUnit: {
        // Template: A large-scale biosphere, often used to grow food and herbs for long-term space travel.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Biosphere Unit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      bleach: {
        // Template: Desaturation agent - or "bleach", as it is more commonly known - is used to eliminate the natural color, texture, and odor of raw textiles.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Desaturation Agent
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      blueGoldConnectors: {
        // Template: Shielded connectors help reduce the risk of signal interference.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Shielded Connectors
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      bodyScanner: {
        // Template: Scans human bodies, usually to detect injuries or contraband.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Body Scanner
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      boronCrystals: {
        // Template: Known for its resistance to heat, boron is widely applied for thermal protection purposes.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Boron Crystals
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      borosilicate: {
        // Template: A material highly resistant to thermal shock.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Borosilicate
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      breathableLiquid: {
        // Template: This oxygen-rich solution prevents lungs from collapsing under high acceleration or in high-pressure environments.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Breathable Liquid
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      caffeinatedBeans: {
        // Template: Coffee plants will rise up to 20 meters in height on low-gravity planets although they are generally tricky to grow, requiring heavy rain in just the right intervals.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Caffeinated Beans
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      calcium: {
        // Template: Human bones have been subjected to a host of new challenges since the space age began, making a regular calcium intake all the more important.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Calcium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      caliche: {
        // Template: Caliche is a sedimentary rock mostly mined for its iodine, a stable halogen used in contemporary lighting technology.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Caliche Rock
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      capacitor: {
        // Template: Capacitors are made up of two conductive plates that are close together but not in contact. When a voltage is applied to the two plates an electrical field is formed between them.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Electric Field Capacitor
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      carbohydrateGrains: {
        // Template: A staple of human nutrition since the neolithic revolution, grains are still a versatile ingredient in the age of space exploration.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: High-Carb Grains
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      carbohydrateMaize: {
        // Template: An essential, highly nutritional ingredient, maize is grown on farms and in greenhouse domes across the universe. Some incinerate it for its Carbon, others just want to make popcorn.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: High-Carb Maize
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      carbon: {
        // Template: Basis of all life and some industries, Carbon is used in ore purification and a variety of other processes.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Carbon
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      ceramicFabric: {
        // Template: Ceramic fabrics have proven very useful when it comes to coating spaceship hulls to protect them from extreme temperatures.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ceramic Fabric
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      ceramicTungstenFabric: {
        // Template: A tungsten-infused version of ceramic fabric for those who want to go the extra mile in terms of thermal protection.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ceramic-Tungsten Fabric
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      chemicalReagents: {
        // Template: Used to create a variety of drugs and other chemically created products.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Chemical Reagents
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      chlorine: {
        // Template: A chemical with many stand-out properties, chlorine has various uses in the food, clothing, and construction industries.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Chlorine
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      climateController: {
        // Template: A climate controller maintains environmental factors at a comfortable level in a ship or structure.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Climate Controller
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      combustionChamber: {
        // Template: Due to the extreme temperatures reached in combustion chambers, they come with multiple layers of borosilicate coating by default.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Combustion Chamber
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      commandBridge1: {
        // Template: A standard command bridge ready to be implemented into pretty much any spacecraft.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Command Bridge MK1
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      commandBridge2: {
        // Template: An advanced command bridge applied in spaceships using more complex engines and reactors.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Command Bridge MK2
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      commandBridgeShort: {
        // Template: A command bridge module specifically designed for STL-only intra-system space flight.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Short-distance Command Bridge
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      communicationSystem: {
        // Template: Full communication system ready to be implemented as part of a bigger complex.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Communication System
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      coolingFan: {
        // Template: A fan used to actively cool equipment by moving atmospheric gases over its surfaces.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Active Cooling Device
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      copper: {
        // Template: Its high electrical and thermal conductivity as well as its resistance to deformation and corrosion make copper a versatile ingredient in various electronic components.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Copper
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      copperAluminiumAlloy: {
        // Template: Among other things, this alloy of copper and aluminium has been found to considerably increase the efficiency of solar panels.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Bronze
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      copperConnectors: {
        // Template: Cheap but effective copper based connectors.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Budget Connectors
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      copperOre: {
        // Template: This ore can be smelted down to copper, a metal that is nowadays used mostly in electronic devices.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Copper Ore
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      coreModuleKit: {
        // Template: Provides everything required to build one's first base!
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Core Module Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      cottonProcessed: {
        // Template: A cloth made from cotton used in clothing as well as in medicine as a component of bandages.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Cotton Fabric
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      cottonRaw: {
        // Template: Domed cotton fields are warm and moderately humid places, and provide the basis for all of tomorrow's fashion trends.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Raw Cotton Fiber
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      crewQuarters: {
        // Template: A large ready-to-go unit for a full spaceship crew to live and sleep in.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Crew Quarters (Large)
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      crewQuartersMed: {
        // Template: A medium-sized ready-to-go unit for a full spaceship crew to live and sleep in.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Crew Quarters (Medium)
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      crewQuartersSmall: {
        // Template: A small ready-to-go unit for a full spaceship crew to live and sleep in.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Crew Quarters (Small)
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      crewQuartersTiny: {
        // Template: The smallest possible crew quarters. Say goodbye to luxury!
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Crew Quarters (Tiny)
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      crowdControlDrone: {
        // Template: A security drone equipped to control riots and detect contraband.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Crowd Control Drone
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      cryoUnit: {
        // Template: The cryogenic unit safely places biological specimens in, and takes them out, of cryogenic stasis.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Cryogenic Unit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      cryogenicFluid: {
        // Template: This transparent, jelly-like substance is used in cryogenic tanks, mostly on generation ships. It provides nutrients via skin contact and even mitigates the effects of high acceleration.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Cryogenic Stabilizer
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      cryopreservationUnit: {
        // Template: A unit holding cryopreservation tanks for long-term space travel.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Cryopreservation Unit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      dataAnalyzer: {
        // Template: The data analyzer applies artificial intelligence techniques to data in order to extract insights.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Data Analyzer
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      dataVisualizer: {
        // Template: The data visualizer creates, maps, graphs, charts and other visualizations to illustrate the insights gained from data analysis.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Data Visualizer
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      decorativeElements: {
        // Template: A variety of oddly shaped elements designed to serve as decorations at appropriate venues.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Decorative Elements
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      distributedDatabase: {
        // Template: A distributed data store. They are often used to maintain state between components of a distributed system.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Distributed Database
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      drinkingWater: {
        // Template: Treated water that is safe for drinking, food preparation and other day to day human uses.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Drinking Water
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      droneChassis: {
        // Template: The basic chassis for any kind of drone.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Drone Chassis
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      droneFrame: {
        // Template: Every drone chassis needs a proper holding frame.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Drone Frame
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      droneOperationsUnit: {
        // Template: Building unit set up for controlling and monitoring drone operations.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Drone Operations Unit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      einsteinium: {
        // Template: A radioactive element that did not exist naturally on Earth. The high radioactivity of some Einsteinium isotopes produces a visible glow.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Einsteinium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      engineerBundle: {
        // Template: Everything required to supply 100 engineers for 10 days.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Engineer Consumable Bundle
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      engineerClothing: {
        // Template: Half clothing, half computer, this garment assists engineers in their everyday tasks.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Smart Space Suit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      engineerFood: {
        // Template: This spicier version of standard-issue rations enjoys great popularity among engineers, who seem to enjoy sweating even during lunch break.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Flavoured Insta-Meal
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      engineerLuxuryDrink: {
        // Template: Sharing a bottle of gin has become one of the most prevalent ways to unwind after a long day's work. The added Einsteinium adds a certain hallucinatory quality that is hard to say no to.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Einsteinium-Infused Gin
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      engineerLuxuryHealth: {
        // Template: This paste works wonders on sore joints. VitaGel used to be a trademarked name but was soon also used for all the copies that flooded the market.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: VitaGel
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      engineerTools: {
        // Template: A handheld analysis tool with the ability to perform diagnostics checks and help with repairs.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Personal Data Assistant
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      enrichedEinsteinium: {
        // Template: Einsteinium enriched in a special chemical process for use in fission reactors.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Enriched Einsteinium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      enrichedTechnetium: {
        // Template: While not as radioactive as other materials, an enriched form of technetium proved very useful to, among other things, power radioisotope generators.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Enriched Technetium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      entertainmentDataCore: {
        // Template: Games, movies, shows, music, and everything that you dream of.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Entertainment Data Core
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      entertainmentUnit: {
        // Template: A full unit of entertainment hardware and control devices.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Entertainment Unit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      epoxy: {
        // Template: A highly viscous synthetic resin which, when hardened, acts as an adhesive reinforcement in building and ship components.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Epoxy Resin
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      fastenerKitMedium: {
        // Template: A medium set of standard fasteners.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Medium Fastener Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      fastenerKitSmall: {
        // Template: A small set of standard fasteners.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Small Fastener Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      fattyNuts: {
        // Template: Nuts provide important triglycerides, which are rich in energy. Make sure to always keep an eye on your blood fat and do not overindulge.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Triglyceride Nuts
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      fattyVegetables: {
        // Template: Similar-looking to Earth's fruits, but creamier and almost fatty-tasting, Triglyceride Fruits provide fewer health benefits, but more energy than their ancestors.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Triglyceride Fruits
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      fissionReactor: {
        // Template: Performs controlled nuclear fission in a chain reaction to generate large amounts of energy.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Fission Reactor
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      floatingTank: {
        // Template: A person-sized tank to have a mind-expanding floating experience in.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Floating Tank
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      flowControl: {
        // Template: This unit controls the flow of liquids in as a complex a way as its user desires.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Flow Control Device
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      fluidPiping: {
        // Template: This fluid piping system makes use of helium in its mantle to facilitate the discovery of leakage.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Fluid Piping
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      fluorine: {
        // Template: The lightest halogen element and extremely reactive. Fluorine has both medical and industrial applications.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Fluorine
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      flux: {
        // Template: When added to an ore refining process, this chemical allows for a more efficient separation of metals from slag, resulting in higher outputs for the same input.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Flux
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      ftlFieldController: {
        // Template: The FTL field controller enables FTL travel by using large amounts of energy to bend spacetime around a ship.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: FTL Field Controller
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      ftlFuel: {
        // Template: Used by the right drive, these small pellets emit an energy capable of warping spacetime and punching a tunnel for the ship to pass through.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: FTL Fuel
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      fuelSavingEngine: {
        // Template: Less powerful than a standard STL engine, but saves quite a bit of fuel at the same time.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Fuel-saving STL Engine
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      fullBodyInteractionDevice: {
        // Template: Essentially a high-tech overall that allows its wearer to control all kinds of software via gestures and movement.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Full-Body Interaction Device
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      galerite: {
        // Template: Although nowhere to be found in the Solar System, Galerite has brought upon a revolution in STL fuel technology shortly after its discovery in humanity's new home systems.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Galerite Rock
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      gasContainer: {
        // Template: Due to its shape and material, this gas tank can hold substances far above atmospheric pressure.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Cylindrical Gas Container
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      gasVent: {
        // Template: A controllable outlet for gases.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Gas Vent
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      gatewaySegment: {
        // Template: Several gateway segments are used to form the well-known ring structure of a gateway.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Gateway Segment
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      glassCombustionChamber: {
        // Template: As it turns out, reinforced glass can withstand quite a bit of heat.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Glass Combustion Chamber
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      glassEngine: {
        // Template: It was quite the feat when they discovered how to make a glass-based engine. It's not very powerful, but an affordable alternative!
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Glass-based STL Engine
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      glassNozzle: {
        // Template: Requires extremely careful handling, but works surprisingly well.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Glass Nozzle
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      gold: {
        // Template: Though it is still not an abundant resource, humanity has taken on a more pragmatic view of gold over the centuries, appreciating its conductivity more than its appearance.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Gold
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      goldCopperAlloy: {
        // Template: This alloy combines the excellent conductivity of both gold and copper.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Red Gold
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      goldIronAlloy: {
        // Template: An alloy of gold with Gallium or Indium.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Blue Gold
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      goldOre: {
        // Template: Ever since the 20th century, hydraulic mining has been the prevalent method of recovering gold nuggets from open pits and mine shafts.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Gold Ore
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      grapes: {
        // Template: Even though grapes have become rare in the space age, they will not die out as long as there is demand for decent wine in the universe.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Wine-Quality Grapes
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      habitatUnit: {
        // Template: An artificial, yet natural living space.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Habitat Unit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      habitationModule: {
        // Template: A module supporting long-term habitation on a colony ship.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Habitation Module
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      halite: {
        // Template: The natural form of rock salt, these crystals are both pretty to look at and taste good when ingested.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Halite Crystals
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      handcraftWorkshopUnit: {
        // Template: Hand-made art has become quite rare. This is where it comes to life.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Handcraft Workshop Unit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      hardenedHullPlate: {
        // Template: A hardened spaceship hull plate. It will reduce a ship's overall deterioration and allow it to endure significantly higher maximum g-force values.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Hardened Hull Plate
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      hardenedStructuralElements: {
        // Template: General term for metal components for ships and buildings, such as girders and beams.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Hardened Structural Elements
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      heliotropeExtract: {
        // Template: In high-enough concentrations, substances extracted from heliotropes were found to have a sedating effect on the human body as a whole, thereby expanding the range of endurable g-force values.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Heliotrope Extract
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      helium: {
        // Template: A protective gas in welding processes and still the most common solution to make your voice sound funny.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Helium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      helium3: {
        // Template: Most commonly found on surfaces exposed to cosmic rays, helium-3 is a key component of faster-than-light fuel.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Helium-3 Isotope
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      herbs: {
        // Template: Spices are herbs low in nutritional value, but provide some health benefits. As a result, they are not a given in every ship's cafeteria, but some can be found in the med bay.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Spicy Herbs
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      highLoadCargoBay: {
        // Template: Everything you need to build a high-load cargo bay. It can only hold materials relatively small in volume though.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: High-load Cargo Bay Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      highPowerReactor: {
        // Template: A high-power FTL reactor that takes a relatively long time to fully charge up.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: High-power FTL Reactor
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      highVolumeCargoBay: {
        // Template: Everything you need to build a high-volume cargo bay. It can only hold relatively lightweight materials though.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: High-volume Cargo Bay Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      holographicDisplay: {
        // Template: The holographic display creates a three dimensional image of an object that can be seen with the naked eye.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Holographic Display
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      holographicGlasses: {
        // Template: High-tech glasses able to display all kinds of additional information and lifelike visuals.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Holographic Glasses
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      hugeCargoBay: {
        // Template: Used to install the most massive of cargo bays for all your transportation needs.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Huge Cargo Bay Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      hydrocarbonPlants: {
        // Template: Hydrocarbon plants come in many shapes and sizes, but most of them nowadays are algae grown in massive basins for a large variety of purposes.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Hydrocarbon Plants
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      hydrogen: {
        // Template: Number one on the periodic table, hydrogen is a vital ingredient in various chemical compounds including ship fuel.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Hydrogen
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      hyperPowerReactor: {
        // Template: An extremely high-power FTL reactor. Its charge-up speed had to be reduced significantly to guarantee stable results.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Hyper-power Reactor
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      hyperthrustEngine: {
        // Template: This STL engine reaches extremely high thrust powers, but also burns a lot of fuel in the process.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Hyperthrust STL Engine
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      hyperthrustNozzle: {
        // Template: A special nozzle used in high-thrust spacecraft engines.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Hyperthrust Nozzle
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      indigo: {
        // Template: When you absolutely, positively got to color it indigo.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Indigo Colorant
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      informationDataCore: {
        // Template: A whole library in one small data core.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Information Data Core
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      informationManagementSystem: {
        // Template: A system supporting its user in analyzing and interpreting large sets of data.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Information Management System
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      insuFoam: {
        // Template: This construction foam is used to insulate buildings against the cold of planets with non-habitable mean temperatures below -25°C.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: InsuFoam
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      iodine: {
        // Template: This stable halogen is extracted from Caliche rock and used in certain lamps that cannot be replaced by LED technology.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Iodine
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      iron: {
        // Template: One of the most abundant elements on rocky planets, iron is used in a variety of alloys as well as the construction of buildings and metal parts.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Iron
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      ironOre: {
        // Template: Iron ore contains iron, one of the earliest metals to be smelted down by humanity, all the way back in 2000 BC.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Iron Ore
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      ironTitaniumAlloy: {
        // Template: An iron titanium alloy that can be used to influence grain sizes in steel making.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ferro-Titanium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      kevlar: {
        // Template: Often spun into ropes or fabric, these fibers are used as a composite material reinforcing anything from clothing to structural building elements.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Para Aramid
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      krypton: {
        // Template: Originally mostly used for lighting and laser systems, the discovery of the gateway technology revealed that this noble gas proved useful in the stabilization of gateway singularity vortices.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Krypton
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      kryptonium: {
        // Template: A compound of krypton and einsteinium originally created for the purpose of fueling singularity gateways as a newly discovered way of ship travel.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Kryptonium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      laboratoryUnit: {
        // Template: A ready-to-go lab that can be used as part of a larger building complex.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Laboratory Unit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      largeCapacitorBank: {
        // Template: Stores a large amount of energy.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Large Capacitor Bank
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      largeCargoBay: {
        // Template: Everything you need to build a large cargo bay.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Large Cargo Bay Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      largeDeviceCover: {
        // Template: A 3D-printed, plastic-based cover for various large electronic devices.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Durable Casing L
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      largeEmitter: {
        // Template: A large FTL emitter requiring a relatively high amount of power to create an FTL field spanning a large volume.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Large FTL Emitter
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      largeFtlTank: {
        // Template: Everything you need to build a large FTL fuel tank.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Large FTL Fuel Tank Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      largePlasticsBoard: {
        // Template: …
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Polymer Sheet Type L
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      largeShipRepairDroneUnit: {
        // Template: A control unit for a large set of drones able to consistently repair any kind of damage a ship takes during space flight.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Large Ship-Repair Drone Operations Unit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      largeStlTank: {
        // Template: Everything you need to build a large STL fuel tank.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Large STL Fuel Tank Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      laserDiode: {
        // Template: Laser diodes directly convert electrical energy into light.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Laser Diodes
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      lifeSupportSystem: {
        // Template: Life support systems monitor and control the atmosphere and other environmental conditions essential to life.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Life Support System
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      lightweightBulkhead: {
        // Template: Slightly thinner, but considerably lighter wall elements offering little structural stability.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Lightweight Bulkhead
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      lightweightDeckElements: {
        // Template: Thin but long-lived plastic floor elements available in all shapes and sizes.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Lightweight Deck Elements
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      lightweightHullPlate: {
        // Template: A lightweight spaceship hull plate. It will help reduce a ship's mass, but is slightly more prone to deterioration.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Lightweight Hull Plate
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      lightweightStructuralElements: {
        // Template: Various lightweight components used in ship and building construction. Can be upgraded to be more durable, but also heavier.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Lightweight Structural Elements
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      lightweightWindow: {
        // Template: Primarily meant to be used on the inside of structures, these double-layered windows find a great variety of applications both on planets and ships.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Lightweight Transparent Aperture
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      limestone: {
        // Template: This Calcium-rich mineral can be found both in the crust and on the surface of many rocky planets. Its uses include construction and nutrition.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Limestone
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      liquidCrystals: {
        // Template: These crystals are used in the manufacturing of Liquid Crystal Displays, or LCDs for short.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Liquid Crystals
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      liquidEinsteinium: {
        // Template: Einstenium processed into liquid form. Still radioactive. Still glowing.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Liquid Einsteinium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      lithium: {
        // Template: Commonly used for the production of batteries and pharmaceuticals.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Lithium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      lithiumOre: {
        // Template: Lithium ore is required to produce lithium.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Lithium Ore
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      localDatabase: {
        // Template: A local data store.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Local Database
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      logisticsSystem: {
        // Template: A system to help with inventory management, transactions and the likes.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Logistics System
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      lowHeatFuelPump: {
        // Template: An affordable fuel pump. Should not be used as part of high-temperature engines.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Low-heat Fuel Pump
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      machineLearningInterface: {
        // Template: The first step in creating a self-learning artificial intelligence.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Machine Learning Interface
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      magnesite: {
        // Template: A magnesium-rich mineral.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Magnesite
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      magnesium: {
        // Template: One of the most abundant elements in the universe. Magnesium has many applications including as a structural material, in aluminium alloys and for the purification of solvents.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Magnesium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      magneticFloor: {
        // Template: Magnetic ground cover allows you to establish a firm foundation in low gravity environments.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Magnetic Ground Cover
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      magnetite: {
        // Template: A iron oxide and common iron ore. Magnetite is ferromagnetic and can be magnetized.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Magnetite
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      mainFrameBlank: {
        // Template: The 'main frame' held the central processing and main memory of early computers. Today's mainframes are large centralized computing facilities often used for critical applications.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic Mainframe
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      meat: {
        // Template: The days of industrial livestock farming have long gone by, and the term "meat" has since taken on another meaning merely pertaining to a meal's texture and taste.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Meat Tissue Patties
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      medicalStretcher: {
        // Template: The most basic form of a mobile medical bed.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Medical Stretcher
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      mediumCapacitorBank: {
        // Template: Stores a medium amount of energy.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Medium Capacitor Bank
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      mediumCargoBay: {
        // Template: Everything you need to build a medium-sized cargo bay.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Medium Cargo Bay Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      mediumDeviceCover: {
        // Template: A 3D-printed, plastic-based cover for various medium electronic devices.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Durable Casing M
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      mediumEmitter: {
        // Template: A medium-size FTL emitter requiring a moderate amount of power to create an FTL field spanning a mid-sized volume.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Medium FTL Emitter
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      mediumFtlTank: {
        // Template: Everything you need to build a medium-sized FTL fuel tank.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Medium FTL Fuel Tank Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      mediumPlasticsBoard: {
        // Template: …
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Polymer Sheet Type M
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      mediumStlTank: {
        // Template: Everything you need to build a medium-size STL fuel tank.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Medium STL Fuel Tank Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      megaTubeCoating: {
        // Template: What makes a megatube? Carbon nanotubes with diameters so large they are measured in micrometers.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: MegaTube Coating
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      memoryBank: {
        // Template: Provides other electronic components with lightning-fast application memory.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Memory Bank
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      metalHalideLamp: {
        // Template: These lamps have become a staple of hydroponics, allowing certain plants (especially algae) to grow without sunlight.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Metal-Halide Lighting System
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      microHeadphones: {
        // Template: Very tiny speakers. Be careful not to lose them in your ears!
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Micro Headphones
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      microProcessor: {
        // Template: A central processing unit implemented on a single integrated circuit.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Micro-Processor
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      mineralConstructionGranulate: {
        // Template: Melted down, molded and then cooled off, these tiny pellets provide the hardened foundation of all buildings on rocky planets.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Mineral Construction Granulate
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      motherBoard: {
        // Template: The main printed circuit board for a general purpose computer.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Motherboard
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      mushrooms: {
        // Template: The Agaricaceae rubicatii family of fungi is not just known for unusual cultivation methods, but also rapid growth.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Protein-Rich Mushrooms
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      nanoCarbonSheeting: {
        // Template: A substrate is covered with carbon nanotubes then the nanotubes are covered by a layer of aerogel. The aerogel is pulled away taking the nanotubes with it to form a sheeting.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Nano-Carbon Sheeting
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      nanoFiber: {
        // Template: Fibers with diameters in the nanometer size range. In this case silicon fibers with graphene coating.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Nano Fiber
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      nanoGlass: {
        // Template: Glass with coatings of nanomaterials to give it hydrophobic, oleophobic and other properties.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Nano-Coated Glass
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      nanoResin: {
        // Template: A nanoparticle enhanced resin for industrial applications.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Nano-Enhanced Resin
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      navigation1: {
        // Template: A basic navigation module to control ships with simple engines.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Navigation Module MK1
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      navigation2: {
        // Template: An advanced navigation module to control ships with complex engines.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Navigation Module MK2
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      neon: {
        // Template: A colorless odorless noble gas. Neon produces a reddish orange glow when placed in an electric field.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Neon
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      neonLightingSystem: {
        // Template: Neon lights remind us of a world less complicated. They're also fun!
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Neon Lighting System
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      networkingFramework: {
        // Template: Software for building networking applications.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Networking Framework
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      neuralNetwork: {
        // Template: Allows for artificial learning on large sets of data by vaguely simulating how actual brain neurons work.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Neural Network
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      nitrogen: {
        // Template: Traded as a gas or a liquid, Nitrogen forms a great variety of compounds and plays a role in food preservation.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Nitrogen
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      nonVolatileMemory: {
        // Template: Computer memory that can retrieve information after being powered on and off.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Non-Volatile Memory
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      nutrientSolution: {
        // Template: While nutrient solution should not be consumed on its own due to its high concentration, it is used in a great many recipes for both edible and inedible end products.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Nutrient Solution
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      nylon: {
        // Template: A versatile, plastic-based fabric traditionally used in clothing and warfare, which now also plays a role in building construction.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Nylon Fabric
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      officeSupplies: {
        // Template: No one knows exactly what they are, but yet they are constantly consumed for “work”.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Office Supplies
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      olfactorySubstances: {
        // Template: Smells nice in here!
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Olfactory Substances
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      operatingSystem: {
        // Template: Software that provides common services and interfaces to a computer system's hardware resources for other applications.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Operating System
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      oxygen: {
        // Template: From alloy production to our own lungs, oxygen is what keeps humanity going. Warning: Higher concentrations only breathable in low gravity environments.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Oxygen
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      painkillers: {
        // Template: The most popular medical drug in the universe.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Painkillers
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      pesticides: {
        // Template: Although toxic to small organisms, this pesticide is safe for human consumption in moderate doses.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: DDT Plant Agent
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      pineberries: {
        // Template: Looks like a white strawberry, tastes like pineapple, is highly nutritious!
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Pineberries
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      pioneerBundle: {
        // Template: Everything required to supply 100 pioneers for 10 days.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Pioneer Consumable Bundle
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      pioneerClothing: {
        // Template: This full-body suit, usually worn as an extra layer on top of personal clothing, is certainly nothing fancy, but practical and durable.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic Overalls
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      pioneerLuxuryClothing: {
        // Template: This garment may not look like much, but its added plastic pads prevent countless injuries across the universe day after day.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Padded Work Overall
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      pioneerLuxuryDrink: {
        // Template: Some take their psychoactive drugs with soy milk, others prefer them pure.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Caffeinated Infusion
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      polarityFieldGenerator: {
        // Template: Combines the specific functionalities of several reactor types to span large fields of barely stable polarity.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Polarity Field Generator
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      polyEthylene: {
        // Template: The most commonly used plastic for the past few centuries, PE still plays a vital role in packaging, clothing, printed building parts, and electronics.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Poly-Ethylene
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      polymerGranulate: {
        // Template: Whoever thinks they can be anything when they grow up hasn't seen polymer granulate, a supplier of plastic in virtually every industrial branch out there.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Polymer Granulate
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      powerCell: {
        // Template: A high-energy mobile power source.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Power Cell
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      premiumFertilizer: {
        // Template: Surprisingly effective at generating a seemingly natural flora.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Premium Fertilizer
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      pressureShielding: {
        // Template: Shielding to protect crew and cargo from high pressure environments.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Pressure Shielding
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      printedCircuitBoard: {
        // Template: A sheet of non-conductive substrate covered with a layer of conductor which electronic circuits are etched onto.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Printed Circuit Board
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      proteinAlgae: {
        // Template: Humanity needed an efficient source of protein and came up with this strain of algae. What's more, it can even grow in space.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Protein-Rich Algae
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      proteinBeans: {
        // Template: While still inefficient in hydroponics, beans are a staple of planet-side farming and essential provider of protein across the universe.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Protein-Rich Beans
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      proteinPaste: {
        // Template: A goop of ground plants, this paste is an essential ingredient in modern "meat". Not at all enjoyable on its own.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Protein Paste
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      quickChargeReactor: {
        // Template: A moderate-power reactor able to charge up very quickly.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Quick-charge FTL Reactor
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      radiationShielding: {
        // Template: Shielding to protect crew and cargo from radiation environments.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Radiation Shielding
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      radioDevice: {
        // Template: When your regular mobile phone just isn't enough!
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Radio Device
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      radioisotopeGenerator: {
        // Template: Converts the heat from radioactive decay into a medium amount of energy.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Radioisotope Generator
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      rations: {
        // Template: As the most common menu item in the universe, this plant-based and often brick-shaped meal has high nutritional value to make up for the lack of flavor and spices.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic Rations
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      reactorControlSystem: {
        // Template: Monitors a variety of performance factors of an FTL reactor and automatically makes adjustments where necessary.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reactor Control System
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      redGoldConnectors: {
        // Template: High throughput connectors for specialized applications.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: High-Capacity Connectors
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      reinforcedBulkhead: {
        // Template: A wall element offering greater durability due to the addition of titanium and hardened epoxy resin.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reinforced Bulkhead
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      reinforcedDeckElements: {
        // Template: Considerably heavier than the basic and advanced versions, these floor tiles are required in some large spacecraft and planetary structures.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reinforced Deck Elements
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      reinforcedHullPlate: {
        // Template: A reinforced spaceship hull plate. It will slightly reduce a ship's overall deterioration and allow it to endure higher maximum g-force values.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reinforced Hull Plate
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      reinforcedStructuralElements: {
        // Template: Laced with steel and resin, these components are used in buildings and spacecraft with increased requirements on structural integrity.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reinforced Structural Elements
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      reinforcedTranslucentMaterial: {
        // Template: This hybrid of old-fashioned glass and its plastic-based counterpart can be used for windows and screens alike.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reinforced Glass
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      reinforcedWindow: {
        // Template: Much thicker and sturdier due to the mixture of silicon- and plastic-based glass, these windows can be built to larger dimensions while still being able to withstand huge forces.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reinforced Transparent Aperture
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      rescueDrone: {
        // Template: A drone designed to locate and rescue living beings. Yes, it can actually carry a person.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Rescue Drone
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      rhenium: {
        // Template: A rare and heat-resistant metal named after the old-Earth river Rhine.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Rhenium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      rheniumOre: {
        // Template: One of the rarest ores to be found throughout the known universe.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Rhenium Ore
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      safetyUniform: {
        // Template: A carbon-infused overall.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Safety Uniform
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      scientistBundle: {
        // Template: Everything required to supply 100 scientists for 10 days.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Scientist Consumable Bundle
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      scientistClothing: {
        // Template: This coat comes with its own holographic display to assists its wearer throughout complex procedures, and even performs life-sustaining measures if an experiment goes awry.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: AI-Assisted Lab Coat
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      scientistFood: {
        // Template: Even high-quality foods nowadays do not vary much in ingredients, but at least they are presented in different shapes and sizes.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Quality Meat Meal
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      scientistLuxuryDrink: {
        // Template: Ever since ancient Greece, great minds have relied on this liquid to think. In the space-age they even apply artificial intelligence to create this unique flavor.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Smart Zinfandel
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      scientistLuxuryHealth: {
        // Template: Just a little something to perk you up.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: NeuroStimulants
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      scientistTools: {
        // Template: A versatile computer for various purposes, but mostly used in scientific contexts.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Scientific Work Station
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      sealant: {
        // Template: Liquid polymer providing good adherence to many common materials and flexibility when cured. May not be suitable for use on some plastics.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Poly-Sulfite Sealant
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      searchAlgorithm: {
        // Template: An algorithm for searching through data.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Search Algorithm
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      sedativeSubstance: {
        // Template: A substance directly infused into the human body via special high-g seats. It helps endure particularly high g-force levels.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Sedative Substance
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      sensor: {
        // Template: A device that measures physical properties such as a thermistor for temperature measurements or a charge coupled device for measuring light levels.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Sensor
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      sensorArray: {
        // Template: A full suite of active and passive remote sensing systems.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Sensor Array
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      settlerBundle: {
        // Template: Everything required to supply 100 settlers for 10 days.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Settler Consumable Bundle
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      settlerClothing: {
        // Template: Equipping its wearer with superhuman strength, this suit has become a staple of physical work regardless of local gravity.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Exoskeleton Work Suit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      settlerLuxuryDrink: {
        // Template: While Kombucha is not a necessity for survival, it provides a considerable boost to health and morale.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Kombucha
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      settlerLuxuryTools: {
        // Template: Tools that repair things. What's not to understand? Get back to work.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Repair Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      settlerTools: {
        // Template: These whirring, blinking, and noisy companions of modern settlers have come a long way since the first sharpened rock back on Earth.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Power Tools
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      shipRepairDrone: {
        // Template: A drone set up to autonomously perform basic repair and maintenance tasks on all kinds of spaceships.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ship-Repair Drone
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      shockwaveDampeningModule: {
        // Template: Controls a set of stabilizing structures to ensure even large-scale shockwaves will not result in negative impacts.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Shockwave-dampening Module
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      silicon: {
        // Template: A hard and brittle crystalline solid that is often used for its properties as a semiconductor. Most often found in various forms of silicon dioxide (silica) or silicate minerals.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Silicon
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      siliconOre: {
        // Template: On the markets, the term "Silicon Ore" is used as a shorthand for different products yielding silicone when smelted down, such as quartzite or sand.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Silicon Ore
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      silkProcessed: {
        // Template: One of the few remaining fibers with a natural origin, silk nowadays has some niche uses in the clothing industry.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Silken Fabric
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      silkRaw: {
        // Template: The start of a long journey to sophisticated clothing such as AI-assisted lab coats.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Raw Silk Strains
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      singularityStabilizer: {
        // Template: After the first experiments with making use of singularities, scientists quickly discovered the need for specialized stabilization modules. They do not like to talk about how they found out in too much detail though.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Singularity Stabilizer
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      smallCapacitorBank: {
        // Template: Stores a small amount of energy.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Small Capacitor Bank
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      smallCargoBay: {
        // Template: Everything you need to build a small cargo bay.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Small Cargo Bay Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      smallDeviceCover: {
        // Template: A 3D-printed, plastic-based cover for various small electronic devices.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Durable Casing S
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      smallEmitter: {
        // Template: A small FTL emitter requiring relatively little power to create an FTL field spanning a small volume.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Small FTL Emitter
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      smallFtlTank: {
        // Template: Everything you need to build a small FTL fuel tank.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Small FTL Fuel Tank Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      smallPlasticsBoard: {
        // Template: …
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Polymer Sheet Type S
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      smallShipRepairDroneUnit: {
        // Template: A control unit for a small set of drones able to consistently repair any kind of damage a ship takes during space flight.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Small Ship-Repair Drone Operations Unit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      smallStlTank: {
        // Template: Everything you need to build a small STL fuel tank.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Small STL Fuel Tank Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      sodium: {
        // Template: An essential element in human biology and industry.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Sodium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      sodiumBorohydride: {
        // Template: A versatile chemical agent that chemists rely upon to get the job done. Known to be extremely flammable if left unchecked, it’s best to store it in a safe location. Mass production of this compound originated on old Earth and was first achieved by chemists from Gladi Research Group, Lab 0-99.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Sodium Borohydride
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      solarCell: {
        // Template: A single solar cell to turn sunlight into energy.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Solar Cell
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      solarPanel: {
        // Template: High-efficiency solar panels have become the most prevalent means of energy extraction in space and on sunnier planets.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Solar Panel
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      sortingAlgorithm: {
        // Template: An algorithm for sorting data.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Sorting Algorithm
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      spaceTether: {
        // Template: A set of sturdy interwoven cords used to hold large space structures in place.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Space Tether
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      specializedRadiationShielding: {
        // Template: These plates protect a ship from taking damage from typical large-star radiation levels.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Specialized Anti-rad Plate
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      stabilitySupportSystem: {
        // Template: A system that helps pilot safely through extremely high- or low-gravity atmospheres.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Stability Support System
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      standardEngine: {
        // Template: Standard STL engine with decent thrust and manageable fuel consumption.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Standard STL Engine
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      standardReactor: {
        // Template: A standard FTL reactor.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Standard FTL Reactor
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      steel: {
        // Template: An iron-based alloy with high tensile strength, steel is considered too heavy for most uses in space, but remains the ideal solution for many planetary construction components.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Steel
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      stlFuel: {
        // Template: While this liquid still resembles fuel of past centuries in smell and viscosity, today's formula is required in much smaller amounts due to vastly more efficient drives.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: STL Fuel
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      structuralSpacecraftComponent: {
        // Template: Spacecrafts consists of many different parts held together by structural components.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Structural Spacecraft Component
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      sulfur: {
        // Template: Elemental sulfur is bright yellow and solid at room temperature.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Sulfur
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      sulfurCrystals: {
        // Template: Sulfur is typically found in sulfide and sulfate minerals in nature.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Sulfur Crystals
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      surgeryUnit: {
        // Template: A building-ready medical unit to perform surgical procedures in.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Surgery Unit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      surgicalDrone: {
        // Template: A drone designed to support a surgeon at work. Once you get used to the buzzing, it's very helpful!
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Surgical Drone
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      surgicalEquipment: {
        // Template: All kinds of scalpels, clips and swabs.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Surgical Equipment
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      surveillanceDrone: {
        // Template: A drone designed to observe, scan and report. Most people don't like them.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Surveillance Drone
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      tantalite: {
        // Template: Rich in the element tantalum the mineral tantalite is similar to the mineral columbite and the two are commonly referred to as coltan. Tantalum is used in tantalum capacitors and coltan is also an important source of niobium.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Tantalite Rock
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      tantalum: {
        // Template: A rare and high corrosion resistant metal.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Tantalum
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      targetingComputer: {
        // Template: Measure twice, cut once.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Targeting Computer
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      tclAcid: {
        // Template: Terephthaloyl chloride is one of the components necessary in the production of para aramid.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: TCL Acid
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      technetium: {
        // Template: All isotopes of Technetium are radioactive and it is typically found naturally only as a decay product of other elements such as Uranium and Thorium.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Technetium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      technetiumOxide: {
        // Template: A yellow volatile solid.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Technetium Oxide
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      technetiumStabilizers: {
        // Template: The Technetium isotope Technetium-97 can be used as a stabilized form of Technetium is put into a fully ionized state.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Stabilized Technetium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      technicianBundle: {
        // Template: Everything required to supply 100 technicians for 10 days.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Technician Consumable Bundle
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      technicianClothing: {
        // Template: With its near impervious fabric and the air tank installed on its back, this suit allows for work with hazardous materials and in hostile environments.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: HazMat Work Suit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      technicianHealth: {
        // Template: Mostly intended to help with injuries, this kit contains a handheld scanner and self-expanding medical foam alongside the usual first aid equipment.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic Medical Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      technicianLuxuryDrink: {
        // Template: A light beer brewed from water, hop, and malt. Some claim that it can't hold a candle to its terrestrial ancestors.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Stellar Pale Ale
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      technicianLuxuryHealth: {
        // Template: Aging was considered an irreversible process. In the future that no longer rings true.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Stem Cell Treatment
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      technicianTools: {
        // Template: A powerful and essential tool able to run diagnostics and find faults in a great variety of machines.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Multi-Purpose Scanner
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      technoKevlar: {
        // Template: Technetium-enhanced para-aramid fabric for specialized applications.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Enhanced Para Aramid
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      tectosilisite: {
        // Template: Tectosilisite is a very silicon-rich regolith found on planets with a thin or no atmosphere at all. Its rather high He-3 contents make it interesting for fuel production.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Tectosilisite
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      tensionReliefStructure: {
        // Template: Often used as the central element of space infrastructure to ensure it endures the strains of meteorite impacts and pressure changes.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Tension Relief Structure
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      tensorProcessingUnit: {
        // Template: An electronic system specifically designed to quickly process tensors for neural networks and other applications.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Tensor Processing Unit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      testTubes: {
        // Template: A popular piece of laboratory equipment used to hold test samples.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Test Tubes
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      thermalShielding: {
        // Template: These actively cooled, heat-deflecting modules must be distributed along the outer walls of buildings located on planets with an average temperature of more than 75° C.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Thermal Shielding
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      thermoFluid: {
        // Template: This high-performance heat transfer fluid can be used from small scale applications like CPU coolers up to building-sized thermal shields.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: ThermoFluid
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      tinyCargoBay: {
        // Template: Everything you need to build a tiny cargo bay.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Tiny Cargo Bay Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      titanium: {
        // Template: Lightweight, strong, and resistant to corrosion, titanium and its alloys have become a staple (not only) of the aerospace industry.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Titanium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      titaniumOre: {
        // Template: Titanium oxide minerals rutile and ilmenite are the most common minerals in titanium ore bodies.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Titanium Ore
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      torusSegment: {
        // Template: Part of a circular structure made to endure long-term existence in space.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Torus Segment
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      touchDeviceBlank: {
        // Template: Data and computing power right in the palm of your hand.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Handheld Personal Console
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      touchScreen: {
        // Template: An input device typically deployed on top of an electronic display. More commonly known as a touch screen.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Capacitive Display
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      transistor: {
        // Template: A transistor amplifies or switches electrical signals and power. This is an advanced model.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Advanced Transistor
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      translucentMaterial: {
        // Template: This traditional form of glass is rarely used on its own nowadays, but rather combined with new materials to withstand the stress and strain of the space age.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Glass
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      traumaCareUnit: {
        // Template: Had an accident? This is where you'll be taken care of.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Trauma Care Unit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      truss: {
        // Template: A stable relationship between structural components is built on truss.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Truss
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      tungstenAluminiumAlloy: {
        // Template: Able to endure extreme heat, this alloy is typically used for thermal protection purposes for spaceships or high-thrust engines.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Alpha-Stabilized Tungsten
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      tungstenResource: {
        // Template: Tungsten can be recovered from scrap by using microorganisms to absorb it enabling recovery. This process sometimes occurs naturally when microorganisms come in contact with tungsten bearing minerals.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Bacterial Tungsten Solution
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      twoDimensionalDisplay: {
        // Template: An output device that displays data.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Information Display
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      universalToolset: {
        // Template: A collection of high-quality tools to fix everyday appliances or to hone your handcrafting skills.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Universal Toolset
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      universeMap: {
        // Template: A map of the known universe and all its related data.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Spatial Navigation Map
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      verySmallCargoBay: {
        // Template: Everything you need to build a very small cargo bay.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Very Small Cargo Bay Kit
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      vitaEssence: {
        // Template: Healthy, tasty, nutritious.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Vita Essence
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      vortexEngine: {
        // Template: A ship engine incorporating a vortex reactor to enable colony ship travel independently from established FTL connections.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Vortex Engine
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      vortexFuelTank: {
        // Template: A giant tank able to hold enough vortex fuel on a colony ships to journey to a nearby sector and back.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Vortex Fuel Tank
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      vortexReactor: {
        // Template: A special reactor for colony ships making use of certain aspects of gateway travel technology.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Vortex Reactor
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      vortexStimulationFuel: {
        // Template: The addition of einsteinium proved to be the final puzzle piece in finding a way of taming the singularity vortex which was once believed to be uncontrollable.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Vortex Fuel
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      waferMedium: {
        // Template: A medium sized disk of crystalline silicon used in the fabrication of electronics.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Medium Wafer
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      waferSmall: {
        // Template: A small sized disk of crystalline silicon used in the fabrication of electronics.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Small Wafer
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      water: {
        // Template: It should be no surprise that the liquid making up 60 % of our bodies is used in almost all processes concerning the production of nourishment across the universe.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Water
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      waterFilter: {
        // Template: Water filtration equipment that actively monitors water conditions and applied remediation as needed.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Active Water Filter
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      waterRecycler: {
        // Template: Equipment for the reclaiming usable clean water from biological wastes and industrial effluents.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Water Reclaimer
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      weakArtificalIntelligence: {
        // Template: AI optimized for a specific task or application. Definitely not a general purpose AI that will learn at an alarming rate, become self aware and create problems for humanity.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Weak Artificial Intelligence
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      windowManager: {
        // Template: …
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Window Manager
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      wolfram: {
        // Template: A rare metal with the highest melting point of all the known elements. Also known as Wolfram.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Tungsten
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      wolfrhenium: {
        // Template: Turns out combining two metals with extremely high melting points results in a useful alloy, especially when it comes to building resilient space infrastructure.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Wolfrhenium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      workstationBlank: {
        // Template: A basic computer workstation.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Basic Workstation
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      zircon: {
        // Template: The mineral Zircon can be processed into metallic zirconium.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Zircon Crystals
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      zirconium: {
        // Template: Zirconium has many applications including in nuclear reactors as cladding for fuel rods and as corrosion resistant material in chemical processing equipment.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Zirconium
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    MaterialAssignment: {
      action: {
        // Template: assign
        assign: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Inventory
        storage: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Assignment
        assignment: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Inventory
        inventory: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    MaterialCategory: {
      // Template: Agricultural Products
      agriculturalproducts: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Alloys
      alloys: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Chemicals
      chemicals: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Construction Materials
      constructionmaterials: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Construction Parts
      constructionparts: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Construction Prefabs
      constructionprefabs: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Consumable Bundles
      consumablebundles: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Consumables (basic)
      consumables_basic_: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Consumables (luxury)
      consumables_luxury_: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Drones
      drones: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Electronic Devices
      electronicdevices: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Electronic Parts
      electronicparts: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Electronic Pieces
      electronicpieces: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Electronic Systems
      electronicsystems: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Elements
      elements: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Energy Systems
      energysystems: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Fuels
      fuels: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Gases
      gases: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Infrastructure
      infrastructure: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Liquids
      liquids: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Medical Equipment
      medicalequipment: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Metals
      metals: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Minerals
      minerals: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ores
      ores: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Plastics
      plastics: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship Engines
      shipengines: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship Kits
      shipkits: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship Parts
      shipparts: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship Shields
      shipshields: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Software Components
      softwarecomponents: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Software Systems
      softwaresystems: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Software Tools
      softwaretools: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Textiles
      textiles: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Unit Prefabs
      unitprefabs: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Utility
      utility: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    MaterialInformation: {
      // Template: Area cost
      areaCost: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Building material
      buildingMaterial: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Category
      category: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: CoGC upkeep
      cogcUsage: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Infrastructure upkeep
      infrastructureUsage: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      label: {
        // Template: Volume
        volume: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Weight
        weight: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Other usage
      otherUsage: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Production
      production: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Natural resource
      resource: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: no
        no: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: yes
        yes: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Ticker
      ticker: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {volume}m³
      volume: ((options: { volume: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {weight}t
      weight: ((options: { weight: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Workforce upkeep
      workforceUsage: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Wrought product
      wroughtProduct: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    MaterialPanel: {
      context: {
        // Template: CX Material Info
        comexMaterialInfo: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No material found.
        material: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Material
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Material: {name}
      titleWithName: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    MaterialSelector: {
      input: {
        // Template: commodity name
        placeholder: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    MaterialTransfer: {
      error: {
        // Template: No storages found.
        noStoragesFound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      header: {
        // Template: Transfer Details
        details: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Transfer Result
        result: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Amount
        amountSlider: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Material
        material: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Source Storage
        storageFrom: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Target Storage
        storageTo: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Transfer
        transferResult: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Material Transfer
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: transfer
      transferButton: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      transferResult: {
        // Template: {amount} {materialName} from {storeFrom} to {storeTo}
        description: ((options: {
          amount: string;
          materialName: string;
          storeFrom: string;
          storeTo: string;
        }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Invalid transfer.
        transferInvalid: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    MenuHeadItem: {
      action: {
        // Template: logout
        logout: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      section: {
        // Template: Settings
        settings: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Message: {
      action: {
        // Template: delete
        _delete: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    MissionPlan: {
      // Template: Consumption
      consumption: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Fees
      costs: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Damage
      damage: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Ship damage depends on several factors such as environment conditions, radiation or meteoroid density along the route. Damage can be reduced by applying certain hull plates or shields in a ship's blueprint. Consider repairing your ships (via SHP) at some point or they will slow down significantly.
        info: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Destination
      destination: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Distance
      distance: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Duration
      duration: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: #
      index: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Type
      type: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    MissionSegmentType: {
      // Template: APP
      approach: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Approach: Ship closes in on a planet or station before landing on it.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: CHRG
      charge: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Charge: FTL engine is charged up. Charge time and power depends on the used engine.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: DCAY
      decay: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Decay: Ship waits for the gateway polarity field to decay sufficiently to continue its flight.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: DEP
      departure: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Departure: Ship moves away from planet or station to be able to perform a safe FTL jump.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: FLT
      float: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Float: Colony ships move between sectors independently from FTL lanes (even if none exist). This step takes a fixed amount of time and fuel.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: JMP
      jump: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Jump: Ship jumps between two stars along an FTL lane.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: GTW
      jumpgateway: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Gateway: Ship jumps through a gateway and exits at the connected counterpart.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: LND
      landing: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Landing: Ship lands on a planetary surface or station.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: LOCK
      lock: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Lock: Ship waits for the gateway polarity field to establish to then align with it.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: TO
      takeoff: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Takeoff: Ship starts flight from a planetary surface or station.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: TRA
      transit: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Transit: Ship performs a transit within the same system.
        tooltip: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    MobileMainState: {
      // Template: Could not find the selected resource
      notfound: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    MobileMaterialTransferModal: {
      action: {
        // Template: transfer selected amount
        transfer: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: units
      units: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    MobileMaterialTransferModel: {
      // Template: Material Transfer
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    MobileStoreTransferOverlay: {
      // Template: Target Stores
      targetStores: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    MobileTransferStoreAndItemSelectionModal: {
      button: {
        // Template: Continue
        _continue: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      form: {
        // Template: Material
        material: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Target store
        target: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      heading: {
        // Template: Material Transfer
        materialTransfer: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Model: {
      action: {
        // Template: {icon} Dismiss
        dismiss: ((options: { icon: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Modifier: {
      // Template: Hold: {weight}t / {volume}m³
      cargoBay: ((options: { weight: string; volume: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {sign}{factor}% damage reduction
      damageReduction: ((options: { sign: string; factor: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Capacity: {units} units
      ftlFuelTank: ((options: { units: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {power}GW, charge factor {charge}
      ftlReactor: ((options: { power: string; charge: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: +{delta} max g-factor
      maxGFactorIncrease: ((options: { delta: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: not protected
      notprotected: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: protected
      _protected: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {units} fuel units / second
      stlEngine: ((options: { units: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Capacity: {units} units
      stlFuelTank: ((options: { units: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Capacity: {units} units
      vortexFuelTank: ((options: { units: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Money: {
      // Template: {amount} {currency}
      amount: ((options: { amount: string; currency: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: -- {forcedCurrencyCode}
      missingAmount: ((options: { forcedCurrencyCode: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Motion: {
      Commands: {
        command: {
          // Template: ABSTAIN
          abstain: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: NO
          no: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: YES
          yes: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      VoteSection: {
        table: {
          // Template: Cmds
          commands: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Role
          role: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Status
          status: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Voter
          voter: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      VoteStatus: {
        // Template: ABSTAIN
        abstain: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: NO
        no: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: WAITING
        none: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: YES
        yes: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      action: {
        // Template: Add Component
        addComponent: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Delete Motion
        deleteMotion: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: save
        save: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Start Voting
        startVoting: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      form: {
        // Template: Created
        created: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Creator
        creator: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Id
        naturalId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      header: {
        // Template: Components
        components: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Details
        details: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Votes
        votes: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: This motion has not entered the voting phase yet.
        noVotesYet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Voting end
        votingend: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Voting start
        votingstart: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    MotionComponent: {
      action: {
        // Template: cancel
        cancel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: save
        save: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    MotionComponentName: {
      type: {
        // Template: Contribution
        CONTRIBUTION: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Local Market fees
        FEE_LOCAL_MARKET: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Production fees
        FEE_PRODUCTION: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Base establishment fees
        FEE_SITE_ESTABLISHMENT: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Warehouse fees
        FEE_WAREHOUSE: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Fuel gateway
        GATEWAY_FUEL: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Link gateway
        GATEWAY_LINK: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Gateway pricing
        GATEWAY_PRICING: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Unlink gateway
        GATEWAY_UNLINK: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Infrastructure construction
        INFRASTRUCTURE_CONSTRUCTION: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Infrastructure name
        INFRASTRUCTURE_NAME: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Infrastructure upgrade
        INFRASTRUCTURE_UPGRADE: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Infrastructure upkeep
        INFRASTRUCTURE_UPKEEP: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Payout
        PAYOUT: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Infrastructure levels
        POPULATION_INFRASTRUCTURE_LEVEL: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Workforce program
        WORKFORCE_PROGRAM: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    MotionComponentsTable: {
      action: {
        // Template: delete
        _delete: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: edit
        edit: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Commands
        Cmds: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Description
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    MotionContainer: {
      error: {
        // Template: Could not find a motion for input '{motionId}'
        noMotion: ((options: { motionId: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    MotionPanel: {
      error: {
        // Template: No government found for input {input}.
        id: ((options: { input: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      title: {
        // Template: Motion: {motionId}
        loading: ((options: { motionId: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    MotionStatus: {
      // Template: DRAFT
      draft: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: FAILED
      failed: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: PASSED
      passed: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: VOTING
      voting: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Motions: {
      action: {
        // Template: Create motion
        _new: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Status
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Created
        created: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Creator
        creator: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Motion
        id: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    MotionsPanel: {
      action: {
        // Template: Delete
        deleteComponent: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Are you sure you want to delete this component?
          confirmation: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Delete
        deleteMotion: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Are you sure you want to delete this motion?
          confirmation: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Motions
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Motion
        motion: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    MutedChatMessage: {
      // Template: Blocked message
      text: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    MutedUsers: {
      actions: {
        // Template: Unmute User
        unmute: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Cmds
        commands: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Muted since
        time: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Username
        user: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    MutedUsersPanel: {
      context: {
        // Template: Communications
        communications: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    NamePlanetPanel: {
      action: {
        // Template: Are you sure you want to name this planet '{name}'? You cannot undo this!
        confirmation: ((options: { name: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name Planet
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Note that offensive names or names going against the general mood and setting of the game world are not permitted.
        notes: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: Planet not found.
        naturalId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Planet has been named.
      success: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Name Planet: {naturalId}
      title: ((options: { naturalId: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Name Planet: loading…
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name Planet: not found…
        notFound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    NameSystemPanel: {
      action: {
        // Template: Are you sure you want to name this system '{name}'? You cannot undo this!
        confirmation: ((options: { name: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name System
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Note that offensive names or names going against the general mood and setting of the game world are not permitted.
        notes: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: System not found.
        naturalId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: System has been named.
      success: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Name System: {naturalId}
      title: ((options: { naturalId: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Name System: loading…
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name System: not found…
        notFound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    NamingForm: {
      label: {
        // Template: Note
        note: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Name
      name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Catalog ID
      naturalId: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Please note that the selected name has to be a fit for the universe and lore. We will change names that don't fit.
      note: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Assign name…
      submit: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: n/a
        disabled: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    NavigationConstants: {
      // Template: calculating
      calculating: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: equal origin and destination
      equalOriginDestination: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: FTL reactor required
      ftlReactorRequired: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: invalid
      invalid: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: not enough FTL fuel ({ftlFuelNecessary} units necessary)
      missingFtlFuel: ((options: { ftlFuelNecessary: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: not enough STL fuel ({stlFuelNecessary} units necessary)
      missingStlFuel: ((options: { stlFuelNecessary: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: no path to destination
      noPath: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: navigation subsystem not ready
      notReady: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: valid
      ok: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: out of FTL range
      outOfFtlRange: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: out of STL range
      outOfStlRange: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    NeedFulfillment: {
      // Template: {type} - {fulfillment}%
      content: ((options: { type: string; fulfillment: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    NeedTypeLabel: {
      // Template: Comfort
      COMFORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Culture
      CULTURE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Education
      EDUCATION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Health
      HEALTH: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Life support
      LIFE_SUPPORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Safety
      SAFETY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    NoData: {
      // Template: --
      label: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    NoTestServerAccess: {
      // Template: Account Management
      accountManagement: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: This APEX console is only accessible to Licensees with the Test Server Access perk!
      text1: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: To gain access, please head over to {link} and purchase any of the available supporter tiers.
      text2: ((options: { link: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Thank you very much for your understanding.
      text3: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Test Server Access required
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    NonActiveContextNotifications: {
      action: {
        // Template: switch to context
        _switch: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Command
        command: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Context
        context: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: #unread
        unread: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: #unseen
        unseen: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    NotificationConfigPanel: {
      enabled: {
        // Template: default
        _default: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: disabled
        disabled: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: enabled
        enabled: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      frequency: {
        // Template: 12h
        _12: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: 15m
        _15m: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: 1h
        _1h: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: 1m
        _1m: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: 24h
        _24h: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: 4h
        _4h: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: 8h
        _8h: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: default
        _default: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Email Notifications
        enabled: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Max. Frequency
        frequency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Alert
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Default Settings
          _default: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Push Notification Settings
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Notifications: {
      context: {
        // Template: Push Notification Settings
        config: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: In-game Notification Settings
        inGameConfig: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Notifications
        notifications: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    NotificationsPanel: {
      link: {
        // Template: mark all as read
        markAllAsRead: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: mark all as seen
        markAllAsSeen: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      section: {
        // Template: Notifications in other contexts
        otherContexts: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Notifications
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    OfficeList: {
      action: {
        // Template: ADM
        adm: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: GOV
        gov: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Location
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: End
        end: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Role
        role: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    OfficeType: {
      // Template: Governor
      GOVERNOR: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Member of Parliament
      MEMBER_OF_PARLIAMENT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Offices: {
      header: {
        // Template: Current offices
        current: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Past offices
        past: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Current runs
        runs: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Location
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Election ends
        end: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    OfficesPanel: {
      context: {
        // Template: User information
        user: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No user for input '{input}'.
        id: ((options: { input: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Offices {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Offices
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    OrderSlot: {
      // Template: {amount} {amount, plural, one {unit} other {units}}
      output: ((options: { amount: number }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    OrderStatus: {
      // Template: no capacity
      capacity: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: funds missing
      funds: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: halted
      halted: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: input missing
      input: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {completed, number, style: 'percent'} done
      progress: ((options: { completed: string | number }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: recurring
      recurring: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    OrderStatusLabel: {
      // Template: created
      CREATED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: deleted
      DELETED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: filled
      FILLED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: partially filled
      PARTIALLY_FILLED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: placed
      PLACED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    OrderTypeLabel: {
      // Template: BUY
      BUYING: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: SELL
      SELLING: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Overlay: {
      // Template: get PRO
      action: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Designing and building additional ships
      feature1: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Posting and accepting local market ads
      feature2: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Recurring, sortable production orders
      feature3: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Custom contracts with other players
      feature4: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A handy building repair assistant
      feature5: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A PRO license is available from $8 a month and is automatically converted to a BASIC license once it runs out, retaining the ability for you to accept other players' local market ads and contract offers.
      footer: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Thank you for playing Prosperous Universe!{linebreak}We hope you're enjoying your time in APEX!
      heading1: ((options: { linebreak: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: DID YOU KNOW?{linebreak}With a PRO license you have access to many more advanced features of APEX, such as:
      heading2: ((options: { linebreak: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    PanelSelector: {
      input: {
        // Template: Enter content command
        placeholder: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ParliamentRole: {
      role: {
        // Template: Governor
        governor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Member of Parliament
        memberOfParliament: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PaymentConditionEditForm: {
      form: {
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PayoutComponent: {
      action: {
        // Template: cancel
        cancel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: save
        save: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Recipient
        recipient: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PendingContractsTable: {
      action: {
        // Template: view
        view: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PendingInvitesContainer: {
      action: {
        // Template: accept
        accept: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: reject
        reject: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Capital Contribution
        contribution: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Corporation
        corporation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: No pending invitations at the moment.
        empty: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Received
        received: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Shares
        shares: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Performance: {
      label: {
        // Template: Acceleration (max)
        accelerationMax: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Cargo capacity
        cargoCapacity: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: FTL speed (max)
        ftlSpeedMax: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: G-factor (max)
        maxGFactor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Operating empty mass
        operatingEmptyMass: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Volume
        volume: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      value: {
        // Template: {value}m/s²
        accelerationMax: ((options: { value: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {weight}t / {volume}m³
        cargoCapacity: ((options: { weight: string; volume: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {value}parsec/h
        ftlSpeedMax: ((options: { value: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {value}t
        operatingEmptyMass: ((options: { value: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {value}m³
        volume: ((options: { value: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PickupConditionEditorForm: {
      form: {
        // Template: Address
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Material
        material: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PlanetInfoMapContainer: {
      // Template: Hint: Right click and drag to rotate
      help: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      ownSite: {
        // Template: Start Base
        start: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: View base
        view: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PlanetInfoPanel: {
      context: {
        // Template: Fleet
        fleet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Inventory
        inventory: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Local Rules
        localrules: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Population report
        populationreport: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planetary Projects
        projects: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: System Information
        systemInformation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: System Map
        systemMap: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No planet found.
        planetId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        data: {
          // Template: Environment
          environment: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Soil fertility
          fertility: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Infrastructure
          infrastructure: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Available plots
          plots: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Planetary projects
          projects: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Radius
          radius: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Resources
          resources: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Type
          type: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Faction affinity
        faction: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Government
        government: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Government of {planet}
          content: ((options: { planet: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Named by
        naming: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Catalog ID
        naturalId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planet
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Workforce population
        population: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Planet Info: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Planet Search
        list: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planet Info: loading…
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planet Info: not found…
        notfound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PlanetInformation: {
      // Template: plots available
      ghostPlots: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      info: {
        // Template: Fertility affects how efficient farms are at the production of agricultural commodities. Infertile planets cannot produce any agricultural products without advanced buildings.
        fertility: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Some planets already have a certain infrastructure set up to improve production facilities. The Chamber of Global Commerce for example is run collaboratively by the inhabitants on a planet and can speed up production significantly.
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planets are divided into areas called plots and each plot can hold a base. The amount of plots gives you an indication of how much competition from other entrepreneurs there is on this planet but also how many potential customers reside here.
        plots: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: A list of the natural resources of this planet. Everything else has to be bought on the commodity exchanges.
        resources: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        faction: {
          // Template: States to which faction's sphere of influence the planet belongs. Planets in faction space have to follow stricter rules than non-faction planets, for example fees will always be levied in the faction's currency.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Soil fertility
        fertility: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Fertility affects how efficient farms are at the production of agricultural commodities. Infertile planets cannot produce any agricultural products without advanced buildings.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        government: {
          // Template: Links to the current government of the planet.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Infrastructure
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        naming: {
          // Template: Certain tiers of APEX PRO licenses include the right to name a planet.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Available plots
        plots: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Resources
        resources: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The natural resources available on this planet. The bars indicate how efficiently a resource can be extracted.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The environmental conditions determine whether a planet is habitable or not. Extreme conditions require special building materials.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        workforce: {
          // Template: The cumulative workforce population.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: {namer} {time}
      named: ((options: { namer: string; time: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      naming: {
        // Template: Name this planet
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: --
      noData: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {free} / {plots}
      plots: ((options: { free: string; plots: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      type: {
        // Template: Planet
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Station
        station: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: -- {button}
      unnamed: ((options: { button: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    PlanetType: {
      // Template: Gaseous
      noSurface: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Rocky
      surface: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    PlanetaryProjectEntry: {
      // Template: contribute
      contribute: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: details
      details: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    PlanetaryProjectPanel: {
      button: {
        // Template: contribute
        contribution: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        open: {
          // Template: Planetary Administration Center
          adm: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Chamber of Global Commerce
          cogc: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Local Market
          locm: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Infrastructure
          pop: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Shipyard
          shy: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Warehouse
          war: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      contribute: {
        // Template: You need a base on the planet to be able to contribute.
        error: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: The Chamber of Global Commerce has not been finished yet. You can contribute towards its completion by contributing building materials.
      contribution: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      error: {
        // Template: No project found.
        planetId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Bill of material
        billOfMaterial: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Constructed
        constructionDate: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Project
        project: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Project:
      project: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      section: {
        // Template: Contribute
        contribute: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Contributions
        contributions: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      status: {
        // Template: in construction
        inConstruction: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: operational
        operational: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Planetary project @ {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Planetary project: loading…
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planetary project: not found…
        notFound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PlanetaryProjects: {
      // Template: Planetary Administration Center
      ADM: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: The Administration Center allows to hold elections for a planetary government. The government can set taxes and fees like a production fee for example. Every one can run for office, but only site owners can vote for a candidate.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: ADM
        ticker: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Chamber of Global Commerce
      COGC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Orchestrates the planet-wide execution of industrial support and advertisement programs.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: CoGC
        ticker: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Commodity Exchange
      CX: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: A public, escrow based trading platform for all kinds of commodities.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: CX
        ticker: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Local Market
      LOCM: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: A simple, unregulated, bulletin board style market place.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: LOCM
        ticker: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Population Infrastructure
      POP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: This planetary project is a collection of all infrastructure projects that are relevant for the local population.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: POP
        ticker: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Shipyard
      SHY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: A public shipyard to build ships of any type or size.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: SHY
        ticker: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Warehouse
      WAR: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: An extendable warehouse facility where companies can rent storage units.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: WAR
        ticker: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PlanetaryProjectsPanel: {
      context: {
        // Template: Planet
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planetary Projects
        projects: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No projects found.
        planetId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Planetary projects @ {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Planetary projects: loading…
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planetary projects: not found…
        notFound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PlotSelectionMapContainer: {
      // Template: Select a plot on the surface or use a {random}!
      action: ((options: { random: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      button: {
        // Template: random plot
        random: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Change selection
        select: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Population: {
      report: {
        action: {
          // Template: next
          next: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: prev
          prev: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Change
        change: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Comfort
        comfort: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Culture
        culture: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Report #{period} / {time}
        current: ((options: { period: string; time: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Education
        education: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Education (in/out)
        educationInOut: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Engineers
        engineers: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Happiness
        happiness: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Health
        health: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Life support
        lifeSupport: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template:
        metric: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Migration
        migration: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Population
        nextPopulation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Open jobs
        openJobs: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Pioneers
        pioneers: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Safety
        safety: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Scientists
        scientists: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Settlers
        settler: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {in} / {sign}{out}
        shift: ((options: { in: string; sign: string; out: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Technicians
        technicians: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Unemployment
        unemployment: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      section: {
        // Template: Government program
        governmentProgram: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Need fulfillment
        needFulfillment: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PopulationChartContainer: {
      error: {
        // Template: Graph unavailable
        noData: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PopulationInfrastructure: {
      buttons: {
        // Template: details
        details: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      projects: {
        // Template: Built
        built: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Cmds
        cmds: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Current
        current: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The level currently in use per infrastructure can be controlled by the government to be lower than the maximum level built, for example to save on upkeep resources.
          description: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upgrade
        progress: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upkeep
        upkeep: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PopulationInfrastructureComponent: {
      label: {
        // Template: Infrastructure levels
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      setting: {
        // Template: max
        max: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Current
        active: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Infrastructure
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Target
        target: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PopulationInfrastructureContainer: {
      error: {
        // Template: No population infrastructure found.
        noreport: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PopulationInfrastructurePanel: {
      context: {
        // Template: Local Rules
        localRules: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planet
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Population report
        report: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No planet found.
        planetId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Population Infrastructure @ {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: PopulationReport: loading…
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: PopulationReport: not found…
        notfound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PopulationInfrastructureProject: {
      form: {
        // Template: Built
        built: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Current
        current: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Description
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: The maximum level for this infrastructure project has been reached.
        maxupgrade: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upgrade costs
        upgradeCosts: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upgrade status
        upgradeStatus: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      section: {
        // Template: Recent contributions by contributor
        contributions: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upgrade
        upgrade: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upkeep
        upkeep: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PopulationInfrastructureProjectContainer: {
      error: {
        // Template: Population infrastructure project not found.
        noproject: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PopulationInfrastructureProjectPanel: {
      action: {
        // Template: contribute
        contribute: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Do you really want to invest commodities into planet infrastructure? This is typically handled by the planet's government or companies it partnered with.
          confirmation: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      context: {
        // Template: Planet
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Population infrastructure
        populationinfrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Population report
        report: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No planet found.
        planetId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Infrastructure {type} @ {name}
      title: ((options: { type: string; name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: PopulationReport: loading…
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: PopulationReport: not found…
        notfound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PopulationNeedsTable: {
      // Template: Need fulfillment
      NEED_FULFILLMENT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The percentage of the fulfillment of basic population needs.
      NEED_FULFILLMENT_DESCRIPTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    PopulationReportContainer: {
      error: {
        // Template: No population reports found.
        noreport: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PopulationReportInfo: {
      // Template: The change in workforce compared to the last week (positive: growth, negative: decline).
      CHANGE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The number of workers that transitioned from a lower tier into the current tier and the ones that transitioned to a higher (can be increased via educational infrastructure).
      EDUCATION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Newly found populations benefit for several weeks from the 'Explorer's Grace' effect and are happier in general.
      EXPLORERS_GRACE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The current total happiness of each workforce tier. Happiness is increased by providing need-fulfilling infrastructure and open jobs. The population grows when happiness is over 70% and declines if below 50%
      HAPPINESS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The number of workers that migrated to the planet or left it (due to their tiers happiness).
      MIGRATION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The percentage of the fulfillment of basic population needs.
      NEED_FULFILLMENT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The amount of available jobs not filled by the current population.
      OPEN_JOBS: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The amount of workers of each workforce tier currently inhabiting the planet.
      POPULATION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The rate of workers of each workforce tier that had no job.
      UNEMPLOYMENT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    PopulationReportPanel: {
      context: {
        // Template: Planet
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Population infrastructure
        populationInfrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No planet found.
        planetId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Population Report @ {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Population Report: loading…
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Population Report: not found…
        notfound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PrivateChannelMembershipPanel: {
      // Template: Conversation {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Production: {
      context: {
        // Template: Base
        base: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Create Order
        createOrder: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: All Production Lines
        overview: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Queue
        queue: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Local Production Lines
        site: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    // Template: {category} / {workforce}
    ProductionFeeForm: ((options: { category: string; workforce: string }) => string) & {
      getFormat: () => IntlMessageFormat;
      action: {
        // Template: edit
        edit: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ProductionFeeTable: {
      cell: {
        // Template: {value} ({sign}{change})
        valueWithChange: ((options: { value: string; sign: string; change: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ProductionLine: {
      efficiencyFactors: {
        // Template: {name} Experts
        experts: ((options: { name: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        templates: {
          // Template: This production line is unable to produce anything at this location.
          empty: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      form: {
        // Template: Duration
        duration: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        efficiency: {
          // Template: Efficiency Factors
          factors: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Overall Efficiency
          total: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Order Size
        factor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Location
        location: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Note
        note: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Product filter
        product: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Production Line
        productionLine: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Production Fee
        productionfee: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Production template
        recipe: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Recurring
        recurring: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Since this is your first production order, the duration will be reduced to {reducedDuration}. Normally this order would take {duration} to complete. Use the time until your first production order finishes to look around and familiarize yourself with APEX.
        reducedDuration: ((options: { reducedDuration: string; duration: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Queue Order
        submit: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Recurring order
        recurring: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: A recurring order gets re-queued as soon as it starts. Requires a PRO license.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: {fee} {linebreak} collected by {collector}
      productionfee: ((options: {
        fee: string;
        linebreak: string;
        collector: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ProductionLinePanel: {
      error: {
        // Template: Production line not found.
        productionLineId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {line} @ {address}
      title: ((options: { line: string; address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Production Line
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ProductionLines: {
      // Template: You have no production facilities at the moment.
      empty: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      link: {
        // Template: Order
        order: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Queue
        queue: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {active} / {total}
      slots: ((options: { active: string; total: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      table: {
        header: {
          // Template: Efficiency
          efficiency: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Planet
          planet: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Slots
          slots: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    ProductionPanel: {
      error: {
        // Template: Production location not found.
        siteId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {name} Production Lines
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Production
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Production
        sites: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ProductionQueue: {
      // Template: New Order
      createOrder: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      figures: {
        // Template: Active Orders
        capacity: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: {active} / {capacity}
          amount: ((options: { active: string; capacity: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Current Efficiency
        efficiency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Production Line Condition
        productionLineCondition: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Queued Orders
        slots: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: {queued} / {slots}
          amount: ((options: { queued: string; slots: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: {available} / {amount}
      materialAvailability: ((options: { available: string; amount: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {amount} {name}
      materialquantity: ((options: { amount: string; name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      orders: {
        // Template: Active
        active: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Queued
        queued: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: cancel
        cancel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Completion / Duration
        completion: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Fee
        fee: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Input
        input: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: ▼
        moveDown: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: ▲
        moveUp: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Output
        output: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ProductionQueuePanel: {
      action: {
        // Template: Cancel order
        cancel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Cancelling a running production order cannot be undone. Only the following materials and fees will be reclaimed/produced:
        confirmation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reimbursed production fees:
        fees: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reimbursed input materials:
        inputmaterials: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Produced materials:
        outputmaterials: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Production order cancelled.
      cancelled: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      error: {
        // Template: Production line not found.
        productionLineId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {line} Queue @ {location}
      title: ((options: { line: string; location: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Production Queue
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Program: {
      // Template: Advanced Education I
      EDUCATION_1: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Multiply the rate of workers who level up a tier by 150% for one week via concentrated educational efforts.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Advanced Education II
      EDUCATION_2: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Multiply the rate of workers who level up a tier by 175% for one week via concentrated educational efforts.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Advanced Education III
      EDUCATION_3: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Multiply the rate of workers who level up a tier by 200% for one week via concentrated educational efforts.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Family Support I
      FAMILY_SUPPORT_1: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Increase the natural growth of Pioneers, Settlers and Technicians by 10% for one week by offering benefits for families.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Family Support II
      FAMILY_SUPPORT_2: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Increase the natural growth of Pioneers, Settlers and Technicians by 15% for one week by offering benefits for families.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Family Support III
      FAMILY_SUPPORT_3: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Increase the natural growth of Pioneers, Settlers and Technicians by 25% for one week by offering benefits for families.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Planetary Festivities I
      FESTIVITIES_1: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Increase the happiness of all workers by 5% for one week by hosting a variety of amusement festivities.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Planetary Festivities II
      FESTIVITIES_2: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Increase the happiness of all workers by 10% for one week by hosting a variety of amusement festivities.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Planetary Festivities III
      FESTIVITIES_3: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Increase the happiness of all workers by 20% for one week by hosting a variety of amusement festivities.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Engineer Immigration
      IMMIGRATION_ENGINEER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Attract 50 new engineers to the planet via targeted immigration support efforts.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Pioneer Immigration
      IMMIGRATION_PIONEER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Attract 500 new pioneers to the planet via targeted immigration support efforts.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Scientist Immigration
      IMMIGRATION_SCIENTIST: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Attract 25 new scientists to the planet via targeted immigration support efforts.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Settler Immigration
      IMMIGRATION_SETTLER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Attract 200 new settlers to the planet via targeted immigration support efforts.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Technician Immigration
      IMMIGRATION_TECHNICIAN: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Attract 100 new technicians to the planet via targeted immigration support efforts.
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ProgressBar: {
      // Template: {value} / {maximum}
      value: ((options: { value: string; maximum: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ProjectStatus: {
      // Template: built
      BUILT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: created
      CREATED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: started
      STARTED: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Prompt: {
      placeholder: {
        // Template: You have been banned from this channel. The ban ends at {date} {time}.
        banned: ((options: { date: string; time: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Enter a message…
        _default: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: You have been muted!
        muted: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ProvisionCondition: {
      // Template: Provisioning of {amount, number} {amount, plural, one {unit} other {units}} of {material} @ {address}
      content: ((options: { amount: number; material: string; address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ProvisionConditionEditForm: {
      form: {
        // Template: Address
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Material
        material: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    PublicChannelMembershipPanel: {
      title: {
        // Template: Public Channel {identifier}
        _default: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    // Template: APEX Representation Center
    REPRESENTATION_CENTER: ((options: void) => string) & {
      getFormat: () => IntlMessageFormat;
    };
    RangeSelector: {
      label: {
        // Template: 180 days
        days_180: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: 30 days
        days_30: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: 7 days
        days_7: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: 90 days
        days_90: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    RatingInfo: {
      // Template: Based on {count} contracts over the last {days}.
      details: ((options: { count: string; days: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ReachableSystems: {
      table: {
        // Template: Cmds
        commands: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Distance
        distance: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: System
        system: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Reactor: {
      // Template: Produces advanced appliances, often used in space ships and space stations.
      advancedAppliancesFactory_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Advanced Appliances Factory
      advancedAppliancesFactory_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Refines intermediate rare materials into more usable forms.
      advancedMaterialLab_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Advanced Material Lab
      advancedMaterialLab_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Allows for the creation of high-performance metal alloys.
      advancedSmelter_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: High-Power Blast Furnace
      advancedSmelter_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Produces large appliances, often used in space ships and space stations.
      appliancesFactory_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Appliances Factory
      appliancesFactory_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Produces a host of materials and end products needed to bootstrap a colony.
      basicMaterialsPlant_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Basic Materials Plant
      basicMaterialsPlant_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Produces various chemical compounds and immediate products.
      chemPlant_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Chemical Plant
      chemPlant_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Produces integrated circuits and basic computer parts.
      cleanRoom_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Cleanroom
      cleanRoom_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Manufactures textiles from different fibers, used in clothing and even ship construction.
      clothingFactory_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Textile Manufacturing
      clothingFactory_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Extracts gases from the atmosphere.
      collector_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Collector
      collector_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The basic module and life support necessary to start a new base on a planet.
      coreModule_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Core Module
      coreModule_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: NO FUNCTIONALITY - Prestige Building
      corporationProjectFTLLaboratory_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Corporation FTL Laboratory
      corporationProjectFTLLaboratory_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The physical headquarter of any corporation, running basic administrative functions.
      corporationProjectHeadquarters_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Corporation Headquarters
      corporationProjectHeadquarters_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: NO FUNCTIONALITY - Prestige Building
      corporationProjectImmortality_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Corporate Immortality Center
      corporationProjectImmortality_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The APEX representation center allows corporations to donate some of their profits to the APEX foundation. The foundation uses the money to supply new and upcoming CEOs with the necessary capital and ships to start their entrepreneurial journey. Having a high representation level is widely recognized as a testimony of wealth and success.
      corporationProjectRepresentationCenter_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: APEX Representation Center
      corporationProjectRepresentationCenter_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: NO FUNCTIONALITY - Prestige Building
      corporationProjectTerraforming_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Corporate Terraformer
      corporationProjectTerraforming_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The place where all things drones are put together.
      droneShop_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Drone Shop
      droneShop_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Specialized plant that turns Liquid Einsteinium into its more usable, stabilized form.
      einsteiniumEnrichmentPlant_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Einsteinium Enrichment
      einsteiniumEnrichmentPlant_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Manufactures a variety of small end-user-ready devices.
      electronicDeviceManufactory_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Electronic Device Manufactory
      electronicDeviceManufactory_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Uses basic computer parts to manufacture larger computers and control units.
      electronicsPlant_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Electronics Plant
      electronicsPlant_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Creates energy supply systems and devices of all kinds.
      energyComponentAssembly_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Energy Component Assembly
      energyComponentAssembly_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Extracts ores and minerals from the surface.
      extractor_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Extractor
      extractor_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Produces agricultural products like grains and soy. Needs fertile soil.
      farm_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Farmstead
      farm_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Creates those beverages that make life in space just a little bit more bearable.
      fermentationFacility_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Fermenter
      fermentationFacility_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Produces the often unnoticed small, metal pieces that make up the core of many installations.
      fineSmithy_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Metalist Studio
      fineSmithy_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Uses agricultural products to produce edible consumables.
      foodProcessor_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Food Processor
      foodProcessor_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Creates different glasses and other sturdy materials at very high temperatures.
      glassFurnace_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Glass Furnace
      glassFurnace_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Offers housing for 75 pioneers and 75 settlers.
      habitationBarracks_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Barracks
      habitationBarracks_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Offers housing for 75 settlers and 75 technicians.
      habitationCommune_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Communal Abode
      habitationCommune_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Offers housing for 100 engineers.
      habitationEngineer_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Engineer Habitation
      habitationEngineer_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Offers housing for 75 engineers and 75 scientists.
      habitationLuxury_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Luxury Residence
      habitationLuxury_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Offers housing for 75 technicians and 75 engineers.
      habitationManagers_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Management Domicile
      habitationManagers_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Offers housing for 100 pioneers.
      habitationPioneer_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Pioneer Habitation
      habitationPioneer_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Offers housing for 100 scientists.
      habitationScientist_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Scientist Habitation
      habitationScientist_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Offers housing for 100 settlers.
      habitationSettler_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Settler Habitation
      habitationSettler_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Offers housing for 100 technicians.
      habitationTechnician_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Technician Habitation
      habitationTechnician_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Creates a variety of ship hull plates and shields.
      hullWeldingPlant_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Hull Welding Plant
      hullWeldingPlant_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Produces agricultural products like hydrocarbon plants. Does not need fertile soil but lots of water.
      hydroponicsFarm_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Hydroponics Farm
      hydroponicsFarm_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Deals with the creation of artificial life and meat products.
      inVitroPlant_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: In-Vitro Plant
      inVitroPlant_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Turns organically grown plants into life's most basic resource, Carbon.
      incinerator_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Incinerator
      incinerator_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Advanced laboratory that deals in more complex chemical reactions.
      laboratory_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Laboratory
      laboratory_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Assembles technical pieces into larger parts, ready to be used in many devices.
      mediumComponentsAssembly_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Medium Components Assembly
      mediumComponentsAssembly_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A specialized farm that produces high-maintenance fruits for high-end consumables.
      orchard_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Orchard
      orchard_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Turns out bundles of items are more efficient to move around in space than individual items!
      packagingCenter_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Packaging Center
      packagingCenter_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A versatile factory equipped to produce medication as well as curative support products.
      pharmaFactory_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Pharma Factory
      pharmaFactory_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: The Administration Center allows to hold elections for a planetary governor. The governor can set taxes and fees like a production fee for example. Every site owner has the right to vote, but votes can also be acquired by completing tasks set up by the Exodus Council.
      planetaryProjectAdminCenter_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Administration Center
      planetaryProjectAdminCenter_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Allows for the communal implementation of industrial support programs.
      planetaryProjectCogc_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Chamber of Global Commerce
      planetaryProjectCogc_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Provides a large amount of comfort.
      planetaryProjectComfortBig_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: 4D Arcades
      planetaryProjectComfortBig_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Provides a small amount of comfort and culture.
      planetaryProjectComfortCulture_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Art Café
      planetaryProjectComfortCulture_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Provides a small amount of comfort.
      planetaryProjectComfortSmall_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Wildlife Park
      planetaryProjectComfortSmall_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Provides a large amount of culture.
      planetaryProjectCultureBig_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: VR Theater
      planetaryProjectCultureBig_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Provides a small amount of culture and education.
      planetaryProjectCultureEducation_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Planetary Broadcasting Hub
      planetaryProjectCultureEducation_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Provides a small amount of culture.
      planetaryProjectCultureSmall_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Art Gallery
      planetaryProjectCultureSmall_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Provides a large amount of education.
      planetaryProjectEducationBig_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: University
      planetaryProjectEducationBig_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Provides a small amount of education.
      planetaryProjectEducationSmall_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Library
      planetaryProjectEducationSmall_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Provides a large amount of health.
      planetaryProjectHealthBig_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Hospital
      planetaryProjectHealthBig_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Provides a small amount of health and comfort.
      planetaryProjectHealthComfort_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Wellness Center
      planetaryProjectHealthComfort_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Provides a small amount of health.
      planetaryProjectHealthSmall_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Infirmary
      planetaryProjectHealthSmall_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A simple, unregulated, bulletin board style market place.
      planetaryProjectLocalMarket_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Local Market
      planetaryProjectLocalMarket_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: This planetary project is a collection of all infrastructure projects that are relevant for the local population
      planetaryProjectPopulation_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Population Infrastructure
      planetaryProjectPopulation_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Provides a large amount of safety.
      planetaryProjectSafetyBig_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Security Drone Post
      planetaryProjectSafetyBig_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Provides a small amount of safety and health.
      planetaryProjectSafetyHealth_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Emergency Center
      planetaryProjectSafetyHealth_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Provides a small amount of safety.
      planetaryProjectSafetySmall_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Safety Station
      planetaryProjectSafetySmall_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Bring your blueprints and materials here to build new ships.
      planetaryProjectShipyard_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Planetary Shipyard
      planetaryProjectShipyard_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Offers storage space for rent without the need to own a local site.
      planetaryProjectWarehouse_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Planetary Warehouse
      planetaryProjectWarehouse_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Prints objects out of plastic pellets.
      plasticsPrinterFacility_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: 3D Printer
      plasticsPrinterFacility_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Chemical plant that turns basic elements into flexible polymers, used in all stages of technology.
      polymerPlant_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Polymer Plant
      polymerPlant_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Produces basic prefabs necessary to construct buildings.
      prefabPlant1_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Prefab Plant MK1
      prefabPlant1_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Produces lightweight prefabs necessary to construct buildings.
      prefabPlant2_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Prefab Plant MK2
      prefabPlant2_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Produces reinforced prefabs necessary to construct buildings.
      prefabPlant3_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Prefab Plant MK3
      prefabPlant3_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Produces advanced prefabs necessary to construct buildings.
      prefabPlant4_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Prefab Plant MK4
      prefabPlant4_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Produces fuels used for space flight.
      refinery_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Refinery
      refinery_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Extracts liquid resources.
      rig_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Rig
      rig_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A factory where all kinds of standardized cargo bay and fuel tank kits are put together.
      shipKitFactory_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship Kit Factory
      shipKitFactory_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Assembles technical pieces into smaller parts, ready to be used in many devices.
      smallComponentsAssembly_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Small Components Assembly
      smallComponentsAssembly_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Produces metals from ores.
      smelter_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Smelter
      smelter_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Here basic software components are being developed for use in more complex tools and systems.
      softwareDevelopment_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Software Development
      softwareDevelopment_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Basic software components are combined into tools that can be applied in a variety of devices or used as parts of more complex systems.
      softwareEngineering_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Software Engineering
      softwareEngineering_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Architects form more advanced software applications from basic algorithms and tools for use in high-end devices.
      softwareLabs_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Software Labs
      softwareLabs_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A creation facility for all kinds of kits and standardized spaceship components.
      spacecraftPrefabPlant_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Spacecraft Prefab Plant
      spacecraftPrefabPlant_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Produces anything necessary to move a spaceship, i.e. all kinds of STL engines and FTL reactors.
      spacecraftPropulsionFactory_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Spacecraft Propulsion Factory
      spacecraftPropulsionFactory_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A large-scale storage facility that increases the capacity by 10000t / 10000m³.
      storageBig_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Expansive Storage
      storageBig_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Increases the storage capacity by 5000t / 5000m³.
      storageFacility_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Storage Facility
      storageFacility_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A small-scale storage facility that increases the capacity by 2500t / 2500m³.
      storageSmall_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Auxiliary Storage
      storageSmall_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A volume-specialized form of storage that increases the capacity by 2500t / 7500m³.
      storageVolume_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Volume Storage
      storageVolume_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A weight-specialized form of storage that increases the capacity by 7500t / 2500m³.
      storageWeight_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Weight Storage
      storageWeight_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Processes basic Technetium into a more stable configuration of the element.
      technetiumProcessing_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Technetium Processing
      technetiumProcessing_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Produces building units ready to be used as parts of bigger construction projects.
      unitPrefabPlant_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Unit Prefab Plant
      unitPrefabPlant_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Creates the most basic fabrics from fibers.
      weavingPlant_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Weaving Plant
      weavingPlant_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Creates a diverse set of metal products used in construction and device manufacturing.
      weldingPlant_description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Welding Plant
      weldingPlant_name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Recommendation: {
      // Template: bad
      _1: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: not ideal
      _2: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: okay
      _3: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: good
      _4: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: great
      _5: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {stars} ({label})
      stars: ((options: { stars: string; label: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Profession suitability indicates how well the planet is suited for the profession you chose. Note that factors like competition is not factored in, so the highest value might not always the best choice.
      suitability: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    RecommendedStarterBuildings: {
      buttons: {
        // Template: Construct
        construct: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: You have chosen the {profession} profession. In general, APEX recommends to get started by building the following initial buildings.
      text: ((options: { profession: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: In some circumstances it might make sense to deviate from this recommendation. Make sure to double check the planetary conditions and resource availability.
      text2: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: In case of a mistake, there is a one hour grace period in which you can reclaim all the building materials when demolishing it.
      text3: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Click construct to get started!
      text4: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    RecommendedStarterBuildingsPanel: {
      // Template: Recommended starter buildings
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    RelativeTime: {
      // Template: in {time}
      future: ((options: { time: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: now
      now: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {time} ago
      past: ((options: { time: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    RepresentationCenter: {
      action: {
        // Template: contribute
        contribute: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: set
        set: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      context: {
        // Template: Headquarters
        headquarters: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Bases
        sites: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      contributions: {
        // Template: Contribution
        contribution: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Contributor
        contributor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Time
        time: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      form: {
        // Template: Cost next level
        costNextLevel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Left for next level
        left: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Level
        level: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Progress
        progress: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        section: {
          // Template: Contributions
          contributions: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Next Level
          next: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Total contributions
        totalContributions: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Contribution
        contribution: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {left} {set}
        left: ((options: { left: string; set: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Note that increasing your ARC level has no effect except making for a more and more impressive representation of your economic success.
        level: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {contributed} / {cost}
        progress: ((options: { contributed: string; cost: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: APEX Representation Center
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ReputationTable: {
      // Template: {entity} - {reputation}
      entity: ((options: { entity: string; reputation: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ResourceType: {
      // Template: Atmospheric
      gaseous: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Liquid
      liquid: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Mineral
      mineral: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ResourcesTable: {
      tooltip: {
        // Template: The number indicates the daily yield of the resource, given a single resource building running at 100% efficiency.
        _yield: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Restriction: {
      // Template: Access restricted
      headline: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Access to this command is restricted. Click to learn how to get access.
      message: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    RestrictionBanner: {
      // Template: Some settings in this command are limited. Click to learn how to get full access.
      message: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Role: {
      // Template: Borrower
      BORROWER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Lender
      LENDER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    RoutePreferencesSelect: {
      label: {
        // Template: Use gateways
        useGateways: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      value: {
        // Template: least jumps
        leastJumps: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: shortest FTL route
        shortestFTL: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ScreenControls: {
      action: {
        // Template: ADD
        add: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: cpy
        copy: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: del
        _delete: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: FULL
        fullscreen: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: undo delete
        undoDelete: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: SCRN: {name}
      screenName: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: SCRN
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Screens: {
      action: {
        // Template: Rename
        rename: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      actions: {
        // Template: Add
        addVariable: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: remove
        removeVariable: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      header: {
        // Template: Add Screen Variable
        add: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Screen Variables
        variables: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Options (CSV)
        options: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Screen
        screen: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        variableName: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Type
        variableType: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: No screen variables defined
        empty: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Value
        value: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ScreensPanel: {
      // Template: Screens
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    SectionList: {
      // Template: demolish
      demolish: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Infrastructure
      infrastructure: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Production
      production: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: repair
      repair: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Resources
      resources: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      section: {
        // Template: Book value
        bookValue: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Condition
        condition: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Established
        established: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Last repair
        lastRepair: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reclaimable materials
        reclaimableMaterials: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Repair costs
        repairMaterials: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Repair materials have to be available in the base's own storage.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    SectionListPanel: {
      action: {
        // Template: Demolishing the {name} cannot be undone. Only the displayed materials will be reclaimed.
        confirmation: ((options: { name: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Demolish
        demolish: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: Base not found.
        siteId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Buildings: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Buildings
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    SectionType: {
      // Template: Engineers
      ENGINEER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Infrastructure
      INFRASTRUCTURE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Pioneers
      PIONEER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Resources
      RESOURCES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Scientists
      SCIENTIST: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Settlers
      SETTLER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Technicians
      TECHNICIAN: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    SelectInput: {
      // Template: select one
      emptyLabel: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: select one
      nullLabel: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    SelectionList: {
      section: {
        condition: {
          // Template: {condition}%
          value: ((options: { condition: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    Sender: {
      // Template: [{link}]
      label: ((options: { link: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {corp} {user}
      name: ((options: { corp: string; user: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ServerNotification: {
      action: {
        // Template: x
        close: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: See {link} for more information.
        info: ((options: { link: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: ({countdown})
        time: ((options: { countdown: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Settings: {
      arrow: {
        // Template: ◀
        left: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: ▶
        right: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ShareholderContext: {
      context: {
        // Template: Com Channel
        com: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Corporation
        corporation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Finances
        finance: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Pending Invites
        invites: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        project: {
          // Template: New project
          _new: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Projects
        projects: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ShareholderCorporation: {
      header: {
        // Template: Infrastructure
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Shareholders
        shareholders: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      info: {
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Faction
        faction: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Founded
        founded: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Headquarters
        headquarters: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Shares
        shares: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      primaryHolding: {
        // Template: Leave
        leave: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      shareholder: {
        // Template: Company
        company: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Joined
        joined: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {x} %
        relativeShare: ((options: { x: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Shares
        shares: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ShareholderCorporationFinancePanel: {
      // Template: Corporation finances
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Ship: {
      action: {
        // Template: repair
        repair: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      header: {
        // Template: Status
        Status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Blueprint
        blueprint: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Cargo Hold
        cargohold: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Commissioned
        commissioned: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Condition
        condition: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Fuel Tanks
        fueltanks: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Operating empty mass
        operatingEmptyMass: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: FTL operating time
        operatingTimeFtl: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: STL operating time
        operatingTimeStl: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Project History
        projectHistory: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Repair costs
        repairCost: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Volume
        volume: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {mass}t
      operatingEmptyMass: ((options: { mass: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {blueprint} @ {shipyard}
      projecthistory: ((options: { blueprint: string; shipyard: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {registration} / {name}
      registrationAndName: ((options: { registration: string; name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {volume}m³
      volume: ((options: { volume: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ShipFlightControl: {
      button: {
        // Template: abort
        abortFlight: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: start
        startFlight: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Location
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Condition
        condition: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Ships take attrition damage from space flight, meteoroids and extreme environmental conditions. Below a condition of 80% ships start getting slower. You can repair ships from their SHP command (just click their transponder code or name).
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Destination
        destination: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Fuel
        fuel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Fuel usage
        fuelUsage: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Inventory
        inventory: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Surface landing
        landing: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Mass / Empty mass
        mass: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Note
        note: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Origin
        origin: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reachable systems
        reachableSystems: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Reactor usage
        reactorUsage: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Route preferences
        routePreferences: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ship
        ship: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Landing
        surface: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Destination
        target: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Unload on arrival
        unload: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Setting this option will automatically unload your ship's cargo to a fixed storage location at the destination (ie base or warehouse store). This option requires a PRO license.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Unload on arrival
        unloading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      text: {
        // Template: Since this is your first flight the duration will be significantly reduced. Depending on the distance and fuel usage flights normally take many hours. Use the time until your first flight arrives to look around and familiarize yourself with APEX.
        reducedFlightTimes: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ShipFuel: {
      fuel: {
        // Template: {current}/{max}
        ftl: ((options: { current: string; max: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {current}/{max}
        stl: ((options: { current: string; max: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ShipFuelInventory: {
      // Template: FTL fuel tank
      ftl: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: STL fuel tank
      stl: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ShipFuelInventoryPanel: {
      context: {
        // Template: Ship Flight Control
        shipFlightControl: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ship Info
        shipInformation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ship Inventory
        shipInventory: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No ship found.
        shipId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {name} ({reg})
      title: ((options: { name: string; reg: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ShipInformationPanel: {
      // Template: Commissioned
      commissioned: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      error: {
        // Template: No ship found.
        shipId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Manufacturer
      manufacturer: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Operator
      operator: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {name} ({reg})
      title: ((options: { name: string; reg: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Ship
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ShipInventoryPanel: {
      context: {
        // Template: Ship Flight Control
        shipFlightControl: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ship Fuel
        shipFuel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ship Info
        shipInformation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No ship found.
        shipId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {name} ({reg})
      title: ((options: { name: string; reg: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Ship
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ShipPanel: {
      error: {
        // Template: No ship found.
        shipId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {name} ({reg})
      title: ((options: { name: string; reg: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Ship
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ShipStatus: {
      // Template: approaching
      approach: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: charging
      charge: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: waiting for decay
      decay: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: departing
      departure: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: floating
      float: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: jumping
      jump: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: jumping gateway
      jumpgateway: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: landing
      landing: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: waiting for lock
      lock: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: taking off
      takeoff: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: in transit
      transit: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ShipStore: {
      // Template: {weight}t/{volume}m³
      capacities: ((options: { weight: string; volume: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {current}t/{max}t
      weight: ((options: { current: string; max: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ShipType: {
      // Template: Colony ship
      COLONY_SHIP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Freighter
      REGULAR: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    ShipmentDeliveryCondition: {
      content: {
        // Template: Deliver shipment @ {address}
        own: ((options: { address: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ShipmentPickUpCondition: {
      content: {
        // Template: Pick up shipment @ {address}
        other: ((options: { address: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Pick up shipment ({weight}t / {volume}m³) @ {address}
        own: ((options: { weight: string; volume: string; address: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ShipmentProvisionCondition: {
      content: {
        // Template: Provisioning of shipment @ {address} {autoprovision}
        other: ((options: { address: string; autoprovision: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Provisioning of {amount, number} {amount, plural, one {unit} other {units}} of {material} @ {address} {autoprovision}
        own: ((options: {
          amount: number;
          material: string;
          address: string;
          autoprovision: string;
        }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Ships: {
      action: {
        // Template: unload
        unload: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Shipyard: {
      action: {
        // Template: Create project
        create: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      context: {
        // Template: Blueprint Flight Simulator
        blueprintFlightSimulator: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Blueprints
        blueprints: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planet
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Shipyard Projects
        shipyard: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Project
        shipyardProject: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Shipyard Projects
        shipyardProjects: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: Error loading shipyard.
        id: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      header: {
        // Template: Start a shipbuilding project
        project: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Own shipbuilding projects
        projects: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Start a ship upgrade project
        upgradeProject: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Projects
        activeProjects: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Location
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Blueprint
        blueprint: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Finished projects
        finishedProjects: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Finished projects (month)
        finishedProjectsMonth: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Finished projects (180d)
        finishedProjectsSemiannualy: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Finished projects (week)
        finishedProjectsWeek: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Projects in construction
        inConstruction: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Operator
        operator: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Origin Blueprint
        originBlueprint: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Target Blueprint
        targetBlueprint: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      projects: {
        actions: {
          // Template: delete
          _delete: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: View
          view: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        header: {
          // Template: Blueprint
          blueprint: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Cmds
          cmds: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Created
          created: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Status
          status: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      title: {
        // Template: Shipyards
        all: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ShipyardPanel: {
      create: {
        action: {
          // Template: Creating a shipbuilding project will lock the corresponding blueprint permanently.
          confirmation: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: create project
          submit: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      createUpgrade: {
        action: {
          // Template: Creating a upgrade project will lock the target blueprint permanently.
          confirmation: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: create project
          submit: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      error: {
        // Template: Could not find shipyard at {input}
        notfound: ((options: { input: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Shipyard
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Shipyards
        all: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ShipyardProject: {
      action: {
        // Template: start
        start: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No shipyard project found!
        noProject: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Ship to upgrade
        ShipToUpgrade: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Blueprint
        blueprint: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Created
        created: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Built
        end: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Origin Blueprint
        originBlueprint: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Ship
        ship: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Shipyard
        shipyard: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Started
        start: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      section: {
        // Template: Materials
        materials: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Shipyard Project: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Shipyard projects
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Shipyard project
        project: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Shipyard projects
        projects: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ShipyardProjects: {
      projects: {
        actions: {
          // Template: delete
          _delete: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: View
          view: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        header: {
          // Template: Blueprint
          blueprint: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Cmds
          cmds: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Created
          created: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Shipyard
          shipyard: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Status
          status: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    Shipyards: {
      button: {
        // Template: details
        details: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: Could not load data
        nodata: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      table: {
        // Template: Location
        location: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Operator
        operator: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Sidebar: {
      header: {
        // Template: Cash Balances
        balances: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Pending Contracts
        contracts: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Rating
        rating: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      title: {
        // Template: Government of {entity}
        government: ((options: { entity: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Site: {
      buttons: {
        // Template: Construct
        construct: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Experts
        experts: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: HQ
        headquarters: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Inventory
        inventory: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Production
        production: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Buildings
        sections: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Workforce
        workforces: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Overview
      overview: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Workforce Overview
      workforces: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    SiteBuildOption: {
      // Template: Area
      area: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: build
      build: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Expertise
      expertise: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Fertile soil
      fertile: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: no
        no: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: yes
        yes: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Materials
      materials: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Workforce
      workforce: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: {capacity} ({reserve})
        capacity: ((options: { capacity: string; reserve: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    SiteBuildOptionsContainer: {
      error: {
        // Template: Planet not found.
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    SiteBuildSectionPanel: {
      context: {
        // Template: Base
        base: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Bases
        bases: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planet
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: Base not found.
        siteId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Building Construction: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Building Construction
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    SiteConstruction: {
      // Template: {used} / {total}
      basePermits: ((options: { used: string; total: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Building a base on a planet requires the building materials for a core module, the heart of your base, as well as environment specific additions. These resources need to be brought to the planet with one of your ships. You can choose a location for your base by clicking on a free plot on the map below or click 'random plot' to select a random plot.
      description: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      label: {
        // Template: Base Permits
        basePermits: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The amount of base permits depends on the level of your company headquarters. If you run out of base permits consider upgrading your HQ.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Materials
        billOfMaterials: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The materials required to build a Core Module on this planet in order to start your base. Impacted by different environmental factors such as high or low temperature.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: build base
        build: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        buildOptions: {
          // Template: Choose between using a Core Module Kit or regular building materials for your base.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Description
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Base Establishment Fee
        establishmentFee: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Some planets require a base establishment fee to be paid to the local government in order to be able to settle on the planet.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Limit
        limit: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The amount of bases you have already built on this planet. The maximum is 1.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Location
        location: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The planet on which your base will be located. Choose wisely!
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Plot
        plotSelection: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: With the correct ship transponder selected, left-click the plot where your base should be located. This is purely cosmetic at the moment and has no effect on your company. Right click and drag to rotate the planet.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Plots / available plots
        plots: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Bases (and some other structures) each require one free plot to be constructed. The numbers indicate the total plots and free plots on this planet. Grey plots are still open.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Build Options
        siteType: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Storage Location
        store: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: One of your ships needs to hold the building materials for your base in its cargo. Select its transponder code from the dropdown.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: view base
        view: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {current} / 1
      limit: ((options: { current: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      siteType: {
        // Template: Core Module Kit
        initial: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Regular Building Materials
        regular: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    SiteConstructionPanel: {
      context: {
        // Template: Bases
        bases: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planet
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Base construction: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Base construction: loading…
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Base construction: unknown location
        unknownLocation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    SitePanel: {
      context: {
        // Template: Bases
        bases: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Building Repair Assistant
        buildingRepairAssistant: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Headquarters
        headquarters: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Inventories
        inventory: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planet
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: APEX Representation Center
        representationCenter: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Base: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Bases
        sites: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    SiteProductionLines: {
      // Template: new order
      createOrder: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You have no production facilities at this base yet.
      empty: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: queue
      queueDivider: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Details
      view: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    SitePublicInformation: {
      // Template: {area}%
      area: ((options: { area: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      label: {
        // Template: Developed area
        area: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Founded
        founded: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Primary industry
        industry: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Operator
        operator: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    SitePublicInformationPanel: {
      context: {
        // Template: Planet
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No plot found.
        siteId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Plot info not implemented for type {type}
        type: ((options: { type: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Plot @ {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Plot
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    SiteStats: {
      // Template: {developed} / {available} / {total}
      developedArea: ((options: {
        developed: string;
        available: string;
        total: string;
      }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      label: {
        // Template: Area
        area: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Developed / avail / total
        developedArea: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    SiteWorkforces: {
      // Template: {workforce} ({reserve})
      population: ((options: { workforce: string; reserve: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      table: {
        // Template: Capacity
        capacity: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Current Workforce
        currentWorkforce: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: The number of workers currently employed at the base. The number in brackets was recruited from the planet's "reserve pool". Once a week workers will be distributed between all requesting bases with a reserve being held back for mid-week acquisitions.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Level
        level: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Required
        required: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Satisfaction
        satisfaction: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Sites: {
      action: {
        // Template: start base
        buildBase: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: You have not established any planetary bases yet.
      empty: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      table: {
        // Template: add
        addPermit: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Used Area
        area: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: {developed} / {total}
          value: ((options: { developed: string; total: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Change Permits
        changePermits: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Permits
        permits: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Founding a new base requires a permit. However you can also assign permits to existing bases to increase the available building area. Level up your headquarters to gain additional permits.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: {invested} / {maximum}
          value: ((options: { invested: string; maximum: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Planet
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: rmv
        removePermit: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: view base
        view: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    SortCriteria: {
      // Template: ABC
      ABC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: AMT
      AMT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: ASC
      ASC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: CAT
      CAT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: DESC
      DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: TCK
      TCK: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: VOL
      VOL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: WGT
      WGT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Stack: {
      action: {
        // Template: Back
        back: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Edit
        edit: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Add New Card
        newCard: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Stacks
        stacks: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: stop editing
        stopEditing: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: This stack is empty. To add new cards to it, click 'add new card' below.
      empty: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      newcard: {
        action: {
          // Template: Cancel
          cancel: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Create
          create: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Enter a command
        title: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      title: {
        // Template: Add new card
        newCard: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Stacks: {
      action: {
        // Template: Cancel
        cancel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Create
        create: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Edit
        edit: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Stop Editing
        stopEditing: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      _delete: {
        // Template: Delete Stack
        confirm: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: All of the contained cards will be deleted. The operation cannot be undone!
        details: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Are you sure you want to delete this stack?
        question: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Enter a stack name
        stackName: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {part}…
      name: ((options: { part: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Add New Stack
      newStack: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Create a stack
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    StarOverlay: {
      // Template: {population} - {workforce}
      populationDataLine: ((options: { population: string; workforce: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Station: {
      context: {
        // Template: System Map
        systemMap: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    StationInformationPanel: {
      // Template: Address
      address: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Code
      code: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Commissioned
      commissioned: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      error: {
        // Template: No station found.
        stationId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Faction affinity
      faction: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Governing entity
      governingEntity: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Infrastructure
      infrastructure: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Name
      name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Station
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    StationInfrastructure: {
      // Template: {name} Warehouse
      warehouse: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Stations: {
      action: {
        // Template: details
        details: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      list: {
        // Template: Address
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Identifier
        naturalId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    StationsTile: {
      // Template: Failed to load stations.
      error: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Space Stations
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    SteamReviewPanel: {
      action: {
        // Template: steam client
        steamClient: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: steam website
        steamWebsite: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: We need your help!
      heading: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: (opens the Steam client directly, might not work in all cases)
      steamClient: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: (opens the Steam website)
      steamWebsite: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: In order to bring in new players, we need your help! The Steam algorithm heavily favors games with a lot of positive reviews and shows these games to even more players. You can help by writing a short review about why you love Prosperous Universe.
      text1: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Thank you so much!
      text2: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Steam
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    StockChartContainer: {
      error: {
        // Template: No data.
        noData: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    StoreItem: {
      // Template: Blocked materials #{id}
      blocked_materials: ((options: { id: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Shipment #{id}
      shipment: ((options: { id: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    StoreItemIcon: {
      context: {
        // Template: U
        unpack: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    StoreLockOverlay: {
      // Template: Inventory is locked
      message: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    StoreName: {
      // Template: Base
      base: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Construction site
      construction_store: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship {name} FTL fuel store
      ftl_fuel_store: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship {name} cargo hold
      ship_store: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship {name} STL fuel store
      stl_fuel_store: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Upkeep
      upkeep_store: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship {name} Vortex fuel store
      vortex_fuel_store: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Warehouse
      warehouse: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    StoreTransfer: {
      context: {
        // Template: Inventories
        inventories: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    StoreTypeLabel: {
      // Template: Construction site
      CONSTRUCTION_STORE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: CON
      CONSTRUCTION_STORE_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: FTL fuel tank
      FTL_FUEL_STORE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: FTL
      FTL_FUEL_STORE_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Cargo hold
      SHIP_STORE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: SHP
      SHIP_STORE_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: STL fuel tank
      STL_FUEL_STORE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: STL
      STL_FUEL_STORE_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Base storage
      STORE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: BS
      STORE_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Upkeep
      UPKEEP_STORE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: UPK
      UPKEEP_STORE_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Vortex fuel store
      VORTEX_FUEL_STORE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: VTX
      VORTEX_FUEL_STORE_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Warehouse unit
      WAREHOUSE_STORE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: WAR
      WAREHOUSE_STORE_SHORT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    StoreView: {
      actions: {
        // Template: Start transfer
        startTransfer: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Volume
      volume: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Weight
      weight: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    SubscriptionLevel: {
      // Template: BASIC
      basic: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: PRO
      pro: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: FREE
      trial: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    SystemInfoPanel: {
      context: {
        // Template: Fleet
        fleet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Infrastructure
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Inventory
        inventory: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: System Map
        systemMap: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: No system found.
        systemId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Faction affinity
      faction: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      header: {
        // Template: Planets
        planets: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Stations
        stations: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Micrometeoroid density
      meteoroidDensity: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Name
      name: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Named by
      naming: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Catalog ID
      naturalId: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      planet: {
        // Template: CoGC Program
        cogc: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Environment
        environment: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Fertility
        fertility: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Population
        population: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Resources
        resources: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Type
        surface: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Star type
      starType: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      station: {
        // Template: Infrastructure
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: System Info: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: System Search
        list: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: System Info: loading…
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: System Info: not found…
        notfound: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    SystemInformation: {
      info: {
        // Template: States to which faction's sphere of influence the system belongs. Planets in faction systems stricter rules than in non-faction systems, for example fees will always be levied in the faction's currency.
        faction: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Certain tiers of APEX PRO licenses include the right to name a system.
        naming: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: The cumulative workforce population.
        workforce: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {namer} {time}
      named: ((options: { namer: string; time: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      naming: {
        // Template: Name this system
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: -- {button}
      unnamed: ((options: { button: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    SystemMap: {
      setting: {
        comex: {
          // Template: Commodity Exchange
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        fleet: {
          // Template: Fleet
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        inventory: {
          // Template: Inventory
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        localMarket: {
          // Template: Local Market
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        shipyard: {
          // Template: Shipyard
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        site: {
          // Template: Base
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    SystemMapPanel: {
      context: {
        // Template: Fleet
        fleet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: System information
        info: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: System Map: No system found.
        systemId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: System Map: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: System Map
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    TaskDescription: {
      // Template: Build your first base (for example on your starting planet)!
      BASIC_BASE_BUILDING: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Choose your first buildings in your base’s construction menu!
      BASIC_BASE_CONSTRUCTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Start your first production order!
      BASIC_BASE_PRODUCTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Keep an eye on your population’s consumption! Their satisfaction and thus productivity goes down if they lack consumables.
      BASIC_BASE_WORKFORCE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Check prices at your faction's commodity exchange!
      BASIC_COMEX: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Check out and join our Discord community, where we discuss everything related to APEX and more.
      BASIC_COMMUNITY_DISCORD: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Check out our introductory materials below!
      BASIC_INTRO: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Read the APEX Guidelines!
      BASIC_INTRO_GUIDELINES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Check out the APEX handbook!
      BASIC_INTRO_HANDBOOK: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: You chose the starting package '{startingProfile}'. To learn more about your building options, have a look at the corresponding chapter in the handbook.
      BASIC_INTRO_HANDBOOK_PACKAGE: ((options: { startingProfile: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: If you have any questions, try asking in the HELP channel first!
      BASIC_INTRO_HELP_CHANNEL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Watch our video transmissions where we explain how APEX works!
      BASIC_INTRO_VIDEO: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Move building materials from your ships to your base’s inventory! Simply open both inventories simultaneously and use drag-and-drop!
      BASIC_INVENTORY_TRANSFER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Congratulations! You’re a certified APEX trader! Think about getting a PRO license to unlock access to additional features and perks! For example accepting shipping contracts at your local market can be great source of additional income!
      BASIC_LICENSE_PRO: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    TaskName: {
      // Template: Base building
      BASIC_BASE_BUILDING: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Building construction
      BASIC_BASE_CONSTRUCTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Experts
      BASIC_BASE_EXPERT: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Production orders
      BASIC_BASE_PRODUCTION: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Workforce
      BASIC_BASE_WORKFORCE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Commodity exchange
      BASIC_COMEX: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Discord community
      BASIC_COMMUNITY_DISCORD: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Introduction
      BASIC_INTRO: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Guidelines
      BASIC_INTRO_GUIDELINES: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Handbook
      BASIC_INTRO_HANDBOOK: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Building recommendations
      BASIC_INTRO_HANDBOOK_PACKAGE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Help channel
      BASIC_INTRO_HELP_CHANNEL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Video transmissions
      BASIC_INTRO_VIDEO: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Inventory transfer
      BASIC_INVENTORY_TRANSFER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: PRO license
      BASIC_LICENSE_PRO: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    TemplateSelection: {
      action: {
        // Template: add commodity
        addCommodity: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: add shipment
        addShipment: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: cancel
        cancel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: ▼
        moveDown: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: ▲
        moveUp: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: x
        remove: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: apply template
        template: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Template selection
      header: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      label: {
        // Template: Description
        description: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Total interest
        totalInterest: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    TemplateSelectionBuy: {
      label: {
        // Template: Location
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Deadline
        deadline: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Commodity
        material: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Total
        price: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Price per unit
        pricePerUnit: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    TemplateSelectionLoanAnnuity: {
      label: {
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Interest rate
        interestRate: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Interval
        interval: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Specifies the time between installments in days
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Initial repayment rate
        repayment: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Role
        role: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    TemplateSelectionLoanInterest: {
      label: {
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Duration
        duration: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        installments: {
          // Template: Defines how many installments the loan should have until the full repayment
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Interest rate
        interestRate: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Interval
        interval: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Specifies the time between installments in days
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Role
        role: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    TemplateSelectionLoanStable: {
      label: {
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Interest rate
        interestRate: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Interval
        interval: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Specifies the time between installments in days
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Repayment rate
        repaymentRate: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Role
        role: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    TemplateSelectionShip: {
      // Template: {weight}t / {volume}m³
      cargo: ((options: { weight: string; volume: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      label: {
        // Template: Amount
        amount: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Auto-provision
        autoprovision: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Cargo
        cargo: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Deadline
        deadline: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Destination
        destination: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Commodity
        material: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Origin
        origin: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Price
        price: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    TemplateType: {
      // Template: Buy commodity
      BUY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A contract to buy commodities
      BUY_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Annuity loan
      LOAN_ANNUITY: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A loan contract with fixed installments
      LOAN_ANNUITY_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Interest loan
      LOAN_INTEREST: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A loan contract where the installments are only made up of interest. Full repayment occurs with the last installment.
      LOAN_INTEREST_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Stable loan
      LOAN_STABLE: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A loan contract with a stable repayment amount and decreasing interest
      LOAN_STABLE_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Sell commodity
      SELL: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A contract to sell commodities
      SELL_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Ship commodity
      SHIP: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: A contract to ship commodities from one location to another
      SHIP_DESC: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    TextAreaInput: {
      // Template: {length} / {maxLength}
      length: ((options: { length: string; maxLength: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Tile: {
      // Template: Illegal command
      illegalCommand: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Time: {
      // Template: {days, plural, one {# day} other {# days}}
      days: ((options: { days: number }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {hours}h
      hours: ((options: { hours: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {minutes}m
      minutes: ((options: { minutes: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {seconds}s
      seconds: ((options: { seconds: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Tour: {
      BASE: {
        _1: {
          // Template: Congratulations, you just built your first base.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: We added a new screen for you to manage your base and switched to it. It is called '04. Base' and you can find it in the <strong>SCRNS</strong> drop down menu.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Base screen
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _2: {
          // Template: These are your ships' inventories.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: You can transfer items to your base inventory (on the right) by dragging them over.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: As a shortcut, you can also use the <strong>UNLOAD</strong> button to transfer everything at once.
          _3: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Inventories
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _3: {
          // Template: This tile holds an overview of your base’s workforce and gives you access to all the core management options.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: One of the first things you should look into is building your initial production lines.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Base overview
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _4: {
          // Template: This tile's command shows the recommended starting buildings for your selected profession.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: You can click the individual buildings to get more information.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Click <strong>CONSTRUCT</strong> to get started!
          _3: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Building construction
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _5: {
          // Template: Initially you will have to build a couple pioneer habitation modules for your workforce. Your habitations determine how many active workers your base can hold.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Once you offer housing for your initial workforce, build the first resource extraction or production building based on the starting building recommendations.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Building construction
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _6: {
          // Template: Once your production buildings are set up, they are displayed in this tile.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Here you can start your production and queue up future orders via<strong>NEW ORDER</strong>.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Production orders usually take many hours to complete. Your first order will be sped up significantly, so you can continue to get to know the APEX interface without having to interrupt your session.
          _3: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Production lines
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _7: {
          // Template: By the way, important notifications such as the receival of new contracts or finished production orders can be accessed via this button.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Notifications
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      CONTRACT: {
        _1: {
          // Template: You just received your first faction contract. A new 'Contracts' screen was created automatically. Find it in the <strong>SCRNS</strong> dropdown.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Contract screen
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _2: {
          // Template: All your contracts are collected in the <code>CONTS</code> command. You can also find an overview of contracts pending action in the sidebar to the right.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: The first contract you received is one from your faction and includes the task of setting up your first base.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Contracts
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _3: {
          // Template: These are the contract’s details. You can open the details of each contract via the “view” button in <code>CONTS</code>.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: The <code>CONT</code> command on the right has a preamble explaining what the contract is about. At the bottom you will always find a contract’s conditions, i.e. what you and your contract partner have to do at which point in time.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Contract details
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _4: {
          // Template: One more advanced feature you may want to keep in mind for the future: Via the <code>CONTD</code> command and its “create new” button you can draft your own contracts and send them to other players. Please note that sending out contracts requires a PRO license.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Contract drafts
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _5: {
          // Template: For now though, go back to the “START” screen via the <strong>SCRNS</strong> dropdown and find the “start base” button to fulfill your contract. After setting up your base, you will receive the first part of your company startup bonus.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Setting up your base
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      CX: {
        _1: {
          // Template: Congratulations, your ship finished its first journey.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: We added a new screen for you to manage your trading activities and switched to it. It is called '06. Trading' and you can find it in the <strong>SCRNS</strong> drop down menu.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Trading screen
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _2: {
          // Template: This is the <code>CX</code> command, the main interface of each commodity exchange. You can access all available commodities via the category dropdown.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Each commodity entry holds data on its current price, demand and supply. On the right of each row, you can get more information, charts and - most importantly - the commodity's order book ('Orders') and its trading command ('Trade').
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Commodity exchange
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _3: {
          // Template: This is the order book for basic rations. It shows the amount and prices of each offer (also known as asks) at the top in red. The requests (also known as bids) are below in green.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: If you want a request to be filled immediately, put in a price not lower than the the lowest offer. If you want your offer to sell immediately, put in a price not higher than the highest request.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Order book
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _4: {
          // Template: The information from the order book allows you to make informed decisions when placing orders via the <code>CXPO</code> command.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Just enter a quantity and a price, and then click 'sell' or 'buy' to create either an offer or a request.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Now, set up a request for <strong>RAT</strong>!
          _3: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: <strong>Note</strong>: Once your request is filled, it will be loaded into a ship present at the commodity exchange station automatically. You can also trade if you have no ship present though. In that case a pick-up contract will be created that allows you to collect your goods later on!
          _4: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Order placement
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _5: {
          // Template: All your commodity exchange offers and requests will be listed in <code>CXOS</code> for future reference. You can also track whether they have been (partially) filled already here.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Order list
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _6: {
          // Template: Sometimes it can be worth checking prices not only at your nearby commodity exchange, but also on others. The <code>CXL</code> command has a list of all commodity exchanges.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: List of commodity exchanges
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      FLIGHT: {
        _1: {
          // Template: Congratulations, your first production order just completed.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: We added a new screen for you to manage your ships and switched to it. It is called '05. Travel' and you can find it in the <strong>SCRNS</strong> drop down menu.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Travel screen
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _2: {
          // Template: The fleet overview command <code>FLT</code> holds a list of all your ships.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Clicking the transponder code will open a new buffer with more information about your ship.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Clicking the entries in the cargo and fuel columns will open the respective inventories.
          _3: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Fleet overview
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _3: {
          // Template: This screen already has the ships' inventories added to it.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: You can fill ship inventories by dragging over items from your base. For example, you could ship your recently produced products to the closest commodity exchange.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Manage your inventory
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _4: {
          // Template: The closest commodity exchange is located on a space station. It also features a local market and warehouses.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Take note of the station's code ({code}), it can be used when entering a destination for our space flight.
          _2: ((options: { code: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Commodity exchange
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _5: {
          // Template: These are your ship's flight controls. You can open them anytime via the 'fly' button on the right side of your fleet overview command (<code>FLT</code>).
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: The flight controls allow you to send ships to other destinations, like planets and stations.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Flight controls
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _6: {
          // Template: Now, try entering the station's code ({code}) into the destination field and select the station from the results.
          _1: ((options: { code: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Once you entered a destination, the bottom of the flight controls command will show your ship's route. By the way, you can hover over each location in the list to highlight it on the universe map on the left.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: It's important to save on fuel since you're in this for the long haul hopefully. So keep your fuel usage sliders low and click the <strong>START</strong> button only if you are certain that you are ready to start the flight!
          _3: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Depending on your destination and fuel usage flights usually take <strong>many hours</strong>. Your first flight will be sped up significantly, so you can continue to get to know the APEX interface without having to interrupt your session.
          _4: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Flight controls
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      UI: {
        _1: {
          // Template: You're about to dive into a dynamic, universe-spanning economy where you will manage your own startup company.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: No worries though, take a quick tour of the powerful <strong>APEX</strong> interface and you’ll be building, negotiating and trading in no time!
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Welcome licensee!
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _10: {
          // Template: Great! Here you can find a quick overview of your cash balance in the different currencies as well as a list of pending contracts with other players.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Sidebars
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _11: {
          // Template: Finally, you can add whole new screens from the top action bar. You will also find a list of all your existing screens here.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Screens
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _12: {
          // Template: Now you know how to navigate <strong>APEX</strong>
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: For your first steps, consider following the instructions in the <code>HELP</code> tile.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Many tiles also link directly to the handbook via the {image} icon in their top bar!
          _3: ((options: { image: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Happy trading, licensee!
          _4: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: More resources
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _2: {
          // Template: This is a <strong>tile</strong>. Specifically, this tile shows you information about the starting planet you chose. You can always hover over the {image} icon for more information!
          _1: ((options: { image: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Multiple tiles make up a SCREEN. In APEX you can design your own screen layouts!
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Tiles & Screens
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _3: {
          // Template: You can change a tile's size by dragging the edges!
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Tiles & Screens
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _4: {
          // Template: Hovering over the {image} icon at the top of a tile will allow you to create new tiles by
          _1: ((options: { image: string }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Dividing the tile horizontally
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Dividing the tile vertically
          _3: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: You can also
          _4: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Remove the tile from your current screen’s layout
          _5: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Empty the tile and fill it with a new <strong>COMMAND</strong>
          _6: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Tiles & Screens
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _5: {
          // Template: Another way of accessing the content you’re looking for is by using <strong>BUFFERS</strong>.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Click the button below to create a new buffer!
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Buffers
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _6: {
          // Template: Content in <strong>APEX</strong> is accessed via commands.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: For example: type <code>CXL</code> and hit enter to open an overview of all commodity exchanges.
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Buffers
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _7: {
          // Template: Buffers are <strong>temporary</strong>. They will disappear when you re-boot APEX.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: To make them permanent, integrate them in your screen's layout!
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: To do this, grab the buffer’s content at the title bar and drag it to an empty tile to permanently add it to your screen.
          _3: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: You can also move the content of existing tiles in your screen in the same manner.
          _4: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Buffers
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _8: {
          // Template: The left sidebar in APEX comes with a preset selection of easily accessible commands.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Click them to instantly open the respective command in a new buffer!
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Sidebars
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        _9: {
          // Template: Optionally, you can activate an additional sidebar on the right side of your screen.
          _1: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Try it now by clicking <code>SDBR</code>!
          _2: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Sidebars
          title: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      tooltip: {
        action: {
          // Template: finish
          finish: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: next
          next: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: back
          previous: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: skip
          skip: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: {current} / {size}
        progress: ((options: { current: string; size: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    TrafficStats: {
      table: {
        // Template: current phase
        currentPhase: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: failed: inoperative
        failedInoperative: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: failed: missing fuel
        failedMissingFuel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: failed: over capacity
        failedNoCapacity: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: average over 10 phases
        last10Phases: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: last phase
        lastPhase: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: successful
        successful: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    TransmissionsPanel: {
      table: {
        command: {
          // Template: view
          view: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Command
        commands: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Transmission
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: #
        number: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: (your profession)
        profession: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        t01: {
          // Template: Orientation to the galaxy
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        t02: {
          // Template: Your first base
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        t03_1: {
          // Template: Manufacturer Profession
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        t03_2: {
          // Template: Metallurgist Profession
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        t03_3: {
          // Template: Victualler Profession
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        t03_4: {
          // Template: Carbon Farmer Profession
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        t03_5: {
          // Template: Constructor Profession
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        t03_6: {
          // Template: Fuel Engineer Profession
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        t04: {
          // Template: Base upkeep and flight
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        t05: {
          // Template: The market guide
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        t06: {
          // Template: Licenses
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        t07: {
          // Template: Interface guide
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        t08: {
          // Template: Corporations and Contracts
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        t09: {
          // Template: Your Second Base
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        t10: {
          // Template: Space Empires
          name: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      // Template: Transmissions
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Unavailable: {
      // Template: This command is not supported in the '{type}' context
      message: ((options: { type: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    UniverseMap: {
      legend: {
        heading: {
          // Template: Hint
          hint: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Legend
          legend: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Click and hold the left mouse button to drag the map. Click and hold the right mouse button to rotate. Use the mousewheel to zoom.
        text1: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      setting: {
        country: {
          // Template: Factions
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        filters: {
          // Template: Filters
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        highlights: {
          // Template: Highlights
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Use mouse left to pan, mouse right to rotate, mouse wheel to zoom
        hint: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Hint
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        population: {
          // Template: Population
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        resources: {
          // Template: Resources
          label: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    UniverseMapPanel: {
      // Template: Universe Map
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Unpack: {
      action: {
        // Template: all
        all: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: 1
        unpack1: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: 10
        unpack10: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: 5
        unpack5: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Unpack all
        unpackAll: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Address
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Engineer bundles
        engineer: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Pioneer bundles
        pioneer: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Scientist bundles
        scientists: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Settler bundles
        settler: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Technician bundles
        technician: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Store type
        type: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    UnpackPanel: {
      context: {
        // Template: Inventory
        inventory: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: Unknown store
        store: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Unpacking Bundles
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    UpgradeInfrastructureComponent: {
      error: {
        // Template: This infrastructure is currently being upgraded
        ongoingUpgrade: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Address
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Constructor
        _constructor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Deadline
        deadline: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Infrastructure
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Parameters
        parameters: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Payment
        payment: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    UpkeepInfrastructureComponent: {
      label: {
        // Template: Address
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Contractor
        contractor: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Currency
        currency: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Current upkeep phase
        currentUpkeepPhase: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Infrastructure
        infrastructure: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Start at upkeep phase
        initialPeriod: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Payment per phase
        payment: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Service level objective
        serviceLevel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upkeep phase end
        upkeepPhaseEnd: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Upkeep phases
        upkeepPhases: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    UserLicenseTile: {
      context: {
        // Template: License Time Gifting
        gifting: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: License Details
      details: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Your PRO subscription expired and you now have a BASIC license. To get unlimited access to APEX you will have to acquire a PRO subscription again.
        BASIC: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Your account is currently on a FREE license. Upgrade to PRO today to get unlimited access to all of APEX' features, including corporation management, foreign exchange trading and many more. A PRO license is also a prerequisite for a company rating which is required for access to restricted markets and private contracts.{linebreak}Once your PRO license expires you will fall back to a BASIC license, which will retain some functionality, such as accepting custom contracts from other licencees.
        FREE: ((options: { linebreak: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: You have an active PRO subscription which grants you unlimited access to all features of the APEX network.
        PRO: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Expiry
      expiry: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Current License
      license: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: gift PRO
        gift: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: manage license
        manage: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: APEX License Status
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    UserList: {
      // Template: Users (offline)
      headerOffline: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Users (online)
      headerOnline: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    UserOffices: {
      label: {
        // Template: Current offices
        current: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Past offices
        past: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      office: {
        // Template: {count}x {office} at {address}
        multiple: ((options: { count: string; office: string; address: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {office} at {address}
        single: ((options: { office: string; address: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    UserPanel: {
      action: {
        // Template: Block User
        blacklist: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Are you sure you want to prevent this user from accepting your local market ads?
          confirmation: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Contact User
        contact: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Unblock User
        deblacklist: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Impersonate
        impersonate: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Mute User
        mute: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Are you sure you want to globally mute this user?
          confirmation: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Unmute User
        unmute: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      context: {
        // Template: User information
        offices: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      data: {
        // Template: {count, plural, =0 {Currently inactive} one {Active one day per week} other {Active ~# days per week}}
        activeDaysPerWeek: ((options: { count: number }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Activity
        activity: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Badges
        badges: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Company
        company: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Registered
        created: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: PRO license gifts
        gifts: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Name
        name: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Connection Status
        online: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: offline
          no: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: connected
          yes: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      error: {
        // Template: No user for input '{input}'.
        id: ((options: { input: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      title: {
        // Template: User
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    UserSelector: {
      input: {
        // Template: Enter user name
        placeholder: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      suggestions: {
        title: {
          // Template: Search results
          searchResults: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Search results (20+)
          searchResults20: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    // Template: CONS {count}
    UsersOnlineCount: ((options: { count: string }) => string) & {
      getFormat: () => IntlMessageFormat;
    };
    UsersOnlinePanel: {
      // Template: Connected Users
      title: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Username
      username: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Validation: {
      rule: {
        // Template: Must be a whole number.
        integer: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Invalid name.
        matches: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Must be less than or equal {max}.
        max: ((options: { max: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Must be greater than or equal {min}.
        min: ((options: { min: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Must be a number.
        number: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: This field is required.
        required: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    Warehouse: {
      action: {
        // Template: Cancel {units}
        cancel: ((options: { units: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Rent {units}
        rent: ((options: { units: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {available} / {total}
      availableUnits: ((options: { available: string; total: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: unlimited
        unlimited: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {weight}t / {volume}m³
      capacity: ((options: { weight: string; volume: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      command: {
        // Template: open store
        openStore: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      context: {
        // Template: Local Rules
        localrules: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Planet
        planet: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Warehouse
        warehouse: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      error: {
        // Template: Could not find warehouse for input {input}.
        id: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: This planet has no warehouse.
        nowar: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {fee}{linebreak}collected by {collector}
      fee: ((options: { fee: string; linebreak: string; collector: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      header: {
        // Template: Contributions
        contributions: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Expansion
        expansion: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Warehouse storage
        storage: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      label: {
        // Template: Location
        address: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Units
        cancelUnits: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Capacity
        capacity: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Cmd
        command: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Weekly rental fee
        fee: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: If you cannot afford paying the rental fee, your warehouse store will be locked and inaccessible to you until the fee is paid.
          info: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: Fees
        feeCollector: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Level
        level: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Status
        locked: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: This warehouse has reached its maximum level and cannot be expanded further
        maxedOut: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Operator
        operator: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Next fee payment
        payment: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Units
        rentUnits: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Max. units per company
        rentableUnits: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Unit size
        size: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Store
        store: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Available units
        units: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Rented units
        unitsRented: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {address} Warehouse
      name: ((options: { address: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      size: {
        // Template: 500t / 500m³
        _default: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      status: {
        // Template: locked
        locked: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: operational
        operational: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Warehouse: {name}
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Warehouse
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: {units} / {rentableUnits}
      unitsRented: ((options: { units: string; rentableUnits: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Window: {
      action: {
        // Template: x
        close: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Close buffer
          alt: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: _
        minimize: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Minimize buffer
          alt: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    WithCompany: {
      // Template: Creating a company through the mobile APEX console is not supported at this time. Please use a desktop browser to set up your company. Thank you very much for your understanding.
      error: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Workforce: {
      // Template: Engineers
      ENGINEER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: ENG
      ENGINEER_TICKER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Pioneers
      PIONEER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: PIO
      PIONEER_TICKER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Scientists
      SCIENTIST: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: SCI
      SCIENTIST_TICKER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Settlers
      SETTLER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: SET
      SETTLER_TICKER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Technicians
      TECHNICIAN: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: TEC
      TECHNICIAN_TICKER: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    Workforces: {
      // Template: Category
      category: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Days
      days: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: The number of days your supplies will last given the current consumption rate.
        info: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Essential
      essential: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Efficiency losses from running out of essential consumables are higher than for non-essential ones. If a workforce runs out of all essential consumables, it will stop working altogether.
        info: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: yes
        yes: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Needs
      needs: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Required
      required: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Workforce Size / Capacity
      size: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {size} / {capacity}
      sizeCapacity: ((options: { size: string; capacity: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: Total
      total: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: The total units consumed per day across all workforce tiers.
        info: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Total Satisfaction
      totalSatisfaction: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {units, plural, one {{units} unit} other {{units} units}} / day / 100
      unitsPer100: ((options: { units: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
      // Template: {units, plural, one {{units} unit} other {{units} units}} / day
      unitsPerInterval: ((options: { units: string }) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    WorkforcesPanel: {
      error: {
        // Template: Base not found.
        siteId: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      // Template: Workforce @ {name} Base
      title: ((options: { name: string }) => string) & {
        getFormat: () => IntlMessageFormat;
        // Template: Workforce
        loading: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    cForExPricePanelContent: {
      // Template: Volume
      volume: ((options: void) => string) & {
        getFormat: () => IntlMessageFormat;
      };
    };
    chat: {
      messageList: {
        button: {
          // Template: load more messages
          loadMore: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        label: {
          // Template: {users} {count, plural, one {is typing..} other {are typing..}}
          typingUser: ((options: { users: string; count: number }) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
      messages: {
        // Template: {user} has been temporarily banned from this channel.
        banned: ((options: { user: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {user} deleted this message
        deleted: ((options: { user: string }) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Message has been deleted. You exceeded your messaging limit.
          auto: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
        // Template: {name} joined.
        joined: ((options: { name: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {name} left.
        left: ((options: { name: string }) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: new messages
        read_status: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: {user} renamed channel to {name}.
        renamed: ((options: { user: string }) => string) & {
          getFormat: () => IntlMessageFormat;
          // Template: Channel renamed to {name}.
          auto: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    comex: {
      broker: {
        info: {
          // Template: Ask
          ask: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
            // Template: Ask Amount
            amount: ((options: void) => string) & {
              getFormat: () => IntlMessageFormat;
            };
          };
          // Template: Bid
          bid: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
            // Template: Bid Amount
            amount: ((options: void) => string) & {
              getFormat: () => IntlMessageFormat;
            };
          };
          // Template: High
          high: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
            // Template: All-time High
            allTime: ((options: void) => string) & {
              getFormat: () => IntlMessageFormat;
            };
          };
          // Template: Low
          low: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
            // Template: All-time Low
            allTime: ((options: void) => string) & {
              getFormat: () => IntlMessageFormat;
            };
          };
          // Template: Price Average
          priceAverage: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Traded
          traded: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
          // Template: Volume
          volume: ((options: void) => string) & {
            getFormat: () => IntlMessageFormat;
          };
        };
      };
    };
    game: {
      loading: {
        // Template: Materials
        categories: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Communication
        channels: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Company data
        company: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Contracts
        contracts: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Corporation
        corporation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Factions
        countries: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Sectors
        sectors: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Fleet
        ships: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Configuration
        simulation: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Bases
        sites: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Navigation
        stars: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: Inventory
        stores: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: APEX Subsystems
        uidata: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
    ships: {
      action: {
        // Template: cargo
        cargo: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: fly
        fly_to: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: fuel
        fuel: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: unload
        unload: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
        // Template: view
        view: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
      status: {
        // Template: stationary
        stationary: ((options: void) => string) & {
          getFormat: () => IntlMessageFormat;
        };
      };
    };
  }
}
