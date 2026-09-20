import React from 'react';
import { LayoutNode, NODE_WIDTH, NODE_HEIGHT } from '../../lib/treeLayout';

interface OrgCanvasConnectionsProps {
  nodes: LayoutNode[];
}

export const OrgCanvasConnections: React.FC<OrgCanvasConnectionsProps> = ({ nodes }) => {
  const nodeMap = new Map<number, LayoutNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  const connections: {
    id: string;
    d: string;
    color: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }[] = [];

  nodes.forEach((node) => {
    if (node.parent_id && nodeMap.has(node.parent_id)) {
      const parent = nodeMap.get(node.parent_id)!;

      // Parent bottom center anchor
      const startX = parent.x + NODE_WIDTH / 2;
      const startY = parent.y + NODE_HEIGHT;

      // Child top center anchor
      const endX = node.x + NODE_WIDTH / 2;
      const endY = node.y;

      const dy = endY - startY;
      const cOffset = Math.max(30, Math.abs(dy) * 0.45);

      const d = `M ${startX} ${startY} C ${startX} ${startY + cOffset}, ${endX} ${endY - cOffset}, ${endX} ${endY}`;

      connections.push({
        id: `conn-${parent.id}-${node.id}`,
        d,
        color: node.color || '#0E4F4F',
        startX,
        startY,
        endX,
        endY,
      });
    }
  });

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none z-0 overflow-visible"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
        </filter>
      </defs>

      {connections.map((c) => (
        <g key={c.id}>
          {/* Base stroke glow */}
          <path
            d={c.d}
            stroke="currentColor"
            className="text-black/15 dark:text-white/20"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Styled dashed connection */}
          <path
            d={c.d}
            stroke={c.color}
            strokeWidth="2.5"
            strokeDasharray="6,4"
            strokeLinecap="round"
            fill="none"
            filter="url(#line-glow)"
          />

          {/* Start anchor circle on parent */}
          <circle
            cx={c.startX}
            cy={c.startY}
            r="4"
            fill={c.color}
            stroke="#ffffff"
            strokeWidth="1.5"
            className="shadow-xs"
          />

          {/* End anchor circle on child */}
          <circle
            cx={c.endX}
            cy={c.endY}
            r="4.5"
            fill="#ffffff"
            stroke={c.color}
            strokeWidth="2"
            className="shadow-xs"
          />
        </g>
      ))}
    </svg>
  );
};
