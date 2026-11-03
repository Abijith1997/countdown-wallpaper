import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TopHeaderBar } from "./TopHeaderBar";

const defaultProps = {
  viewMode: "main-wallpaper" as const,
  onChangeViewMode: vi.fn(),
  isEditing: false,
  onToggleEdit: vi.fn(),
  useLightText: false,
  hasCustomWallpaper: false,
  atmosphere: "stone" as const,
  zenMode: false,
  liveDesktopMode: false,
  isApplyingWallpaper: false,
  wallpaperStatus: null,
  onSelectAtmosphere: vi.fn(),
  onTriggerUpload: vi.fn(),
  onClearWallpaper: vi.fn(),
  onSetMainWallpaper: vi.fn(),
  onExitLiveWallpaper: vi.fn(),
};

describe("TopHeaderBar", () => {
  it("renders view switcher, Edit button, and Set as Live Wallpaper button", () => {
    render(<TopHeaderBar {...defaultProps} />);

    expect(screen.getByText("Main Wallpaper")).toBeInTheDocument();
    expect(screen.getByText("Lock Screen")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Set as Live Wallpaper")).toBeInTheDocument();
    // Image & theme options hidden when not editing
    expect(screen.queryByText("Add Image")).not.toBeInTheDocument();
  });

  it("shows image and atmosphere options only when isEditing is true", () => {
    render(<TopHeaderBar {...defaultProps} isEditing={true} />);

    expect(screen.getByText("Done")).toBeInTheDocument();
    expect(screen.getByText("Add Image")).toBeInTheDocument();
    expect(screen.getByText("stone")).toBeInTheDocument();
    expect(screen.getByText("moss")).toBeInTheDocument();
    expect(screen.getByText("mist")).toBeInTheDocument();
  });

  it("renders ONLY the Unpin button when liveDesktopMode is active", () => {
    const onExitLiveWallpaper = vi.fn();
    render(
      <TopHeaderBar
        {...defaultProps}
        liveDesktopMode={true}
        onExitLiveWallpaper={onExitLiveWallpaper}
      />
    );

    expect(screen.getByText("Unpin")).toBeInTheDocument();
    expect(screen.queryByText("Main Wallpaper")).not.toBeInTheDocument();
    expect(screen.queryByText("Lock Screen")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Unpin"));
    expect(onExitLiveWallpaper).toHaveBeenCalledTimes(1);
  });
});

