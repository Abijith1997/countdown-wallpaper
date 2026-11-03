import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ColorSelector } from "./ColorSelector";

describe("ColorSelector", () => {
  it("allows picking preset swatches and custom colors for Text and Accent", () => {
    const onChangeTextColor = vi.fn();
    const onChangeAccentColor = vi.fn();

    render(
      <ColorSelector
        textColor={null}
        accentColor={null}
        useLightText={false}
        onChangeTextColor={onChangeTextColor}
        onChangeAccentColor={onChangeAccentColor}
      />
    );

    fireEvent.click(screen.getByTitle("Text: Champagne"));
    expect(onChangeTextColor).toHaveBeenCalledWith("#FDE68A");

    fireEvent.click(screen.getByTitle("Accent: Kyoto Indigo"));
    expect(onChangeAccentColor).toHaveBeenCalledWith("#818CF8");

    fireEvent.change(screen.getByLabelText("Custom Text Color"), {
      target: { value: "#ff0000" },
    });
    expect(onChangeTextColor).toHaveBeenCalledWith("#ff0000");

    fireEvent.change(screen.getByLabelText("Custom Accent Color"), {
      target: { value: "#00ff00" },
    });
    expect(onChangeAccentColor).toHaveBeenCalledWith("#00ff00");
  });

  it("shows Reset Colors button when custom colors are active and resets both to null", () => {
    const onChangeTextColor = vi.fn();
    const onChangeAccentColor = vi.fn();

    render(
      <ColorSelector
        textColor="#FDE68A"
        accentColor="#818CF8"
        useLightText={false}
        onChangeTextColor={onChangeTextColor}
        onChangeAccentColor={onChangeAccentColor}
      />
    );

    fireEvent.click(screen.getByText("Reset Colors"));
    expect(onChangeTextColor).toHaveBeenCalledWith(null);
    expect(onChangeAccentColor).toHaveBeenCalledWith(null);
  });
});

