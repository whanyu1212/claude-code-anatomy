---
sidebar_position: 3
title: Glossary
---

# Glossary

Key terms and concepts used throughout this documentation.

## A

**Agent** — A sub-process spawned via the Agent tool to handle tasks autonomously. Each agent has its own conversation context and filtered tool set. See [Sub-Agents & Coordination](../core/sub-agents-coordination).

**AppState** — The central state store (Zustand-like) that holds all application state: messages, tasks, permissions, UI state. See [State & Sessions](../core/state-sessions).

**Auto-memory** — The system that automatically stores useful information learned during conversations for future reference. See [Prompt, Memory & Context](../core/prompt-memory-context).

## B

**buildTool()** — Factory function that creates a Tool from a partial definition, filling in safe defaults for methods like rendering and permissions. See [Tool Architecture](../tools/tool-architecture).

**Bun** — JavaScript runtime and bundler used to build Claude Code. The build uses Bun's `feature()` API for compile-time dead code elimination. See [Build Guide](../build-guide).

## C

**CLAUDE.md** — Configuration files that provide persistent context to Claude. Loaded from multiple layers (enterprise, global, project, local). See [Prompt, Memory & Context](../core/prompt-memory-context).

**Compaction** — The process of summarizing conversation history when it exceeds the context window. See [Prompt, Memory & Context](../core/prompt-memory-context).

**Coordinator** — A special agent mode that decomposes tasks and delegates to worker agents. Gated behind the `COORDINATOR_MODE` feature flag. See [Sub-Agents & Coordination](../core/sub-agents-coordination).

## D

**Dead code elimination** — Build-time removal of code branches gated by `feature()` calls set to `false`. Reduces bundle size by excluding internal features. See [Feature Flags](./feature-flags).

## E

**end_turn** — The API stop reason indicating the model has finished responding and is not requesting any tool executions.

## F

**Feature flag** — A compile-time or runtime toggle that enables/disables functionality. 90+ flags are defined in `build.ts`. See [Feature Flags](./feature-flags).

## G

**GrowthBook** — Feature flag and A/B testing service used for runtime flag evaluation. See [Analytics & Telemetry](../observability/analytics-telemetry).

## H

**Hook** — A lifecycle extension point that runs shell commands before/after tool executions, agent loop turns, and session events. Can veto tool calls and modify inputs. See [Hooks](../extensions/hooks).

## I

**Ink** — A React renderer for terminal applications. Claude Code uses Ink 6 to render its interactive UI. See [Components & Rendering](../ui/components-rendering).

## L

**LocalCommand** — A slash command type that executes immediately without involving the AI model. Used for config, navigation, and utility commands. See [Command System](../extensions/command-system).

## M

**MACRO** — Compile-time constants injected during build (e.g., `MACRO.VERSION`, `MACRO.BUILD_TIME`). Similar to C preprocessor macros.

**MCP** — Model Context Protocol. An open standard for connecting AI models to external tools and data sources. See [MCP Integration](../extensions/mcp-integration).

## P

**Permission mode** — The current security mode (default, acceptEdits, auto, bypassPermissions, etc.) that determines how tool use approvals are handled. See [Permission Model](../security/permission-model).

**Plugin** — A full CLI extension that can add commands, tools, and hooks. More powerful than skills. See [Plugins & Skills](../extensions/plugins-skills).

**PromptCommand** — A slash command type that injects content into the conversation for the AI model to process. Skills become PromptCommands. See [Command System](../extensions/command-system).

## Q

**Query Engine** — The core logic that drives each turn of the agent loop. Its responsibilities are covered across [Prompt, Memory & Context](../core/prompt-memory-context) (assembly, memory, compaction) and [API Client](../core/api-client) (streaming & retries).

## R

**REPL** — Read-Eval-Print Loop. The main interactive screen where users converse with Claude. See [Input & Rendering](../core/input-rendering).

## S

**Skill** — A lightweight extension — a markdown file with YAML frontmatter that injects prompt content when invoked as a slash command. See [Plugins & Skills](../extensions/plugins-skills).

**Source map** — The `cli.js.map` file in the npm package that contains all original TypeScript source files, enabling the source recovery this analysis is based on.

**StreamingToolExecutor** — The engine that manages parallel and sequential tool execution during streaming API responses. See [Tool Execution](../tools/tool-execution).

**Swarm** — A mode where multiple in-process agents collaborate via a mailbox system. Related to coordinator mode. See [Sub-Agents & Coordination](../core/sub-agents-coordination).

## T

**Task** — A background unit of work (shell command, agent, workflow) that runs independently and reports completion via notifications. See [Task Management](../core/task-management).

**Tool** — A structured capability that the AI model can invoke. Tools have schemas, permissions, execution logic, and rendering. See [Tool Architecture](../tools/tool-architecture).

**tool_use** — An API response block type indicating the model wants to invoke a tool with specific arguments.

**tool_result** — An API request block type containing the output of a tool execution, sent back to the model.

## W

**Worktree** — A git worktree used for agent isolation. Sub-agents can work in isolated copies of the repo without affecting the main working directory. See [Sub-Agents & Coordination](../core/sub-agents-coordination).

## Y

**Yoga** — A cross-platform flexbox layout engine (from Meta) used by Ink for terminal UI layout. See [Components & Rendering](../ui/components-rendering).

## Z

**Zod** — A TypeScript schema validation library used for tool input validation. Every tool's `inputSchema` is a Zod schema. See [Tool Architecture](../tools/tool-architecture).

**Zustand** — A minimal state management library. Claude Code uses a Zustand-like pattern (not Zustand itself) for its AppState store. See [State & Sessions](../core/state-sessions).
