import React, { useState, useEffect, useRef } from 'react';
import s from './StreamingAnimation.module.css';

interface SSEEvent {
  type: string;
  typeClass: string;
  data: string;
  /** What to add to the terminal at this step */
  terminalAction?: 'text' | 'tool-start' | 'tool-done' | 'clear-cursor' | 'newline';
  terminalText?: string;
}

const EVENTS: SSEEvent[] = [
  // Turn 1: text response
  { type: 'message_start', typeClass: s.typeStart, data: 'id: msg_01X...' },
  { type: 'content_block_start', typeClass: s.typeStart, data: 'type: text', terminalAction: 'text', terminalText: '' },
  { type: 'content_block_delta', typeClass: s.typeDelta, data: '"I\'ll fix "', terminalAction: 'text', terminalText: "I'll fix " },
  { type: 'content_block_delta', typeClass: s.typeDelta, data: '"the null "', terminalAction: 'text', terminalText: 'the null ' },
  { type: 'content_block_delta', typeClass: s.typeDelta, data: '"check bug."', terminalAction: 'text', terminalText: 'check bug.' },
  { type: 'content_block_stop', typeClass: s.typeStop, data: 'index: 0' },

  // Tool use: Read
  { type: 'content_block_start', typeClass: s.typeToolUse, data: 'type: tool_use, name: Read', terminalAction: 'tool-start', terminalText: 'Read' },
  { type: 'content_block_delta', typeClass: s.typeDelta, data: '{"file_path": "src/auth.ts"}' },
  { type: 'content_block_stop', typeClass: s.typeStop, data: 'index: 1', terminalAction: 'tool-done', terminalText: 'Read' },

  // Tool use: Edit
  { type: 'content_block_start', typeClass: s.typeToolUse, data: 'type: tool_use, name: Edit', terminalAction: 'tool-start', terminalText: 'Edit' },
  { type: 'content_block_delta', typeClass: s.typeDelta, data: '{"file_path": "src/auth.ts", ...}' },
  { type: 'content_block_stop', typeClass: s.typeStop, data: 'index: 2', terminalAction: 'tool-done', terminalText: 'Edit' },

  // Final text
  { type: 'content_block_start', typeClass: s.typeStart, data: 'type: text', terminalAction: 'newline' },
  { type: 'content_block_delta', typeClass: s.typeDelta, data: '"Fixed! The "', terminalAction: 'text', terminalText: 'Fixed! The ' },
  { type: 'content_block_delta', typeClass: s.typeDelta, data: '"issue was a "', terminalAction: 'text', terminalText: 'issue was a ' },
  { type: 'content_block_delta', typeClass: s.typeDelta, data: '"missing null "', terminalAction: 'text', terminalText: 'missing null ' },
  { type: 'content_block_delta', typeClass: s.typeDelta, data: '"check on L42."', terminalAction: 'text', terminalText: 'check on L42.' },
  { type: 'content_block_stop', typeClass: s.typeStop, data: 'index: 3' },

  // End
  { type: 'message_stop', typeClass: s.typeStop, data: 'stop_reason: end_turn', terminalAction: 'clear-cursor' },
];

const DELAY = 400; // ms between events
const PAUSE_BEFORE_RESTART = 3000;

export default function StreamingAnimation(): React.JSX.Element {
  const [visibleEvents, setVisibleEvents] = useState<number>(0);
  const [terminalLines, setTerminalLines] = useState<React.ReactNode[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const [currentText, setCurrentText] = useState('');
  const [tools, setTools] = useState<Map<string, 'running' | 'done'>>(new Map());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let step = 0;

    const tick = () => {
      if (step >= EVENTS.length) {
        // Pause then restart
        timeoutRef.current = setTimeout(() => {
          setVisibleEvents(0);
          setTerminalLines([]);
          setCurrentText('');
          setTools(new Map());
          setShowCursor(true);
          step = 0;
          timeoutRef.current = setTimeout(tick, DELAY);
        }, PAUSE_BEFORE_RESTART);
        return;
      }

      const event = EVENTS[step];
      setVisibleEvents(step + 1);

      // Process terminal action
      if (event.terminalAction === 'text' && event.terminalText) {
        setCurrentText((prev) => prev + event.terminalText);
      } else if (event.terminalAction === 'tool-start' && event.terminalText) {
        // Flush current text as a line
        setCurrentText((prev) => {
          if (prev) {
            setTerminalLines((lines) => [...lines, <TextLine key={`t-${step}`} text={prev} />]);
          }
          return '';
        });
        setTools((prev) => new Map(prev).set(event.terminalText!, 'running'));
      } else if (event.terminalAction === 'tool-done' && event.terminalText) {
        setTools((prev) => new Map(prev).set(event.terminalText!, 'done'));
      } else if (event.terminalAction === 'newline') {
        setCurrentText((prev) => {
          if (prev) {
            setTerminalLines((lines) => [...lines, <TextLine key={`t-${step}`} text={prev} />]);
          }
          return '';
        });
      } else if (event.terminalAction === 'clear-cursor') {
        setShowCursor(false);
        // Flush remaining text
        setCurrentText((prev) => {
          if (prev) {
            setTerminalLines((lines) => [...lines, <TextLine key={`t-${step}`} text={prev} />]);
          }
          return '';
        });
      }

      step++;
      timeoutRef.current = setTimeout(tick, DELAY);
    };

    timeoutRef.current = setTimeout(tick, 800);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className={s.container}>
      <div className={s.header}>
        <span className={s.headerTitle}>POST /v1/messages (stream: true)</span>
        <span className={s.headerStatus}>
          <span className={s.liveDot} />
          streaming
        </span>
      </div>

      <div className={s.body}>
        {/* Left: SSE Events */}
        <div className={s.eventsPanel}>
          <div className={s.eventsPanelHeader}>SSE Events</div>
          <div className={s.eventsList}>
            {EVENTS.slice(0, visibleEvents).map((event, i) => (
              <div
                key={i}
                className={`${s.event} ${i < visibleEvents - 5 ? s.eventDim : ''}`}
                style={{ animationDelay: '0ms' }}
              >
                <span className={`${s.eventType} ${event.typeClass}`}>{event.type}</span>
                <span className={s.eventData}>{event.data}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Terminal Output */}
        <div className={s.terminalPanel}>
          <div className={s.terminalPanelHeader}>Terminal Output</div>
          <div className={s.terminalContent}>
            <span className={`${s.termLabel} ${s.termLabelClaude}`}>{'Claude '}</span>

            {/* Rendered lines */}
            {terminalLines}

            {/* Tool indicators */}
            {Array.from(tools.entries()).map(([name, status]) => (
              <div key={name} className={s.termTool}>
                <span className={s.termToolStatus}>{status === 'done' ? '⏺' : '○'}</span>
                <span className={s.termToolName}>{name}</span>
                <span className={s.termToolInput}>src/auth.ts</span>
                {status === 'done' && <span className={s.termToolStatus}>✓</span>}
              </div>
            ))}

            {/* Current streaming text */}
            {currentText && (
              <span className={s.termText}>{currentText}</span>
            )}

            {/* Blinking cursor */}
            {showCursor && <span className={s.cursor} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function TextLine({ text }: { text: string }) {
  return (
    <div>
      <span className={s.termText}>{text}</span>
    </div>
  );
}
