import { invoke } from "@tauri-apps/api/core";
import { ProjectCountdown } from "../types";

export type ReminderThreshold = "24h" | "12h" | "1h";

export interface ReminderNotification {
  id: string;
  projectId: string;
  projectTitle: string;
  itemId: string;
  itemTitle: string;
  itemType: "main" | "subtask";
  threshold: ReminderThreshold;
  title: string;
  body: string;
  triggeredAt: number;
}

export const HOUR_MS = 3_600_000;
export const THRESHOLD_24H_MS = 24 * HOUR_MS;
export const THRESHOLD_12H_MS = 12 * HOUR_MS;
export const THRESHOLD_1H_MS = 1 * HOUR_MS;

const THRESHOLD_LABELS: Record<ReminderThreshold, string> = {
  "24h": "24 hours",
  "12h": "12 hours",
  "1h": "1 hour",
};

export function getThresholdForRemainingMs(
  remainingMs: number
): ReminderThreshold | null {
  if (!Number.isFinite(remainingMs) || remainingMs <= 0) {
    return null;
  }
  if (remainingMs <= THRESHOLD_1H_MS) {
    return "1h";
  }
  if (remainingMs <= THRESHOLD_12H_MS) {
    return "12h";
  }
  if (remainingMs <= THRESHOLD_24H_MS) {
    return "24h";
  }
  return null;
}

function getSupersededThresholds(
  threshold: ReminderThreshold
): ReminderThreshold[] {
  if (threshold === "1h") return ["24h", "12h", "1h"];
  if (threshold === "12h") return ["24h", "12h"];
  return ["24h"];
}

export function evaluateProjectReminders(
  projects: ProjectCountdown[],
  sentKeys: Set<string>,
  nowMs: number = Date.now()
): {
  dueReminders: ReminderNotification[];
  updatedSentKeys: Set<string>;
} {
  const dueReminders: ReminderNotification[] = [];
  const updatedSentKeys = new Set(sentKeys);

  for (const project of projects) {
    // Reminders are optional per project; enabled by default unless toggled off
    if (project.remindersEnabled === false) continue;

    // 1. Check Main Project Countdown
    const mainTargetMs = new Date(project.targetIso).getTime();
    const mainRemainingMs = mainTargetMs - nowMs;
    const mainThreshold = getThresholdForRemainingMs(mainRemainingMs);

    if (mainThreshold) {
      const mainKey = `${project.id}::main::${project.targetIso}::${mainThreshold}`;
      if (!updatedSentKeys.has(mainKey)) {
        for (const t of getSupersededThresholds(mainThreshold)) {
          updatedSentKeys.add(`${project.id}::main::${project.targetIso}::${t}`);
        }
        const label = THRESHOLD_LABELS[mainThreshold];
        dueReminders.push({
          id: mainKey,
          projectId: project.id,
          projectTitle: project.title,
          itemId: project.id,
          itemTitle: project.title,
          itemType: "main",
          threshold: mainThreshold,
          title: `Kanso Reminder · ${mainThreshold} Remaining`,
          body: `Main countdown "${project.title}" ends in less than ${label}.`,
          triggeredAt: nowMs,
        });
      }
    }

    // 2. Check Subtasks
    for (const task of project.tasks) {
      if (task.completed) continue;
      const taskTargetMs = new Date(task.deadlineIso).getTime();
      const taskRemainingMs = taskTargetMs - nowMs;
      const taskThreshold = getThresholdForRemainingMs(taskRemainingMs);

      if (taskThreshold) {
        const taskKey = `${project.id}::subtask::${task.id}::${task.deadlineIso}::${taskThreshold}`;
        if (!updatedSentKeys.has(taskKey)) {
          for (const t of getSupersededThresholds(taskThreshold)) {
            updatedSentKeys.add(
              `${project.id}::subtask::${task.id}::${task.deadlineIso}::${t}`
            );
          }
          const label = THRESHOLD_LABELS[taskThreshold];
          dueReminders.push({
            id: taskKey,
            projectId: project.id,
            projectTitle: project.title,
            itemId: task.id,
            itemTitle: task.title,
            itemType: "subtask",
            threshold: taskThreshold,
            title: `Kanso Subtask · ${taskThreshold} Remaining`,
            body: `Subtask "${task.title}" (${project.title}) ends in less than ${label}.`,
            triggeredAt: nowMs,
          });
        }
      }
    }
  }

  return { dueReminders, updatedSentKeys };
}

export async function requestNotificationPermissionIfNeeded(): Promise<void> {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "default") {
    try {
      await Notification.requestPermission();
    } catch {
      // ignore permission prompt errors
    }
  }
}

export async function dispatchSystemNotification(
  reminder: ReminderNotification
): Promise<void> {
  const isTauri =
    typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

  if (isTauri) {
    try {
      await invoke("send_native_notification", {
        title: reminder.title,
        body: reminder.body,
      });
      return;
    } catch {
      // Fall back to Web Notification API
    }
  }

  if (
    typeof window !== "undefined" &&
    "Notification" in window &&
    Notification.permission === "granted"
  ) {
    try {
      new Notification(reminder.title, { body: reminder.body });
    } catch {
      // ignore notification constructor errors in headless environments
    }
  }
}
