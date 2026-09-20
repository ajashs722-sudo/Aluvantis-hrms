import React, { useState } from 'react';
import {
  Crown,
  Users,
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Eye,
  Maximize2,
} from 'lucide-react';
import { Department, Employee } from '../../types';
import { LayoutNode, NODE_WIDTH } from '../../lib/treeLayout';

interface OrgCanvasNodeProps {
  node: LayoutNode;
  department: Department;
  employees: Employee[];
  canEdit: boolean;
  isDragging: boolean;
  zoom?: number;
  onPointerDownNode: (e: React.PointerEvent, nodeId: number) => void;
  onEdit: (dept: Department) => void;
  onDelete: (deptId: number) => void;
  onAddSub: (deptId: number) => void;
  onSelectEmployee: (emp: Employee) => void;
}

export const OrgCanvasNode: React.FC<OrgCanvasNodeProps> = ({
  node,
  department,
  employees,
  canEdit,
  isDragging,
  zoom = 1,
  onPointerDownNode,
  onEdit,
  onDelete,
  onAddSub,
  onSelectEmployee,
}) => {
  const [showAllEmployees, setShowAllEmployees] = useState(true);
  const [forcedExpanded, setForcedExpanded] = useState(false);

  // All employees belonging to this department
  const deptEmployees = employees.filter(
    (e) => e.department_id === department.id || e.department === department.name
  );

  // Department head
  const head = employees.find((e) => e.id === department.head_employee_id);

  // Subordinate staff (excluding head to show hierarchy clearly)
  const staffMembers = deptEmployees.filter((e) => !head || e.id !== head.id);

  // Is zoomed far out? (Level of Detail LOD threshold)
  const isFarZoom = zoom < 0.55 && !forcedExpanded;

  return (
    <div
      data-canvas-node="true"
      id={`org-node-${node.id}`}
      style={{
        position: 'absolute',
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${NODE_WIDTH}px`,
        touchAction: 'none',
      }}
      onPointerDown={(e) => onPointerDownNode(e, node.id)}
      className={`rounded-2xl select-none transition-[shadow,border-color,background-color] duration-150 group z-10 flex flex-col border ${
        isDragging
          ? 'shadow-2xl ring-2 ring-[#C6A15B] cursor-grabbing opacity-95 bg-[#FAF8F5] dark:bg-[#182726]'
          : 'shadow-md hover:shadow-xl bg-[#FAF8F5] dark:bg-[#182726] border-border/80 hover:border-[#C6A15B]/50 cursor-grab'
      } ${isFarZoom ? 'p-2.5 pb-2.5' : 'p-3'}`}
    >
      {/* Top Connection Socket Pin (Anchor where parent line connects) */}
      {node.parent_id && (
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FAF8F5] dark:bg-[#182726] border-2 border-[#0E4F4F] dark:border-[#C6A15B] shadow-xs z-20 pointer-events-none" />
      )}

      {/* 1. Header: Department Name, Color & Actions */}
      <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-border/70 pointer-events-auto">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div
            className="w-3.5 h-3.5 rounded-md shrink-0 shadow-xs ring-1 ring-black/10 dark:ring-white/20"
            style={{ backgroundColor: node.color || '#0E4F4F' }}
          />
          <div className="min-w-0 flex-1">
            <h4
              className="font-display font-extrabold text-xs text-foreground truncate leading-tight"
              title={node.name}
            >
              {node.name}
            </h4>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
              <span>{deptEmployees.length} ta xodim</span>
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div
          className="flex items-center gap-0.5 shrink-0"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {isFarZoom ? (
            <button
              type="button"
              onClick={() => setForcedExpanded(true)}
              title="Kattalashtirib ko‘rish"
              className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground cursor-pointer transition"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            canEdit && (
              <>
                <button
                  type="button"
                  onClick={() => onAddSub(department.id)}
                  title="Quyi bo‘lim qo‘shish"
                  className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(department)}
                  title="Tahrirlash"
                  className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground cursor-pointer transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(department.id)}
                  title="O‘chirish"
                  className="p-1 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 cursor-pointer transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )
          )}
        </div>
      </div>

      {/* When Zoomed Far Out: Simplified Capsule View */}
      {isFarZoom ? (
        <div className="pt-2 flex items-center justify-between gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 min-w-0">
            {head ? (
              <>
                {head.avatar_url ? (
                  <img
                    src={head.avatar_url}
                    alt={head.full_name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-[#C6A15B] shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#C6A15B] text-[#14201F] font-bold text-[10px] flex items-center justify-center shrink-0">
                    {head.full_name.charAt(0)}
                  </div>
                )}
                <span className="text-[11px] font-semibold text-foreground truncate">
                  {head.full_name}
                </span>
              </>
            ) : (
              <span className="text-[10px] text-muted-foreground italic">
                Rahbarsiz
              </span>
            )}
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#0E4F4F]/10 dark:bg-[#C6A15B]/20 text-[#0E4F4F] dark:text-[#C6A15B] font-bold shrink-0">
            {deptEmployees.length} ta
          </span>
        </div>
      ) : (
        /* Full Detailed View */
        <>
          {/* 2. Department Head (Rahbar / Boshliq) Card */}
          <div className="pt-2 pb-1.5 pointer-events-auto">
            <div className="text-[9px] font-bold text-muted-foreground tracking-wider uppercase flex items-center justify-between mb-1">
              <span className="flex items-center gap-1 text-[#C6A15B]">
                <Crown className="w-3 h-3 text-[#C6A15B]" /> Bo‘lim Rahbari
              </span>
              {head && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#C6A15B]/15 text-[#C6A15B] font-semibold">
                  Boshqaruvchi
                </span>
              )}
            </div>

            {head ? (
              <div
                onClick={() => onSelectEmployee(head)}
                onPointerDown={(e) => e.stopPropagation()}
                title="Xodim profilini ochish"
                className="p-2 rounded-xl bg-gradient-to-r from-[#C6A15B]/10 to-transparent border border-[#C6A15B]/30 hover:border-[#C6A15B] flex items-center justify-between gap-2 cursor-pointer transition group/head"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {head.avatar_url ? (
                    <img
                      src={head.avatar_url}
                      alt={head.full_name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-[#C6A15B] shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#C6A15B] text-[#14201F] font-bold text-xs flex items-center justify-center shrink-0">
                      {head.full_name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-foreground truncate group-hover/head:text-[#C6A15B] transition">
                      {head.full_name}
                    </p>
                    <p className="text-[9px] text-muted-foreground truncate">{head.position}</p>
                  </div>
                </div>
                <Eye className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover/head:opacity-100 transition shrink-0" />
              </div>
            ) : (
              <div
                onPointerDown={(e) => e.stopPropagation()}
                className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-dashed border-border flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground italic"
              >
                <Crown className="w-3 h-3 opacity-40" />
                <span>Rahbar tayinlanmagan</span>
              </div>
            )}
          </div>

          {/* 3. Subordinate Employees Hierarchy */}
          <div className="pt-1 pointer-events-auto">
            <div
              onClick={() => setShowAllEmployees(!showAllEmployees)}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer py-1"
            >
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-[#0E4F4F] dark:text-[#C6A15B]" />
                <span>Xodimlar ({staffMembers.length})</span>
              </span>
              <button type="button" className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10">
                {showAllEmployees ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            </div>

            {showAllEmployees && (
              <div className="space-y-1 mt-1 max-h-[140px] overflow-y-auto pr-0.5 custom-scrollbar">
                {staffMembers.length === 0 ? (
                  <p className="text-[9px] text-muted-foreground/80 italic py-1 text-center bg-black/5 dark:bg-white/5 rounded-lg">
                    Quyi xodimlar yo‘q
                  </p>
                ) : (
                  staffMembers.map((emp) => (
                    <div
                      key={emp.id}
                      onClick={() => onSelectEmployee(emp)}
                      onPointerDown={(e) => e.stopPropagation()}
                      title={`${emp.full_name} (${emp.position})`}
                      className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-[#0E4F4F]/10 dark:hover:bg-[#C6A15B]/15 border border-border/60 hover:border-[#0E4F4F]/30 dark:hover:border-[#C6A15B]/30 flex items-center justify-between gap-1.5 cursor-pointer transition group/emp"
                    >
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        {emp.avatar_url ? (
                          <img
                            src={emp.avatar_url}
                            alt={emp.full_name}
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-border shrink-0"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#0E4F4F]/20 text-[#0E4F4F] dark:text-[#C6A15B] font-bold text-[9px] flex items-center justify-center shrink-0">
                            {emp.full_name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold text-foreground truncate leading-tight group-hover/emp:text-[#0E4F4F] dark:group-hover/emp:text-[#C6A15B]">
                            {emp.full_name}
                          </p>
                          <p className="text-[8px] text-muted-foreground truncate leading-tight">
                            {emp.position}
                          </p>
                        </div>
                      </div>
                      <Eye className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover/emp:opacity-100 transition shrink-0" />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 4. Footer: Drag Handle Hint */}
          <div className="mt-2 pt-1 border-t border-border/50 flex items-center justify-between text-[9px] text-muted-foreground/70">
            <span className="flex items-center gap-1">
              <Briefcase className="w-2.5 h-2.5" />
              <span>{node.parent_id ? 'Bo‘ysunuvchi bo‘lim' : 'Bosh bo‘lim'}</span>
            </span>
            <span className="flex items-center gap-0.5 font-medium text-foreground/50">
              <GripVertical className="w-3 h-3" /> Siljitish
            </span>
          </div>
        </>
      )}

      {/* Bottom Connection Socket Pin (Anchor where child branches start) */}
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FAF8F5] dark:bg-[#182726] border-2 border-[#0E4F4F] dark:border-[#C6A15B] shadow-xs z-20 pointer-events-none" />
    </div>
  );
};
