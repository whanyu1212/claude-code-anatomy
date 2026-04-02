import React from 'react';
import s from './SystemPromptStack.module.css';

interface Layer {
  order: number;
  name: string;
  desc: string;
  tokens: string;
  file: string;
  category: 'required' | 'context' | 'optional';
}

const layers: Layer[] = [
  {
    order: 1,
    name: 'Base Prompt',
    desc: "Claude's identity, role, tone, and behavior rules",
    tokens: '~3,000',
    file: 'src/constants/prompts.ts',
    category: 'required',
  },
  {
    order: 2,
    name: 'Tool Definitions',
    desc: 'Name, description, and JSON Schema for each of 45+ tools',
    tokens: '~4,000',
    file: 'src/tools/',
    category: 'required',
  },
  {
    order: 3,
    name: 'Permission Context',
    desc: 'Current mode (ask/auto), allowed/denied patterns, policy limits',
    tokens: '~500',
    file: 'src/utils/permissions/',
    category: 'context',
  },
  {
    order: 4,
    name: 'CLAUDE.md Content',
    desc: 'Merged layers: enterprise → global → project → local',
    tokens: 'varies',
    file: 'src/utils/claude-md/',
    category: 'context',
  },
  {
    order: 5,
    name: 'System Context',
    desc: 'Git status, OS info, working directory, shell, IDE',
    tokens: '~800',
    file: 'src/utils/environment/',
    category: 'context',
  },
  {
    order: 6,
    name: 'Plugin Prompts',
    desc: 'Custom instructions injected by loaded plugins',
    tokens: 'varies',
    file: 'src/services/plugins/',
    category: 'optional',
  },
  {
    order: 7,
    name: 'Active Skill Content',
    desc: 'Prompt template from a /skill command, if invoked',
    tokens: 'varies',
    file: 'src/skills/',
    category: 'optional',
  },
];

const barClass = {
  required: s.barRequired,
  context: s.barContext,
  optional: s.barOptional,
};

const catClass = {
  required: s.categoryRequired,
  context: s.categoryContext,
  optional: s.categoryOptional,
};

const catLabels = {
  required: 'Always Included',
  context: 'Context-Dependent',
  optional: 'When Active',
};

export default function SystemPromptStack(): React.JSX.Element {
  let lastCategory: string | null = null;

  return (
    <div className={s.container}>
      <div className={s.header}>
        <span className={s.headerLabel}>system_prompt</span>
        <span className={s.headerSize}>assembled before every API call</span>
      </div>

      <div className={s.stack}>
        {layers.map((layer) => {
          const showCategory = layer.category !== lastCategory;
          lastCategory = layer.category;

          return (
            <React.Fragment key={layer.order}>
              {showCategory && (
                <div className={`${s.categoryLabel} ${catClass[layer.category]}`}>
                  {catLabels[layer.category]}
                </div>
              )}
              <div className={s.layer}>
                <div className={s.layerOrder}>{layer.order}</div>
                <div className={`${s.layerBar} ${barClass[layer.category]}`} />
                <div className={s.layerContent}>
                  <div className={s.layerName}>{layer.name}</div>
                  <div className={s.layerDesc}>{layer.desc}</div>
                </div>
                <div className={s.layerMeta}>
                  <div className={s.layerTokens}>{layer.tokens}</div>
                  <div className={s.layerFile}>{layer.file}</div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className={s.footer}>
        <span className={s.footerNote}>Total varies by project — typically 10,000+ tokens</span>
        <span className={s.footerTotal}>~10K+</span>
      </div>
    </div>
  );
}
