import React, { useState } from "react";
import { ZenDateTimePicker } from "./ZenDateTimePicker";

interface EmptyProjectStateProps {
  darkMode: boolean;
  onCreateProject: (
    title: string,
    targetIso: string,
    showSubtasks: boolean
  ) => void;
}

export const EmptyProjectState: React.FC<EmptyProjectStateProps> = ({
  darkMode,
  onCreateProject,
}) => {
  const [title, setTitle] = useState("");
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [targetIso, setTargetIso] = useState(() => {
    const d = new Date(Date.now() + 86400000 * 14);
    d.setHours(23, 59, 0, 0);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T23:59`;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || !targetIso) return;
    onCreateProject(trimmed, targetIso, showSubtasks);
  };

  return (
    <div className="relative z-10 m-auto max-w-md w-full text-center px-6">
      <div
        className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full mb-5 border ${
          darkMode
            ? "border-stone-800 bg-stone-900/50 text-stone-300"
            : "border-stone-200/80 bg-white/60 text-stone-600"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70 animate-ping" />
        <span className="text-[11px] uppercase tracking-[0.2em] font-light">
          Kanso Sanctuary
        </span>
      </div>

      <h1 className="font-serif-zen text-4xl md:text-5xl font-light tracking-tight mb-2">
        Start a project to get started
      </h1>
      <p
        className={`text-xs md:text-sm font-light mb-8 ${
          darkMode ? "text-stone-400" : "text-stone-500"
        }`}
      >
        Set a quiet countdown toward your next deadline or milestone.
      </p>

      <form
        onSubmit={handleSubmit}
        className={`p-6 rounded-3xl border text-left space-y-4 backdrop-blur-md ${
          darkMode
            ? "bg-stone-950/55 border-stone-800/80 text-stone-100"
            : "bg-white/75 border-stone-200/90 text-stone-800"
        }`}
      >
        <div>
          <label className="block text-[10px] uppercase tracking-[0.18em] text-stone-400 mb-1.5">
            Project or Goal Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Product Launch, Thesis Submission..."
            autoFocus
            className={`w-full text-sm px-3.5 py-2.5 rounded-xl border bg-transparent focus:outline-none ${
              darkMode
                ? "border-stone-700 text-stone-100 placeholder:text-stone-500 focus:border-stone-400"
                : "border-stone-300 text-stone-800 placeholder:text-stone-400 focus:border-stone-700"
            }`}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-light text-stone-400">
            Target Deadline
          </span>
          <ZenDateTimePicker
            value={targetIso}
            onChange={setTargetIso}
            useLightText={darkMode}
            ariaLabel="Initial project deadline"
          />
        </div>

        <label className="flex items-center justify-between pt-1 cursor-pointer select-none">
          <div>
            <div className="text-xs font-light">Display subtasks section</div>
            <div className="text-[11px] font-light text-stone-400">
              Optional checklist with individual task deadlines
            </div>
          </div>
          <input
            type="checkbox"
            checked={showSubtasks}
            onChange={(e) => setShowSubtasks(e.target.checked)}
            className="sr-only"
          />
          <span
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
              showSubtasks
                ? darkMode
                  ? "bg-emerald-400"
                  : "bg-stone-800"
                : darkMode
                  ? "bg-stone-800"
                  : "bg-stone-300"
            }`}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                showSubtasks ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </span>
        </label>

        <button
          type="submit"
          disabled={!title.trim()}
          className={`w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-medium uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40 ${
            darkMode
              ? "bg-stone-100 text-stone-950 hover:bg-white"
              : "bg-stone-900 text-stone-50 hover:bg-stone-800"
          }`}
        >
          Start Project Countdown
        </button>
      </form>
    </div>
  );
};

