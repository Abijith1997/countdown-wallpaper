import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  calculateTimeLeft,
  formatTaskCountdown,
  padNumber,
} from "./time";

describe("time utilities", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-03T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("padNumber", () => {
    it("pads single-digit numbers with a leading zero", () => {
      expect(padNumber(0)).toBe("00");
      expect(padNumber(5)).toBe("05");
      expect(padNumber(9)).toBe("09");
    });

    it("leaves two-digit or larger numbers unchanged", () => {
      expect(padNumber(10)).toBe("10");
      expect(padNumber(42)).toBe("42");
      expect(padNumber(120)).toBe("120");
    });
  });

  describe("calculateTimeLeft", () => {
    it("calculates days, hours, minutes, and seconds accurately", () => {
      // 2 days, 3 hours, 15 minutes, 30 seconds ahead
      const target = new Date(
        new Date("2026-11-03T12:00:00Z").getTime() +
          ((2 * 24 + 3) * 3600 + 15 * 60 + 30) * 1000
      ).toISOString();

      const res = calculateTimeLeft(target);
      expect(res.days).toBe(2);
      expect(res.hours).toBe(3);
      expect(res.minutes).toBe(15);
      expect(res.seconds).toBe(30);
      expect(res.totalMs).toBeGreaterThan(0);
    });

    it("clamps past dates to zero", () => {
      const res = calculateTimeLeft("2020-01-01T00:00:00Z");
      expect(res).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMs: 0,
      });
    });

    it("handles invalid date strings gracefully", () => {
      const res = calculateTimeLeft("not-a-valid-date");
      expect(res.days).toBe(0);
      expect(res.totalMs).toBe(0);
    });
  });

  describe("formatTaskCountdown", () => {
    it("returns Completed when task is marked completed", () => {
      expect(formatTaskCountdown("2026-11-10T12:00:00Z", true)).toEqual({
        label: "Completed",
        isUrgent: false,
        isOverdue: false,
      });
    });

    it("returns Past deadline when deadline is in the past", () => {
      expect(formatTaskCountdown("2026-11-01T12:00:00Z", false)).toEqual({
        label: "Past deadline",
        isUrgent: false,
        isOverdue: true,
      });
    });

    it("formats multi-day deadlines and marks >= 2 days as non-urgent", () => {
      const res = formatTaskCountdown("2026-11-08T15:30:00Z", false);
      expect(res.label).toBe("5d 3h 30m left");
      expect(res.isUrgent).toBe(false);
      expect(res.isOverdue).toBe(false);
    });

    it("formats hours/minutes/seconds when less than 1 day remains", () => {
      const res = formatTaskCountdown("2026-11-03T16:20:10Z", false);
      expect(res.label).toBe("4h 20m 10s left");
      expect(res.isUrgent).toBe(true);
      expect(res.isOverdue).toBe(false);
    });
  });
});

