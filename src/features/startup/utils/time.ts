import { TimeLeft } from "../types";

export const padNumber = (n: number): string => String(n).padStart(2, "0");

export function calculateTimeLeft(targetIso: string): TimeLeft {
  const targetMs = new Date(targetIso).getTime();
  const diff = Math.max(0, (isNaN(targetMs) ? Date.now() : targetMs) - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    totalMs: diff,
  };
}

export function formatTaskCountdown(
  deadlineIso: string,
  completed: boolean
): {
  label: string;
  isUrgent: boolean;
  isOverdue: boolean;
} {
  if (completed) {
    return { label: "Completed", isUrgent: false, isOverdue: false };
  }
  const targetMs = new Date(deadlineIso).getTime();
  if (isNaN(targetMs)) {
    return { label: "No date", isUrgent: false, isOverdue: false };
  }
  const diff = targetMs - Date.now();
  if (diff <= 0) {
    return { label: "Past deadline", isUrgent: false, isOverdue: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (days > 0) {
    return {
      label: `${days}d ${hours}h ${minutes}m left`,
      isUrgent: days < 2,
      isOverdue: false,
    };
  }
  if (hours > 0) {
    return {
      label: `${hours}h ${minutes}m ${seconds}s left`,
      isUrgent: true,
      isOverdue: false,
    };
  }
  return {
    label: `${minutes}m ${seconds}s left`,
    isUrgent: true,
    isOverdue: false,
  };
}

