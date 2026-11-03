import React from "react";
import { ZEN_LAYOUT_OPTIONS } from "../constants";
import { ZenLayout } from "../types";

interface LayoutSelectorProps {
  layout: ZenLayout;
  useLightText: boolean;
  onSelectLayout: (layout: ZenLayout) => void;
}

const LayoutIcon: React.FC<{ id: ZenLayout }> = ({ id }) => {
  if (id === "split") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden="true"
      >
        <rect x="2" y="3" width="5" height="10" rx="1.2" />
        <rect x="9" y="3" width="5" height="10" rx="1.2" />
      </svg>
    );
  }
  if (id === "minimal") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden="true"
      >
        <line x1="2" y1="5" x2="14" y2="5" />
        <line x1="2" y1="11" x2="14" y2="11" />
        <line x1="6" y1="6.5" x2="6" y2="9.5" />
        <line x1="10" y1="6.5" x2="10" y2="9.5" />
      </svg>
    );
  }
  if (id === "horizon") {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden="true"
      >
        <rect x="2" y="2.5" width="12" height="11" rx="1.5" strokeOpacity="0.45" />
        <rect x="3.5" y="9" width="9" height="3" rx="0.8" />
      </svg>
    );
  }
  // centered
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <rect x="4" y="2.5" width="8" height="2.5" rx="0.8" />
      <rect x="2.5" y="6.5" width="11" height="3.5" rx="1" />
      <rect x="3.5" y="11.5" width="9" height="2" rx="0.8" />
    </svg>
  );
};

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  layout,
  useLightText,
  onSelectLayout,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] uppercase tracking-[0.16em] opacity-75">
        Layout
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        {ZEN_LAYOUT_OPTIONS.map((opt) => {
          const isActive = layout === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              title={opt.description}
              onClick={() => onSelectLayout(opt.id)}
              className={`px-2.5 py-1 rounded-xl text-[11px] tracking-wide border transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? useLightText
                    ? "bg-stone-100 text-stone-900 border-stone-100 font-medium"
                    : "bg-stone-900 text-stone-50 border-stone-900 font-medium"
                  : useLightText
                    ? "border-stone-700/70 bg-stone-900/40 text-stone-300 hover:bg-stone-800/70 font-light"
                    : "border-stone-200/90 bg-white/60 text-stone-600 hover:bg-stone-100 font-light"
              }`}
            >
              <LayoutIcon id={opt.id} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

