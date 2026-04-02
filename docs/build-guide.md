---
sidebar_position: 2
title: Build Guide
---

# Build Guide

How to build and run Claude Code from the recovered source.

:::tip Credit
The source recovery and build setup used in this guide is based on the work by [Janlaywss/cloud-code](https://github.com/Janlaywss/cloud-code), who extracted the original TypeScript source from the npm package's source map and created the build scaffolding (stubs, patches, build script). We followed their steps to get the source building and running locally.
:::

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org) | v18+ | Runtime |
| [Bun](https://bun.sh) | v1.3.11 | Build tool (uses `bun:bundle` feature) |
| [pnpm](https://pnpm.io) | v10+ | Package manager |

## Quick Start

```bash
# 1. Install Bun
curl -fsSL https://bun.sh/install | bash
# Restart your shell or run: exec /bin/zsh

# 2. Install pnpm (if needed)
npm install -g pnpm

# 3. Install dependencies
pnpm install --registry https://registry.npmjs.org

# 4. Build
bun run build.ts

# 5. Verify
bun dist/cli.js --version
# Expected: 2.1.88 (Claude Code)
```

## Running

```bash
# Interactive mode
bun dist/cli.js

# Show help
bun dist/cli.js --help

# Dev mode (runs source directly, no build needed)
bun src/entrypoints/cli.tsx
```

You'll need an `ANTHROPIC_API_KEY` for actual usage:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
bun dist/cli.js
```

## How the Build Works

The build uses **Bun's bundler** with a custom `build.ts` script that:

1. **Bundles** `src/entrypoints/cli.tsx` → `dist/cli.js` (ESM format, Node target)
2. **Injects feature flags** via a custom `bun:bundle` plugin that replaces `feature()` calls with compile-time booleans
3. **Embeds text files** — `.md` and `.txt` files are loaded as strings
4. **Injects MACRO constants** — version, build time, URLs
5. **Adds shebang** — `#!/usr/bin/env node` prepended, file made executable

### Private Package Stubs

Internal Anthropic packages are replaced with functional stubs in `stubs/`:

| Package | Stub Behavior |
|---------|---------------|
| `color-diff-napi` | Disables native syntax highlighting |
| `modifiers-napi` | Returns empty modifier state |
| `@ant/claude-for-chrome-mcp` | Disables Chrome MCP |
| `@anthropic-ai/mcpb` | Minimal MCP bundle processor |
| `@anthropic-ai/sandbox-runtime` | Minimal sandbox interface |

### Commander Patch

A patch in `patches/commander@14.0.3.patch` allows multi-character short options (e.g., `-d2e`). Applied automatically by pnpm during install.

## Notes

- This build runs **independently** from any globally installed Claude Code (`claude` command)
- Both share config at `~/.claude/` and API credentials
- The build output is `dist/cli.js` (~22MB ESM bundle with source maps)
