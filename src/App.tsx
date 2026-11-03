import { useEffect, useState } from "react";
import "./App.css";
import { ProjectCountdown, SideBar, ViewMode } from "./features/sidebar";
import { DEFAULT_PROJECTS, StartupPage } from "./features/startup";

function App() {
  const [projects, setProjects] = useState<ProjectCountdown[]>(() => {
    try {
      const saved = localStorage.getItem("still_zen_projects_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(
    () => projects[0]?.id ?? DEFAULT_PROJECTS[0].id
  );
  const [viewMode, setViewMode] = useState<ViewMode>("main-wallpaper");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [zenMode, setZenMode] = useState<boolean>(false);
  const [liveDesktopMode, setLiveDesktopMode] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem("still_zen_projects_v1", JSON.stringify(projects));
    } catch {
      // ignore quota errors
    }
  }, [projects]);

  const activeProject =
    projects.find((p) => p.id === activeProjectId) ?? projects[0];

  const handleUpdateProject = (updated: ProjectCountdown) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleCreateProject = (title: string, targetIso: string) => {
    const created: ProjectCountdown = {
      id: `proj-${Date.now()}`,
      title,
      mantra: "Focus quietly on one step at a time.",
      targetIso,
      atmosphere: "stone",
      wallpaperImage: null,
      tasks: [],
    };
    setProjects((prev) => [...prev, created]);
    setActiveProjectId(created.id);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => {
      if (prev.length <= 1) return prev;
      const filtered = prev.filter((p) => p.id !== id);
      if (activeProjectId === id && filtered[0]) {
        setActiveProjectId(filtered[0].id);
      }
      return filtered;
    });
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
          activeProjectId={activeProject.id}
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
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          onUpdateProject={handleUpdateProject}
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
