import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SideBar } from "./index";
import { ProjectCountdown } from "./types";

const mockProjects: ProjectCountdown[] = [
  {
    id: "p1",
    title: "Handshake Mission",
    mantra: "Stay calm",
    targetIso: "2026-11-23T23:59",
    atmosphere: "stone",
    tasks: [
      { id: "t1", title: "Task 1", deadlineIso: "2026-11-10T12:00", completed: true },
      { id: "t2", title: "Task 2", deadlineIso: "2026-11-12T12:00", completed: false },
    ],
  },
  {
    id: "p2",
    title: "Portfolio Launch",
    mantra: "Keep it simple",
    targetIso: "2026-12-01T18:00",
    atmosphere: "moss",
    tasks: [],
  },
];

describe("SideBar", () => {
  it("renders configured projects and their task progress", () => {
    render(
      <SideBar
        projects={mockProjects}
        activeProjectId="p1"
        onSelectProject={vi.fn()}
        onCreateProject={vi.fn()}
        onDeleteProject={vi.fn()}
      />
    );

    expect(screen.getByText("Handshake Mission")).toBeInTheDocument();
    expect(screen.getByText("1/2 tasks")).toBeInTheDocument();
    expect(screen.getByText("Portfolio Launch")).toBeInTheDocument();
    expect(screen.getByText("0/0 tasks")).toBeInTheDocument();
  });

  it("calls onSelectProject when a project item is clicked", () => {
    const onSelectProject = vi.fn();
    render(
      <SideBar
        projects={mockProjects}
        activeProjectId="p1"
        onSelectProject={onSelectProject}
        onCreateProject={vi.fn()}
        onDeleteProject={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("Portfolio Launch"));
    expect(onSelectProject).toHaveBeenCalledWith("p2");
  });

  it("allows creating a new project countdown", () => {
    const onCreateProject = vi.fn();
    render(
      <SideBar
        projects={mockProjects}
        activeProjectId="p1"
        onSelectProject={vi.fn()}
        onCreateProject={onCreateProject}
        onDeleteProject={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("New Project Countdown"));
    const input = screen.getByPlaceholderText("Project name...");
    fireEvent.change(input, { target: { value: "Final Exam Prep" } });
    fireEvent.click(screen.getByText("Create"));

    expect(onCreateProject).toHaveBeenCalledTimes(1);
    expect(onCreateProject.mock.calls[0][0]).toBe("Final Exam Prep");
  });

  it("returns null when zenMode is enabled", () => {
    const { container } = render(
      <SideBar
        projects={mockProjects}
        activeProjectId="p1"
        onSelectProject={vi.fn()}
        onCreateProject={vi.fn()}
        onDeleteProject={vi.fn()}
        zenMode={true}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});

