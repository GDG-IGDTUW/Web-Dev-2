
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  notes?: string;
}

interface StudySession {
  id: string;
  subject: string;
  duration: number;
  date: string;
}

export default function PomodoroTimer() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem('studyTasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setTasks(parsedTasks.filter((task: Task) => !task.completed));
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(focusDuration * 60);
  };

  const completeSession = () => {
    setIsRunning(false);
    

    if (!isBreak) {
      // Focus session completed
      setCompletedPomodoros(prev => prev + 1);
      
      // Save session to localStorage
      if (selectedTask) {
        const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
        const newSession: StudySession = {
          id: Date.now().toString(),
          subject: selectedTask.subject,
          duration: focusDuration,
          date: new Date().toISOString().split('T')[0],
        };
        sessions.push(newSession);
        localStorage.setItem('studySessions', JSON.stringify(sessions));
      }

      setIsBreak(true);
      setTimeLeft(breakDuration * 60);
      
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Focus Session Complete!', {
          body: 'Great work! Time for a break.',
          icon: '☕'
        });
      }
    } else {
      // Break completed
      setIsBreak(false);
      setTimeLeft(focusDuration * 60);
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Break Complete!', {
          body: 'Ready to focus again?',
          icon: '🎯'
        });
      }
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = isBreak ? breakDuration * 60 : focusDuration * 60;
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 mb-2">
                Pomodoro Timer
              </h1>
              <p className="text-gray-400 text-lg">Focus deeply, work efficiently</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/study-planner')}
                className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-xl"
              >
                ← Study Planner
              </button>
              <button
                onClick={() => router.push('/calendar')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-xl"
              >
                Calendar →
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🍅</span>
                <h3 className="text-sm font-semibold text-gray-400">Completed Today</h3>
              </div>
              <p className="text-4xl font-bold text-green-400">{completedPomodoros}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📚</span>
                <h3 className="text-sm font-semibold text-gray-400">Active Tasks</h3>
              </div>
              <p className="text-4xl font-bold text-emerald-400">{tasks.length}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⏱️</span>
                <h3 className="text-sm font-semibold text-gray-400">Focus Time</h3>
              </div>
              <p className="text-4xl font-bold text-cyan-400">{completedPomodoros * focusDuration}m</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
              {/* Timer Display */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-80 h-80 mb-8">
                  <svg className="transform -rotate-90 w-80 h-80">
                    <circle
                      cx="160"
                      cy="160"
                      r="140"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-800"
                    />
                    <circle
                      cx="160"
                      cy="160"
                      r="140"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 140}`}
                      strokeDashoffset={`${2 * Math.PI * 140 * (1 - getProgress() / 100)}`}
                      className={`transition-all duration-1000 ${isBreak ? 'text-cyan-500' : 'text-green-500'}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-7xl font-bold mb-2 ${isBreak ? 'text-cyan-400' : 'text-green-400'}`}>
                      {formatTime(timeLeft)}
                    </div>
                    <div className={`text-xl font-semibold ${isBreak ? 'text-cyan-300' : 'text-green-300'}`}>
                      {isBreak ? '☕ Break Time' : '🎯 Focus Time'}
                    </div>
                    {selectedTask && !isBreak && (
                      <div className="text-sm text-gray-400 mt-2 text-center max-w-xs">
                        Working on: {selectedTask.title}
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4 mb-8">
                  {!isRunning ? (
                    <button
                      onClick={() => {
                        startTimer();
                        requestNotificationPermission();
                      }}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-12 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl text-lg font-semibold"
                    >
                      ▶ Start
                    </button>
                  ) : (
                    <button
                      onClick={pauseTimer}
                      className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-12 py-4 rounded-xl hover:from-yellow-700 hover:to-amber-700 transition-all duration-300 shadow-xl text-lg font-semibold"
                    >
                      ⏸ Pause
                    </button>
                  )}
                  <button
                    onClick={resetTimer}
                    className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-12 py-4 rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-xl text-lg font-semibold"
                  >
                    ↺ Reset
                  </button>
                </div>

                {/* Settings */}
                <div className="w-full max-w-md space-y-4">
                  <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                    <label className="block text-sm font-semibold text-green-400 mb-2">
                      Focus Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={focusDuration}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 25;
                        setFocusDuration(val);
                        if (!isRunning && !isBreak) {
                          setTimeLeft(val * 60);
                        }
                      }}
                      disabled={isRunning}
                      className="w-full px-4 py-2 bg-gray-900/60 border border-gray-700 rounded-lg text-white disabled:opacity-50"
                      min="1"
                      max="60"
                    />
                  </div>
                  <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                    <label className="block text-sm font-semibold text-cyan-400 mb-2">
                      Break Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={breakDuration}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 5;
                        setBreakDuration(val);
                        if (!isRunning && isBreak) {
                          setTimeLeft(val * 60);
                        }
                      }}
                      disabled={isRunning}
                      className="w-full px-4 py-2 bg-gray-900/60 border border-gray-700 rounded-lg text-white disabled:opacity-50"
                      min="1"
                      max="30"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>📝</span>
                Active Tasks
              </h2>
              <p className="text-gray-400 text-sm mb-6">Select a task to focus on</p>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {tasks.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-700/50 rounded-xl">
                    <span className="text-4xl mb-2 block">📚</span>
                    <p className="text-gray-400">No active tasks</p>
                    <button
                      onClick={() => router.push('/study-planner')}
                      className="mt-4 text-green-400 hover:text-green-300 text-sm"
                    >
                      Add tasks in Study Planner →
                    </button>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedTask?.id === task.id
                          ? 'border-green-500 bg-green-900/20'
                          : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      <h3 className="font-semibold text-white mb-1 line-clamp-1">
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-emerald-400">{task.subject}</span>
                        <span className="text-gray-500">•</span>
                        <span className={`px-2 py-0.5 rounded ${
                          task.priority === 'high' ? 'bg-red-900/40 text-red-400' :
                          task.priority === 'medium' ? 'bg-yellow-900/40 text-yellow-400' :
                          'bg-green-900/40 text-green-400'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      {task.notes && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{task.notes}</p>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}