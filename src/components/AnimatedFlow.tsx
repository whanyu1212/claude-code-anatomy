import React, { useState, useEffect, useRef } from 'react';
import s from './AnimatedFlow.module.css';

/* ================================================================
   AnimatedFlow — Auto-playing flow diagram with looping reveal

   Usage in MDX:
   <AnimatedFlow stepDelay={800} restartDelay={2500}>
     <AFNode icon="🤖" variant="primary">Main Agent</AFNode>
     <AFConn />
     <AFNode icon="🔧">Spawn sub-agent</AFNode>
     <AFConn />
     <AFGroup label="Sub-Agent">
       <AFNode>Work...</AFNode>
     </AFGroup>
   </AnimatedFlow>
   ================================================================ */

interface AnimatedFlowProps {
  children: React.ReactNode;
  /** ms between each node reveal */
  stepDelay?: number;
  /** ms pause before restarting */
  restartDelay?: number;
}

// Count animatable elements (nodes, groups, branches — not connectors)
function countSteps(children: React.ReactNode): number {
  let count = 0;
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const type = child.type as React.FC;
    const name = type.displayName || type.name || '';
    if (name === 'AFConn') return; // connectors don't count
    count++;
    // Recurse into groups
    if (name === 'AFGroup' && child.props.children) {
      count += countSteps(child.props.children) - 1; // group itself is 1
    }
  });
  return count;
}

export function AnimatedFlow({
  children,
  stepDelay = 800,
  restartDelay = 2500,
}: AnimatedFlowProps): React.JSX.Element {
  const totalSteps = countSteps(children);
  const [visibleCount, setVisibleCount] = useState(0);
  const [activeIdx, setActiveIdx] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let step = 0;

    const tick = () => {
      if (step > totalSteps) {
        // All visible, pause then restart
        setActiveIdx(-1);
        timerRef.current = setTimeout(() => {
          step = 0;
          setVisibleCount(0);
          setActiveIdx(-1);
          timerRef.current = setTimeout(tick, stepDelay);
        }, restartDelay);
        return;
      }

      setVisibleCount(step);
      setActiveIdx(step - 1);
      step++;
      timerRef.current = setTimeout(tick, stepDelay);
    };

    timerRef.current = setTimeout(tick, 600);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [totalSteps, stepDelay, restartDelay]);

  const running = visibleCount > 0 && visibleCount <= totalSteps;

  // Render children with step index tracking
  let stepIdx = -1;

  const renderChildren = (nodes: React.ReactNode): React.ReactNode => {
    return React.Children.map(nodes, (child) => {
      if (!React.isValidElement(child)) return child;
      const type = child.type as React.FC;
      const name = type.displayName || type.name || '';

      if (name === 'AFConn') {
        // Connector visibility matches the next node
        const nextIdx = stepIdx + 1;
        return React.cloneElement(child as React.ReactElement<any>, {
          _visible: nextIdx < visibleCount,
        });
      }

      stepIdx++;
      const myIdx = stepIdx;
      const visible = myIdx < visibleCount;
      const active = myIdx === activeIdx;

      if (name === 'AFGroup') {
        // Render group children with continued index
        const groupChildren = renderChildren(child.props.children);
        return React.cloneElement(child as React.ReactElement<any>, {
          _visible: visible,
          _active: active,
          children: groupChildren,
        });
      }

      if (name === 'AFBranches') {
        return React.cloneElement(child as React.ReactElement<any>, {
          _visible: visible,
          _active: active,
        });
      }

      return React.cloneElement(child as React.ReactElement<any>, {
        _visible: visible,
        _active: active,
      });
    });
  };

  return (
    <div className={s.container}>
      <div className={s.status}>
        <span className={running ? s.statusDot : s.statusDotIdle} />
        {running ? 'auto-playing' : 'idle'}
      </div>
      <div className={s.flow}>
        {renderChildren(children)}
      </div>
    </div>
  );
}

/* ================================================================
   Child Components
   ================================================================ */

type Variant = 'default' | 'primary' | 'success' | 'highlight' | 'subtle';

const variantClass: Record<Variant, string> = {
  default: '',
  primary: s.nodePrimary,
  success: s.nodeSuccess,
  highlight: s.nodeHighlight,
  subtle: s.nodeSubtle,
};

interface AFNodeProps {
  children: React.ReactNode;
  icon?: string;
  variant?: Variant;
  _visible?: boolean;
  _active?: boolean;
}

export function AFNode({ children, icon, variant = 'default', _visible = false, _active = false }: AFNodeProps) {
  return (
    <div className={`${s.nodeWrap} ${_visible ? s.nodeVisible : ''} ${_active ? s.nodeActive : ''}`}>
      <div className={`${s.node} ${variantClass[variant]} ${_active ? s.nodeGlow : ''}`}>
        {icon && <div className={s.nodeIcon}>{icon}</div>}
        <span>{children}</span>
      </div>
    </div>
  );
}
AFNode.displayName = 'AFNode';

interface AFConnProps {
  size?: 'short' | 'normal';
  _visible?: boolean;
}

export function AFConn({ size = 'normal', _visible = false }: AFConnProps) {
  return (
    <div className={`${s.conn} ${size === 'short' ? s.connShort : ''} ${_visible ? s.connVisible : ''}`} />
  );
}
AFConn.displayName = 'AFConn';

interface AFGroupProps {
  label: string;
  children: React.ReactNode;
  _visible?: boolean;
  _active?: boolean;
}

export function AFGroup({ label, children, _visible = false }: AFGroupProps) {
  return (
    <div className={`${s.nodeWrap} ${_visible ? s.nodeVisible : ''}`}>
      <div className={s.group}>
        <div className={s.groupLabel}>{label}</div>
        {children}
      </div>
    </div>
  );
}
AFGroup.displayName = 'AFGroup';

interface AFBranchesProps {
  children: React.ReactNode;
  _visible?: boolean;
  _active?: boolean;
}

export function AFBranches({ children, _visible = false }: AFBranchesProps) {
  return (
    <div className={`${s.nodeWrap} ${_visible ? s.nodeVisible : ''}`}>
      <div className={s.branches}>
        {children}
      </div>
    </div>
  );
}
AFBranches.displayName = 'AFBranches';
