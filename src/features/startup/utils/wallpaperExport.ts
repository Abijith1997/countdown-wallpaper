import { invoke } from "@tauri-apps/api/core";
import { ProjectCountdown, TimeLeft } from "../types";
import { formatTaskCountdown, padNumber } from "./time";

interface ApplyWallpaperOptions {
  project: ProjectCountdown;
  timeLeft: TimeLeft;
  darkMode: boolean;
  wallpaperImage: string | null;
  wallpaperDim: number;
  wallpaperBlur: number;
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
    wallpaperImage,
    wallpaperDim,
    wallpaperBlur,
  } = options;

  const width = 2560;
  const height = 1440;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const useLightText = Boolean(wallpaperImage) || darkMode;
  const primaryText = project.textColor || (useLightText ? "#F5F5F4" : "#1C1917");
  const primaryAccent =
    project.accentColor || (useLightText ? "#34D399" : "#292524");

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
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (darkMode) {
      if (project.atmosphere === "moss") {
        grad.addColorStop(0, "#131815");
        grad.addColorStop(1, "#101210");
      } else if (project.atmosphere === "mist") {
        grad.addColorStop(0, "#141619");
        grad.addColorStop(1, "#111214");
      } else {
        grad.addColorStop(0, "#161614");
        grad.addColorStop(1, "#10100F");
      }
    } else {
      if (project.atmosphere === "moss") {
        grad.addColorStop(0, "#F3F5F1");
        grad.addColorStop(1, "#EAEEE7");
      } else if (project.atmosphere === "mist") {
        grad.addColorStop(0, "#F2F4F7");
        grad.addColorStop(1, "#EAECEF");
      } else {
        grad.addColorStop(0, "#FAF9F5");
        grad.addColorStop(1, "#EFECE4");
      }
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Draw Project Title & Mantra
  ctx.textAlign = "center";
  ctx.fillStyle = primaryText;
  ctx.font = '300 84px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(project.title, width / 2, 340);

  ctx.fillStyle = project.textColor
    ? project.textColor
    : useLightText
      ? "rgba(214,211,209,0.85)"
      : "rgba(87,83,78,0.9)";
  ctx.font = 'italic 300 28px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(`“${project.mantra}”`, width / 2, 400);

  // 3. Draw 4 Countdown Unit Cards
  const units = [
    { value: padNumber(timeLeft.days), label: "DAYS" },
    { value: padNumber(timeLeft.hours), label: "HOURS" },
    { value: padNumber(timeLeft.minutes), label: "MINUTES" },
    { value: padNumber(timeLeft.seconds), label: "SECONDS" },
  ];

  const cardW = 240;
  const cardH = 190;
  const gap = 36;
  const totalW = units.length * cardW + (units.length - 1) * gap;
  const startX = (width - totalW) / 2;
  const cardY = 470;

  units.forEach((u, idx) => {
    const x = startX + idx * (cardW + gap);
    drawRoundedRect(ctx, x, cardY, cardW, cardH, 32);
    ctx.fillStyle = useLightText
      ? "rgba(12, 10, 9, 0.48)"
      : "rgba(255, 255, 255, 0.72)";
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = project.accentColor
      ? project.accentColor
      : useLightText
        ? "rgba(120, 113, 108, 0.35)"
        : "rgba(214, 211, 209, 0.85)";
    ctx.stroke();

    ctx.fillStyle = primaryText;
    ctx.font = '300 76px "JetBrains Mono", monospace';
    ctx.fillText(u.value, x + cardW / 2, cardY + 105);

    ctx.fillStyle = project.accentColor || (useLightText ? "#A8A29E" : "#78716C");
    ctx.font = '400 16px "Inter", sans-serif';
    ctx.fillText(u.label, x + cardW / 2, cardY + 150);
  });

  // 4. Draw Tasks Summary Card
  const visibleTasks = project.tasks.slice(0, 5);
  if (visibleTasks.length > 0) {
    const boxW = 1068;
    const rowH = 68;
    const boxH = 90 + visibleTasks.length * rowH;
    const boxX = (width - boxW) / 2;
    const boxY = 720;

    drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 36);
    ctx.fillStyle = useLightText
      ? "rgba(12, 10, 9, 0.52)"
      : "rgba(255, 255, 255, 0.72)";
    ctx.fill();
    ctx.strokeStyle = project.accentColor
      ? project.accentColor
      : useLightText
        ? "rgba(120, 113, 108, 0.35)"
        : "rgba(214, 211, 209, 0.85)";
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
        ctx.strokeStyle = project.accentColor || (useLightText ? "#78716C" : "#A8A29E");
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.textAlign = "left";
      ctx.fillStyle = task.completed
        ? useLightText
          ? "rgba(168,162,158,0.55)"
          : "rgba(120,113,108,0.55)"
        : primaryText;
      ctx.font = '300 24px "Inter", sans-serif';
      ctx.fillText(task.title, boxX + 88, y);

      ctx.textAlign = "right";
      ctx.fillStyle = project.accentColor || (useLightText ? "#A8A29E" : "#57534E");
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
    try {
      await invoke("set_live_desktop_mode", { enable: true });
      return {
        mode: "live-desktop",
        message: "Pinned as your live interactive MacBook wallpaper!",
      };
    } catch {
      // Fall through if old binary
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
