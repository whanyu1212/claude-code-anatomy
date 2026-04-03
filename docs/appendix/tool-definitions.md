---
sidebar_position: 2
title: Tool Definitions
---

# Tool Definitions

Source-backed input schemas and notes for Claude Code's built-in, conditional, and runtime-generated tools. The base registry lives in `src/tools.ts`; this appendix also tracks MCP wrappers, SDK-only synthetic tools, and source-only gated entries that do not belong in the main catalog.

## File Operations

<details>
<summary><strong>Read</strong> — Read a file from the local filesystem</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `file_path` | string | Yes | Absolute path to the file |
| `offset` | number | No | Line number to start reading from |
| `limit` | number | No | Number of lines to read (default: 2000) |
| `pages` | string | No | Page range for PDFs (e.g., "1-5") |

Source: `src/tools/FileReadTool/`

</details>

<details>
<summary><strong>Write</strong> — Write a file to the local filesystem</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `file_path` | string | Yes | Absolute path to write to |
| `content` | string | Yes | Content to write |

Source: `src/tools/FileWriteTool/`

</details>

<details>
<summary><strong>Edit</strong> — Perform exact string replacements in files</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `file_path` | string | Yes | Absolute path to the file |
| `old_string` | string | Yes | The text to replace |
| `new_string` | string | Yes | The replacement text (must differ from old_string) |
| `replace_all` | boolean | No | Replace all occurrences (default: false) |

Source: `src/tools/FileEditTool/`

</details>

<details>
<summary><strong>Glob</strong> — Fast file pattern matching</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `pattern` | string | Yes | Glob pattern to match (e.g., `**/*.ts`) |
| `path` | string | No | Directory to search in (default: cwd) |

Source: `src/tools/GlobTool/`

</details>

<details>
<summary><strong>Grep</strong> — Content search powered by ripgrep</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `pattern` | string | Yes | Regex pattern to search for |
| `path` | string | No | File or directory to search in |
| `glob` | string | No | File filter (e.g., `*.js`) |
| `output_mode` | enum | No | `content`, `files_with_matches`, or `count` |
| `-B` | number | No | Lines to show before each match |
| `-A` | number | No | Lines to show after each match |
| `-C` / `context` | number | No | Lines before and after each match |
| `-n` | boolean | No | Show line numbers (default: true) |
| `-i` | boolean | No | Case insensitive search |
| `type` | string | No | File type filter (e.g., `js`, `py`) |
| `head_limit` | number | No | Limit output to first N results |
| `offset` | number | No | Skip first N results |
| `multiline` | boolean | No | Enable multiline regex mode |

Source: `src/tools/GrepTool/`

</details>

<details>
<summary><strong>NotebookEdit</strong> — Edit Jupyter notebook cells</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `notebook_path` | string | Yes | Absolute path to .ipynb file |
| `cell_id` | string | No | Cell ID to edit |
| `new_source` | string | Yes | New source content for the cell |
| `cell_type` | enum | No | `code` or `markdown` |
| `edit_mode` | enum | No | `replace`, `insert`, or `delete` |

Source: `src/tools/NotebookEditTool/`

</details>

## Shell Execution & REPL

<details>
<summary><strong>Bash</strong> — Execute shell commands</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `command` | string | Yes | The command to execute |
| `description` | string | Yes | Description of what the command does |
| `timeout` | number | No | Timeout in ms (default: 120000, max: 600000) |
| `run_in_background` | boolean | No | Run in background |
| `dangerouslyDisableSandbox` | boolean | No | Override sandbox restrictions |

Source: `src/tools/BashTool/`

</details>

<details>
<summary><strong>PowerShell</strong> — Execute PowerShell commands (Windows)</summary>

Similar schema to Bash, but for Windows PowerShell environments. Disabled on macOS/Linux.

Source: `src/tools/PowerShellTool/`

</details>

## Web Tools

<details>
<summary><strong>WebSearch</strong> — Search the web</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `query` | string | Yes | Search query (min 2 chars) |
| `allowed_domains` | string[] | No | Only include results from these domains |
| `blocked_domains` | string[] | No | Exclude results from these domains |

Source: `src/tools/WebSearchTool/`

</details>

<details>
<summary><strong>WebFetch</strong> — Fetch content from a URL</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `url` | string | Yes | URL to fetch |
| `prompt` | string | Yes | Prompt to run on fetched content |

Source: `src/tools/WebFetchTool/`

</details>

## Agent & Communication

<details>
<summary><strong>Agent</strong> — Spawn a sub-agent for autonomous tasks</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `prompt` | string | Yes | Task for the agent to perform |
| `description` | string | Yes | Short (3-5 word) task summary |
| `subagent_type` | string | No | Agent type (e.g., `Explore`, `Plan`, `general-purpose`) |
| `model` | enum | No | Model override: `sonnet`, `opus`, or `haiku` |
| `run_in_background` | boolean | No | Run as background task |
| `name` | string | No | Name for the spawned agent |
| `isolation` | enum | No | `worktree` for git isolation |

Source: `src/tools/AgentTool/`

</details>

<details>
<summary><strong>SendMessage</strong> — Send a message to another agent</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `to` | string | Yes | Recipient (agent name, ID, or `*` for broadcast) |
| `message` | string/object | Yes | Message content |
| `summary` | string | No | 5-10 word preview |

Source: `src/tools/SendMessageTool/`

</details>

## Task Management & Todos

<details>
<summary><strong>TaskCreate</strong> — Create a new background task</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `subject` | string | Yes | Brief task title |
| `description` | string | Yes | What needs to be done |
| `activeForm` | string | No | Present continuous form for spinner text |
| `metadata` | object | No | Arbitrary metadata |

Source: `src/tools/TaskCreateTool/`

</details>

<details>
<summary><strong>TaskUpdate</strong> — Update a task's status</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `taskId` | string | Yes | ID of task to update |
| `status` | enum | No | `pending`, `in_progress`, `completed`, or `deleted` |
| `subject` | string | No | New title |
| `description` | string | No | New description |

Source: `src/tools/TaskUpdateTool/`

</details>

<details>
<summary><strong>TaskList</strong> — List all tasks</summary>

No parameters.

Source: `src/tools/TaskListTool/`

</details>

<details>
<summary><strong>TaskGet</strong> — Get a specific task by ID</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `taskId` | string | Yes | Task ID to retrieve |

Source: `src/tools/TaskGetTool/`

</details>

<details>
<summary><strong>TaskOutput</strong> — Get output from a task</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `task_id` | string | Yes | Task ID |
| `block` | boolean | No | Wait for completion (default: true) |
| `timeout` | number | No | Max wait time in ms (default: 30000) |

Source: `src/tools/TaskOutputTool/`

</details>

<details>
<summary><strong>TaskStop</strong> — Stop a running background task</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `task_id` | string | No | ID of the task to stop |

Source: `src/tools/TaskStopTool/`

</details>

<details>
<summary><strong>TodoWrite</strong> — Manage the session task checklist</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `todos` | array | Yes | Updated todo list — each item has `status` and `content` |

Source: `src/tools/TodoWriteTool/`

</details>

## Code Intelligence

<details>
<summary><strong>LSP</strong> — Language Server Protocol operations</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `operation` | enum | Yes | `goToDefinition`, `findReferences`, `hover`, `documentSymbol`, `workspaceSymbol`, `goToImplementation`, `prepareCallHierarchy`, `incomingCalls`, `outgoingCalls` |
| `filePath` | string | Yes | Path to the file |
| `line` | number | Yes | Line number (1-based) |
| `character` | number | Yes | Character offset (1-based) |

Source: `src/tools/LSPTool/`

</details>

## MCP Tools

<details>
<summary><strong>MCPTool</strong> — Runtime wrapper for a connected MCP server tool</summary>

Dynamic input schema — each connected MCP server contributes its own schema and the tool is named `mcp__<server>__<tool>`.

Source: `src/tools/MCPTool/`, wrapped from `src/services/mcp/client.ts`

</details>

<details>
<summary><strong>ListMcpResources</strong> — List resources from connected MCP servers</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `server` | string | No | Filter by specific server name |

Source: `src/tools/ListMcpResourcesTool/`

</details>

<details>
<summary><strong>ReadMcpResource</strong> — Read a specific MCP resource by URI</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `server` | string | Yes | MCP server name |
| `uri` | string | Yes | Resource URI to read |

Source: `src/tools/ReadMcpResourceTool/`

</details>

<details>
<summary><strong>McpAuth</strong> — Authenticate an MCP server (OAuth flow)</summary>

No parameters. Tool name is generated dynamically as `mcp__<serverName>__authenticate`.

Source: `src/tools/McpAuthTool/`

</details>

## Extensions

<details>
<summary><strong>Skill</strong> — Execute a skill (prompt template)</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `skill` | string | Yes | Skill name to invoke |
| `args` | string | No | Optional arguments |

Source: `src/tools/SkillTool/`

</details>

<details>
<summary><strong>ToolSearch</strong> — Search for deferred tools</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `query` | string | Yes | Search query or `select:<tool_name>` |
| `max_results` | number | No | Max results (default: 5) |

Source: `src/tools/ToolSearchTool/`

</details>

<details>
<summary><strong>AskUserQuestion</strong> — Ask the user multiple choice questions</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `questions` | array | Yes | 1-4 question objects, each with `question`, `header`, and `options` |

Source: `src/tools/AskUserQuestionTool/`

</details>

<details>
<summary><strong>Config</strong> — Get or set Claude Code configuration</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `setting` | string | Yes | Setting key (e.g., `theme`, `model`) |
| `value` | string/boolean/number | No | New value (omit to get current) |

Source: `src/tools/ConfigTool/`

</details>

<details>
<summary><strong>StructuredOutput</strong> — Return response as structured JSON</summary>

Dynamic input — validated against a provided schema at runtime.

Source: `src/tools/SyntheticOutputTool/`

</details>

## Teams (Multi-Agent)

<details>
<summary><strong>TeamCreate</strong> — Create a multi-agent swarm team</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `team_name` | string | Yes | Name for the team |
| `description` | string | No | Team purpose |
| `agent_type` | string | No | Role of team lead |

Source: `src/tools/TeamCreateTool/`

</details>

<details>
<summary><strong>TeamDelete</strong> — Clean up a swarm team</summary>

No parameters.

Source: `src/tools/TeamDeleteTool/`

</details>

## Planning & Worktrees

<details>
<summary><strong>EnterPlanMode</strong> — Switch to plan mode</summary>

No parameters.

Source: `src/tools/EnterPlanModeTool/`

</details>

<details>
<summary><strong>EnterWorktree</strong> — Create an isolated git worktree</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `name` | string | No | Optional name for the worktree |

Source: `src/tools/EnterWorktreeTool/`

</details>

<details>
<summary><strong>ExitWorktree</strong> — Exit a worktree session</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `action` | enum | Yes | `keep` or `remove` |
| `discard_changes` | boolean | No | Discard changes when removing |

Source: `src/tools/ExitWorktreeTool/`

</details>

<details>
<summary><strong>ExitPlanMode</strong> — Prompt user to exit plan mode and start coding</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `allowedPrompts` | array | No | Permission prompts needed for implementation |

Source: `src/tools/ExitPlanModeTool/`

</details>

<details>
<summary><strong>VerifyPlanExecution</strong> — Verify plan was executed correctly</summary>

Internal tool used by the plan mode system. Stub in public build.

Source: `src/tools/VerifyPlanExecutionTool/`

</details>

## Scheduling & Cron

<details>
<summary><strong>RemoteTrigger</strong> — Manage scheduled remote agent triggers</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `action` | enum | Yes | `list`, `get`, `create`, `update`, or `run` |
| `trigger_id` | string | No | Required for get, update, run |
| `body` | object | No | JSON body for create/update |

Source: `src/tools/RemoteTriggerTool/`

</details>

<details>
<summary><strong>CronCreate</strong> — Schedule a prompt to run on a cron schedule</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `cron` | string | Yes | Standard 5-field cron expression |
| `prompt` | string | Yes | The prompt to run at each fire time |
| `recurring` | boolean | No | Fire on every match or once (default: true) |
| `durable` | boolean | No | Persist to disk or session-only (default: false) |

Source: `src/tools/ScheduleCronTool/`

</details>

<details>
<summary><strong>CronDelete</strong> — Cancel a scheduled cron job</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `id` | string | Yes | Job ID from CronCreate |

Source: `src/tools/ScheduleCronTool/`

</details>

<details>
<summary><strong>CronList</strong> — List active cron jobs</summary>

No parameters.

Source: `src/tools/ScheduleCronTool/`

</details>

<details>
<summary><strong>Sleep</strong> — Wait for a specified duration</summary>

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `duration` | number | Yes | Duration in milliseconds |

Source: `src/tools/SleepTool/`

</details>

## Stubs & Feature-Gated

These tools are referenced by the source registry, or present as stubs, but are not part of the stable/common catalog:

| Tool | Registry / Status | Recovered Source | Notes |
|------|-------------------|------------------|-------|
| `BriefTool` / `SendUserMessage` | `feature('KAIROS')` or `feature('KAIROS_BRIEF')` | Yes | Message-to-user tool; prompt source says "Send a message to the user" |
| `REPLTool` | `process.env.USER_TYPE === 'ant'` | Partial stub | Present as `src/tools/REPLTool/REPLTool.ts`, but recovered implementation is only a stub shell |
| `WorkflowTool` | `feature('WORKFLOW_SCRIPTS')` | Partial stub | Registry and constants are present, but `WorkflowTool.js` was not recovered in this source tree |
| `SuggestBackgroundPRTool` | `process.env.USER_TYPE === 'ant'` | Stub | Recovered file is an empty class |
| `TungstenTool` | `process.env.USER_TYPE === 'ant'` | Stub | Recovered file explicitly says the real tool is not in the source map |
| `TestingPermissionTool` / `TestingPermission` | `process.env.NODE_ENV === 'test'` | Yes | Testing-only tool that always asks for permission |
| `WebBrowserTool` | `feature('WEB_BROWSER_TOOL')` | No | Referenced from `src/tools.ts`, but no implementation directory was recovered |
| `MonitorTool` | `feature('MONITOR_TOOL')` | No | Referenced from `src/tools.ts`, but no implementation directory was recovered |
| `SendUserFileTool` | `feature('KAIROS')` | No | Referenced from `src/tools.ts`, but no implementation directory was recovered |
| `PushNotificationTool` | `feature('KAIROS')` or `feature('KAIROS_PUSH_NOTIFICATION')` | No | Referenced from `src/tools.ts`, but no implementation directory was recovered |
| `SubscribePRTool` | `feature('KAIROS_GITHUB_WEBHOOKS')` | No | Referenced from `src/tools.ts`, but no implementation directory was recovered |
| `SnipTool` | `feature('HISTORY_SNIP')` | No | Referenced from `src/tools.ts`, but no implementation directory was recovered |
| `ListPeersTool` | `feature('UDS_INBOX')` | No | Referenced from `src/tools.ts`, but no implementation directory was recovered |
| `CtxInspectTool` | `feature('CONTEXT_COLLAPSE')` | No | Referenced from `src/tools.ts`, but no implementation directory was recovered |
| `TerminalCaptureTool` | `feature('TERMINAL_PANEL')` | No | Referenced from `src/tools.ts`, but no implementation directory was recovered |
| `OverflowTestTool` | `feature('OVERFLOW_TEST_TOOL')` | No | Referenced from `src/tools.ts`, but no implementation directory was recovered |
