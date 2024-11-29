## Unreleased

### Added

- `XIT CONTS`: An icon for contracts that the partner can accept
- `XIT HELP`: PMMG settings import entry
- `XIT HQUC`: Level 51
- `XIT NOTE`: "Create" button if a note is not found
- `XIT TODO`: "Create" button if a task list is not found
- `XIT REP`: `BRA` context button

### Changed

- `XIT ACT`: Replace an existing package if an imported package has the same name
- `XIT CXTS`: Round number to whole in the Total column
- `XIT REP`: Hide the Target column in single-target `XIT REP`
- Add 1px to top margin of calculator header button
- Apply `FLT`-related features to `FLTP` and `FLTS` as well

### Fixed

- `XIT ACT`: Fix manual material group overwriting on execute
- `XIT ACT`: Fix "Source inventory not found" error for planets
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
