## New commands
- `XIT CXTS`: Commodity Exchange Orders
- `XIT FINBS`: Balance Statement
- `XIT HQUC`: HQ Upgrade Calculator
- `XIT CONTC`: Pending Contract Conditions
- `XIT WEB`: Open any web page (Pro tip! Try `XIT WEB https://www.youtube.com/embed/dQw4w9WgXcQ`)

## New features
- `CONTD` partner search results show above the search bar
- `SHPT` and `BLCK` icons show a destination label on them
- `FINLA` shows CX and FX deposits in addition to cash
- `XIT CONTS` displays a ! mark for contracts with unfulfilled own conditions
- `XIT CONTS` displays `SHPT` for contracts with shipment condition
- `LM` BUYING/SELLING ads are highlighted green/red
- Clicking on APEX logo opens player company information
- `XIT REP` shows a weight/volume/cost table
- `BS` shows building list summary at the bottom
- Material ticker is auto-capitalized on input when entering the following commands:
  `CXM`, `CXOB`, `CXP`, `CXPC`, `CXPO`, `MAT`. For example: `CXPO h2o.ai1` will change
  to `CXPO H2O.AI1` when you hit Enter.

## Changed
- `XIT FIN` is split in several commands
  - `XIT FIN`: Financial overview
  - `XIT FINCH`: Financial Charts
  - `XIT FINPR`: Profitability Report
  - `XIT FIN_SET` is changed to `XIT SET FIN`
  - Old `XIT FIN` landing page was removed in favor of context buttons
- `XIT SHEETS` are now displayed in minimalist mode
- `XIT BURN` got additional features:
  - Total load of all needed resources
  - Total cost of all needed resources
  - Context buttons: `BS` and `INV` for planets, `CXM` for materials
- `LM` ads are now more compact and show commodity/shipment icons
- New and old UIs now use vanilla PrUn styling where possible
- All XIT commands now accept up to 3 space-separated arguments
- Implemented the real-time updates of XIT buffers and added features. Goodbye refresh button!
- Changed chart library to Chart.js, reducing the size of the plugin. Works on Firefox too!
- Changed XIT calculator to https://desmos.com/scientific
- Changed custom math evaluator to https://github.com/bugwheels94/math-expression-evaluator

## Fixed
- Various fixes to XIT FIN balance calculations:
  - Blocked/Shipped materials are now included in assets
  - Materials in "Pick up shipment" contract condition are now included in assets
  - Materials requests in faction contracts are now included in liabilities
  - Materials rewards in faction contracts are now included in assets
  - Materials in not yet started shipyard projects are now included in assets
  - Materials for buildings are now gradually depreciated when counted towards total asset value
  - Input/output materials and fee in production orders are now included in assets
  - Debt interest is only counted as a liability if it is due in current period (deadline <7d)
    - Debt principal is still counted in full size, regardless of the deadline
- Unnamed planets in named systems are now displayed like in PrUn (system name + letter)
- The extension now aggressively intercepts all PrUn server-client messages,
  reducing the chance of data loss or out-of-date data
- The amount of UI updates was reduced, this should lead to better FPS

---

Known bugs:
- COM button in the sidebar DOES NOT BlINK on new messages. Open COM buffer directly to check for new messages.
- LM ad list will display incorrect data if an ad added/removed/accepted. Please reopen the screen with LM on change
- FLT ship status can be wonky sometimes

Removed features:
- Custom pricing scheme from Google Sheets for XIT FIN
