import React, { useEffect, useRef, useState } from "react";
import { ColorSelector } from "./components/ColorSelector";
import { CountdownHero } from "./components/CountdownHero";
import { TaskChecklist } from "./components/TaskChecklist";
import { TopHeaderBar } from "./components/TopHeaderBar";
import { WallpaperBackdrop } from "./components/WallpaperBackdrop";
import { WallpaperControls } from "./components/WallpaperControls";
import { DEFAULT_PROJECTS, getAtmosphereSurface } from "./constants";
import {
  ProjectCountdown,
  StartupPageProps,
  ViewMode,
  ZenAtmosphere,
  ZenTask,
} from "./types";
import { calculateTimeLeft } from "./utils/time";
import {
  renderAndSetMainWallpaper,
  setNativeLiveDesktopMode,
} from "./utils/wallpaperExport";

export { DEFAULT_PROJECTS };
export type { ProjectCountdown, StartupPageProps, ViewMode, ZenAtmosphere, ZenTask };

export const StartupPage: React.FC<StartupPageProps> = ({
  project,
  viewMode,
  onChangeViewMode,
  onUpdateProject,
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Live 1s clock tick
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keep static fallback wallpaper synced when tasks or project change while in liveDesktopMode
  useEffect(() => {
    if (!liveDesktopMode) return;
    const t = calculateTimeLeft(project.targetIso);
    renderAndSetMainWallpaper({
      project,
      timeLeft: t,
      darkMode,
      wallpaperImage: project.wallpaperImage ?? null,
      wallpaperDim,
      wallpaperBlur,
    }).catch(() => {});
  }, [
    liveDesktopMode,
    project.title,
    project.mantra,
    project.targetIso,
    project.atmosphere,
    project.wallpaperImage,
    project.textColor,
    project.accentColor,
    project.tasks,
    darkMode,
    wallpaperDim,
    wallpaperBlur,
  ]);

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
  const isLockScreenOnly = viewMode === "lock-screen";
  const effectiveEditing = isEditing && !liveDesktopMode;
  const atmosphereSurface = getAtmosphereSurface(project.atmosphere, darkMode);

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
      className={`relative flex-1 overflow-y-auto transition-all duration-700 bg-gradient-to-br ${atmosphereSurface} ${
        useLightText
          ? "text-stone-100"
          : "text-stone-800"
      } flex flex-col justify-between p-6 md:p-10`}
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
        useLightText={useLightText}
        hasCustomWallpaper={hasCustomWallpaper}
        atmosphere={project.atmosphere}
        zenMode={zenMode}
        liveDesktopMode={liveDesktopMode}
        isApplyingWallpaper={isApplyingWallpaper}
        wallpaperStatus={wallpaperStatus}
        onSelectAtmosphere={(atmosphere) =>
          onUpdateProject({ ...project, atmosphere })
        }
        onTriggerUpload={() => fileInputRef.current?.click()}
        onClearWallpaper={handleClearWallpaper}
        onSetMainWallpaper={handleSetMainWallpaper}
        onExitLiveWallpaper={handleExitLiveWallpaper}
        onToggleZenMode={onToggleZenMode}
      />

      <div className="relative z-10 my-auto max-w-4xl mx-auto w-full text-center py-6 space-y-6">
        {effectiveEditing && (
          <ColorSelector
            textColor={project.textColor ?? null}
            accentColor={project.accentColor ?? null}
            useLightText={useLightText}
            onChangeTextColor={(textColor) =>
              onUpdateProject({ ...project, textColor })
            }
            onChangeAccentColor={(accentColor) =>
              onUpdateProject({ ...project, accentColor })
            }
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

        <CountdownHero
          intentionTitle={project.title}
          mantra={project.mantra}
          targetIso={project.targetIso}
          timeLeft={timeLeft}
          useLightText={useLightText}
          textColor={project.textColor}
          accentColor={project.accentColor}
          isLockScreenOnly={isLockScreenOnly}
          isEditing={effectiveEditing}
          onChangeTitle={(title) => onUpdateProject({ ...project, title })}
          onChangeMantra={(mantra) => onUpdateProject({ ...project, mantra })}
          onChangeTargetIso={(targetIso) =>
            onUpdateProject({ ...project, targetIso })
          }
        />

        {!isLockScreenOnly && (
          <TaskChecklist
            tasks={project.tasks}
            useLightText={useLightText}
            textColor={project.textColor}
            accentColor={project.accentColor}
            isEditing={effectiveEditing}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onUpdateTaskTitle={handleUpdateTaskTitle}
            onUpdateTaskDeadline={handleUpdateTaskDeadline}
            onFocusTaskAsMain={handleFocusTaskAsMain}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </div>

      <footer className="relative z-10 flex items-center justify-end text-[11px] font-light opacity-60 pt-2">
        <span>Still · Zen Countdown Lock Screen</span>
      </footer>
    </section>
  );
};
