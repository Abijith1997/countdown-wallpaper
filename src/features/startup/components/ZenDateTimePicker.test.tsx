import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ZenDateTimePicker } from "./ZenDateTimePicker";

describe("ZenDateTimePicker", () => {
  it("defaults to 23:59 of the previous day when Include specific time is off", () => {
    const onChange = vi.fn();
    render(
      <ZenDateTimePicker
        value="2026-11-23T23:59"
        onChange={onChange}
        ariaLabel="Test deadline picker"
      />
    );

    // Open popover
    fireEvent.click(screen.getByLabelText("Test deadline picker"));
    expect(
      screen.getByText("Defaults to 23:59 of previous day")
    ).toBeInTheDocument();

    // Pick Nov 20, 2026 -> should emit 2026-11-19T23:59 (23:59 of previous day)
    fireEvent.click(screen.getByRole("button", { name: "20" }));
    expect(onChange).toHaveBeenCalledWith("2026-11-19T23:59");
  });

  it("shows time picker when Include specific time is enabled and emits exact date and time", () => {
    const onChange = vi.fn();
    render(
      <ZenDateTimePicker
        value="2026-11-23T23:59"
        onChange={onChange}
        ariaLabel="Test deadline picker"
      />
    );

    fireEvent.click(screen.getByLabelText("Test deadline picker"));

    // Toggle "Include specific time" on
    fireEvent.click(screen.getByText("Include specific time"));
    expect(screen.getByLabelText("Hour")).toBeInTheDocument();
    expect(screen.getByLabelText("Minute")).toBeInTheDocument();

    // Change Hour to 14 and Minute to 30
    fireEvent.change(screen.getByLabelText("Hour"), { target: { value: "14" } });
    fireEvent.change(screen.getByLabelText("Minute"), {
      target: { value: "30" },
    });

    // Since value was 2026-11-23T23:59 (which represents Nov 24 without time), selectedDate is Nov 24
    expect(onChange).toHaveBeenLastCalledWith("2026-11-24T14:30");
  });

  it("positions popover above when clicked near the bottom of the screen", () => {
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 800,
    });

    render(
      <ZenDateTimePicker
        value="2026-11-23T23:59"
        onChange={vi.fn()}
        ariaLabel="Bottom deadline picker"
      />
    );

    const trigger = screen.getByLabelText("Bottom deadline picker");
    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue({
      top: 720,
      bottom: 750,
      left: 400,
      right: 540,
      width: 140,
      height: 30,
      x: 400,
      y: 720,
      toJSON: () => ({}),
    });

    fireEvent.click(trigger);

    const popover = document.querySelector("[data-placement]");
    expect(popover).toHaveAttribute("data-placement", "above");
  });
});

