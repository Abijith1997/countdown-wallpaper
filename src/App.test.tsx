import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App full integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with no default projects and shows 'Start a project to get started'", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Start a project to get started" })
    ).toBeInTheDocument();
    expect(screen.getByText("No countdowns yet.")).toBeInTheDocument();
  });

  it("creates a project from the welcome form and hides subtasks by default unless opted in", () => {
    render(<App />);

    const nameInput = screen.getByPlaceholderText(
      "e.g., Product Launch, Thesis Submission..."
    );
    fireEvent.change(nameInput, { target: { value: "Handshake Mission" } });
    fireEvent.click(screen.getByText("Start Project Countdown"));

    expect(
      screen.getByRole("heading", { name: "Handshake Mission" })
    ).toBeInTheDocument();

    // Subtasks section is hidden by default
    expect(
      screen.queryByText("Mindful Milestones & Deadlines")
    ).not.toBeInTheDocument();

    // User can opt to display subtasks via the Subtasks toggle button
    fireEvent.click(screen.getByText("Subtasks"));
    expect(
      screen.getByText("Mindful Milestones & Deadlines")
    ).toBeInTheDocument();
  });

  it("allows deleting all project countdowns and returns to the 'Start a project to get started' screen", () => {
    render(<App />);

    const nameInput = screen.getByPlaceholderText(
      "e.g., Product Launch, Thesis Submission..."
    );
    fireEvent.change(nameInput, { target: { value: "Solo Project" } });
    fireEvent.click(screen.getByText("Start Project Countdown"));

    expect(
      screen.getByRole("heading", { name: "Solo Project" })
    ).toBeInTheDocument();

    // Delete the only project in the sidebar
    fireEvent.click(screen.getByTitle("Delete project countdown"));

    expect(
      screen.getByRole("heading", { name: "Start a project to get started" })
    ).toBeInTheDocument();
  });

  it("toggles inline Edit mode to edit project heading and colors in-place", () => {
    render(<App />);

    const nameInput = screen.getByPlaceholderText(
      "e.g., Product Launch, Thesis Submission..."
    );
    fireEvent.change(nameInput, { target: { value: "Initial Project" } });
    fireEvent.click(screen.getByText("Start Project Countdown"));

    fireEvent.click(screen.getByText("Edit"));
    const headingInput = screen.getByDisplayValue("Initial Project");
    fireEvent.change(headingInput, {
      target: { value: "My Custom Zen Deadline" },
    });
    fireEvent.click(screen.getByTitle("Text: Champagne"));
    fireEvent.click(screen.getByText("Done"));

    const heading = screen.getByRole("heading", {
      name: "My Custom Zen Deadline",
    });
    expect(heading).toHaveStyle({ color: "#FDE68A" });
  });
});
