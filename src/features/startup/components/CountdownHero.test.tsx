import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CountdownHero } from "./CountdownHero";

const baseProps = {
  intentionTitle: "Handshake Mission Deadline",
  mantra: "Craft with calm clarity.",
  targetIso: "2026-11-23T23:59",
  timeLeft: { days: 20, hours: 4, minutes: 15, seconds: 9, totalMs: 100000 },
  useLightText: false,
  isLockScreenOnly: false,
  isEditing: false,
  onChangeTitle: vi.fn(),
  onChangeMantra: vi.fn(),
  onChangeTargetIso: vi.fn(),
};

describe("CountdownHero", () => {
  it("renders heading, mantra, 4 timer units, and formatted target date in Main Wallpaper mode", () => {
    render(<CountdownHero {...baseProps} />);

    expect(screen.getByText("Handshake Mission Deadline")).toBeInTheDocument();
    expect(screen.getByText("“Craft with calm clarity.”")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("09")).toBeInTheDocument();
    expect(screen.getByText(/Target ·/i)).toBeInTheDocument();
  });

  it("renders ONLY the heading and timer when isLockScreenOnly is true", () => {
    render(<CountdownHero {...baseProps} isLockScreenOnly={true} />);

    expect(screen.getByText("Handshake Mission Deadline")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(
      screen.queryByText("“Craft with calm clarity.”")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Breathe in · Be present")
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Target ·/i)).not.toBeInTheDocument();
  });

  it("replaces heading, mantra, and target date with inline inputs and ZenDateTimePicker when isEditing is true", () => {
    const onChangeTitle = vi.fn();
    const onChangeMantra = vi.fn();
    const onChangeTargetIso = vi.fn();

    render(
      <CountdownHero
        {...baseProps}
        isEditing={true}
        onChangeTitle={onChangeTitle}
        onChangeMantra={onChangeMantra}
        onChangeTargetIso={onChangeTargetIso}
      />
    );

    const titleInput = screen.getByDisplayValue("Handshake Mission Deadline");
    fireEvent.change(titleInput, { target: { value: "Updated Heading" } });
    expect(onChangeTitle).toHaveBeenCalledWith("Updated Heading");

    const mantraInput = screen.getByDisplayValue("Craft with calm clarity.");
    fireEvent.change(mantraInput, { target: { value: "New mantra" } });
    expect(onChangeMantra).toHaveBeenCalledWith("New mantra");

    // Open the custom ZenDateTimePicker in place of the target date
    fireEvent.click(screen.getByLabelText("Main project deadline"));
    fireEvent.click(screen.getByRole("button", { name: "15" }));
    expect(onChangeTargetIso).toHaveBeenCalledWith("2026-11-14T23:59");
  });

  it("cycles through motivational breathing quotes when swiped or clicked", () => {
    const onChangeBreathQuote = vi.fn();
    render(
      <CountdownHero
        {...baseProps}
        onChangeBreathQuote={onChangeBreathQuote}
      />
    );

    expect(screen.getByText("Breathe in · Be present")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Next quote"));
    expect(onChangeBreathQuote).toHaveBeenCalledWith("Inhale calm · Exhale rush");
  });
});
