import React, { useEffect, useRef, useState } from "react";
import { ColorSelector } from "./components/ColorSelector";
import { CountdownHero } from "./components/CountdownHero";
import { EmptyProjectState } from "./components/EmptyProjectState";
import { ReminderBanner } from "./components/ReminderBanner";
import { TaskChecklist } from "./components/TaskChecklist";
import { TopHeaderBar } from "./components/TopHeaderBar";
import { WallpaperBackdrop } from "./components/WallpaperBackdrop";
import { WallpaperControls } from "./components/WallpaperControls";
import {
  DEFAULT_PROJECTS,
  getAtmosphereSurface,
  resolveAccessibleColors,
} from "./constants";
import {
  ProjectCountdown,
  StartupPageProps,
  ViewMode,
  ZenAtmosphere,
  ZenLayout,
  ZenTask,
} from "./types";
import {
  dispatchSystemNotification,
  evaluateProjectReminders,
  ReminderNotification,
  requestNotificationPermissionIfNeeded,
} from "./utils/reminders";
import { calculateTimeLeft } from "./utils/time";
import {
  renderAndSetMainWallpaper,
  setNativeLiveDesktopMode,
} from "./utils/wallpaperExport";

export { DEFAULT_PROJECTS };
export type {
  ProjectCountdown,
  StartupPageProps,
  ViewMode,
  ZenAtmosphere,
  ZenLayout,
  ZenTask,
};

export const StartupPage: React.FC<StartupPageProps> = ({
  project,
  projectCount = 1,
  viewMode,
  onChangeViewMode,
  onUpdateProject,
  onCreateProject,
  onCycleProject,
  darkMode = false,
  zenMode = false,
  onToggleZenMode,
  liveDesktopMode = false,
  onChangeLiveDesktopMode,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [wallpaperDim, setWallpaperDim] = useState<number>(45);
  const [wallpaperBlur, setWallpaperBlur] = useState<number>(2);
  const [isDraggingImage, setIsDraggingImage] = useState<boolean>(false);
  const [isApplyingWallpaper, setIsApplyingWallpaper] = useState<boolean>(false);
  const [wallpaperStatus, setWallpaperStatus] = useState<string | null>(null);
  const [activeReminders, setActiveReminders] = useState<
    ReminderNotification[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sentRemindersRef = useRef<Set<string> | null>(null);

  if (sentRemindersRef.current === null) {
    try {
      const saved = localStorage.getItem("kanso_sent_reminders_v1");
      sentRemindersRef.current = saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      sentRemindersRef.current = new Set();
    }
  }

  // Live 1s clock tick
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Evaluate 24h, 12h, and 1h reminders for main countdown and subtasks
  useEffect(() => {
    if (!project || project.remindersEnabled === false) return;
    const sentSet = sentRemindersRef.current ?? new Set<string>();
    const { dueReminders, updatedSentKeys } = evaluateProjectReminders(
      [project],
      sentSet
    );
    if (dueReminders.length > 0) {
      sentRemindersRef.current = updatedSentKeys;
      try {
        localStorage.setItem(
          "kanso_sent_reminders_v1",
          JSON.stringify(Array.from(updatedSentKeys))
        );
      } catch {
        // ignore storage quota errors
      }
      setActiveReminders((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const fresh = dueReminders.filter((r) => !existingIds.has(r.id));
        return [...fresh, ...prev];
      });
      dueReminders.forEach((reminder) => {
        dispatchSystemNotification(reminder).catch(() => {});
      });
    }
  }, [project, tick]);

  // Keep static fallback wallpaper synced when tasks or project change while in liveDesktopMode
  useEffect(() => {
    if (!liveDesktopMode || !project) return;
    const t = calculateTimeLeft(project.targetIso);
    renderAndSetMainWallpaper({
      project,
      timeLeft: t,
      darkMode,
      viewMode,
      wallpaperImage: project.wallpaperImage ?? null,
      wallpaperDim,
      wallpaperBlur,
      pinWindow: false,
    }).catch(() => {});
  }, [
    liveDesktopMode,
    project,
    darkMode,
    viewMode,
    wallpaperDim,
    wallpaperBlur,
  ]);

  // Empty State when no project countdowns exist (fresh install or all deleted)
  if (!project) {
    const emptySurface = getAtmosphereSurface("stone", darkMode);
    return (
      <section
        className={`relative flex-1 h-full overflow-hidden transition-all duration-700 bg-gradient-to-br ${emptySurface} ${
          darkMode ? "text-stone-100" : "text-stone-800"
        } flex flex-col justify-between p-6 md:p-8`}
      >
        <WallpaperBackdrop
          wallpaperImage={null}
          wallpaperBlur={0}
          wallpaperDim={0}
          isDraggingImage={false}
          darkMode={darkMode}
          atmosphere="stone"
        />

        <EmptyProjectState
          darkMode={darkMode}
          onCreateProject={(title, targetIso, showSubtasks) =>
            onCreateProject?.(title, targetIso, showSubtasks)
          }
        />

        <footer className="relative z-10 flex items-center justify-end text-[11px] font-light opacity-60 pt-2">
          <span>Kanso · Zen Countdown Sanctuary</span>
        </footer>
      </section>
    );
  }

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onUpdateProject({ ...project, wallpaperImage: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleClearWallpaper = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    onUpdateProject({ ...project, wallpaperImage: null });
  };

  const handleSelectAtmosphere = (atmosphere: ZenAtmosphere) => {
    onUpdateProject({
      ...project,
      atmosphere,
      textColor: null,
      accentColor: null,
    });
  };

  const handleSelectLayout = (layout: ZenLayout) => {
    onUpdateProject({ ...project, layout });
  };

  const handleAddTask = (title: string, deadlineIso: string) => {
    const nextTask: ZenTask = {
      id: `task-${Date.now()}`,
      title,
      deadlineIso,
      completed: false,
    };
    onUpdateProject({ ...project, tasks: [...project.tasks, nextTask] });
  };

  const handleToggleTask = (id: string) => {
    onUpdateProject({
      ...project,
      tasks: project.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    });
  };

  const handleUpdateTaskTitle = (id: string, title: string) => {
    onUpdateProject({
      ...project,
      tasks: project.tasks.map((t) => (t.id === id ? { ...t, title } : t)),
    });
  };

  const handleUpdateTaskDeadline = (id: string, deadlineIso: string) => {
    onUpdateProject({
      ...project,
      tasks: project.tasks.map((t) =>
        t.id === id ? { ...t, deadlineIso } : t
      ),
    });
  };

  const handleDeleteTask = (id: string) => {
    onUpdateProject({
      ...project,
      tasks: project.tasks.filter((t) => t.id !== id),
    });
  };

  const handleFocusTaskAsMain = (task: ZenTask) => {
    onUpdateProject({
      ...project,
      title: task.title,
      targetIso: task.deadlineIso,
    });
  };

  const timeLeft = calculateTimeLeft(project.targetIso);

  const handleSetMainWallpaper = async () => {
    try {
      setIsApplyingWallpaper(true);
      setIsEditing(false);
      setWallpaperStatus(null);
      const res = await renderAndSetMainWallpaper({
        project,
        timeLeft,
        darkMode,
        viewMode,
        wallpaperImage: project.wallpaperImage ?? null,
        wallpaperDim,
        wallpaperBlur,
      });
      onChangeLiveDesktopMode?.(true);
      setWallpaperStatus(res.message);
      setTimeout(() => setWallpaperStatus(null), 5000);
    } catch (err) {
      setWallpaperStatus(
        err instanceof Error ? err.message : "Could not apply wallpaper"
      );
    } finally {
      setIsApplyingWallpaper(false);
    }
  };

  const handleExitLiveWallpaper = async () => {
    try {
      await setNativeLiveDesktopMode(false);
    } catch {
      // ignore if in browser
    }
    onChangeLiveDesktopMode?.(false);
  };

  const wallpaperImage = project.wallpaperImage ?? null;
  const hasCustomWallpaper = Boolean(wallpaperImage);
  const useLightText = hasCustomWallpaper || darkMode;
  const resolvedColors = resolveAccessibleColors(
    project.atmosphere,
    darkMode,
    hasCustomWallpaper,
    project.textColor,
    project.accentColor
  );
  const effectiveTextColor = resolvedColors.textColor;
  const effectiveAccentColor = resolvedColors.accentColor;

  const isLockScreenOnly = viewMode === "lock-screen";
  const showSubtasks = Boolean(project.showSubtasks);
  const remindersEnabled = project.remindersEnabled !== false;
  const activeLayout: ZenLayout = project.layout ?? "centered";
  const effectiveEditing = isEditing && !liveDesktopMode;
  const canCycleProjects = Boolean(
    liveDesktopMode && projectCount > 1 && onCycleProject
  );
  const atmosphereSurface = getAtmosphereSurface(project.atmosphere, darkMode);

  const isSplitWithSubtasks =
    activeLayout === "split" && !isLockScreenOnly && showSubtasks;

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingImage(true);
      }}
      onDragLeave={() => setIsDraggingImage(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingImage(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleImageFile(file);
      }}
      className={`relative flex-1 h-full overflow-hidden transition-all duration-700 bg-gradient-to-br ${atmosphereSurface} ${
        useLightText ? "text-stone-100" : "text-stone-800"
      } flex flex-col justify-between p-6 md:p-8`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageFile(file);
        }}
      />

      <WallpaperBackdrop
        wallpaperImage={wallpaperImage}
        wallpaperBlur={wallpaperBlur}
        wallpaperDim={wallpaperDim}
        isDraggingImage={isDraggingImage}
        darkMode={darkMode}
        atmosphere={project.atmosphere}
      />

      <TopHeaderBar
        viewMode={viewMode}
        onChangeViewMode={onChangeViewMode}
        isEditing={effectiveEditing}
        onToggleEdit={() => setIsEditing((prev) => !prev)}
        showSubtasks={showSubtasks}
        onToggleSubtasks={() =>
          onUpdateProject({ ...project, showSubtasks: !showSubtasks })
        }
        remindersEnabled={remindersEnabled}
        onToggleReminders={() => {
          const next = !remindersEnabled;
          if (next) {
            requestNotificationPermissionIfNeeded().catch(() => {});
          }
          onUpdateProject({ ...project, remindersEnabled: next });
        }}
        useLightText={useLightText}
        hasCustomWallpaper={hasCustomWallpaper}
        atmosphere={project.atmosphere}
        zenMode={zenMode}
        liveDesktopMode={liveDesktopMode}
        isApplyingWallpaper={isApplyingWallpaper}
        wallpaperStatus={wallpaperStatus}
        onSelectAtmosphere={handleSelectAtmosphere}
        onTriggerUpload={() => fileInputRef.current?.click()}
        onClearWallpaper={handleClearWallpaper}
        onSetMainWallpaper={handleSetMainWallpaper}
        onExitLiveWallpaper={handleExitLiveWallpaper}
        onToggleZenMode={onToggleZenMode}
      />

      <div
        className={`relative z-10 flex-1 min-h-0 flex flex-col ${
          activeLayout === "horizon" && !effectiveEditing
            ? "justify-end pb-2"
            : "justify-center"
        } ${
          activeLayout === "split" || activeLayout === "horizon"
            ? "max-w-5xl"
            : "max-w-4xl"
        } mx-auto w-full text-center py-2 gap-4 overflow-hidden`}
      >
        {effectiveEditing && (
          <ColorSelector
            textColor={project.textColor ?? null}
            accentColor={project.accentColor ?? null}
            useLightText={useLightText}
            atmosphere={project.atmosphere}
            layout={activeLayout}
            hasCustomWallpaper={hasCustomWallpaper}
            onChangeTextColor={(textColor) =>
              onUpdateProject({ ...project, textColor })
            }
            onChangeAccentColor={(accentColor) =>
              onUpdateProject({ ...project, accentColor })
            }
            onSelectAtmosphere={handleSelectAtmosphere}
            onSelectLayout={handleSelectLayout}
          />
        )}

        {remindersEnabled && activeReminders.length > 0 && (
          <ReminderBanner
            reminders={activeReminders}
            useLightText={useLightText}
            accentColor={effectiveAccentColor}
            onDismiss={(id) =>
              setActiveReminders((prev) => prev.filter((r) => r.id !== id))
            }
            onDismissAll={() => setActiveReminders([])}
          />
        )}

        {wallpaperImage && effectiveEditing && (
          <WallpaperControls
            wallpaperDim={wallpaperDim}
            wallpaperBlur={wallpaperBlur}
            onChangeDim={setWallpaperDim}
            onChangeBlur={setWallpaperBlur}
          />
        )}

        {isSplitWithSubtasks ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full min-h-0 flex-1 overflow-hidden">
            <div className="lg:col-span-6">
              <CountdownHero
                intentionTitle={project.title}
                mantra={project.mantra}
                breathQuote={project.breathQuote}
                targetIso={project.targetIso}
                timeLeft={timeLeft}
                useLightText={useLightText}
                textColor={effectiveTextColor}
                accentColor={effectiveAccentColor}
                layout={activeLayout}
                hasSubtasks={showSubtasks}
                isLockScreenOnly={isLockScreenOnly}
                isEditing={effectiveEditing}
                canCycleProjects={canCycleProjects}
                onCycleProject={onCycleProject}
                onChangeTitle={(title) => onUpdateProject({ ...project, title })}
                onChangeMantra={(mantra) =>
                  onUpdateProject({ ...project, mantra })
                }
                onChangeBreathQuote={(breathQuote) =>
                  onUpdateProject({ ...project, breathQuote })
                }
                onChangeTargetIso={(targetIso) =>
                  onUpdateProject({ ...project, targetIso })
                }
              />
            </div>
            <div className="lg:col-span-6 h-full max-h-[380px] flex flex-col justify-center min-h-0 overflow-hidden">
              <TaskChecklist
                tasks={project.tasks}
                useLightText={useLightText}
                textColor={effectiveTextColor}
                accentColor={effectiveAccentColor}
                fullWidth={true}
                isEditing={effectiveEditing}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onUpdateTaskTitle={handleUpdateTaskTitle}
                onUpdateTaskDeadline={handleUpdateTaskDeadline}
                onFocusTaskAsMain={handleFocusTaskAsMain}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          </div>
        ) : (
          <>
            <CountdownHero
              intentionTitle={project.title}
              mantra={project.mantra}
              breathQuote={project.breathQuote}
              targetIso={project.targetIso}
              timeLeft={timeLeft}
              useLightText={useLightText}
              textColor={effectiveTextColor}
              accentColor={effectiveAccentColor}
              layout={activeLayout}
              hasSubtasks={showSubtasks}
              isLockScreenOnly={isLockScreenOnly}
              isEditing={effectiveEditing}
              canCycleProjects={canCycleProjects}
              onCycleProject={onCycleProject}
              onChangeTitle={(title) => onUpdateProject({ ...project, title })}
              onChangeMantra={(mantra) =>
                onUpdateProject({ ...project, mantra })
              }
              onChangeBreathQuote={(breathQuote) =>
                onUpdateProject({ ...project, breathQuote })
              }
              onChangeTargetIso={(targetIso) =>
                onUpdateProject({ ...project, targetIso })
              }
            />

            {!isLockScreenOnly && showSubtasks && (
              <TaskChecklist
                tasks={project.tasks}
                useLightText={useLightText}
                textColor={effectiveTextColor}
                accentColor={effectiveAccentColor}
                fullWidth={activeLayout === "horizon"}
                isEditing={effectiveEditing}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onUpdateTaskTitle={handleUpdateTaskTitle}
                onUpdateTaskDeadline={handleUpdateTaskDeadline}
                onFocusTaskAsMain={handleFocusTaskAsMain}
                onDeleteTask={handleDeleteTask}
              />
            )}
          </>
        )}
      </div>

      <footer className="relative z-10 flex items-center justify-end text-[11px] font-light opacity-60 pt-2">
        <span>Kanso · Zen Countdown Sanctuary</span>
      </footer>
    </section>
  );
};
