# Working with CSS

When working with CSS in Refined PrUn, it's often to modify or extend the base
game's styles.

For example, the APEX logo in the base game has this CSS rule:

```css
.Frame__logo___qu6xPzo {
  margin: 13px 11px;
  height: 30px;
  width: 30px;
  background-image: url(https://apex.prosperousuniverse.com/assets/images/9320395831f78bc6.png);
  -webkit-background-size: cover;
  background-size: cover;
}
```

Suppose we want to create a new feature, `clickable-apex-logo`, to make the logo
clickable. For proper user feedback, we also want the cursor to change to a
pointer on hover. The desired CSS rule would look like this:

```css
.Frame__logo___qu6xPzo {
  cursor: pointer;
}
```

The simplest solution would be to add this rule directly to the extension's main
CSS stylesheet. However, that won't allow us to enable or disable the
`clickable-apex-logo` feature dynamically. Instead, we'll programmatically add
this rule through a TypeScript feature file.

```typescript
function init() {
  // Implementation here
}

features.add(import.meta.url, init, 'Makes the APEX logo clickable.');
```

The recommended approach for implementing this in Refined PrUn involves the
following:

1. CSS Modules
2. `applyCssRule` function
3. `C` object for class management
4. (Optional) CSS Nesting for cleaner styles

By properly using these tools, the final implementation of `clickable-apex-logo`
would look like this:

`clickable-apex-logo.ts`:

```typescript
import $style from './clickable-apex-logo.module.css';

function init() {
  applyCssRule(`.${C.Frame.logo}`, $style.logo);
}

features.add(import.meta.url, init, 'Makes the APEX logo clickable.');
```

`clickable-apex-logo.module.css`:

```css
.logo {
  cursor: pointer;
}
```

## CSS Modules

[CSS Modules](https://github.com/css-modules/css-modules) scope class names and
animations locally by default. When a CSS Module is imported in a TypeScript
file, it exports an object mapping local names to generated global names. This
has several advantages:

- **Local Scope Prevents Clashes:** CSS Modules use local scope to avoid style
  conflicts across different project parts, allowing component-scoped styling.
- **Clear Style Dependencies:** Importing styles into their respective
  components clarifies which styles impact which areas, enhancing code
  readability and maintenance.
- **Solves Global Scope Problems:** CSS Modules prevent the common issue of
  styles in one file affecting the entire project by localizing styles to
  specific components.
- **Boosts Reusability and Modularity:** CSS Modules allow the same class names
  in different modules, promoting modular, reusable styling.

For example, with the `clickable-apex-logo.module.css` module:

```css
.logo {
  cursor: pointer;
}
```

And the corresponding TypeScript:

```typescript
import $style from './clickable-apex-logo.module.css';

function init() {
  console.log($style.logo); // Outputs: "rp-clickable-apex-logo__logo___63cd318"
}

features.add(import.meta.url, init, 'Makes the APEX logo clickable.');
```

## `applyCssRule` Function

With our CSS Module in place, we can use the
`rp-clickable-apex-logo__logo___63cd318` class to apply the cursor pointer to
the APEX logo HTML element. There are two ways to do that:

1. Using MutationObserver, wait until `Frame__logo___qu6xPzo` element is added
   to the document, and then manually add
   `rp-clickable-apex-logo__logo___63cd318` to that new element.
2. Take the `rp-clickable-apex-logo__logo___63cd318` rule, replace the selector
   with `.Frame__logo___qu6xPzo` and add it to the document.

The former approach is more intrusive and doesn't scale well with the amount of
elements added to the document, so we will use the latter.

The general process is:

1. Get this rule:

```css
.rp-clickable-apex-logo__logo___63cd318 {
  cursor: pointer;
}
```

2. Modify the selector:

```css
.Frame__logo___qu6xPzo {
  cursor: pointer;
}
```

3. Dynamically add this rule to the game.

To help with that, we have an `applyCssRule(selector, sourceClass)` function
that does for you all the steps above. This function is globally available via
[unimport](https://github.com/unjs/unimport), so you don't need to import
anything in your file to use it. Here's how you can use this function in our
example:

```typescript
import $style from './clickable-apex-logo.module.css';

function init() {
  applyCssRule('.Frame__logo___qu6xPzo', $style.logo);
}

features.add(import.meta.url, init, 'Makes the APEX logo clickable.');
```

This function accepts either a single `string` or an array of `string`
selectors:

```typescript
// Separate calls
applyCssRule('.ComExOrdersPanel__filter___vu7cNod', $style.filter);
applyCssRule('.LocalMarket__filter___vANBFfG', $style.filter);
applyCssRule('.ContractsListTable__filter___nzzypkA', $style.filter);

// Combined into one
applyCssRule(
  [
    '.ComExOrdersPanel__filter___vu7cNod',
    '.LocalMarket__filter___vANBFfG',
    '.ContractsListTable__filter___nzzypkA'
  ],
  $style.filter
);
```

You can also scope CSS rules to specific commands with the overloaded version of
`applyCssRule(command, selector, sourceClass)`:

```typescript
// Separate calls
applyCssRule('PROD', `.OrderTile__overlay___lqLFDV_`, $style.disablePointerEvents);
applyCssRule('PRODQ', `.OrderTile__overlay___lqLFDV_`, $style.disablePointerEvents);

// Combined into one
applyCssRule(['PROD', 'PRODQ'], `.OrderTile__overlay___lqLFDV_`, $style.disablePointerEvents);
```

## `C` Object

Using raw class names like `OrderTile__overlay___lqLFDV_` can lead to errors and
maintenance risks (e.g., if PrUn developers change hashes). The `C` object
solves this problem. It maps all PrUn class names, allowing auto-completion and
reducing chance of bugs.

For example:

```typescript
import $style from './clickable-apex-logo.module.css';

function init() {
  // Direct use of hardcoded class
  applyCssRule('.Frame__logo___qu6xPzo', $style.logo);

  // Cleaner with `C` object
  applyCssRule(`.${C.Frame.logo}`, $style.logo);
}

features.add(import.meta.url, init, 'Makes the APEX logo clickable.');
```

Auto-complete support from the `C` object makes it easier to avoid errors.

## (Optional) CSS Nesting

Suppose we want additional styles on hover, such as a tint effect. Since
`applyCssRule` is only copying one rule at a time, you cannot just declare a
`.logo:hover` rule:

```css
.logo {
  cursor: pointer;
}

/* This will not work! */
.logo:hover {
  background-color: rgba(128, 128, 128, 0.5);
}
```

To make it work, you need to declare a separate class and call
`applyCssRule` for it:

```css
.logo {
  cursor: pointer;
}

.logoHover {
  background-color: rgba(128, 128, 128, 0.5);
}
```

```typescript
import $style from './clickable-apex-logo.module.css';

function init() {
  applyCssRule(`.${C.Frame.logo}`, $style.logo);
  applyCssRule(`.${C.Frame.logo}:hover`, $style.logoHover);
}

features.add(import.meta.url, init, 'Makes the APEX logo clickable.');
```

While functional, this splits CSS logic into the TypeScript file. Instead, we
can
use [CSS Nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting)
for cleaner code:

`clickable-apex-logo.module.css`:

```css
.logo {
  cursor: pointer;

  &:hover {
    background-color: rgba(128, 128, 128, 0.5);
  }
}
```

This allows a single `applyCssRule` call:

```typescript
import $style from './clickable-apex-logo.module.css';

function init() {
  applyCssRule(`.${C.Frame.logo}`, $style.logo);
}

features.add(import.meta.url, init, 'Makes the APEX logo clickable.');
```
