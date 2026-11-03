import React from "react";

interface SidebarFooterProps {
  darkMode: boolean;
  onToggleDarkMode?: () => void;
  onToggleZenMode?: () => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  darkMode,
  onToggleDarkMode,
  onToggleZenMode,
}) => {
  const buttonStyle = darkMode
    ? "border-stone-800 bg-stone-900/60 text-stone-300 hover:bg-stone-800"
    : "border-stone-200/80 bg-white/60 text-stone-600 hover:bg-stone-100";

  return (
    <div className="space-y-3 pt-6 border-t border-stone-500/10">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDarkMode}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-light tracking-wide border transition-colors cursor-pointer ${buttonStyle}`}
        >
          {darkMode ? "☀ Light Stone" : "☾ Obsidian"}
        </button>
        <button
          onClick={onToggleZenMode}
          title="Hide sidebar for pure Zen focus"
          className={`py-2 px-3 rounded-xl text-xs font-light tracking-wide border transition-colors cursor-pointer ${buttonStyle}`}
        >
          Zen ↗
        </button>
      </div>

      <p
        className={`text-[11px] leading-relaxed font-light px-1 ${
          darkMode ? "text-stone-500" : "text-stone-400"
        }`}
      >
        “Time is not a race; it is a quiet space to fill with intention.”
      </p>
    </div>
  );
};

