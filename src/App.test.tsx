import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App full integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads the default Handshake Mission project and switches projects from the sidebar", () => {
    render(<App />);

    // Default active project
    expect(
      screen.getByRole("heading", { name: "Handshake Mission Deadline" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Submit project to Handshake AI Skills Studio")
    ).toBeInTheDocument();

    // Switch to another configured project in the sidebar
    fireEvent.click(screen.getByText("Portfolio & Case Study v2"));
    expect(
      screen.getByRole("heading", { name: "Portfolio & Case Study v2" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Record interactive demo walkthrough video")
    ).toBeInTheDocument();
  });

  it("shows only heading and timer when switched to Lock Screen mode", () => {
    render(<App />);

    fireEvent.click(screen.getByText("Lock Screen"));

    // Heading & timer remain
    expect(
      screen.getByRole("heading", { name: "Handshake Mission Deadline" })
    ).toBeInTheDocument();
    expect(screen.getByText("Days")).toBeInTheDocument();

    // Tasks checklist and mantra are hidden on Lock Screen
    expect(
      screen.queryByText("Mindful Milestones & Deadlines")
    ).not.toBeInTheDocument();
  });

  it("toggles inline Edit mode to edit project heading and tasks in-place", () => {
    render(<App />);

    // Enter Edit mode
    fireEvent.click(screen.getByText("Edit"));

    // Heading is now an editable input
    const headingInput = screen.getByDisplayValue("Handshake Mission Deadline");
    fireEvent.change(headingInput, {
      target: { value: "My Custom Zen Deadline" },
    });

    // Exit Edit mode
    fireEvent.click(screen.getByText("Done"));

    expect(
      screen.getByRole("heading", { name: "My Custom Zen Deadline" })
    ).toBeInTheDocument();
  });

  it("toggles task completion checkboxes and updates done count", () => {
    render(<App />);

    expect(screen.getByText("2/3 done")).toBeInTheDocument();
    fireEvent.click(
      screen.getByText("Submit project to Handshake AI Skills Studio")
    );
    expect(screen.getByText("3/3 done")).toBeInTheDocument();
  });

  it("updates text and accent colors from the color selector in Edit mode", () => {
    render(<App />);

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByTitle("Text: Champagne"));
    fireEvent.click(screen.getByTitle("Accent: Kyoto Indigo"));
    fireEvent.click(screen.getByText("Done"));

    const heading = screen.getByRole("heading", {
      name: "Handshake Mission Deadline",
    });
    expect(heading).toHaveStyle({ color: "#FDE68A" });
  });
});

