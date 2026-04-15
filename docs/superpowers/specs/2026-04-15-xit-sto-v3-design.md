# XIT STO v3 — CargoBar Redesign

## Context

v2 shipped a 7-column numeric table. Visual review feedback:

- Low data density; columns waste tile width
- Three fill percentages compete for attention; the eye parses left-to-right three times
- Solid-block color stripe on Fill-After-Resupply is noisy across many rows
- Binding-Limit column (t/m³) is data-sparse
- Storage Filled days value is hidden in the expanded view

User proposed borrowing the stacked-category `CargoBar` from PR #172 (XIT FLT) and showing two CargoBars side by side per base: one for current inventory, one for the projected state after a full resupply rotation (ship out produced goods + deliver consumables up to Need).

## Goals

Replace v2's 7-column layout with a 4-column layout:

```
│ Planet │ Current Fill (CargoBar) │ After Resupply (CargoBar) │ Days │ CMD │
```

- Both CargoBars use PR #172's stacked-category visual. Same thickness, side by side.
- Days column shows the "days until needed visit" number only; binding dimension (t/m³) moves into the cell's tooltip.
- Left-edge per-row stripe (3px) replaces the full-cell color background for the resupply-fit signal.
- Column header tooltips get PrUn's ⓘ icon via the existing `Tooltip` component (same idiom BURN uses for Burn/Need headers).

Expanded view is simplified to the VisitationTable only (Storage / Import / Export / Σ table dropped — CargoBars convey that visually now).

## CargoBar adoption from PR #172

PR #172 (`xit-flt`, author agm-114) is not yet merged. We cherry-pick `CargoBar.vue` and its dependencies onto this branch now, acknowledging a future merge conflict when #172 lands.

### Files to cherry-pick from PR #172

- `src/features/XIT/FLT/CargoBar.vue` — the component
- Any helpers CargoBar imports that don't already exist on `main`:
  - `getMaterialCategoryCssClass` / `CATEGORY_CSS_PREFIX` in `@src/infrastructure/prun-ui/item-tracker` — **verify presence on main before cherry-pick**; if already there, skip
  - `materialCategoriesStore` in `@src/infrastructure/prun-api/data/material-categories` — same

If any FLT-specific logic is entangled (e.g., ship-only assumptions), **refactor CargoBar into a generic form that accepts a `Store` rather than a `shipId`**. The component should take `storeId: string | null` or the store object directly, not reach into `shipsStore` itself. This is the minimum viable generalization — doesn't force major refactor but lets STO use it unchanged on bases.

After #172 merges, rebase STO's use of CargoBar on the landed version.

### Minor modifications to CargoBar for generalization

- **Input generalization**: CargoBar currently takes `shipId` and reaches into `shipsStore`. Change to take `store: PrunApi.Store | null | undefined` directly. Callers resolve the store. FLT passes `storagesStore.getById(ship.idShipStore)`; STO passes its own store (real or synthetic).
- **Click behavior**: Make the click handler an optional prop. FLT passes `() => showBuffer('SHPI ' + registration)`; STO omits it. If omitted, the root div gets `cursor: default` and no onClick.
- **Overflow visual**: Add an optional behavior for stores whose load exceeds capacity (the synthetic After-Resupply case). When `totalRatio = max(wLoad/wCap, vLoad/vCap) > 1`:
  - Category segments still render with their true weight/volume values, but are **scaled by `1 / totalRatio`** so they collectively occupy the first `100% / totalRatio` of the bar width.
  - A final red-hatched "overflow" segment of width `(totalRatio - 1) / totalRatio × 100%` caps the bar on the right.
  - Result: total bar stays at 100% width (fits its cell), but a proportional red zone is visible at the end indicating "this much over capacity."
  - For `totalRatio ≤ 1`, behavior is unchanged — no overflow segment.
- **Animation-on-change**: keep as-is.

### StorageBar computation (the "After Resupply" bar)

We can't just reuse CargoBar directly for the After-Resupply bar because the inventory doesn't really exist yet. Option: compute a synthetic `Store` object whose `items` match the projected state:

```
for each ticker in planetBurn.burn:
  if dailyAmount >= 0 (producing):
    // exclude from the projected inventory — it's shipped out
    skip
  currentInv = mb.inventory
  need = computeNeed(mb, resupply)
  projectedAmount = currentInv + need
  push synthetic StoreItem { quantity: { material: mat, amount: projectedAmount }, weight: ..., volume: ... }
```

Pass the synthetic store to CargoBar. The component sees it like any other inventory and renders segments.

**Caveat**: CargoBar's segment math bases `divisor` on `weightCapacity` or `volumeCapacity`. If projected amount exceeds capacity, segments sum past 100% and visibly overflow — that's the exact signal we want. No extra overlay needed.

If overflow rendering is ugly, we add a clipped-edge visual treatment later.

## Four-column layout

### 1. Planet

Unchanged — planet name + minimize toggle. Click toggles expand.

### 2. Current Fill (CargoBar)

Reuses CargoBar against the base's STORE inventory. Pass the `storeId` of the base's STORE (from existing `BaseStorageAnalysis.storeId`). Click on the bar is a no-op for STO — `CargoBar`'s click-to-INV behavior is made optional via a prop; STO passes nothing. Expand/collapse happens via clicking the Planet cell (established idiom).

### 3. After Resupply (CargoBar)

Reuses CargoBar against a synthetic `Store` computed per-render. Click no-op (same rationale as Current Fill bar).

### 4. Days

One number plus ⓘ header. Cell content: `formatDays(daysUntilFull)`. Cell tooltip: `Weight is the binding limit.` or `Volume is the binding limit.` or `Storage draining — not filling.` (same three strings we already compute in v2's `limitTooltip`).

### 5. CMD

Keep both BS and INV buttons. The CargoBar click-to-INV is a nice shortcut but it's not discoverable — users will scan the CMD column for entry points. Keeping the buttons means both paths work. No horizontal cost; BS+INV is already the idiom in BURN.

## Left-edge row stripe

A 3px bar on the row's left edge, colored by the projected-fill state:

- `needFillRatio > 0.95` → red (`C.Workforces.daysMissing` palette)
- `> 0.80` → yellow (`C.Workforces.daysWarning`)
- `≤ 0.80` → green (`C.Workforces.daysSupplied`)
- undefined (nothing to deliver) → no stripe

Implemented as an absolutely-positioned div inside the Planet cell (cell has `position: relative`), 3px wide, left:0, top:0, bottom:0.

## Column header tooltips

Use the existing `Tooltip` component from `@src/components/Tooltip.vue` in an `InlineFlex` wrapper, matching BURN's Burn/Need headers exactly:

```vue
<th>
  <InlineFlex>
    Current Fill
    <Tooltip position="bottom" tooltip="What's in base storage right now, colored by material category." />
  </InlineFlex>
</th>
```

The ⓘ icon is rendered by `Tooltip`. No need for `data-tooltip` on the `<th>` (which caused the v2 layout break via the global `[data-tooltip] { display: inline-block }` rule).

### Header tooltip text

- **Planet**: (no tooltip)
- **Current Fill**: "What's in base storage right now. Colored by material category. Click to open INV."
- **After Resupply**: "Projected storage if all produced goods were shipped out and all consumables delivered up to their XIT BURN Need amount. Click to open BURN."
- **Days**: "Days until a ship visit is needed — either to deliver supplies or pick up production."
- **CMD**: (no tooltip)

## Sort order

Unchanged from v2: by `daysUntilFull` ascending, `comparePlanets` as tiebreak. User confirmed this is the right primary signal.

## Expanded view

Simplified. Drop the `StorageTable` (Import/Export/Σ/Storage-Filled). Keep the `VisitationTable` only.

Rationale: CargoBars in the collapsed row already communicate storage composition and fill. The Import/Export rate numbers are a derivative detail that rarely drives a decision — if the user needs precision they can open BURN. The Visitation table is genuinely unique value (what ship size visits how often) that doesn't fit anywhere else.

## Files changed

### Cherry-picked from PR #172

- `src/features/XIT/FLT/CargoBar.vue` → move to `src/components/CargoBar.vue` (shared location; both FLT and STO use it)
- Any supporting helpers (`getMaterialCategoryCssClass`, `materialCategoriesStore`) if not already on main

### Modified

- `src/features/XIT/STO/BaseHeader.vue` — complete rewrite for the 4-column layout with two CargoBar cells + left-edge stripe + BS-only CMD
- `src/features/XIT/STO/STO.vue` — trim `<thead>` to 5 `<th>`s (Planet / Current / After Resupply / Days / CMD); use `InlineFlex` + `Tooltip` for ⓘ headers; update fakeRow data
- `src/features/XIT/STO/BaseSection.vue` — `colspan` from 7 → 5
- `src/features/XIT/STO/BaseDetail.vue` — drop `<StorageTable>`, render only `<VisitationTable>`
- `src/core/storage-analysis.ts` — add an exported function `buildProjectedStore(site): PrunApi.Store | undefined` that returns a synthetic `Store` reflecting "after resupply" state. Separate function (not a `BaseStorageAnalysis` field) so callers opt-in — keeps the analysis object lean.

### Deleted

- `src/features/XIT/STO/StorageTable.vue` — dropped from expanded view

### Retained

- `src/features/XIT/STO/VisitationTable.vue` — unchanged
- `src/features/XIT/STO/tile-state.ts` — unchanged
- `src/features/XIT/STO/utils.ts` — `fillRatioClass` still used for stripe; rest may be unused and can trim

## Verification

1. `pnpm run compile && pnpm run build && pnpm exec eslint src/features/XIT/STO src/core/storage-analysis.ts src/components/CargoBar.vue`
2. In-game:
   - Open `XIT STO` → 5 columns: Planet / Current Fill (bar) / After Resupply (bar) / Days / CMD
   - Each base shows two horizontal stacked bars side by side, colored by material category (metals = metal color, consumables = food color, etc.)
   - A base that can't accept full resupply has a bar visibly longer than 100% in the second column
   - Row left edge stripe: red for overfull-after-resupply, yellow for tight, green for ample, absent for "not filling"
   - Header ⓘ tooltips on Current Fill / After Resupply / Days
   - Clicking the Current Fill bar opens INV for that base
   - Clicking the After Resupply bar opens XIT BURN for that base
   - Days cell tooltip shows "Weight is the binding limit." etc.
   - Clicking expand on a base → only VisitationTable shown (no StorageTable)
   - Regression: XIT BURN still shows correct Need values
   - Regression: XIT FLT (if we're on main + FLT's PR merged) still shows CargoBars for ships

## Open questions

- After PR #172 merges, do we rebase the CargoBar location (ours is at `src/components/CargoBar.vue`, theirs at `src/features/XIT/FLT/CargoBar.vue`)? Whichever lands first wins; the loser rebases.
- Does `divisor` math in CargoBar scale reasonably when projected volume/weight exceeds capacity? Verify the bar visibly overflows rather than silently clipping or compressing.

## Out of scope (still)

- Per-material exclusion toggle (prun-planner's "Select Options")
- Cross-base aggregate row
- Rented warehouses + in-flight shipments accounting
- Configurable color thresholds in userData.settings
- "No ships in fleet" empty state for VisitationTable (inherited from v1)
