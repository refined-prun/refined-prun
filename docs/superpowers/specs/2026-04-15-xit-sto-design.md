# XIT STO — Storage Analysis Buffer

## Context

PrUn offers `INV` to browse inventory and `WAR` for rented warehouses, but nothing that answers the two storage-planning questions players actually ask:

1. **How long until this base is full?** Production outputs pile up in base storage until a ship picks them up. Players currently eyeball this from `INV`.
2. **How often does a ship of size X need to visit?** This is the "visitation frequency" planners care about — delivery cadence for inputs, pickup cadence for outputs.

The external tool [prun-planner](https://prun-planner.space) shows a compact storage + visitation panel per base (reference screenshot in brainstorming history). rprun already adds the BURN buffer for supply days; STO is the complementary "when will I run out of room?" buffer.

Originally explored as a colored stripe on BURN planet headers; that was too cramped and out of scope for BURN's "days of supply" purpose. Separate buffer is the right home.

## Goal

New XIT buffer `XIT STO` (alias `XIT STORAGE`) that, for each of the player's bases:

- Shows fill %, days-until-full (at current net production), binding limit (weight or volume) at the collapsed header
- Expands to a prun-planner-style detail panel: import/export rate breakdown plus ship-size visitation table computed from the player's actual fleet

Accepts an optional planet natural ID: `XIT STO UV-351b` opens expanded to that base only.

## Non-goals (v1)

- Overall aggregate across all bases — storage is per-base, no meaningful sum
- Per-material "exclude from visitation" toggle (prun-planner's Select Options feature)
- Factoring in-flight shipments or rented warehouses into projections
- Persisting user UI preferences (expand state, etc.) — use tile-state pattern; don't add new userData settings
- Replacing BURN — they answer different questions and are kept separate

## Architecture

### File layout

Mirrors `src/features/XIT/BURN/`:

```
src/features/XIT/STO/
  STO.ts              xit.add() registration
  STO.vue             top-level, iterates site analyses
  BaseSection.vue     wraps a base (collapsible wrapper around header + expanded detail)
  BaseHeader.vue      collapsed row
  BaseDetail.vue      expanded panel (contains StorageTable + VisitationTable)
  StorageTable.vue    t/m³ Import/Export/Σ table (left side of prun-planner layout)
  VisitationTable.vue ship-size × import/export frequency table (right side)
  tile-state.ts       per-tile expand/collapse + parameter filter state
  utils.ts            helpers (formatters, binding-limit logic)
```

### Data layer

New module `src/core/storage-analysis.ts` (sibling to `burn.ts`). Same pattern: a `computed` map keyed by siteId, each producing a `BaseStorageAnalysis`.

```ts
export interface BaseStorageAnalysis {
  siteId: string;
  storeId: string;
  planetName: string;
  naturalId: string;

  // Current storage state (sourced from the 'STORE' typed entry of storagesStore.getByAddressableId)
  weightCapacity: number;
  weightLoad: number;
  volumeCapacity: number;
  volumeLoad: number;

  // Daily rates in tonnes and m³, aggregated across all consumed/produced materials
  importWeight: number;   // Sum over consumed materials: dailyConsumption × material.weight
  importVolume: number;
  exportWeight: number;   // Sum over produced materials: dailyOutput × material.weight
  exportVolume: number;

  // Derived
  fillPercentWeight: number;   // weightLoad / weightCapacity
  fillPercentVolume: number;   // volumeLoad / volumeCapacity
  daysUntilFull: number;       // Infinity if net production ≤ 0 in both dimensions
  bindingLimit: 't' | 'm³' | undefined; // which dimension caps days-until-full; undefined if ∞
}

export function getBaseStorageAnalysis(siteOrId?: PrunApi.Site | string | null):
  BaseStorageAnalysis | undefined;
```

#### Calculation

Reuses the same production/workforce iteration pattern from `core/burn.ts::calculatePlanetBurn`:

1. For each `ProductionLine` at the site, iterate its recurring orders:
   - `output` materials contribute to **exportDaily**: `(amount × capacity / totalDuration)`
   - `input` materials contribute to **importDaily**
2. For each workforce tier (skip bugged ≤1 pop, skip demolished 0-capacity), each `need` contributes to **importDaily** at `unitsPerInterval`
3. Multiply per-ticker daily amounts by `material.weight` and `material.volume` (lookup via `materialsStore.getByTicker`) and sum into the four scalar fields
4. `storage = storagesStore.getByAddressableId(siteId)?.find(x => x.type === 'STORE')` for capacity/load. If no STORE, the analysis is `undefined` (no base yet or data not loaded)

#### Days-until-full

```ts
const availableWeight = weightCapacity - weightLoad;
const availableVolume = volumeCapacity - volumeLoad;
const netWeight = exportWeight - importWeight;
const netVolume = exportVolume - importVolume;

const daysW = netWeight > 0 ? availableWeight / netWeight : Infinity;
const daysV = netVolume > 0 ? availableVolume / netVolume : Infinity;
const daysUntilFull = Math.min(daysW, daysV);
const bindingLimit = daysUntilFull === Infinity ? undefined : daysW < daysV ? 't' : 'm³';
```

A base whose net flow in both dimensions is ≤0 shows "∞" — storage is draining, not filling.

### Visitation frequency

In `VisitationTable.vue`, for each owned ship with capacities `(shipT, shipM3)`:

```ts
// Export = outbound trip picking up products; how often before output buffer fills ship-capacity
const expDaysT = exportWeight > 0 ? shipT  / exportWeight : Infinity;
const expDaysV = exportVolume > 0 ? shipM3 / exportVolume : Infinity;
const exportFreq = Math.min(expDaysT, expDaysV);
const exportLimit = expDaysT < expDaysV ? 't' : 'm³';

// Import = inbound trip with inputs; how many days a shipload covers
const impDaysT = importWeight > 0 ? shipT  / importWeight : Infinity;
const impDaysV = importVolume > 0 ? shipM3 / importVolume : Infinity;
const importFreq = Math.min(impDaysT, impDaysV);
const importLimit = impDaysT < impDaysV ? 't' : 'm³';
```

### Fleet lookup

`shipsStore` (`src/infrastructure/prun-api/data/ships.ts`) returns `Ship` entities. **Ships don't carry cargo-capacity fields directly** — capacity lives on the ship's store. For each ship:

```ts
const shipStore = storagesStore.getById(ship.idShipStore);
const shipT  = shipStore?.weightCapacity;
const shipM3 = shipStore?.volumeCapacity;
```

Dedup ship entries by `(shipT, shipM3)` pair so a fleet of three identical ships collapses to one row. Sort by weight-capacity ascending. If the player owns zero ships (or none of their ships have resolvable stores), hide the Visitation table and show a small "No ships in fleet" hint inline.

### Registration

```ts
// STO.ts
xit.add({
  command: ['STO', 'STORAGE'],
  name: params => params[0] ? `Storage — ${params[0]}` : 'Storage Analysis',
  description: 'Per-base storage analysis: fill %, days-until-full, ship visitation frequency.',
  optionalParameters: 'PLANET',
  component: _ => STO,
  bufferSize: [720, 500],
  contextItems: params => params[0] ? [{ cmd: `BS ${params[0]}`, label: 'Base' }] : [],
});
```

Parameter handling: if `params[0]` is set, resolve via `sitesStore.getByPlanetNaturalIdOrName(params[0])` (same helper used by BURN and PROD — accepts both natural IDs like `JS-299b` and planet names like `Gibson`). Filter to that site and auto-expand. If the parameter doesn't resolve to any site, show "No base matches '<param>'".

## Components

### STO.vue (top level)

Iterates `sitesStore.all.value`, maps each site to `getBaseStorageAnalysis(site)`, filters out `undefined`, sorts by `daysUntilFull` ascending (most urgent first; ∞ sinks to bottom). Renders one `<BaseSection>` per base.

Applies the parameter filter before mapping.

### BaseSection.vue

Mirrors `BurnSection.vue`. Holds expand/collapse state via `useTileState('expand')` — array of naturalIds, toggles on header click. When `XIT STO <planet>` is invoked, that planet starts expanded.

### BaseHeader.vue (collapsed row)

Shown whether expanded or not. Columns:

| Col | Content |
|-----|---------|
| Toggle | `+` / `-` icon |
| Planet | planet name |
| Fill % | `max(fillPercentWeight, fillPercentVolume)` with color stripe (daysMissing/daysWarning/daysSupplied thresholds — configurable in v2, hardcode 80%/95% for v1) |
| Days | `daysUntilFull` formatted (`∞` above 1000, floor otherwise) — reuse `DaysCell.vue` pattern from BURN for colored cell background |
| Limit | `t` or `m³` badge showing which dimension is binding |
| Actions | `BS <naturalId>` and `INV <storeId[0:8]>` buttons |

### BaseDetail.vue (expanded)

Two side-by-side tables wrapped in a flex row. On narrow bufferSize, wrap to stack.

#### StorageTable.vue

Matches prun-planner left panel:

```
Your base has a storage capacity of N t and M m³

             t              m³
Import       importWeight   importVolume
Export       exportWeight   exportVolume
Σ (net)      netWeight      netVolume      (color: positive red, negative green — filling is bad)
-----------------------------------------------
Storage Filled                daysUntilFull days
```

#### VisitationTable.vue

Matches prun-planner right panel. Header row covers both halves ("Export Frequency" over left half, "Import Frequency" over right). One row per unique fleet ship capacity:

```
Ship t | Ship m³ | Export days | Limit | Import days | Limit
500      500       1.38          t       2.95          m³
1,000    1,000     2.77          t       5.91          m³
...
```

Infinity entries render as `∞`. Zero-rate dimensions render their other dimension only.

### utils.ts

```ts
export function formatBindingLimit(limit: 't' | 'm³' | undefined): string;
// Shared formatters — reuse src/utils/format (fixed0, fixed01, fixed2)
```

## UX details

- **Color stripe** on BaseHeader fill % reuses `C.Workforces.daysSupplied/daysWarning/daysMissing` classes (same palette as BURN). Thresholds: green if `max(fillW, fillV) < 0.8`, yellow 0.8–0.95, red ≥ 0.95. Hardcoded for v1 per brainstorming decision.
- **Tooltips**: data-tooltip on Fill % cell showing `Wt: X% · Vol: Y%`. data-tooltip on Limit cell showing the numeric days value for the non-binding dimension.
- **Empty state**: if the player has no bases, show "No bases yet" centered in the tile. If a parameter doesn't match any base, show "No base matches '<param>'".
- **Reactivity**: Everything derives from `sitesStore`, `storagesStore`, `productionStore`, `workforcesStore`, `materialsStore`, `shipsStore` — which are already reactive. No manual refresh logic needed.

## Files to create

- `src/core/storage-analysis.ts`
- `src/features/XIT/STO/STO.ts`
- `src/features/XIT/STO/STO.vue`
- `src/features/XIT/STO/BaseSection.vue`
- `src/features/XIT/STO/BaseHeader.vue`
- `src/features/XIT/STO/BaseDetail.vue`
- `src/features/XIT/STO/StorageTable.vue`
- `src/features/XIT/STO/VisitationTable.vue`
- `src/features/XIT/STO/tile-state.ts`
- `src/features/XIT/STO/utils.ts`

## Files to reuse (no modification)

- `src/infrastructure/prun-api/data/sites.ts` — `sitesStore.getByPlanetNaturalIdOrName`, `.all`
- `src/infrastructure/prun-api/data/storage.ts` — `storagesStore.getByAddressableId`
- `src/infrastructure/prun-api/data/materials.ts` — `materialsStore.getByTicker`
- `src/infrastructure/prun-api/data/production.ts` — `productionStore.getBySiteId`
- `src/infrastructure/prun-api/data/workforces.ts` — `workforcesStore.getById`
- `src/infrastructure/prun-api/data/ships.ts` — `shipsStore.all.value` for owned fleet (ship cargo capacity via `storagesStore.getById(ship.idShipStore)`)
- `src/core/orders.ts` — `getRecurringOrders` for production-line input/output iteration
- `src/components/PrunButton.vue` — BS/INV buttons
- `src/features/XIT/BURN/DaysCell.vue` — color-coded days cell pattern (may be factored into a shared component if used verbatim, otherwise copy the 20-line implementation into a STO-local `DaysCell.vue` to avoid cross-XIT coupling)

## Verification

1. `pnpm run compile` — tsc clean
2. `pnpm run build` — builds without warnings
3. `pnpm exec eslint src/features/XIT/STO src/core/storage-analysis.ts` — no errors
4. In-game (load `dist/` as unpacked extension):
   - Open `XIT STO` → all bases listed, most-urgent first
   - Expand a production base → StorageTable shows Import/Export/Σ matching what `INV` implies; VisitationTable shows one row per owned ship
   - Collapse/expand persists within the tile
   - `XIT STO JS-299b` and `XIT STO Gibson` both open with only that base, pre-expanded (natural ID and planet name both work)
   - Base with purely consuming (no production outputs) → days-until-full = ∞, ok
   - Player with zero ships → VisitationTable hidden with "No ships in fleet" hint
   - Base with no STORE yet (brand new) → row skipped, not crashed
5. Verify reactivity: while `XIT STO` is open, buy/sell on CXM or start a production line → numbers update without reopening the buffer.

## Out-of-scope follow-ups

- Persistable user-selected ship sizes (in addition to fleet)
- Per-material exclusion toggle matching prun-planner's "Select Options"
- Include rented warehouses + in-flight shipments in current-load accounting
- Cross-base aggregate ("Overall" row)
- Linking to a shipment planner (XIT SHPT integration)
- Configurable fill-% color thresholds in userData.settings
