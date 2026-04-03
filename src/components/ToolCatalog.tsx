import React, { useState, useMemo } from 'react';
import s from './ToolCatalog.module.css';

/* ================================================================
   Data — stable/common built-in tools surfaced in the main docs.
   Source of truth for the base registry is claude-code-source/src/tools.ts
   (getAllBaseTools). Dynamic MCP wrappers and SDK-only synthetic tools are
   documented in the appendix instead of this catalog.
   ================================================================ */

type Badge = 'read-only' | 'concurrent' | 'approval' | 'destructive' | 'internal';

interface ToolDef {
  name: string;
  impl: string;
  desc: string;
  badges: Badge[];
  input: string;
  features?: string;
  source: string;
  category: string;
}

const TOOLS: ToolDef[] = [
  // File Operations
  { name: 'Read', impl: 'FileReadTool', desc: 'Reads file contents with line numbers. Supports text, images, PDFs, notebooks.', badges: ['read-only', 'concurrent'], input: 'file_path, offset?, limit?, pages?', source: 'src/tools/FileReadTool/', category: 'File' },
  { name: 'Write', impl: 'FileWriteTool', desc: 'Creates new files or completely overwrites existing ones.', badges: ['approval'], input: 'file_path, content', features: 'Warns if overwriting unread file', source: 'src/tools/FileWriteTool/', category: 'File' },
  { name: 'Edit', impl: 'FileEditTool', desc: 'Exact string replacements in files. Requires old_string to be unique.', badges: ['approval'], input: 'file_path, old_string, new_string, replace_all?', features: 'Shows diff view of changes', source: 'src/tools/FileEditTool/', category: 'File' },
  { name: 'Glob', impl: 'GlobTool', desc: 'Fast file pattern matching. Returns paths sorted by modification time.', badges: ['read-only', 'concurrent'], input: 'pattern, path?', source: 'src/tools/GlobTool/', category: 'File' },
  { name: 'Grep', impl: 'GrepTool', desc: 'Content search powered by ripgrep. Supports regex and output modes.', badges: ['read-only', 'concurrent'], input: 'pattern, path?, glob?, type?, output_mode?, context flags', source: 'src/tools/GrepTool/', category: 'File' },
  { name: 'NotebookEdit', impl: 'NotebookEditTool', desc: 'Edits Jupyter notebook cells.', badges: ['approval'], input: 'notebook_path, cell_id?, new_source, cell_type?, edit_mode?', source: 'src/tools/NotebookEditTool/', category: 'File' },

  // Shell
  { name: 'Bash', impl: 'BashTool', desc: 'Executes shell commands. Most powerful and carefully guarded tool.', badges: ['approval', 'destructive'], input: 'command, description, timeout?, run_in_background?, dangerouslyDisableSandbox?', features: 'Background exec, timeout, working dir persistence', source: 'src/tools/BashTool/', category: 'Shell' },
  { name: 'PowerShell', impl: 'PowerShellTool', desc: 'Windows equivalent of Bash (disabled on macOS/Linux).', badges: ['approval', 'destructive'], input: 'command, description, timeout?', source: 'src/tools/PowerShellTool/', category: 'Shell' },

  // Web
  { name: 'WebSearch', impl: 'WebSearchTool', desc: 'Searches the web and returns results.', badges: ['read-only', 'concurrent'], input: 'query, allowed_domains?, blocked_domains?', source: 'src/tools/WebSearchTool/', category: 'Web' },
  { name: 'WebFetch', impl: 'WebFetchTool', desc: 'Fetches content from a URL. Handles HTML, JSON, plain text.', badges: ['read-only', 'concurrent'], input: 'url, prompt', source: 'src/tools/WebFetchTool/', category: 'Web' },

  // Agent & Communication
  { name: 'Agent', impl: 'AgentTool', desc: 'Spawns a sub-agent with its own conversation and filtered tools.', badges: ['internal'], input: 'prompt, description, subagent_type?, model?, isolation?, run_in_background?', features: 'Worktree isolation, background mode', source: 'src/tools/AgentTool/', category: 'Agent' },
  { name: 'SendMessage', impl: 'SendMessageTool', desc: 'Sends a message to a running sub-agent.', badges: ['internal'], input: 'to, message, summary?', source: 'src/tools/SendMessageTool/', category: 'Agent' },

  // Task Management
  { name: 'TaskCreate', impl: 'TaskCreateTool', desc: 'Creates a background task with subject and description.', badges: ['internal'], input: 'subject, description, activeForm?, metadata?', source: 'src/tools/TaskCreateTool/', category: 'Task' },
  { name: 'TaskUpdate', impl: 'TaskUpdateTool', desc: 'Updates a task\'s status or details.', badges: ['internal'], input: 'taskId, status?, subject?, description?', source: 'src/tools/TaskUpdateTool/', category: 'Task' },
  { name: 'TaskList', impl: 'TaskListTool', desc: 'Lists all active tasks.', badges: ['read-only', 'internal'], input: '(none)', source: 'src/tools/TaskListTool/', category: 'Task' },
  { name: 'TaskGet', impl: 'TaskGetTool', desc: 'Gets details of a specific task.', badges: ['read-only', 'internal'], input: 'taskId', source: 'src/tools/TaskGetTool/', category: 'Task' },
  { name: 'TaskOutput', impl: 'TaskOutputTool', desc: 'Retrieves output from a running or completed task.', badges: ['read-only', 'internal'], input: 'task_id, block?, timeout?', source: 'src/tools/TaskOutputTool/', category: 'Task' },
  { name: 'TaskStop', impl: 'TaskStopTool', desc: 'Stops a running task.', badges: ['internal'], input: 'task_id?', source: 'src/tools/TaskStopTool/', category: 'Task' },
  { name: 'TodoWrite', impl: 'TodoWriteTool', desc: 'Manages the session task checklist.', badges: ['internal'], input: 'todos (array of status + content)', source: 'src/tools/TodoWriteTool/', category: 'Task' },

  // Planning & Worktrees
  { name: 'EnterPlanMode', impl: 'EnterPlanModeTool', desc: 'Switches to plan mode — model creates a plan before executing.', badges: ['internal'], input: '(none)', source: 'src/tools/EnterPlanModeTool/', category: 'Planning' },
  { name: 'ExitPlanMode', impl: 'ExitPlanModeTool', desc: 'Exits plan mode and begins execution.', badges: ['internal'], input: 'allowedPrompts?', source: 'src/tools/ExitPlanModeTool/', category: 'Planning' },
  { name: 'EnterWorktree', impl: 'EnterWorktreeTool', desc: 'Creates an isolated git worktree for safe experimentation.', badges: ['internal'], input: 'name?', source: 'src/tools/EnterWorktreeTool/', category: 'Planning' },
  { name: 'ExitWorktree', impl: 'ExitWorktreeTool', desc: 'Exits a worktree session (keep or remove).', badges: ['internal'], input: 'action, discard_changes?', source: 'src/tools/ExitWorktreeTool/', category: 'Planning' },

  // MCP resource access tools are part of the base registry.
  // Dynamic MCP wrappers are created at runtime in src/services/mcp/client.ts.
  { name: 'ListMcpResources', impl: 'ListMcpResourcesTool', desc: 'Lists resources available from connected MCP servers.', badges: ['read-only', 'concurrent', 'internal'], input: 'server?', source: 'src/tools/ListMcpResourcesTool/', category: 'MCP' },
  { name: 'ReadMcpResource', impl: 'ReadMcpResourceTool', desc: 'Reads a specific MCP resource by URI.', badges: ['read-only', 'internal'], input: 'server, uri', source: 'src/tools/ReadMcpResourceTool/', category: 'MCP' },

  // Extensions & Infrastructure
  { name: 'Skill', impl: 'SkillTool', desc: 'Executes a loaded skill (prompt template).', badges: ['internal'], input: 'skill, args?', source: 'src/tools/SkillTool/', category: 'Infra' },
  { name: 'ToolSearch', impl: 'ToolSearchTool', desc: 'Searches for deferred tools by keyword, returns full schemas.', badges: ['read-only', 'internal'], input: 'query, max_results?', source: 'src/tools/ToolSearchTool/', category: 'Infra' },
  { name: 'AskUserQuestion', impl: 'AskUserQuestionTool', desc: 'Asks the user multiple choice questions.', badges: ['internal'], input: 'questions (1-4 question objects)', source: 'src/tools/AskUserQuestionTool/', category: 'Infra' },
  { name: 'Config', impl: 'ConfigTool', desc: 'Gets or sets Claude Code configuration.', badges: ['internal'], input: 'setting, value?', source: 'src/tools/ConfigTool/', category: 'Infra' },
  { name: 'Sleep', impl: 'SleepTool', desc: 'Waits for a specified duration. Used for polling patterns.', badges: ['internal'], input: 'duration (ms)', source: 'src/tools/SleepTool/', category: 'Infra' },
  { name: 'LSP', impl: 'LspTool', desc: 'Language Server Protocol operations for code intelligence.', badges: ['read-only', 'internal'], input: 'operation, filePath, line, character', source: 'src/tools/LSPTool/', category: 'Infra' },

  // Teams
  { name: 'TeamCreate', impl: 'TeamCreateTool', desc: 'Creates a multi-agent swarm team.', badges: ['internal'], input: 'team_name, description?, agent_type?', source: 'src/tools/TeamCreateTool/', category: 'Teams' },
  { name: 'TeamDelete', impl: 'TeamDeleteTool', desc: 'Cleans up a swarm team.', badges: ['internal'], input: '(none)', source: 'src/tools/TeamDeleteTool/', category: 'Teams' },

  // Scheduling & Cron
  { name: 'RemoteTrigger', impl: 'RemoteTriggerTool', desc: 'Manages scheduled remote agent triggers.', badges: ['internal'], input: 'action, trigger_id?, body?', source: 'src/tools/RemoteTriggerTool/', category: 'Cron' },
  { name: 'CronCreate', impl: 'ScheduleCronTool', desc: 'Schedules a prompt to run on a cron schedule.', badges: ['internal'], input: 'cron, prompt, recurring?, durable?', source: 'src/tools/ScheduleCronTool/', category: 'Cron' },
  { name: 'CronDelete', impl: 'ScheduleCronTool', desc: 'Cancels a scheduled cron job.', badges: ['internal'], input: 'id', source: 'src/tools/ScheduleCronTool/', category: 'Cron' },
  { name: 'CronList', impl: 'ScheduleCronTool', desc: 'Lists active cron jobs.', badges: ['read-only', 'internal'], input: '(none)', source: 'src/tools/ScheduleCronTool/', category: 'Cron' },
];

interface Category {
  id: string;
  icon: string;
  label: string;
}

const CATEGORIES: Category[] = [
  { id: 'all', icon: '📦', label: 'All' },
  { id: 'File', icon: '📄', label: 'File' },
  { id: 'Shell', icon: '💻', label: 'Shell' },
  { id: 'Web', icon: '🌐', label: 'Web' },
  { id: 'Agent', icon: '🤖', label: 'Agent' },
  { id: 'Task', icon: '📋', label: 'Task' },
  { id: 'Planning', icon: '🗺️', label: 'Planning' },
  { id: 'MCP', icon: '🔌', label: 'MCP' },
  { id: 'Infra', icon: '🔧', label: 'Infra' },
  { id: 'Teams', icon: '👥', label: 'Teams' },
  { id: 'Cron', icon: '⏰', label: 'Cron' },
];

const BADGE_CONFIG: Record<Badge, { label: string; cls: string; dotCls: string }> = {
  'read-only': { label: 'read-only', cls: s.badgeReadOnly, dotCls: s.chipDotTeal },
  'concurrent': { label: 'concurrent-safe', cls: s.badgeConcurrent, dotCls: s.chipDotGreen },
  'approval': { label: 'needs approval', cls: s.badgeApproval, dotCls: s.chipDotAmber },
  'destructive': { label: 'destructive', cls: s.badgeDestructive, dotCls: s.chipDotRed },
  'internal': { label: 'internal', cls: s.badgeInternal, dotCls: s.chipDotPurple },
};

/* ================================================================
   Component
   ================================================================ */

export default function ToolCatalog(): React.JSX.Element {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilters, setActiveFilters] = useState<Set<Badge>>(new Set());
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const toggleFilter = (badge: Badge) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(badge)) next.delete(badge);
      else next.add(badge);
      return next;
    });
  };

  const clearFilters = () => {
    setActiveFilters(new Set());
    setActiveCategory('all');
  };

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      if (activeCategory !== 'all' && tool.category !== activeCategory) return false;
      if (activeFilters.size > 0) {
        return Array.from(activeFilters).every((f) => tool.badges.includes(f));
      }
      return true;
    });
  }, [activeCategory, activeFilters]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: TOOLS.length };
    for (const tool of TOOLS) {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    }
    return counts;
  }, []);

  const hasActiveFilters = activeFilters.size > 0 || activeCategory !== 'all';

  return (
    <div className={s.container}>
      {/* Category tabs */}
      <div className={s.tabs}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`${s.tab} ${activeCategory === cat.id ? s.tabActive : ''}`}
            onClick={() => { setActiveCategory(cat.id); setExpandedTool(null); }}
          >
            <span className={s.tabIcon}>{cat.icon}</span>
            {cat.label}
            <span className={s.tabCount}>{categoryCounts[cat.id] || 0}</span>
          </button>
        ))}
      </div>

      {/* Filter chips */}
      <div className={s.filters}>
        {(Object.keys(BADGE_CONFIG) as Badge[]).map((badge) => (
          <button
            key={badge}
            className={`${s.chip} ${activeFilters.has(badge) ? s.chipActive : ''}`}
            onClick={() => toggleFilter(badge)}
          >
            <span className={`${s.chipDot} ${BADGE_CONFIG[badge].dotCls}`} />
            {BADGE_CONFIG[badge].label}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div className={s.grid}>
        {filteredTools.length === 0 && (
          <div className={s.empty}>
            No tools match the current filters.
            {hasActiveFilters && (
              <button className={s.clearBtn} onClick={clearFilters}>Clear filters</button>
            )}
          </div>
        )}
        {filteredTools.map((tool) => {
          const isExpanded = expandedTool === tool.name;
          return (
            <div
              key={tool.name}
              className={`${s.card} ${isExpanded ? s.cardActive : ''}`}
              onClick={() => setExpandedTool(isExpanded ? null : tool.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedTool(isExpanded ? null : tool.name); } }}
              aria-expanded={isExpanded}
            >
              <div className={s.cardHeader}>
                <span className={s.cardName}>{tool.name}</span>
                <span className={s.cardImpl}>{tool.impl}</span>
              </div>
              <div className={s.cardDesc}>{tool.desc}</div>
              <div className={s.badges}>
                {tool.badges.map((badge) => (
                  <span key={badge} className={`${s.badgePill} ${BADGE_CONFIG[badge].cls}`}>
                    {BADGE_CONFIG[badge].label}
                  </span>
                ))}
              </div>

              {isExpanded && (
                <div className={s.cardDetail}>
                  <div className={s.detailRow}>
                    <span className={s.detailLabel}>Input</span>
                    <span className={s.detailValue}>{tool.input}</span>
                  </div>
                  {tool.features && (
                    <div className={s.detailRow}>
                      <span className={s.detailLabel}>Features</span>
                      <span className={s.detailValue}>{tool.features}</span>
                    </div>
                  )}
                  <div className={s.detailSource}>{tool.source}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
