# Changelog

## Unreleased

### Added

- `XIT ACT`: Add a Refuel action

### Fixed

- `other-context-notification-count`: Fox notification count sometimes including deleted notifications

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
- Equity includes ships, HQ upgrades and APEX Representation Center. A new "Liquidation Value"
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
