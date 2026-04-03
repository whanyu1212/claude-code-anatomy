---
sidebar_position: 2
title: Directory Map
---

# Directory Map

The full `src/` directory structure with descriptions and links to relevant documentation sections.

## Top-Level Structure

```
src/
├── entrypoints/       → CLI entry points
├── main.tsx           → Full CLI initialization
├── Tool.ts            → Tool interface definitions
├── Task.ts            → Task type definitions
├── QueryEngine.ts     → Headless query execution
├── query.ts           → Main query loop
├── commands.ts        → Command registry
├── bridge/            → Remote-control bridge runtime
├── remote/            → Remote session transports
├── server/            → Direct-connect session plumbing
└── [directories below]
```

## Directory Reference

### Core

| Directory | Files | Purpose | Docs |
|-----------|-------|---------|------|
| `entrypoints/` | 8 | CLI bootstrap, SDK entrypoints, MCP server entrypoint | [Startup & Bootstrap](../core/startup-bootstrap) |
| `state/` | 6 | Zustand-like state store | [State & Sessions](../core/state-sessions) |
| `context/` | 9 | React context providers | [State & Sessions](../core/state-sessions) |
| `constants/` | 21 | Global constants, prompts | [Prompt, Memory & Context](../core/prompt-memory-context) |

### Tools & Commands

| Directory | Files | Purpose | Docs |
|-----------|-------|---------|------|
| `tools/` | 184 | Built-in tool implementations and gated tool stubs | [Tool Architecture](../tools/tool-architecture) |
| `commands/` | 207 | Slash command implementations | [Command System](../extensions/command-system) |

### Services

| Directory | Files | Purpose | Docs |
|-----------|-------|---------|------|
| `services/api/` | 20+ | API client, auth, providers | [API Client](../core/api-client) |
| `services/mcp/` | 10+ | MCP client and configuration | [MCP Integration](../extensions/mcp-integration) |
| `services/tools/` | 10+ | Tool execution infrastructure | [Tool Execution](../tools/tool-execution) |
| `services/lsp/` | 5+ | LSP manager, plugin config, diagnostics pipeline | [LSP & IDE Integration](../extensions/lsp-ide-integration) |
| `services/compact/` | 5+ | Message compaction | [Prompt, Memory & Context](../core/prompt-memory-context) |
| `services/SessionMemory/` | 5+ | Session-memory sidecar generation | [Prompt, Memory & Context](../core/prompt-memory-context) |
| `services/extractMemories/` | 3+ | Durable memory extraction | [Prompt, Memory & Context](../core/prompt-memory-context) |
| `services/settingsSync/` | 3+ | Cross-environment settings and memory sync | [Prompt, Memory & Context](../core/prompt-memory-context) |
| `services/remoteManagedSettings/` | 5+ | Enterprise managed settings fetch/polling | [Startup & Bootstrap](../core/startup-bootstrap) |
| `services/teamMemorySync/` | 5+ | Repo-scoped shared team memory sync | [Prompt, Memory & Context](../core/prompt-memory-context) |
| `services/analytics/` | 10+ | GrowthBook, telemetry | [Analytics](../observability/analytics-telemetry) |
| `services/plugins/` | 5+ | Plugin management | [Plugins & Skills](../extensions/plugins-skills) |
| `services/policyLimits/` | 3+ | Enterprise policy enforcement | [Sandbox & Safety](../security/sandbox-safety) |

### UI

| Directory | Files | Purpose | Docs |
|-----------|-------|---------|------|
| `components/` | 389 | React terminal UI components | [Components](../ui/components-rendering) |
| `screens/` | 5+ | Full-screen components (REPL) | [Components](../ui/components-rendering) |
| `ink/` | 96 | Custom Ink renderer extensions | [Components](../ui/components-rendering) |
| `hooks/` | 104 | React hooks | [Components](../ui/components-rendering) |
| `keybindings/` | 14 | Keyboard shortcut system | [Components](../ui/components-rendering) |

### Extensions

| Directory | Files | Purpose | Docs |
|-----------|-------|---------|------|
| `plugins/` | 2+ | Plugin system core | [Plugins & Skills](../extensions/plugins-skills) |
| `skills/` | 20 | Skill system + bundled skills | [Plugins & Skills](../extensions/plugins-skills) |

### Agents & Tasks

| Directory | Files | Purpose | Docs |
|-----------|-------|---------|------|
| `tasks/` | 12 | Task implementations (8 types) | [Task Management](../core/task-management) |
| `buddy/` | 6 | Sub-agent system | [Sub-Agents & Coordination](../core/sub-agents-coordination) |
| `coordinator/` | 5+ | Multi-agent coordination | [Sub-Agents & Coordination](../core/sub-agents-coordination) |

### Infrastructure

| Directory | Files | Purpose | Docs |
|-----------|-------|---------|------|
| `utils/` | 564 | Utility functions | Various |
| `utils/permissions/` | 20+ | Permission logic | [Permission Model](../security/permission-model) |
| `utils/auth.ts` | — | Authentication | [API Client](../core/api-client) |
| `utils/settings/` | 10+ | Settings loading | [Startup & Bootstrap](../core/startup-bootstrap) |
| `utils/hooks/` | 5+ | Lifecycle hook execution | [Permission Model](../security/permission-model) |
| `utils/claude-md/` | 5+ | CLAUDE.md loading/merging | [Prompt, Memory & Context](../core/prompt-memory-context) |

### Other

| Directory | Files | Purpose |
|-----------|-------|---------|
| `types/` | 11 | TypeScript type definitions |
| `memdir/` | 8 | Memory directory management |
| `migrations/` | 11 | Data migration scripts |
| `bridge/` | 31 | Remote-control / bridge runtime | [Remote Sessions, Teleport & Remote Control](../runtime/remote-sessions-teleport-remote-control) |
| `cli/` | 19 | CLI argument parsing and transports |
| `remote/` | 4 | Remote session transport managers | [Remote Sessions, Teleport & Remote Control](../runtime/remote-sessions-teleport-remote-control) |
| `server/` | 5+ | Direct-connect session server helpers | [Remote Sessions, Teleport & Remote Control](../runtime/remote-sessions-teleport-remote-control) |
| `vim/` | 5 | Vim mode support |
| `voice/` | 1 | Voice input (disabled) |
| `native-ts/` | 3+ | Native module TypeScript wrappers |
| `outputStyles/` | 3+ | Terminal output styling |

## Vendor Directory

```
vendor/
├── audio-capture-src/     # Native audio recording (macOS/Linux/Windows)
├── image-processor-src/   # Sharp-compatible image processor
├── modifiers-napi-src/    # macOS keyboard modifier detection
└── url-handler-src/       # macOS URL event handler (Apple Events)
```

## Stubs Directory

```
stubs/
├── @ant/claude-for-chrome-mcp/    # Chrome extension MCP (stub)
├── @anthropic-ai/mcpb/            # MCP bundle processor (stub)
├── @anthropic-ai/sandbox-runtime/ # Sandbox runtime (stub)
├── color-diff-napi/               # Syntax highlighting (stub)
└── modifiers-napi/                # Key modifiers (stub)
```
