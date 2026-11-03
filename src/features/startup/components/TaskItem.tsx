import React from "react";
import { ZenTask } from "../types";
import { formatTaskCountdown } from "../utils/time";

interface TaskItemProps {
  task: ZenTask;
  useLightText: boolean;
  textColor?: string | null;
  accentColor?: string | null;
  isEditing: boolean;
  onToggle: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateDeadline: (id: string, deadlineIso: string) => void;
  onFocusAsMain: (task: ZenTask) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  useLightText,
  textColor,
  accentColor,
  isEditing,
  onToggle,
  onUpdateTitle,
  onUpdateDeadline,
  onFocusAsMain,
  onDelete,
}) => {
  const status = formatTaskCountdown(task.deadlineIso, task.completed);
  const textStyle = textColor ? { color: textColor } : undefined;
  const checkedStyle =
    task.completed && accentColor
      ? { backgroundColor: accentColor, borderColor: accentColor }
      : undefined;

  return (
    <div
      className={`group flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl border transition-all ${
        task.completed
          ? useLightText
            ? "border-stone-800/50 bg-stone-900/25 opacity-60"
            : "border-stone-200/50 bg-stone-100/50 opacity-65"
          : useLightText
            ? "border-stone-800/80 bg-stone-900/55 hover:border-stone-600"
            : "border-stone-200/90 bg-white/80 hover:border-stone-300"
      }`}
    >
      {/* Interactive Checkbox + Task Title (inline editable when isEditing) */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <label className="flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="sr-only"
          />
          <span
            style={checkedStyle}
            className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
              task.completed
                ? useLightText
                  ? "bg-emerald-400/90 border-emerald-400 text-stone-950"
                  : "bg-stone-800 border-stone-800 text-stone-50"
                : useLightText
                  ? "border-stone-500 hover:border-stone-300"
                  : "border-stone-400 hover:border-stone-700"
            }`}
          >
            {task.completed && (
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6.5L5 9L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </label>

        {isEditing ? (
          <input
            type="text"
            value={task.title}
            onChange={(e) => onUpdateTitle(task.id, e.target.value)}
            style={textStyle}
            className={`w-full text-xs md:text-sm font-light bg-transparent border-b border-dashed pb-0.5 focus:outline-none ${
              useLightText
                ? "border-stone-600 text-stone-100 focus:border-stone-300"
                : "border-stone-300 text-stone-800 focus:border-stone-700"
            }`}
          />
        ) : (
          <span
            onClick={() => onToggle(task.id)}
            style={textStyle}
            className={`text-xs md:text-sm font-light truncate transition-all cursor-pointer select-none ${
              task.completed ? "line-through opacity-75" : ""
            }`}
          >
            {task.title}
          </span>
        )}
      </div>

      {/* Right side: Either Live Deadline Badge OR Inline Date Picker at the exact same spot */}
      <div className="flex items-center gap-2 shrink-0">
        {isEditing ? (
          <>
            <input
              type="datetime-local"
              value={task.deadlineIso.slice(0, 16)}
              onChange={(e) => {
                if (e.target.value) {
                  onUpdateDeadline(task.id, e.target.value);
                }
              }}
              title="Change task deadline"
              className={`text-[11px] font-mono-zen bg-transparent border rounded-full px-2.5 py-0.5 focus:outline-none cursor-pointer ${
                useLightText
                  ? "border-stone-700 bg-stone-900/80 text-stone-200"
                  : "border-stone-300 bg-stone-100 text-stone-700"
              }`}
            />

            <button
              type="button"
              onClick={() => onFocusAsMain(task)}
              title="Set this task as the main countdown"
              className={`p-1 rounded-lg text-xs transition-colors cursor-pointer ${
                useLightText
                  ? "text-stone-400 hover:text-stone-100 hover:bg-stone-800"
                  : "text-stone-400 hover:text-stone-800 hover:bg-stone-200/60"
              }`}
            >
              ◎
            </button>

            <button
              type="button"
              onClick={() => onDelete(task.id)}
              title="Remove task"
              className={`p-1 rounded-lg text-xs transition-colors cursor-pointer ${
                useLightText
                  ? "text-stone-500 hover:text-red-300 hover:bg-stone-800"
                  : "text-stone-400 hover:text-red-600 hover:bg-stone-200/60"
              }`}
            >
              ✕
            </button>
          </>
        ) : (
          <span
            style={
              accentColor && !status.isOverdue
                ? { borderColor: `${accentColor}66`, color: accentColor }
                : undefined
            }
            className={`font-mono-zen text-[11px] px-2.5 py-0.5 rounded-full border ${
              task.completed
                ? useLightText
                  ? "border-emerald-800/50 bg-emerald-950/40 text-emerald-300"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
                : status.isOverdue
                  ? useLightText
                    ? "border-amber-700/60 bg-amber-950/50 text-amber-300"
                    : "border-amber-300 bg-amber-50 text-amber-800"
                  : status.isUrgent
                    ? useLightText
                      ? "border-stone-600 bg-stone-800 text-stone-200"
                      : "border-stone-300 bg-stone-200/80 text-stone-800"
                    : useLightText
                      ? "border-stone-800 bg-stone-900/80 text-stone-400"
                      : "border-stone-200 bg-stone-100/80 text-stone-500"
            }`}
          >
            {status.label}
          </span>
        )}
      </div>
    </div>
  );
};
