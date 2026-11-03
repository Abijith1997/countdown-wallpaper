import React, { useState } from "react";
import { ZenDateTimePicker } from "../../startup/components/ZenDateTimePicker";

interface NewProjectFormProps {
  darkMode: boolean;
  onCreateProject: (
    title: string,
    targetIso: string,
    showSubtasks?: boolean
  ) => void;
}

export const NewProjectForm: React.FC<NewProjectFormProps> = ({
  darkMode,
  onCreateProject,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [targetIso, setTargetIso] = useState(() => {
    const d = new Date(Date.now() + 86400000 * 7);
    d.setHours(23, 59, 0, 0);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T23:59`;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || !targetIso) return;
    onCreateProject(trimmed, targetIso, showSubtasks);
    setTitle("");
    setShowSubtasks(false);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`w-full mt-2 py-2.5 px-3.5 rounded-2xl text-xs font-light tracking-wide border border-dashed transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
          darkMode
            ? "border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700 hover:bg-stone-900/40"
            : "border-stone-300 text-stone-500 hover:text-stone-800 hover:border-stone-400 hover:bg-stone-100/70"
        }`}
      >
        <span>+</span>
        <span>New Project Countdown</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`mt-2 p-3 rounded-2xl border space-y-2.5 ${
        darkMode
          ? "border-stone-800 bg-stone-900/70 text-stone-200"
          : "border-stone-200 bg-white/80 text-stone-800"
      }`}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Project name..."
        autoFocus
        className={`w-full text-xs px-2.5 py-1.5 rounded-lg border bg-transparent focus:outline-none ${
          darkMode
            ? "border-stone-700 text-stone-100 placeholder:text-stone-500"
            : "border-stone-300 text-stone-800 placeholder:text-stone-400"
        }`}
      />
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-stone-400">
          Deadline
        </span>
        <ZenDateTimePicker
          value={targetIso}
          onChange={setTargetIso}
          useLightText={darkMode}
          ariaLabel="New project deadline"
          compact
        />
      </div>

      <label className="flex items-center justify-between cursor-pointer select-none pt-0.5">
        <span className="text-[11px] font-light text-stone-400">
          Include subtasks
        </span>
        <input
          type="checkbox"
          checked={showSubtasks}
          onChange={(e) => setShowSubtasks(e.target.checked)}
          className="accent-stone-700 cursor-pointer"
        />
      </label>

      <div className="flex items-center gap-1.5 pt-1">
        <button
          type="submit"
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium uppercase tracking-wider cursor-pointer ${
            darkMode
              ? "bg-stone-100 text-stone-900 hover:bg-white"
              : "bg-stone-900 text-stone-50 hover:bg-stone-800"
          }`}
        >
          Create
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-light cursor-pointer ${
            darkMode
              ? "text-stone-400 hover:bg-stone-800"
              : "text-stone-500 hover:bg-stone-200/60"
          }`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
