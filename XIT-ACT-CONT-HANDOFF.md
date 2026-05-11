# XIT ACT CONT — branch relationship and handoff

This branch (`XIT-ACT-CONT`) is the third of three PRs split out from the
original PR #164. It depends on the other two landing first.

**Delete this file before final merge.**

## The three PRs

```
XIT-ACT-paste (independent)
XIT-ACT-shortDescription (independent)
XIT-ACT-CONT (depends on both)
```

| Branch | What it adds | Depends on |
|---|---|---|
| `XIT-ACT-paste` | `Paste` material group: tab- or comma-separated `TICKER AMOUNT` rows parsed at execution time. Also makes `editComponent` optional on `MaterialGroupInfo` (paste has no design-time fields). | nothing |
| `XIT-ACT-shortDescription` | `shortDescription?: string` field on `ActionInfo` and `MaterialGroupInfo`, surfaced as a banner in the Edit Action and Edit Material Group dialogs. Adds descriptions to all existing actions and groups. | nothing |
| `XIT-ACT-CONT` | `CONT Ship` and `CONT Trade` actions. Plus the price-flow infrastructure that lets material groups carry per-material prices (`setPrices` on `MaterialGroupGenerateContext`, `getMaterialGroupPrices` on `ActionStepGenerateContext`, runner wiring), consumed by `CONT Trade`. | both |

## Why split

The original PR #164 bundled all three concerns plus `cont-utils.ts` style
mismatches into ~1400 lines across 32 files. Splitting separates the
review conversations:

- `paste` is a small new feature with a contained surface
- `shortDescription` is a UX polish PR that's trivial to evaluate
- `CONT` is the substantive design discussion (action shape, helper style,
  contract draft automation)

Holding `paste` or `shortDescription` review behind a CONT design discussion
was the friction in PR #164.

## What's already in this branch

The CONT branch as it stands is **scoped narrowly** — paste and
shortDescription have been *stripped* from it to make them independently
reviewable. Specifically removed in commit "Strip Paste material group and
shortDescription registry feature":

- The `material-groups/paste/` folder
- `'Paste'` from `MaterialGroupType`
- `shortDescription` field on registry interfaces
- `shortDescription:` lines on every action and group
- The description rendering in `EditAction.vue` / `EditMaterialGroup.vue`
- The runner-side `setPrices` / `getMaterialGroupPrices` infrastructure

Then a follow-up commit "Refactor cont-utils helpers to throw via assert"
addresses Razenpok's likely architectural concern with PR #164:

- `cont-utils.ts` helpers no longer return `false`/`undefined` on failure
  and require caller-side `if (!x) return` checks. They throw via
  `ctx.assert`, matching the pattern already used by `CXPO_BUY` and the
  rest of the action steps.
- `ContDraftContext` intermediate struct is gone; helpers take the tile
  anchor `Element` directly with narrow callbacks (`log`, `setStatus`)
  where they own internal status messages.
- Removed `as HTMLInputElement` / `as HTMLElement` casts where
  `querySelector<T>` generics carry the type naturally.
- Replaced inline IIFE for the price-input fallback in `CONT_SEND.ts`
  with a named helper.
- `MTRA_TRANSFER.ts`'s `selectMaterial` failure path now uses `assert`
  instead of `fail()+return`.

Net: ~330 lines removed across the four files in the refactor commit.

## What needs to happen before this PR can land

After `XIT-ACT-paste` and `XIT-ACT-shortDescription` land on `main`, this
branch needs to rebase and put back the parts that were stripped. Specifically:

### 1. Re-add `shortDescription` to the new CONT actions

In `src/features/XIT/ACT/actions/cont-ship/cont-ship.ts`:

```ts
act.addAction<Config>({
  type: 'CONT Ship',
  shortDescription: 'Create a shipping contract draft for a material group',
  description: (action, config) => { ... }
```

In `src/features/XIT/ACT/actions/cont-trade/cont-trade.ts`:

```ts
act.addAction<Config>({
  type: 'CONT Trade',
  shortDescription: 'Create a buy/sell trade contract draft for a material group',
  description: (action, config) => { ... }
```

### 2. Re-add the price-flow infrastructure

The `CONT Trade` action consumes per-material prices from the material
group it's bound to. The producer side lives in the `Paste` material
group's optional 3rd column.

**`src/features/XIT/ACT/shared-types.ts`** — add to existing interfaces:

```ts
export interface MaterialGroupGenerateContext<TConfig>
  extends ActionRunnerContext<UserData.MaterialGroupData> {
  config: TConfig;
  setStatus: (status: string) => void;
  setPrices: (prices: Record<string, number>) => void;  // ADD
}

export interface ActionStepGenerateContext<TConfig>
  extends ActionRunnerContext<UserData.ActionData> {
  config: TConfig;
  packageName: string;
  fail: (message?: string) => void;
  assert: AssertFn;
  getMaterialGroup: (name: string | undefined) => Promise<Record<string, number> | undefined>;
  getMaterialGroupPrices: (name: string | undefined) => Record<string, number> | undefined;  // ADD
  getMaterialGroupPlanet: (name: string | undefined) => string | undefined;
  ...
}

export const groupTargetPrefix = 'group:';  // ADD if not present
```

**`src/features/XIT/ACT/runner/step-generator.ts`** — wire the producer/
consumer through a `groupPrices: Map<string, Record<string, number>>` on
the runner instance. The original PR #164 commits show the exact shape if
you need a reference.

### 3. Re-add paste's price column

In `src/features/XIT/ACT/material-groups/paste/paste.ts`:

- 3-element row: `TICKER AMOUNT PRICE` (price column optional, but if any
  row has a price, all rows must)
- Validate price: positive, finite, at most 2 fractional digits
- In `generateMaterialBill`, call `setPrices(prices)` if any prices were
  parsed
- Update the textarea placeholder in `Configure.vue` to document the
  3rd column

PR #164's history has the exact parsing code. The lesson learned (see
this branch's CONT_SEND/CONT_TRADE commit history): the price feature
*does* work — it was the original PR's intent and the runner properly
implements `setPrices` / `getMaterialGroupPrices`. An earlier session
wrongly stripped it as "dead code"; it isn't, the consumer just lives
in `cont-trade`.

### 4. Verify

- `pnpm tsc --noEmit` clean
- The `assert(prices, '...')` call in `cont-trade.ts:51-54` already tells
  the user to use a 3-column Paste group when no prices are present —
  that error message becomes actionable once paste's 3rd column lands

## File-level summary of this branch's diff vs `origin/main`

After the strip + refactor, this branch touches:

```
src/features/XIT/ACT/ACT.ts                          (register CONT actions)
src/features/XIT/ACT/EditAction.vue                  (no functional change post-strip)
src/features/XIT/ACT/EditMaterialGroup.vue           (no functional change post-strip)
src/features/XIT/ACT/act-registry.ts                 (no functional change post-strip)
src/features/XIT/ACT/action-steps/CONT_SEND.ts       (NEW)
src/features/XIT/ACT/action-steps/CONT_TRADE.ts      (NEW)
src/features/XIT/ACT/action-steps/MTRA_TRANSFER.ts   (use shared selectMaterial)
src/features/XIT/ACT/action-steps/cont-utils.ts      (NEW, refactored)
src/features/XIT/ACT/actions/cont-locations.ts       (NEW)
src/features/XIT/ACT/actions/cont-ship/              (NEW: action + Edit/Configure)
src/features/XIT/ACT/actions/cont-trade/             (NEW: action + Edit/Configure)
src/features/XIT/ACT/runner/step-generator.ts        (packageName + price wiring)
src/features/XIT/ACT/shared-types.ts                 (packageName + price fields + groupTargetPrefix)
src/store/user-data.types.d.ts                       (CONT action data fields)
src/util.ts                                          (changeTextAreaValue helper)
```

## Open design questions for the maintainer

These are the parts most likely to come up in review:

1. **Should the price flow live on `MaterialGroupGenerateContext` at all?**
   The alternative is keeping per-material prices on `ActionData` and
   filling them at config time. Putting prices on the material group lets
   the same group be used by multiple actions, but it does conflate
   "what materials" with "how to value them."

2. **`cont-utils.ts` is shared between two action steps.** Is two consumers
   enough to justify a shared utility file, or should `CONT_SEND.ts` and
   `CONT_TRADE.ts` each inline what they need? Given the helpers are
   ~10-30 LOC each and both steps follow the same draft-creation flow,
   the shared file seems right, but happy to inline if you'd prefer.

3. **`pollUntil` in `cont-utils.ts`** is a generic DOM-readiness polling
   utility. The Apply Template button is a client-side template fill (not
   a server round-trip), so `waitActionFeedback` doesn't apply. There's
   no equivalent helper elsewhere in the codebase — `watchWhile` from
   `@src/utils/watch` is for reactive Vue refs, not DOM state. Reasonable
   to keep `pollUntil` local to this file unless you'd like it lifted
   into a shared utility module.
