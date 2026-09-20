import { Department } from '../types';

export interface LayoutNode {
  id: number;
  name: string;
  head_employee_id: number | null;
  parent_id: number | null;
  color: string;
  x: number;
  y: number;
}

export const NODE_WIDTH = 290;
export const NODE_HEIGHT = 210;
export const HORIZONTAL_GAP = 48;
export const VERTICAL_GAP = 80;

function isValidCoordinate(val: any): boolean {
  return typeof val === 'number' && !isNaN(val) && val >= 10 && val <= 3500;
}

/**
 * Computes coordinate layout for department nodes.
 * Preserves custom manual drag positions if defined, and applies tidy-tree layout otherwise.
 */
export function computeAutoLayout(departments: Department[]): LayoutNode[] {
  if (!departments || departments.length === 0) return [];

  // Hierarchy Tree Auto-Layout
  const rootDept = departments[0];
  const rootId = rootDept.id;
  const nodes: LayoutNode[] = [];

  // Group into roots vs subordinates
  const roots: Department[] = [];
  const subordinates: Department[] = [];

  departments.forEach((d, idx) => {
    if (idx === 0 || d.parent_id === null || d.parent_id === undefined) {
      roots.push(d);
    } else {
      subordinates.push(d);
    }
  });

  // Calculate layout widths
  const totalSubCols = Math.max(1, subordinates.length);
  const totalSubWidth = totalSubCols * NODE_WIDTH + Math.max(0, totalSubCols - 1) * HORIZONTAL_GAP;
  const totalRootsWidth = roots.length * NODE_WIDTH + Math.max(0, roots.length - 1) * HORIZONTAL_GAP;
  const contentWidth = Math.max(totalSubWidth, totalRootsWidth, 600);

  const startRootX = Math.max(40, (contentWidth - totalRootsWidth) / 2);
  const startChildX = Math.max(40, (contentWidth - totalSubWidth) / 2);

  // Position roots
  roots.forEach((root, rIdx) => {
    const rx = isValidCoordinate(root.x)
      ? root.x!
      : startRootX + rIdx * (NODE_WIDTH + HORIZONTAL_GAP * 2);
    const ry = isValidCoordinate(root.y) ? root.y! : 40;

    nodes.push({
      id: root.id,
      name: root.name,
      head_employee_id: root.head_employee_id ?? null,
      parent_id: null,
      color: root.color || '#C6A15B',
      x: rx,
      y: ry,
    });
  });

  // Position subordinates under root
  subordinates.forEach((dept, idx) => {
    const cx = isValidCoordinate(dept.x)
      ? dept.x!
      : startChildX + idx * (NODE_WIDTH + HORIZONTAL_GAP);
    const cy = isValidCoordinate(dept.y)
      ? dept.y!
      : 40 + NODE_HEIGHT + VERTICAL_GAP;

    const parentId = dept.parent_id ?? rootId ?? null;

    const exists = nodes.some((n) => n.id === dept.id);
    if (!exists) {
      nodes.push({
        id: dept.id,
        name: dept.name,
        head_employee_id: dept.head_employee_id ?? null,
        parent_id: parentId,
        color: dept.color || '#0E4F4F',
        x: cx,
        y: cy,
      });
    }
  });

  return nodes;
}

export function computeBoundingBox(nodes: LayoutNode[]) {
  if (!nodes || nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 800, maxY: 500, width: 800, height: 500 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((n) => {
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + NODE_WIDTH);
    maxY = Math.max(maxY, n.y + NODE_HEIGHT);
  });

  return {
    minX: Math.max(0, minX),
    minY: Math.max(0, minY),
    maxX,
    maxY,
    width: Math.max(200, maxX - Math.max(0, minX)),
    height: Math.max(150, maxY - Math.max(0, minY)),
  };
}
