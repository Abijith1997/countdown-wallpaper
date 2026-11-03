import {
  ProjectCountdown,
  ViewMode,
  ZenAtmosphere,
  ZenTask,
} from "../sidebar/types";

export type { ProjectCountdown, ViewMode, ZenAtmosphere, ZenTask };

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export interface StartupPageProps {
  project: ProjectCountdown;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onUpdateProject: (updated: ProjectCountdown) => void;
  darkMode?: boolean;
  zenMode?: boolean;
  onToggleZenMode?: () => void;
  liveDesktopMode?: boolean;
  onChangeLiveDesktopMode?: (enable: boolean) => void;
}
