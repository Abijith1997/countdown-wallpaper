import React from "react";
import { ReminderNotification } from "../utils/reminders";

interface ReminderBannerProps {
  reminders: ReminderNotification[];
  useLightText: boolean;
  accentColor?: string | null;
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
}

export const ReminderBanner: React.FC<ReminderBannerProps> = ({
  reminders,
  useLightText,
  accentColor,
  onDismiss,
  onDismissAll,
}) => {
  if (reminders.length === 0) return null;

  const accentBorderStyle = accentColor
    ? { borderColor: `${accentColor}80` }
    : undefined;

  return (
    <div
      role="region"
      aria-label="Deadline reminders"
      className="relative z-20 max-w-2xl w-full mx-auto flex flex-col gap-1.5"
    >
      {reminders.slice(0, 3).map((item) => (
        <div
          key={item.id}
          style={accentBorderStyle}
          className={`flex items-center justify-between gap-3 px-4 py-2 rounded-2xl border backdrop-blur-md text-xs transition-all ${
            useLightText
              ? "bg-stone-950/75 border-stone-700/80 text-stone-100"
              : "bg-white/85 border-stone-300/90 text-stone-800"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0 text-left">
            <span
              style={
                accentColor
                  ? { backgroundColor: `${accentColor}30`, color: accentColor }
                  : undefined
              }
              className={`px-2 py-0.5 rounded-full font-mono-zen text-[10px] uppercase tracking-wider shrink-0 border ${
                useLightText
                  ? "border-stone-600 bg-stone-800 text-stone-200"
                  : "border-stone-300 bg-stone-100 text-stone-700"
              }`}
            >
              {item.threshold} left
            </span>
            <span className="truncate font-light">{item.body}</span>
          </div>

          <button
            type="button"
            aria-label={`Dismiss reminder for ${item.itemTitle}`}
            onClick={() => onDismiss(item.id)}
            className="text-[11px] opacity-60 hover:opacity-100 px-1.5 py-0.5 cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>
      ))}

      {reminders.length > 1 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onDismissAll}
            className="text-[10px] uppercase tracking-widest opacity-65 hover:opacity-100 underline cursor-pointer"
          >
            Dismiss all ({reminders.length})
          </button>
        </div>
      )}
    </div>
  );
};
