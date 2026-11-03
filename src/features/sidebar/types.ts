export type ViewMode = "main-wallpaper" | "lock-screen";
export type ZenAtmosphere = "stone" | "moss" | "mist";

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
  wallpaperImage?: string | null;
  textColor?: string | null;
  accentColor?: string | null;
  tasks: ZenTask[];
}

export interface SideBarProps {
  projects: ProjectCountdown[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (title: string, targetIso: string) => void;
  onDeleteProject: (id: string) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  zenMode?: boolean;
  onToggleZenMode?: () => void;
}
