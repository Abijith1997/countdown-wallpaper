import { useEffect, useState } from "react";
import "./App.css";
import { ProjectCountdown, SideBar, ViewMode } from "./features/sidebar";
import { DEFAULT_PROJECTS, StartupPage } from "./features/startup";

function App() {
  const [projects, setProjects] = useState<ProjectCountdown[]>(() => {
    try {
      const saved = localStorage.getItem("kanso_zen_projects_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    () => projects[0]?.id ?? null
  );
  const [viewMode, setViewMode] = useState<ViewMode>("main-wallpaper");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [zenMode, setZenMode] = useState<boolean>(false);
  const [liveDesktopMode, setLiveDesktopMode] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem("kanso_zen_projects_v2", JSON.stringify(projects));
    } catch {
      // ignore quota errors
    }
  }, [projects]);

  const activeProject =
    projects.find((p) => p.id === activeProjectId) ?? projects[0] ?? null;

  const handleUpdateProject = (updated: ProjectCountdown) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleCreateProject = (
    title: string,
    targetIso: string,
    showSubtasks = false
  ) => {
    const created: ProjectCountdown = {
      id: `proj-${Date.now()}`,
      title,
      mantra: "Focus quietly on one step at a time.",
      targetIso,
      atmosphere: "stone",
      wallpaperImage: null,
      showSubtasks,
      tasks: [],
    };
    setProjects((prev) => [...prev, created]);
    setActiveProjectId(created.id);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (activeProjectId === id) {
        setActiveProjectId(filtered[0]?.id ?? null);
      }
      return filtered;
    });
  };

  const handleCycleProject = (delta: -1 | 1) => {
    if (projects.length <= 1) return;
    const currentIndex = projects.findIndex((p) => p.id === activeProject?.id);
    const baseIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = (baseIndex + delta + projects.length) % projects.length;
    setActiveProjectId(projects[nextIndex].id);
  };

  return (
    <main
      className={`h-screen w-screen transition-all duration-700 ${
        darkMode ? "bg-[#0C0D0C]" : "bg-[#E8E5DD]"
      }`}
    >
      <div className="flex h-full w-full">
        <SideBar
          projects={projects}
          activeProjectId={activeProject?.id ?? null}
          onSelectProject={setActiveProjectId}
          onCreateProject={handleCreateProject}
          onDeleteProject={handleDeleteProject}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
          zenMode={zenMode || liveDesktopMode}
          onToggleZenMode={() => setZenMode((prev) => !prev)}
        />
        <StartupPage
          project={activeProject}
          projectCount={projects.length}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          onUpdateProject={handleUpdateProject}
          onCreateProject={handleCreateProject}
          onCycleProject={handleCycleProject}
          darkMode={darkMode}
          zenMode={zenMode}
          onToggleZenMode={() => setZenMode((prev) => !prev)}
          liveDesktopMode={liveDesktopMode}
          onChangeLiveDesktopMode={(enable) => {
            setLiveDesktopMode(enable);
            setZenMode(enable);
          }}
        />
      </div>
    </main>
  );
}

export default App;
