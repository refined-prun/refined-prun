## New commands
- `XIT CXTS`: Commodity Exchange Trades
- `XIT FINBS`: Balance Statement
- `XIT HQUC`: HQ Upgrade Calculator
- `XIT CONTC`: Pending Contract Conditions
- `XIT MATS`: List all materials (with filtering via parameters)
- `XIT WEB`: Open any web page (Pro tip! Try `XIT WEB https://www.youtube.com/embed/dQw4w9WgXcQ`)
- `XIT GIF`: Random GIF (The main reason for this one is `XIT GIF cats`)
- `XIT FIN` is divided into multiple commands:
  - `XIT FIN`: Financial Overview
  - `XIT FINCH`: Financial Charts
  - `XIT FINPR`: Profitability Report
  - `XIT FIN_SET` is changed to `XIT SET FIN`
  - Old `XIT FIN` landing page was removed in favor of context buttons

## New features
- `CONTD` partner search results are shown above the search bar.
- `SHPT` and `BLCK` icons display a destination label.
- Material ticker auto-capitalizes inputs for commands: `CXM`, `CXOB`, `CXP`, `CXPC`, `CXPO`, `MAT`.
  For example: `CXPO h2o.ai1` will change to `CXPO H2O.AI1` when you hit Enter.
- Clicking on the APEX logo now opens player company information.
- `XIT BURN` now includes context buttons: `BS` and `INV` for planets, `CXM` for materials.
- `XIT FINPR` displays Repairs and Margin (Profit / Revenue).
- `XIT FINCH` Equity History chart now applies smoothing via SMA.
- `FINLA` shows CX and FX deposits in addition to cash.
- `XIT CONTS` displays a ! mark for contracts with unfulfilled own conditions.
- `XIT CONTS` displays `SHPT` for contracts with shipment condition.
- `LM` BUYING/SELLING ads are highlighted green/red.
- Material category in `MAT` is clickable and opens `XIT MATS` with material category.
- Own `LM` orders are highlighted.
- `LM` ads are more compact, showing commodity/shipment icons.
- `XIT REP` shows a weight/volume/cost table.
- `BS` displays a building list summary at the bottom.
- `XIT NOTE` list is now reorderable.
- Table rows now alternate color between odd and even rows.
- Added compatibility with non-English localizations.

## Changed
- Prices are now calculated using the following method (falling back if data is unavailable):
  UNIVERSE_VWAP7D => UNIVERSE_VWAP30D => UNIVERSE_AVG => UNIVERSE_ASK => UNIVERSE_BID
- Equity now includes ships, HQ upgrades and APEX Representation Center. A new "Liquidation Value"
  metric was added to represent the old equity metric.
- `XIT FIN` Key Figures were changed:
  - Liquid Assets are replaced with Quick Assets. Quick Assets are: Cash and Cash Equivalents,
    Current Accounts Receivable, and Current Loans Receivable. These assets are either
    liquid or close-to-liquid and are used in Acid-Test Ratio calculation.
  - Fixed Assets were removed.
  - Current and Quick Liabilities are added. Quick Liabilities are: Current Accounts Payable
    and Current Loans Payable. These liabilities represent immediate financial obligations
    and are used in Acid-Test Ratio calculation.
  - Company Value is added.
  - 4 new financial ratios are added. Look them up if you don't know them!
- `XIT SHEETS` now display in minimalist mode.
- `XIT BURN` is more dense now.
- The `Additional Days` `XIT BURN` setting was changed to `Resupply`, representing total days for resupply.
- `INV` Burn material sorting was changed to favor outputs over inputs/consumables and inputs
  over consumables.
- Equity history chart now shows only the latest point per day.
- `XIT NOTE` notes are not deleted when empty.
- Font size of material amount labels is 1px bigger.
- Input fields with math support don't require a '=' sign at the beginning.
- Input fields with math support show a math icon.
- New and old UIs now use vanilla PrUn styling where possible.
- All XIT commands accept up to 3 space-separated arguments.
- Real-time updates for XIT buffers implemented, removing the need for refresh button.
- Switched chart library to Chart.js, reducing plugin size and adding Firefox support.
- `XIT CALC` changed to https://desmos.com/scientific

## Fixed
- Various fixes to XIT FIN balance calculations:
  - Blocked/Shipped materials are now included in assets.
  - Materials in "Pick up shipment" contract condition are now included in assets.
  - Materials requests in faction contracts are now included in liabilities.
  - Materials rewards in faction contracts are now included in assets.
  - Materials in not yet started shipyard projects are now included in assets.
  - Materials for buildings are now gradually depreciated when counted towards total asset value.
  - Input/output materials and fee in production orders are now included in assets.
  - Debt interest is only counted as a liability if it is due in current period (deadline <7d).
    - Debt principal is still counted in full size, regardless of the deadline.
- Unnamed planets in named systems are now displayed like in vanilla PrUn (system name + letter).
- The extension now aggressively intercepts all PrUn server-client messages,
  reducing the chance of data loss or out-of-date data.
- The amount of UI updates was reduced, this should lead to better FPS.

---

Known bugs:
- On PMMG setting import, selected inventory filters are reset. The filters themselves are imported properly, 
  so just select them again in `INV`.
- `XIT NOTE` now uses ids, so your existing `XIT NOTE` buffers will fail to open.
  You will need to reopen them from the main note list.
- COM button in the sidebar DOES NOT BLINK on new messages. Open COM buffer directly to check for new messages.

Removed features:
- `XIT INV`.
- Custom pricing scheme from Google Sheets for `XIT FIN`.
