import { ProjectCountdown, ZenAtmosphere } from "./types";

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

export const DEFAULT_PROJECTS: ProjectCountdown[] = [
  {
    id: "proj-handshake",
    title: "Handshake Mission Deadline",
    mantra: "Craft with calm clarity, one thoughtful detail at a time.",
    targetIso: "2026-11-23T23:59",
    atmosphere: "stone",
    wallpaperImage: null,
    tasks: [
      {
        id: "t-1",
        title: "Design minimal Zen welcome & lock screen layout",
        deadlineIso: "2026-11-10T18:00",
        completed: true,
      },
      {
        id: "t-2",
        title: "Add custom wallpaper upload & per-task deadlines",
        deadlineIso: "2026-11-18T20:00",
        completed: true,
      },
      {
        id: "t-3",
        title: "Submit project to Handshake AI Skills Studio",
        deadlineIso: "2026-11-23T23:59",
        completed: false,
      },
    ],
  },
  {
    id: "proj-launch",
    title: "Portfolio & Case Study v2",
    mantra: "Simplicity is about subtracting the obvious and adding the meaningful.",
    targetIso: "2026-12-05T18:00",
    atmosphere: "moss",
    wallpaperImage: null,
    tasks: [
      {
        id: "t-201",
        title: "Record interactive demo walkthrough video",
        deadlineIso: "2026-11-28T17:00",
        completed: false,
      },
      {
        id: "t-202",
        title: "Publish live build & write architecture notes",
        deadlineIso: "2026-12-04T21:00",
        completed: false,
      },
    ],
  },
  {
    id: "proj-new-year",
    title: "2027 Horizon & Goals",
    mantra: "Every quiet day builds the foundation for what comes next.",
    targetIso: "2027-01-01T00:00",
    atmosphere: "mist",
    wallpaperImage: null,
    tasks: [
      {
        id: "t-301",
        title: "Complete annual reflection & archive completed projects",
        deadlineIso: "2026-12-27T20:00",
        completed: false,
      },
    ],
  },
];

export function getAtmosphereSurface(
  atmosphere: ZenAtmosphere,
  darkMode: boolean
): string {
  if (darkMode) {
    if (atmosphere === "moss") return "from-[#131815] via-[#151816] to-[#101210]";
    if (atmosphere === "mist") return "from-[#141619] via-[#151719] to-[#111214]";
    return "from-[#161614] via-[#141413] to-[#10100F]";
  }
  if (atmosphere === "moss") return "from-[#F3F5F1] via-[#F7F8F5] to-[#EAEEE7]";
  if (atmosphere === "mist") return "from-[#F2F4F7] via-[#F7F8FA] to-[#EAECEF]";
  return "from-[#FAF9F5] via-[#F5F3EC] to-[#EFECE4]";
}
