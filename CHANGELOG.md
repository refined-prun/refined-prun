New features:
- XIT CXOS
- XIT CONTC
- reload-page-on-websocket-disconnect
- correct-material-command
- SHPT and BLCK icons now have a destination label on them
- XIT CONTS now displays a ! mark for contracts with unfulfilled own conditions
- XIT CONTS now displays SHPT for contracts with shipment condition
- Clicking on APEX logo now opens company information
- BURN redesign
- BUYING/SELLING LM ads are now highlighted green/red
- LM remove redundant info
- FINLA now shows CX and FX deposits in addition to cash
- XIT FINBS
- XIT HQUC - HQ Upgrade Calculator
- XIT REP now shows a weight/volume/cost table
- Building list with building count in BS buffer

Changes:
- XIT command renames: // TODO
- Implemented the real-time updates of XIT buffers and added features. Goodbye refresh button!
- Changed chart library to Chart.js, reducing the size of the plugin. Works on Firefox too!
- Changed XIT calculator to https://desmos.com/scientific
- Changed custom math evaluator to https://github.com/bugwheels94/math-expression-evaluator

Fixes:
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
- Properly intercept all PrUn server-client messages, preventing data loss
- Reduced the amount of UI updates
- Improved UI responsiveness
- remove-mobile-css-rules

---

Known bugs:
- COM button in the sidebar DOES NOT BlINK on new messages. Open COM buffer directly to check for new messages.
- LM ad list will display incorrect data if an ad added/removed/accepted. Please reopen the screen with LM on change
- FLT ship status can be wonky sometimes

Removed features:
- Custom pricing scheme from Google Sheets for XIT FIN
