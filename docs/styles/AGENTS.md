# Table Styling

## Overview

The `tables.less` file provides global styling for HTML `<table>` elements, ensuring consistent appearance throughout the extension. It defines colors, borders, padding, and hover states that match PrUn's visual style.

## Structure

### `.table` class (Debug Indicator)
**Background:** Purple — This is intentional and indicates an error or placeholder state. If you see purple tables in production, it means the table component wasn't properly rendered or styled. Use this to catch styling regressions during development.

### Global `table` selector
Applies base styles to all `<table>` elements:
- **Typography:** 11px Droid Sans, 1.1 line-height
- **Layout:** `border-collapse` + `table-layout: auto`
- **Width:** 100% (fills container)

### `caption`
Optional table title element:
- Background: Secondary accent color (muted)
- Text: Header color
- Font weight: Bold

### `thead` (table header)
- **`th`:** Bottom border, left-aligned, smaller padding

### `tbody` (table body)
- **`th`:** Full-width row headers (bold, bottom border)
- **`td`:** 
  - Left vertical borders (except first column)
  - Alternating row background colors (odd rows lighter)
  - **Hover state:** Full row highlights on mouse over
- **Bottom border:** Separates from tfoot

### `tfoot` (table footer)
- Same structure as `thead` (headers + alternating colors)
- Bottom border closes the table

## Usage Example: FLT Component

The FLT (Fleet) tile in `src/features/XIT/FLT/FLT.vue` renders a ship fleet table:

```vue
<table :class="$style.table">
  <thead>
    <tr>
      <th class="sortable" @click="setSort('name')">Name ▲</th>
      <th class="sortable" @click="setSort('cargo')">Cargo</th>
      <th class="sortable" @click="setSort('status')">Status</th>
      <th class="sortable" @click="setSort('fuel')">Fuel</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="x in rows" :key="x.ship.id">
      <td>{{ x.ship.name }}</td>
      <td><CargoBar :ship-id="x.ship.id" /></td>
      <td><FleetStatusCell :ship-id="x.ship.id" /></td>
      <td><!-- Fuel bars --></td>
    </tr>
  </tbody>
</table>
```

**What `tables.less` provides:**
- Alternating row colors for scannability
- Left borders separating columns
- Hover highlighting for interactive rows
- Consistent padding/typography

**What FLT adds via CSS Modules:**
- Custom table dimensions
- Component-specific class names (`$style.headerCell`, `$style.bodyCell`, etc.)
- Sortable header styling (bold, colored indicators)

## Color Notes

- `@color-border-table` = `#2b485a`
- `@color-background-table` = `#23282b`
- `td:nth-child(odd)` stripes **columns**, not rows
- PrUn injects its own row striping via `tr:nth-child(2n)::after { background: rgba(255,255,255,0.02) }` — this only applies to real `<table>` elements, not div-based layouts
- For div/grid layouts (e.g. FLT), apply `.oddRow { background-color: #23282b }` manually on alternating rows

## Color Variables

The file imports:
- `@color-border-table` — Dividers between rows/columns
- `@color-background-table` — Alternating row background (lighter shade)
- `@color-accent-secondary-fade-85` — Caption background
- `@color-text-header` — Caption text
- `@color-hover-background` — Row hover state

All defined in `variables.less` and `mobile/variables.less`.

## When to Use

Apply `tables.less` when:
- Displaying tabular data (ships, materials, orders, etc.)
- You need PrUn-consistent styling without extra overhead
- Row hover states or column separators are desired

For custom table layouts (e.g., FLT's flex-based cargo bar), use CSS Modules alongside `tables.less` rather than replacing it.
