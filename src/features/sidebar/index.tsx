import React from "react";
import { BrandHeader } from "./components/BrandHeader";
import { NewProjectForm } from "./components/NewProjectForm";
import { SidebarFooter } from "./components/SidebarFooter";
import { SidebarNavItem } from "./components/SidebarNavItem";
import {
  ProjectCountdown,
  SideBarProps,
  ViewMode,
  ZenAtmosphere,
  ZenTask,
} from "./types";

export type {
  ProjectCountdown,
  SideBarProps,
  ViewMode,
  ZenAtmosphere,
  ZenTask,
};

export const SideBar: React.FC<SideBarProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  darkMode = false,
  onToggleDarkMode,
  zenMode = false,
  onToggleZenMode,
}) => {
  if (zenMode) return null;

  return (
    <aside
      className={`w-68 shrink-0 p-6 flex flex-col justify-between transition-all duration-500 border-r ${
        darkMode
          ? "bg-[#161816]/90 border-stone-800/80 text-stone-200"
          : "bg-[#FAF9F5]/90 border-stone-200/80 text-stone-800"
      } backdrop-blur-md`}
    >
      <div className="flex flex-col min-h-0 flex-1">
        <BrandHeader darkMode={darkMode} />

        <div className="flex items-center justify-between px-1 mb-2.5">
          <span
            className={`text-[10px] uppercase tracking-[0.22em] font-medium ${
              darkMode ? "text-stone-400" : "text-stone-500"
            }`}
          >
            Your Projects
          </span>
          <span
            className={`font-mono-zen text-[10px] ${
              darkMode ? "text-stone-500" : "text-stone-400"
            }`}
          >
            {projects.length} active
          </span>
        </div>

        <nav className="space-y-1.5 overflow-y-auto pr-1 flex-1">
          {projects.map((project) => (
            <SidebarNavItem
              key={project.id}
              project={project}
              isActive={project.id === activeProjectId}
              darkMode={darkMode}
              canDelete={projects.length > 1}
              onSelect={() => onSelectProject(project.id)}
              onDelete={() => onDeleteProject(project.id)}
            />
          ))}
        </nav>

        <NewProjectForm
          darkMode={darkMode}
          onCreateProject={onCreateProject}
        />
      </div>

      <SidebarFooter
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onToggleZenMode={onToggleZenMode}
      />
    </aside>
  );
};
