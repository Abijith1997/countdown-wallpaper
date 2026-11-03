import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
// @ts-expect-error type error without @types/node package
import process from "node:process";
// @ts-expect-error type error without @types/node package
import fs from "node:fs";
// @ts-expect-error type error without @types/node package
import path from "node:path";
// @ts-expect-error type error without @types/node package
import os from "node:os";
// @ts-expect-error type error without @types/node package
import { execFile } from "node:child_process";
import tailwindcss from "@tailwindcss/vite";

const host = process.env.TAURI_DEV_HOST;

interface NodeRequest {
  method?: string;
  on(event: "data", listener: (chunk: Uint8Array) => void): void;
  on(event: "end", listener: () => void): void;
}

interface NodeResponse {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(data?: string): void;
}

function macosWallpaperDevPlugin(): Plugin {
  return {
    name: "macos-wallpaper-dev-plugin",
    configureServer(server) {
      server.middlewares.use(
        "/api/set-wallpaper",
        (rawReq: unknown, rawRes: unknown) => {
          const req = rawReq as NodeRequest;
          const res = rawRes as NodeResponse;

          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: "Method not allowed" }));
            return;
          }

          const chunks: Uint8Array[] = [];
          req.on("data", (chunk: Uint8Array) => chunks.push(chunk));
          req.on("end", () => {
            try {
              // @ts-expect-error Buffer is available in Node runtime
              const body = Buffer.concat(chunks).toString("utf8");
              const { dataUrl } = JSON.parse(body) as { dataUrl: string };
              const base64Data = dataUrl.replace(
                /^data:image\/\w+;base64,/,
                ""
              );
              // @ts-expect-error Buffer is available in Node runtime
              const imgBuffer = Buffer.from(base64Data, "base64");

              const dir = path.join(
                os.homedir(),
                "Pictures",
                "StillWallpapers"
              );
              fs.mkdirSync(dir, { recursive: true });

              const filename = `still_zen_wallpaper_${Date.now()}.png`;
              const filePath = path.join(dir, filename);
              fs.writeFileSync(filePath, imgBuffer);

              // Clean up previous generated files
              for (const entry of fs.readdirSync(dir)) {
                if (
                  entry !== filename &&
                  entry.startsWith("still_zen_wallpaper_") &&
                  entry.endsWith(".png")
                ) {
                  try {
                    fs.unlinkSync(path.join(dir, entry));
                  } catch {
                    // ignore
                  }
                }
              }

              const escaped = filePath
                .replace(/\\/g, "\\\\")
                .replace(/"/g, '\\"');
              const appleScript = `
              tell application "System Events"
                tell every desktop
                  set picture to POSIX file "${escaped}"
                end tell
              end tell
              try
                tell application "Finder" to set desktop picture to POSIX file "${escaped}"
              end try
            `;

              execFile("osascript", ["-e", appleScript], (err: unknown) => {
                if (!err) {
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ ok: true, path: filePath }));
                  return;
                }

                // Fallback to AppKit NSWorkspace via swift
                const swiftScript = `
                import AppKit
                let url = URL(fileURLWithPath: "${escaped}")
                for screen in NSScreen.screens {
                  try? NSWorkspace.shared.setDesktopImageURL(url, for: screen, options: [:])
                }
              `;
                execFile("swift", ["-e", swiftScript], (swiftErr: unknown) => {
                  if (swiftErr) {
                    res.statusCode = 500;
                    res.setHeader("Content-Type", "application/json");
                    res.end(
                      JSON.stringify({
                        error: String(swiftErr || err),
                      })
                    );
                  } else {
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ ok: true, path: filePath }));
                  }
                });
              });
            } catch (e) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: String(e) }));
            }
          });
        }
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [react(), tailwindcss(), macosWallpaperDevPlugin()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
