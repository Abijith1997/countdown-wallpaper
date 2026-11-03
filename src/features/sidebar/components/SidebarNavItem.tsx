import React from "react";
import { ProjectCountdown } from "../types";

interface SidebarNavItemProps {
  project: ProjectCountdown;
  isActive: boolean;
  darkMode: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function getShortRemaining(targetIso: string): string {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (isNaN(diff)) return "—";
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  if (days > 0) return `${days}d ${hours}h`;
  const mins = Math.floor((diff / 1000 / 60) % 60);
  return `${hours}h ${mins}m`;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  project,
  isActive,
  darkMode,
  canDelete,
  onSelect,
  onDelete,
}) => {
  const doneCount = project.tasks.filter((t) => t.completed).length;
  const totalCount = project.tasks.length;
  const remaining = getShortRemaining(project.targetIso);

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      className={`group w-full text-left px-3.5 py-3 rounded-2xl transition-all duration-300 flex items-start justify-between gap-2 cursor-pointer border ${
        isActive
          ? darkMode
            ? "bg-stone-800/85 border-stone-700 text-stone-100"
            : "bg-stone-200/75 border-stone-300/80 text-stone-900"
          : darkMode
            ? "border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/35"
            : "border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100/90"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full shrink-0 ${
              isActive
                ? darkMode
                  ? "bg-emerald-300"
                  : "bg-stone-800"
                : "bg-stone-400/50"
            }`}
          />
          <span className="text-xs font-medium tracking-wide truncate">
            {project.title}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1.5 pl-3.5">
          <span
            className={`font-mono-zen text-[10px] px-2 py-0.5 rounded-full ${
              isActive
                ? darkMode
                  ? "bg-stone-900/90 text-stone-200"
                  : "bg-white/80 text-stone-700"
                : darkMode
                  ? "bg-stone-900/50 text-stone-400"
                  : "bg-stone-200/50 text-stone-500"
            }`}
          >
            {remaining}
          </span>
          <span
            className={`text-[10px] font-light ${
              darkMode ? "text-stone-500" : "text-stone-400"
            }`}
          >
            {doneCount}/{totalCount} tasks
          </span>
        </div>
      </div>

      {canDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete project countdown"
          className={`opacity-0 group-hover:opacity-100 p-1 rounded-lg text-[11px] transition-opacity cursor-pointer ${
            darkMode
              ? "text-stone-500 hover:text-red-300 hover:bg-stone-700/50"
              : "text-stone-400 hover:text-red-600 hover:bg-stone-300/50"
          }`}
        >
          ✕
        </button>
      )}
    </div>
  );
};
