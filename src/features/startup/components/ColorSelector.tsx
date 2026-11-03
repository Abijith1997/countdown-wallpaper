import React from "react";
import {
  resolveAccessibleColors,
  ZEN_ATMOSPHERE_PRESETS,
} from "../constants";
import { ZenAtmosphere, ZenLayout } from "../types";
import { LayoutSelector } from "./LayoutSelector";

interface ColorSelectorProps {
  textColor: string | null;
  accentColor: string | null;
  useLightText: boolean;
  atmosphere?: ZenAtmosphere;
  layout?: ZenLayout;
  hasCustomWallpaper?: boolean;
  onChangeTextColor: (color: string | null) => void;
  onChangeAccentColor: (color: string | null) => void;
  onSelectAtmosphere?: (atmosphere: ZenAtmosphere) => void;
  onSelectLayout?: (layout: ZenLayout) => void;
}

const TEXT_SWATCHES = [
  { label: "Deep Ink", value: "#1C1917" },
  { label: "Warm Ivory", value: "#F5F5F4" },
  { label: "Sage Mist", value: "#D1FAE5" },
  { label: "Champagne", value: "#FDE68A" },
  { label: "Rose Quartz", value: "#FECDD3" },
  { label: "Mist Sky", value: "#E0F2FE" },
];

const ACCENT_SWATCHES = [
  { label: "Zen Emerald", value: "#34D399" },
  { label: "Warm Amber", value: "#F59E0B" },
  { label: "Kyoto Indigo", value: "#818CF8" },
  { label: "Coral Clay", value: "#FB7185" },
  { label: "Ocean Cyan", value: "#38BDF8" },
  { label: "Slate Stone", value: "#78716C" },
];

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  textColor,
  accentColor,
  useLightText,
  atmosphere = "stone",
  layout = "centered",
  hasCustomWallpaper = false,
  onChangeTextColor,
  onChangeAccentColor,
  onSelectAtmosphere,
  onSelectLayout,
}) => {
  const resolved = resolveAccessibleColors(
    atmosphere,
    useLightText,
    hasCustomWallpaper,
    textColor,
    accentColor
  );

  const activeText = resolved.textColor;
  const activeAccent = resolved.accentColor;

  return (
    <div
      className={`max-w-3xl w-full mx-auto flex flex-col gap-2.5 px-4 py-3 rounded-2xl border backdrop-blur-md text-xs ${
        useLightText
          ? "border-stone-700/60 bg-stone-950/60 text-stone-200"
          : "border-stone-200/80 bg-white/75 text-stone-700"
      }`}
    >
      {/* Top Row: Layout Options + Text & Accent Swatches */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {onSelectLayout && (
          <LayoutSelector
            layout={layout}
            useLightText={useLightText}
            onSelectLayout={onSelectLayout}
          />
        )}

        <div className="flex flex-wrap items-center gap-4">
          {/* Text Color Selector */}
          <div className="flex items-center gap-2">
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
          <div className="flex items-center gap-2">
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
      </div>

      {/* Bottom Row: Curated Wallpaper Shades & Gradients (auto-matches Text & Accent) */}
      {onSelectAtmosphere && !hasCustomWallpaper && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-500/15">
          <span className="text-[11px] uppercase tracking-[0.16em] opacity-75 mr-1">
            Gradients
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {ZEN_ATMOSPHERE_PRESETS.map((preset) => {
              const isSelected = atmosphere === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  title={`Shade: ${preset.label}`}
                  onClick={() => onSelectAtmosphere(preset.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] tracking-wide border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? useLightText
                        ? "border-stone-300 bg-stone-800 text-stone-100 font-medium"
                        : "border-stone-800 bg-stone-900 text-stone-50 font-medium"
                      : useLightText
                        ? "border-stone-700/70 bg-stone-900/40 text-stone-300 hover:bg-stone-800/70 font-light"
                        : "border-stone-200/90 bg-white/60 text-stone-600 hover:bg-stone-100 font-light"
                  }`}
                >
                  <span
                    style={{
                      background: useLightText
                        ? preset.swatchDark
                        : preset.swatchLight,
                    }}
                    className="h-3 w-3 rounded-full border border-stone-400/50 shrink-0"
                  />
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
