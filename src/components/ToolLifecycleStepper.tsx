import React, { useState } from 'react';
import s from './ToolLifecycleStepper.module.css';

interface Step {
  id: string;
  icon: string;
  title: string;
  /** Related method, hook, or concept */
  relatedCode: string;
  desc: string;
  badgeClass: string;
  detail: React.ReactNode;
}

const steps: Step[] = [
  {
    id: 'receive',
    icon: '📥',
    title: 'Receive tool_use',
    relatedCode: 'StreamingToolExecutor',
    desc: 'Model emits a tool_use block with name and JSON arguments.',
    badgeClass: s.badgeResult,
    detail: (
      <>
        The API stream yields a <code>content_block_start</code> with{' '}
        <code>type: "tool_use"</code>, followed by <code>content_block_delta</code>{' '}
        events containing partial JSON input. The <code>StreamingToolExecutor</code>{' '}
        accumulates chunks until the block is complete.
      </>
    ),
  },
  {
    id: 'validate',
    icon: '✅',
    title: 'Validate Input',
    relatedCode: 'inputSchema (Zod)',
    desc: 'Parse and validate arguments against the tool\'s schema.',
    badgeClass: s.badgeValidate,
    detail: (
      <>
        <code>buildTool()</code> wraps each tool's <code>call()</code> with Zod validation.
        The schema defined in the tool (e.g. <code>z.object({'{ path: z.string() }'})</code>)
        is used to parse input. Invalid input returns an error <code>tool_result</code> —
        the model typically retries with corrected arguments.
      </>
    ),
  },
  {
    id: 'permission',
    icon: '🔒',
    title: 'Check Permissions',
    relatedCode: 'checkPermissions()',
    desc: 'Evaluate against permission mode, rules, and classifier.',
    badgeClass: s.badgePermission,
    detail: (
      <>
        Calls <code>checkPermissions(input, context)</code> which returns{' '}
        <code>allow</code>, <code>deny</code>, or <code>ask</code>. In default mode,
        write operations show an approval dialog. In auto mode, a{' '}
        <code>BashSafetyClassifier</code> evaluates shell commands. Also checks{' '}
        <code>isReadOnly()</code> and <code>isDestructive()</code> flags.
      </>
    ),
  },
  {
    id: 'pre-hook',
    icon: '🪝',
    title: 'Pre-tool Hooks',
    relatedCode: 'hooks.pre_tool',
    desc: 'User-defined hooks can inspect, modify, or veto the call.',
    badgeClass: s.badgeHook,
    detail: (
      <>
        Hooks configured in <code>settings.json</code> run as shell commands.
        A pre-tool hook receives the tool name and input as JSON on stdin.
        It can return <code>{'{ "decision": "deny" }'}</code> to veto,{' '}
        <code>{'{ "decision": "allow" }'}</code> to approve, or modify the input.
        If the hook process exits non-zero, the tool call is denied.
      </>
    ),
  },
  {
    id: 'execute',
    icon: '⚙️',
    title: 'Execute — tool.call()',
    relatedCode: 'call()',
    desc: 'The tool\'s core logic runs: read files, run commands, search code.',
    badgeClass: s.badgeExecute,
    detail: (
      <>
        The main execution method receives <code>(args, context, canUseTool,
        parentMessage, onProgress)</code>. Read-only tools run in parallel
        via <code>Promise.all</code>. Write tools run sequentially.
        The <code>onProgress</code> callback streams partial results to the UI
        (spinners, diffs, partial output).
      </>
    ),
  },
  {
    id: 'stream',
    icon: '📡',
    title: 'Stream Progress',
    relatedCode: 'onProgress()',
    desc: 'Partial results rendered live — spinners, diffs, output.',
    badgeClass: s.badgeStream,
    detail: (
      <>
        Tools call <code>onProgress({'{ toolUseID, data }'})</code> during execution.
        The UI renders different visualizations per tool: <code>Read</code> shows
        line counts, <code>FileEdit</code> shows diffs, <code>Bash</code> shows
        live output, and <code>Agent</code> shows sub-agent status. Long outputs
        are truncated.
      </>
    ),
  },
  {
    id: 'post-hook',
    icon: '🪝',
    title: 'Post-tool Hooks',
    relatedCode: 'hooks.post_tool',
    desc: 'Hooks run after execution for logging, notifications, etc.',
    badgeClass: s.badgeHook,
    detail: (
      <>
        Post-tool hooks receive the tool name, input, and result. They cannot
        modify the result but can trigger side effects: logging, notifications,
        or custom analytics. Unlike pre-hooks, post-hooks cannot veto.
      </>
    ),
  },
  {
    id: 'render',
    icon: '🧩',
    title: 'Render Result',
    relatedCode: 'renderToolResultMessage()',
    desc: 'Tool output formatted for terminal display.',
    badgeClass: s.badgeResult,
    detail: (
      <>
        Each tool implements <code>renderToolResultMessage(output, progress,
        options)</code> to produce a React/Ink component for the terminal.{' '}
        <code>FileEdit</code> renders colored diffs. <code>Bash</code> shows
        exit codes and truncated output. <code>buildTool()</code> provides
        sensible defaults if not overridden.
      </>
    ),
  },
  {
    id: 'history',
    icon: '💾',
    title: 'Add to History',
    relatedCode: 'normalizeMessagesForAPI()',
    desc: 'Result appended to conversation as a tool_result message.',
    badgeClass: s.badgeExecute,
    detail: (
      <>
        The output is formatted as a <code>tool_result</code> content block
        with the matching <code>tool_use_id</code>. Large results may be
        truncated to fit the context budget or persisted to disk with a
        reference. The updated message history feeds back into the next
        API call if the agent loop continues.
      </>
    ),
  },
];

export default function ToolLifecycleStepper(): React.JSX.Element {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  return (
    <div className={s.container}>
      <div className={s.header}>
        <span className={s.title}>Tool Execution Pipeline</span>
        <span className={s.subtitle}>click any step to expand</span>
      </div>

      <div className={s.flow}>
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            {i > 0 && <div className={s.connector} />}
            <div
              className={`${s.step} ${activeStep === step.id ? s.stepActive : ''}`}
              onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
              role="button"
              tabIndex={0}
              aria-expanded={activeStep === step.id}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveStep(activeStep === step.id ? null : step.id); } }}
            >
              <div className={`${s.badge} ${step.badgeClass}`}>
                {step.icon}
              </div>
              <div className={s.stepContent}>
                <div className={s.stepTop}>
                  <span className={s.stepTitle}>{step.title}</span>
                  <span className={s.stepBadge}>{step.relatedCode}</span>
                  <span className={`${s.chevron} ${activeStep === step.id ? s.chevronOpen : ''}`}>▸</span>
                </div>
                <div className={s.stepDesc}>{step.desc}</div>
              </div>
            </div>
            {activeStep === step.id && (
              <div className={s.detail}>{step.detail}</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
