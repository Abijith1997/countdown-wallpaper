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
  swatchGradient: string;
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
  inherentlyDark?: boolean;
}

export const ZEN_ATMOSPHERE_PRESETS: ZenAtmospherePreset[] = [
  {
    id: "stone",
    label: "Warm Stone",
    swatchGradient: "linear-gradient(135deg, #FAF8F5 0%, #E6E0D3 100%)",
    lightSurface: "from-[#FAF9F5] via-[#F5F3EC] to-[#EFECE4]",
    darkSurface: "from-[#161614] via-[#141413] to-[#10100F]",
    lightStops: ["#FAF9F5", "#F5F3EC", "#EFECE4"],
    darkStops: ["#161614", "#141413", "#10100F"],
    orbLight: "bg-stone-300/40",
    orbDark: "bg-stone-800/25",
    lightTextColor: "#1C1917",
    lightAccentColor: "#78716C",
    darkTextColor: "#F5F5F4",
    darkAccentColor: "#A8A29E",
  },
  {
    id: "moss",
    label: "Forest Moss",
    swatchGradient: "linear-gradient(135deg, #F2F6F0 0%, #C6DBC0 100%)",
    lightSurface: "from-[#F3F5F1] via-[#E8EFE4] to-[#DAE5D4]",
    darkSurface: "from-[#131815] via-[#151B17] to-[#0E120F]",
    lightStops: ["#F3F5F1", "#E8EFE4", "#DAE5D4"],
    darkStops: ["#131815", "#151B17", "#0E120F"],
    orbLight: "bg-emerald-200/35",
    orbDark: "bg-emerald-950/35",
    lightTextColor: "#14261C",
    lightAccentColor: "#2E6F4E",
    darkTextColor: "#DCFCE7",
    darkAccentColor: "#34D399",
  },
  {
    id: "mist",
    label: "Morning Mist",
    swatchGradient: "linear-gradient(135deg, #F2F4F7 0%, #CFD9E6 100%)",
    lightSurface: "from-[#F2F4F7] via-[#E9EEF4] to-[#DCE4EE]",
    darkSurface: "from-[#141619] via-[#15181F] to-[#0F1116]",
    lightStops: ["#F2F4F7", "#E9EEF4", "#DCE4EE"],
    darkStops: ["#141619", "#15181F", "#0F1116"],
    orbLight: "bg-slate-300/40",
    orbDark: "bg-slate-800/30",
    lightTextColor: "#1E293B",
    lightAccentColor: "#475569",
    darkTextColor: "#E2E8F0",
    darkAccentColor: "#94A3B8",
  },
  {
    id: "dune",
    label: "Sand Dune",
    swatchGradient: "linear-gradient(135deg, #FDFBF7 0%, #E6CFAF 100%)",
    lightSurface: "from-[#FDFBF7] via-[#F6EDE0] to-[#EADAC3]",
    darkSurface: "from-[#1E1914] via-[#181410] to-[#110E0B]",
    lightStops: ["#FDFBF7", "#F6EDE0", "#EADAC3"],
    darkStops: ["#1E1914", "#181410", "#110E0B"],
    orbLight: "bg-amber-200/35",
    orbDark: "bg-amber-950/30",
    lightTextColor: "#3E2723",
    lightAccentColor: "#B45309",
    darkTextColor: "#FEF3C7",
    darkAccentColor: "#F59E0B",
  },
  {
    id: "sakura",
    label: "Sakura Dawn",
    swatchGradient: "linear-gradient(135deg, #FFF9FA 0%, #F3CED8 100%)",
    lightSurface: "from-[#FFF9FA] via-[#FCECEF] to-[#F5DAE2]",
    darkSurface: "from-[#1F1418] via-[#191014] to-[#120B0E]",
    lightStops: ["#FFF9FA", "#FCECEF", "#F5DAE2"],
    darkStops: ["#1F1418", "#191014", "#120B0E"],
    orbLight: "bg-rose-200/35",
    orbDark: "bg-rose-950/35",
    lightTextColor: "#3B1824",
    lightAccentColor: "#BE185D",
    darkTextColor: "#FFE4E6",
    darkAccentColor: "#FB7185",
  },
  {
    id: "matcha",
    label: "Uji Matcha",
    swatchGradient: "linear-gradient(135deg, #F6F8F1 0%, #D4E0B8 100%)",
    lightSurface: "from-[#F6F8F1] via-[#ECF2DF] to-[#DCE6C5]",
    darkSurface: "from-[#151B10] via-[#12170D] to-[#0C0F09]",
    lightStops: ["#F6F8F1", "#ECF2DF", "#DCE6C5"],
    darkStops: ["#151B10", "#12170D", "#0C0F09"],
    orbLight: "bg-lime-200/35",
    orbDark: "bg-lime-950/30",
    lightTextColor: "#1F2914",
    lightAccentColor: "#4D7C0F",
    darkTextColor: "#ECFCCB",
    darkAccentColor: "#84CC16",
  },
  {
    id: "twilight",
    label: "Kyoto Twilight",
    swatchGradient: "linear-gradient(135deg, #252242 0%, #101120 100%)",
    lightSurface: "from-[#1D1B33] via-[#161629] to-[#0E0F1C]",
    darkSurface: "from-[#1D1B33] via-[#161629] to-[#0E0F1C]",
    lightStops: ["#1D1B33", "#161629", "#0E0F1C"],
    darkStops: ["#1D1B33", "#161629", "#0E0F1C"],
    orbLight: "bg-indigo-900/35",
    orbDark: "bg-indigo-900/35",
    lightTextColor: "#E0E7FF",
    lightAccentColor: "#818CF8",
    darkTextColor: "#E0E7FF",
    darkAccentColor: "#818CF8",
    inherentlyDark: true,
  },
  {
    id: "ember",
    label: "Ember Dusk",
    swatchGradient: "linear-gradient(135deg, #331C17 0%, #140C0A 100%)",
    lightSurface: "from-[#281714] via-[#1D1210] to-[#120B0A]",
    darkSurface: "from-[#281714] via-[#1D1210] to-[#120B0A]",
    lightStops: ["#281714", "#1D1210", "#120B0A"],
    darkStops: ["#281714", "#1D1210", "#120B0A"],
    orbLight: "bg-orange-900/30",
    orbDark: "bg-orange-900/30",
    lightTextColor: "#FFEDD5",
    lightAccentColor: "#FB923C",
    darkTextColor: "#FFEDD5",
    darkAccentColor: "#FB923C",
    inherentlyDark: true,
  },
  {
    id: "ocean",
    label: "Deep Sea",
    swatchGradient: "linear-gradient(135deg, #132833 0%, #09131A 100%)",
    lightSurface: "from-[#11232E] via-[#0E1B24] to-[#081118]",
    darkSurface: "from-[#11232E] via-[#0E1B24] to-[#081118]",
    lightStops: ["#11232E", "#0E1B24", "#081118"],
    darkStops: ["#11232E", "#0E1B24", "#081118"],
    orbLight: "bg-sky-900/30",
    orbDark: "bg-sky-900/30",
    lightTextColor: "#E0F2FE",
    lightAccentColor: "#38BDF8",
    darkTextColor: "#E0F2FE",
    darkAccentColor: "#38BDF8",
    inherentlyDark: true,
  },
  {
    id: "obsidian",
    label: "Obsidian Ink",
    swatchGradient: "linear-gradient(135deg, #27272A 0%, #09090B 100%)",
    lightSurface: "from-[#18181B] via-[#121215] to-[#09090B]",
    darkSurface: "from-[#18181B] via-[#121215] to-[#09090B]",
    lightStops: ["#18181B", "#121215", "#09090B"],
    darkStops: ["#18181B", "#121215", "#09090B"],
    orbLight: "bg-zinc-800/35",
    orbDark: "bg-zinc-800/35",
    lightTextColor: "#F4F4F5",
    lightAccentColor: "#A1A1AA",
    darkTextColor: "#F4F4F5",
    darkAccentColor: "#A1A1AA",
    inherentlyDark: true,
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
  return darkMode || preset.inherentlyDark
    ? preset.darkSurface
    : preset.lightSurface;
}

export function getAtmosphereMatchingColors(
  atmosphere: ZenAtmosphere,
  darkMode: boolean
): { textColor: string; accentColor: string; inherentlyDark: boolean } {
  const preset = getAtmospherePreset(atmosphere);
  const isDark = darkMode || Boolean(preset.inherentlyDark);
  return {
    textColor: isDark ? preset.darkTextColor : preset.lightTextColor,
    accentColor: isDark ? preset.darkAccentColor : preset.lightAccentColor,
    inherentlyDark: Boolean(preset.inherentlyDark),
  };
}
