import React from 'react';
import s from './CommandCatalog.module.css';

type CommandFamily = {
  name: string;
  examples: string[];
  source: string;
  tone?: 'default' | 'accent' | 'gated';
};

type CommandSection = {
  title: string;
  description?: string;
  families: CommandFamily[];
};

/* ================================================================
   Source-backed command family map.
   Primary source: claude-code-source/src/commands.ts
   This is intentionally organizational, not exhaustive per-command docs.
   ================================================================ */
const SECTIONS: CommandSection[] = [
  {
    title: 'Session & Navigation',
    families: [
      {
        name: 'Session lifecycle',
        examples: ['/clear', '/resume', '/session', '/rewind', '/exit'],
        source: 'commands/clear, commands/resume, commands/session, commands/rewind, commands/exit',
      },
      {
        name: 'Discovery / help',
        examples: ['/help', '/status', '/stats', '/version'],
        source: 'commands/help, commands/status, commands/stats, commands/version',
      },
      {
        name: 'Output / clipboard',
        examples: ['/copy', '/output-style', '/statusline'],
        source: 'commands/copy, commands/output-style, commands/statusline',
      },
    ],
  },
  {
    title: 'Config, Permissions & Personalization',
    families: [
      {
        name: 'Core config',
        examples: ['/model', '/config', '/permissions', '/privacy-settings'],
        source: 'commands/model, commands/config, commands/permissions, commands/privacy-settings',
      },
      {
        name: 'UX preferences',
        examples: ['/theme', '/vim', '/keybindings', '/color'],
        source: 'commands/theme, commands/vim, commands/keybindings, commands/color',
      },
      {
        name: 'Execution posture',
        examples: ['/plan', '/fast', '/effort', '/passes', '/sandbox-toggle'],
        source: 'commands/plan, commands/fast, commands/effort, commands/passes, commands/sandbox-toggle',
      },
    ],
  },
  {
    title: 'Context, Memory & Files',
    families: [
      {
        name: 'Memory / compaction',
        examples: ['/memory', '/compact', '/context'],
        source: 'commands/memory, commands/compact, commands/context',
      },
      {
        name: 'File / repo helpers',
        examples: ['/files', '/diff', '/branch', '/rename'],
        source: 'commands/files, commands/diff, commands/branch, commands/rename',
      },
      {
        name: 'Hooks / tags',
        examples: ['/hooks', '/tag'],
        source: 'commands/hooks, commands/tag',
      },
    ],
  },
  {
    title: 'Review & Development Workflows',
    families: [
      {
        name: 'Reviews',
        examples: ['/review', '/ultrareview', '/security-review'],
        source: 'commands/review, commands/security-review',
        tone: 'accent',
      },
      {
        name: 'Change workflows',
        examples: ['/commit', '/pr_comments'],
        source: 'commands/commit, commands/pr_comments',
      },
      {
        name: 'Diagnostics / support',
        examples: ['/doctor', '/feedback', '/bughunter', '/advisor'],
        source: 'commands/doctor, commands/feedback, commands/bughunter, commands/advisor',
      },
    ],
  },
  {
    title: 'Extensions & Multi-Agent Features',
    families: [
      {
        name: 'MCP / plugins / skills',
        examples: ['/mcp', '/plugin', '/reload-plugins', '/skills'],
        source: 'commands/mcp, commands/plugin, commands/reload-plugins, commands/skills',
      },
      {
        name: 'Agents / tasks',
        examples: ['/agents', '/tasks'],
        source: 'commands/agents, commands/tasks',
      },
      {
        name: 'IDE / remote env',
        examples: ['/ide', '/remote-env'],
        source: 'commands/ide, commands/remote-env',
      },
    ],
  },
  {
    title: 'Auth, Usage & Installation',
    families: [
      {
        name: 'Auth / account',
        examples: ['/login', '/logout', '/status'],
        source: 'commands/login, commands/logout, commands/status',
      },
      {
        name: 'Usage / limits',
        examples: ['/usage', '/extra-usage', '/cost', '/rate-limit-options'],
        source: 'commands/usage, commands/extra-usage, commands/cost, commands/rate-limit-options',
      },
      {
        name: 'Setup / upgrade',
        examples: ['/init', '/upgrade', '/terminalSetup', '/install-github-app', '/install-slack-app'],
        source: 'commands/init, commands/upgrade, commands/terminalSetup, commands/install-github-app, commands/install-slack-app',
      },
    ],
  },
  {
    title: 'Feature-Gated & Internal Families',
    description:
      'These families are present in src/commands.ts but only load when a feature flag, subscriber type, or internal build condition allows them.',
    families: [
      {
        name: 'Remote / bridge',
        examples: ['bridge', 'remoteControlServerCommand', 'teleport', 'mobile', 'desktop'],
        source: 'feature-gated imports in src/commands.ts',
        tone: 'gated',
      },
      {
        name: 'Assistant / proactive',
        examples: ['assistant', 'brief', 'proactive', 'subscribe-pr'],
        source: 'feature-gated imports in src/commands.ts',
        tone: 'gated',
      },
      {
        name: 'Voice / peer / buddy flows',
        examples: ['voice', 'peers', 'buddy', 'fork'],
        source: 'feature-gated imports in src/commands.ts',
        tone: 'gated',
      },
      {
        name: 'Workflow / automation',
        examples: ['workflows', 'dynamic workflow commands from WorkflowTool'],
        source: 'feature-gated imports and workflow command generation',
        tone: 'gated',
      },
      {
        name: 'Internal-only imports',
        examples: ['autofix-pr', 'agents-platform', 'summary', 'ant-trace', 'bridge-kick'],
        source: 'INTERNAL_ONLY_COMMANDS in src/commands.ts',
        tone: 'gated',
      },
    ],
  },
];

function familyToneClass(tone: CommandFamily['tone']): string {
  if (tone === 'accent') return s.cardAccent;
  if (tone === 'gated') return s.cardGated;
  return '';
}

export default function CommandCatalog(): React.JSX.Element {
  return (
    <div className={s.catalog}>
      {SECTIONS.map((section) => (
        <section key={section.title} className={s.section}>
          <div className={s.sectionHeader}>
            <h2 className={s.sectionTitle}>{section.title}</h2>
            {section.description && (
              <p className={s.sectionDescription}>{section.description}</p>
            )}
          </div>

          <div className={s.grid}>
            {section.families.map((family) => (
              <article
                key={`${section.title}-${family.name}`}
                className={`${s.card} ${familyToneClass(family.tone)}`}
              >
                <div className={s.cardTitle}>{family.name}</div>
                <div className={s.exampleRow}>
                  {family.examples.map((example) => (
                    <code key={example} className={s.exampleChip}>
                      {example}
                    </code>
                  ))}
                </div>
                <div className={s.sourceLabel}>Source signals</div>
                <div className={s.sourceText}>{family.source}</div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
