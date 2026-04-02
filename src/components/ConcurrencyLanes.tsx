import React, { useState, useEffect, useRef } from 'react';
import s from './ConcurrencyLanes.module.css';

/* ================================================================
   Concurrency Lane Animation
   Shows how safe tools run in parallel while unsafe tools queue
   ================================================================ */

interface ToolItem {
  name: string;
  safe: boolean;
}

const QUEUE: ToolItem[] = [
  { name: 'Glob', safe: true },
  { name: 'Grep', safe: true },
  { name: 'Read', safe: true },
  { name: 'FileEdit', safe: false },
  { name: 'Bash', safe: false },
];

// Results are collected in original order
const RESULT_ORDER = ['Glob', 'Grep', 'Read', 'FileEdit', 'Bash'];

/*
  Animation steps:
  0: initial — all tools in queue
  1: safe tools start (move to parallel lane)
  2: safe tools running
  3: safe tools done, unsafe #1 starts
  4: unsafe #1 running
  5: unsafe #1 done, unsafe #2 starts
  6: unsafe #2 running
  7: unsafe #2 done — all results collected
*/
const TOTAL_STEPS = 8;
const STEP_DELAY = 900;
const RESTART_DELAY = 3000;

export default function ConcurrencyLanes(): React.JSX.Element {
  const [step, setStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let current = 0;

    const tick = () => {
      current++;
      if (current >= TOTAL_STEPS) {
        timerRef.current = setTimeout(() => {
          current = 0;
          setStep(0);
          timerRef.current = setTimeout(tick, STEP_DELAY);
        }, RESTART_DELAY);
        return;
      }
      setStep(current);
      timerRef.current = setTimeout(tick, STEP_DELAY);
    };

    timerRef.current = setTimeout(tick, 1200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // Derive states from step
  const consumedQueue = new Set<string>();
  const parallelLane: { name: string; status: 'running' | 'done' }[] = [];
  const sequentialLane: { name: string; status: 'running' | 'done' }[] = [];
  const results: string[] = [];
  let running = false;

  if (step >= 1) {
    consumedQueue.add('Glob');
    consumedQueue.add('Grep');
    consumedQueue.add('Read');
    parallelLane.push(
      { name: 'Glob', status: step >= 3 ? 'done' : 'running' },
      { name: 'Grep', status: step >= 3 ? 'done' : 'running' },
      { name: 'Read', status: step >= 3 ? 'done' : 'running' },
    );
    if (step < 3) running = true;
  }

  if (step >= 3) {
    consumedQueue.add('FileEdit');
    sequentialLane.push({ name: 'FileEdit', status: step >= 5 ? 'done' : 'running' });
    if (step < 5) running = true;
    results.push('Glob', 'Grep', 'Read');
  }

  if (step >= 5) {
    consumedQueue.add('Bash');
    sequentialLane.push({ name: 'Bash', status: step >= 7 ? 'done' : 'running' });
    if (step < 7) running = true;
    results.push('FileEdit');
  }

  if (step >= 7) {
    results.push('Bash');
  }

  const progress = Math.round((step / (TOTAL_STEPS - 1)) * 100);

  return (
    <div className={s.container}>
      <div className={s.header}>
        <span className={s.headerTitle}>StreamingToolExecutor</span>
        <span className={s.headerStatus}>
          <span className={running ? s.runDot : s.pausedDot} />
          {step === 0 ? 'idle' : step >= 7 ? 'complete' : 'executing'}
        </span>
      </div>

      <div className={s.body}>
        {/* Left: Input Queue */}
        <div className={s.queue}>
          <div className={s.queueLabel}>Tool Queue</div>
          {QUEUE.map((tool) => (
            <div
              key={tool.name}
              className={`${s.queueItem} ${consumedQueue.has(tool.name) ? s.queueItemConsumed : ''}`}
            >
              <span className={`${s.queueDot} ${tool.safe ? s.dotSafe : s.dotUnsafe}`} />
              {tool.name}
            </div>
          ))}
        </div>

        {/* Center: Execution Lanes */}
        <div className={s.lanes}>
          {/* Parallel lane */}
          <div className={`${s.lane} ${s.laneParallel}`}>
            <div className={s.laneHeader}>
              <span className={s.laneDot} />
              <span className={s.laneName}>Parallel (safe)</span>
            </div>
            <div className={s.laneItems}>
              {parallelLane.length > 0 && (
                <div className={s.laneItemRow}>
                  {parallelLane.map((item) => (
                    <div
                      key={item.name}
                      className={`${s.laneItem} ${s.laneItemSafe} ${s.laneItemVisible} ${item.status === 'done' ? s.laneItemDone : ''}`}
                    >
                      {item.status === 'running'
                        ? <span className={s.laneItemSpinner} />
                        : <span className={s.laneItemCheck}>✓</span>
                      }
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sequential lane */}
          <div className={`${s.lane} ${s.laneSequential}`}>
            <div className={s.laneHeader}>
              <span className={s.laneDot} />
              <span className={s.laneName}>Sequential (unsafe)</span>
            </div>
            <div className={s.laneItems}>
              {sequentialLane.map((item) => (
                <div
                  key={item.name}
                  className={`${s.laneItem} ${s.laneItemUnsafe} ${s.laneItemVisible} ${item.status === 'done' ? s.laneItemDone : ''}`}
                >
                  {item.status === 'running'
                    ? <span className={s.laneItemSpinner} />
                    : <span className={s.laneItemCheck}>✓</span>
                  }
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Result Collector */}
        <div className={s.results}>
          <div className={s.resultsLabel}>Results (ordered)</div>
          {RESULT_ORDER.map((name, i) => {
            const collected = results.includes(name);
            return (
              <div
                key={name}
                className={`${s.resultItem} ${collected ? s.resultItemVisible : ''}`}
              >
                <span className={s.resultOrder}>#{i + 1}</span>
                {name}
              </div>
            );
          })}
        </div>
      </div>

      <div className={s.footer}>
        <span>{step >= 7 ? '5/5 complete' : `${results.length}/5 complete`}</span>
        <div className={s.progressTrack}>
          <div className={s.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span>{step >= 7 ? 'done' : running ? 'running...' : 'queued'}</span>
      </div>
    </div>
  );
}
