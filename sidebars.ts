import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  anatomySidebar: [
    'overview',
    'build-guide',
    {
      type: 'category',
      label: 'Core Architecture',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Agent Loop',
          collapsed: false,
          items: [
            'core/agent-loop',
            'core/sub-agents-coordination',
            'core/agent-loop-in-the-wild',
          ],
        },
        {
          type: 'category',
          label: 'Tool System',
          items: [
            'tools/tool-architecture',
            'tools/tool-sources',
            'tools/built-in-tools',
            'tools/tool-execution',
            'tools/tool-system-in-the-wild',
          ],
        },
        'core/task-management',
        'core/prompt-memory-context',
        'core/state-sessions',
      ],
    },
    {
      type: 'category',
      label: 'Extensions',
      items: [
        'extensions/command-system',
        'extensions/mcp-integration',
        'extensions/lsp-ide-integration',
        'extensions/plugins-skills',
        'extensions/hooks',
      ],
    },
    {
      type: 'category',
      label: 'Security & Permissions',
      items: [
        'security/permission-model',
        'security/sandbox-safety',
      ],
    },
    {
      type: 'category',
      label: 'Runtime & Infrastructure',
      items: [
        'core/startup-bootstrap',
        'core/headless-query-engine-sdk-protocol',
        'core/input-rendering',
        'runtime/prompt-suggestions-speculation',
        'core/api-client',
        'runtime/remote-sessions-teleport-remote-control',
        'ui/components-rendering',
        'observability/analytics-telemetry',
      ],
    },
    {
      type: 'category',
      label: 'Appendix',
      items: [
        'appendix/feature-flags',
        'appendix/tool-definitions',
        'appendix/command-catalog',
        'appendix/directory-map',
        'appendix/glossary',
      ],
    },
  ],
};

export default sidebars;
