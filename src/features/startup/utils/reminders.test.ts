import { describe, expect, it } from "vitest";
import { ProjectCountdown } from "../types";
import {
  evaluateProjectReminders,
  getThresholdForRemainingMs,
  HOUR_MS,
} from "./reminders";

describe("reminders utility (24h, 12h, and 1h notifications)", () => {
  it("correctly classifies remaining time into 24h, 12h, 1h, or null thresholds", () => {
    expect(getThresholdForRemainingMs(30 * HOUR_MS)).toBeNull();
    expect(getThresholdForRemainingMs(24 * HOUR_MS)).toBe("24h");
    expect(getThresholdForRemainingMs(18 * HOUR_MS)).toBe("24h");
    expect(getThresholdForRemainingMs(12 * HOUR_MS)).toBe("12h");
    expect(getThresholdForRemainingMs(6 * HOUR_MS)).toBe("12h");
    expect(getThresholdForRemainingMs(1 * HOUR_MS)).toBe("1h");
    expect(getThresholdForRemainingMs(0.5 * HOUR_MS)).toBe("1h");
    expect(getThresholdForRemainingMs(0)).toBeNull();
    expect(getThresholdForRemainingMs(-1000)).toBeNull();
  });

  it("emits 24h, 12h, and 1h reminders for main task and incomplete subtasks without duplicates", () => {
    const now = new Date("2026-11-10T12:00:00Z").getTime();

    const project: ProjectCountdown = {
      id: "proj-1",
      title: "Launch Mission",
      mantra: "Focus",
      targetIso: new Date(now + 20 * HOUR_MS).toISOString(), // 20h left -> 24h reminder
      atmosphere: "stone",
      remindersEnabled: true,
      tasks: [
        {
          id: "t-12h",
          title: "Design Review",
          deadlineIso: new Date(now + 10 * HOUR_MS).toISOString(), // 10h left -> 12h reminder
          completed: false,
        },
        {
          id: "t-1h",
          title: "Final Check",
          deadlineIso: new Date(now + 0.5 * HOUR_MS).toISOString(), // 30m left -> 1h reminder
          completed: false,
        },
        {
          id: "t-done",
          title: "Completed Subtask",
          deadlineIso: new Date(now + 0.5 * HOUR_MS).toISOString(),
          completed: true,
        },
      ],
    };

    const firstPass = evaluateProjectReminders([project], new Set(), now);
    expect(firstPass.dueReminders).toHaveLength(3);

    expect(firstPass.dueReminders[0]).toMatchObject({
      itemType: "main",
      itemTitle: "Launch Mission",
      threshold: "24h",
    });
    expect(firstPass.dueReminders[1]).toMatchObject({
      itemType: "subtask",
      itemTitle: "Design Review",
      threshold: "12h",
    });
    expect(firstPass.dueReminders[2]).toMatchObject({
      itemType: "subtask",
      itemTitle: "Final Check",
      threshold: "1h",
    });

    // Second pass with updatedSentKeys should not re-emit the same reminders
    const secondPass = evaluateProjectReminders(
      [project],
      firstPass.updatedSentKeys,
      now + 1000
    );
    expect(secondPass.dueReminders).toHaveLength(0);

    // When 9 hours pass: main task crosses into <= 12h (11h left) and subtask t-12h crosses into <= 1h (1h left)
    const nineHoursLater = now + 9 * HOUR_MS;
    const thirdPass = evaluateProjectReminders(
      [project],
      firstPass.updatedSentKeys,
      nineHoursLater
    );
    expect(thirdPass.dueReminders).toHaveLength(2);
    expect(thirdPass.dueReminders[0]).toMatchObject({
      itemType: "main",
      itemTitle: "Launch Mission",
      threshold: "12h",
    });
    expect(thirdPass.dueReminders[1]).toMatchObject({
      itemType: "subtask",
      itemTitle: "Design Review",
      threshold: "1h",
    });
  });

  it("skips projects where remindersEnabled is false", () => {
    const now = Date.now();
    const project: ProjectCountdown = {
      id: "proj-disabled",
      title: "Muted Project",
      mantra: "Quiet",
      targetIso: new Date(now + 30 * 60 * 1000).toISOString(),
      atmosphere: "stone",
      remindersEnabled: false,
      tasks: [],
    };

    const result = evaluateProjectReminders([project], new Set(), now);
    expect(result.dueReminders).toHaveLength(0);
  });
});
