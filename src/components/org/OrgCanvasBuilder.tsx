import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Department, Employee, UserRole } from '../../types';
import { canEditOrg } from '../../lib/orgService';
import { computeAutoLayout, computeBoundingBox, LayoutNode, NODE_WIDTH } from '../../lib/treeLayout';
import { OrgCanvasConnections } from './OrgCanvasConnections';
import { OrgCanvasNode } from './OrgCanvasNode';
import { OrgCanvasToolbar } from './OrgCanvasToolbar';
import { DepartmentEditModal } from './DepartmentEditModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface OrgCanvasBuilderProps {
  departments: Department[];
  employees: Employee[];
  userRole: UserRole;
  onUpdateDepartments: (depts: Department[]) => void;
  onSelectEmployee: (emp: Employee) => void;
  onAddDepartment: (dept: Partial<Department>) => void;
  onDeleteDepartment?: (id: number) => void;
}

export const OrgCanvasBuilder: React.FC<OrgCanvasBuilderProps> = ({
  departments,
  employees,
  userRole,
  onUpdateDepartments,
  onSelectEmployee,
  onAddDepartment,
  onDeleteDepartment,
}) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const canEdit = canEditOrg(userRole);

  // Viewport State: Pan (x, y) & Zoom Scale (z) with localStorage persistence
  const [v, setV] = useState<{ x: number; y: number; z: number }>(() => {
    const saved = localStorage.getItem('aluvantis_canvas_viewport');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (typeof p.x === 'number' && typeof p.y === 'number' && typeof p.z === 'number') {
          return p;
        }
      } catch {}
    }
    return { x: 40, y: 40, z: 1.0 };
  });

  const vRef = useRef(v);
  vRef.current = v;

  // Active Pointers & Mode Refs
  const ptrs = useRef<Map<number, { x: number; y: number }>>(new Map());
  const mode = useRef<null | 'pan' | 'pinch' | 'node'>(null);
  const nodeDrag = useRef<{ id: number; ox: number; oy: number } | null>(null);
  const pinchRef = useRef<{ dist: number; z: number } | null>(null);

  // Nodes state initialized from departments
  const [nodes, setNodes] = useState<LayoutNode[]>(() => computeAutoLayout(departments));
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  // Modals state
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deletingDept, setDeletingDept] = useState<Department | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [parentForNewDept, setParentForNewDept] = useState<number | null>(null);

  // Persist viewport to localStorage
  useEffect(() => {
    localStorage.setItem('aluvantis_canvas_viewport', JSON.stringify(v));
  }, [v]);

  // Keep nodes in sync when departments prop changes from outside
  useEffect(() => {
    setNodes((prev) => {
      const auto = computeAutoLayout(departments);
      return auto.map((a) => {
        const existing = prev.find((p) => p.id === a.id);
        return existing ? { ...a, x: existing.x, y: existing.y } : a;
      });
    });
  }, [departments]);

  // Screen to World Coordinates Transformation
  const world = useCallback((sx: number, sy: number) => {
    if (!frameRef.current) return { wx: 0, wy: 0 };
    const r = frameRef.current.getBoundingClientRect();
    const curV = vRef.current;
    return {
      wx: (sx - r.left - curV.x) / curV.z,
      wy: (sy - r.top - curV.y) / curV.z,
    };
  }, []);

  // Zoom-to-cursor math
  const zoomAt = useCallback((cx: number, cy: number, z2: number) => {
    setV((p) => {
      const z = Math.min(2.6, Math.max(0.25, z2));
      const nextX = cx - (cx - p.x) * (z / p.z);
      const nextY = cy - (cy - p.y) * (z / p.z);
      return { z, x: nextX, y: nextY };
    });
  }, []);

  // Node position persistence
  const persistNodePosition = useCallback(
    (nodeId: number, x: number, y: number) => {
      const updated = departments.map((d) => (d.id === nodeId ? { ...d, x, y } : d));
      onUpdateDepartments(updated);
    },
    [departments, onUpdateDepartments]
  );

  // Pointer Down (Pan & Pinch trigger)
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, input, select, textarea, [role="button"], a')) {
      return;
    }

    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    if (ptrs.current.size === 2) {
      mode.current = 'pinch';
      const pts = Array.from(ptrs.current.values());
      pinchRef.current = {
        dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
        z: vRef.current.z,
      };
    } else if (!nodeDrag.current) {
      mode.current = 'pan';
    }
  };

  // Pointer Move (Pan, Pinch & Node Drag)
  const onPointerMove = (e: React.PointerEvent) => {
    if (!ptrs.current.has(e.pointerId)) return;

    const prevP = ptrs.current.get(e.pointerId)!;
    const dx = e.clientX - prevP.x;
    const dy = e.clientY - prevP.y;
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (mode.current === 'pinch' && ptrs.current.size === 2 && pinchRef.current && frameRef.current) {
      const pts = Array.from(ptrs.current.values());
      const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      const r = frameRef.current.getBoundingClientRect();
      const ratio = currentDist / pinchRef.current.dist;
      zoomAt(midX - r.left, midY - r.top, pinchRef.current.z * ratio);
    } else if (mode.current === 'pan') {
      setV((p) => ({ ...p, x: p.x + dx, y: p.y + dy }));
    } else if (mode.current === 'node' && nodeDrag.current) {
      const w = world(e.clientX, e.clientY);
      const nextX = Math.round(w.wx - nodeDrag.current.ox);
      const nextY = Math.round(w.wy - nodeDrag.current.oy);
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeDrag.current!.id ? { ...n, x: nextX, y: nextY } : n))
      );
    }
  };

  // Pointer Up & Pointer Cancel
  const onPointerUp = (e: React.PointerEvent) => {
    ptrs.current.delete(e.pointerId);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (mode.current === 'node' && nodeDrag.current) {
      const targetNode = nodesRef.current.find((n) => n.id === nodeDrag.current?.id);
      if (targetNode) {
        persistNodePosition(targetNode.id, targetNode.x, targetNode.y);
      }
    }

    if (ptrs.current.size < 2 && mode.current === 'pinch') {
      mode.current = null;
      pinchRef.current = null;
    }
    if (ptrs.current.size === 0) {
      mode.current = null;
      nodeDrag.current = null;
    }
  };

  // Wheel Zoom Listener
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!frameRef.current) return;
    const r = frameRef.current.getBoundingClientRect();
    const cursorX = e.clientX - r.left;
    const cursorY = e.clientY - r.top;
    zoomAt(cursorX, cursorY, vRef.current.z * (e.deltaY < 0 ? 1.1 : 0.9));
  };

  // Start Node Drag on card wrapper
  const startNodeDrag = (n: LayoutNode) => (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, input, select, textarea, [role="button"], a')) {
      return;
    }
    e.stopPropagation();
    if (!canEdit) return;

    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const w = world(e.clientX, e.clientY);
    nodeDrag.current = { id: n.id, ox: w.wx - n.x, oy: w.wy - n.y };
    mode.current = 'node';
  };

  // Toolbar Fit to Screen Handler
  const handleFitToScreen = () => {
    if (!frameRef.current || nodesRef.current.length === 0) return;
    const r = frameRef.current.getBoundingClientRect();
    const bbox = computeBoundingBox(nodesRef.current);
    const padding = 40;
    const scaleX = (r.width - padding * 2) / Math.max(1, bbox.width);
    const scaleY = (r.height - padding * 2) / Math.max(1, bbox.height);
    const fitZoom = Math.min(2.6, Math.max(0.25, Math.min(scaleX, scaleY)));
    const fitX = Math.round((r.width - bbox.width * fitZoom) / 2 - bbox.minX * fitZoom);
    const fitY = Math.round((r.height - bbox.height * fitZoom) / 2 - bbox.minY * fitZoom);
    setV({ x: fitX, y: fitY, z: fitZoom });
  };

  // Toolbar Reset Handler
  const handleReset = () => {
    setV({ x: 40, y: 40, z: 1.0 });
  };

  // Auto Layout Reset Handler
  const handleAutoLayout = () => {
    const resetDepts = departments.map((d) => ({ ...d, x: undefined, y: undefined }));
    const newNodes = computeAutoLayout(resetDepts);
    setNodes(newNodes);
    onUpdateDepartments(resetDepts);
    handleFitToScreen();
  };

  return (
    <div
      ref={frameRef}
      className="relative w-full h-full overflow-hidden touch-none select-none bg-[#F6F3EC] dark:bg-[#14201F]"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      {/* Inner Transform Layer (World) */}
      <div
        className="absolute left-0 top-0"
        style={{
          transform: `translate(${v.x}px, ${v.y}px) scale(${v.z})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        {/* Background Grid Pattern (Child of inner transform layer, pans & zooms 1:1) */}
        <div
          className="absolute pointer-events-none opacity-40 dark:opacity-25"
          style={{
            left: -4000,
            top: -4000,
            width: 16000,
            height: 16000,
            backgroundImage:
              'radial-gradient(circle, rgba(14, 79, 79, 0.6) 1.5px, transparent 1.5px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* SVG Connectors (World Coordinates) */}
        <OrgCanvasConnections nodes={nodes} />

        {/* Department Node Cards */}
        {nodes.map((n) => {
          const dept = departments.find((d) => d.id === n.id) || {
            id: n.id,
            company_id: 1,
            name: n.name,
            color: n.color,
            head_employee_id: n.head_employee_id,
            created_at: '',
          };

          return (
            <div
              key={n.id}
              className="absolute pointer-events-auto"
              style={{ left: n.x, top: n.y, width: NODE_WIDTH }}
              onPointerDown={startNodeDrag(n)}
            >
              <OrgCanvasNode
                node={n}
                department={dept}
                employees={employees}
                canEdit={canEdit}
                isDragging={nodeDrag.current?.id === n.id}
                zoom={v.z}
                onPointerDownNode={() => {}}
                onEdit={(d) => setEditingDept(d)}
                onDelete={(id) => {
                  const target = departments.find((d) => d.id === id);
                  if (target) setDeletingDept(target);
                }}
                onAddSub={(deptId) => {
                  setParentForNewDept(deptId);
                  setIsAddModalOpen(true);
                }}
                onSelectEmployee={onSelectEmployee}
              />
            </div>
          );
        })}
      </div>

      {/* Toolbar Overlay outside transform layer */}
      <OrgCanvasToolbar
        zoom={v.z}
        onZoomIn={() => {
          if (!frameRef.current) return;
          const r = frameRef.current.getBoundingClientRect();
          zoomAt(r.width / 2, r.height / 2, v.z * 1.2);
        }}
        onZoomOut={() => {
          if (!frameRef.current) return;
          const r = frameRef.current.getBoundingClientRect();
          zoomAt(r.width / 2, r.height / 2, v.z * 0.8);
        }}
        onFitToScreen={handleFitToScreen}
        onReset={handleReset}
        onAutoLayout={handleAutoLayout}
        isFullScreen={false}
        onToggleFullScreen={() => {}}
      />

      {/* Department Edit & Add Modal */}
      <DepartmentEditModal
        isOpen={isAddModalOpen || editingDept !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingDept(null);
          setParentForNewDept(null);
        }}
        onSave={(data) => {
          if (editingDept) {
            onUpdateDepartments(
              departments.map((d) => (d.id === editingDept.id ? { ...d, ...data } : d))
            );
          } else {
            onAddDepartment(data);
          }
        }}
        initialDept={editingDept}
        employees={employees}
        parentDeptId={parentForNewDept}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deletingDept !== null}
        onClose={() => setDeletingDept(null)}
        onConfirm={() => {
          if (deletingDept && onDeleteDepartment) {
            onDeleteDepartment(deletingDept.id);
          }
        }}
        department={deletingDept}
      />
    </div>
  );
};
