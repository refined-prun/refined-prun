New features:
- XIT CXOS
- reload-page-on-websocket-disconnect
- correct-material-command
- SHPT icons now have a destination label on them
- XIT CONTS now displays a ! mark for contracts with unfulfilled own conditions
- XIT CONTS now displays SHPT for contracts with shipment condition
- Clicking on APEX logo now opens company information
- BURN redesign
- BUYING/SELLING LM ads are now highlighted green/red
- LM remove redundant info
- FINLA now shows CX and FX deposits in addition to cash
- XIT FINBS
- XIT HQUC - HQ Upgrade Calculator

Changes:
- Implemented the real-time updates of XIT buffers and added features. Goodbye refresh button!
- Changed chart library to Chart.js, reducing the size of the plugin. Works on Firefox too!
- Changed XIT calculator to https://desmos.com/scientific
- Changed custom math evaluator to https://github.com/bugwheels94/math-expression-evaluator

Fixes:
- Various fixes to XIT FIN balance calculations:
  - FXOS deposit value now counted by remaining amount, instead of initial amount
  - Blocked/Shipped materials are now included in assets
  - Materials in "Pick up shipment" contract condition are now included in assets
  - Materials requests in faction contracts are now included in liabilities
  - Materials rewards in faction contracts are now included in assets
- Properly intercept all PrUn server-client messages, preventing data loss
- Reduced the amount of UI updates
- Improved UI responsiveness
- remove-mobile-css-rules

---

Known bugs:
- LM ad list will display incorrect data if an ad added/removed/accepted. Please reopen the screen with LM on change
- XIT FIN shows null for stations
- FLT ship status can be wonky sometimes

Removed features:
- Custom pricing scheme from Google Sheets for XIT FIN
