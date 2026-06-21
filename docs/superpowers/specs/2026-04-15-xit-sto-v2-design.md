# XIT STO v2 — Resupply Fit + Infinity-Free Days

## Context

Design refinement after initial v1 shipped. User feedback:

1. **v1 dropped the BURN "would it fit if we delivered everything?" signal** that the reverted `burn-storage-fit-indicator` stripe provided. STO's current Days column shows "days until full at current net rate" (prun-planner's "Storage Filled"), which is a *different* question — rate-based vs one-shot delivery.

2. **Net-positive (infinity-days) materials inflate the Days signal**. A base producing a high-output material that accumulates forever until shipped looks "OK" by current Days but the base is actually filling — just not from consumables.

## Additions

### Two new columns on the BaseHeader row

```
+ | Planet | Fill | Fill (no ∞) | Fill after resupply | Days | Limit | CMD
```

**Fill after resupply** — projected fill % if every consumed material got delivered up to its `Need` amount:

```
need[ticker] = ceil((daysLeft[ticker] - resupply) × dailyAmount[ticker])  (0 when net-positive or daysLeft > resupply)
addedVolume = Σ need × mat.volume
addedWeight = Σ need × mat.weight
ratioV = (volumeLoad + addedVolume) / volumeCapacity
ratioW = (weightLoad + addedWeight) / weightCapacity
needFillRatio = max(ratioV, ratioW)  // displayed as %
```

Colored cell (same `C.Workforces.daysSupplied / daysWarning / daysMissing` palette):
- `< 0.80` → green
- `0.80–0.95` → yellow
- `> 0.95` or `> 1.0` → red

**Displayed value is the actual percentage** (e.g. "115%" when over 100%). Number alone is the colorblind-friendly backup — 115 > 100 reads the same regardless of color vision.

Tooltip: `Vol: X% · Wt: Y% after resupply`.

**Fill (no ∞)** — current fill % excluding the inventory occupied by net-positive (infinity-days) materials. Answers "once I ship out the accumulating produced goods, how full is the base really?"

```
infVolume = Σ inventory × mat.volume  for tickers where dailyAmount >= 0
infWeight = Σ inventory × mat.weight  for tickers where dailyAmount >= 0
fillNoInfRatio = max(
  (volumeLoad - infVolume) / volumeCapacity,
  (weightLoad - infWeight) / weightCapacity,
)
```

Uncolored cell. Tooltip: `Vol: X% · Wt: Y% excluding produced goods`.

### Final column list

```
+ | Planet | Fill | Fill (no ∞) | Fill after resupply | Days | Limit | CMD
```

Seven columns. Read left-to-right: current overall fill → current fill minus shippable products → projected fill after consumable resupply → rate-based days-until-full → binding dimension.

Only **Fill after resupply** is colored — it's the actionable decision column ("should I add more to my next shipment?"). Fill and Fill (no ∞) stay plain numbers for reference.

## Shared `computeNeed` helper

Currently duplicated in `src/features/XIT/BURN/MaterialRow.vue` (inline) and the old stripe branch. Move to `src/core/burn.ts` next to `MaterialBurn`:

```ts
export function computeNeed(mat: MaterialBurn, resupplyDays: number): number {
  const production = mat.dailyAmount;
  if (production >= 0) return 0;
  const days = mat.daysLeft;
  if (days > resupplyDays) return 0;
  const need = Math.ceil((days - resupplyDays) * production);
  return need === 0 ? 0 : need;
}
```

Both `BURN/MaterialRow.vue` and `core/storage-analysis.ts` import this.

## Data model additions

`BaseStorageAnalysis` gains (keeping existing fields):

```ts
// Current fill with accumulating (net-positive) materials excluded.
fillPercentWeightNoInf: number;
fillPercentVolumeNoInf: number;

// Projected fill if every consumed material is delivered up to its Need.
needFillPercentWeight: number;
needFillPercentVolume: number;
needFillRatio: number;     // max of the two — the color driver
```

To compute these, storage-analysis needs **per-ticker `MaterialBurn` data**, not just aggregated rates. Refactor `storage-analysis.ts` to iterate via `getPlanetBurn(site)` from `core/burn.ts`:

1. Call `getPlanetBurn(site)` → `PlanetBurn` with `burn[ticker]: MaterialBurn`
2. For each ticker, look up `materialsStore.getByTicker(ticker)` → `Material` for weight/volume
3. Accumulate four totals using the same loop:
   - `importWeight/Volume` = `Σ -dailyAmount × mat.weight/volume` over consumers (`dailyAmount < 0`)
   - `exportWeight/Volume` = `Σ dailyAmount × mat.weight/volume` over net-positive (`dailyAmount >= 0`) — these are what accumulate
   - `infVolume/Weight` = `Σ inventory × mat.volume/weight` for tickers where `dailyAmount >= 0`
   - `addedVolume/Weight` = `Σ computeNeed(burn, resupply) × mat.volume/weight` for all tickers

This replaces the current direct iteration over `productionStore` / `workforcesStore` in storage-analysis. Net effect: **drop ~50 lines of duplicated calculation, gain access to per-ticker data.**

Dependency: `core/storage-analysis.ts` → `core/burn.ts`. That's the right direction — storage analysis is a view over burn data.

## Tile width

`bufferSize: [720, 500]` → `bufferSize: [900, 500]` in `STO.ts`.

## Files changed

### Modified

- `src/core/burn.ts` — add `computeNeed` export
- `src/features/XIT/BURN/MaterialRow.vue` — replace inline Need calc with `computeNeed` import
- `src/core/storage-analysis.ts` — refactor to use `getPlanetBurn`; add `needFillPercent*`, `fillPercent*NoInf`, `needFillRatio` fields
- `src/features/XIT/STO/utils.ts` — add `needFillRatioClass(ratio)` mirroring `fillRatioClass` (or reuse directly; thresholds identical)
- `src/features/XIT/STO/BaseHeader.vue` — add two new `<td>` cells (Fill no ∞, Fill after resupply), wire tooltips, apply color stripe to Fill-after-resupply cell only
- `src/features/XIT/STO/STO.vue` — adjust `<th>` row + any `colspan` references to new column count (7 cells now, up from 5)
- `src/features/XIT/STO/BaseSection.vue` — update `<td colspan="5">` in expanded detail to `colspan="7"`
- `src/features/XIT/STO/STO.ts` — bump `bufferSize` to `[900, 500]`

### New

None.

## Terminology

Consistent with v1: **Import** = materials brought TO the base (from outside), = materials consumed locally. **Export** = materials taken FROM the base (via ship), = materials produced locally that accumulate until shipped. This matches prun-planner's terminology.

## Out of scope (still)

- Per-material exclusion toggle (prun-planner's Select Options)
- Cross-base aggregate row
- Rented warehouses + in-flight shipment accounting
- Configurable thresholds for color bands in userData.settings

## Verification

1. `pnpm run compile && pnpm run build && pnpm exec eslint src/features/XIT/STO src/core/storage-analysis.ts src/core/burn.ts src/features/XIT/BURN/MaterialRow.vue`
2. In-game:
   - All seven columns visible at default tile width
   - Fill (no ∞) ≤ Fill for any base with net-positive materials; equal otherwise
   - Fill after resupply tooltip shows correct Vol/Wt breakdown
   - Color matches threshold (<0.80 green, 0.80–0.95 yellow, >0.95 red) on Fill-after-resupply only
   - A base where delivering Need overfills → Fill after resupply shows >100% in red
   - A base with zero Need (fully supplied + no consumers) → Fill after resupply equals current Fill, typically green
   - BURN's MaterialRow still shows the same Need values (regression check — the refactor to shared `computeNeed` is behavior-preserving)
