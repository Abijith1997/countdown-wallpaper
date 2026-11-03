import React from "react";

interface WallpaperControlsProps {
  wallpaperDim: number;
  wallpaperBlur: number;
  onChangeDim: (value: number) => void;
  onChangeBlur: (value: number) => void;
}

export const WallpaperControls: React.FC<WallpaperControlsProps> = ({
  wallpaperDim,
  wallpaperBlur,
  onChangeDim,
  onChangeBlur,
}) => {
  return (
    <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-6 px-5 py-3 rounded-2xl border border-stone-700/60 bg-stone-950/55 backdrop-blur-md text-xs text-stone-200">
      <div className="flex items-center gap-3">
        <span className="text-[11px] uppercase tracking-[0.16em] text-stone-400">
          Wallpaper Dim
        </span>
        <input
          type="range"
          min={10}
          max={85}
          value={wallpaperDim}
          onChange={(e) => onChangeDim(Number(e.target.value))}
          className="w-28 accent-stone-200 cursor-pointer"
        />
        <span className="font-mono-zen text-[11px] text-stone-300 w-8">
          {wallpaperDim}%
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[11px] uppercase tracking-[0.16em] text-stone-400">
          Soft Blur
        </span>
        <input
          type="range"
          min={0}
          max={16}
          value={wallpaperBlur}
          onChange={(e) => onChangeBlur(Number(e.target.value))}
          className="w-28 accent-stone-200 cursor-pointer"
        />
        <span className="font-mono-zen text-[11px] text-stone-300 w-8">
          {wallpaperBlur}px
        </span>
      </div>
    </div>
  );
};

