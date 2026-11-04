use std::fs;
use std::path::PathBuf;
use std::process::Command;
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::Manager;

static LIVE_DESKTOP_ACTIVE: AtomicBool = AtomicBool::new(false);

// kCGDesktopWindowLevel (-2147483623) + 1:
// Sits above the macOS wallpaper surface (-2147483623) and BEHIND Finder's desktop icons (-2147483603).
#[cfg(target_os = "macos")]
const MACOS_BEHIND_ICONS_LEVEL: isize = -2147483622;

// kCGDesktopIconWindowLevel (-2147483603) + 1:
// Used temporarily when the user clicks the Kanso Dock icon so they can click Unpin, chevrons, or tasks.
#[cfg(target_os = "macos")]
const MACOS_INTERACTIVE_DESKTOP_LEVEL: isize = -2147483602;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn get_wallpaper_dir() -> PathBuf {
    if let Ok(home) = std::env::var("HOME") {
        let dir = PathBuf::from(home).join("Pictures").join("StillWallpapers");
        if fs::create_dir_all(&dir).is_ok() {
            return dir;
        }
    }
    std::env::temp_dir()
}

fn cleanup_old_wallpapers(dir: &PathBuf, keep_file: &PathBuf) {
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if &path != keep_file {
                if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                    if name.starts_with("still_zen_wallpaper_") && name.ends_with(".png") {
                        let _ = fs::remove_file(path);
                    }
                }
            }
        }
    }
}

#[cfg(target_os = "macos")]
fn apply_macos_window_level(window: &tauri::WebviewWindow, level: isize, desktop_mode: bool) -> Result<(), String> {
    let ns_win_addr = window
        .ns_window()
        .map_err(|e| format!("Failed to get NSWindow: {}", e))? as usize;

    window
        .run_on_main_thread(move || unsafe {
            use objc2::msg_send;
            use objc2::runtime::AnyObject;

            let ns_win = ns_win_addr as *mut AnyObject;
            if !ns_win.is_null() {
                let _: () = msg_send![ns_win, setLevel: level];
                if desktop_mode {
                    let _: () = msg_send![ns_win, setHidesOnDeactivate: false];
                    // CanJoinAllSpaces (1 << 0) | Stationary (1 << 4) | IgnoresCycle (1 << 6) | FullScreenAuxiliary (1 << 8)
                    let behavior: usize = (1 << 0) | (1 << 4) | (1 << 6) | (1 << 8);
                    let _: () = msg_send![ns_win, setCollectionBehavior: behavior];
                    let _: () = msg_send![ns_win, orderFrontRegardless];
                } else {
                    let default_behavior: usize = 0;
                    let _: () = msg_send![ns_win, setCollectionBehavior: default_behavior];
                }
            }
        })
        .map_err(|e| format!("Failed to run on main thread: {}", e))
}

#[tauri::command]
fn set_live_desktop_mode(window: tauri::WebviewWindow, enable: bool) -> Result<(), String> {
    LIVE_DESKTOP_ACTIVE.store(enable, Ordering::SeqCst);

    if enable {
        let _ = window.set_decorations(false);
        let _ = window.set_shadow(false);
        if let Ok(Some(monitor)) = window.current_monitor() {
            let _ = window.set_position(tauri::Position::Physical(*monitor.position()));
            let _ = window.set_size(tauri::Size::Physical(*monitor.size()));
        }
    } else {
        let _ = window.set_decorations(true);
        let _ = window.set_shadow(true);
        let _ = window.set_size(tauri::Size::Logical(tauri::LogicalSize {
            width: 1180.0,
            height: 780.0,
        }));
        let _ = window.center();
    }

    #[cfg(target_os = "macos")]
    {
        if enable {
            apply_macos_window_level(&window, MACOS_BEHIND_ICONS_LEVEL, true)?;
        } else {
            apply_macos_window_level(&window, 0, false)?;
        }
    }

    if !enable {
        let _ = window.set_focus();
    }

    Ok(())
}

#[tauri::command]
fn set_desktop_wallpaper(image_bytes: Vec<u8>) -> Result<String, String> {
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or(0);

    let dir = get_wallpaper_dir();
    let file_path = dir.join(format!("still_zen_wallpaper_{}.png", timestamp));

    fs::write(&file_path, &image_bytes)
        .map_err(|e| format!("Failed to write wallpaper image: {}", e))?;

    let path_str = file_path
        .to_str()
        .ok_or_else(|| "Invalid file path encoding".to_string())?;

    #[cfg(target_os = "macos")]
    {
        let escaped = path_str.replace('\\', "\\\\").replace('\"', "\\\"");

        let osa_script = format!(
            "tell application \"System Events\" to tell every desktop to set picture to POSIX file \"{}\"\n\
             try\n\
               tell application \"Finder\" to set desktop picture to POSIX file \"{}\"\n\
             end try",
            escaped, escaped
        );
        let osa_output = Command::new("osascript")
            .arg("-e")
            .arg(&osa_script)
            .output();

        if osa_output.as_ref().map(|o| !o.status.success()).unwrap_or(true) {
            let swift_code = format!(
                "import AppKit\n\
                 let url = URL(fileURLWithPath: \"{}\")\n\
                 for screen in NSScreen.screens {{\n\
                     try? NSWorkspace.shared.setDesktopImageURL(url, for: screen, options: [:])\n\
                 }}",
                escaped
            );
            let swift_out = Command::new("swift")
                .arg("-e")
                .arg(&swift_code)
                .output()
                .map_err(|e| format!("Failed to set macOS wallpaper: {}", e))?;

            if !swift_out.status.success() {
                let err = String::from_utf8_lossy(&swift_out.stderr);
                return Err(format!("macOS wallpaper update failed: {}", err));
            }
        }
    }

    cleanup_old_wallpapers(&dir, &file_path);

    Ok(path_str.to_string())
}

#[tauri::command]
fn send_native_notification(title: String, body: String) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        let escaped_title = title.replace('\\', "\\\\").replace('\"', "\\\"");
        let escaped_body = body.replace('\\', "\\\\").replace('\"', "\\\"");
        let script = format!(
            "display notification \"{}\" with title \"{}\" sound name \"Glass\"",
            escaped_body, escaped_title
        );
        let _ = Command::new("osascript").arg("-e").arg(&script).output();
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .on_window_event(|window, event| {
            #[cfg(target_os = "macos")]
            if let tauri::WindowEvent::Focused(focused) = event {
                if LIVE_DESKTOP_ACTIVE.load(Ordering::SeqCst) && !focused {
                    if let Some(webview_win) = window.app_handle().get_webview_window(window.label()) {
                        let _ = apply_macos_window_level(&webview_win, MACOS_BEHIND_ICONS_LEVEL, true);
                    }
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            set_desktop_wallpaper,
            set_live_desktop_mode,
            send_native_notification
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|app_handle, event| {
        #[cfg(target_os = "macos")]
        if let tauri::RunEvent::Reopen { .. } = event {
            // When the user clicks the Kanso icon in the macOS Dock while pinned as a live wallpaper,
            // temporarily bring it just above desktop icons so they can click Unpin, chevrons, or tasks.
            // Clicking anywhere back on the desktop/Finder lowers it behind desktop icons again.
            if LIVE_DESKTOP_ACTIVE.load(Ordering::SeqCst) {
                if let Some(window) = app_handle.get_webview_window("main") {
                    let _ = apply_macos_window_level(&window, MACOS_INTERACTIVE_DESKTOP_LEVEL, true);
                    let _ = window.set_focus();
                }
            }
        }
    });
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greet_formats_message() {
        assert_eq!(
            greet("Still"),
            "Hello, Still! You've been greeted from Rust!"
        );
    }

    #[test]
    fn test_cleanup_old_wallpapers_removes_stale_files_and_keeps_active() {
        let test_dir = std::env::temp_dir().join("still_wallpaper_test_dir");
        let _ = fs::remove_dir_all(&test_dir);
        fs::create_dir_all(&test_dir).unwrap();

        let old_file = test_dir.join("still_zen_wallpaper_100.png");
        let keep_file = test_dir.join("still_zen_wallpaper_200.png");
        let unrelated_file = test_dir.join("notes.txt");

        fs::write(&old_file, b"old").unwrap();
        fs::write(&keep_file, b"keep").unwrap();
        fs::write(&unrelated_file, b"note").unwrap();

        cleanup_old_wallpapers(&test_dir, &keep_file);

        assert!(!old_file.exists());
        assert!(keep_file.exists());
        assert!(unrelated_file.exists());

        let _ = fs::remove_dir_all(&test_dir);
    }
}
