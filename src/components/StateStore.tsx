import React, { useState } from 'react';
import s from './StateStore.module.css';

interface Field {
  name: string;
  type: string;
  example?: string;
}

interface FieldGroup {
  icon: string;
  label: string;
  colorClass: string;
  fields: Field[];
}

const groups: FieldGroup[] = [
  {
    icon: '💬',
    label: 'Conversation',
    colorClass: s.groupConversation,
    fields: [
      { name: 'messages', type: 'Message[]', example: '[user, assistant, tool_result, ...]' },
      { name: 'conversationId', type: 'string', example: '"conv_a1b2c3d4"' },
      { name: 'mainLoopModel', type: 'string', example: '"claude-sonnet-4-20250514"' },
      { name: 'speculationState', type: 'SpeculationState', example: 'idle | speculating' },
      { name: 'promptSuggestion', type: '{ text, promptId }', example: '"Try /commit"' },
    ],
  },
  {
    icon: '🔒',
    label: 'Permissions',
    colorClass: s.groupPermissions,
    fields: [
      { name: 'toolPermissionContext', type: 'ToolPermissionContext', example: 'mode: "default"' },
      { name: 'permissionMode', type: 'PermissionMode', example: '"default" | "auto" | ...' },
      { name: 'permissionRules', type: 'PermissionRule[]', example: '[Bash(git *): allow]' },
    ],
  },
  {
    icon: '📋',
    label: 'Tasks',
    colorClass: s.groupTasks,
    fields: [
      { name: 'tasks', type: 'TaskState[]', example: '[{ id, status, type }]' },
      { name: 'backgroundTaskCount', type: 'number', example: '2' },
    ],
  },
  {
    icon: '🖥️',
    label: 'UI State',
    colorClass: s.groupUI,
    fields: [
      { name: 'verbosity', type: 'boolean', example: 'false' },
      { name: 'isStreaming', type: 'boolean', example: 'true' },
      { name: 'currentToolUse', type: 'ToolUse | null', example: 'Read("src/app.ts")' },
      { name: 'inputHistory', type: 'string[]', example: '["fix bug", "run tests"]' },
    ],
  },
];

export default function StateStoreViz(): React.JSX.Element {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['Conversation', 'Permissions']));

  const toggle = (label: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const totalFields = groups.reduce((sum, g) => sum + g.fields.length, 0);

  return (
    <div className={s.storeContainer}>
      <div className={s.storeHeader}>
        <span className={s.storeTitle}>AppState</span>
        <span className={s.storeSubtitle}>single source of truth — immutable updates only</span>
      </div>

      <div className={s.storeBody}>
        {groups.map((group) => {
          const isOpen = expanded.has(group.label);
          return (
            <div key={group.label} className={s.fieldGroup}>
              <div
                className={`${s.fieldGroupHeader} ${group.colorClass}`}
                onClick={() => toggle(group.label)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') toggle(group.label); }}
              >
                <span className={s.fieldGroupIcon}>{group.icon}</span>
                <span>{group.label}</span>
                <span className={s.fieldGroupCount}>
                  {isOpen ? '▾' : '▸'} {group.fields.length} fields
                </span>
              </div>
              {isOpen && (
                <div className={s.fields}>
                  {group.fields.map((field) => (
                    <div key={field.name} className={s.field}>
                      <span className={s.fieldName}>{field.name}</span>
                      <span className={s.fieldType}>{field.type}</span>
                      {field.example && (
                        <span className={s.fieldValue}>{field.example}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={s.storeFooter}>
        <span>{totalFields} fields shown (50+ total)</span>
        <span>src/state/AppStateStore.ts</span>
      </div>
    </div>
  );
}
