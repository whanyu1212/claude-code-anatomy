import React from 'react';
import s from './diagrams.module.css';

/* ================================================================
   Reusable Diagram Components
   ================================================================ */

// -- Primitives -------------------------------------------------

type Variant = 'default' | 'primary' | 'subtle' | 'danger' | 'success' | 'warning' | 'purple' | 'highlight';

const variantClass: Record<Variant, string> = {
  default: s.node,
  primary: `${s.node} ${s.nodePrimary}`,
  subtle: `${s.node} ${s.nodeSubtle}`,
  danger: `${s.node} ${s.nodeDanger}`,
  success: `${s.node} ${s.nodeSuccess}`,
  warning: `${s.node} ${s.nodeWarning}`,
  purple: `${s.node} ${s.nodePurple}`,
  highlight: `${s.node} ${s.nodeHighlight}`,
};

/** A single box node */
export function Node({
  children,
  icon,
  variant = 'default',
}: {
  children: React.ReactNode;
  icon?: string;
  variant?: Variant;
}) {
  return (
    <div className={variantClass[variant]}>
      {icon && <div className={s.nodeIcon}>{icon}</div>}
      <span>{children}</span>
    </div>
  );
}

/** Vertical connector line */
export function Conn({ size = 'normal' }: { size?: 'short' | 'normal' | 'long' }) {
  const cls = size === 'short' ? `${s.conn} ${s.connShort}` : size === 'long' ? `${s.conn} ${s.connLong}` : s.conn;
  return <div className={cls} />;
}

/** Small text label between connectors */
export function Arrow({ children }: { children: React.ReactNode }) {
  return <div className={s.arrowLabel}>{children}</div>;
}

/* ================================================================
   FlowDiagram: Vertical flow layout
   ================================================================ */
export function FlowDiagram({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.flowContainer}>
      <div className={s.flowColumn}>{children}</div>
    </div>
  );
}

export function FlowRow({ children }: { children: React.ReactNode }) {
  return <div className={s.flowRow}>{children}</div>;
}

/* ================================================================
   Branches: Side-by-side paths
   ================================================================ */
export function Branches({
  children,
  cols = 2,
}: {
  children: React.ReactNode;
  cols?: 2 | 3;
}) {
  return (
    <div className={`${s.branches} ${cols === 3 ? s.branches3 : ''}`}>
      {children}
    </div>
  );
}

/* ================================================================
   Group: Labeled dashed box
   ================================================================ */
export function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={s.group}>
      <div className={s.groupLabel}>{label}</div>
      {children}
    </div>
  );
}

/* ================================================================
   ArchDiagram: Multi-layer architecture view
   ================================================================ */
export function ArchDiagram({ children }: { children: React.ReactNode }) {
  return <div className={s.archContainer}>{children}</div>;
}

export function ArchLayer({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={s.archLayer}>
      {label && <div className={s.archLayerLabel}>{label}</div>}
      <div className={s.archRow}>{children}</div>
    </div>
  );
}

export function ArchBox({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className={`${s.archBox} ${accent ? s.archBoxAccent : ''}`}>
      {children}
    </div>
  );
}

export function ArchDivider() {
  return <div className={s.archDivider} />;
}

/* ================================================================
   SeqDiagram: Simplified sequence diagram
   ================================================================ */
export function SeqDiagram({
  participants,
  children,
}: {
  participants: string[];
  children: React.ReactNode;
}) {
  return (
    <div className={s.seqContainer}>
      <div className={s.seqParticipants}>
        {participants.map((p) => (
          <div key={p} className={s.seqParticipant}>{p}</div>
        ))}
      </div>
      <div className={s.seqMessages}>{children}</div>
    </div>
  );
}

export function SeqMsg({
  from,
  to,
  children,
}: {
  from?: string;
  to?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={s.seqMessage}>
      <span className={s.seqLabel}>{children}</span>
    </div>
  );
}

export function SeqNote({ children }: { children: React.ReactNode }) {
  return <div className={s.seqNote}>{children}</div>;
}
