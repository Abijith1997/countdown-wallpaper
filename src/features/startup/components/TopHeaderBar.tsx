import React from "react";
import { ViewMode, ZenAtmosphere } from "../types";

interface TopHeaderBarProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
  useLightText: boolean;
  hasCustomWallpaper: boolean;
  atmosphere: ZenAtmosphere;
  zenMode: boolean;
  liveDesktopMode: boolean;
  isApplyingWallpaper: boolean;
  wallpaperStatus: string | null;
  onSelectAtmosphere: (mood: ZenAtmosphere) => void;
  onTriggerUpload: () => void;
  onClearWallpaper: () => void;
  onSetMainWallpaper: () => void;
  onExitLiveWallpaper: () => void;
  onToggleZenMode?: () => void;
}

export const TopHeaderBar: React.FC<TopHeaderBarProps> = ({
  viewMode,
  onChangeViewMode,
  isEditing,
  onToggleEdit,
  useLightText,
  hasCustomWallpaper,
  atmosphere,
  zenMode,
  liveDesktopMode,
  isApplyingWallpaper,
  wallpaperStatus,
  onSelectAtmosphere,
  onTriggerUpload,
  onClearWallpaper,
  onSetMainWallpaper,
  onExitLiveWallpaper,
  onToggleZenMode,
}) => {
  // In Live Wallpaper mode, show ONLY the minimal Unpin button at the top
  if (liveDesktopMode) {
    return (
      <header className="relative z-10 flex items-center justify-end">
        <button
          type="button"
          onClick={onExitLiveWallpaper}
          className={`px-3.5 py-1.5 rounded-full text-xs font-light tracking-wide border transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md opacity-60 hover:opacity-100 ${
            useLightText
              ? "border-stone-700/70 bg-stone-900/50 text-stone-200 hover:bg-stone-800/80"
              : "border-stone-300/80 bg-white/60 text-stone-700 hover:bg-white/90"
          }`}
        >
          <span>↙</span>
          <span>Unpin</span>
        </button>
      </header>
    );
  }

  return (
    <header className="relative z-10 flex flex-wrap items-center justify-between gap-3">
      {/* Left: Top Navbar Switcher (Main Wallpaper vs Lock Screen) */}
      <div className="flex items-center gap-2.5">
        <div
          className={`flex items-center gap-1 p-1 rounded-full border backdrop-blur-md ${
            useLightText
              ? "border-stone-700/80 bg-stone-900/60"
              : "border-stone-200/90 bg-white/75"
          }`}
        >
          <button
            type="button"
            onClick={() => onChangeViewMode("main-wallpaper")}
            className={`px-3.5 py-1.5 rounded-full text-xs tracking-wide transition-all cursor-pointer ${
              viewMode === "main-wallpaper"
                ? useLightText
                  ? "bg-stone-100 text-stone-900 font-medium"
                  : "bg-stone-900 text-stone-50 font-medium"
                : useLightText
                  ? "text-stone-400 hover:text-stone-200 font-light"
                  : "text-stone-500 hover:text-stone-800 font-light"
            }`}
          >
            Main Wallpaper
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode("lock-screen")}
            className={`px-3.5 py-1.5 rounded-full text-xs tracking-wide transition-all cursor-pointer ${
              viewMode === "lock-screen"
                ? useLightText
                  ? "bg-stone-100 text-stone-900 font-medium"
                  : "bg-stone-900 text-stone-50 font-medium"
                : useLightText
                  ? "text-stone-400 hover:text-stone-200 font-light"
                  : "text-stone-500 hover:text-stone-800 font-light"
            }`}
          >
            Lock Screen
          </button>
        </div>

        {/* Inline Edit Mode Toggle Button */}
        <button
          type="button"
          onClick={onToggleEdit}
          className={`px-3.5 py-1.5 rounded-full text-xs tracking-wide border transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md ${
            isEditing
              ? useLightText
                ? "border-emerald-500/70 bg-emerald-950/70 text-emerald-200 font-medium"
                : "border-stone-800 bg-stone-900 text-stone-50 font-medium"
              : useLightText
                ? "border-stone-700/80 bg-stone-900/60 text-stone-200 hover:bg-stone-800/80 font-light"
                : "border-stone-200/90 bg-white/75 text-stone-700 hover:bg-stone-100 font-light"
          }`}
        >
          <span>{isEditing ? "✓" : "✎"}</span>
          <span>{isEditing ? "Done" : "Edit"}</span>
        </button>

        {wallpaperStatus && (
          <span
            className={`text-[11px] font-light px-3 py-1 rounded-full border backdrop-blur-md ${
              useLightText
                ? "border-emerald-700/60 bg-emerald-950/60 text-emerald-200"
                : "border-emerald-300 bg-emerald-50 text-emerald-800"
            }`}
          >
            ✓ {wallpaperStatus}
          </span>
        )}
      </div>

      {/* Right: Wallpaper Image Controls + Live Wallpaper Action */}
      <div className="flex flex-wrap items-center gap-2">
        {isEditing && (
          <>
            <button
              type="button"
              onClick={onTriggerUpload}
              className={`px-3.5 py-1.5 rounded-full text-xs font-light tracking-wide border transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md ${
                useLightText
                  ? "border-stone-700/80 bg-stone-900/60 text-stone-200 hover:bg-stone-800/80"
                  : "border-stone-200/90 bg-white/75 text-stone-700 hover:bg-stone-100"
              }`}
            >
              <span>🖼</span>
              <span>{hasCustomWallpaper ? "Change Image" : "Add Image"}</span>
            </button>

            {hasCustomWallpaper && (
              <button
                type="button"
                onClick={onClearWallpaper}
                className="px-3 py-1.5 rounded-full text-xs font-light tracking-wide border border-stone-700/80 bg-stone-900/60 text-stone-300 hover:bg-red-950/60 hover:border-red-800/60 hover:text-red-200 transition-all cursor-pointer backdrop-blur-md"
                title="Remove custom image"
              >
                Reset Image
              </button>
            )}

            {!hasCustomWallpaper && (
              <div
                className={`flex items-center gap-1 p-1 rounded-full border text-xs ${
                  useLightText
                    ? "border-stone-800 bg-stone-900/60"
                    : "border-stone-200/90 bg-white/70"
                }`}
              >
                {(["stone", "moss", "mist"] as ZenAtmosphere[]).map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => onSelectAtmosphere(mood)}
                    className={`px-2.5 py-1 rounded-full capitalize text-[11px] tracking-wide transition-all cursor-pointer ${
                      atmosphere === mood
                        ? useLightText
                          ? "bg-stone-700 text-stone-100"
                          : "bg-stone-800 text-stone-50"
                        : useLightText
                          ? "text-stone-400 hover:text-stone-200"
                          : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        <button
          type="button"
          disabled={isApplyingWallpaper}
          onClick={onSetMainWallpaper}
          className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
            useLightText
              ? "bg-stone-100 text-stone-950 hover:bg-white disabled:opacity-50"
              : "bg-stone-900 text-stone-50 hover:bg-stone-800 disabled:opacity-50"
          }`}
        >
          <span>✦</span>
          <span>
            {isApplyingWallpaper ? "Applying..." : "Set as Live Wallpaper"}
          </span>
        </button>

        {zenMode && (
          <button
            type="button"
            onClick={onToggleZenMode}
            className="px-3.5 py-1.5 rounded-full text-xs font-light tracking-wide border border-stone-600/80 bg-stone-900/70 text-stone-200 hover:bg-stone-800 transition-all cursor-pointer backdrop-blur-md"
          >
            Exit Zen ↙
          </button>
        )}
      </div>
    </header>
  );
};
