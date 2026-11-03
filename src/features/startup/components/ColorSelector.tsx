import React from "react";

interface ColorSelectorProps {
  textColor: string | null;
  accentColor: string | null;
  useLightText: boolean;
  onChangeTextColor: (color: string | null) => void;
  onChangeAccentColor: (color: string | null) => void;
}

const TEXT_SWATCHES = [
  { label: "Deep Ink", value: "#1C1917" },
  { label: "Warm Ivory", value: "#F5F5F4" },
  { label: "Sage Mist", value: "#D1FAE5" },
  { label: "Champagne", value: "#FDE68A" },
  { label: "Rose Quartz", value: "#FECDD3" },
];

const ACCENT_SWATCHES = [
  { label: "Zen Emerald", value: "#34D399" },
  { label: "Warm Amber", value: "#F59E0B" },
  { label: "Kyoto Indigo", value: "#818CF8" },
  { label: "Coral Clay", value: "#FB7185" },
  { label: "Slate Stone", value: "#78716C" },
];

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  textColor,
  accentColor,
  useLightText,
  onChangeTextColor,
  onChangeAccentColor,
}) => {
  const defaultText = useLightText ? "#F5F5F4" : "#1C1917";
  const defaultAccent = useLightText ? "#34D399" : "#292524";

  const activeText = textColor || defaultText;
  const activeAccent = accentColor || defaultAccent;

  return (
    <div
      className={`max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-4 px-5 py-3 rounded-2xl border backdrop-blur-md text-xs ${
        useLightText
          ? "border-stone-700/60 bg-stone-950/55 text-stone-200"
          : "border-stone-200/80 bg-white/70 text-stone-700"
      }`}
    >
      {/* Text Color Selector */}
      <div className="flex items-center gap-2.5">
        <span className="text-[11px] uppercase tracking-[0.16em] opacity-75">
          Text
        </span>
        <div className="flex items-center gap-1.5">
          {TEXT_SWATCHES.map((swatch) => (
            <button
              key={swatch.value}
              type="button"
              title={`Text: ${swatch.label}`}
              onClick={() => onChangeTextColor(swatch.value)}
              style={{ backgroundColor: swatch.value }}
              className={`h-4 w-4 rounded-full border transition-transform cursor-pointer ${
                activeText.toLowerCase() === swatch.value.toLowerCase()
                  ? "scale-125 ring-2 ring-stone-400"
                  : "border-stone-400/50 hover:scale-110"
              }`}
            />
          ))}
          <label
            title="Custom Text Color"
            className="relative flex items-center justify-center h-5 w-5 rounded-full border border-dashed border-stone-400 cursor-pointer overflow-hidden"
          >
            <input
              type="color"
              aria-label="Custom Text Color"
              value={activeText}
              onChange={(e) => onChangeTextColor(e.target.value)}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            />
            <span
              style={{ backgroundColor: activeText }}
              className="h-3 w-3 rounded-full"
            />
          </label>
        </div>
      </div>

      {/* Accent Color Selector */}
      <div className="flex items-center gap-2.5">
        <span className="text-[11px] uppercase tracking-[0.16em] opacity-75">
          Accent
        </span>
        <div className="flex items-center gap-1.5">
          {ACCENT_SWATCHES.map((swatch) => (
            <button
              key={swatch.value}
              type="button"
              title={`Accent: ${swatch.label}`}
              onClick={() => onChangeAccentColor(swatch.value)}
              style={{ backgroundColor: swatch.value }}
              className={`h-4 w-4 rounded-full border transition-transform cursor-pointer ${
                activeAccent.toLowerCase() === swatch.value.toLowerCase()
                  ? "scale-125 ring-2 ring-stone-400"
                  : "border-stone-400/50 hover:scale-110"
              }`}
            />
          ))}
          <label
            title="Custom Accent Color"
            className="relative flex items-center justify-center h-5 w-5 rounded-full border border-dashed border-stone-400 cursor-pointer overflow-hidden"
          >
            <input
              type="color"
              aria-label="Custom Accent Color"
              value={activeAccent}
              onChange={(e) => onChangeAccentColor(e.target.value)}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            />
            <span
              style={{ backgroundColor: activeAccent }}
              className="h-3 w-3 rounded-full"
            />
          </label>
        </div>
      </div>

      {/* Reset Colors Button */}
      {(textColor || accentColor) && (
        <button
          type="button"
          onClick={() => {
            onChangeTextColor(null);
            onChangeAccentColor(null);
          }}
          className="text-[11px] font-light underline opacity-75 hover:opacity-100 cursor-pointer"
        >
          Reset Colors
        </button>
      )}
    </div>
  );
};

