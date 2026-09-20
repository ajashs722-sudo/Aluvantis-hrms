import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Department, Employee, UserRole } from '../../types';
import { canEditOrg } from '../../lib/orgService';
import { computeAutoLayout, computeBoundingBox, LayoutNode, NODE_WIDTH, NODE_HEIGHT } from '../../lib/treeLayout';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const canEdit = canEditOrg(userRole);

  // Nodes state initialized from departments
  const [nodes, setNodes] = useState<LayoutNode[]>(() => computeAutoLayout(departments));
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  // Viewport State: Pan (x, y) & Zoom Scale
  const [viewport, setViewport] = useState<{ x: number; y: number; zoom: number }>({
    x: 40,
    y: 40,
    zoom: 1.0,
  });
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPanning, setIsPanning] = useState(false);

  // Node Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<number | null>(null);

  // Modals state
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deletingDept, setDeletingDept] = useState<Department | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [parentForNewDept, setParentForNewDept] = useState<number | null>(null);

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

  // Center nodes function
  const centerNodesInContainer = useCallback((customNodes?: LayoutNode[]) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width < 100 || rect.height < 100) return;

    const currentNodes = customNodes || nodesRef.current;
    if (currentNodes.length === 0) return;

    const bbox = computeBoundingBox(currentNodes);
    const paddingX = 40;
    const paddingY = 40;
    const scaleX = (rect.width - paddingX) / Math.max(1, bbox.width);
    const scaleY = (rect.height - paddingY) / Math.max(1, bbox.height);
    const fitScale = Math.min(1.0, Math.max(0.4, Math.min(scaleX, scaleY)));

    // Calculate center offset
    const scaledWidth = bbox.width * fitScale;
    const centerX = Math.max(20, Math.round((rect.width - scaledWidth) / 2 - bbox.minX * fitScale));
    const centerY = Math.max(30, Math.round(40));

    const next = { x: centerX, y: centerY, zoom: Number(fitScale.toFixed(2)) };
    viewportRef.current = next;
    setViewport(next);
  }, []);

  // Auto-center content on initial mount or when container becomes visible
  const hasCentered = useRef(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 200 && entry.contentRect.height > 200) {
          if (!hasCentered.current) {
            hasCentered.current = true;
            centerNodesInContainer();
          }
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [centerNodesInContainer]);

  // Zoom-to-point math: keeps point under cursor stationary
  const zoomAtPoint = useCallback((newZoomRaw: number, cursorX: number, cursorY: number) => {
    const newZoom = Math.min(3.0, Math.max(0.25, Number(newZoomRaw.toFixed(2))));
    const prev = viewportRef.current;
    if (Math.abs(prev.zoom - newZoom) < 0.001) return;

    const zoomFactor = newZoom / prev.zoom;
    const newX = cursorX - (cursorX - prev.x) * zoomFactor;
    const newY = cursorY - (cursorY - prev.y) * zoomFactor;

    const next = { x: Math.round(newX), y: Math.round(newY), zoom: newZoom };
    viewportRef.current = next;
    setViewport(next);
  }, []);

  // Save node coordinate back to departments state
  const persistNodePosition = useCallback(
    (nodeId: number, x: number, y: number) => {
      const updated = departments.map((d) => (d.id === nodeId ? { ...d, x, y } : d));
      onUpdateDepartments(updated);
    },
    [departments, onUpdateDepartments]
  );

  // Re-organize / Auto-layout reset
  const handleAutoLayout = useCallback(() => {
    // Reset positions in departments
    const resetDepts = departments.map((d) => ({ ...d, x: undefined, y: undefined }));
    const newNodes = computeAutoLayout(resetDepts);
    setNodes(newNodes);
    onUpdateDepartments(resetDepts);
    centerNodesInContainer(newNodes);
  }, [departments, onUpdateDepartments, centerNodesInContainer]);

  // Wheel Zoom Listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      let delta = -e.deltaY * 0.0015;
      if (Math.abs(delta) > 0.25) delta = Math.sign(delta) * 0.25;

      const currentZoom = viewportRef.current.zoom;
      zoomAtPoint(currentZoom * (1 + delta), cursorX, cursorY);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [zoomAtPoint]);

  // Touch Pinch & Touch Pan Handling
  const touchPinchState = useRef<{
    initialDist: number;
    initialZoom: number;
    centerX: number;
    centerY: number;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const rect = container.getBoundingClientRect();
        touchPinchState.current = {
          initialDist: dist,
          initialZoom: viewportRef.current.zoom,
          centerX: (t1.clientX + t2.clientX) / 2 - rect.left,
          centerY: (t1.clientY + t2.clientY) / 2 - rect.top,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchPinchState.current) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const ratio = dist / touchPinchState.current.initialDist;
        const targetZoom = touchPinchState.current.initialZoom * ratio;
        zoomAtPoint(
          targetZoom,
          touchPinchState.current.centerX,
          touchPinchState.current.centerY
        );
      }
    };

    const handleTouchEnd = () => {
      touchPinchState.current = null;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [zoomAtPoint]);

  // Background Canvas Panning Handler
  const handlePointerDownBg = (e: React.PointerEvent) => {
    // If clicked on node or interactive elements, ignore background pan
    if ((e.target as HTMLElement).closest('button, input, select, textarea, [data-canvas-node="true"]')) {
      return;
    }

    e.preventDefault();
    setIsPanning(true);
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startViewportX = viewportRef.current.x;
    const startViewportY = viewportRef.current.y;
    const activePointerId = e.pointerId;

    const onMove = (moveEvt: PointerEvent) => {
      if (moveEvt.pointerId !== activePointerId) return;
      moveEvt.preventDefault();
      const dx = moveEvt.clientX - startClientX;
      const dy = moveEvt.clientY - startClientY;
      const next = {
        ...viewportRef.current,
        x: Math.round(startViewportX + dx),
        y: Math.round(startViewportY + dy),
      };
      viewportRef.current = next;
      setViewport(next);
    };

    const onUp = (upEvt: PointerEvent) => {
      if (upEvt.pointerId !== activePointerId) return;
      setIsPanning(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  // Node Dragging Handler (Fix: exact 1:1 movement with pointer zoom calculation)
  const handlePointerDownNode = (e: React.PointerEvent, nodeId: number) => {
    // Stop propagation so canvas background pan is NOT triggered
    e.stopPropagation();

    // Check if clicked element was a button or link inside node
    if ((e.target as HTMLElement).closest('button, input, [role="button"], a')) {
      return;
    }

    if (!canEdit) return;

    const targetNode = nodesRef.current.find((n) => n.id === nodeId);
    if (!targetNode) return;

    // Set pointer capture to prevent pointer event loss and keep tracking reliable
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore in test envs
    }

    setDraggingNodeId(nodeId);
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startNodeX = targetNode.x;
    const startNodeY = targetNode.y;
    const activePointerId = e.pointerId;

    let finalX = startNodeX;
    let finalY = startNodeY;

    const onNodeMove = (moveEvt: PointerEvent) => {
      if (moveEvt.pointerId !== activePointerId) return;
      moveEvt.preventDefault();

      const currentZoom = viewportRef.current.zoom;
      // Exact un-scaled delta in canvas coordinates:
      const dx = (moveEvt.clientX - startClientX) / currentZoom;
      const dy = (moveEvt.clientY - startClientY) / currentZoom;

      finalX = Math.round(startNodeX + dx);
      finalY = Math.round(startNodeY + dy);

      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, x: finalX, y: finalY } : n))
      );
    };

    const onNodeUp = (upEvt: PointerEvent) => {
      if (upEvt.pointerId !== activePointerId) return;
      setDraggingNodeId(null);
      persistNodePosition(nodeId, finalX, finalY);
      window.removeEventListener('pointermove', onNodeMove);
      window.removeEventListener('pointerup', onNodeUp);
      window.removeEventListener('pointercancel', onNodeUp);
    };

    window.addEventListener('pointermove', onNodeMove, { passive: false });
    window.addEventListener('pointerup', onNodeUp);
    window.addEventListener('pointercancel', onNodeUp);
  };

  // Fit to screen calculation
  const handleFitToScreen = () => {
    centerNodesInContainer();
  };

  // Reset to 100% initial view
  const handleReset = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rootNode = nodesRef.current[0];
    const rootX = rootNode ? rootNode.x : 400;
    const next = {
      x: Math.round(rect.width / 2 - (rootX + NODE_WIDTH / 2)),
      y: 40,
      zoom: 1.0,
    };
    viewportRef.current = next;
    setViewport(next);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDownBg}
      style={{ touchAction: 'none', userSelect: 'none' }}
      className={`relative w-full h-full min-h-[480px] flex-1 overflow-hidden select-none bg-[#F6F3EC] dark:bg-[#14201F] transition-all duration-200 ${
        isFullScreen
          ? 'fixed inset-0 z-50 h-screen w-screen'
          : 'w-full h-full'
      } ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      {/* Interactive Dot Grid Pattern Synced with Pan & Zoom */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(14, 79, 79, 0.6) 1.5px, transparent 1.5px)',
          backgroundPosition: `${viewport.x}px ${viewport.y}px`,
          backgroundSize: `${32 * viewport.zoom}px ${32 * viewport.zoom}px`,
        }}
      />

      {/* Floating Canvas Toolbar */}
      <OrgCanvasToolbar
        zoom={viewport.zoom}
        onZoomIn={() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          zoomAtPoint(viewport.zoom + 0.25, rect.width / 2, rect.height / 2);
        }}
        onZoomOut={() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          zoomAtPoint(viewport.zoom - 0.25, rect.width / 2, rect.height / 2);
        }}
        onFitToScreen={handleFitToScreen}
        onReset={handleReset}
        onAutoLayout={handleAutoLayout}
        isFullScreen={isFullScreen}
        onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
      />

      {/* UNIFIED TRANSFORM WRAPPER FOR ALL NODES & SVG CONNECTORS */}
      <div
        style={{
          transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
          willChange: 'transform',
          width: '8000px',
          height: '8000px',
        }}
        className="absolute top-0 left-0 pointer-events-auto"
      >
        {/* Dynamic SVG Connections Layer */}
        <OrgCanvasConnections nodes={nodes} />

        {/* Department & Employee Hierarchy Node Cards */}
        {nodes.map((node) => {
          const dept = departments.find((d) => d.id === node.id) || {
            id: node.id,
            company_id: 1,
            name: node.name,
            color: node.color,
            head_employee_id: node.head_employee_id,
            created_at: '',
          };

          return (
            <OrgCanvasNode
              key={node.id}
              node={node}
              department={dept}
              employees={employees}
              canEdit={canEdit}
              isDragging={draggingNodeId === node.id}
              zoom={viewport.zoom}
              onPointerDownNode={handlePointerDownNode}
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
          );
        })}
      </div>

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
