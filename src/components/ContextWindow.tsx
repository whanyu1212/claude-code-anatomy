import React, { useState } from 'react';
import s from './ContextWindow.module.css';

/** Visual gauge showing how the context window is consumed */
export function ContextWindowGauge(): React.JSX.Element {
  return (
    <div className={s.gaugeContainer}>
      <div className={s.gaugeHeader}>
        <span className={s.gaugeTitle}>context_window</span>
        <span className={s.gaugeCapacity}>200,000 tokens</span>
      </div>
      <div className={s.gaugeBody}>
        <div className={s.gaugeBar}>
          <div className={`${s.gaugeSegment} ${s.segmentPrompt}`} style={{ width: '5%' }}>
            ~10K
          </div>
          <div className={`${s.gaugeSegment} ${s.segmentHistory}`} style={{ width: '55%' }}>
            Conversation History
          </div>
          <div className={`${s.gaugeSegment} ${s.segmentReserved}`} style={{ width: '5%' }}>
            Reserve
          </div>
          <div className={`${s.gaugeSegment} ${s.segmentFree}`}>
            Available
          </div>
        </div>
        <div className={s.gaugeLegend}>
          <div className={s.legendItem}>
            <div className={`${s.legendDot} ${s.dotPrompt}`} />
            System Prompt (~5%)
          </div>
          <div className={s.legendItem}>
            <div className={`${s.legendDot} ${s.dotHistory}`} />
            Messages + Tool Results
          </div>
          <div className={s.legendItem}>
            <div className={`${s.legendDot} ${s.dotReserved}`} />
            Reserved for Response
          </div>
          <div className={s.legendItem}>
            <div className={`${s.legendDot} ${s.dotFree}`} />
            Available Space
          </div>
        </div>
      </div>
    </div>
  );
}

/** Interactive before/after compaction demo */
export function CompactionDemo(): React.JSX.Element {
  const [view, setView] = useState<'before' | 'after'>('before');

  return (
    <div className={s.compactionContainer}>
      <div className={s.compactionHeader}>
        <div
          className={`${s.compactionTab} ${view === 'before' ? s.compactionTabActive : ''}`}
          onClick={() => setView('before')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setView('before'); }}
        >
          Before
        </div>
        <div
          className={`${s.compactionTab} ${view === 'after' ? s.compactionTabActive : ''}`}
          onClick={() => setView('after')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setView('after'); }}
        >
          After Compaction
        </div>
      </div>

      <div className={s.compactionBody}>
        {view === 'before' ? <BeforeView /> : <AfterView />}
      </div>

      <div className={s.levels}>
        <div className={s.levelPill}>
          <span className={s.levelName}>Micro</span>
          <span className={s.levelDesc}>every turn — strip empties</span>
        </div>
        <div className={s.levelPill}>
          <span className={s.levelName}>Auto</span>
          <span className={s.levelDesc}>approaching limit — summarize old</span>
        </div>
        <div className={s.levelPill}>
          <span className={s.levelName}>Full</span>
          <span className={s.levelDesc}>at the limit — aggressive summary</span>
        </div>
      </div>
    </div>
  );
}

function BeforeView() {
  return (
    <>
      <div className={s.msgRow}>
        <span className={`${s.msgLabel} ${s.msgLabelYou}`}>You</span>
        <span className={s.msgText}>Set up the auth module with OAuth2</span>
      </div>
      <div className={s.msgRow}>
        <span className={`${s.msgLabel} ${s.msgLabelClaude}`}>Claude</span>
        <span className={s.msgText}>I'll create the auth module. Let me read the config first.</span>
      </div>
      <div className={s.msgRow}>
        <span className={`${s.msgLabel} ${s.msgLabelTool}`}>Read</span>
        <span className={s.msgText}>src/config.ts → 85 lines</span>
      </div>
      <div className={s.msgRow}>
        <span className={`${s.msgLabel} ${s.msgLabelTool}`}>Write</span>
        <span className={s.msgText}>src/auth/oauth.ts → created (142 lines)</span>
      </div>
      <div className={s.msgRow}>
        <span className={`${s.msgLabel} ${s.msgLabelTool}`}>Write</span>
        <span className={s.msgText}>src/auth/middleware.ts → created (67 lines)</span>
      </div>
      <div className={s.msgRow}>
        <span className={`${s.msgLabel} ${s.msgLabelTool}`}>Edit</span>
        <span className={s.msgText}>src/app.ts → added auth middleware</span>
      </div>
      <div className={s.msgRow}>
        <span className={`${s.msgLabel} ${s.msgLabelTool}`}>Bash</span>
        <span className={s.msgText}>npm test → 12 passed, 0 failed</span>
      </div>
      <div className={s.msgRow}>
        <span className={`${s.msgLabel} ${s.msgLabelClaude}`}>Claude</span>
        <span className={s.msgText}>Auth module created with OAuth2 support. Tests pass.</span>
      </div>
      <div className={s.msgRow}>
        <span className={`${s.msgLabel} ${s.msgLabelYou}`}>You</span>
        <span className={s.msgText}>Now add Google and GitHub as providers</span>
      </div>
      <div className={s.msgRow}>
        <span className={`${s.msgLabel} ${s.msgLabelClaude}`}>Claude</span>
        <span className={s.msgText}>I'll add both providers. Reading the current oauth module...</span>
      </div>
      <div className={s.msgRow}>
        <span className={`${s.msgLabel} ${s.msgLabelTool}`}>Read</span>
        <span className={s.msgText}>src/auth/oauth.ts → 142 lines</span>
      </div>
      <div className={s.msgRow}>
        <span className={`${s.msgLabel} ${s.msgLabelTool}`}>Edit</span>
        <span className={s.msgText}>src/auth/oauth.ts → added Google provider</span>
      </div>
      <div className={s.msgRow}>
        <span className={`${s.msgLabel} ${s.msgLabelTool}`}>Edit</span>
        <span className={s.msgText}>src/auth/oauth.ts → added GitHub provider</span>
      </div>
      <div className={s.msgRow}>
        <span className={`${s.msgLabel} ${s.msgLabelTool}`}>Bash</span>
        <span className={s.msgText}>npm test → 18 passed, 0 failed</span>
      </div>
      <div className={s.msgRow}>
        <span className={`${s.msgLabel} ${s.msgLabelClaude}`}>Claude</span>
        <span className={s.msgText}>Added Google and GitHub OAuth providers. All tests pass.</span>
      </div>

      <div className={s.compactionArrow}>↑ 15 messages consuming ~8,000 tokens ↑</div>
    </>
  );
}

function AfterView() {
  return (
    <>
      <div className={s.boundary}>
        <div className={s.boundaryLine} />
        compaction boundary
        <div className={s.boundaryLine} />
      </div>

      <div className={s.msgCompacted}>
        <div className={s.msgRow}>
          <span className={`${s.msgLabel} ${s.msgLabelSystem}`}>Summary</span>
          <span className={s.msgTextBright}>
            Created OAuth2 auth module (src/auth/oauth.ts, src/auth/middleware.ts).
            Added Google and GitHub providers. Integrated middleware into src/app.ts.
            All 18 tests passing.
          </span>
        </div>
      </div>

      <div className={s.boundary}>
        <div className={s.boundaryLine} />
        recent messages kept verbatim
        <div className={s.boundaryLine} />
      </div>

      <div className={s.msgRow}>
        <span className={`${s.msgLabel} ${s.msgLabelYou}`}>You</span>
        <span className={s.msgTextBright}>Now add rate limiting to the auth endpoints</span>
      </div>
      <div className={s.msgRow}>
        <span className={`${s.msgLabel} ${s.msgLabelClaude}`}>Claude</span>
        <span className={s.msgTextBright}>I'll add rate limiting. Let me check the current middleware...</span>
      </div>

      <div className={s.compactionArrow}>↑ 15 messages → 3 entries (~2,000 tokens saved) ↑</div>
    </>
  );
}
