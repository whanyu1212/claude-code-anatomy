import React from 'react';
import s from './InitTimeline.module.css';

interface Phase {
  icon: string;
  name: string;
  desc: string;
  file?: string;
  items?: Array<{ label: string; accent?: boolean }>;
  highlight?: boolean;
}

const phases: Phase[] = [
  {
    icon: '📂',
    name: 'Load Configuration',
    desc: 'Read settings from multiple sources and merge them.',
    file: 'src/utils/settings/',
    items: [
      { label: '~/.claude/settings.json' },
      { label: '.claude.json (project)' },
      { label: 'Environment variables' },
    ],
  },
  {
    icon: '🔑',
    name: 'Authenticate',
    desc: 'Validate API key or stored OAuth tokens. Prompt if missing.',
    file: 'src/utils/auth.ts',
    items: [
      { label: 'ANTHROPIC_API_KEY' },
      { label: 'OAuth tokens' },
      { label: 'Interactive login' },
    ],
  },
  {
    icon: '🎛️',
    name: 'Feature Flags',
    desc: 'Initialize GrowthBook with 90+ runtime feature flags.',
    file: 'src/services/analytics/',
    items: [
      { label: '90+ flags', accent: true },
      { label: 'A/B testing' },
      { label: 'Gradual rollouts' },
    ],
  },
  {
    icon: '🔧',
    name: 'Register Tools & Commands',
    desc: 'Load all built-in tools and slash commands into the registry.',
    file: 'src/tools/ + src/commands/',
    items: [
      { label: '45+ tools', accent: true },
      { label: '100+ commands', accent: true },
      { label: 'Zod schemas' },
    ],
  },
  {
    icon: '🔌',
    name: 'Connect MCP Servers',
    desc: 'Start configured MCP servers and enumerate their tools.',
    file: 'src/services/mcp/',
    items: [
      { label: 'stdio / SSE / HTTP' },
      { label: 'Tool enumeration' },
      { label: 'Resource listing' },
    ],
  },
  {
    icon: '🧩',
    name: 'Load Plugins & Skills',
    desc: 'Discover plugins and skill files, register their commands and tools.',
    file: 'src/plugins/ + src/skills/',
    items: [
      { label: '~/.claude/plugins/' },
      { label: '~/.claude/skills/' },
      { label: 'Bundled skills' },
    ],
  },
  {
    icon: '🔒',
    name: 'Build Permission Context',
    desc: 'Merge permission rules from CLI flags, user settings, project config, and enterprise policies.',
    file: 'src/utils/permissions/',
    items: [
      { label: 'Permission mode' },
      { label: 'Allow/deny rules' },
      { label: 'Policy limits' },
    ],
  },
  {
    icon: '📊',
    name: 'Initialize Telemetry',
    desc: 'Set up OpenTelemetry exporters for traces, metrics, and logs.',
    file: 'src/services/analytics/',
    items: [
      { label: 'Traces' },
      { label: 'Metrics' },
      { label: 'Logs' },
    ],
  },
  {
    icon: '🖥️',
    name: 'Launch REPL',
    desc: 'Render the React/Ink terminal app. Ready for your first message.',
    file: 'src/replLauncher.tsx',
    highlight: true,
    items: [
      { label: 'React 19 + Ink 6', accent: true },
      { label: 'AppState store' },
      { label: 'Keyboard input active' },
    ],
  },
];

export default function InitTimeline(): React.JSX.Element {
  return (
    <div className={s.container}>
      <div className={s.trigger}>
        <span>cli.tsx</span>
        <span>→</span>
        <span>dynamic import main.tsx</span>
        <span>→</span>
        <span>initialization begins</span>
      </div>

      <div className={s.timeline}>
        {phases.map((phase, i) => (
          <div
            key={phase.name}
            className={`${s.phase} ${phase.highlight ? s.phaseHighlight : s.phaseComplete}`}
          >
            <div className={s.phaseHeader}>
              <div className={s.phaseIcon}>{phase.icon}</div>
              <div className={s.phaseName}>{phase.name}</div>
              {phase.file && <div className={s.phaseFile}>{phase.file}</div>}
            </div>
            <div className={s.phaseDesc}>{phase.desc}</div>
            {phase.items && (
              <div className={s.phaseItems}>
                {phase.items.map((item) => (
                  <span
                    key={item.label}
                    className={`${s.phaseItem} ${item.accent ? s.phaseItemAccent : ''}`}
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
