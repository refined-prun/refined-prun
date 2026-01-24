# Changelog

## 26.1.24

### Added

- `expand-sidebar-contract-list`: Fully expands the contracts list in the sidebar
- `mat-refined-prun-price`: Adds a "Refined PrUn Price" row

### Changed

- `flt-ship-condition`: Move the yellow condition threshold to 80% and remove the red one

### Fixed

- `XIT ACT`: Fix errors related to orbiting ships
- `XIT FINCH`: Fix the Y axis labels fraction digits
- `XIT GIF`: Fix pillarboxing
- `browser-tab-name`: Fix ghost notifications
- `other-context-notification-count`: Fix ghost notifications (once and for all, I hope)

## Removed

- `cxpc-default-1y`: This feature had too many edge cases

## 26.1.15

### Changed

- `XIT FINCH`: Add a "(Partial)" suffix to the equity chart if the full equity mode is disabled
- `XIT GIF`: Switch from Giphy to Klipy

### Fixed

- `XIT SET BFR`: Fix the table header row misalignment
- `browser-tab-name`: Fix ghost notification counter for deleted notifications

## 26.1.11

### Added

- `bbc-building-count`: Adds a building count label to the building icons
- `browser-tab-name`: Renames the browser tab based on the current screen

### Changed

- `XIT ACT`: Make the material group and action lists reorderable
- `XIT FINBS`: Add vortex fuel stores to the "Fuel tanks" total
- `XIT FINBS`: Add a button to each row to open `XIT FINCH` with the selected chart
- `XIT FINCH`: Add charts to all entries from the balance sheet
- `XIT SET`: Display the 12h/24h time format in the Default option
- `XIT SET`: Make the sidebar button list reorderable
- `XIT SET FIN`: Add an "Equity mode" toggle to switch between full and partial equity
- `XIT SORT`: Make the sorting mode list reorderable
- `flt-flight-status-icons`: Add icons for new status types and make the JUMP icon more distinctive
- `inv-compress-inventory-info`: Add a small right padding to the unload button in `SHPI`
- `inv-shorten-storage-types`: Use the short type labels from the base game instead of custom ones
- `inv-shorten-storage-types`: Shorten storage types in the filter bar
- Ignore planetary infrastructure inventories in all features
- Disable the full equity mode for new Refined PrUn users that are less than 90 days old

### Fixed

- `cxpc-default-1y`: Fix the 1y chart not opening after it has been opened once
- `nots-notification-type-label`: Add labels for the missing notification types

## 25.12.30

### Changed

- Open `XIT CMDS` in the parameterless `XIT` command

### Fixed

- `cxpc-default-1y`: Fix the 1y chart showing only 30d of data if opened not from `CXM`
- Fix the `XIT` command with no parameters breaking all later `XIT` commands

## 25.12.28

### Added

- `audio-volume-slider`: Adds a volume slider to the game settings in the top-right corner of the screen
- `cxpc-default-1y`: Selects the 1y chart on open

### Changed

- `XIT BURN`: Add support for a `NOT` filter, for example `XIT BURN NOT MALAHAT`
- `correct-commands`: Add support for planets in system commands, for example `SYSI PROMITOR`
- `correct-commands`: Add support for stations in system commands, for example `SYSI ANT`
- `nots-notification-type-label`: Add labels for the new notification types
- `nots-notification-type-label`: Adjust the colors to improve readability and consistency with the game's UI
- Decrease the default audio volume to 40%

### Fixed

- `XIT ACT`: Fix the CX Buy action failing to execute due to number formatting in some localizations
- `bs-hide-zero-workforce`: Fix the broken tooltip in the "Current Workforce" column header
- `co-base-count`: Fix the feature not working after the gateway update
- `cxpo-auto-price`: Fix localized number formatting
- `exp-expert-eta`: Fix the Infinityd bug for production lines without recurring orders
- `hide-system-chat-messages`: Fix the vertical indicator not being visible after the gateway update
- `inv-compress-inventory-info`: Fix the feature not working in `SHPI`
- `other-context-notification-count`: Fix ghost INFRASTRUCTURE_UPGRADE_COMPLETED notifications
- `screen-layout-lock`: Fix the feature not working when the game URL does not contain a screen id

## 25.11.16

### Added

- `screen-layout-lock`: Adds screen locking
- `cxos-hide-delete-filled`: Hides the "Delete Filled" button when filters are hidden

### Changed

- `XIT ACT`: Make the action package list reorderable
- `XIT ACT`: Add an "Allow Unfilled" option to the CX Buy action
- `XIT ACT`: Remove the Help button
- `XIT SET`: Add a confirmation popup for restore from backup
- `XIT SORT`: Add copy/paste buttons to sorting modes
- `item-icons`: Add icons for colony-ship-related materials
- `screen-tab-bar`: Make tab bar scrollable to allow offscreen tabs

### Fixed

- `XIT ACT`: Fix MTRA action getting stuck when the material amount is zero
- `XIT ACT`: Fix CX Buy action getting stuck when the material amount is zero
- `XIT CONTS`: Fix government partner display in contracts
- `XIT CONTS`: Fix the display text of the "Construct Ship" condition
- `XIT NOTE`: Fix material tickers being changed to the first one in the note
- `correct-commands`: Fix url correction for links without http:// or https:// in XIT WEB
- `sidebar-contracts-details`: Fix government partner display in contracts
- Fix the color of materials in the "Infrastructure" category

## 25.8.16

### Added

- `bui-sort-recipes`: Sorts the recipes and materials by category/ticker/amount sort order

### Changed

- `XIT BURN`: Add an `OVERALL` optional parameter to display overall burn only
- `shipping-per-unit-price`: Remove the currency symbol in the `LMP` per-unit price label
- Improve the sorting order of "drones" and "ship kits" categories

### Fixed

- `planet-commands`: Fix replacing station natural ids with planet natural ids

## 25.8.1

### Added

- `XIT PRUNSTAT`: Opens the PrUn Financial Report website

### Changed

- `XIT ACT`: Allow Refuel to process without sufficient fuel stored
- `XIT ACT`: Add a Rename button
- `XIT ACT`: Filter out fuel tanks from address selectors in the MTRA action
- `XIT FIN`: Add a missing `XIT FINBS` command to FIN context bars
- `XIT NOTE`: Make header clickable to allow renaming
- `XIT TODO`: Make header clickable to allow renaming

### Fixed

- `XIT ACT`: Fix MTRA actions failing to execute if the material cannot be transferred in full

## 25.7.19.1611

### Fixed

- Fix another case of the extension failing to load

## 25.7.19

### Added

- `blck-item-destination`: Adds a destination address to BLCK items
- `cxpc-chart-types`: Adds "Smooth" and "Aligned" chart types
- `shorten-shpt-blck-address`: Shortens addresses in SHPT and BLCK items
- `usr-subscription-level`: Adds user license info

### Changed

- `XIT ACT`: Change the "No ships need refueling" message level to INFO
- `prun-bugs`: Remove the `CONTD` condition saving fix

### Fixed

- `XIT ACT`: Fix an off-by-one error in the Refuel action
- `XIT FINPR`: Fix profitability calculation after PRO license expiration
- `cxpo-order-book`: Fix form label text overflow
- Fix the extension not loading in certain cases

### Removed

- `shipment-item-detail`: This feature is now natively implemented in the APEX

## 25.6.18

### Added

- `exp-expert-eta`: (new) Displays ETA for the next expert to appear
- `show-space-remaining`: (new) Shows the remaining weight and volume capacity of the selected store in INV and SHPI
- `wf-workforce-filters`: (new) Adds filters to hide zero workforce types and consumables

### Changed

- `XIT ACT`: Add a Refuel action
- `custom-left-sidebar`: Add ACT, BURN, and REP to the default left sidebar buttons
- `input-math`: Add "k" replacement for 1000 in math expressions

### Fixed

- `XIT BURN`: Fix Burn values being incorrect in some occasions
- `XIT CXTS`: Fix Amount column not being formatted properly
- `other-context-notification-count`: Fix notification count sometimes including deleted notifications
- Fix date/time/number formatting not respecting the selected language

## 25.6.9.1557

### Fixed

- `XIT ACT`: Fix CX Buy action getting stuck after unexpected order book updates

## 25.6.9

### Fixed

- `other-context-notification-count`: Fix counter displaying "ghost" notification count

## 25.6.8

### Added

- `other-context-notification-count`: (new) Displays the number of notifications from other contexts in the NOTS header label
- Add user data backups (up to 5, every 24 hours)
- Add user data restore from backup after the extension reinstall

### Changed

- `XIT ACT`: Add an export button to the action editor
- `XIT ACT`: Auto-focus the text input on action import prompt open
- `XIT SET`: Reload the page after importing or resetting user data
- `highlight-own-exchange-orders`: Make own order rows bold
- `item-icons`: Add a detail to the INS icon
- Swap the order of SF and FF in category sorting

### Fixed

- `XIT ACT`: Fix CX Buy action using stale order book data
- `XIT WEB`: Fix iframe being a bit too big for Firefox to properly scroll
- `cxob-depth-bars`: Fix feature not working for newly placed orders
- `cxpo-order-book`: Fix price/quantity autofill number formatting
- `cxpo-order-book`: Fix clicking on MM order amount not filling the price
- `highlight-own-exchange-orders`: Fix feature not working for newly placed orders
- `screen-tab-bar`: Fix SCRN list not being updated when the page url contains context id

## 25.4.27

### Added

- `mu-fix-sector-names`: (new) Fixes sector names, for example LE => LS

### Changed

- `XIT ACT`: Add action package name validation
- `XIT HELP`: Remove help for action packages
- `cxpo-order-book`: Change the display of own orders - an amount link instead of a row highlight
- `highlight-own-exchange-orders`: Change the display of own orders - an amount link instead of a row highlight

### Fixed

- `cxob-depth-bars`: Fix feature not working in Firefox and older Chromium versions

## 25.4.24

### Added

- `cmds-clickable-commands`: (new) Makes commands clickable
- `cx-search-bar`: (new) Adds a search bar for materials
- `cxob-center-on-open`: (new) Centers the order book on open
- `cxob-depth-bars`: (new) Adds market depth bars
- `cxob-hide-section-headers`: (new) Hides "Offers" and "Requests" headers
- `cxob-supply-demand-values`: (new) Adds supply and demand value labels
- `cxpo-auto-price`: (new) Adds automatic price calculation
- `cxpo-bigger-buttons`: (new) Makes "Buy" and "Sell" buttons bigger
- `macos-antialiased-font`: (new) Applies antialiased smoothing to all fonts on macOS

### Changed

- `cxpo-order-book`: Add price and quantity autofill by clicking on the order amounts and prices
- `cxpo-order-book`: Increase the default width of `CXPO` buffers by 60px
- `cxpo-order-book`: Remove the "Offers" and "Requests" section headers
- `prun-bugs`: Fix the tooltip arrow position in right and bottom tooltips

## 25.4.14

### Changed

- `XIT ACT`: Add total cost to CX Buy action step description
- `XIT ACT`: Improve step generation and log messages for "buy partial" CX Buy actions
- `XIT ACT`: Tag non-failed actions as skipped if they cannot be executed
- `XIT ACT`: Make CX Buy and MTRA actions wait for the storage update before executing the next action
- `XIT ACT`: Add an error for the CX Buy action when there is not enough space in the CX warehouse

### Fixed

- `XIT ACT`: Fix the CX Buy action getting stuck when there are no orders in the order book and the "buy partial" toggle is on
- `XIT ACT`: Fix opening a run tile for packages with configurable MTRA and no origins/destinations available
- `XIT ACT`: Fix MTRA action getting stuck when there is no space in the destination inventory
- `XIT ACT`: Fix MTRA action error when the material is not present in origin inventory
- `XIT SET`: Fix financial data point deletion targeting the wrong data point

## 25.4.12

### Added

- `tile-controls-background`: (new) Adds a solid color background to the top-right tile controls
- `prodco-order-eta`: (new) Adds a finish ETA label to orders

### Changed

- `XIT ACT`: Add a quickstart flow for users without any action packages
- `XIT ACT`: Add an ability to open missing tiles during a package run
- `XIT ACT`: Add a companion tile for package runs in a floating buffer
- `XIT ACT`: Add "Configure on Execute" as a planet option in Resupply and Repair actions
- `XIT ACT`: Auto-select the material during the MTRA action
- `XIT ACT`: Improve the "will not be transferred" warning wording during the MTRA action
- `XIT ACT`: Stop a package run if there's not enough materials during CX Buy
- `XIT ACT`: Improve sorting in inventory selection dropdown
- `XIT ACT`: Add log auto-scrolling
- `XIT ACT`: Show additional context data in the log
- `XIT ACT`: Add auto-fetching burn data for Resupply material groups
- `XIT ACT`: Change configuration UI to form-based
- `XIT ACT`: Make UI layout more stable during a package run
- `item-icons`: Add an icon for consumable bundles category
- Change item sorting in the "consumable bundles" category to tier-based

### Fixed

- `XIT ACT`: Fix the Resupply material amounts not matching the ones in `XIT BURN`
- `XIT ACT`: Fix the action button displacement on buffer move during a package run
- `XIT ACT`: Fix various issues for package runs in floating buffers
- `XIT BURN`: Fix zero amount being displayed as "-0" sometimes
- `prodco-order-eta`: Fix broken feature caused by recent game update
- `prodq-order-eta`: Fix eta missing in order slots that were initially empty
- `prun-bugs`: Fix user search results box being too big for the `GIFT` tile
- `table-rows-alternating-colors`: Fix a rendering issue in Firefox
- Fix stacking overlays (like in `XIT ACT`) not displaying correctly
- Fix item color of consumable bundles in icons made by the extension

## 25.3.24

### Added

- `header-hide-controls-button`: (new) Adds buttons to hide and show context controls for tiles containing them
- `lead-per-day-column`: (new) Adds a "Per Day" column to the "Commodity Production" leaderboard
- `prodq-hide-government-links`: (new) Hides fee collector links
- `prodq-order-eta`: (new) Adds a finish ETA label to orders
- `prodq-shorten-material-links`: (new) Shortens material full names into their ticker with a link

### Changed

- `inv-compress-inventory-info`: Move feature to the basic feature set
- `nots-notification-type-label`: Make notification layout more space-efficient in smaller buffer sizes

### Fixed

- `XIT CXTS`: Fix incorrect date display when there is a gap between days

## 25.3.17

### Added

- `contd-condition-address-placeholder`: (new) Sets the current address as the placeholder for the address field of the
  condition editor

### Changed

- `XIT HQUC`: Uncap HQ level
- `XIT REP`: Use planet id in the `BRA` context button

### Fixed

- `XIT GIF`: Fix borked gifs
- `focus-buffers-on-click`: Disable this feature in `HQ` to fix relocation input resetting
- `prun-bugs`: Fix scrollbar gutter in `PROD` taking up space without a scrollbar present

### Removed

- `contd-fill-condition-address`: Superseded by `contd-condition-address-placeholder`

## 25.3.8

### Added

- `contd-fill-condition-address`: (new) Fills the address field in the condition editor
- `highlight-production-order-error`: (new) Highlights production orders with errors in `PROD`, `PRODQ`, and `PRODCO`
- `shipment-item-detail`: Add font auto-sizing

### Fixed

- `prun-bugs`: Fix `CONTD` condition saving issues when amount is not changed
- Fix incorrect bolding of commands in context controls added by Refined PrUn

## 25.2.27

### Fixed

- `XIT SHEET`: Fix parsing Document IDs with underscores
- `inv-compress-inventory-info`: Fix usability issues in smaller tiles and bring back address link

## 25.2.25

### Added

- `XIT CXTS`: Add purchases/sales to the daily summary
- `XIT SHEET`: Add an optional parameter for Sheet ID
- `context-controls-no-hover`: (new) Prevents the context controls from displaying description while hovering over
- `inv-compress-inventory-info`: (new) Compresses specific inventory info into a row
- `prod-hide-percent`: (new) Hides percent value from production lines

### Changed

- `XIT CXTS`: Hide daily summary for days with only a single trade

### Fixed

- `prod-order-eta`: Fix completion time being calculated incorrectly
- `prun-bugs`: Fix material icons in the PROD and PRODQ buffers not being clickable
- Fix duplication of Materials in Transit asset value in Long-Term Materials Receivable

## 25.2.11

### Fixed

- `custom-item-sorting`: Fix "+" button not opening `XIT SORT`
- `mtra-transfer-on-enter`: Fix feature not working for docked tiles
- Fix overlays not showing up

## 25.2.6.1805

### Fixed

- `custom-item-sorting`: Fix several bugs introduced by the previous update

## 25.2.6

### Added

- `XIT CONTS`: Add CONTRIBUTION condition type support
- `mtra-auto-focus-amount`: `MTRA`: Automatically focuses the amount input on buffer open
- `mtra-transfer-on-enter`: `MTRA`: Triggers transfer on Enter and closes the buffer on success

### Changed

- `custom-item-sorting`: Remember the last selected sorting mode
- `nots-clean-notifications`: Add shortening of "X fulfilled condition Y" notifications

## 25.1.28

### Added

- `focus-buffers-on-click`: Focuses buffers on click anywhere, not just the header
- `item-icons`: Add a HCB icon
- `nots-notification-type-label`: Add a label for the RELEASE_NOTES notification type

### Fixed

- `XIT ACT`: Fix the "Missing UI elements" error during MTRA actions
- `shipment-item-detail`: Fix missing destination labels

### Removed

- `mtra-sync-amount-slider`: This feature is now natively implemented in the APEX
- `nots-ship-name`: This feature is now natively implemented in the APEX

## 25.1.19

### Added

- `XIT YAPT`: Opens the Yet Another PrUn Tool website
- `XIT HQUC`: Add HQ level 52

### Changed

- `XIT ACT`: Move group/action type selector inside the edit overlay
- `XIT ACT`: Add validation to some required fields
- `XIT ACT`: Automatically change material tickers to upper-case
- `XIT CALC`: Change color scheme to match APEX one
- `XIT CALC`: Display in minimalist mode

### Removed

- `productivity-through-depression`: Gray profit numbers were retired because even Castillo-Ito thought they were too
  bleak, and that’s saying something

## 25.1.7

### Added

- `XIT DEV`: Add pu-debug switch
- `XIT SET`: Add a "Buffers" tab with custom buffer size configuration
- `auto-resize-buffers`: Automatically resizes a buffer on command change
- `productivity-through-depression`: Promitor's finest

### Changed

- `XIT CONTC`: Add context buttons
- `XIT CONTC`: Display up to 2 decimal places in payment conditions
- `XIT CONTS`: Add context buttons
- `XIT CONTS`: Shorten column names

### Fixed

- `XIT CONTS`: Fix pending condition status detection
- `custom-item-sorting`: Fix sorting shift on initial inventory open
- `sfc-flight-eta`: Fix ETA conflicts if more than one `SFC` tile is open
- Fix default sizes of buffers to match the vanilla ones

### Removed

- `hide-bfrs-button`: It is safe to disable the bottom bar now after molp released a change related to BFRS

## 25.1.5

### Added

- `XIT CMDL`: Command Lists (port of `XIT LIST` from PMMG)
- `hide-ctx-name`: Hides the current context name label (CTX)

### Changed

- `XIT BURN`: Open `INV` with a short inventory id
- `XIT CONTS`: Add more condition status colors
- `XIT SET PMMG`: Add pmmg-lists.json import support
- `lm-clean-ads`: Replace from/to with an arrow in shipping ads
- `lm-clean-ads`: Show the current location in shipping ads
- `mtra-sync-amount-slider`: Prevent setting the amount value on tile load

### Fixed

- `XIT SORT`: Fix numbering of material categories
- `XIT TODO`: Fix due date time zone offset
- `custom-item-sorting`: Fix sorting order shifts
- `lm-clean-ads`: Fix fraction truncation in non-English localizations
- Optimize overall CPU and memory usage

## 24.12.18.2202

### Fixed

- Fix page reload in Firefox when updating from older versions

## 24.12.18

### Added

- `mtra-sync-amount-slider`: `MTRA`: Syncs the "Amount" slider with the input field
- `nots-ship-arrival-inventory`: `NOTS`: Opens ship inventory on "ship arrived" notification click

### Changed:

- `XIT BURN`: Add an expand/collapse all button
- `XIT FIN`: Clarify Quick Assets/Liabilities tooltips
- `screen-tab-bar`: Change the styling of the "hide"/"show" button to look like the "copy" button
- Change the way Refined PrUn integrates into APEX, leading to less CPU usage

### Fixed:

- `XIT BURN`: Fix inf values being filtered out when "green" filter is off
- `XIT BURN`: Fix disappearing table borders on Firefox
- `nots-clean-notifications`: Fix "Component fail to render" error
- `screen-tab-bar`: Fix tab reorder animation
- Fix MM Materials price not being equal to MM Bid price in some places
- Fix new buffers not opening when trying to open an invalid command (like `CO undefined`)
- Optimize CPU usage of `bs-satisfaction-percentage`, `bs-merge-area-stats` and `shipping-per-unit-price`
- Optimize Refined PrUn startup time

## 24.12.12

### Added

- `co-base-count`: `CO`: Displays a base count in the "Bases" label
- `prevent-delete-button-misclicks`: Makes the "delete" button in chats work only when shift is held down
- REPAIR_SHIP condition support in `XIT CONTS` and `XIT CONTC`

### Changed

- `XIT ACT`: Remove the "Stale data" error
- `XIT REP`: Use a natural id instead of a name in planet links
- `search-auto-focus`: Disable in docked tiles

### Fixed

- `XIT ACT`: Fix actions not being able to buy the full required amount of materials
- `table-rows-alternating-colors`: Optimize rendering performance
- Trim spaces when parsing tile commands

## 24.11.29.2317

### Added

- `search-auto-focus`: Auto-focuses the search bar in PLI and SYSI

### Changed

- `XIT BURN`: Show a minus sign for negative values in the Burn column
- `XIT CXTS`: Change time display to hh:mm

### Fixed

- `XIT ACT`: Replace an existing package if an imported package has the same name (for real this time)

## 24.11.29

### Added

- `XIT CONTS`: An icon for contracts that the partner can accept
- `XIT HELP`: PMMG settings import entry
- `XIT HQUC`: Level 51
- `XIT NOTE`: "Create" button if a note is not found
- `XIT TODO`: "Create" button if a task list is not found
- `XIT REP`: `BRA` context button

### Changed

- `XIT ACT`: Replace an existing package if an imported package has the same name
- `XIT CXTS`: Round number to a whole in the Total column
- `XIT REP`: Hide the Target column in single-target `XIT REP`
- `screen-tab-bar`: Make tabs reorderable and add a hide/show button to the screen list
- `header-calculator-button`: Add 1px to top margin
- Apply `FLT`-related features to `FLTP` and `FLTS` as well

### Fixed

- `XIT ACT`: Fix manual material group overwriting on execute
- `XIT ACT`: Fix the "Source inventory not found" error for planets
- `XIT CHAT`: Fix username overflow
- `XIT NOTE`: Fix notes with material tickers not being able to render
- `inv-search`: Fix the search bar styling
- Fix context controls duplication in `XIT` commands on tile move

## 24.11.25

### New commands

- `XIT CONTC`: Pending Contract Conditions
- `XIT CXTS`: Commodity Exchange Trades
- `XIT FINBS`: Balance Statement
- `XIT GIF`: Random GIF (The main reason for this one is `XIT GIF CORGI`)
- `XIT HQUC`: HQ Upgrade Calculator
- `XIT MATS`: Material list
- `XIT WEB`: Open any web page (Pro tip! Try `XIT WEB https://www.youtube.com/embed/dQw4w9WgXcQ`)

### Added

- `BS`: Building list summary.
- `FINLA`: New columns with liquid assets - CX/FX Deposits and MM Materials.
- `FLT`: Ship condition label.
- `INV`: Reverse sorting for custom sorting modes.
- `LM`: Commodity and shipment icons.
- `XIT BURN`: New column with context buttons: `BS` and `INV` for planets, `CXM` for materials.
- `XIT CONTS`: Inbox icon in contracts that the player can accept.
- `XIT CONTS`: SHPT icon in contracts with shipment condition.
- `XIT FINCH`: Equity History Chart smoothing with SMA.
- `XIT FINPR`: New columns - Repairs and Margin (Profit / Revenue).
- `XIT SET`: Currency symbol customization.
- `XIT REP`: New columns in the material table - Weight, Volume, and Cost.
- Destination labels for SHPT and BLCK items.
- Auto-capitalization of a material ticker for commands: `CXM`, `CXOB`, `CXP`, `CXPC`, `CXPO`, `MAT`.
  For example: `CXPO h2o.ai1` will change to `CXPO H2O.AI1` when you hit Enter.
- System name replacement for system commands (`FLTS`, `INF`, `MS`, and `SYSI`).
- Ship name replacement for ship commands (`SFC`, `SHP`, `SHPF`, `SHPI`, and `SI`).
- Compatibility with non-English localizations.

### Changed

- `CONTD`: Partner search results are shown above the search bar.
- `FINLA`: ECD row is hidden.
- `LM`: Ads are more compact.
- `LM`: Rating icon is hidden.
- `LM`: BUYING/SELLING ads are highlighted in green/red.
- `LM`: Own orders are highlighted (like own orders in `CXOB`).
- `INV`: Changed BRN sorting to favor outputs over inputs/consumables, and inputs over consumables.
- `INV`: Enhanced CAT material sorting for consumables, prefabs, and SHPT items.
- `MAT`: Material category is clickable and opens `XIT MATS` with material category.
- `XIT BURN`: Works without `ALL` parameter.
- `XIT BURN`: Rows are denser.
- `XIT BURN`: Changed sorting to days remaining (ascending).
- `XIT BURN`: `Additional Days` setting is changed to `Resupply`, representing total days for resupply.
- `XIT CALC`: Changed to https://desmos.com/scientific.
- `XIT CHECK`: Changed to `XIT TODO`.
- `XIT CONTS`: Changed sorting in the opposite direction, with the newest contracts being at the top of the list.
- `XIT FIN_CHARTS`: Changed to `XIT FINCH`.
- `XIT FINCH`: Equity history chart shows only the latest point per day.
- `XIT FIN_PRODUCTION`: Changed to `XIT FINPR`.
- `XIT FIN_SET`: Changed to `XIT SET FIN`.
- `XIT FIN_SUMMARY`: Changed to `XIT FIN`.
- `XIT FIN`: Changed Key Figures. Check the tooltips for more info.
- `XIT SHEETS`: Displays Google Sheets in minimalist mode.
- Clicking on the APEX logo opens player company information.
- Prices are calculated with VWAP formula over all exchanges, leading to more stable equity values.
- Equity includes ships, HQ upgrades, and APEX Representation Center. A new "Liquidation Value"
  metric is added to represent the old equity metric.
- Blocked/Shipped materials are included in assets.
- Materials in "Pick up shipment" contract condition are included in assets.
- Materials requests in faction contracts are included in liabilities.
- Materials rewards in faction contracts are included in assets.
- Materials in not yet started shipyard projects are included in assets.
- Materials for buildings are gradually depreciated when counted towards total asset value.
- Input/output materials and fee in production orders are included in assets.
- Debt interest is only counted as a liability if it is due in current period (deadline <7d).
- `CONT` button on the left sidebar pulsates when there are contracts yet to be accepted.
- Font size of material amount labels is 1px bigger.
- Input fields with math support don't require a '=' sign at the beginning.
- Input fields with math support show a math icon when focused.
- Input fields with math support evaluate formulas on Tab press in addition to Enter.
- All XIT commands support spaces between parameters.
- "User deleted this message" messages are hidden in chats.
- More planet commands (like `INV`) support planet names.
- Tile controls are always visible.
- Table rows alternate color between odd and even rows.
- The close button is hidden on single tile windows where it does nothing.
- Changed chart library to Chart.js, with Firefox support.
- Unnamed planets in named systems are displayed like in vanilla PrUn (system name + letter).

### Fixed

- `NOTS`: Fixed text wrapping when the notification type label is present.
- Fixed floating point number rounding after math evaluation.

### Removed:

- Pricing scheme selection.
- Old `XIT FIN` landing page, in favor of context buttons.
- Refresh button of XIT buffers.
- `XIT INV`
- `XIT LIST`
