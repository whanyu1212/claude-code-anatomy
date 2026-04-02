---
sidebar_position: 1
title: Feature Flags
---

# Feature Flags

All 90+ feature flags defined in `build.ts`, their default values in the public build, and what they gate.

## How Flags Work

Flags are resolved at build time via Bun's `feature()` API:

```typescript
import { feature } from 'bun:bundle'

// At build time, this becomes: const enabled = false
const enabled = feature('COORDINATOR_MODE')

if (enabled) {
  // Entire block eliminated from bundle (dead code)
}
```

This means flags set to `false` have **zero runtime cost** — the gated code is physically removed from the bundle.

## Enabled Flags (Public Build)

These features are active in the v2.1.88 public release:

| Flag | What It Gates |
|------|---------------|
| `BUILTIN_EXPLORE_PLAN_AGENTS` | Built-in Explore and Plan agent types |
| `MCP_SKILLS` | MCP-based skill loading |
| `TOKEN_BUDGET` | Token usage display in UI |
| `COMPACTION_REMINDERS` | Reminders about context compaction |
| `TASK_TOOLS` | TaskCreate, TaskList, TaskUpdate, TaskGet, TaskOutput tools |
| `TOOL_SEARCH` | ToolSearch tool for deferred tool loading |
| `AGENT_TOOL` | Agent tool for sub-agent spawning |
| `SEND_MESSAGE_TOOL` | SendMessage tool for agent communication |

## Disabled Flags (Internal/Experimental)

These features are compiled out of the public build:

| Flag | What It Gates | Category |
|------|---------------|----------|
| `BRIDGE_MODE` | IDE bridge integration | Internal |
| `COORDINATOR_MODE` | Multi-agent coordinator | Internal |
| `KAIROS` | Autonomous assistant mode | Internal |
| `DAEMON` | Background daemon process | Internal |
| `VOICE_MODE` | Voice input/output | Experimental |
| `WEB_BROWSER_TOOL` | Browser automation tool | Experimental |
| `CHICAGO_MCP` | Computer-use MCP tools | Internal |
| `ABLATION_BASELINE` | A/B testing baseline | Testing |
| `WORKFLOW_SCRIPTS` | Workflow file execution | Experimental |

## Flag Reference

The full list of flags is defined in `build.ts`:

```typescript
const featureFlags = {
  // Core features (enabled)
  BUILTIN_EXPLORE_PLAN_AGENTS: true,
  MCP_SKILLS: true,
  TOKEN_BUDGET: true,
  COMPACTION_REMINDERS: true,

  // Internal features (disabled)
  BRIDGE_MODE: false,
  COORDINATOR_MODE: false,
  KAIROS: false,
  DAEMON: false,

  // Experimental (disabled)
  VOICE_MODE: false,
  WEB_BROWSER_TOOL: false,

  // ... 80+ more flags
}
```

## Modifying Flags

To experiment with disabled features, edit `build.ts` and set the flag to `true`, then rebuild:

```bash
# Edit build.ts: change COORDINATOR_MODE: false → true
bun run build.ts
bun dist/cli.js
```

Note that internal features may depend on infrastructure not available in the public build.

## Source File

| File | Purpose |
|------|---------|
| `build.ts` | All flag definitions and build configuration |
