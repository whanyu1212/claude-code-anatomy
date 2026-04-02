import React, { useState, useEffect, useRef } from 'react';
import s from './TaskBoard.module.css';

/* ================================================================
   TaskBoard — Animated task lifecycle dashboard
   Shows tasks progressing through states with notifications
   ================================================================ */

interface TaskDef {
  id: string;
  name: string;
  desc: string;
  type: 'bash' | 'agent' | 'remote' | 'workflow';
}

const TASKS: TaskDef[] = [
  { id: 'a1', name: 'npm test', desc: 'Run test suite in watch mode', type: 'bash' },
  { id: 'a2', name: 'Explore("Find API endpoints")', desc: 'Research task running in parallel', type: 'agent' },
  { id: 'a3', name: 'lint --fix', desc: 'Auto-fix lint errors', type: 'bash' },
];

type Status = 'pending' | 'running' | 'completed' | 'failed' | 'killed';

/*
  Animation timeline (step → task states):
  0: all pending
  1: a1 running
  2: a1 running, a2 running
  3: a1 running, a2 running, a3 running
  4: a3 completed, a1 running, a2 running
  5: a1 completed (notification), a2 running
  6: a2 completed (notification)
  7: all done — show summary
*/
const TOTAL_STEPS = 8;
const STEP_DELAY = 1200;
const RESTART_DELAY = 3000;

const typeClass: Record<string, string> = {
  bash: s.typeBash,
  agent: s.typeAgent,
  remote: s.typeRemote,
  workflow: s.typeWorkflow,
};

const dotClass: Record<Status, string> = {
  pending: s.dotPending,
  running: s.dotRunning,
  completed: s.dotCompleted,
  failed: s.dotFailed,
  killed: s.dotKilled,
};

const statusTextClass: Record<Status, string> = {
  pending: s.statusPending,
  running: s.statusRunning,
  completed: s.statusCompleted,
  failed: s.statusFailed,
  killed: s.statusKilled,
};

function getStates(step: number): Record<string, Status> {
  if (step <= 0) return { a1: 'pending', a2: 'pending', a3: 'pending' };
  if (step === 1) return { a1: 'running', a2: 'pending', a3: 'pending' };
  if (step === 2) return { a1: 'running', a2: 'running', a3: 'pending' };
  if (step === 3) return { a1: 'running', a2: 'running', a3: 'running' };
  if (step === 4) return { a1: 'running', a2: 'running', a3: 'completed' };
  if (step === 5) return { a1: 'completed', a2: 'running', a3: 'completed' };
  return { a1: 'completed', a2: 'completed', a3: 'completed' };
}

function getNotification(step: number): string | null {
  if (step === 5) return 'task-notification: "npm test" completed (exit code 0)';
  if (step === 6) return 'task-notification: Explore agent completed — found 12 endpoints';
  return null;
}

export default function TaskBoard(): React.JSX.Element {
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

    timerRef.current = setTimeout(tick, 800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const states = getStates(step);
  const notification = getNotification(step);
  const runningCount = Object.values(states).filter(s => s === 'running').length;
  const doneCount = Object.values(states).filter(s => s === 'completed').length;

  return (
    <div className={s.container}>
      <div className={s.header}>
        <span className={s.headerTitle}>Background Tasks</span>
        <span className={s.headerCount}>{runningCount} running, {doneCount} done</span>
      </div>

      <div className={s.body}>
        {TASKS.map((task) => {
          const status = states[task.id];
          return (
            <div key={task.id} className={s.task}>
              <span className={`${s.statusDot} ${dotClass[status]}`} />
              <div className={s.taskContent}>
                <div className={s.taskName}>{task.name}</div>
                <div className={s.taskDesc}>{task.desc}</div>
              </div>
              <span className={`${s.typeBadge} ${typeClass[task.type]}`}>{task.type}</span>
              <span className={`${s.statusText} ${statusTextClass[status]}`}>{status}</span>
            </div>
          );
        })}

        {notification && (
          <div className={s.notification}>{notification}</div>
        )}
      </div>

      <div className={s.footer}>
        <span>~/.claude/tasks/</span>
        <span>{step >= 7 ? 'all tasks complete' : 'auto-playing'}</span>
      </div>
    </div>
  );
}
