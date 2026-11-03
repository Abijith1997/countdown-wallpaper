import React from "react";
import { ZenAtmosphere } from "../types";

interface WallpaperBackdropProps {
  wallpaperImage: string | null;
  wallpaperBlur: number;
  wallpaperDim: number;
  isDraggingImage: boolean;
  darkMode: boolean;
  atmosphere: ZenAtmosphere;
}

export const WallpaperBackdrop: React.FC<WallpaperBackdropProps> = ({
  wallpaperImage,
  wallpaperBlur,
  wallpaperDim,
  isDraggingImage,
  darkMode,
  atmosphere,
}) => {
  return (
    <>
      {/* Custom Wallpaper Background Layer */}
      {wallpaperImage && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            src={wallpaperImage}
            alt="Custom Zen Wallpaper"
            style={{
              filter: `blur(${wallpaperBlur}px)`,
              transform: "scale(1.04)",
            }}
            className="h-full w-full object-cover transition-all duration-500"
          />
          <div
            style={{ backgroundColor: `rgba(12, 13, 12, ${wallpaperDim / 100})` }}
            className="absolute inset-0 transition-colors duration-300"
          />
        </div>
      )}

      {/* Drag & Drop Wallpaper Overlay */}
      {isDraggingImage && (
        <div className="absolute inset-4 z-50 rounded-2xl border-2 border-dashed border-stone-300/80 bg-stone-950/70 backdrop-blur-md flex flex-col items-center justify-center text-stone-100">
          <span className="font-serif-zen text-3xl font-light mb-1">
            Drop image to set your Zen wallpaper
          </span>
          <span className="text-xs text-stone-400 font-light">
            PNG, JPG, WebP supported
          </span>
        </div>
      )}

      {/* Subtle Ambient Zen Circle in Background (when no custom image) */}
      {!wallpaperImage && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <div
            className={`animate-breathe h-[420px] w-[420px] rounded-full blur-3xl transition-colors duration-1000 ${
              darkMode
                ? atmosphere === "moss"
                  ? "bg-emerald-950/35"
                  : "bg-stone-800/25"
                : atmosphere === "moss"
                  ? "bg-emerald-200/30"
                  : "bg-stone-300/40"
            }`}
          />
        </div>
      )}
    </>
  );
};

