"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  getDailyStudyTime,
  getPomodoroCount,
  getStudyStreak,
  getMostProductiveHours,
  getTaskCompletionStats,
} from "../lib/analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

/* ---------- shared chart styling ---------- */
const darkChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#9CA3AF", // gray-400
        font: { size: 12 },
      },
    },
    tooltip: {
      backgroundColor: "#111827", // gray-900
      titleColor: "#E5E7EB",
      bodyColor: "#D1D5DB",
      borderColor: "#374151",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(255,255,255,0.05)",
      },
      ticks: {
        color: "#9CA3AF",
      },
    },
    y: {
      grid: {
        color: "rgba(255,255,255,0.05)",
      },
      ticks: {
        color: "#9CA3AF",
      },
    },
  },
};

export default function AnalyticsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [daily, setDaily] = useState<Record<string, number>>({});
  const [pomodoros, setPomodoros] = useState(0);
  const [streak, setStreak] = useState(0);
  const [tasks, setTasks] = useState({ created: 0, completed: 0 });
  const [hours, setHours] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);

    setDaily(getDailyStudyTime());
    setPomodoros(getPomodoroCount());
    setStreak(getStudyStreak());
    setTasks(getTaskCompletionStats());
    setHours(getMostProductiveHours());
  }, []);

  if (!mounted) return null;

  const labels = Object.keys(daily);
  const values = Object.values(daily);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <header className="space-y-3">
          <button
            onClick={() => router.push("/study-planner")}
            className="text-sm text-gray-400 hover:text-green-400 transition flex items-center gap-2 w-fit"
          >
            ← Back to Home
          </button>

          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400">
            Analytics
          </h1>

          <p className="text-gray-400">
            Insights into your study habits and productivity
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Stat title="Pomodoro Sessions" value={pomodoros} />
          <Stat title="Study Streak (days)" value={streak} />
          <Stat title="Study Days Logged" value={labels.length} />
          <Stat
            title="Tasks Completed"
            value={`${tasks.completed} / ${tasks.created}`}
          />
        </div>

        {/* Daily Study Time */}
        <Section title="📅 Study Time per Day">
          <div className="h-[320px]">
            <Bar
              options={darkChartOptions}
              data={{
                labels,
                datasets: [
                  {
                    label: "Minutes Studied",
                    data: values,
                    backgroundColor: "rgba(16,185,129,0.7)", // emerald
                    borderRadius: 8,
                    barThickness: 32,
                  },
                ],
              }}
            />
          </div>
        </Section>

        {/* Productive Hours */}
        <Section title="⏰ Most Productive Hours">
          <div className="h-[320px]">
            <Line
              options={darkChartOptions}
              data={{
                labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
                datasets: [
                  {
                    label: "Focus Minutes",
                    data: hours,
                    borderColor: "rgba(34,211,238,0.9)", // cyan
                    backgroundColor: "rgba(34,211,238,0.15)",
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                  },
                ],
              }}
            />
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ---------- UI Components ---------- */

function Stat({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-3xl font-bold text-emerald-400">{value}</p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-6 border border-gray-700/50">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      {children}
    </div>
  );
}
