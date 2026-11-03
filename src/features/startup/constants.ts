import { ProjectCountdown, ZenAtmosphere, ZenLayout } from "./types";

export const ZEN_BREATH_QUOTES: string[] = [
  "Breathe in · Be present",
  "Inhale calm · Exhale rush",
  "One step · Quiet focus",
  "Still mind · Steady pace",
  "Progress over perfection",
  "Slow down · Move with intent",
  "Let go of noise · Begin now",
  "Deep breath · Clear horizon",
  "Small steps · Deep roots",
  "Quiet effort · Lasting work",
  "Present moment · Pure focus",
  "Unrushed · Undistracted",
  "Calm mind · Sharp craft",
  "Breathe in clarity · Breathe out doubt",
];

// Starts empty on fresh install so the user begins from "Start a project to get started"
export const DEFAULT_PROJECTS: ProjectCountdown[] = [];

export interface ZenLayoutOption {
  id: ZenLayout;
  label: string;
  description: string;
}

export const ZEN_LAYOUT_OPTIONS: ZenLayoutOption[] = [
  {
    id: "centered",
    label: "Centered",
    description: "Classic balanced sanctuary",
  },
  {
    id: "split",
    label: "Split",
    description: "Editorial two-column view",
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Frameless architectural numerals",
  },
  {
    id: "horizon",
    label: "Horizon",
    description: "Panoramic lower-third dock",
  },
];

export interface ZenAtmospherePreset {
  id: ZenAtmosphere;
  label: string;
  swatchLight: string;
  swatchDark: string;
  lightSurface: string;
  darkSurface: string;
  lightStops: [string, string, string];
  darkStops: [string, string, string];
  orbLight: string;
  orbDark: string;
  lightTextColor: string;
  lightAccentColor: string;
  darkTextColor: string;
  darkAccentColor: string;
}

export const ZEN_ATMOSPHERE_PRESETS: ZenAtmospherePreset[] = [
  {
    id: "stone",
    label: "Warm Stone",
    swatchLight: "linear-gradient(135deg, #FAF8F5 0%, #E6E0D3 100%)",
    swatchDark: "linear-gradient(135deg, #262522 0%, #10100F 100%)",
    lightSurface: "from-[#FAF9F5] via-[#F5F3EC] to-[#EFECE4]",
    darkSurface: "from-[#181816] via-[#141413] to-[#0E0E0D]",
    lightStops: ["#FAF9F5", "#F5F3EC", "#EFECE4"],
    darkStops: ["#181816", "#141413", "#0E0E0D"],
    orbLight: "bg-stone-300/40",
    orbDark: "bg-stone-800/30",
    lightTextColor: "#1C1917",
    lightAccentColor: "#57534E",
    darkTextColor: "#F5F5F4",
    darkAccentColor: "#D6D3D1",
  },
  {
    id: "moss",
    label: "Forest Moss",
    swatchLight: "linear-gradient(135deg, #F2F6F0 0%, #C6DBC0 100%)",
    swatchDark: "linear-gradient(135deg, #1B2920 0%, #0B120E 100%)",
    lightSurface: "from-[#F3F5F1] via-[#E8EFE4] to-[#DAE5D4]",
    darkSurface: "from-[#121B15] via-[#141E18] to-[#0C120E]",
    lightStops: ["#F3F5F1", "#E8EFE4", "#DAE5D4"],
    darkStops: ["#121B15", "#141E18", "#0C120E"],
    orbLight: "bg-emerald-200/35",
    orbDark: "bg-emerald-950/40",
    lightTextColor: "#0F291E",
    lightAccentColor: "#15803D",
    darkTextColor: "#ECFDF5",
    darkAccentColor: "#34D399",
  },
  {
    id: "mist",
    label: "Morning Mist",
    swatchLight: "linear-gradient(135deg, #F2F4F7 0%, #CFD9E6 100%)",
    swatchDark: "linear-gradient(135deg, #1E2430 0%, #0D1017 100%)",
    lightSurface: "from-[#F2F4F7] via-[#E9EEF4] to-[#DCE4EE]",
    darkSurface: "from-[#131720] via-[#151A24] to-[#0D1017]",
    lightStops: ["#F2F4F7", "#E9EEF4", "#DCE4EE"],
    darkStops: ["#131720", "#151A24", "#0D1017"],
    orbLight: "bg-slate-300/40",
    orbDark: "bg-slate-800/35",
    lightTextColor: "#0F172A",
    lightAccentColor: "#334155",
    darkTextColor: "#F1F5F9",
    darkAccentColor: "#94A3B8",
  },
  {
    id: "dune",
    label: "Sand Dune",
    swatchLight: "linear-gradient(135deg, #FDFBF7 0%, #E6CFAF 100%)",
    swatchDark: "linear-gradient(135deg, #2B221A 0%, #110E0B 100%)",
    lightSurface: "from-[#FDFBF7] via-[#F6EDE0] to-[#EADAC3]",
    darkSurface: "from-[#1F1914] via-[#181410] to-[#110E0B]",
    lightStops: ["#FDFBF7", "#F6EDE0", "#EADAC3"],
    darkStops: ["#1F1914", "#181410", "#110E0B"],
    orbLight: "bg-amber-200/35",
    orbDark: "bg-amber-950/35",
    lightTextColor: "#2C1810",
    lightAccentColor: "#B45309",
    darkTextColor: "#FEF3C7",
    darkAccentColor: "#FBBF24",
  },
  {
    id: "sakura",
    label: "Sakura Dawn",
    swatchLight: "linear-gradient(135deg, #FFF9FA 0%, #F3CED8 100%)",
    swatchDark: "linear-gradient(135deg, #2D1B22 0%, #120B0E 100%)",
    lightSurface: "from-[#FFF9FA] via-[#FCECEF] to-[#F5DAE2]",
    darkSurface: "from-[#211419] via-[#191014] to-[#120B0E]",
    lightStops: ["#FFF9FA", "#FCECEF", "#F5DAE2"],
    darkStops: ["#211419", "#191014", "#120B0E"],
    orbLight: "bg-rose-200/35",
    orbDark: "bg-rose-950/35",
    lightTextColor: "#3B0D1E",
    lightAccentColor: "#BE185D",
    darkTextColor: "#FFE4E6",
    darkAccentColor: "#FB7185",
  },
  {
    id: "matcha",
    label: "Uji Matcha",
    swatchLight: "linear-gradient(135deg, #F6F8F1 0%, #D4E0B8 100%)",
    swatchDark: "linear-gradient(135deg, #1E2816 0%, #0C0F09 100%)",
    lightSurface: "from-[#F6F8F1] via-[#ECF2DF] to-[#DCE6C5]",
    darkSurface: "from-[#161D11] via-[#12170D] to-[#0C0F09]",
    lightStops: ["#F6F8F1", "#ECF2DF", "#DCE6C5"],
    darkStops: ["#161D11", "#12170D", "#0C0F09"],
    orbLight: "bg-lime-200/35",
    orbDark: "bg-lime-950/35",
    lightTextColor: "#1A2E05",
    lightAccentColor: "#4D7C0F",
    darkTextColor: "#ECFCCB",
    darkAccentColor: "#A3E635",
  },
  {
    id: "twilight",
    label: "Kyoto Twilight",
    swatchLight: "linear-gradient(135deg, #F3F2FA 0%, #D5D1EC 100%)",
    swatchDark: "linear-gradient(135deg, #252242 0%, #101120 100%)",
    lightSurface: "from-[#F3F2FA] via-[#E6E4F5] to-[#D5D1EC]",
    darkSurface: "from-[#1D1B33] via-[#161629] to-[#0E0F1C]",
    lightStops: ["#F3F2FA", "#E6E4F5", "#D5D1EC"],
    darkStops: ["#1D1B33", "#161629", "#0E0F1C"],
    orbLight: "bg-indigo-200/40",
    orbDark: "bg-indigo-900/35",
    lightTextColor: "#1E1B4B",
    lightAccentColor: "#4F46E5",
    darkTextColor: "#E0E7FF",
    darkAccentColor: "#818CF8",
  },
  {
    id: "ember",
    label: "Ember Dusk",
    swatchLight: "linear-gradient(135deg, #FFF8F5 0%, #F5D9CC 100%)",
    swatchDark: "linear-gradient(135deg, #331C17 0%, #140C0A 100%)",
    lightSurface: "from-[#FFF8F5] via-[#FCECE4] to-[#F5D9CC]",
    darkSurface: "from-[#281714] via-[#1D1210] to-[#120B0A]",
    lightStops: ["#FFF8F5", "#FCECE4", "#F5D9CC"],
    darkStops: ["#281714", "#1D1210", "#120B0A"],
    orbLight: "bg-orange-200/40",
    orbDark: "bg-orange-900/35",
    lightTextColor: "#431407",
    lightAccentColor: "#C2410C",
    darkTextColor: "#FFEDD5",
    darkAccentColor: "#FB923C",
  },
  {
    id: "ocean",
    label: "Deep Sea",
    swatchLight: "linear-gradient(135deg, #F0F8FC 0%, #CCE3F0 100%)",
    swatchDark: "linear-gradient(135deg, #132833 0%, #09131A 100%)",
    lightSurface: "from-[#F0F8FC] via-[#E1F0F7] to-[#CCE3F0]",
    darkSurface: "from-[#11232E] via-[#0E1B24] to-[#081118]",
    lightStops: ["#F0F8FC", "#E1F0F7", "#CCE3F0"],
    darkStops: ["#11232E", "#0E1B24", "#081118"],
    orbLight: "bg-sky-200/40",
    orbDark: "bg-sky-900/35",
    lightTextColor: "#0C4A6E",
    lightAccentColor: "#0284C7",
    darkTextColor: "#E0F2FE",
    darkAccentColor: "#38BDF8",
  },
  {
    id: "obsidian",
    label: "Obsidian Ink",
    swatchLight: "linear-gradient(135deg, #F4F4F5 0%, #D4D4D8 100%)",
    swatchDark: "linear-gradient(135deg, #27272A 0%, #09090B 100%)",
    lightSurface: "from-[#F4F4F5] via-[#E4E4E7] to-[#D4D4D8]",
    darkSurface: "from-[#18181B] via-[#121215] to-[#09090B]",
    lightStops: ["#F4F4F5", "#E4E4E7", "#D4D4D8"],
    darkStops: ["#18181B", "#121215", "#09090B"],
    orbLight: "bg-zinc-300/40",
    orbDark: "bg-zinc-800/35",
    lightTextColor: "#09090B",
    lightAccentColor: "#52525B",
    darkTextColor: "#FAFAFA",
    darkAccentColor: "#A1A1AA",
  },
];

export function getAtmospherePreset(
  atmosphere: ZenAtmosphere
): ZenAtmospherePreset {
  return (
    ZEN_ATMOSPHERE_PRESETS.find((p) => p.id === atmosphere) ??
    ZEN_ATMOSPHERE_PRESETS[0]
  );
}

export function getAtmosphereSurface(
  atmosphere: ZenAtmosphere,
  darkMode: boolean
): string {
  const preset = getAtmospherePreset(atmosphere);
  return darkMode ? preset.darkSurface : preset.lightSurface;
}

export function getAtmosphereMatchingColors(
  atmosphere: ZenAtmosphere,
  darkMode: boolean
): { textColor: string; accentColor: string } {
  const preset = getAtmospherePreset(atmosphere);
  return {
    textColor: darkMode ? preset.darkTextColor : preset.lightTextColor,
    accentColor: darkMode ? preset.darkAccentColor : preset.lightAccentColor,
  };
}

/**
 * Computes relative luminance (0.0 darkest to 1.0 brightest) for a 6-digit hex color.
 */
export function getHexLuminance(hex: string): number {
  const cleaned = hex.replace("#", "").trim();
  if (cleaned.length !== 6) return 0.5;
  const r = parseInt(cleaned.slice(0, 2), 16) / 255;
  const g = parseInt(cleaned.slice(2, 4), 16) / 255;
  const b = parseInt(cleaned.slice(4, 6), 16) / 255;
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return 0.5;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Ensures any custom or preset text/accent color remains accessible when switching
 * between Light Stone and Dark Obsidian themes.
 */
export function resolveAccessibleColors(
  atmosphere: ZenAtmosphere,
  darkMode: boolean,
  hasCustomWallpaper: boolean,
  customTextColor?: string | null,
  customAccentColor?: string | null
): { textColor: string; accentColor: string } {
  const useLightText = hasCustomWallpaper || darkMode;
  const matching = getAtmosphereMatchingColors(atmosphere, useLightText);

  let textColor =
    customTextColor ||
    (hasCustomWallpaper ? "#F5F5F4" : matching.textColor);
  let accentColor =
    customAccentColor ||
    (hasCustomWallpaper ? "#34D399" : matching.accentColor);

  // Accessibility guard: prevent pure dark-ink on dark backgrounds or pure white-ivory on light backgrounds
  if (customTextColor) {
    const lum = getHexLuminance(customTextColor);
    if (useLightText && lum < 0.05) {
      textColor = matching.textColor;
    } else if (!useLightText && lum > 0.88) {
      textColor = matching.textColor;
    }
  }

  if (customAccentColor) {
    const lum = getHexLuminance(customAccentColor);
    if (useLightText && lum < 0.05) {
      accentColor = matching.accentColor;
    } else if (!useLightText && lum > 0.88) {
      accentColor = matching.accentColor;
    }
  }

  return { textColor, accentColor };
}
