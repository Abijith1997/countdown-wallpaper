import { invoke } from "@tauri-apps/api/core";
import {
  getAtmospherePreset,
  resolveAccessibleColors,
} from "../constants";
import { ProjectCountdown, TimeLeft, ViewMode, ZenLayout } from "../types";
import { formatTaskCountdown, padNumber } from "./time";

interface ApplyWallpaperOptions {
  project: ProjectCountdown;
  timeLeft: TimeLeft;
  darkMode: boolean;
  viewMode?: ViewMode;
  wallpaperImage: string | null;
  wallpaperDim: number;
  wallpaperBlur: number;
  pinWindow?: boolean;
}

export async function setNativeLiveDesktopMode(enable: boolean): Promise<boolean> {
  const isTauri =
    typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
  if (!isTauri) {
    return false;
  }
  await invoke("set_live_desktop_mode", { enable });
  return true;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function renderAndSetMainWallpaper(
  options: ApplyWallpaperOptions
): Promise<{ mode: "live-desktop" | "desktop" | "download"; message: string }> {
  const {
    project,
    timeLeft,
    darkMode,
    viewMode = "main-wallpaper",
    wallpaperImage,
    wallpaperDim,
    wallpaperBlur,
    pinWindow = true,
  } = options;

  const width = 2560;
  const height = 1440;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const preset = getAtmospherePreset(project.atmosphere);
  const useLightText = Boolean(wallpaperImage) || darkMode;
  const resolved = resolveAccessibleColors(
    project.atmosphere,
    darkMode,
    Boolean(wallpaperImage),
    project.textColor,
    project.accentColor
  );
  const primaryText = resolved.textColor;
  const primaryAccent = resolved.accentColor;
  const layout: ZenLayout = project.layout ?? "centered";
  const isLockScreenOnly = viewMode === "lock-screen";
  const visibleTasks =
    !isLockScreenOnly && project.showSubtasks ? project.tasks.slice(0, 5) : [];

  // 1. Draw Background (Custom Image or Minimal Zen Gradient)
  if (wallpaperImage) {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.crossOrigin = "anonymous";
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = wallpaperImage;
    });

    ctx.save();
    if (wallpaperBlur > 0) {
      ctx.filter = `blur(${wallpaperBlur * 2}px)`;
    }
    const scale = Math.max(width / img.width, height / img.height) * 1.04;
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    ctx.drawImage(img, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
    ctx.restore();

    ctx.fillStyle = `rgba(12, 13, 12, ${wallpaperDim / 100})`;
    ctx.fillRect(0, 0, width, height);
  } else {
    const stops = darkMode ? preset.darkStops : preset.lightStops;
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, stops[0]);
    grad.addColorStop(0.5, stops[1]);
    grad.addColorStop(1, stops[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  const units = [
    { value: padNumber(timeLeft.days), label: "DAYS" },
    { value: padNumber(timeLeft.hours), label: "HOURS" },
    { value: padNumber(timeLeft.minutes), label: "MINUTES" },
    { value: padNumber(timeLeft.seconds), label: "SECONDS" },
  ];

  const cardSurfaceFill = useLightText
    ? "rgba(12, 10, 9, 0.48)"
    : "rgba(255, 255, 255, 0.72)";
  const cardStroke = `${primaryAccent}66`;

  if (layout === "horizon") {
    // Horizon layout: wide dock bar anchored near the lower third
    const dockW = 2040;
    const dockH = 300;
    const dockX = (width - dockW) / 2;
    const dockY = visibleTasks.length > 0 ? 640 : 960;

    drawRoundedRect(ctx, dockX, dockY, dockW, dockH, 40);
    ctx.fillStyle = cardSurfaceFill;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = cardStroke;
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.fillStyle = primaryText;
    ctx.font = '300 72px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(project.title, dockX + 64, dockY + 135);

    if (!isLockScreenOnly) {
      ctx.fillStyle = primaryText;
      ctx.font = 'italic 300 26px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(`“${project.mantra}”`, dockX + 64, dockY + 195);
    }

    const uW = 190;
    const uH = 170;
    const uGap = 24;
    const uStartX = dockX + dockW - (4 * uW + 3 * uGap) - 64;
    const uY = dockY + (dockH - uH) / 2;

    units.forEach((u, idx) => {
      const x = uStartX + idx * (uW + uGap);
      drawRoundedRect(ctx, x, uY, uW, uH, 24);
      ctx.fillStyle = cardSurfaceFill;
      ctx.fill();
      ctx.strokeStyle = cardStroke;
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.fillStyle = primaryText;
      ctx.font = '300 60px "JetBrains Mono", monospace';
      ctx.fillText(u.value, x + uW / 2, uY + 95);

      ctx.fillStyle = primaryAccent;
      ctx.font = '400 14px "Inter", sans-serif';
      ctx.fillText(u.label, x + uW / 2, uY + 135);
    });
  } else if (layout === "split") {
    // Editorial two-column split layout
    const leftX = 240;
    const centerY = 580;

    ctx.textAlign = "left";
    ctx.fillStyle = primaryText;
    ctx.font = '300 80px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(project.title, leftX, centerY - 60);

    if (!isLockScreenOnly) {
      ctx.fillStyle = primaryText;
      ctx.font = 'italic 300 28px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(`“${project.mantra}”`, leftX, centerY);
    }

    const uW = 210;
    const uH = 175;
    const uGap = 24;
    units.forEach((u, idx) => {
      const x =
        visibleTasks.length > 0
          ? leftX + idx * (uW + uGap)
          : 1380 + (idx % 2) * (uW + uGap);
      const y =
        visibleTasks.length > 0
          ? centerY + 60
          : centerY - 140 + Math.floor(idx / 2) * (uH + uGap);

      drawRoundedRect(ctx, x, y, uW, uH, 28);
      ctx.fillStyle = cardSurfaceFill;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = cardStroke;
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.fillStyle = primaryText;
      ctx.font = '300 64px "JetBrains Mono", monospace';
      ctx.fillText(u.value, x + uW / 2, y + 98);

      ctx.fillStyle = primaryAccent;
      ctx.font = '400 14px "Inter", sans-serif';
      ctx.fillText(u.label, x + uW / 2, y + 140);
    });
  } else {
    // Centered or Minimal layout
    const titleY = visibleTasks.length > 0 ? 340 : 480;
    ctx.textAlign = "center";
    ctx.fillStyle = primaryText;
    ctx.font = '300 84px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(project.title, width / 2, titleY);

    if (!isLockScreenOnly) {
      ctx.fillStyle = primaryText;
      ctx.font = 'italic 300 28px "Cormorant Garamond", Georgia, serif';
      ctx.fillText(`“${project.mantra}”`, width / 2, titleY + 60);
    }

    const cardW = 240;
    const cardH = 190;
    const gap = 36;
    const totalW = units.length * cardW + (units.length - 1) * gap;
    const startX = (width - totalW) / 2;
    const cardY = titleY + 130;

    if (layout === "minimal") {
      ctx.strokeStyle = cardStroke;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(startX, cardY);
      ctx.lineTo(startX + totalW, cardY);
      ctx.moveTo(startX, cardY + cardH);
      ctx.lineTo(startX + totalW, cardY + cardH);
      ctx.stroke();

      units.forEach((u, idx) => {
        const x = startX + idx * (cardW + gap);
        if (idx > 0) {
          ctx.beginPath();
          ctx.moveTo(x - gap / 2, cardY + 28);
          ctx.lineTo(x - gap / 2, cardY + cardH - 28);
          ctx.stroke();
        }
        ctx.fillStyle = primaryText;
        ctx.font = '300 84px "JetBrains Mono", monospace';
        ctx.fillText(u.value, x + cardW / 2, cardY + 108);

        ctx.fillStyle = primaryAccent;
        ctx.font = '400 16px "Inter", sans-serif';
        ctx.fillText(u.label, x + cardW / 2, cardY + 154);
      });
    } else {
      units.forEach((u, idx) => {
        const x = startX + idx * (cardW + gap);
        drawRoundedRect(ctx, x, cardY, cardW, cardH, 32);
        ctx.fillStyle = cardSurfaceFill;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = cardStroke;
        ctx.stroke();

        ctx.fillStyle = primaryText;
        ctx.font = '300 76px "JetBrains Mono", monospace';
        ctx.fillText(u.value, x + cardW / 2, cardY + 105);

        ctx.fillStyle = primaryAccent;
        ctx.font = '400 16px "Inter", sans-serif';
        ctx.fillText(u.label, x + cardW / 2, cardY + 150);
      });
    }
  }

  // Draw Tasks Summary Card (Only if subtasks are enabled and not lock-screen)
  if (visibleTasks.length > 0) {
    const boxW = layout === "split" ? 960 : 1068;
    const rowH = 68;
    const boxH = 90 + visibleTasks.length * rowH;
    const boxX = layout === "split" ? 1360 : (width - boxW) / 2;
    const boxY =
      layout === "split"
        ? (height - boxH) / 2
        : layout === "horizon"
          ? 980
          : 720;

    drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 36);
    ctx.fillStyle = cardSurfaceFill;
    ctx.fill();
    ctx.strokeStyle = cardStroke;
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.fillStyle = primaryText;
    ctx.font = '500 18px "Inter", sans-serif';
    ctx.fillText("MINDFUL MILESTONES & DEADLINES", boxX + 44, boxY + 50);

    visibleTasks.forEach((task, i) => {
      const y = boxY + 100 + i * rowH;
      const status = formatTaskCountdown(task.deadlineIso, task.completed);

      ctx.beginPath();
      ctx.arc(boxX + 58, y - 8, 12, 0, Math.PI * 2);
      if (task.completed) {
        ctx.fillStyle = primaryAccent;
        ctx.fill();
      } else {
        ctx.strokeStyle = primaryAccent;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.textAlign = "left";
      ctx.fillStyle = task.completed ? `${primaryText}88` : primaryText;
      ctx.font = '300 24px "Inter", sans-serif';
      ctx.fillText(task.title, boxX + 88, y);

      ctx.textAlign = "right";
      ctx.fillStyle = primaryAccent;
      ctx.font = '300 20px "JetBrains Mono", monospace';
      ctx.fillText(status.label, boxX + boxW - 44, y);
    });
  }

  const dataUrl = canvas.toDataURL("image/png");

  // 1. Try native Tauri command first if inside Tauri window
  const isTauri =
    typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

  if (isTauri) {
    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Blob failed"))),
          "image/png"
        );
      });
      const arrayBuffer = await blob.arrayBuffer();
      const imageBytes = Array.from(new Uint8Array(arrayBuffer));
      await invoke<string>("set_desktop_wallpaper", { imageBytes });
    } catch {
      // ignore static fallback error if live mode succeeds
    }
    if (pinWindow) {
      try {
        await invoke("set_live_desktop_mode", { enable: true });
        return {
          mode: "live-desktop",
          message: "Pinned as your live interactive MacBook wallpaper!",
        };
      } catch {
        // Fall through if old binary
      }
    } else {
      return {
        mode: "live-desktop",
        message: "Updated live desktop wallpaper.",
      };
    }
  }

  // 2. Try Vite dev server macOS bridge (/api/set-wallpaper)
  try {
    const response = await fetch("/api/set-wallpaper", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataUrl }),
    });
    if (response.ok) {
      return {
        mode: "desktop",
        message:
          "Live desktop mode active (run `npm run tauri dev` to pin behind all macOS windows)!",
      };
    }
  } catch {
    // Fall through to browser download
  }

  // 3. Final fallback: download the PNG
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-wallpaper.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return {
    mode: "download",
    message: "Wallpaper PNG downloaded.",
  };
}
