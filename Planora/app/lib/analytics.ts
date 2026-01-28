// lib/analytics.ts

// ---------- utils ----------
const isClient = () => typeof window !== "undefined";

const safeGet = (key: string) => {
  if (!isClient()) return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

// ---------- study sessions ----------
export function getStudySessions() {
  return safeGet("studySessions");
}

export function getPomodoroCount() {
  return getStudySessions().length;
}

// ---------- daily totals ----------
export function getDailyStudyTime() {
  const sessions = getStudySessions();
  const daily: Record<string, number> = {};

  sessions.forEach((s: any) => {
    if (!s.date || !s.duration) return;
    daily[s.date] = (daily[s.date] || 0) + Number(s.duration);
  });

  return daily;
}

// ---------- streak ----------
export function getStudyStreak() {
  const days = Object.keys(getDailyStudyTime())
    .sort()
    .map(d => new Date(d));

  if (days.length === 0) return 0;

  let streak = 1;

  for (let i = days.length - 1; i > 0; i--) {
    const diff =
      (days[i].getTime() - days[i - 1].getTime()) / 86400000;

    if (diff === 1) streak++;
    else break;
  }

  return streak;
}

// ---------- tasks ----------
export function getTaskCompletionStats() {
  if (!isClient()) return { created: 0, completed: 0 };

  return {
    created: Number(localStorage.getItem("tasksCreated") || 0),
    completed: Number(localStorage.getItem("tasksCompleted") || 0),
  };
}

// ---------- productive hours ----------
export function getMostProductiveHours() {
  const sessions = getStudySessions();
  const hours = Array(24).fill(0);

  sessions.forEach((s: any) => {
    if (!s.date || !s.duration) return;
    const hour = new Date(s.date).getHours();
    hours[hour] += Number(s.duration);
  });

  return hours;
}
