import React, { useState } from "react";
import { ZenTask } from "../types";
import { TaskItem } from "./TaskItem";
import { ZenDateTimePicker } from "./ZenDateTimePicker";

interface TaskChecklistProps {
  tasks: ZenTask[];
  useLightText: boolean;
  textColor?: string | null;
  accentColor?: string | null;
  isEditing: boolean;
  onAddTask: (title: string, deadlineIso: string) => void;
  onToggleTask: (id: string) => void;
  onUpdateTaskTitle: (id: string, title: string) => void;
  onUpdateTaskDeadline: (id: string, deadlineIso: string) => void;
  onFocusTaskAsMain: (task: ZenTask) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskChecklist: React.FC<TaskChecklistProps> = ({
  tasks,
  useLightText,
  textColor,
  accentColor,
  isEditing,
  onAddTask,
  onToggleTask,
  onUpdateTaskTitle,
  onUpdateTaskDeadline,
  onFocusTaskAsMain,
  onDeleteTask,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState(() => {
    const d = new Date(Date.now() + 86400000 * 3);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTaskTitle.trim();
    if (!trimmed || !newTaskDeadline) return;
    onAddTask(trimmed, newTaskDeadline);
    setNewTaskTitle("");
  };

  const textStyle = textColor ? { color: textColor } : undefined;
  const accentBorderStyle = accentColor
    ? { borderColor: `${accentColor}66` }
    : undefined;

  return (
    <div
      style={accentBorderStyle}
      className={`max-w-2xl mx-auto rounded-3xl border p-5 md:p-6 text-left backdrop-blur-md transition-all ${
        useLightText
          ? "bg-stone-950/50 border-stone-700/60 text-stone-100"
          : "bg-white/65 border-stone-200/80 text-stone-800"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            style={textStyle}
            className="text-xs uppercase tracking-[0.22em] font-medium"
          >
            Mindful Milestones & Deadlines
          </h2>
          {isEditing && (
            <p
              className={`text-[11px] font-light mt-0.5 ${
                useLightText ? "text-stone-400" : "text-stone-500"
              }`}
            >
              Edit task names or dates inline — click ◎ to feature a task on the
              main countdown
            </p>
          )}
        </div>
        <span
          style={
            accentColor
              ? { borderColor: `${accentColor}80`, color: accentColor }
              : undefined
          }
          className={`font-mono-zen text-xs px-2.5 py-1 rounded-full border ${
            useLightText
              ? "border-stone-700 bg-stone-900/70 text-stone-300"
              : "border-stone-200 bg-stone-100 text-stone-600"
          }`}
        >
          {completedCount}/{tasks.length} done
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <div className="text-center py-6 text-xs font-light italic text-stone-400">
            No milestones yet.
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              useLightText={useLightText}
              textColor={textColor}
              accentColor={accentColor}
              isEditing={isEditing}
              onToggle={onToggleTask}
              onUpdateTitle={onUpdateTaskTitle}
              onUpdateDeadline={onUpdateTaskDeadline}
              onFocusAsMain={onFocusTaskAsMain}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>

      {/* Add New Task Form (Shown only when Edit Mode is active) */}
      {isEditing && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 pt-3 border-t border-stone-500/15 flex flex-col sm:flex-row items-center gap-2.5"
        >
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task or milestone..."
            className={`flex-1 w-full text-xs px-3.5 py-2 rounded-xl border bg-transparent focus:outline-none ${
              useLightText
                ? "border-stone-700/80 text-stone-100 placeholder:text-stone-500 focus:border-stone-400"
                : "border-stone-300/90 text-stone-800 placeholder:text-stone-400 focus:border-stone-700"
            }`}
          />
          <ZenDateTimePicker
            value={newTaskDeadline}
            onChange={setNewTaskDeadline}
            useLightText={useLightText}
            accentColor={accentColor}
            ariaLabel="New task deadline"
          />
          <button
            type="submit"
            style={
              accentColor
                ? { backgroundColor: accentColor, color: "#1C1917" }
                : undefined
            }
            className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wider uppercase transition-all cursor-pointer shrink-0 ${
              useLightText
                ? "bg-stone-100 text-stone-900 hover:bg-white"
                : "bg-stone-900 text-stone-50 hover:bg-stone-800"
            }`}
          >
            + Add Task
          </button>
        </form>
      )}
    </div>
  );
};
