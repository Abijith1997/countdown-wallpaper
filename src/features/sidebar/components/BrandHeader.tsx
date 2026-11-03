import React from "react";

interface BrandHeaderProps {
  darkMode: boolean;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({ darkMode }) => {
  return (
    <div className="flex items-center justify-between mb-10 px-1">
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3 items-center justify-center">
          <span
            className={`animate-breathe absolute inline-flex h-full w-full rounded-full ${
              darkMode ? "bg-emerald-400/50" : "bg-stone-500/40"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
              darkMode ? "bg-emerald-300" : "bg-stone-700"
            }`}
          />
        </span>
        <span className="font-serif-zen text-2xl tracking-wide font-light">
          Still
        </span>
      </div>
      <span
        className={`text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${
          darkMode
            ? "border-stone-800 text-stone-400 bg-stone-900/60"
            : "border-stone-200 text-stone-500 bg-stone-100/80"
        }`}
      >
        Zen
      </span>
    </div>
  );
};

