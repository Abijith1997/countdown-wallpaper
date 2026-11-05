# Kanso (簡素) — Zen Countdown Sanctuary

**Kanso** is a minimalist macOS live countdown wallpaper and lock screen sanctuary built with **Tauri v2**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Inspired by the Japanese Wabi-Sabi aesthetic of *Kanso* (simplicity and elimination of clutter), it turns your most important deadlines and milestones into a calm, living desktop and lock screen experience.

---

## ✨ Key Features

- **Live Interactive Desktop & Lock Screen Wallpaper**:
  - Pins a live, 1-second ticking countdown directly to the macOS desktop layer (`kCGDesktopWindowLevel + 1`) **behind** your desktop icons and widgets, while continuously syncing with the macOS Lock Screen via native `NSWorkspace` (`objc2`).
  - Switch between **Main Wallpaper** (full sanctuary with quote, mantra, countdown, and optional milestones) and **Lock Screen** (minimal heading + 4-unit timer).
  - When multiple project countdowns exist, cycle between them directly on the live wallpaper using the heading chevrons (`‹ / ›`) or horizontal swipe.
- **4 Architectural Layouts**:
  - **Centered**: Classic balanced vertical sanctuary stack.
  - **Split**: Editorial two-column layout pairing the countdown hero with your milestones or a 2×2 timer grid.
  - **Minimal**: Frameless architectural numerals separated by delicate hairline dividers.
  - **Horizon**: Wide panoramic dock bar anchored to the lower third of the screen.
- **10 Curated Zen Shades & Gradients + Custom Photography**:
  - Choose from **Warm Stone**, **Forest Moss**, **Morning Mist**, **Sand Dune**, **Sakura Dawn**, **Uji Matcha**, **Kyoto Twilight**, **Ember Dusk**, **Deep Sea**, and **Obsidian Ink**—each with distinct **Light Stone (`☀`)** and **Obsidian (`☾`)** palettes and automatically harmonized, contrast-checked **Text** and **Accent** colors.
  - Upload or drag-and-drop custom background photography with adjustable **Dim** and **Blur** controls, plus custom color pickers.
- **Optional Subtasks & Mindful Milestones**:
  - Toggle the scrollable milestones checklist on or off per project (`☑ / ☐ Subtasks`).
  - Feature any subtask on the main hero countdown with a single click (`◎`).
- **SmartZen Date & Time Picker**:
  - Viewport-aware portal calendar that automatically opens above or below based on screen space.
  - Optional **"Include specific time"** toggle (defaults to `23:59` of the previous day when time is omitted).
- **24h, 12h & 1h Deadline Reminders (Optional)**:
  - Sends native macOS system notifications and in-app Zen reminder banners at **24 hours**, **12 hours**, and **1 hour** before each main countdown or incomplete subtask ends.
- **Swipeable Mindfulness Quotes**:
  - Cycle through 14 curated short breathing and focus prompts via swipe, scroll wheel, or arrow buttons.

---

## 🛠 Tech Stack

- **Desktop Runtime**: [Tauri v2](https://v2.tauri.app/) (Rust + macOS `objc2` `AppKit` / `NSWindow` / `NSWorkspace` integration)
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4 + Google Fonts (`Cormorant Garamond`, `Inter`, `JetBrains Mono`)
- **Testing**: Vitest + React Testing Library (38 unit & integration tests) + Rust `cargo test`

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Rust & Cargo** (`rustup`)
- **macOS** (Xcode Command Line Tools installed)

### Installation & Development

```bash
# Install dependencies
npm install

# Run in browser development mode
npm run dev

# Run native macOS Tauri desktop app in development mode
npm run tauri dev
```

### Running Tests

```bash
# Run TypeScript & React unit tests (Vitest)
npm test

# Run Rust backend unit tests
cd src-tauri && cargo test
```

### Building the macOS Application (`.app` & `.dmg`)

```bash
npm run tauri build
```

Built artifacts are output to:
- `src-tauri/target/release/bundle/macos/Kanso.app`
- `src-tauri/target/release/bundle/dmg/Kanso_0.1.0_aarch64.dmg`

> **Note on Sharing Unsigned macOS Builds**:
> When opening the `.dmg` on another Mac without an Apple Developer ID signature, macOS Gatekeeper may show *"Kanso cannot be opened"*. To open it:
> 1. Move **Kanso.app** to `/Applications`, then run:
>    ```bash
>    xattr -cr /Applications/Kanso.app
>    ```
> 2. Or go to **System Settings → Privacy & Security**, scroll down, and click **Open Anyway**.

---

## 📂 Project Structure

```text
countdown-wallpaper/
├── public/
│   └── still-icon.svg               # Custom Zen Enso & Hourglass vector icon
├── src/
│   ├── features/
│   │   ├── sidebar/                 # Project switcher sidebar & creation form
│   │   │   ├── components/
│   │   │   │   ├── BrandHeader.tsx
│   │   │   │   ├── NewProjectForm.tsx
│   │   │   │   ├── SidebarFooter.tsx
│   │   │   │   └── SidebarNavItem.tsx
│   │   │   ├── index.tsx
│   │   │   └── types.ts
│   │   └── startup/                 # Main wallpaper & lock screen sanctuary
│   │       ├── components/
│   │       │   ├── ColorSelector.tsx
│   │       │   ├── CountdownHero.tsx
│   │       │   ├── EmptyProjectState.tsx
│   │       │   ├── LayoutSelector.tsx
│   │       │   ├── ReminderBanner.tsx
│   │       │   ├── TaskChecklist.tsx
│   │       │   ├── TaskItem.tsx
│   │       │   ├── TopHeaderBar.tsx
│   │       │   ├── WallpaperBackdrop.tsx
│   │       │   ├── WallpaperControls.tsx
│   │       │   └── ZenDateTimePicker.tsx
│   │       ├── utils/
│   │       │   ├── reminders.ts     # 24h / 12h / 1h notification engine
│   │       │   ├── time.ts          # Countdown math & formatting utilities
│   │       │   └── wallpaperExport.ts
│   │       ├── constants.ts         # 10 gradient presets, layouts & quotes
│   │       ├── index.tsx
│   │       └── types.ts
│   ├── App.tsx
│   └── main.tsx
└── src-tauri/
    └── src/
        └── lib.rs                   # macOS NSWindow desktop layer & NSWorkspace bridge
```
