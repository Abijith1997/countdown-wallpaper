import React from "react";
import { TimeLeft } from "../types";
import { padNumber } from "../utils/time";

interface CountdownHeroProps {
  intentionTitle: string;
  mantra: string;
  targetIso: string;
  timeLeft: TimeLeft;
  useLightText: boolean;
  textColor?: string | null;
  accentColor?: string | null;
  isLockScreenOnly: boolean;
  isEditing: boolean;
  onChangeTitle: (title: string) => void;
  onChangeMantra: (mantra: string) => void;
  onChangeTargetIso: (iso: string) => void;
}

export const CountdownHero: React.FC<CountdownHeroProps> = ({
  intentionTitle,
  mantra,
  targetIso,
  timeLeft,
  useLightText,
  textColor,
  accentColor,
  isLockScreenOnly,
  isEditing,
  onChangeTitle,
  onChangeMantra,
  onChangeTargetIso,
}) => {
  const units = [
    { value: padNumber(timeLeft.days), label: "Days" },
    { value: padNumber(timeLeft.hours), label: "Hours" },
    { value: padNumber(timeLeft.minutes), label: "Minutes" },
    { value: padNumber(timeLeft.seconds), label: "Seconds" },
  ];

  const formattedDate = new Date(targetIso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const textStyle = textColor ? { color: textColor } : undefined;
  const accentBorderStyle = accentColor
    ? { borderColor: `${accentColor}66` }
    : undefined;

  return (
    <div style={textStyle}>
      {!isLockScreenOnly && (
        <div
          style={accentBorderStyle}
          className={`inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full mb-4 border backdrop-blur-sm ${
            useLightText
              ? "border-stone-400/20 bg-stone-900/40 text-stone-200"
              : "border-stone-500/15 bg-stone-500/5 text-stone-600"
          }`}
        >
          <span
            style={accentColor ? { backgroundColor: accentColor } : undefined}
            className="h-1.5 w-1.5 rounded-full bg-current opacity-80 animate-ping"
          />
          <span
            style={textStyle}
            className="text-[11px] tracking-[0.18em] uppercase font-light"
          >
            Breathe in · Be present
          </span>
        </div>
      )}

      {/* Heading (Inline Editable when Edit Mode is active) */}
      {isEditing ? (
        <div className="max-w-2xl mx-auto mb-2">
          <input
            type="text"
            value={intentionTitle}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder="Heading..."
            style={textStyle}
            className={`w-full text-center font-serif-zen text-4xl md:text-6xl font-light tracking-tight leading-[1.12] bg-transparent border-b border-dashed pb-1 focus:outline-none ${
              useLightText
                ? "border-stone-500 text-stone-100 focus:border-stone-200"
                : "border-stone-400 text-stone-800 focus:border-stone-800"
            }`}
          />
        </div>
      ) : (
        <h1
          style={textStyle}
          className="font-serif-zen text-4xl md:text-6xl font-light tracking-tight leading-[1.12] mb-2"
        >
          {intentionTitle}
        </h1>
      )}

      {/* Mantra */}
      {!isLockScreenOnly &&
        (isEditing ? (
          <div className="max-w-lg mx-auto mb-7">
            <input
              type="text"
              value={mantra}
              onChange={(e) => onChangeMantra(e.target.value)}
              placeholder="Mindful intention..."
              style={textStyle}
              className={`w-full text-center text-sm md:text-base font-light italic font-serif-zen tracking-wide bg-transparent border-b border-dashed pb-1 focus:outline-none ${
                useLightText
                  ? "border-stone-600 text-stone-300 focus:border-stone-300"
                  : "border-stone-300 text-stone-600 focus:border-stone-700"
              }`}
            />
          </div>
        ) : (
          <p
            style={textStyle}
            className={`max-w-lg mx-auto text-sm md:text-base font-light italic font-serif-zen tracking-wide mb-7 opacity-85 ${
              useLightText ? "text-stone-300/90" : "text-stone-500"
            }`}
          >
            “{mantra}”
          </p>
        ))}

      {/* 4-Unit Countdown Timer */}
      <div
        style={accentBorderStyle}
        className={`grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto p-5 md:p-7 rounded-3xl border transition-all backdrop-blur-md ${
          isLockScreenOnly ? "mt-6" : ""
        } ${
          useLightText
            ? "bg-stone-950/45 border-stone-700/60 text-stone-100"
            : "bg-white/65 border-stone-200/80 text-stone-800"
        }`}
      >
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            <span
              style={textStyle}
              className="font-mono-zen text-3xl md:text-5xl font-light tracking-tight tabular-nums"
            >
              {unit.value}
            </span>
            <span
              style={accentColor ? { color: accentColor } : undefined}
              className="mt-1.5 text-[10px] uppercase tracking-[0.24em] font-light text-stone-400"
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      {/* Target Date Display / Inline Date Picker at the exact same spot */}
      {!isLockScreenOnly && (
        <div className="mt-4 flex items-center justify-center">
          {isEditing ? (
            <label
              style={accentBorderStyle}
              className={`inline-flex items-center gap-2 text-xs font-mono-zen px-3.5 py-1.5 rounded-full border backdrop-blur-md ${
                useLightText
                  ? "border-stone-600 bg-stone-900/70 text-stone-200"
                  : "border-stone-300 bg-white/80 text-stone-700"
              }`}
            >
              <span className="text-[10px] uppercase tracking-[0.18em] font-sans opacity-70">
                Target:
              </span>
              <input
                type="datetime-local"
                value={targetIso.slice(0, 16)}
                onChange={(e) => {
                  if (e.target.value) {
                    onChangeTargetIso(e.target.value);
                  }
                }}
                className="bg-transparent focus:outline-none cursor-pointer text-xs"
              />
            </label>
          ) : (
            <span
              style={textStyle}
              className={`text-[11px] font-light tracking-wide opacity-75 ${
                useLightText ? "text-stone-300" : "text-stone-500"
              }`}
            >
              Target · {formattedDate}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
