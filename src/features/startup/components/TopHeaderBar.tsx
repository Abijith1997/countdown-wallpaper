import React from "react";
import { ViewMode, ZenAtmosphere } from "../types";

interface TopHeaderBarProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
  showSubtasks: boolean;
  onToggleSubtasks: () => void;
  remindersEnabled?: boolean;
  onToggleReminders?: () => void;
  useLightText: boolean;
  hasCustomWallpaper: boolean;
  atmosphere?: ZenAtmosphere;
  zenMode: boolean;
  liveDesktopMode: boolean;
  isApplyingWallpaper: boolean;
  wallpaperStatus: string | null;
  onSelectAtmosphere?: (mood: ZenAtmosphere) => void;
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
  showSubtasks,
  onToggleSubtasks,
  remindersEnabled = true,
  onToggleReminders,
  useLightText,
  hasCustomWallpaper,
  zenMode,
  liveDesktopMode,
  isApplyingWallpaper,
  wallpaperStatus,
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
      <div className="flex flex-wrap items-center gap-2.5">
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

        {/* Optional Subtasks Section Toggle (in Main Wallpaper view) */}
        {viewMode === "main-wallpaper" && (
          <button
            type="button"
            onClick={onToggleSubtasks}
            className={`px-3.5 py-1.5 rounded-full text-xs tracking-wide border transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md ${
              showSubtasks
                ? useLightText
                  ? "border-stone-500 bg-stone-800/90 text-stone-100"
                  : "border-stone-800 bg-stone-900 text-stone-50"
                : useLightText
                  ? "border-stone-700/80 bg-stone-900/60 text-stone-400 hover:text-stone-200 font-light"
                  : "border-stone-200/90 bg-white/75 text-stone-500 hover:text-stone-800 font-light"
            }`}
          >
            <span>{showSubtasks ? "☑" : "☐"}</span>
            <span>Subtasks</span>
          </button>
        )}

        {/* Optional 24h / 12h / 1h Reminders Toggle */}
        {onToggleReminders && (
          <button
            type="button"
            title="Toggle 24h, 12h, and 1h deadline reminders"
            onClick={onToggleReminders}
            className={`px-3.5 py-1.5 rounded-full text-xs tracking-wide border transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md ${
              remindersEnabled
                ? useLightText
                  ? "border-stone-500 bg-stone-800/90 text-stone-100"
                  : "border-stone-800 bg-stone-900 text-stone-50"
                : useLightText
                  ? "border-stone-700/80 bg-stone-900/60 text-stone-400 hover:text-stone-200 font-light"
                  : "border-stone-200/90 bg-white/75 text-stone-500 hover:text-stone-800 font-light"
            }`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 6A4 4 0 0 0 4 6c0 4.5-2 5.5-2 5.5h12S12 10.5 12 6" />
              <path d="M6.8 13.5a1.5 1.5 0 0 0 2.4 0" />
            </svg>
            <span>Reminders</span>
          </button>
        )}

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
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="opacity-85 shrink-0"
              >
                <rect x="2" y="2.5" width="12" height="11" rx="2" />
                <circle cx="5.75" cy="6.25" r="1.25" />
                <path d="M2.5 11.5L6.2 8.2L9.2 10.8L11.4 9L13.5 11.5" />
              </svg>
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
