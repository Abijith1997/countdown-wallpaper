import {
  ProjectCountdown,
  ViewMode,
  ZenAtmosphere,
  ZenLayout,
  ZenTask,
} from "../sidebar/types";

export type { ProjectCountdown, ViewMode, ZenAtmosphere, ZenLayout, ZenTask };

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export interface StartupPageProps {
  project: ProjectCountdown | null;
  projectCount?: number;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onUpdateProject: (updated: ProjectCountdown) => void;
  onCreateProject?: (
    title: string,
    targetIso: string,
    showSubtasks?: boolean
  ) => void;
  onCycleProject?: (delta: -1 | 1) => void;
  darkMode?: boolean;
  zenMode?: boolean;
  onToggleZenMode?: () => void;
  liveDesktopMode?: boolean;
  onChangeLiveDesktopMode?: (enable: boolean) => void;
}
