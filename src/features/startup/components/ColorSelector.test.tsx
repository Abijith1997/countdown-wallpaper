import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  getAtmosphereSurface,
  resolveAccessibleColors,
} from "../constants";
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

  it("renders layout options and wallpaper shades/gradients when handlers are provided", () => {
    const onSelectLayout = vi.fn();
    const onSelectAtmosphere = vi.fn();

    render(
      <ColorSelector
        textColor={null}
        accentColor={null}
        useLightText={false}
        atmosphere="stone"
        layout="centered"
        onChangeTextColor={vi.fn()}
        onChangeAccentColor={vi.fn()}
        onSelectLayout={onSelectLayout}
        onSelectAtmosphere={onSelectAtmosphere}
      />
    );

    fireEvent.click(screen.getByText("Split"));
    expect(onSelectLayout).toHaveBeenCalledWith("split");

    fireEvent.click(screen.getByText("Minimal"));
    expect(onSelectLayout).toHaveBeenCalledWith("minimal");

    fireEvent.click(screen.getByText("Horizon"));
    expect(onSelectLayout).toHaveBeenCalledWith("horizon");

    fireEvent.click(screen.getByText("Kyoto Twilight"));
    expect(onSelectAtmosphere).toHaveBeenCalledWith("twilight");

    fireEvent.click(screen.getByText("Sakura Dawn"));
    expect(onSelectAtmosphere).toHaveBeenCalledWith("sakura");
  });

  it("adapts inner surface, text color, and accent color for accessibility when toggling Light and Dark themes", () => {
    const lightTwilight = getAtmosphereSurface("twilight", false);
    const darkTwilight = getAtmosphereSurface("twilight", true);
    expect(lightTwilight).not.toEqual(darkTwilight);

    // Light mode defaults for twilight
    const lightColors = resolveAccessibleColors("twilight", false, false);
    expect(lightColors.textColor).toBe("#1E1B4B");
    expect(lightColors.accentColor).toBe("#4F46E5");

    // Dark mode defaults for twilight
    const darkColors = resolveAccessibleColors("twilight", true, false);
    expect(darkColors.textColor).toBe("#E0E7FF");
    expect(darkColors.accentColor).toBe("#818CF8");

    // If a dark ink color (#1C1917) was saved in Light mode, switching to Dark mode automatically replaces it with an accessible light color
    const guardedDark = resolveAccessibleColors(
      "stone",
      true,
      false,
      "#1C1917",
      "#1C1917"
    );
    expect(guardedDark.textColor).toBe("#F5F5F4");
    expect(guardedDark.accentColor).toBe("#D6D3D1");

    // If a near-white color (#F5F5F4) was saved in Dark mode, switching to Light mode automatically replaces it with an accessible dark color
    const guardedLight = resolveAccessibleColors(
      "stone",
      false,
      false,
      "#F5F5F4",
      "#F5F5F4"
    );
    expect(guardedLight.textColor).toBe("#1C1917");
    expect(guardedLight.accentColor).toBe("#57534E");
  });
});
