import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TaskChecklist } from "./TaskChecklist";
import { ZenTask } from "../types";

const sampleTasks: ZenTask[] = [
  {
    id: "t1",
    title: "Design Zen UI",
    deadlineIso: "2026-11-10T18:00",
    completed: true,
  },
  {
    id: "t2",
    title: "Write unit tests",
    deadlineIso: "2026-11-20T18:00",
    completed: false,
  },
];

describe("TaskChecklist", () => {
  it("renders tasks with interactive checkboxes and hides edit inputs when isEditing is false", () => {
    const onToggleTask = vi.fn();
    render(
      <TaskChecklist
        tasks={sampleTasks}
        useLightText={false}
        isEditing={false}
        onAddTask={vi.fn()}
        onToggleTask={onToggleTask}
        onUpdateTaskTitle={vi.fn()}
        onUpdateTaskDeadline={vi.fn()}
        onFocusTaskAsMain={vi.fn()}
        onDeleteTask={vi.fn()}
      />
    );

    expect(screen.getByText("1/2 done")).toBeInTheDocument();
    expect(screen.getByText("Design Zen UI")).toBeInTheDocument();
    expect(screen.getByText("Write unit tests")).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("Add a new task or milestone...")
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Write unit tests"));
    expect(onToggleTask).toHaveBeenCalledWith("t2");
  });

  it("shows inline title & ZenDateTimePicker inputs and Add Task form when isEditing is true", () => {
    const onAddTask = vi.fn();
    const onUpdateTaskTitle = vi.fn();
    const onUpdateTaskDeadline = vi.fn();

    render(
      <TaskChecklist
        tasks={sampleTasks}
        useLightText={false}
        isEditing={true}
        onAddTask={onAddTask}
        onToggleTask={vi.fn()}
        onUpdateTaskTitle={onUpdateTaskTitle}
        onUpdateTaskDeadline={onUpdateTaskDeadline}
        onFocusTaskAsMain={vi.fn()}
        onDeleteTask={vi.fn()}
      />
    );

    // Inline title edit
    const taskTitleInput = screen.getByDisplayValue("Write unit tests");
    fireEvent.change(taskTitleInput, {
      target: { value: "Write comprehensive tests" },
    });
    expect(onUpdateTaskTitle).toHaveBeenCalledWith(
      "t2",
      "Write comprehensive tests"
    );

    // Inline ZenDateTimePicker right where the deadline badge was
    fireEvent.click(screen.getByLabelText("Deadline for Write unit tests"));
    fireEvent.click(screen.getByRole("button", { name: "25" }));
    expect(onUpdateTaskDeadline).toHaveBeenCalledWith(
      "t2",
      "2026-11-25T18:00"
    );

    // Add new task form
    const newInput = screen.getByPlaceholderText(
      "Add a new task or milestone..."
    );
    fireEvent.change(newInput, { target: { value: "Record demo video" } });
    fireEvent.click(screen.getByText("+ Add Task"));
    expect(onAddTask).toHaveBeenCalledTimes(1);
    expect(onAddTask.mock.calls[0][0]).toBe("Record demo video");
  });
});
