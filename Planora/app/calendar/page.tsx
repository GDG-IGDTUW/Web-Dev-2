'use client';

import { useState, useEffect } from 'react';
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

interface TaskUpdate {
  id: string;
  taskId: string;
  date: string;
  notes: string;
  progress: number; // 0-100
  timeSpent: number; // in minutes
}

export default function Calendar() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [taskUpdates, setTaskUpdates] = useState<TaskUpdate[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [newUpdateNote, setNewUpdateNote] = useState('');
  const [newUpdateProgress, setNewUpdateProgress] = useState(0);
  const [newUpdateTimeSpent, setNewUpdateTimeSpent] = useState(30);

  useEffect(() => {
    const savedTasks = localStorage.getItem('studyTasks');
    const savedSessions = localStorage.getItem('studySessions');
    const savedTaskUpdates = localStorage.getItem('taskUpdates');
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    if (savedTaskUpdates) setTaskUpdates(JSON.parse(savedTaskUpdates));
  }, []);

  const saveTaskUpdates = (updates: TaskUpdate[]) => {
    setTaskUpdates(updates);
    localStorage.setItem('taskUpdates', JSON.stringify(updates));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days: Array<{
      day: number;
      month: number;
      year: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      dateString: string;
    }> = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      days.push({
        day,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        isToday: false,
        dateString: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      });
    }

    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today.getDate() && 
                     month === today.getMonth() && 
                     year === today.getFullYear();
      days.push({
        day,
        month,
        year,
        isCurrentMonth: true,
        isToday,
        dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isToday: false,
        dateString: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      });
    }

    return days;
  };

  const getTasksForDate = (dateString: string) => {
    return tasks.filter(task => task.dueDate === dateString);
  };

  const getSessionsForDate = (dateString: string) => {
    return sessions.filter(session => session.date === dateString);
  };

  const getUpdatesForTaskOnDate = (taskId: string, dateString: string) => {
    return taskUpdates.filter(update => 
      update.taskId === taskId && update.date === dateString
    );
  };

  const handleDotClick = (dateString: string, taskId?: string) => {
    if (taskId) {
      setSelectedTaskId(taskId);
    }
    setSelectedDate(dateString);
    setShowModal(true);
  };

  const handleAddUpdate = () => {
    if (!selectedTaskId || !selectedDate || !newUpdateNote.trim()) return;

    const newUpdate: TaskUpdate = {
      id: Date.now().toString(),
      taskId: selectedTaskId,
      date: selectedDate,
      notes: newUpdateNote,
      progress: newUpdateProgress,
      timeSpent: newUpdateTimeSpent
    };

    const updatedTaskUpdates = [...taskUpdates, newUpdate];
    saveTaskUpdates(updatedTaskUpdates);

    // Update task completion if progress is 100%
    if (newUpdateProgress === 100) {
      const updatedTasks = tasks.map(task => 
        task.id === selectedTaskId ? { ...task, completed: true } : task
      );
      setTasks(updatedTasks);
      localStorage.setItem('studyTasks', JSON.stringify(updatedTasks));
    }

    setNewUpdateNote('');
    setNewUpdateProgress(0);
    setNewUpdateTimeSpent(30);
    setSelectedTaskId(null);
  };

  const handleDeleteUpdate = (updateId: string) => {
    const updatedTaskUpdates = taskUpdates.filter(update => update.id !== updateId);
    saveTaskUpdates(updatedTaskUpdates);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTaskDotColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-400 shadow-red-400/50';
      case 'medium': return 'bg-yellow-400 shadow-yellow-400/50';
      case 'low': return 'bg-green-400 shadow-green-400/50';
      default: return 'bg-gray-400';
    }
  };

  const getSelectedTask = () => {
    return tasks.find(task => task.id === selectedTaskId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 mb-2">
                Study Calendar
                </h1>
              <p className="text-gray-400 text-lg">Track your tasks and progress</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/study-planner')}
                className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-xl"
              >
                ← Study Planner
              </button>
              <button
                onClick={() => router.push('/pomodoro')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl"
              >
                Pomodoro Timer →
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📅</span>
                <h3 className="text-sm font-semibold text-gray-400">Total Tasks</h3>
              </div>
              <p className="text-4xl font-bold text-blue-400">{tasks.length}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📝</span>
                <h3 className="text-sm font-semibold text-gray-400">Updates</h3>
              </div>
              <p className="text-4xl font-bold text-cyan-400">{taskUpdates.length}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📊</span>
                <h3 className="text-sm font-semibold text-gray-400">Sessions</h3>
              </div>
              <p className="text-4xl font-bold text-teal-400">{sessions.length}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⏱️</span>
                <h3 className="text-sm font-semibold text-gray-400">Total Hours</h3>
              </div>
              <p className="text-4xl font-bold text-emerald-400">
                {(sessions.reduce((sum, s) => sum + s.duration, 0) / 60).toFixed(1)}h
              </p>
            </div>
          </div>
        </header>

        {/* Calendar */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-gray-700/50 shadow-2xl">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">{monthName}</h2>
            <div className="flex gap-3">
              <button
                onClick={goToToday}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                Today
              </button>
              <button
                onClick={previousMonth}
                className="bg-gray-700 text-white w-10 h-10 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center"
              >
                ←
              </button>
              <button
                onClick={nextMonth}
                className="bg-gray-700 text-white w-10 h-10 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center"
              >
                →
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-400 py-3">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {days.map((dayInfo, index) => {
              const dayTasks = getTasksForDate(dayInfo.dateString);
              const daySessions = getSessionsForDate(dayInfo.dateString);
              const hasEvents = dayTasks.length > 0 || daySessions.length > 0;

              return (
                <div
                  key={index}
                  className={`
                    relative min-h-32 p-2 rounded-xl border-2 transition-all
                    ${dayInfo.isCurrentMonth 
                      ? 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600' 
                      : 'bg-gray-900/30 border-gray-800/30'
                    }
                    ${dayInfo.isToday ? 'ring-2 ring-blue-500 border-blue-500' : ''}
                  `}
                >
                  <div className={`text-sm font-semibold mb-3 ${
                    dayInfo.isToday ? 'text-blue-400' : 
                    dayInfo.isCurrentMonth ? 'text-white' : 'text-gray-600'
                  }`}>
                    {dayInfo.day}
                  </div>

                  {/* Task Dots */}
                  <div className="flex flex-wrap gap-1.5">
                    {dayTasks.map((task, i) => (
                      <button
                        key={i}
                        onClick={() => handleDotClick(dayInfo.dateString, task.id)}
                        className={`w-3 h-3 rounded-full ${getTaskDotColor(task.priority)} 
                          shadow-lg hover:scale-125 transition-all duration-200
                          ${task.completed ? 'opacity-50' : ''}`}
                        title={`${task.title} - ${task.priority} priority`}
                      />
                    ))}
                    {daySessions.length > 0 && (
                      <button
                        onClick={() => handleDotClick(dayInfo.dateString)}
                        className="w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50
                          hover:scale-125 transition-all duration-200"
                        title={`${daySessions.length} study session(s)`}
                      />
                    )}
                  </div>

                  {/* Update Dots (if any) */}
                  {dayTasks.some(task => getUpdatesForTaskOnDate(task.id, dayInfo.dateString).length > 0) && (
                    <div className="absolute bottom-2 right-2">
                      <span className="text-xs text-gray-400">📝</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Legend:</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400 shadow-red-400/50"></div>
                <span className="text-sm text-gray-300">High Priority Task</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-yellow-400/50"></div>
                <span className="text-sm text-gray-300">Medium Priority Task</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400 shadow-green-400/50"></div>
                <span className="text-sm text-gray-300">Low Priority Task</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-cyan-400/50"></div>
                <span className="text-sm text-gray-300">Study Session</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">📝</span>
                <span className="text-sm text-gray-300">Task Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Day/Task Details */}
      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => {
          setShowModal(false);
          setSelectedTaskId(null);
          setNewUpdateNote('');
          setNewUpdateProgress(0);
          setNewUpdateTimeSpent(30);
        }}>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {selectedTaskId ? 'Task Progress' : new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h2>
                <p className="text-gray-400">
                  {selectedTaskId ? 'Add updates and track progress' : 'Tasks and sessions for this day'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedTaskId(null);
                  setNewUpdateNote('');
                  setNewUpdateProgress(0);
                  setNewUpdateTimeSpent(30);
                }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {selectedTaskId ? (
              // Task Update Section
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3">Selected Task</h3>
                  {getSelectedTask() && (
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white flex-1">{getSelectedTask()!.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          getSelectedTask()!.priority === 'high' ? 'bg-red-900/40 text-red-400' :
                          getSelectedTask()!.priority === 'medium' ? 'bg-yellow-900/40 text-yellow-400' :
                          'bg-green-900/40 text-green-400'
                        }`}>
                          {getSelectedTask()!.priority}
                        </span>
                      </div>
                      <p className="text-sm text-emerald-400 mb-2">{getSelectedTask()!.subject}</p>
                      {getSelectedTask()!.notes && (
                        <p className="text-sm text-gray-400">{getSelectedTask()!.notes}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Existing Updates */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">Previous Updates</h3>
                  <div className="space-y-3">
                    {getUpdatesForTaskOnDate(selectedTaskId, selectedDate).length === 0 ? (
                      <p className="text-gray-400 text-sm">No updates yet for this date</p>
                    ) : (
                      getUpdatesForTaskOnDate(selectedTaskId, selectedDate).map(update => (
                        <div key={update.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="text-white">{update.notes}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-sm text-cyan-400">Progress: {update.progress}%</span>
                                <span className="text-sm text-emerald-400">Time: {update.timeSpent}m</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteUpdate(update.id)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Add New Update */}
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-3">Add New Update</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">Update Notes</label>
                      <textarea
                        value={newUpdateNote}
                        onChange={(e) => setNewUpdateNote(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                        rows={3}
                        placeholder="What did you work on? What progress did you make?"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">
                          Progress (%): {newUpdateProgress}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={newUpdateProgress}
                          onChange={(e) => setNewUpdateProgress(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Time Spent (minutes)</label>
                        <select
                          value={newUpdateTimeSpent}
                          onChange={(e) => setNewUpdateTimeSpent(parseInt(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                        >
                          {[15, 30, 45, 60, 90, 120, 150, 180].map(minutes => (
                            <option key={minutes} value={minutes}>{minutes} minutes</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleAddUpdate}
                      disabled={!newUpdateNote.trim()}
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        newUpdateNote.trim() 
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white' 
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Add Progress Update
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Day Overview Section
              <>
                {/* Tasks Section */}
                {getTasksForDate(selectedDate).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                      <span>📝</span>
                      Tasks Due
                    </h3>
                    <div className="space-y-3">
                      {getTasksForDate(selectedDate).map(task => (
                        <button
                          key={task.id}
                          onClick={() => setSelectedTaskId(task.id)}
                          className="w-full text-left bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-emerald-500 transition-all"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-white flex-1">{task.title}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              task.priority === 'high' ? 'bg-red-900/40 text-red-400' :
                              task.priority === 'medium' ? 'bg-yellow-900/40 text-yellow-400' :
                              'bg-green-900/40 text-green-400'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-sm text-emerald-400 mb-2">{task.subject}</p>
                          {task.notes && (
                            <p className="text-sm text-gray-400">{task.notes}</p>
                          )}
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-cyan-400">
                              Click to add progress updates
                            </span>
                            {task.completed && (
                              <span className="text-xs text-green-400">✓ Completed</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sessions Section */}
                {getSessionsForDate(selectedDate).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                      <span>📊</span>
                      Study Sessions
                    </h3>
                    <div className="space-y-3">
                      {getSessionsForDate(selectedDate).map(session => {
                        const hours = Math.floor(session.duration / 60);
                        const minutes = session.duration % 60;
                        return (
                          <div
                            key={session.id}
                            className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-white">{session.subject}</h4>
                              <span className="text-cyan-400 font-semibold">
                                {hours > 0 ? `${hours}h ` : ''}{minutes}m
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {getTasksForDate(selectedDate).length === 0 && getSessionsForDate(selectedDate).length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No tasks or sessions on this day
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}