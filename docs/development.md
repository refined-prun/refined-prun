# Development Setup

Requires **Node.js 22** (see `.nvmrc`) and **pnpm 9.4.0** (pinned via `packageManager` in `package.json`).

```bash
nvm use                # reads .nvmrc → 22.16.0
pnpm install           # install dependencies
```

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev build with watch + sourcemaps → `dist/` |
| `pnpm compile` | Type-check (tsc --noEmit) |
| `pnpm lint` | ESLint check |
| `pnpm fix` | ESLint auto-fix |
| `pnpm prettier` | Format code |
| `pnpm build` | Production build → `dist/` |

## Loading the Extension

- **Chrome**: Load unpacked from `dist/`
- **Firefox**: Load temporary add-on from `dist/`

## Release Process

Releases are handled through GitHub Actions:

- Daily versioning strategy (YY.M.DD format, e.g. 26.1.24)
- Manual trigger via `workflow_dispatch`
- Auto-submits to Chrome Web Store and Firefox Add-ons
- Creates GitHub release with ZIP artifact
