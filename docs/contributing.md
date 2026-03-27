# Contributing Guidelines

## Code Style

### Control Flow

Invert conditions early to reduce nesting:

```ts
// Bad
if (sliders.length > 0) {
  // 20 lines of indented code
}

// Good
if (sliders.length === 0) {
  return;
}
// 20 lines at base indentation
```

### Lambdas

Single-param lambdas: use `x`. Saves naming time, reads clearly. Use full names only when `x` would be unclear.

```ts
const disabled = sliders.every(x => x.classList.contains('rc-slider-disabled'));
```

**Exception — `subscribe` callbacks:** When subscribing to elements from `C.X.className`, use `className` as the parameter name. Avoids name collisions in nested subscribes and keeps the selector self-documenting.

```ts
// subscribe to C.ColoredValue.negative → param is "negative"
subscribe($$(tile.anchor, C.ColoredValue.negative), negative => {
  negative.classList.add($style.lowValue);
});
```

### Type Annotations

Don't add type definitions where TypeScript can infer the type.

```ts
// Bad
contextItems: (parameters: string[]) => { }

// Good (type inferred from contextItems signature)
contextItems: parameters => { }
```

### Non-null Assertions

Use `!` for `parentElement` and similar DOM properties that are guaranteed to exist when we process elements at DOM-appearance time. Don't use `as HTMLDivElement` casts for this — `!` is shorter and clearer.

```ts
// Bad
tile.anchor.parentElement as HTMLDivElement

// Good
tile.anchor.parentElement!
```

### Comments

Put on a separate line, start with a capital letter, end with a full stop.

```ts
// Bad
const x = foo; // gets the thing

// Good
// Gets the thing.
const x = foo;
```

### Unicode

Prefer unicode escape values over characters for non-standard or font-awesome codepoints — easier to search for.

```ts
// Bad
'\u{1F441}'  // or pasting the emoji directly

// Good
'\uf070'  // font-awesome eye-slash
```

Standard unicode symbols (arrows, geometric shapes, etc.) are fine as literal characters.

### CSS Values

Omit `px` from zero values.

```css
/* Bad */
padding-top: 0px;

/* Good */
padding-top: 0;
```

---

## Feature Design Rules

### Basic vs. Advanced

The split between `basic/` and `advanced/` is documented in `feature-patterns.md`. The key decision criterion: if a feature removes, shortens, or hides information, it goes in `advanced/`.

### One Feature, One Responsibility

Don't combine unrelated functionality. If you're shortening material names AND hiding fee collector links, those are two features.

### Feature Dependencies

Don't make one feature depend on another — 95% chance the design is wrong. Merge tightly coupled functionality into a single feature instead.

### Vanilla Bugs

Fixes for base-game PrUn bugs go in `src/features/basic/prun-bugs.ts`, not in a separate feature.

### Feature Settings Philosophy

All features are enabled by default. If a feature needs to be "disabled by default", it probably doesn't belong in the extension.

Minimize settings. Features should either:
- Work for everyone as a nonconfigurable default, or
- Have settings placed right where the feature is used (not in a global settings page)

Adding extra settings/toggles has costs: UI bloat, more code to maintain, and removal is harder than addition because someone always ends up using them.

### Feature Approval Threshold

New features that take vertical space or are potentially controversial need a Discord poll. If less than ~75% vote yes, the feature is rejected. Vertical space is precious — users are very defensive about it.

---

## UI/UX Philosophy

### Minimize New Elements

PrUn UI is already packed with information. Don't add elements unless they bring clear value. Every tooltip, button, or indicator should be justified for its specific context — avoid global/blanket application.

### Respect PrUn's Visual Style

Don't use overly bright or imposing colors. PrUn has a toned-down interface — use colors already in the game's palette.

```css
/* Bad: too imposing for a non-critical warning */
background-color: rgb(255, 0, 0);

/* Good: uses PrUn's own red */
background-color: rgb(217, 83, 79);
```

### Tooltips

Use `data-tooltip` attribute for instant tooltips (PrUn-style). Don't use `title` attribute — browser tooltips have a ~2 second delay, and most players will never see them.

### Server Communication & ToS

Every action that triggers server communication must require a user click. No automated server requests without explicit player action. This is a hard rule from the game developers.

The extension does make some background server requests (e.g., `XIT BURN` opens invisible buffers). This is a known ToS violation with explicit developer permission — don't extend this pattern without discussion.

The extension can send messages to the game server via `sendPrunMessage()`. This must only be used to replicate actions the game UI would send (e.g., `STORAGE_TRANSFER_ITEM` matches a drag-and-drop). Never fabricate messages the game UI cannot produce. Each call must be triggered by a user click.

---

## Workflow

### Changelog

Don't modify `CHANGELOG.md` in PRs. The maintainer adds changelog notes right before merging. This avoids merge conflicts.

### Import Sorting

Don't enable auto-import-sorting in your editor. It creates merge conflicts when the same file is touched in two branches. Import sorting should be project-wide (via eslint/prettier), not per-editor.

### Existing Components

Check `src/components/` before creating new UI components. Reusable components like `PrunButton`, `PrunLink`, `ContextControls`, and `ContextControlsItem` already exist.

Use Vue slots instead of adding new props to display custom text inside existing components.

```tsx
// Bad: adding a commandText prop to PrunLink
<PrunLink command="MAT RAT" commandText="RAT" />

// Good: using slots
<PrunLink inline command={`MAT ${material}`}>
  {material}
</PrunLink>
```
