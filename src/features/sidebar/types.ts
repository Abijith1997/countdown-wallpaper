export type ViewMode = "main-wallpaper" | "lock-screen";
export type ZenAtmosphere =
  | "stone"
  | "moss"
  | "mist"
  | "dune"
  | "sakura"
  | "matcha"
  | "twilight"
  | "ember"
  | "ocean"
  | "obsidian";

export type ZenLayout = "centered" | "split" | "minimal" | "horizon";

export interface ZenTask {
  id: string;
  title: string;
  deadlineIso: string;
  completed: boolean;
}

export interface ProjectCountdown {
  id: string;
  title: string;
  mantra: string;
  breathQuote?: string;
  targetIso: string;
  atmosphere: ZenAtmosphere;
  layout?: ZenLayout;
  wallpaperImage?: string | null;
  textColor?: string | null;
  accentColor?: string | null;
  showSubtasks?: boolean;
  remindersEnabled?: boolean;
  tasks: ZenTask[];
}

export interface SideBarProps {
  projects: ProjectCountdown[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateProject: (
    title: string,
    targetIso: string,
    showSubtasks?: boolean
  ) => void;
  onDeleteProject: (id: string) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  zenMode?: boolean;
  onToggleZenMode?: () => void;
}
