import React, { useRef } from "react";
import { ZEN_BREATH_QUOTES } from "../constants";
import { TimeLeft, ZenLayout } from "../types";
import { padNumber } from "../utils/time";
import { ZenDateTimePicker } from "./ZenDateTimePicker";

interface CountdownHeroProps {
  intentionTitle: string;
  mantra: string;
  breathQuote?: string;
  targetIso: string;
  timeLeft: TimeLeft;
  useLightText: boolean;
  textColor?: string | null;
  accentColor?: string | null;
  layout?: ZenLayout;
  hasSubtasks?: boolean;
  isLockScreenOnly: boolean;
  isEditing: boolean;
  canCycleProjects?: boolean;
  onCycleProject?: (delta: -1 | 1) => void;
  onChangeTitle: (title: string) => void;
  onChangeMantra: (mantra: string) => void;
  onChangeBreathQuote?: (quote: string) => void;
  onChangeTargetIso: (iso: string) => void;
}

export const CountdownHero: React.FC<CountdownHeroProps> = ({
  intentionTitle,
  mantra,
  breathQuote,
  targetIso,
  timeLeft,
  useLightText,
  textColor,
  accentColor,
  layout = "centered",
  hasSubtasks = false,
  isLockScreenOnly,
  isEditing,
  canCycleProjects = false,
  onCycleProject,
  onChangeTitle,
  onChangeMantra,
  onChangeBreathQuote,
  onChangeTargetIso,
}) => {
  const units = [
    { value: padNumber(timeLeft.days), label: "Days" },
    { value: padNumber(timeLeft.hours), label: "Hours" },
    { value: padNumber(timeLeft.minutes), label: "Minutes" },
    { value: padNumber(timeLeft.seconds), label: "Seconds" },
  ];

  const activeBreathQuote =
    breathQuote && ZEN_BREATH_QUOTES.includes(breathQuote)
      ? breathQuote
      : ZEN_BREATH_QUOTES[0];
  const currentQuoteIndex = ZEN_BREATH_QUOTES.indexOf(activeBreathQuote);

  const pointerStartX = useRef<number | null>(null);
  const headingPointerStartX = useRef<number | null>(null);
  const wheelCooldown = useRef<number>(0);

  const cycleQuote = (delta: number) => {
    const len = ZEN_BREATH_QUOTES.length;
    const nextIdx = (currentQuoteIndex + delta + len) % len;
    onChangeBreathQuote?.(ZEN_BREATH_QUOTES[nextIdx]);
  };

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

  const isLeftAligned = layout === "split" || layout === "horizon";
  const isTwoColumnHero =
    (layout === "split" && (!hasSubtasks || isLockScreenOnly)) ||
    layout === "horizon";

  const quotePill = !isLockScreenOnly && (
    <div
      style={accentBorderStyle}
      onPointerDown={(e) => {
        pointerStartX.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (pointerStartX.current === null) return;
        const diff = e.clientX - pointerStartX.current;
        pointerStartX.current = null;
        if (Math.abs(diff) > 20) {
          cycleQuote(diff < 0 ? 1 : -1);
        }
      }}
      onWheel={(e) => {
        const now = Date.now();
        if (now - wheelCooldown.current < 280) return;
        if (Math.abs(e.deltaX) > 12 || Math.abs(e.deltaY) > 12) {
          wheelCooldown.current = now;
          cycleQuote((e.deltaX || e.deltaY) > 0 ? 1 : -1);
        }
      }}
      title="Swipe or click arrows to change mindfulness quote"
      className={`group inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 border backdrop-blur-sm select-none transition-all ${
        useLightText
          ? "border-stone-400/20 bg-stone-900/40 text-stone-200"
          : "border-stone-500/15 bg-stone-500/5 text-stone-600"
      }`}
    >
      <button
        type="button"
        aria-label="Previous quote"
        onClick={() => cycleQuote(-1)}
        className="text-xs opacity-40 group-hover:opacity-90 hover:scale-110 transition-all cursor-pointer px-1"
      >
        ‹
      </button>

      <span
        style={accentColor ? { backgroundColor: accentColor } : undefined}
        className="h-1.5 w-1.5 rounded-full bg-current opacity-80 animate-ping shrink-0"
      />

      <button
        type="button"
        onClick={() => cycleQuote(1)}
        style={textStyle}
        className="text-[11px] tracking-[0.18em] uppercase font-light cursor-pointer"
      >
        {activeBreathQuote}
      </button>

      <button
        type="button"
        aria-label="Next quote"
        onClick={() => cycleQuote(1)}
        className="text-xs opacity-40 group-hover:opacity-90 hover:scale-110 transition-all cursor-pointer px-1"
      >
        ›
      </button>
    </div>
  );

  const headingElement = isEditing ? (
    <div className={isLeftAligned ? "max-w-xl mb-2" : "max-w-2xl mx-auto mb-2"}>
      <input
        type="text"
        value={intentionTitle}
        onChange={(e) => onChangeTitle(e.target.value)}
        placeholder="Heading..."
        style={textStyle}
        className={`w-full ${
          isLeftAligned ? "text-left" : "text-center"
        } font-serif-zen text-4xl md:text-6xl font-light tracking-tight leading-[1.12] bg-transparent border-b border-dashed pb-1 focus:outline-none ${
          useLightText
            ? "border-stone-500 text-stone-100 focus:border-stone-200"
            : "border-stone-400 text-stone-800 focus:border-stone-800"
        }`}
      />
    </div>
  ) : canCycleProjects && onCycleProject ? (
    <div
      onPointerDown={(e) => {
        headingPointerStartX.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (headingPointerStartX.current === null) return;
        const diff = e.clientX - headingPointerStartX.current;
        headingPointerStartX.current = null;
        if (Math.abs(diff) > 25) {
          onCycleProject(diff < 0 ? 1 : -1);
        }
      }}
      className={`group/heading flex items-center ${
        isLeftAligned ? "justify-start" : "justify-center"
      } gap-3 md:gap-4 mb-2 select-none`}
    >
      <button
        type="button"
        aria-label="Previous project countdown"
        title="Previous project countdown"
        onClick={() => onCycleProject(-1)}
        style={accentBorderStyle}
        className={`h-9 w-9 rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 opacity-65 hover:opacity-100 hover:scale-105 backdrop-blur-sm ${
          useLightText
            ? "border-stone-700/70 bg-stone-900/50 text-stone-200 hover:bg-stone-800/80"
            : "border-stone-300/80 bg-white/60 text-stone-700 hover:bg-white/90"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10 3.5L5.5 8L10 12.5" />
        </svg>
      </button>

      <h1
        style={textStyle}
        className="font-serif-zen text-4xl md:text-6xl font-light tracking-tight leading-[1.12]"
      >
        {intentionTitle}
      </h1>

      <button
        type="button"
        aria-label="Next project countdown"
        title="Next project countdown"
        onClick={() => onCycleProject(1)}
        style={accentBorderStyle}
        className={`h-9 w-9 rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 opacity-65 hover:opacity-100 hover:scale-105 backdrop-blur-sm ${
          useLightText
            ? "border-stone-700/70 bg-stone-900/50 text-stone-200 hover:bg-stone-800/80"
            : "border-stone-300/80 bg-white/60 text-stone-700 hover:bg-white/90"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 3.5L10.5 8L6 12.5" />
        </svg>
      </button>
    </div>
  ) : (
    <h1
      style={textStyle}
      className="font-serif-zen text-4xl md:text-6xl font-light tracking-tight leading-[1.12] mb-2"
    >
      {intentionTitle}
    </h1>
  );

  const mantraElement =
    !isLockScreenOnly &&
    (isEditing ? (
      <div
        className={
          isLeftAligned ? "max-w-md mb-4" : "max-w-lg mx-auto mb-6"
        }
      >
        <input
          type="text"
          value={mantra}
          onChange={(e) => onChangeMantra(e.target.value)}
          placeholder="Mindful intention..."
          style={textStyle}
          className={`w-full ${
            isLeftAligned ? "text-left" : "text-center"
          } text-sm md:text-base font-light italic font-serif-zen tracking-wide bg-transparent border-b border-dashed pb-1 focus:outline-none ${
            useLightText
              ? "border-stone-600 text-stone-300 focus:border-stone-300"
              : "border-stone-300 text-stone-600 focus:border-stone-700"
          }`}
        />
      </div>
    ) : (
      <p
        style={textStyle}
        className={`${
          isLeftAligned ? "max-w-md mb-4" : "max-w-lg mx-auto mb-6"
        } text-sm md:text-base font-light italic font-serif-zen tracking-wide opacity-85 ${
          useLightText ? "text-stone-300/90" : "text-stone-500"
        }`}
      >
        “{mantra}”
      </p>
    ));

  const targetDateElement = !isLockScreenOnly && (
    <div
      className={`mt-3 flex items-center ${
        isLeftAligned ? "justify-start" : "justify-center"
      }`}
    >
      {isEditing ? (
        <div className="inline-flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.18em] font-light opacity-70">
            Target:
          </span>
          <ZenDateTimePicker
            value={targetIso}
            onChange={onChangeTargetIso}
            useLightText={useLightText}
            accentColor={accentColor}
            ariaLabel="Main project deadline"
          />
        </div>
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
  );

  // Render the 4-Unit Timer based on layout
  const timerGrid =
    layout === "minimal" ? (
      <div
        style={accentBorderStyle}
        className={`grid grid-cols-4 divide-x max-w-3xl mx-auto py-5 border-y transition-all ${
          isLockScreenOnly ? "mt-6" : ""
        } ${
          useLightText
            ? "divide-stone-700/50 border-stone-700/50 text-stone-100"
            : "divide-stone-300/75 border-stone-300/75 text-stone-800"
        }`}
      >
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center px-2">
            <span
              style={textStyle}
              className="font-mono-zen text-4xl md:text-6xl font-light tracking-tight tabular-nums"
            >
              {unit.value}
            </span>
            <span
              style={accentColor ? { color: accentColor } : undefined}
              className="mt-2 text-[10px] uppercase tracking-[0.28em] font-light text-stone-400"
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    ) : (
      <div
        style={accentBorderStyle}
        className={`grid ${
          layout === "split" && !hasSubtasks
            ? "grid-cols-2 gap-3.5 p-5"
            : "grid-cols-4 gap-3 md:gap-5 p-5 md:p-6"
        } ${
          isLeftAligned ? "w-full" : "max-w-2xl mx-auto"
        } rounded-3xl border transition-all backdrop-blur-md ${
          isLockScreenOnly && !isTwoColumnHero ? "mt-6" : ""
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
    );

  if (layout === "horizon") {
    return (
      <div
        data-layout="horizon"
        style={{ ...textStyle, ...accentBorderStyle }}
        className={`w-full rounded-3xl border p-5 md:p-7 backdrop-blur-md transition-all flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 text-left ${
          useLightText
            ? "bg-stone-950/50 border-stone-700/60 text-stone-100"
            : "bg-white/70 border-stone-200/80 text-stone-800"
        }`}
      >
        <div className="flex-1 min-w-0">
          {quotePill}
          {headingElement}
          {mantraElement}
          {targetDateElement}
        </div>
        <div className="lg:w-[440px] shrink-0">{timerGrid}</div>
      </div>
    );
  }

  if (isTwoColumnHero) {
    return (
      <div
        data-layout={layout}
        style={textStyle}
        className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left"
      >
        <div className="md:col-span-6">
          {quotePill}
          {headingElement}
          {mantraElement}
          {targetDateElement}
        </div>
        <div className="md:col-span-6">{timerGrid}</div>
      </div>
    );
  }

  return (
    <div
      data-layout={layout}
      style={textStyle}
      className={isLeftAligned ? "text-left" : "text-center"}
    >
      {quotePill}
      {headingElement}
      {mantraElement}
      {timerGrid}
      {targetDateElement}
    </div>
  );
};
