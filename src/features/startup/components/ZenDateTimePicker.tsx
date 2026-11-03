import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ZenDateTimePickerProps {
  value: string;
  onChange: (nextIso: string) => void;
  useLightText?: boolean;
  accentColor?: string | null;
  ariaLabel?: string;
  compact?: boolean;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toLocalIso(d: Date, hours: number, minutes: number): string {
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${year}-${month}-${day}T${pad(hours)}:${pad(minutes)}`;
}

function parseIsoDate(iso: string): Date {
  const parsed = new Date(iso);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

interface PopoverPosition {
  placement: "above" | "below";
  top?: number;
  bottom?: number;
  left: number;
}

export const ZenDateTimePicker: React.FC<ZenDateTimePickerProps> = ({
  value,
  onChange,
  useLightText = false,
  accentColor,
  ariaLabel = "Target deadline",
  compact = false,
}) => {
  const parsedValue = parseIsoDate(value);
  const initialHasCustomTime = !(
    parsedValue.getHours() === 23 && parsedValue.getMinutes() === 59
  );

  const [isOpen, setIsOpen] = useState(false);
  const [includeTime, setIncludeTime] = useState<boolean>(initialHasCustomTime);
  const [popoverPos, setPopoverPos] = useState<PopoverPosition>({
    placement: "below",
    top: 0,
    left: 0,
  });

  // If includeTime is false and time is 23:59, the calendar date chosen by user is +1 day
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = parseIsoDate(value);
    if (!initialHasCustomTime) {
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      return next;
    }
    return d;
  });

  const [viewMonth, setViewMonth] = useState<number>(() =>
    selectedDate.getMonth()
  );
  const [viewYear, setViewYear] = useState<number>(() =>
    selectedDate.getFullYear()
  );
  const [hours, setHours] = useState<number>(() =>
    initialHasCustomTime ? parsedValue.getHours() : 18
  );
  const [minutes, setMinutes] = useState<number>(() =>
    initialHasCustomTime ? parsedValue.getMinutes() : 0
  );

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const updatePopoverPosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 288; // w-72 = 18rem = 288px
    const estimatedHeight = includeTime ? 360 : 320;
    const viewportH = window.innerHeight || 800;
    const viewportW = window.innerWidth || 1200;

    const spaceBelow = viewportH - rect.bottom;
    const spaceAbove = rect.top;

    // Pop up above if there isn't enough room below and there's more room above
    const placeAbove =
      spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

    // Align right edge with trigger right edge, clamped inside viewport
    const desiredLeft = rect.right - popoverWidth;
    const clampedLeft = Math.max(
      12,
      Math.min(desiredLeft, viewportW - popoverWidth - 12)
    );

    if (placeAbove) {
      setPopoverPos({
        placement: "above",
        bottom: Math.max(12, viewportH - rect.top + 8),
        left: clampedLeft,
      });
    } else {
      setPopoverPos({
        placement: "below",
        top: Math.max(12, rect.bottom + 8),
        left: clampedLeft,
      });
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePopoverPosition();
    }
  }, [isOpen, includeTime]);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };
    const handleScrollOrResize = () => updatePopoverPosition();

    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [isOpen, includeTime]);

  const emitDeadline = (
    dateObj: Date,
    withTime: boolean,
    h: number,
    m: number
  ) => {
    if (withTime) {
      onChange(toLocalIso(dateObj, h, m));
    } else {
      // 23:59 of the previous day
      const prevDay = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate() - 1
      );
      onChange(toLocalIso(prevDay, 23, 59));
    }
  };

  const handleSelectDay = (day: number) => {
    const picked = new Date(viewYear, viewMonth, day);
    setSelectedDate(picked);
    emitDeadline(picked, includeTime, hours, minutes);
  };

  const handleToggleIncludeTime = (checked: boolean) => {
    setIncludeTime(checked);
    emitDeadline(selectedDate, checked, hours, minutes);
  };

  const handleTimeChange = (nextH: number, nextM: number) => {
    const clampedH = Math.max(0, Math.min(23, nextH));
    const clampedM = Math.max(0, Math.min(59, nextM));
    setHours(clampedH);
    setMinutes(clampedM);
    emitDeadline(selectedDate, true, clampedH, clampedM);
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const effectiveDisplayDate = parseIsoDate(value);
  const formattedTrigger = effectiveDisplayDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const accentBorder = accentColor
    ? { borderColor: `${accentColor}66` }
    : undefined;

  const popoverNode = isOpen ? (
    <div
      ref={popoverRef}
      data-placement={popoverPos.placement}
      style={{
        position: "fixed",
        top: popoverPos.top,
        bottom: popoverPos.bottom,
        left: popoverPos.left,
      }}
      className={`z-[9999] w-72 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-opacity ${
        useLightText
          ? "bg-[#161816]/95 border-stone-700/80 text-stone-100"
          : "bg-[#FAF9F5]/95 border-stone-200/90 text-stone-800"
      }`}
    >
      {/* Month / Year Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className={`h-7 w-7 rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer ${
            useLightText
              ? "hover:bg-stone-800 text-stone-300"
              : "hover:bg-stone-200/70 text-stone-600"
          }`}
        >
          ‹
        </button>
        <span className="font-serif-zen text-base font-normal tracking-wide">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className={`h-7 w-7 rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer ${
            useLightText
              ? "hover:bg-stone-800 text-stone-300"
              : "hover:bg-stone-200/70 text-stone-600"
          }`}
        >
          ›
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
        {WEEKDAYS.map((wd) => (
          <span
            key={wd}
            className="text-[10px] uppercase tracking-wider text-stone-400 font-light"
          >
            {wd}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <span key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const isSelected =
            selectedDate.getFullYear() === viewYear &&
            selectedDate.getMonth() === viewMonth &&
            selectedDate.getDate() === dayNum;

          return (
            <button
              key={dayNum}
              type="button"
              onClick={() => handleSelectDay(dayNum)}
              style={
                isSelected && accentColor
                  ? { backgroundColor: accentColor, color: "#1C1917" }
                  : undefined
              }
              className={`h-7 w-7 mx-auto rounded-full font-mono-zen text-[11px] flex items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? useLightText
                    ? "bg-stone-100 text-stone-950 font-medium"
                    : "bg-stone-900 text-stone-50 font-medium"
                  : useLightText
                    ? "text-stone-300 hover:bg-stone-800"
                    : "text-stone-700 hover:bg-stone-200/70"
              }`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>

      {/* Include Time Option */}
      <div className="mt-3.5 pt-3 border-t border-stone-500/15 space-y-2.5">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <span className="text-[11px] font-light tracking-wide">
            Include specific time
          </span>
          <input
            type="checkbox"
            checked={includeTime}
            onChange={(e) => handleToggleIncludeTime(e.target.checked)}
            className="sr-only"
          />
          <span
            style={
              includeTime && accentColor
                ? { backgroundColor: accentColor }
                : undefined
            }
            className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors ${
              includeTime
                ? useLightText
                  ? "bg-emerald-400"
                  : "bg-stone-800"
                : useLightText
                  ? "bg-stone-800"
                  : "bg-stone-300"
            }`}
          >
            <span
              className={`bg-white w-3.5 h-3.5 rounded-full shadow-xs transform transition-transform ${
                includeTime ? "translate-x-3.5" : "translate-x-0"
              }`}
            />
          </span>
        </label>

        {includeTime ? (
          <div
            className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border ${
              useLightText
                ? "border-stone-800 bg-stone-900/70"
                : "border-stone-200 bg-white/80"
            }`}
          >
            <span className="text-[10px] uppercase tracking-[0.18em] text-stone-400">
              Time
            </span>
            <div className="flex items-center gap-1.5 font-mono-zen text-xs">
              <select
                aria-label="Hour"
                value={hours}
                onChange={(e) =>
                  handleTimeChange(Number(e.target.value), minutes)
                }
                className={`bg-transparent px-1.5 py-0.5 rounded border focus:outline-none cursor-pointer ${
                  useLightText
                    ? "border-stone-700 text-stone-100 bg-stone-900"
                    : "border-stone-300 text-stone-800 bg-white"
                }`}
              >
                {Array.from({ length: 24 }).map((_, h) => (
                  <option key={h} value={h}>
                    {pad(h)}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                aria-label="Minute"
                value={minutes}
                onChange={(e) =>
                  handleTimeChange(hours, Number(e.target.value))
                }
                className={`bg-transparent px-1.5 py-0.5 rounded border focus:outline-none cursor-pointer ${
                  useLightText
                    ? "border-stone-700 text-stone-100 bg-stone-900"
                    : "border-stone-300 text-stone-800 bg-white"
                }`}
              >
                {Array.from({ length: 60 }).map((_, m) => (
                  <option key={m} value={m}>
                    {pad(m)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="text-[10px] font-light italic text-stone-400 flex items-center justify-between">
            <span>Defaults to 23:59 of previous day</span>
            <span className="font-mono-zen not-italic">23:59</span>
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative inline-block text-left">
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        onClick={() => setIsOpen((o) => !o)}
        style={accentBorder}
        className={`font-mono-zen inline-flex items-center gap-2 rounded-full border transition-all cursor-pointer backdrop-blur-md ${
          compact ? "text-[11px] px-2.5 py-1" : "text-xs px-3.5 py-1.5"
        } ${
          useLightText
            ? "border-stone-700/80 bg-stone-900/75 text-stone-200 hover:border-stone-500"
            : "border-stone-300/90 bg-white/85 text-stone-700 hover:border-stone-500"
        }`}
      >
        <span className="opacity-65 text-[11px]">◷</span>
        <span>{formattedTrigger}</span>
      </button>

      {popoverNode && typeof document !== "undefined"
        ? createPortal(popoverNode, document.body)
        : popoverNode}
    </div>
  );
};
