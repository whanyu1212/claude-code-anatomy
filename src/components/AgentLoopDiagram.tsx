import React, { useState } from 'react';
import styles from './AgentLoopDiagram.module.css';

interface Step {
  id: string;
  number: string;
  title: string;
  desc: string;
  meta: string;
  detail: React.ReactNode;
}

const steps: Step[] = [
  {
    id: 'input',
    number: '01',
    title: 'User Input',
    desc: 'You type a message or instruction in the REPL terminal.',
    meta: 'PromptInput → REPL.tsx',
    detail: (
      <>
        The <code>PromptInput</code> component captures keyboard input. If the input
        starts with <code>/</code>, it's routed to the command system. Otherwise,
        it's wrapped as a <code>UserMessage</code> and sent to the query engine.
      </>
    ),
  },
  {
    id: 'system-prompt',
    number: '02',
    title: 'System Prompt Assembly',
    desc: 'Base prompt + tool definitions + CLAUDE.md context + system info merged.',
    meta: 'appendSystemContext() → query.ts:449',
    detail: (
      <>
        The system prompt is assembled from multiple layers:{' '}
        <code>base prompt</code> → <code>tool definitions</code> (JSON Schema for
        each tool) → <code>CLAUDE.md layers</code> (enterprise → global → project →
        local) → <code>system context</code> (git status, OS, shell, IDE info) →{' '}
        <code>plugin prompts</code>. Auto-compact runs here if the context window is
        too large.
      </>
    ),
  },
  {
    id: 'api-call',
    number: '03',
    title: 'API Call (Streaming)',
    desc: 'Messages sent to Anthropic API with streaming enabled.',
    meta: 'queryModelWithStreaming() → claude.ts:752',
    detail: (
      <>
        Calls <code>POST /v1/messages</code> with the assembled system prompt,
        conversation history, tool definitions, and <code>stream: true</code>.
        Supports Anthropic Direct, AWS Bedrock, Google Vertex, and Foundry
        providers. Includes retry logic for rate limits (429) and server errors
        (5xx).
      </>
    ),
  },
  {
    id: 'stream-process',
    number: '04',
    title: 'Process Stream',
    desc: 'Text rendered in real-time. Tool calls collected as they complete.',
    meta: 'for await (message of stream) → query.ts:747',
    detail: (
      <>
        As SSE events arrive: <code>content_block_delta</code> with text is rendered
        immediately to the terminal. <code>tool_use</code> blocks are accumulated in
        a <code>toolUseBlocks</code> array. If a{' '}
        <code>StreamingToolExecutor</code> is active, tools begin executing even
        before the full response completes.
      </>
    ),
  },
  {
    id: 'permission',
    number: '05',
    title: 'Permission Check',
    desc: 'Each tool validated against permission mode, rules, and classifier.',
    meta: 'resolveHookPermissionDecision() → toolExecution.ts:916',
    detail: (
      <>
        For each tool call: <code>Zod schema validation</code> → <code>pre-tool
        hooks</code> → <code>permission resolution</code>. In <strong>default
        mode</strong>, the user sees an approval dialog. In <strong>auto
        mode</strong>, a classifier evaluates Bash commands for safety. Denied
        tools return an error <code>tool_result</code> — the model adapts.
      </>
    ),
  },
  {
    id: 'execute',
    number: '06',
    title: 'Execute Tools',
    desc: 'Read-only tools run in parallel. Write tools run sequentially.',
    meta: 'runTools() → toolOrchestration.ts:19',
    detail: (
      <>
        Tools are partitioned by <code>isConcurrencySafe()</code>. Read-only tools
        (Read, Glob, Grep, WebFetch) run in parallel via{' '}
        <code>Promise.all</code>, up to 10 concurrent. Write tools (FileEdit,
        Bash) run serially. Each tool streams progress via{' '}
        <code>onProgress</code> callbacks. Post-tool hooks run after each
        completion.
      </>
    ),
  },
  {
    id: 'collect',
    number: '07',
    title: 'Collect Results',
    desc: 'Tool outputs formatted as tool_result blocks and appended to history.',
    meta: 'normalizeMessagesForAPI() → query.ts:1396',
    detail: (
      <>
        Each tool output becomes a <code>tool_result</code> block paired with its
        corresponding <code>tool_use</code> block. Attachment messages (memory
        prefetch, skill discovery, queued commands) are also appended.
        The updated message history is ready for the next iteration.
      </>
    ),
  },
];

function Connector() {
  return <div className={styles.connector} />;
}

export default function AgentLoopDiagram(): React.JSX.Element {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  return (
    <div className={styles.container}>
      <div className={styles.flow}>
        {/* Step 1: User Input */}
        <StepNode
          step={steps[0]}
          active={activeStep === steps[0].id}
          onClick={() => setActiveStep(activeStep === steps[0].id ? null : steps[0].id)}
        />
        <Connector />

        {/* Step 2: System Prompt */}
        <StepNode
          step={steps[1]}
          active={activeStep === steps[1].id}
          onClick={() => setActiveStep(activeStep === steps[1].id ? null : steps[1].id)}
        />
        <Connector />

        {/* Agentic Loop */}
        <div className={styles.loopWrapper}>
          <div className={styles.loopLabel}>Agentic Loop — repeats until end_turn</div>
          <div className={styles.loopInner}>
            {/* Step 3: API Call */}
            <StepNode
              step={steps[2]}
              active={activeStep === steps[2].id}
              onClick={() => setActiveStep(activeStep === steps[2].id ? null : steps[2].id)}
            />
            <Connector />

            {/* Step 4: Stream */}
            <StepNode
              step={steps[3]}
              active={activeStep === steps[3].id}
              onClick={() => setActiveStep(activeStep === steps[3].id ? null : steps[3].id)}
            />
            <Connector />

            {/* Decision: Tool use? */}
            <div className={styles.decision}>
              <span className={styles.decisionText}>Does response contain tool_use blocks?</span>
            </div>
            <div className={styles.connectorBranch} />

            <div className={styles.branches}>
              <div className={styles.branchYes}>
                Yes → Continue loop
              </div>
              <div className={styles.branchNo}>
                No → Return response ✓
              </div>
            </div>
            <div className={styles.connectorBranch} />

            {/* Step 5: Permission */}
            <StepNode
              step={steps[4]}
              active={activeStep === steps[4].id}
              onClick={() => setActiveStep(activeStep === steps[4].id ? null : steps[4].id)}
            />
            <Connector />

            {/* Step 6: Execute */}
            <StepNode
              step={steps[5]}
              active={activeStep === steps[5].id}
              onClick={() => setActiveStep(activeStep === steps[5].id ? null : steps[5].id)}
            />
            <Connector />

            {/* Step 7: Collect */}
            <StepNode
              step={steps[6]}
              active={activeStep === steps[6].id}
              onClick={() => setActiveStep(activeStep === steps[6].id ? null : steps[6].id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StepNode({
  step,
  active,
  onClick,
}: {
  step: Step;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <>
      <div
        className={`${styles.step} ${active ? styles.stepActive : ''}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
      >
        <div className={styles.stepNumber}>{step.number}</div>
        <div className={styles.stepContent}>
          <div className={styles.stepTitle}>{step.title}</div>
          <div className={styles.stepDesc}>{step.desc}</div>
          <div className={styles.stepMeta}>{step.meta}</div>
        </div>
      </div>
      {active && (
        <div className={styles.detailPanel}>
          {step.detail}
        </div>
      )}
    </>
  );
}
