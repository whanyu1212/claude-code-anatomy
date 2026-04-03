import React from 'react';
import s from './TerminalMockup.module.css';

function TitleBar({ title }: { title?: string }) {
  return (
    <div className={s.titleBar}>
      <div className={s.dots}>
        <div className={`${s.dot} ${s.dotRed}`} />
        <div className={`${s.dot} ${s.dotYellow}`} />
        <div className={`${s.dot} ${s.dotGreen}`} />
      </div>
      <div className={s.titleText}>{title || 'claude'}</div>
      <div style={{ width: 48 }} />
    </div>
  );
}

/** A full terminal turn matching actual Claude Code CLI styling */
export function TerminalTurnDemo(): React.JSX.Element {
  return (
    <div className={s.terminal}>
      <TitleBar title="claude — ~/my-project" />
      <div className={s.content}>
        {/* User input */}
        <div className={s.line}>
          <span className={s.userLabel}>{'You '}</span>
          <span className={s.userInput}>Fix the null check bug in src/auth.ts</span>
        </div>

        <div className={s.gapLarge} />

        {/* Assistant response start */}
        <div className={s.line}>
          <span className={s.assistantLabel}>{'Claude '}</span>
          <span className={s.assistantText}>I'll look at the auth file to understand the issue.</span>
        </div>

        <div className={s.gap} />

        {/* Tool: Read */}
        <div className={s.toolBox}>
          <span className={`${s.toolCircle} ${s.toolCircleSuccess}`}>⏺</span>
          <span className={s.toolName}>Read</span>
          <span className={s.toolInput}>src/auth.ts</span>
          <span className={`${s.toolStatus} ${s.successText}`}>142 lines</span>
        </div>

        <div className={s.gap} />

        {/* Continuation with ⎿ prefix */}
        <div className={s.line}>
          <span className={s.responsePrefix}>{'  ⎿ '}</span>
          <span className={s.assistantText}>Found it — line 42 accesses `user.email` without a null check.</span>
        </div>

        <div className={s.gap} />

        {/* Permission dialog */}
        <div className={s.permDialog}>
          <div className={s.line}>
            <span className={s.permissionText}>Claude wants to edit </span>
            <span className={s.userInput}>src/auth.ts</span>
          </div>
          <div className={s.permActions}>
            <span className={`${s.permBtn} ${s.permBtnActive}`}>y Allow</span>
            <span className={s.permBtn}>n Deny</span>
            <span className={s.permBtn}>a Always allow</span>
          </div>
        </div>

        <div className={s.gap} />

        {/* Tool: Edit with diff */}
        <div className={s.toolBox}>
          <span className={`${s.toolCircle} ${s.toolCircleSuccess}`}>⏺</span>
          <span className={s.toolName}>Edit</span>
          <span className={s.toolInput}>src/auth.ts</span>
        </div>
        <div className={s.diffBox}>
          <div className={s.line}>
            <span className={s.dimText}>{'  41 │ '}</span>
            <span className={s.mutedText}>{'  const token = generateToken(user);'}</span>
          </div>
          <div className={s.line}>
            <span className={s.dimText}>{'  42 │ '}</span>
            <span className={s.diffRemove}>{'- return { token, email: user.email };'}</span>
          </div>
          <div className={s.line}>
            <span className={s.dimText}>{'  42 │ '}</span>
            <span className={s.diffAdd}>{'+ return { token, email: user?.email ?? "" };'}</span>
          </div>
          <div className={s.line}>
            <span className={s.dimText}>{'  43 │ '}</span>
            <span className={s.mutedText}>{'}'}</span>
          </div>
        </div>

        <div className={s.gap} />

        {/* Tool: Bash */}
        <div className={s.toolBox}>
          <span className={`${s.toolCircle} ${s.toolCircleSuccess}`}>⏺</span>
          <span className={s.toolName}>Bash</span>
          <span className={s.toolInput}>npm test -- --filter auth</span>
          <span className={`${s.toolStatus} ${s.successText}`}>exit 0</span>
        </div>

        <div className={s.gap} />

        {/* Final response with ⎿ continuation */}
        <div className={s.line}>
          <span className={s.responsePrefix}>{'  ⎿ '}</span>
          <span className={s.assistantText}>Fixed the null check on line 42. The issue was that</span>
        </div>
        <div className={s.line}>
          <span className={s.responsePrefix}>{'    '}</span>
          <span className={s.assistantText}>`user.email` could be undefined when the user</span>
        </div>
        <div className={s.line}>
          <span className={s.responsePrefix}>{'    '}</span>
          <span className={s.assistantText}>authenticates via SSO without an email. Tests pass.</span>
        </div>

        <div className={s.gapLarge} />

        {/* Ready for next input */}
        <div className={s.line}>
          <span className={s.userLabel}>{'> '}</span>
          <span className={s.dimText}>█</span>
        </div>
      </div>
    </div>
  );
}

export function PermissionDialogDemo(): React.JSX.Element {
  return (
    <div className={s.terminal}>
      <TitleBar title="Permission Request" />
      <div className={s.content}>
        <div className={s.permCard}>
          <div className={s.permHeaderRow}>
            <div>
              <div className={s.permEyebrow}>Approval Required</div>
              <div className={s.permTitle}>Claude wants to run a shell command</div>
            </div>
            <span className={s.permBadge}>Bash</span>
          </div>

          <div className={s.permCommandBox}>
            <span className={s.permPrompt}>{'~/claude-code-anatomy '}</span>
            <span className={s.userInput}>rm -rf dist/</span>
          </div>

          <div className={s.permMeta}>
            <span className={s.permMetaItem}>Mode: default</span>
            <span className={s.permMetaItem}>Sandbox: workspace-write</span>
            <span className={s.permMetaItem}>Risk: destructive</span>
          </div>

          <div className={s.permHelp}>
            This command deletes the generated build output and needs your approval before execution.
          </div>

          <div className={s.permActionGrid}>
            <div className={`${s.permActionCard} ${s.permActionPrimary}`}>
              <div className={s.permShortcut}>Y</div>
              <div>
                <div className={s.permActionTitle}>Allow once</div>
                <div className={s.permActionCopy}>Run this command for this prompt only.</div>
              </div>
            </div>

            <div className={s.permActionCard}>
              <div className={s.permShortcut}>N</div>
              <div>
                <div className={s.permActionTitle}>Deny</div>
                <div className={s.permActionCopy}>Block execution and return to the REPL.</div>
              </div>
            </div>

            <div className={s.permActionCard}>
              <div className={s.permShortcut}>A</div>
              <div>
                <div className={s.permActionTitle}>Always allow</div>
                <div className={s.permActionCopy}>Persist a permission rule for future matches.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Rendering stack visualization */
export function RenderingStackDemo(): React.JSX.Element {
  return (
    <div className={s.terminal}>
      <TitleBar title="Rendering Pipeline" />
      <div className={s.content}>
        <div className={s.line}>
          <span className={s.claudeText}>AppState</span>
          <span className={s.dimText}>{' ─── message added ───────────── '}</span>
          <span className={s.mutedText}>trigger</span>
        </div>
        <div className={s.line}>
          <span className={s.dimText}>{'    ↓'}</span>
        </div>
        <div className={s.line}>
          <span className={s.permissionText}>React</span>
          <span className={s.dimText}>{'     ─── reconciler diffs props ──── '}</span>
          <span className={s.mutedText}>what changed?</span>
        </div>
        <div className={s.line}>
          <span className={s.dimText}>{'    ↓'}</span>
        </div>
        <div className={s.line}>
          <span className={s.warningText}>Ink</span>
          <span className={s.dimText}>{'       ─── Yoga computes layout ───── '}</span>
          <span className={s.mutedText}>where does it go?</span>
        </div>
        <div className={s.line}>
          <span className={s.dimText}>{'    ↓'}</span>
        </div>
        <div className={s.line}>
          <span className={s.successText}>Diff</span>
          <span className={s.dimText}>{'      ─── only changed cells ──────── '}</span>
          <span className={s.mutedText}>minimal writes</span>
        </div>
        <div className={s.line}>
          <span className={s.dimText}>{'    ↓'}</span>
        </div>
        <div className={s.line}>
          <span className={s.errorText}>ANSI</span>
          <span className={s.dimText}>{'      ─── escape codes to stdout ─── '}</span>
          <span className={s.mutedText}>pixels on screen</span>
        </div>
      </div>
    </div>
  );
}
